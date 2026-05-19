import 'package:permission_handler/permission_handler.dart';

void checkPermissions() async {
  final permission = Permission.camera;
  var status = await permission.status;

  if (status.isGranted) {
    return;
  }

  // Request permission
  status = await permission.request();
}
