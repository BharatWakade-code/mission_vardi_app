import 'package:flutter/material.dart';
import 'package:permission_handler/permission_handler.dart';

Future<bool> requestCameraAndLocationPermission() async {
  final locationStatus = await Permission.locationWhenInUse.request();
  debugPrint('Location: $locationStatus');
  if (locationStatus.isGranted) {
    return true;
  }

  if (locationStatus.isPermanentlyDenied) {
    await openAppSettings();
  }

  return false;
}
