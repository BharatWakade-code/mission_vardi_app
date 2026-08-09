import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:go_router/go_router.dart';

import 'package:edusaas/screens/quizzes_module/quizzes_cubit.dart';
import 'package:edusaas/screens/quizzes_module/quizzes_state.dart';
import 'package:edusaas/utils/constants.dart';
import 'package:edusaas/utils/common_widgets/common_app_bar.dart';
import 'package:edusaas/utils/routes_services/routes_name.dart';

class QuizResultScreen extends StatelessWidget {
  const QuizResultScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Watch LanguageCubit to trigger an instant rebuild when language changes
    final isMr = false;
    
    final TextStyle commonTextStyle = const TextStyle(
      fontFamily: 'Outfit',
      color: Color(0xFF0A2540),
    );

    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        final totalQuestions = state.questions.length;
        final correctAnswers = state.score;
        
        // Count attempted
        int attemptedCount = 0;
        for (final answer in state.userAnswers) {
          if (answer != null) {
            attemptedCount++;
          }
        }
        final incorrectAnswers = attemptedCount - correctAnswers;
        final unansweredCount = totalQuestions - attemptedCount;
        final scorePercentage = totalQuestions > 0 
            ? ((correctAnswers / totalQuestions) * 100).toStringAsFixed(1)
            : "0.0";

        return Scaffold(
          backgroundColor: Constants.scaffoldBackgroundColour,
          appBar: CustomAppBar(
            titleText: 'practice_test_result'.tr(),
            titleIcon: Icons.analytics,
            leading: IconButton(
              icon: const Icon(
                Icons.arrow_back,
                color: Colors.white,
              ),
              onPressed: () {
                context.read<QuizzesCubit>().resetToMenu();
                context.go(RoutesNames.dashboardScreen);
              },
            ),
          ),
          body: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Score Summary Card
                  Card(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    elevation: 3,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [Colors.blue.shade900, const Color(0xFF0A2540)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        children: [
                          Text(
                            'your_total_score'.tr(),
                            style: commonTextStyle.copyWith(
                              color: Colors.white70,
                              fontSize: 16,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                          const SizedBox(height: 15),
                          
                          // Circular Score Display
                          Stack(
                            alignment: Alignment.center,
                            children: [
                              SizedBox(
                                width: 120,
                                height: 120,
                                child: CircularProgressIndicator(
                                  value: totalQuestions > 0 ? (correctAnswers / totalQuestions) : 0.0,
                                  strokeWidth: 10,
                                  backgroundColor: Colors.white12,
                                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.greenAccent),
                                ),
                              ),
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    "$correctAnswers / $totalQuestions",
                                    style: commonTextStyle.copyWith(
                                      color: Colors.white,
                                      fontSize: 26,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  Text(
                                    "$scorePercentage%",
                                    style: commonTextStyle.copyWith(
                                      color: Colors.greenAccent,
                                      fontSize: 14,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 25),
                          
                          // Performance Tag
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(
                              correctAnswers >= (totalQuestions * 0.7)
                                  ? "Excellent Job! 🏆"
                                  : "Need More Practice! 💪",
                              style: commonTextStyle.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 15,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Mini Stats Grid
                  Row(
                    children: [
                      _buildStatCard(
                        title: 'total_qs'.tr(),
                        value: "$totalQuestions",
                        color: Colors.blue.shade700,
                        icon: Icons.format_list_numbered,
                        textStyle: commonTextStyle,
                      ),
                      const SizedBox(width: 10),
                      _buildStatCard(
                        title: 'correct'.tr(),
                        value: "$correctAnswers",
                        color: Colors.green,
                        icon: Icons.check_circle_outline,
                        textStyle: commonTextStyle,
                      ),
                      const SizedBox(width: 10),
                      _buildStatCard(
                        title: 'incorrect'.tr(),
                        value: "$incorrectAnswers",
                        color: Colors.red,
                        icon: Icons.highlight_off,
                        textStyle: commonTextStyle,
                      ),
                      const SizedBox(width: 10),
                      _buildStatCard(
                        title: 'skipped'.tr(),
                        value: "$unansweredCount",
                        color: Colors.grey.shade600,
                        icon: Icons.next_plan_outlined,
                        textStyle: commonTextStyle,
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // Review section header
                  Text(
                    'detailed_questions_review'.tr(),
                    style: commonTextStyle.copyWith(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),

                  // Questions Review List
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: totalQuestions,
                    separatorBuilder: (_, __) => const SizedBox(height: 16),
                    itemBuilder: (context, qIdx) {
                      final question = state.questions[qIdx];
                      final options = isMr ? question["optionsMr"] : question["options"];
                      final selectedIdx = state.userAnswers[qIdx];
                      final correctIdx = question["correctIndex"];
                      final isCorrect = selectedIdx == correctIdx;

                      return Card(
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                        elevation: 1.5,
                        child: Padding(
                          padding: const EdgeInsets.all(16.0),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              // Top Row with Question index and status tag
                              Row(
                                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                children: [
                                  Text(
                                    "Question ${qIdx + 1}",
                                    style: commonTextStyle.copyWith(
                                      fontWeight: FontWeight.bold,
                                      color: Colors.grey.shade700,
                                    ),
                                  ),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: selectedIdx == null
                                          ? Colors.grey.shade100
                                          : (isCorrect ? Colors.green.shade50 : Colors.red.shade50),
                                      borderRadius: BorderRadius.circular(8),
                                    ),
                                    child: Text(
                                      selectedIdx == null
                                          ? 'skipped'.tr()
                                          : (isCorrect ? 'correct'.tr() : 'incorrect'.tr()),
                                      style: commonTextStyle.copyWith(
                                        fontSize: 11,
                                        fontWeight: FontWeight.bold,
                                        color: selectedIdx == null
                                            ? Colors.grey.shade700
                                            : (isCorrect ? Colors.green.shade700 : Colors.red.shade700),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              
                              // Question Text
                              Text(
                                isMr ? question["qMr"] : question["q"],
                                style: commonTextStyle.copyWith(
                                  fontSize: 15,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              const SizedBox(height: 16),

                              // Option Tiles
                              ListView.separated(
                                shrinkWrap: true,
                                physics: const NeverScrollableScrollPhysics(),
                                itemCount: 4,
                                separatorBuilder: (_, __) => const SizedBox(height: 8),
                                itemBuilder: (context, optIdx) {
                                  final optionText = options[optIdx];
                                  
                                  Color tileColor = Colors.white;
                                  Color borderColor = Colors.grey.shade200;
                                  IconData? icon;
                                  Color? iconColor;

                                  if (optIdx == correctIdx) {
                                    // Highlight correct answer in green
                                    tileColor = Colors.green.shade50;
                                    borderColor = Colors.green.shade300;
                                    icon = Icons.check_circle;
                                    iconColor = Colors.green;
                                  } else if (optIdx == selectedIdx && !isCorrect) {
                                    // Highlight user's wrong answer in red
                                    tileColor = Colors.red.shade50;
                                    borderColor = Colors.red.shade300;
                                    icon = Icons.cancel;
                                    iconColor = Colors.red;
                                  }

                                  return Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                    decoration: BoxDecoration(
                                      color: tileColor,
                                      border: Border.all(color: borderColor, width: 1.5),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(
                                            optionText,
                                            style: commonTextStyle.copyWith(
                                              fontSize: 13.5,
                                              color: Colors.black87,
                                            ),
                                          ),
                                        ),
                                        if (icon != null) Icon(icon, color: iconColor, size: 18),
                                      ],
                                    ),
                                  );
                                },
                              ),
                              
                              // Explanation
                              const SizedBox(height: 12),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: Colors.amber.shade50.withOpacity(0.4),
                                  borderRadius: BorderRadius.circular(10),
                                  border: Border.all(color: Colors.amber.shade100),
                                ),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      'explanation'.tr(),
                                      style: commonTextStyle.copyWith(
                                        fontWeight: FontWeight.bold,
                                        color: Colors.amber.shade900,
                                        fontSize: 12.5,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      isMr ? question["explanationMr"] : question["explanation"],
                                      style: commonTextStyle.copyWith(
                                        fontSize: 12,
                                        color: Colors.grey.shade800,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
          bottomNavigationBar: SafeArea(
            child: Padding(
              padding: const EdgeInsets.only(left: 16.0, right: 16.0, bottom: 16.0),
              child: SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0A2540),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(25),
                    ),
                  ),
                  onPressed: () {
                    context.read<QuizzesCubit>().resetToMenu();
                    context.go(RoutesNames.dashboardScreen);
                  },
                  child: Text(
                    'back_to_main_menu'.tr(),
                    style: commonTextStyle.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required Color color,
    required IconData icon,
    required TextStyle textStyle,
  }) {
    return Expanded(
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        elevation: 1,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 12.0, horizontal: 4.0),
          child: Column(
            children: [
              Icon(icon, color: color, size: 20),
              const SizedBox(height: 6),
              Text(
                value,
                style: textStyle.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 15,
                  color: color,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                title,
                textAlign: TextAlign.center,
                style: textStyle.copyWith(
                  fontSize: 10,
                  color: Colors.grey.shade600,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
