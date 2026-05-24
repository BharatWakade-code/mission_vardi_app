import 'dart:developer';
import 'package:dio/dio.dart';
import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/auth_model/auth_response_model.dart';
import 'package:mission_vardi/screens/auth_module/repository/auth_repository_impl.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

@injectable
class AuthRepository implements AuthRepositoryImpl {
  /// Extracts a human-readable error message from a DioException or any other
  /// error, preferring the backend's own `message` / `detail` field.
  String _extractError(Object e) {
    if (e is DioException) {
      final data = e.response?.data;
      if (data is Map) {
        final msg = data['message'] ?? data['detail'] ?? data['error'];
        if (msg != null) return msg.toString();
      }
      if (data is String && data.isNotEmpty) return data;
      return e.message ?? 'Network error. Please try again.';
    }
    return e.toString();
  }

  @override
  Future<Either<Exception, AuthResponseModel>> signIn({
    required Map<String, dynamic> body,
  }) async {
    try {
      final response = await NetworkServices().postApi(ApiUrls.signIn, body);
      final responseData = AuthResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      log('[AuthRepository.signIn] error: $e');
      return Left(Exception(_extractError(e)));
    }
  }

  @override
  Future<Either<Exception, AuthResponseModel>> signUp({
    required Map<String, dynamic> body,
  }) async {
    try {
      final response = await NetworkServices().postApi(ApiUrls.signUp, body);
      final responseData = AuthResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      log('[AuthRepository.signUp] error: $e');
      return Left(Exception(_extractError(e)));
    }
  }

  /// Syncs Google-verified user to the backend.
  /// Backend receives: name, email, google_id, avatar_url, firebase_token.
  /// Backend returns: access_token + full user profile (same AuthResponseModel).
  @override
  Future<Either<Exception, AuthResponseModel>> googleSignIn({
    required Map<String, dynamic> body,
  }) async {
    try {
      final response =
          await NetworkServices().postApi(ApiUrls.googleAuth, body);
      final responseData = AuthResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      log('[AuthRepository.googleSignIn] error: $e');
      return Left(Exception(_extractError(e)));
    }
  }

  /// Sends a password reset email via the backend.
  @override
  Future<Either<Exception, AuthResponseModel>> forgotPassword({
    required Map<String, dynamic> body,
  }) async {
    try {
      final response =
          await NetworkServices().postApi(ApiUrls.forgotPassword, body);
      final responseData = AuthResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      log('[AuthRepository.forgotPassword] error: $e');
      return Left(Exception(_extractError(e)));
    }
  }
}

