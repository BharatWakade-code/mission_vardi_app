import 'package:either_dart/either.dart';
import 'package:edusaas/models/auth_model/auth_response_model.dart';

abstract class AuthRepositoryImpl {
  Future<Either<Exception, AuthResponseModel>> signIn({
    required Map<String, dynamic> body,
  });

  Future<Either<Exception, AuthResponseModel>> signUp({
    required Map<String, dynamic> body,
  });

  /// Sends Google-verified user data to the backend for profile creation/sync.
  Future<Either<Exception, AuthResponseModel>> googleSignIn({
    required Map<String, dynamic> body,
  });

  /// Sends a forgot-password reset email.
  Future<Either<Exception, AuthResponseModel>> forgotPassword({
    required Map<String, dynamic> body,
  });
}
