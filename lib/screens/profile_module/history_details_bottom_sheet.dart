import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edusaas/utils/constants.dart';
import 'package:edusaas/screens/profile_module/history_details_cubit.dart';
import 'package:edusaas/screens/profile_module/history_details_state.dart';

class HistoryDetailsBottomSheet extends StatelessWidget {
  final String sessionId;
  final String quizId;

  const HistoryDetailsBottomSheet({
    super.key,
    required this.sessionId,
    required this.quizId,
  });

  @override
  Widget build(BuildContext context) {
    return BlocProvider(
      create: (context) =>
          HistoryDetailsCubit()..fetchDetails(sessionId, quizId),
      child: BlocBuilder<HistoryDetailsCubit, HistoryDetailsState>(
        builder: (context, state) {
          if (state.isLoading) {
            return const SizedBox(
              height: 300,
              child: Center(child: CircularProgressIndicator()),
            );
          }
          if (state.sessionData == null) {
            return SizedBox(
              height: 300,
              child: Center(
                  child: Text(state.errorMsg.isNotEmpty
                      ? state.errorMsg
                      : "Failed to load session")),
            );
          }

          final answers = state.sessionData!['answers'] as List<dynamic>? ?? [];
          final questions = state.quizData != null
              ? (state.quizData!['questions'] as List<dynamic>? ?? [])
              : [];

          return Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'quiz_review'.tr(),
                      style: commonTextStyle.copyWith(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close),
                      onPressed: () => Navigator.pop(context),
                    )
                  ],
                ),
                const Divider(),
                Expanded(
                  child: ListView.builder(
                    itemCount: answers.length,
                    itemBuilder: (context, index) {
                      final answerObj = answers[index];
                      final qId = answerObj['question_id'];

                      final q = questions.firstWhere((q) => q['id'] == qId,
                          orElse: () => null);

                      String selectedOption =
                          answerObj['selected_option'] ?? "";
                      String correctAnswer = answerObj['correct_answer'] ??
                          (q != null ? q['correctAnswer'] ?? "" : "");
                      bool isCorrect = answerObj['is_correct'] ?? false;

                      // Get question string properly mapping model
                      String questionText = q != null
                          ? (q['text'] ??
                              q['q'] ??
                              q['qMr'] ??
                              'Question Text Unavailable')
                          : 'Question Text Unavailable';

                      String explanation = q != null
                          ? (q['explanation'] ?? q['explanationMr'] ?? '')
                          : '';

                      return Card(
                        margin: const EdgeInsets.symmetric(vertical: 8),
                        elevation: 0,
                        color: Colors.grey.shade50,
                        shape: RoundedRectangleBorder(
                            side: BorderSide(color: Colors.grey.shade200),
                            borderRadius: BorderRadius.circular(12)),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Q${index + 1}. $questionText",
                                style: commonTextStyle.copyWith(
                                    fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                "Your Answer: ${selectedOption.isEmpty ? 'skipped'.tr() : selectedOption}",
                                style: commonTextStyle.copyWith(
                                    color: selectedOption.isEmpty
                                        ? Colors.grey
                                        : (isCorrect
                                            ? Colors.green
                                            : Colors.red),
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12),
                              ),
                              if (!isCorrect && selectedOption.isNotEmpty)
                                Text(
                                  "Correct Answer: $correctAnswer",
                                  style: commonTextStyle.copyWith(
                                      color: Colors.green,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12),
                                ),
                              if (explanation.isNotEmpty)
                                Padding(
                                  padding: const EdgeInsets.only(top: 8),
                                  child: Text(
                                    "Explanation: $explanation",
                                    style: commonTextStyle.copyWith(
                                      fontSize: 11,
                                      color: Colors.grey.shade600,
                                    ),
                                  ),
                                ),
                            ],
                          ),
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
