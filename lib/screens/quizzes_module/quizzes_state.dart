class QuizzesState {
  final String selectedPracticeMode;
  final String activeCategory;
  final List<Map<String, dynamic>> allQuestions;
  final List<Map<String, dynamic>> questions;
  final bool isQuizRunning;
  final int currentQuestionIndex;
  final int? selectedAnswerIndex;
  final bool isAnswerSubmitted;
  final int score;
  final List<bool> bookmarkedQuestions;
  final int remainingSeconds;
  final bool isLoading;

  QuizzesState({
    this.selectedPracticeMode = "Timed",
    this.activeCategory = "All",
    this.allQuestions = const [],
    this.questions = const [],
    this.isQuizRunning = false,
    this.currentQuestionIndex = 0,
    this.selectedAnswerIndex,
    this.isAnswerSubmitted = false,
    this.score = 0,
    this.bookmarkedQuestions = const [],
    this.remainingSeconds = 60,
    this.isLoading = false,
  });

  QuizzesState copyWith({
    String? selectedPracticeMode,
    String? activeCategory,
    List<Map<String, dynamic>>? allQuestions,
    List<Map<String, dynamic>>? questions,
    bool? isQuizRunning,
    int? currentQuestionIndex,
    int? Function()? selectedAnswerIndex,
    bool? isAnswerSubmitted,
    int? score,
    List<bool>? bookmarkedQuestions,
    int? remainingSeconds,
    bool? isLoading,
  }) {
    return QuizzesState(
      selectedPracticeMode: selectedPracticeMode ?? this.selectedPracticeMode,
      activeCategory: activeCategory ?? this.activeCategory,
      allQuestions: allQuestions ?? this.allQuestions,
      questions: questions ?? this.questions,
      isQuizRunning: isQuizRunning ?? this.isQuizRunning,
      currentQuestionIndex: currentQuestionIndex ?? this.currentQuestionIndex,
      selectedAnswerIndex: selectedAnswerIndex != null ? selectedAnswerIndex() : this.selectedAnswerIndex,
      isAnswerSubmitted: isAnswerSubmitted ?? this.isAnswerSubmitted,
      score: score ?? this.score,
      bookmarkedQuestions: bookmarkedQuestions ?? this.bookmarkedQuestions,
      remainingSeconds: remainingSeconds ?? this.remainingSeconds,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}
