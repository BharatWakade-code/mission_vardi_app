import 'package:dio/dio.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_file_dialog/flutter_file_dialog.dart';
import 'package:injectable/injectable.dart';
import 'package:path_provider/path_provider.dart';

import 'pdf_viewer_state.dart';

@injectable
class PdfViewerCubit extends Cubit<PdfViewerState> {
  PdfViewerCubit() : super(PdfViewerState());

  void clearError() {
    emit(state.copyWith(errorMessage: null));
  }

  Future<void> downloadPdfToDevice(String url, String originalFileName) async {
    emit(state.copyWith(isDownloading: true));

    try {
      final directory = await getTemporaryDirectory();
      final fileName = originalFileName.replaceAll(RegExp(r'[^\w\s.-]'), '_');
      final sourcePath = "${directory.path}/temp_$fileName.pdf";
      
      final dio = Dio();
      await dio.download(url, sourcePath);

      final params = SaveFileDialogParams(
        sourceFilePath: sourcePath,
        fileName: "$fileName.pdf",
      );
      
      final savedFilePath = await FlutterFileDialog.saveFile(params: params);

      if (savedFilePath != null) {
        emit(state.copyWith(isDownloading: false, errorMessage: "Saved successfully to your device!"));
      } else {
        emit(state.copyWith(isDownloading: false));
      }
    } catch (e) {
      emit(state.copyWith(isDownloading: false, errorMessage: "Download failed: $e"));
    }
  }
}