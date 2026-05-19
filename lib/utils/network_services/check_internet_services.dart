import 'dart:async';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';

class CheckInternetService {
  static final Connectivity _connectivity = Connectivity();

  static StreamSubscription<List<ConnectivityResult>>? _toastSubscription;
  static StreamSubscription<List<ConnectivityResult>>? _reloadSubscription;

  static bool _isOffline = false;
  static final ValueNotifier<bool> connectionStatusNotifier = ValueNotifier<bool>(false);

  static bool get isOffline => _isOffline;

  /// TOAST LISTENER
  static void startListening() {
    _toastSubscription = _connectivity.onConnectivityChanged.listen((result) {
      /// INTERNET LOST
      if (result.contains(ConnectivityResult.none)) {
        if (!_isOffline) {
          _isOffline = true;
          connectionStatusNotifier.value = true;
        }
      }

      /// INTERNET RESTORED
      else {
        if (_isOffline) {
          _isOffline = false;
          connectionStatusNotifier.value = false;
        }
      }
    });
  }

  /// API RELOAD LISTENER
  static void listenInternet(Future<void> Function() reload) {
    _reloadSubscription?.cancel();

    _reloadSubscription =
        _connectivity.onConnectivityChanged.listen((result) async {
          if (!result.contains(ConnectivityResult.none)) {
            await reload();
          }
        });
  }

  static void dispose() {
    _toastSubscription?.cancel();
    _reloadSubscription?.cancel();
  }

  static Future<bool> hasInternet() async {
    final result = await _connectivity.checkConnectivity();

    return !result.contains(ConnectivityResult.none);
  }
}
