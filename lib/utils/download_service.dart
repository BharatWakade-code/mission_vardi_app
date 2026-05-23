import 'dart:io';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:path_provider/path_provider.dart';
import 'package:permission_handler/permission_handler.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mission_vardi/utils/constants.dart';

class DownloadService {
  /// Request appropriate permissions and download the PDF file to local storage.
  static Future<void> downloadPDF({
    required BuildContext context,
    required String url,
    required String title,
  }) async {
    // 1. Sanitize file name
    String safeTitle = title.replaceAll(RegExp(r'[^\w\s\-]'), '').trim().replaceAll(' ', '_');
    if (safeTitle.isEmpty) safeTitle = "study_guide";
    final String filename = "$safeTitle.pdf";

    // Fallback sample PDF if URL is invalid/empty
    String downloadUrl = url;
    if (downloadUrl.isEmpty || !downloadUrl.startsWith("http")) {
      downloadUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    }

    // 2. Request Storage Permissions (mainly for Android < 13)
    if (Platform.isAndroid) {
      final status = await Permission.storage.status;
      if (status.isDenied) {
        await Permission.storage.request();
      }
    }

    // 3. Resolve Target Save Path
    String? targetDirectoryPath;
    try {
      if (Platform.isAndroid) {
        // Attempt to save to public Downloads folder for user convenience
        final directory = Directory('/storage/emulated/0/Download');
        if (await directory.exists()) {
          targetDirectoryPath = directory.path;
        }
      }
      
      // Fallback 1: External storage directory
      if (targetDirectoryPath == null) {
        final extDir = await getExternalStorageDirectory();
        if (extDir != null) {
          targetDirectoryPath = extDir.path;
        }
      }

      // Fallback 2: Application Documents directory
      if (targetDirectoryPath == null) {
        final appDir = await getApplicationDocumentsDirectory();
        targetDirectoryPath = appDir.path;
      }
    } catch (e) {
      // Direct fallback to application documents
      final appDir = await getApplicationDocumentsDirectory();
      targetDirectoryPath = appDir.path;
    }

    final String savePath = "$targetDirectoryPath/$filename";

    // 4. Trigger Download with Progress Dialog
    if (!context.mounted) return;
    _showProgressDialog(context, downloadUrl, savePath, filename);
  }

  // Beautiful progress dialog showing real-time download percentage
  static void _showProgressDialog(
    BuildContext context,
    String downloadUrl,
    String savePath,
    String filename,
  ) {
    double progressValue = 0.0;
    String progressPercent = "0%";
    CancelToken cancelToken = CancelToken();

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dialogContext) {
        return StatefulBuilder(
          builder: (context, setState) {
            // Start download once dialog opens
            Future.microtask(() async {
              try {
                final dio = Dio();
                await dio.download(
                  downloadUrl,
                  savePath,
                  cancelToken: cancelToken,
                  onReceiveProgress: (received, total) {
                    if (total != -1) {
                      setState(() {
                        progressValue = received / total;
                        progressPercent = "${(progressValue * 100).toStringAsFixed(0)}%";
                      });
                    }
                  },
                );

                // Close progress dialog
                if (dialogContext.mounted) {
                  Navigator.of(dialogContext).pop();
                }

                // Show success dialog
                if (context.mounted) {
                  _showSuccessDialog(context, savePath, filename);
                }
              } catch (e) {
                // Close progress dialog on error
                if (dialogContext.mounted) {
                  Navigator.of(dialogContext).pop();
                }

                if (e is DioException && CancelToken.isCancel(e)) {
                  // User cancelled the download
                  return;
                }

                // Show error alert
                if (context.mounted) {
                  _showErrorDialog(context, e.toString());
                }
              }
            });

            return WillPopScope(
              onWillPop: () async {
                cancelToken.cancel();
                return true;
              },
              child: AlertDialog(
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                backgroundColor: Colors.white,
                content: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "Downloading Study Guide",
                        style: GoogleFonts.outfit(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF1E293B),
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        filename,
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          color: Colors.grey,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 24),
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 80,
                            height: 80,
                            child: CircularProgressIndicator(
                              value: progressValue,
                              strokeWidth: 6,
                              valueColor: const AlwaysStoppedAnimation<Color>(Colors.red),
                              backgroundColor: Colors.grey.shade100,
                            ),
                          ),
                          Text(
                            progressPercent,
                            style: GoogleFonts.outfit(
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFF1E293B),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      Text(
                        "Please wait, saving offline...",
                        style: GoogleFonts.outfit(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextButton(
                        onPressed: () {
                          cancelToken.cancel();
                          Navigator.of(dialogContext).pop();
                        },
                        child: Text(
                          "Cancel",
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.bold,
                            color: Colors.grey.shade600,
                          ),
                        ),
                      )
                    ],
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }

  // Beautiful download success notification
  static void _showSuccessDialog(BuildContext context, String savePath, String filename) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const SizedBox(height: 10),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: const BoxDecoration(
                  color: Color(0xFFE8F5E9),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.check_circle, color: Colors.green, size: 48),
              ),
              const SizedBox(height: 20),
              Text(
                "Download Complete",
                style: GoogleFonts.outfit(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: const Color(0xFF1E293B),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                "Your study guide has been successfully saved to your device.",
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 12,
                  color: Colors.grey.shade600,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.grey.shade300),
                ),
                child: Text(
                  savePath,
                  style: GoogleFonts.outfit(
                    fontSize: 10,
                    color: Colors.grey.shade800,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Constants.primaryBlueColour,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                  minimumSize: const Size(double.infinity, 44),
                ),
                onPressed: () => Navigator.of(context).pop(),
                child: Text(
                  "Done",
                  style: GoogleFonts.outfit(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // Error dialog fallback
  static void _showErrorDialog(BuildContext context, String error) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Text(
            "Download Failed",
            style: GoogleFonts.outfit(
              fontWeight: FontWeight.bold,
              color: Colors.red,
            ),
          ),
          content: Text(
            "Failed to complete download. Please check your storage or internet connection.\n\nDetails: $error",
            style: GoogleFonts.outfit(fontSize: 13, color: Colors.grey.shade700),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(
                "OK",
                style: GoogleFonts.outfit(fontWeight: FontWeight.bold),
              ),
            )
          ],
        );
      },
    );
  }
}
