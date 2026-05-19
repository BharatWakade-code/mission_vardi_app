import 'dart:async';
import 'package:flutter/material.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/go_router_service.dart';

// Pure Flutter Custom FToast implementation to remove fluttertoast dependency
// and solve native web platform initialization crashes.
class FToast {
  static OverlayEntry? _entry;
  static Timer? _timer;

  void init(BuildContext context) {
    // Kept for seamless backwards compatibility
  }

  void showToast({
    required Widget child,
    required Duration toastDuration,
    required ToastGravity gravity,
  }) {
    final context = navigatorKey.currentContext;
    if (context == null) return;

    final overlay = Overlay.of(context);

    _timer?.cancel();
    if (_entry != null) {
      try {
        _entry!.remove();
      } catch (_) {}
      _entry = null;
    }

    _entry = OverlayEntry(
      builder: (context) => IgnorePointer(
        ignoring: true,
        child: SafeArea(
          child: Align(
            alignment: gravity == ToastGravity.BOTTOM
                ? Alignment.bottomCenter
                : (gravity == ToastGravity.CENTER ? Alignment.center : Alignment.topCenter),
            child: Material(
              color: Colors.transparent,
              child: Padding(
                padding: const EdgeInsets.only(top: 40, bottom: 40),
                child: child,
              ),
            ),
          ),
        ),
      ),
    );

    overlay.insert(_entry!);

    if (toastDuration.inDays < 1) { // not permanent
      _timer = Timer(toastDuration, () {
        if (_entry != null) {
          try {
            _entry!.remove();
          } catch (_) {}
          _entry = null;
        }
      });
    }
  }

  void removeCustomToast() {
    _timer?.cancel();
    if (_entry != null) {
      try {
        _entry!.remove();
      } catch (_) {}
      _entry = null;
    }
  }
}

enum ToastGravity { TOP, CENTER, BOTTOM }

class CommonToastMessages {
  static final FToast _fToast = FToast();
  static Timer? _debounceTimer;

  static void showToast(
      BuildContext context,
      String message, {
        required IconData icon,
        required Color accentColor,
        Duration debounceDuration = const Duration(milliseconds: 800),
      }) {
    final overlay = Overlay.of(context);

    if (overlay == null) return; 

    _debounceTimer?.cancel();

    _debounceTimer = Timer(debounceDuration, () {
      if (!context.mounted) return;

      _fToast.init(overlay.context);

      _fToast.showToast(
        gravity: ToastGravity.TOP,
        toastDuration: const Duration(seconds: 2),
        child: _buildToast(message, icon, accentColor),
      );
    });
  }

  static Widget _buildToast(
      String message,
      IconData icon,
      Color accentColor,
      ) {
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: accentColor.withOpacity(0.25),
              blurRadius: 18,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            Icon(icon, color: accentColor),
            const SizedBox(width: 10),
            Expanded(child: Text(message)),
          ],
        ),
      ),
    );
  }
}

class GlobalToast {
  static final FToast _fToast = FToast();
  static Timer? _debounceTimer;

  static void show(
      String message, {
        required IconData icon,
        required Color accentColor,
        ToastGravity gravity = ToastGravity.TOP,
        Duration duration = const Duration(seconds: 3),
        Duration debounceDuration = const Duration(milliseconds: 800),
      }) {
    final navigator = navigatorKey.currentState;
    if (navigator == null) return;

    final overlay = navigator.overlay;
    if (overlay == null) return; 

    _debounceTimer?.cancel();

    _debounceTimer = Timer(debounceDuration, () {
      _fToast.init(overlay.context); 

      _fToast.showToast(
        gravity: gravity,
        toastDuration: duration,
        child: _buildToast(message, icon, accentColor),
      );
    });
  }

  static void showPermanent(
      String message, {
        required IconData icon,
        required Color accentColor,
        ToastGravity gravity = ToastGravity.TOP,
      }) {
    final navigator = navigatorKey.currentState;
    if (navigator == null) return;

    final overlay = navigator.overlay;
    if (overlay == null) return; 

    _fToast.init(overlay.context); 

    _fToast.showToast(
      gravity: gravity,
      toastDuration: const Duration(days: 1),
      child: _buildToast(message, icon, accentColor),
    );
  }

  static void remove() {
    try {
      _fToast.removeCustomToast();
    } catch (_) {}
  }

  static Widget _buildToast(
      String message,
      IconData icon,
      Color accentColor,
      ) {
    return Align(
      alignment: Alignment.topCenter,
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 16),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: [
            BoxShadow(
              color: accentColor.withOpacity(0.25),
              blurRadius: 18,
              offset: const Offset(0, 8),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: accentColor.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: accentColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                message,
                style: commonTextStyle.copyWith(
                  fontSize: 14,
                  color: Constants.blackDarkColour,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}