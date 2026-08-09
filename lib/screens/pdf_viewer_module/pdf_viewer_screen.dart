import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

import 'package:edusaas/utils/constants.dart';

import 'package:edusaas/screens/localization_module/change_language_bottom_sheet.dart';

class PdfViewerScreen extends StatefulWidget {
  final String pdfUrl;
  final String title;
  final String description;

  const PdfViewerScreen({
    super.key,
    required this.pdfUrl,
    required this.title,
    required this.description,
  });

  @override
  State<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends State<PdfViewerScreen> {
  final PdfViewerController _pdfViewerController = PdfViewerController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
          backgroundColor: Colors.white,
          appBar: AppBar(
            elevation: 0,
            backgroundColor: Constants.primaryBlueColour,
            iconTheme: const IconThemeData(color: Colors.white),
            title: Text(
              widget.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: commonTextStyle.copyWith(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
            ),
            actions: [
              IconButton(
                icon: const Icon(Icons.language_rounded, color: Colors.white, size: 24),
                onPressed: () {
                  ChangeLanguageBottomSheet.show(context);
                },
              ),
            ],
          ),
          body: Column(
            children: [
              if (widget.description.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  width: double.infinity,
                  color: Colors.grey.shade100,
                  child: Text(
                    widget.description,
                    style: commonTextStyle.copyWith(fontSize: 14, color: Colors.grey.shade800),
                  ),
                ),
              Expanded(
                child: SfPdfViewer.network(
                  widget.pdfUrl,
                  controller: _pdfViewerController,
                  canShowScrollHead: false,
                  canShowScrollStatus: true,
                ),
              ),
            ],
          ),
        );
  }
}