import 'package:injectable/injectable.dart';
import 'package:mission_vardi/screens/quizzes_module/data/quizzes_data_source.dart';

@injectable
class QuizzesRepository {
  final QuizzesDataSource _dataSource;

  QuizzesRepository(this._dataSource);

  Future<List<Map<String, dynamic>>> getQuestions() {
    return _dataSource.getMockQuestions();
  }
}
