class ActivityHistoryState {
  final bool isLoading;
  final bool isPaginationLoading;
  final String errorMsg;
  final List<dynamic> sessions;
  final int page;
  final bool hasReachedMax;

  ActivityHistoryState({
    this.isLoading = true,
    this.isPaginationLoading = false,
    this.errorMsg = '',
    this.sessions = const [],
    this.page = 1,
    this.hasReachedMax = false,
  });

  ActivityHistoryState copyWith({
    bool? isLoading,
    bool? isPaginationLoading,
    String? errorMsg,
    List<dynamic>? sessions,
    int? page,
    bool? hasReachedMax,
  }) {
    return ActivityHistoryState(
      isLoading: isLoading ?? this.isLoading,
      isPaginationLoading: isPaginationLoading ?? this.isPaginationLoading,
      errorMsg: errorMsg ?? this.errorMsg,
      sessions: sessions ?? this.sessions,
      page: page ?? this.page,
      hasReachedMax: hasReachedMax ?? this.hasReachedMax,
    );
  }
}
