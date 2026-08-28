class HistoryDetailsState {
  final bool isLoading;
  final String errorMsg;
  final Map<String, dynamic>? sessionData;
  final Map<String, dynamic>? quizData;

  HistoryDetailsState({
    this.isLoading = true,
    this.errorMsg = '',
    this.sessionData,
    this.quizData,
  });

  HistoryDetailsState copyWith({
    bool? isLoading,
    String? errorMsg,
    Map<String, dynamic>? sessionData,
    Map<String, dynamic>? quizData,
  }) {
    return HistoryDetailsState(
      isLoading: isLoading ?? this.isLoading,
      errorMsg: errorMsg ?? this.errorMsg,
      sessionData: sessionData ?? this.sessionData,
      quizData: quizData ?? this.quizData,
    );
  }
}
