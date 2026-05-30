import 'dart:convert';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

// ── Background message handler (must be top-level) ──────────────────────────
@pragma('vm:entry-point')
Future<void> firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  debugPrint('[FCM] Background message: ${message.messageId}');
}

// ── Notification channel for Android ────────────────────────────────────────
const AndroidNotificationChannel _channel = AndroidNotificationChannel(
  'mission_vardi_high_importance',
  'Mission Vardi Alerts',
  description: 'Important alerts from Mission Vardi',
  importance: Importance.max,
  playSound: true,
  enableVibration: true,
);

class PushNotificationService {
  PushNotificationService._();
  static final PushNotificationService instance = PushNotificationService._();

  final FirebaseMessaging _fcm = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  // ── Initialize ─────────────────────────────────────────────────────────────
  Future<void> initialize() async {
    // 1. Request permission (required on iOS + Android 13+)
    final settings = await _fcm.requestPermission(
      alert: true,
      badge: true,
      sound: true,
      announcement: false,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
    );
    debugPrint('[FCM] Permission: ${settings.authorizationStatus}');

    // 2. Set up local notifications plugin for foreground display
    const androidInit = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosInit = DarwinInitializationSettings();
    await _localNotifications.initialize(
      const InitializationSettings(android: androidInit, iOS: iosInit),
      onDidReceiveNotificationResponse: _onNotificationTap,
    );

    // 3. Create the Android notification channel
    await _localNotifications
        .resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>()
        ?.createNotificationChannel(_channel);

    // 4. Show notifications while app is in foreground
    FirebaseMessaging.onMessage.listen(_onForegroundMessage);

    // 5. Handle notification tap when app is in background (not terminated)
    FirebaseMessaging.onMessageOpenedApp.listen(_onMessageOpenedApp);

    // 6. Register background handler
    FirebaseMessaging.onBackgroundMessage(firebaseMessagingBackgroundHandler);

    // 7. Get & print the FCM token
    await _logToken();

    // 8. Refresh token when it changes
    _fcm.onTokenRefresh.listen((newToken) {
      debugPrint('[FCM] Token refreshed: $newToken');
      // TODO: Send newToken to your backend here
    });
  }

  // ── Foreground message → show local notification ───────────────────────────
  void _onForegroundMessage(RemoteMessage message) {
    debugPrint('[FCM] Foreground message: ${message.notification?.title}');
    final notification = message.notification;
    final android = message.notification?.android;
    if (notification != null) {
      _localNotifications.show(
        notification.hashCode,
        notification.title,
        notification.body,
        NotificationDetails(
          android: AndroidNotificationDetails(
            _channel.id,
            _channel.name,
            channelDescription: _channel.description,
            importance: Importance.max,
            priority: Priority.high,
            icon: android?.smallIcon ?? '@mipmap/ic_launcher',
          ),
          iOS: const DarwinNotificationDetails(
            presentAlert: true,
            presentBadge: true,
            presentSound: true,
          ),
        ),
        payload: jsonEncode(message.data),
      );
    }
  }

  // ── Notification tap handler ────────────────────────────────────────────────
  void _onNotificationTap(NotificationResponse response) {
    debugPrint('[FCM] Notification tapped. Payload: ${response.payload}');
  }

  void _onMessageOpenedApp(RemoteMessage message) {
    debugPrint('[FCM] App opened from notification: ${message.notification?.title}');
  }

  // ── Token logging ───────────────────────────────────────────────────────────
  Future<void> _logToken() async {
    final token = await _fcm.getToken();
    debugPrint('[FCM] Device token:\n$token');
  }

  /// Call this to get the current FCM token (e.g. to send to your backend)
  Future<String?> getToken() => _fcm.getToken();
}
