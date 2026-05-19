part of 'vardi_home_cubit.dart';

@immutable
class VardiHomeState {
  final bool isLoading;
  final String? error;

  const VardiHomeState({
    this.isLoading = false,
    this.error,
  });

  VardiHomeState copyWith({
    bool? isLoading,
    String? error,
  }) {
    return VardiHomeState(
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}