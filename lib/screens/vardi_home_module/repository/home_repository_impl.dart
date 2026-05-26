import 'package:either_dart/either.dart';
import 'package:mission_vardi/models/home_module/get_pdf_answers_response.dart';

abstract class HomeRepositoryImpl {
  Future<Either<Exception, GetPdfNotesResponseModel>>
      getPDFNotesAndSolvedPapers({queryParameters});
  Future<Either<Exception, Map<String, dynamic>>> getGlobalData();
}
