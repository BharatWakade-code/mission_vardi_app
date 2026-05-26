import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/profile_model/profile_response_model.dart';
import 'package:mission_vardi/screens/profile_module/repository/profile_repository_impl.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

@injectable
class ProfileRepository implements ProfileRepositoryImpl {
  @override
  Future<Either<Exception, ProfileResponseModel>> getProfile(
      {String? userID}) async {
    try {
      final response = await NetworkServices() .getApi(ApiUrls.getProfile, queryParameters: {'user_id': userID});
      final responseData = ProfileResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, dynamic>> updateProfile(
      {required String userID, required Map<String, dynamic> body}) async {
    try {
      final response = await NetworkServices().putApi('${ApiUrls.updateProfile}/$userID', request: body);
      return Right(response.data);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, Map<String, dynamic>>> getUploadUrl() async {
    try {
      final response = await NetworkServices().getApi(ApiUrls.getUploadUrl);
      if (response.data != null && response.data['status'] == true) {
        return Right(Map<String, dynamic>.from(response.data['data']));
      } else {
        return Left(Exception(response.data['message'] ?? 'Failed to generate upload URL'));
      }
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }

  @override
  Future<Either<Exception, void>> uploadFileToS3({
    required String uploadUrl,
    required List<int> bytes,
    required String contentType,
  }) async {
    try {
      await NetworkServices().putBinaryWithoutBaseUrl(uploadUrl, bytes, contentType);
      return const Right(null);
    } catch (e) {
      return Left(Exception(e.toString()));
    }
  }
}
