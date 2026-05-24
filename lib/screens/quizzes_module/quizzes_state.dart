import 'package:mission_vardi/models/quizz_model/quizz_list_reponse_model.dart';

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

  // NEW
  final List<QuizzListData> data;
  final List<int?> userAnswers; // Tracks user's selected answers
  final String? sessionId;
  final String? quizId;

  // OPTIONAL
  final String errorMsg;
  final String successMsg;
  final bool isSuccess;

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

    // NEW
    this.data = const [],
    this.userAnswers = const [],
    this.sessionId,
    this.quizId,

    // OPTIONAL
    this.errorMsg = '',
    this.successMsg = '',
    this.isSuccess = false,
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

    // NEW
    List<QuizzListData>? data,
    List<int?>? userAnswers,
    String? sessionId,
    String? quizId,

    // OPTIONAL
    String? errorMsg,
    String? successMsg,
    bool? isSuccess,
  }) {
    return QuizzesState(
      selectedPracticeMode: selectedPracticeMode ?? this.selectedPracticeMode,
      activeCategory: activeCategory ?? this.activeCategory,
      allQuestions: allQuestions ?? this.allQuestions,
      questions: questions ?? this.questions,
      isQuizRunning: isQuizRunning ?? this.isQuizRunning,
      currentQuestionIndex: currentQuestionIndex ?? this.currentQuestionIndex,
      selectedAnswerIndex: selectedAnswerIndex != null
          ? selectedAnswerIndex()
          : this.selectedAnswerIndex,
      isAnswerSubmitted: isAnswerSubmitted ?? this.isAnswerSubmitted,
      score: score ?? this.score,
      bookmarkedQuestions: bookmarkedQuestions ?? this.bookmarkedQuestions,
      remainingSeconds: remainingSeconds ?? this.remainingSeconds,
      isLoading: isLoading ?? this.isLoading,
      data: data ?? this.data,
      userAnswers: userAnswers ?? this.userAnswers,
      sessionId: sessionId ?? this.sessionId,
      quizId: quizId ?? this.quizId,
      errorMsg: errorMsg ?? this.errorMsg,
      successMsg: successMsg ?? this.successMsg,
      isSuccess: isSuccess ?? this.isSuccess,
    );
  }
}
