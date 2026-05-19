import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/screens/quizzes_module/repository/quizzes_repository.dart';

@injectable
class QuizzesCubit extends Cubit<QuizzesState> {
  final QuizzesRepository _repository;
  Timer? _quizTimer;

  QuizzesCubit(this._repository) : super(QuizzesState()) {
    loadQuestions();
  }

  Future<void> loadQuestions() async {
    emit(state.copyWith(isLoading: true));
    try {
      final questions = await _repository.getQuestions();
      emit(state.copyWith(
        allQuestions: questions,
        questions: questions,
        bookmarkedQuestions: List.generate(questions.length, (_) => false),
        isLoading: false,
      ));
    } catch (e) {
      emit(state.copyWith(isLoading: false));
    }
  }

  void changePracticeMode(String mode) {
    emit(state.copyWith(selectedPracticeMode: mode));
  }

  void changeActiveCategory(String category) {
    emit(state.copyWith(activeCategory: category));
  }

  void startQuiz({String? category}) {
    _quizTimer?.cancel();

    List<Map<String, dynamic>> filtered = state.allQuestions;
    String actualCategory = category ?? "All";
    
    if (actualCategory != "All") {
      String searchKey = actualCategory;
      if (actualCategory == "GK & Updates") {
        searchKey = "General Knowledge";
      }
      filtered = state.allQuestions
          .where((q) => q["category"] == searchKey)
          .toList();
    }

    emit(state.copyWith(
      activeCategory: actualCategory,
      questions: filtered,
      bookmarkedQuestions: List.generate(filtered.length, (_) => false),
      isQuizRunning: true,
      currentQuestionIndex: 0,
      selectedAnswerIndex: () => null,
      isAnswerSubmitted: false,
      score: 0,
      remainingSeconds: 60,
    ));

    if (state.selectedPracticeMode == "Timed") {
      _quizTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (state.remainingSeconds > 0) {
          emit(state.copyWith(remainingSeconds: state.remainingSeconds - 1));
        } else {
          timer.cancel();
          finishQuiz();
        }
      });
    }
  }

  void selectAnswer(int index) {
    if (state.isAnswerSubmitted) return;
    emit(state.copyWith(selectedAnswerIndex: () => index));
  }

  void submitAnswer() {
    if (state.selectedAnswerIndex == null || state.isAnswerSubmitted) return;

    final currentQuestion = state.questions[state.currentQuestionIndex];
    final isCorrect = state.selectedAnswerIndex == currentQuestion["correctIndex"];
    
    emit(state.copyWith(
      isAnswerSubmitted: true,
      score: isCorrect ? state.score + 1 : state.score,
    ));
  }

  void nextQuestion() {
    if (state.currentQuestionIndex < state.questions.length - 1) {
      emit(state.copyWith(
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedAnswerIndex: () => null,
        isAnswerSubmitted: false,
      ));
    } else {
      finishQuiz();
    }
  }

  void finishQuiz() {
    _quizTimer?.cancel();
    emit(state.copyWith(
      isQuizRunning: false,
    ));
  }

  void toggleBookmark(int index) {
    if (index >= 0 && index < state.bookmarkedQuestions.length) {
      final updatedBookmarks = List<bool>.from(state.bookmarkedQuestions);
      updatedBookmarks[index] = !updatedBookmarks[index];
      emit(state.copyWith(bookmarkedQuestions: updatedBookmarks));
    }
  }

  void resetToMenu() {
    _quizTimer?.cancel();
    emit(state.copyWith(
      isQuizRunning: false,
      currentQuestionIndex: 0,
      selectedAnswerIndex: () => null,
      isAnswerSubmitted: false,
    ));
  }

  @override
  Future<void> close() {
    _quizTimer?.cancel();
    return super.close();
  }
}
