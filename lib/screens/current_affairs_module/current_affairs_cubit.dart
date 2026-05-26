import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/screens/current_affairs_module/current_affairs_state.dart';
import 'package:mission_vardi/screens/current_affairs_module/repository/current_affairs_repository.dart';

@injectable
class CurrentAffairsCubit extends Cubit<CurrentAffairsState> {
  final CurrentAffairsRepository _repository;

  CurrentAffairsCubit(this._repository) : super(CurrentAffairsState());

  Future<void> loadCurrentAffairs({String? category, String? search}) async {
    emit(state.copyWith(
      isLoading: true,
      errorMessage: '',
      selectedCategory: category ?? state.selectedCategory,
      searchQuery: search ?? state.searchQuery,
    ));

    // Handle 'All' category conversion for the query parameter
    final String? queryCategory = (category ?? state.selectedCategory) == 'All'
        ? null
        : (category ?? state.selectedCategory);

    final either = await _repository.getCurrentAffairs(
      category: queryCategory,
      search: search ?? state.searchQuery,
    );

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMessage: error.toString(),
        ));
      },
      (articles) {
        emit(state.copyWith(
          isLoading: false,
          articles: articles,
        ));
      },
    );
  }

  void changeCategory(String category) {
    loadCurrentAffairs(category: category);
  }

  void searchArticles(String query) {
    loadCurrentAffairs(search: query);
  }
}
