import 'package:mission_vardi/screens/current_affairs_module/data/current_affairs_model.dart';

class CurrentAffairsState {
  final bool isLoading;
  final List<CurrentAffairsModel> articles;
  final String selectedCategory;
  final String searchQuery;
  final String errorMessage;

  CurrentAffairsState({
    this.isLoading = false,
    this.articles = const [],
    this.selectedCategory = 'All',
    this.searchQuery = '',
    this.errorMessage = '',
  });

  CurrentAffairsState copyWith({
    bool? isLoading,
    List<CurrentAffairsModel>? articles,
    String? selectedCategory,
    String? searchQuery,
    String? errorMessage,
  }) {
    return CurrentAffairsState(
      isLoading: isLoading ?? this.isLoading,
      articles: articles ?? this.articles,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      searchQuery: searchQuery ?? this.searchQuery,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}
