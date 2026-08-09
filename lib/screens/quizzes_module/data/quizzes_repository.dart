import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:edusaas/models/home_module/get_pdf_answers_response.dart';
import 'package:edusaas/models/quizz_model/quizz_list_reponse_model.dart';
import 'package:edusaas/screens/quizzes_module/repository/quizzes_repository_impl.dart';
import 'package:edusaas/screens/vardi_home_module/repository/home_repository_impl.dart';
import 'package:edusaas/utils/constants.dart';
import 'package:edusaas/utils/network_services/api_services.dart';

@injectable
class QuizzRepository implements QuizzesRepositoryImpl {
  @override
  Future<Either<Exception, QuizzListResponseModel>> getQuizzesList(
      {queryParameters}) async {
    try {
      final response = await NetworkServices()
          .getApi(ApiUrls.getQuizzesList, queryParameters: queryParameters);
      final responseData = QuizzListResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      return Left(Exception(e));
    }
  }
  
  @override
  Future<Either<Exception, QuizzListResponseModel>> getQuizById({queryParameters}) async {
    try {
      print(queryParameters);
      final quizId = queryParameters?['quiz_id'];
      final response = await NetworkServices().getApi(
        "${ApiUrls.getQuizzesList}/$quizId",
      );
      
      final Map<String, dynamic> body = Map<String, dynamic>.from(response.data);
      if (body['data'] is Map) {
        body['data'] = [body['data']];
      }
      
      final responseData = QuizzListResponseModel.fromJson(body);
      return Right(responseData);
    } catch (e) {
      print("Error in getQuizById: $e");
      return Left(Exception(e));
    }
  }

  @override
  Future<Either<Exception, dynamic>> startStudySession(Map<String, dynamic> data) async {
    try {
      final response = await NetworkServices().postApi(ApiUrls.startStudySession,  data);
      return Right(response.data);
    } catch (e) {
      return Left(Exception(e));
    }
  }

  @override
  Future<Either<Exception, dynamic>> endStudySession(String sessionId, Map<String, dynamic> data) async {
    try {
      final response = await NetworkServices().putApi("/study/session/$sessionId/end", request: data);
      return Right(response.data);
    } catch (e) {
      return Left(Exception(e));
    }
  }

  @override
  Future<Either<Exception, dynamic>> saveResult(String quizId, Map<String, dynamic> data) async {
    try {
      final response = await NetworkServices().postApi("/quiz/$quizId/result", data);
      return Right(response.data);
    } catch (e) {
      return Left(Exception(e));
    }
  }
}
