import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:syncfusion_flutter_pdfviewer/pdfviewer.dart';

import 'package:mission_vardi/utils/constants.dart';
import 'pdf_viewer_cubit.dart';
import 'pdf_viewer_state.dart';
import 'package:mission_vardi/screens/localization_module/change_language_bottom_sheet.dart';

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
    return BlocConsumer<PdfViewerCubit, PdfViewerState>(
      listener: (context, state) {
        if (state.errorMessage != null && state.errorMessage!.contains("successfully")) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.errorMessage!), backgroundColor: Colors.green),
          );
          context.read<PdfViewerCubit>().clearError();
        } else if (state.errorMessage != null) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(state.errorMessage!), backgroundColor: Colors.red),
          );
          context.read<PdfViewerCubit>().clearError();
        }
      },
      builder: (context, state) {
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
              state.isDownloading
                  ? const Padding(
                      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                      child: SizedBox(
                        width: 20,
                        height: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      ),
                    )
                  : IconButton(
                      icon: const Icon(Icons.download_rounded),
                      onPressed: () {
                        context.read<PdfViewerCubit>().downloadPdfToDevice(
                          widget.pdfUrl,
                          widget.title,
                        );
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
      },
    );
  }
}