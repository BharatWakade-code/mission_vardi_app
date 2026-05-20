import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/home_module/get_pdf_answers_response.dart';
import 'package:mission_vardi/screens/vardi_home_module/repository/home_repository_impl.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

@injectable
class HomeRepository implements HomeRepositoryImpl {

  @override
  Future<Either<Exception, GetPdfNotesResponseModel>> getPDFNotesAndSolvedPapers({queryParameters})async {
     try {
      final response = await NetworkServices().getApi(ApiUrls.getPdfNotesAndSolvedPapers,queryParameters: queryParameters);
      print('api response $response');
      final responseData = GetPdfNotesResponseModel.fromJson(response.data);
      return Right(responseData);
    } catch (e) {
      print('api response ex: $e'); // Added $e to see the actual error

      return Left(Exception(e));
    }
  }
}
