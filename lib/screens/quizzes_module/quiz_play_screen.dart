import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/ad_services/ad_manager.dart';
import 'package:mission_vardi/utils/common_widgets/banner_ad_widget.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';

class QuizPlayScreen extends StatelessWidget {
  const QuizPlayScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final isMarathi = context.watch<LanguageCubit>().state.locale.languageCode == 'mr';

    return PopScope(
      onPopInvokedWithResult: (didPop, result) {
        if (didPop) {
          // Clean up the cubit state when popping back to menu
          context.read<QuizzesCubit>().resetToMenu();
        }
      },
      child: Scaffold(
        backgroundColor: Constants.scaffoldBackgroundColour,
        appBar: CustomAppBar(
          titleText: isMarathi ? 'सराव चाचणी सुरू आहे' : 'Practice Test in Progress',
          titleIcon: Icons.timer,
          leading: IconButton(
            icon: const Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () {
              Navigator.of(context).pop();
            },
          ),
        ),
        body: Column(
          children: [
            Expanded(
              child: BlocBuilder<QuizzesCubit, QuizzesState>(
                builder: (context, state) {
                  if (state.questions.isEmpty) {
                    return Center(
                      child: Text(
                        isMarathi ? "कोणतेही प्रश्न उपलब्ध नाहीत" : "No questions available",
                        style: commonTextStyle,
                      ),
                    );
                  }

                  final isFinished = !state.isQuizRunning;

                  if (isFinished) {
                    // Score Screen / Finish Screen
                    return Center(
                      child: SingleChildScrollView(
                        child: Padding(
                          padding: const EdgeInsets.all(24.0),
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Container(
                                padding: const EdgeInsets.all(20),
                                decoration: BoxDecoration(
                                  color: Colors.amber.withOpacity(0.1),
                                  shape: BoxShape.circle,
                                ),
                                child: const Icon(Icons.military_tech, size: 80, color: Colors.amber),
                              ),
                              const SizedBox(height: 20),
                              Text(
                                isMarathi ? "चाचणी पूर्ण झाली!" : "Quiz Completed!",
                                style: commonTextStyle.copyWith(fontSize: 24, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                "${isMarathi ? 'तुमचा स्कोर' : 'Your Score'}: ${state.score} / ${state.questions.length}",
                                style: commonTextStyle.copyWith(fontSize: 18, color: Colors.grey.shade800),
                              ),
                              const SizedBox(height: 10),
                              Text(
                                state.score >= (state.questions.length * 0.7)
                                    ? (isMarathi ? "उत्कृष्ट काम! 🏆" : "Excellent Job! 🏆")
                                    : (isMarathi ? "सराव करत रहा! 💪" : "Keep Practicing! 💪"),
                                style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                              const SizedBox(height: 30),
                              ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Colors.green,
                                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                ),
                                icon: const Icon(Icons.monetization_on, color: Colors.amber),
                                label: Text(
                                  isMarathi ? "दुपटीने नाणी मिळवा (Ad)" : "Claim 2x Coins (Watch Ad)",
                                  style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                                ),
                                onPressed: () {
                                  AdManager.instance.showRewardedAd(
                                    onRewardEarned: () {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text(
                                            isMarathi
                                                ? "अभिनंदन! तुम्ही +५० PSI नाणी मिळवली! 🎉"
                                                : "Congratulations! You earned +50 PSI Coins! 🎉",
                                          ),
                                        ),
                                      );
                                    },
                                    onAdDismissed: () {},
                                  );
                                },
                              ),
                              const SizedBox(height: 12),
                              ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: Constants.primaryBlueColour,
                                  padding: const EdgeInsets.symmetric(horizontal: 40, vertical: 14),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                                ),
                                onPressed: () {
                                  Navigator.of(context).pop();
                                },
                                child: Text(
                                  isMarathi ? "मुख्य मेनूवर जा" : "Back to Menu",
                                  style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.bold),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    );
                  }

                  // Standard Quiz Loop Interface
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
                                      Text(
                                        optionText,
                                        style: commonTextStyle.copyWith(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w600,
                                          color: Colors.black87,
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
                                      isMarathi ? "उत्तर सबमिट करा" : "Submit Answer",
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
                                      isMarathi ? "पुढील प्रश्न" : "Next Question",
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
                },
              ),
            ),
            const BannerAdWidget(),
          ],
        ),
      ),
    );
  }
}
