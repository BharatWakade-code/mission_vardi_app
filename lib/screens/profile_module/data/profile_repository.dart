import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/profile_model/profile_response_model.dart';
import 'package:mission_vardi/screens/profile_module/repository/profile_repository_impl.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

@injectable
class ProfileRepository implements ProfileRepositoryImpl {
  @override
  Future<Either<Exception, ProfileResponseModel>> getProfile() async {
    try {
      final response = await NetworkServices().getApi(ApiUrls.getProfile);
      final responseData = ProfileResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }
}
