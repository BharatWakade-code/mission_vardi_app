class AdminState {
  final bool isLoading;
  final String message;
  final bool isSuccess;

  // Generic data holding lists for current active tab
  final List<dynamic> items;

  AdminState({
    this.isLoading = false,
    this.message = '',
    this.isSuccess = false,
    this.items = const [],
  });

  AdminState copyWith({
    bool? isLoading,
    String? message,
    bool? isSuccess,
    List<dynamic>? items,
  }) {
    return AdminState(
      isLoading: isLoading ?? this.isLoading,
      message: message ?? this.message,
      isSuccess: isSuccess ?? this.isSuccess,
      items: items ?? this.items,
    );
  }
}
