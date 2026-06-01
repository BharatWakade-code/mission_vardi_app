import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:intl/intl.dart';

import 'package:mission_vardi/screens/profile_module/activity_history_cubit.dart';
import 'package:mission_vardi/screens/profile_module/activity_history_state.dart';
import 'package:mission_vardi/screens/profile_module/history_details_bottom_sheet.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';

class ActivityHistoryScreen extends StatefulWidget {
  const ActivityHistoryScreen({super.key});

  @override
  State<ActivityHistoryScreen> createState() => _ActivityHistoryScreenState();
}

class _ActivityHistoryScreenState extends State<ActivityHistoryScreen> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    context.read<ActivityHistoryCubit>().fetchHistory(isRefresh: true);
    _scrollController.addListener(_onScroll);
  }

  void _onScroll() {
    if (_scrollController.position.pixels >=
        _scrollController.position.maxScrollExtent - 200) {
      context.read<ActivityHistoryCubit>().fetchHistory();
    }
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: "Activity History",
        titleIcon: Icons.history,
      ),
      body: BlocBuilder<ActivityHistoryCubit, ActivityHistoryState>(
        builder: (context, state) {
          if (state.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.errorMsg.isNotEmpty && state.sessions.isEmpty) {
            return Center(child: Text(state.errorMsg));
          }
          if (state.sessions.isEmpty) {
            return Center(
              child: Text(
                "No history found",
                style: commonTextStyle.copyWith(color: Colors.grey),
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () => context
                .read<ActivityHistoryCubit>()
                .fetchHistory(isRefresh: true),
            child: ListView.separated(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: state.sessions.length + (state.hasReachedMax ? 0 : 1),
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                if (index >= state.sessions.length) {
                  return const Center(
                    child: Padding(
                      padding: EdgeInsets.all(16.0),
                      child: CircularProgressIndicator(),
                    ),
                  );
                }

                final session = state.sessions[index];

                // Parse required fields
                DateTime date = DateTime.tryParse(
                        session['ended_at'] ?? session['started_at'] ?? '') ??
                    DateTime.now();
                String timeStr = DateFormat('dd MMM, hh:mm a').format(date);
                String quizTitle = session['quiz_title'] ??
                    (session['category'] ?? "practice");

                int score = session['score'] ?? 0;
                int total = session['total'] ?? 0;
                int attempted = session['answers'] != null
                    ? session['answers'].length
                    : score;
                int wrong = attempted - score;
                if (wrong < 0) wrong = 0;

                return GestureDetector(
                  onTap: () {
                    final sessionId =
                        session['id']; // study_sessions_collection has 'id'
                    final quizId = session['quiz_id'];

                    if (sessionId != null && quizId != null) {
                      showModalBottomSheet(
                        context: context,
                        isScrollControlled: true,
                        backgroundColor: Colors.transparent,
                        builder: (context) => DraggableScrollableSheet(
                          initialChildSize: 0.8,
                          minChildSize: 0.5,
                          maxChildSize: 0.95,
                          builder: (_, scrollController) =>
                              HistoryDetailsBottomSheet(
                            sessionId: sessionId,
                            quizId: quizId,
                          ),
                        ),
                      );
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text(
                                'Detailed history not available for this session.')),
                      );
                    }
                  },
                  child: Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(15),
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    padding: const EdgeInsets.symmetric(
                        vertical: 14, horizontal: 16),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color:
                                Constants.primaryBlueColour.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(Icons.quiz_rounded,
                              color: Constants.primaryBlueColour, size: 24),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                mainAxisAlignment:
                                    MainAxisAlignment.spaceBetween,
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Expanded(
                                    child: Text(
                                      quizTitle,
                                      style: commonTextStyle.copyWith(
                                        fontWeight: FontWeight.w700,
                                        fontSize: 14,
                                        color: Colors.black87,
                                      ),
                                      maxLines: 2,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    timeStr,
                                    style: commonTextStyle.copyWith(
                                        fontSize: 10,
                                        color: Colors.grey.shade500),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 10),
                              Wrap(
                                spacing: 8,
                                runSpacing: 8,
                                children: [
                                  _buildStatChip("Attempted",
                                      "$attempted/$total", Colors.blue),
                                  _buildStatChip(
                                      "Correct", "$score", Colors.green),
                                  _buildStatChip("Wrong", "$wrong", Colors.red),
                                ],
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
          );
        },
      ),
    );
  }

  Widget _buildStatChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            "$label: ",
            style: commonTextStyle.copyWith(
                fontSize: 10, color: color.withOpacity(0.9)),
          ),
          Text(
            value,
            style: commonTextStyle.copyWith(
                fontSize: 10, fontWeight: FontWeight.bold, color: color),
          ),
        ],
      ),
    );
  }
}
