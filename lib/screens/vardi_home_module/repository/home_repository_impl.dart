import 'package:either_dart/either.dart';
import 'package:edusaas/models/home_module/get_pdf_answers_response.dart';

abstract class HomeRepositoryImpl {
  Future<Either<Exception, Map<String, dynamic>>> getGlobalData();
  Future<Either<Exception, Map<String, dynamic>>> getHomeDashboard();
}
