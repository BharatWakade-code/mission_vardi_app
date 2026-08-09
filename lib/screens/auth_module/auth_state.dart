import 'package:edusaas/models/auth_model/auth_response_model.dart';

class AuthState {
  final bool isLoading;
  final bool isSuccess;
  final String errorMsg;
  final String successMsg;
  final AuthData? user;

  AuthState({
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMsg = '',
    this.successMsg = '',
    this.user,
  });

  AuthState copyWith({
    bool? isLoading,
    bool? isSuccess,
    String? errorMsg,
    String? successMsg,
    AuthData? user,
  }) {
    return AuthState(
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMsg: errorMsg ?? this.errorMsg,
      successMsg: successMsg ?? this.successMsg,
      user: user ?? this.user,
    );
  }
}
