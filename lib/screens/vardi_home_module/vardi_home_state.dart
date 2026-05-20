part of 'vardi_home_cubit.dart';

@immutable
class VardiHomeState {
  final bool isLoading;
  final bool isSuccess;
  final String errorMsg;
  final String successMsg;
  List<PdfNoteModel>? data;

   VardiHomeState({
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMsg = '',
    this.successMsg = '',
    this.data,
  });

  VardiHomeState copyWith({
    bool? isLoading,
    bool? isSuccess,
    String? errorMsg,
    String? successMsg,
    dynamic data,
  }) {
    return VardiHomeState(
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMsg: errorMsg ?? this.errorMsg,
      successMsg: successMsg ?? this.successMsg,
      data: data ?? this.data,
    );
  }
}
