import 'dart:io';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_file_dialog/flutter_file_dialog.dart';
import 'package:path_provider/path_provider.dart';

class DownloadService {
  static Future<void> downloadPDF({
    required BuildContext context,
    required String url,
    required String title,
  }) async {
    try {
      ScaffoldMessenger.of(context).showSnackBar(
         SnackBar(
          content: Text('downloading_pdf'.tr()),
        ),
      );

      // Temporary storage
      final tempDir = await getTemporaryDirectory();

      // Safe file name
      String fileName = title
          .replaceAll(RegExp(r'[^\w\s]+'), '')
          .replaceAll(' ', '_');

      if (!fileName.endsWith(".pdf")) {
        fileName = "$fileName.pdf";
      }

      final tempPath = "${tempDir.path}/$fileName";

      final dio = Dio(
        BaseOptions(
          connectTimeout: const Duration(seconds: 20),
          receiveTimeout: const Duration(seconds: 20),
        ),
      );

      // Download file
      await dio.download(
        url,
        tempPath,
        deleteOnError: true,
      );

      final file = File(tempPath);

      // Validate
      if (!await file.exists()) {
        throw Exception("File not found");
      }

      final size = await file.length();

      if (size < 1000) {
        await file.delete();
        throw Exception("Corrupted PDF");
      }

      // Save to Downloads folder
      final params = SaveFileDialogParams(
        sourceFilePath: tempPath,
        fileName: fileName,
      );

      final savedPath =
          await FlutterFileDialog.saveFile(params: params);

      if (savedPath == null) {
        throw Exception("Save cancelled");
      }

      if (!context.mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            "$fileName saved to Downloads",
          ),
        ),
      );
    } catch (e) {
      debugPrint("DOWNLOAD ERROR => $e");

      if (!context.mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'download_failed'.tr(),
          ),
        ),
      );
    }
  }
}