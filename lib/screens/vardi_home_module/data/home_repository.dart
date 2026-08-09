import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:edusaas/models/home_module/get_pdf_answers_response.dart';
import 'package:edusaas/screens/vardi_home_module/repository/home_repository_impl.dart';
import 'package:edusaas/utils/constants.dart';
import 'package:edusaas/utils/network_services/api_services.dart';

@injectable
class HomeRepository implements HomeRepositoryImpl {

  Future<Either<Exception, Map<String, dynamic>>> getHomeDashboard() async {
    try {
      final response = await NetworkServices().getApi(ApiUrls.getHomeDashboard);
      if (response.data != null && response.data['data'] != null) {
        return Right(response.data['data']);
      } else {
        return Left(Exception("Invalid API response format: ${response.data}"));
      }
    } catch (e) {
      print('getHomeDashboard ex: $e');
      return Left(Exception(e));
    }
  }

  // Keep leaderboards in getGlobalData or fetch separately
  Future<Either<Exception, Map<String, dynamic>>> getGlobalData() async {
    try {
      final leaderRes = await NetworkServices().getApi(ApiUrls.getGlobalLeaderboard);
      return Right({
        "leaderboard": leaderRes.data['data'] ?? []
      });
    } catch (e) {
      print('getGlobalData ex: $e');
      return Left(Exception(e));
    }
  }
}
