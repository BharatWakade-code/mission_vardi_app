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
final String userID = CommonHiveData.getString('userId');

  Future<void> getProfile() async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
    ));

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
}
