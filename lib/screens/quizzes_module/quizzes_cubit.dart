import 'dart:async';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/quizz_model/quizz_list_reponse_model.dart';
import 'package:mission_vardi/screens/quizzes_module/data/quizzes_repository.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

@injectable
class QuizzesCubit extends Cubit<QuizzesState> {
  final QuizzRepository _repository;
  Timer? _quizTimer;
  int _totalTimeSpent = 0;

  QuizzesCubit(this._repository) : super(QuizzesState());

  /// Get Quiz List
  Future<void> getQuizzesList({String? category, String? quiz_id}) async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
    ));

    final either = await _repository.getQuizzesList(
      queryParameters: {'category': category, "quiz_id": quiz_id},
    );

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: error.toString(),
        ));
      },
      (response) {
        quizzListResponseHandle(response);
      },
    );
  }

  void quizzListResponseHandle(QuizzListResponseModel response) {
    if (response.status == true) {
      emit(state.copyWith(
        isLoading: false,
        successMsg: response.message ?? '',
        isSuccess: true,
        data: response.data ?? [],
        errorMsg: '',
      ));
    } else {
      emit(state.copyWith(
        isLoading: false,
        errorMsg: response.message ?? 'Something went wrong',
      ));
    }
  }

  /// Get Quiz List
  Future<void> getQuizzById({String? quiz_id}) async {
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
    ));

    final either = await _repository.getQuizById(
      queryParameters: {"quiz_id": quiz_id},
    );

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: error.toString(),
        ));
      },
      (response) {
        getQuizByIDResponseHandle(response);
      },
    );
  }

  void getQuizByIDResponseHandle(QuizzListResponseModel response) {
    if (response.status == true) {
      final List<QuizzListData> fetchedData = response.data ?? [];

      List<Map<String, dynamic>> mappedQuestions = [];
      if (fetchedData.isNotEmpty &&
          fetchedData.first.questions != null &&
          fetchedData.first.questions!.isNotEmpty) {
        final quizItem = fetchedData.first;
        final questionsList = quizItem.questions ?? [];

        mappedQuestions = questionsList.map((q) {
          final options = q.options ?? [];
          final correctIdx = options.indexOf(q.correctAnswer ?? "");
          return {
            "id": q.id ?? "",
            "category": quizItem.category ?? "General",
            "categoryMr": quizItem.category ?? "सामान्य",
            "q": q.text ?? "",
            "qMr": q.text ?? "",
            "options": options,
            "optionsMr": options,
            "correctIndex": correctIdx != -1 ? correctIdx : 0,
            "explanation": "Correct Answer: ${q.correctAnswer}",
            "explanationMr": "योग्य उत्तर: ${q.correctAnswer}"
          };
        }).toList();
      }

      if (mappedQuestions.isNotEmpty) {
        emit(state.copyWith(
          isLoading: false,
          successMsg: response.message ?? '',
          isSuccess: true,
          data: fetchedData,
          allQuestions: mappedQuestions,
          questions: mappedQuestions,
          bookmarkedQuestions:
              List.generate(mappedQuestions.length, (_) => false),
          userAnswers: List.generate(mappedQuestions.length, (_) => null),
          isQuizRunning: true,
          currentQuestionIndex: 0,
          selectedAnswerIndex: () => null,
          isAnswerSubmitted: false,
          score: 0,
          remainingSeconds: state.selectedPracticeMode == "Timed" ? 30 : 60,
          errorMsg: '',
        ));

        _startQuizTimer();
      } else {
        emit(state.copyWith(
          isLoading: false,
          successMsg: response.message ?? '',
          isSuccess: true,
          data: fetchedData,
          errorMsg: '',
        ));
      }
    } else {
      emit(state.copyWith(
        isLoading: false,
        errorMsg: response.message ?? 'Something went wrong',
      ));
    }
  }

  void changePracticeMode(String mode) {
    emit(state.copyWith(selectedPracticeMode: mode));
  }

  void changeActiveCategory(String category) {
    emit(state.copyWith(activeCategory: category));
  }

  void startQuiz({String? category}) async {
    _quizTimer?.cancel();
    _totalTimeSpent = 0;

    List<Map<String, dynamic>> filtered = state.allQuestions;

    String actualCategory = category ?? "All";

    if (actualCategory != "All") {
      String searchKey = actualCategory;

      if (actualCategory == "GK & Updates") {
        searchKey = "General Knowledge";
      }

      filtered =
          state.allQuestions.where((q) => q["category"] == searchKey).toList();
    }

    emit(state.copyWith(
      activeCategory: actualCategory,
      questions: filtered,
      bookmarkedQuestions: List.generate(filtered.length, (_) => false),
      userAnswers: List.generate(filtered.length, (_) => null),
      isQuizRunning: true,
      currentQuestionIndex: 0,
      selectedAnswerIndex: () => null,
      isAnswerSubmitted: false,
      score: 0,
      remainingSeconds: state.selectedPracticeMode == "Timed" ? 30 : 60,
    ));

    _startQuizTimer();
    
    // Call API to start session
    try {
      String userId = CommonHiveData.getString('userId');
      String quizId = state.data.isNotEmpty ? (state.data.first.id ?? "") : "unknown";
      final either = await _repository.startStudySession({
        "user_id": userId,
        "quiz_id": quizId
      });
      either.fold(
        (error) => print("Error starting session: $error"),
        (response) {
          if (response['status'] == true) {
            emit(state.copyWith(sessionId: response['data']['session_id']));
          }
        }
      );
    } catch(e) {
      print("Exception starting session: $e");
    }
  }

  void selectAnswer(int index) {
    if (state.isAnswerSubmitted) return;

    final updatedAnswers = List<int?>.from(state.userAnswers);
    if (state.currentQuestionIndex < updatedAnswers.length) {
      updatedAnswers[state.currentQuestionIndex] = index;
    }

    emit(state.copyWith(
      selectedAnswerIndex: () => index,
      userAnswers: updatedAnswers,
    ));
  }

  void submitAnswer({bool timedOut = false}) {
    if (state.isAnswerSubmitted) {
      return;
    }
    if (state.selectedAnswerIndex == null && !timedOut) {
      return;
    }

    final currentQuestion = state.questions[state.currentQuestionIndex];

    final isCorrect =
        state.selectedAnswerIndex == currentQuestion["correctIndex"];

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
        remainingSeconds: state.selectedPracticeMode == "Timed" ? 30 : 60,
      ));
    } else {
      finishQuiz();
    }
  }

  void _startQuizTimer() {
    _quizTimer?.cancel();
    if (state.selectedPracticeMode == "Timed") {
      _quizTimer = Timer.periodic(
        const Duration(seconds: 1),
        (timer) {
          if (!state.isQuizRunning) {
            timer.cancel();
            return;
          }
          if (state.remainingSeconds > 0) {
            _totalTimeSpent++;
            emit(state.copyWith(
              remainingSeconds: state.remainingSeconds - 1,
            ));
          } else {
            if (!state.isAnswerSubmitted) {
              submitAnswer(timedOut: true);
            } else {
              nextQuestion();
            }
          }
        },
      );
    }
  }

  void finishQuiz() async {
    _quizTimer?.cancel();

    if (state.sessionId != null) {
      List<Map<String, dynamic>> answers = [];
      for (int i = 0; i < state.userAnswers.length; i++) {
        final selectedIdx = state.userAnswers[i];
        if (selectedIdx != null) {
          final q = state.questions[i];
          final options = q["options"] as List<String>;
          answers.add({
            "question_id": q["id"],
            "selected_option": options[selectedIdx]
          });
        }
      }

      final data = {
        "time_spent_seconds": _totalTimeSpent,
        "answers": answers
      };

      await _repository.endStudySession(state.sessionId!, data);
    }

    try {
      final saveResultData = {
        "user_id": CommonHiveData.getString('userId'),
        "score": state.score,
        "total": state.questions.length
      };
      
      String quizId = state.data.isNotEmpty ? (state.data.first.id ?? "") : "unknown";
      await _repository.saveResult(quizId, saveResultData);
    } catch (e) {
      print("Exception saving result: $e");
    }

    emit(state.copyWith(
      isQuizRunning: false,
    ));
  }

  void toggleBookmark(int index) {
    if (index >= 0 && index < state.bookmarkedQuestions.length) {
      final updatedBookmarks = List<bool>.from(state.bookmarkedQuestions);

      updatedBookmarks[index] = !updatedBookmarks[index];

      emit(state.copyWith(
        bookmarkedQuestions: updatedBookmarks,
      ));
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
