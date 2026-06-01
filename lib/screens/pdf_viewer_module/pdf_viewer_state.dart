class PdfViewerState {
  final String? errorMessage;
  final bool isDownloading;

  PdfViewerState({
    this.errorMessage,
    this.isDownloading = false,
  });

  PdfViewerState copyWith({
    String? errorMessage,
    bool? isDownloading,
  }) {
    return PdfViewerState(
      errorMessage: errorMessage ?? this.errorMessage,
      isDownloading: isDownloading ?? this.isDownloading,
    );
  }
}