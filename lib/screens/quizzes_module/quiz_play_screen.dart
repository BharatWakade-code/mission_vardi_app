import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/ad_services/ad_manager.dart';
import 'package:mission_vardi/utils/common_widgets/banner_ad_widget.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';

class QuizPlayScreen extends StatefulWidget {
  final String? quizId;  
  const QuizPlayScreen({super.key, this.quizId});

  @override
  State<QuizPlayScreen> createState() => _QuizPlayScreenState();
}

class _QuizPlayScreenState extends State<QuizPlayScreen> {

  @override
  void initState() {
    super.initState();
    context.read<QuizzesCubit>().getQuizzById(quiz_id: widget.quizId);
  }

  @override
  void dispose() {
    context.read<QuizzesCubit>().resetToMenu();
    super.dispose();
  }

  void _showSubmitConfirmationDialog(BuildContext context, QuizzesState state) {
    final isMarathi = context.read<LanguageCubit>().state.locale.languageCode == 'mr';
    
    // Count attempted
    int attemptedCount = 0;
    for (final answer in state.userAnswers) {
      if (answer != null) {
        attemptedCount++;
      }
    }
    final unanswered = state.questions.length - attemptedCount;

    showDialog(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        title: Text(
          isMarathi ? "चाचणी सबमिट करायची?" : "Submit Quiz?",
          style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold),
        ),
        content: Text(
          isMarathi
              ? "तुम्ही एकूण $attemptedCount प्रश्नांची उत्तरे दिली आहेत आणि $unanswered प्रश्न सोडले आहेत. तुम्हाला खात्री आहे का?"
              : "You have answered $attemptedCount questions and skipped $unanswered. Are you sure you want to final submit?",
          style: const TextStyle(fontFamily: 'Outfit'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(dialogCtx),
            child: Text(
              isMarathi ? "रद्द करा" : "Cancel",
              style: const TextStyle(fontFamily: 'Outfit', color: Colors.grey),
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Constants.primaryBlueColour,
            ),
            onPressed: () {
              Navigator.pop(dialogCtx);
              context.read<QuizzesCubit>().finishQuiz();
            },
            child: Text(
              isMarathi ? "होय, सबमिट करा" : "Yes, Submit",
              style: const TextStyle(fontFamily: 'Outfit', color: Colors.white, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isMarathi =
        context.watch<LanguageCubit>().state.locale.languageCode == 'mr';

    final TextStyle commonTextStyle = const TextStyle(
      fontFamily: 'Outfit',
      color: Color(0xFF0A2540),
    );

    return PopScope(
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) {
          context.read<QuizzesCubit>().resetToMenu();
        }
      },
      child: BlocConsumer<QuizzesCubit, QuizzesState>(
        listenWhen: (previous, current) => previous.isQuizRunning && !current.isQuizRunning,
        listener: (context, state) {
          // Navigate to results screen once quiz completes or is submitted!
          context.pushReplacement(RoutesNames.quizResultScreen);
        },
        builder: (context, state) {
          return Scaffold(
            backgroundColor: Constants.scaffoldBackgroundColour,
            appBar: CustomAppBar(
              titleText: isMarathi
                  ? 'सराव चाचणी सुरू आहे'
                  : 'Practice Test in Progress',
              titleIcon: Icons.timer,
              leading: IconButton(
                icon: const Icon(
                  Icons.arrow_back,
                  color: Colors.white,
                ),
                onPressed: () {
                  Navigator.of(context).pop();
                },
              ),
              actions: [
                if (state.isQuizRunning && state.questions.isNotEmpty)
                  Padding(
                    padding: const EdgeInsets.only(right: 8.0),
                    child: ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red.shade600,
                        foregroundColor: Colors.white,
                        elevation: 1,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(15),
                        ),
                      ),
                      onPressed: () => _showSubmitConfirmationDialog(context, state),
                      icon: const Icon(Icons.done_all, size: 16),
                      label: Text(
                        isMarathi ? "पूर्ण सबमिट" : "Final Submit",
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          fontFamily: 'Outfit',
                        ),
                      ),
                    ),
                  ),
              ],
            ),
            body: Column(
              children: [
                Expanded(
                  child: state.questions.isEmpty
                      ? (state.isLoading 
                          ? const Center(child: CircularProgressIndicator())
                          : Center(
                              child: Text(
                                isMarathi
                                    ? "कोणतेही प्रश्न उपलब्ध नाहीत"
                                    : "No questions available",
                                style: commonTextStyle,
                              ),
                            ))
                      : _buildQuizContent(state, isMarathi, commonTextStyle),
                ),
                const BannerAdWidget(),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildQuizContent(QuizzesState state, bool isMarathi, TextStyle commonTextStyle) {
    if (!state.isQuizRunning) {
      // Return a loading spinner while listener triggers redirection
      return const Center(child: CircularProgressIndicator());
    }

    final currentQuestion = state.questions[state.currentQuestionIndex];

    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  "${isMarathi ? 'प्रश्न' : 'Question'} ${state.currentQuestionIndex + 1} / ${state.questions.length}",
                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16),
                ),
                if (state.selectedPracticeMode == "Timed")
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                    decoration: BoxDecoration(
                      color: state.remainingSeconds < 15 ? Colors.red.shade100 : Colors.blue.shade100,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.timer, color: state.remainingSeconds < 15 ? Colors.red : Colors.blue, size: 16),
                        const SizedBox(width: 5),
                        Text(
                          "${state.remainingSeconds} s",
                          style: commonTextStyle.copyWith(
                            color: state.remainingSeconds < 15 ? Colors.red : Colors.blue,
                            fontWeight: FontWeight.bold,
                          ),
                        )
                      ],
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 10),
            LinearProgressIndicator(
              value: (state.currentQuestionIndex + 1) / state.questions.length,
              backgroundColor: Colors.grey.shade300,
              valueColor: AlwaysStoppedAnimation<Color>(Constants.primaryBlueColour),
            ),
            const SizedBox(height: 20),

            // Question Card
            Card(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: Colors.amber.shade100,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            isMarathi ? currentQuestion["categoryMr"] : currentQuestion["category"],
                            style: commonTextStyle.copyWith(
                                fontSize: 11, fontWeight: FontWeight.bold, color: Colors.amber.shade900),
                          ),
                        ),
                        IconButton(
                          onPressed: () {
                            final wasBookmarked = state.bookmarkedQuestions[state.currentQuestionIndex];
                            context.read<QuizzesCubit>().toggleBookmark(state.currentQuestionIndex);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                  wasBookmarked
                                      ? (isMarathi ? "बुकमार्क काढले!" : "Removed from Bookmarks!")
                                      : (isMarathi ? "बुकमार्क जोडले!" : "Added to Bookmarks!"),
                                ),
                                duration: const Duration(seconds: 1),
                              ),
                            );
                          },
                          icon: Icon(
                            state.bookmarkedQuestions[state.currentQuestionIndex] ? Icons.bookmark : Icons.bookmark_border,
                            color: Colors.amber.shade700,
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      isMarathi ? currentQuestion["qMr"] : currentQuestion["q"],
                      style: commonTextStyle.copyWith(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),

            // Options List
            ListView.separated(
              itemCount: 4,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final optionsList = isMarathi ? currentQuestion["optionsMr"] : currentQuestion["options"];
                final optionText = optionsList[index];

                Color tileColor = Colors.white;
                Color borderColor = Colors.grey.shade300;
                IconData? suffixIcon;

                if (state.isAnswerSubmitted) {
                  final correctIdx = currentQuestion["correctIndex"];
                  if (index == correctIdx) {
                    tileColor = Colors.green.shade50;
                    borderColor = Colors.green;
                    suffixIcon = Icons.check_circle;
                  } else if (index == state.selectedAnswerIndex) {
                    tileColor = Colors.red.shade50;
                    borderColor = Colors.red;
                    suffixIcon = Icons.cancel;
                  }
                } else if (index == state.selectedAnswerIndex) {
                  tileColor = Colors.blue.shade50;
                  borderColor = Constants.primaryBlueColour;
                }

                return InkWell(
                  onTap: state.isAnswerSubmitted
                      ? null
                      : () => context.read<QuizzesCubit>().selectAnswer(index),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                    decoration: BoxDecoration(
                      color: tileColor,
                      border: Border.all(color: borderColor, width: 2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            optionText,
                            style: commonTextStyle.copyWith(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: Colors.black87,
                            ),
                          ),
                        ),
                        if (suffixIcon != null) Icon(suffixIcon, color: tileColor == Colors.green.shade50 ? Colors.green : Colors.red)
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 25),

            // Action Buttons
            Row(
              children: [
                if (!state.isAnswerSubmitted)
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Constants.primaryBlueColour,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                      ),
                      onPressed: state.selectedAnswerIndex == null
                          ? null
                          : () => context.read<QuizzesCubit>().submitAnswer(),
                      child: Text(
                        isMarathi
                            ? (state.selectedPracticeMode == "Timed"
                                ? "उत्तर सबमिट करा (${state.remainingSeconds}s)"
                                : "उत्तर सबमिट करा")
                            : (state.selectedPracticeMode == "Timed"
                                ? "Submit Answer (${state.remainingSeconds}s)"
                                : "Submit Answer"),
                        style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                    ),
                  )
                else
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.amber,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(25)),
                      ),
                      onPressed: () => context.read<QuizzesCubit>().nextQuestion(),
                      child: Text(
                        isMarathi
                            ? (state.selectedPracticeMode == "Timed"
                                ? "पुढील प्रश्न (${state.remainingSeconds}s)"
                                : "पुढील प्रश्न")
                            : (state.selectedPracticeMode == "Timed"
                                ? "Next Question (${state.remainingSeconds}s)"
                                : "Next Question"),
                        style: commonTextStyle.copyWith(color: const Color(0xFF0A2540), fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),

            // Answer explanation if submitted
            if (state.isAnswerSubmitted) ...[
              const SizedBox(height: 20),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: Colors.amber.shade50,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.amber.shade200),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      isMarathi ? "💡 स्पष्टीकरण:" : "💡 Explanation:",
                      style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, color: Colors.amber.shade900),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      isMarathi ? currentQuestion["explanationMr"] : currentQuestion["explanation"],
                      style: commonTextStyle.copyWith(fontSize: 13),
                    ),
                  ],
                ),
              )
            ]
          ],
        ),
      ),
    );
  }
}