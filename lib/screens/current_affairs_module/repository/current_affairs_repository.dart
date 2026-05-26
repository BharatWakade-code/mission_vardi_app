import 'package:either_dart/either.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/screens/current_affairs_module/data/current_affairs_model.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

@injectable
class CurrentAffairsRepository {
  Future<Either<Exception, List<CurrentAffairsModel>>> getCurrentAffairs({
    String? category,
    String? search,
    bool? trending,
  }) async {
    try {
      final Map<String, dynamic> queryParams = {};
      if (category != null && category.isNotEmpty) {
        queryParams['category'] = category;
      }
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (trending != null) {
        queryParams['trending'] = trending;
      }

      final response = await NetworkServices().getApi(
        ApiUrls.getCurrentAffairs,
        queryParameters: queryParams,
      );

      print('getCurrentAffairs response: $response');
      
      final List<dynamic> data = response.data['data'] ?? [];
      final List<CurrentAffairsModel> articles =
          data.map((item) => CurrentAffairsModel.fromJson(item)).toList();
          
      return Right(articles);
    } catch (e) {
      print('getCurrentAffairs exception: $e');
      return Left(Exception(e));
    }
  }
}
