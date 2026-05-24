import 'dart:developer';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/screens/auth_module/auth_service.dart';
import 'package:mission_vardi/screens/auth_module/auth_state.dart';
import 'package:mission_vardi/screens/auth_module/data/auth_repository.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

@injectable
class AuthCubit extends Cubit<AuthState> {
  final AuthRepository _repository;

  AuthCubit(this._repository) : super(AuthState());

  /// Sign In
  Future<void> signIn({
    required String email,
    required String password,
  }) async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
      isSuccess: false,
    ));

    final either = await _repository.signIn(body: {
      'email': email,
      'password': password,
    });

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: error.toString(),
          isSuccess: false,
        ));
      },
      (response) {
        _handleAuthResponse(response);
      },
    );
  }

  /// Sign Up
  Future<void> signUp({
    required String firstName,
    required String lastName,
    required String email,
    String phone = '',
    required String password,
  }) async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
      isSuccess: false,
    ));

    final fullName = '$firstName $lastName'.trim();
    final either = await _repository.signUp(body: {
      'name': fullName,
      'first_name': firstName,
      'last_name': lastName,
      'email': email,
      if (phone.isNotEmpty) 'phone': phone,
      'password': password,
    });

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: error.toString(),
          isSuccess: false,
        ));
      },
      (response) {
        _handleAuthResponse(response);
      },
    );
  }

  /// Common response handler for both signIn & signUp
  void _handleAuthResponse(dynamic response) {
    if (response.status == true) {
      // AuthData has: accessToken (String?) and user (User?)
      // User has: id, name, email
      if (response.data?.accessToken != null) {
        CommonHiveData.setString('token', response.data!.accessToken!);
      }
      if (response.data?.user?.name != null) {
        CommonHiveData.setString('userName', response.data!.user!.name!);
      }
      if (response.data?.user?.email != null) {
        CommonHiveData.setString('userEmail', response.data!.user!.email!);
      }
      if (response.data?.user?.id != null) {
        CommonHiveData.setString('userId', response.data!.user!.id!);
      }

      emit(state.copyWith(
        isLoading: false,
        isSuccess: true,
        successMsg: response.message ?? 'Success',
        user: response.data,
        errorMsg: '',
      ));
    } else {
      emit(state.copyWith(
        isLoading: false,
        isSuccess: false,
        errorMsg: response.message ?? 'Something went wrong',
      ));
    }
  }

  /// Google Sign-In → Firebase → Backend sync → Hive storage
  Future<void> signInWithGoogle() async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
      isSuccess: false,
    ));

    try {
      // Step 1: Sign in with Google via Firebase
      final userCredential = await AuthService.signInWithGoogle();

      if (userCredential == null) {
        // User cancelled the sign-in dialog
        emit(state.copyWith(isLoading: false));
        return;
      }

      final firebaseUser = userCredential.user;

      // Step 2: Get Firebase ID token to prove identity to backend
      final firebaseToken = await firebaseUser?.getIdToken(true); // force refresh

      log('[AuthCubit] Google user: ${firebaseUser?.email}, uid: ${firebaseUser?.uid}');
      log('[AuthCubit] Firebase ID token length: ${firebaseToken?.length}');

      // Step 3: POST Google user data to backend for profile creation/sync
      final either = await _repository.googleSignIn(body: {
        'name': firebaseUser?.displayName ?? '',
        'email': firebaseUser?.email ?? '',
        'google_id': firebaseUser?.uid ?? '',
        'avatar_url': firebaseUser?.photoURL ?? '',
        'id_token': firebaseToken ?? '',
        'auth_provider': 'google',
        'is_verified': true,
      });

      either.fold(
        (error) {
          final msg = error.toString().replaceFirst('Exception: ', '');
          log('[AuthCubit] googleSignIn backend error: $msg');
          emit(state.copyWith(
            isLoading: false,
            isSuccess: false,
            errorMsg: msg.isNotEmpty ? msg : 'Google Sign-In failed. Please try again.',
          ));
        },
        (response) {
          log('[AuthCubit] googleSignIn backend success: ${response.message}');
          // Step 4: Persist backend JWT + full profile to Hive (same as email login)
          _handleAuthResponse(response);
        },
      );
    } catch (e) {
      log('[AuthCubit] signInWithGoogle exception: $e');
      emit(state.copyWith(
        isLoading: false,
        isSuccess: false,
        errorMsg: 'Google Sign-In failed: $e',
      ));
    }
  }

  /// Clear errors (e.g. when user starts typing)
  void clearError() {
    emit(state.copyWith(errorMsg: '', successMsg: ''));
  }

  /// Forgot Password — sends a reset email
  Future<void> forgotPassword({required String email}) async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
      isSuccess: false,
    ));

    final either =
        await _repository.forgotPassword(body: {'email': email});

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: 'Failed to send reset email. Please try again.',
          isSuccess: false,
        ));
      },
      (response) {
        if (response.status == true) {
          emit(state.copyWith(
            isLoading: false,
            isSuccess: false, // stay on same screen
            successMsg:
                response.message ?? 'Password reset email sent! Check your inbox.',
            errorMsg: '',
          ));
        } else {
          emit(state.copyWith(
            isLoading: false,
            errorMsg:
                response.message ?? 'No account found with this email.',
            isSuccess: false,
          ));
        }
      },
    );
  }

  /// Sign Out
  Future<void> signOut() async {
    await CommonHiveData.clearAll();
    emit(AuthState());
  }
}
