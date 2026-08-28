import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/quizz_model/quizz_list_reponse_model.dart';
import 'package:mission_vardi/screens/quizzes_module/data/quizzes_repository.dart';

abstract class QuizzesRepositoryImpl {
  Future<Either<Exception, QuizzListResponseModel>> getQuizzesList(
      {queryParameters});
  Future<Either<Exception, QuizzListResponseModel>> getQuizById(
      {queryParameters});
  Future<Either<Exception, dynamic>> startStudySession(Map<String, dynamic> data);
  Future<Either<Exception, dynamic>> endStudySession(String sessionId, Map<String, dynamic> data);
  Future<Either<Exception, dynamic>> saveResult(String quizId, Map<String, dynamic> data);
}
