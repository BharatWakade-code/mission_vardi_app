import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/profile_model/profile_response_model.dart';
import 'package:mission_vardi/screens/profile_module/data/profile_repository.dart';
import 'package:mission_vardi/screens/profile_module/profile_state.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

@injectable
class ProfileCubit extends Cubit<ProfileState> {
  final ProfileRepository _repository;

  ProfileCubit(this._repository) : super(ProfileState());
  String get userID => CommonHiveData.getString('userId');
  Future<void> getDistricts() async {
    final either = await _repository.getDistricts();
    either.fold(
      (error) => null, // Just fail silently for dropdowns, or log
      (districts) {
        emit(state.copyWith(districts: districts));
      },
    );
  }

  Future<void> getProfile() async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
    ));

    // Fetch districts alongside profile
    if (state.districts.isEmpty) {
      await getDistricts();
    }

    final either = await _repository.getProfile(userID:userID);

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: error.toString(),
        ));
      },
      (response) {
        if (response.status == true) {
          emit(state.copyWith(
            isLoading: false,
            successMsg: response.message ?? '',
            isSuccess: true,
            profileData: response.data,
            errorMsg: '',
          ));
        } else {
          emit(state.copyWith(
            isLoading: false,
            errorMsg: response.message ?? 'Something went wrong',
          ));
        }
      },
    );
  }

  Future<void> updateProfile({required Map<String, dynamic> body}) async {
    emit(state.copyWith(isLoading: true, errorMsg: '', successMsg: ''));

    final either = await _repository.updateProfile(userID: userID, body: body);

    either.fold(
      (error) {
        emit(state.copyWith(isLoading: false, errorMsg: error.toString()));
      },
      (response) {
        if (response['status'] == true) {
          emit(state.copyWith(
            isLoading: false,
            successMsg: response['message'] ?? 'Profile updated',
            isSuccess: true,
          ));
          // Refresh the profile after a successful update
          getProfile();
        } else {
          emit(state.copyWith(
            isLoading: false,
            errorMsg: response['message'] ?? 'Failed to update profile',
          ));
        }
      },
    );
  }

  void clearProfile() {
    emit(ProfileState());
  }

  void initEditDistrict(String? district) {
    emit(state.copyWith(editDistrict: district ?? "null"));
  }

  void changeEditDistrict(String? district) {
    emit(state.copyWith(editDistrict: district ?? "null"));
  }

  Future<void> uploadAvatar({required List<int> bytes}) async {
    emit(state.copyWith(isLoading: true, errorMsg: '', successMsg: ''));

    final urlResult = await _repository.getUploadUrl();
    await urlResult.fold(
      (error) async {
        emit(state.copyWith(isLoading: false, errorMsg: error.toString()));
      },
      (data) async {
        final uploadUrl = data['uploadUrl'] as String;
        final fileUrl = data['fileUrl'] as String;

        final uploadResult = await _repository.uploadFileToS3(
          uploadUrl: uploadUrl,
          bytes: bytes,
          contentType: 'image/jpeg',
        );

        await uploadResult.fold(
          (error) async {
            emit(state.copyWith(isLoading: false, errorMsg: error.toString()));
          },
          (_) async {
            final updateResult = await _repository.updateProfile(
              userID: userID,
              body: {'avatar_url': fileUrl},
            );

            updateResult.fold(
              (error) {
                emit(state.copyWith(isLoading: false, errorMsg: error.toString()));
              },
              (response) {
                if (response['status'] == true) {
                  emit(state.copyWith(
                    isLoading: false,
                    successMsg: 'Avatar uploaded successfully!',
                    isSuccess: true,
                  ));
                  getProfile();
                } else {
                  emit(state.copyWith(
                    isLoading: false,
                    errorMsg: response['message'] ?? 'Failed to update avatar url',
                  ));
                }
              },
            );
          },
        );
      },
    );
  }
}
