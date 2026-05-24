import 'package:either_dart/either.dart';
import 'package:mission_vardi/models/profile_model/profile_response_model.dart';

abstract class ProfileRepositoryImpl {
  Future<Either<Exception, ProfileResponseModel>> getProfile();
}
