import 'package:mission_vardi/models/auth_model/auth_response_model.dart';

class ProfileState {
  final User? profileData;
  final bool isLoading;
  final String errorMsg;
  final String successMsg;
  final bool isSuccess;

  final String? editDistrict;

  ProfileState({
    this.profileData,
    this.isLoading = false,
    this.errorMsg = '',
    this.successMsg = '',
    this.isSuccess = false,
    this.editDistrict,
  });

  ProfileState copyWith({
    User? profileData,
    bool? isLoading,
    String? errorMsg,
    String? successMsg,
    bool? isSuccess,
    String? editDistrict,
  }) {
    return ProfileState(
      profileData: profileData ?? this.profileData,
      isLoading: isLoading ?? this.isLoading,
      errorMsg: errorMsg ?? this.errorMsg,
      successMsg: successMsg ?? this.successMsg,
      isSuccess: isSuccess ?? this.isSuccess,
      editDistrict: editDistrict != null ? (editDistrict == "null" ? null : editDistrict) : this.editDistrict,
    );
  }
}
