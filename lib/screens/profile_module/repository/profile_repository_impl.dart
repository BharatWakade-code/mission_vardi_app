import 'package:either_dart/either.dart';
import 'package:edusaas/models/profile_model/profile_response_model.dart';

abstract class ProfileRepositoryImpl {
  Future<Either<Exception, ProfileResponseModel>> getProfile();
  Future<Either<Exception, dynamic>> updateProfile({required String userID, required Map<String, dynamic> body});
  Future<Either<Exception, Map<String, dynamic>>> getUploadUrl();
  Future<Either<Exception, void>> uploadFileToS3({required String uploadUrl, required List<int> bytes, required String contentType});
  Future<Either<Exception, List<String>>> getDistricts();
}
