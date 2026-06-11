import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';

// ─── Design tokens ────────────────────────────────────────────────────────────
const _surface = Color(0xFFFFFFFF);
const _accent = Color(0xFF1D4ED8);
const _accentLight = Color(0xFFDBEAFE);
const _navyDark = Color(0xFF0B1437);
const _textPrimary = Color(0xFF0F172A);
const _textSecondary = Color(0xFF4B5563);
const _divider = Color(0xFFDBEAFE);

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  final List<String> _districts = const [
    'All Maharashtra',
    'Ahmednagar', 'Akola', 'Amravati',
    'Chhatrapati Sambhajinagar (Aurangabad)', 'Beed', 'Bhandara', 'Buldhana',
    'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon',
    'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur',
    'Nanded', 'Nandurbar', 'Nashik', 'Dharashiv (Osmanabad)', 'Palghar',
    'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
    'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal',
  ];

  @override
  void initState() {
    super.initState();
    context.read<QuizzesCubit>().getLeaderboardList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: const CustomAppBar(
        titleText: 'Leaderboard',
        titleIcon: Icons.emoji_events_rounded,
      ),
      body: Column(
        children: [
          _buildDistrictFilter(),
          Expanded(child: _buildLeaderboardList()),
        ],
      ),
    );
  }

  // ─── District Filter Bar ───────────────────────────────────────────────────
  Widget _buildDistrictFilter() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        return Container(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
          decoration: BoxDecoration(
            color: _surface,
            border: Border(bottom: BorderSide(color: _divider, width: 1.5)),
          ),
          child: Row(
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: _accentLight,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.filter_list_rounded,
                    color: _accent, size: 18),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: state.selectedDistrict,
                    isExpanded: true,
                    icon: const Icon(Icons.keyboard_arrow_down_rounded,
                        color: _accent),
                    style: commonTextStyle.copyWith(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: _textPrimary,
                    ),
                    onChanged: (String? newValue) {
                      if (newValue != null) {
                        context
                            .read<QuizzesCubit>()
                            .changeSelectedDistrict(newValue);
                      }
                    },
                    items: _districts
                        .map((v) => DropdownMenuItem<String>(
                              value: v,
                              child: Text(v),
                            ))
                        .toList(),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  // ─── Leaderboard List ──────────────────────────────────────────────────────
  Widget _buildLeaderboardList() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        if (state.isLoading) {
          return Center(
              child:
                  CircularProgressIndicator(color: _accent, strokeWidth: 2.5));
        }

        if (state.errorMsg.isNotEmpty) {
          return _emptyState(
            icon: Icons.error_outline_rounded,
            message: state.errorMsg,
            isError: true,
          );
        }

        if (state.leaderboardData.isEmpty) {
          return _emptyState(
            icon: Icons.emoji_events_rounded,
            message: 'No top performers found\nfor this region yet.',
          );
        }

        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          itemCount: state.leaderboardData.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final item = state.leaderboardData[index];
            return _LeaderboardCard(
              index: index,
              name: item['name'] ?? 'Unknown User',
              district: item['district'],
              points: item['points'] ?? 0,
            );
          },
        );
      },
    );
  }

  Widget _emptyState({
    required IconData icon,
    required String message,
    bool isError = false,
  }) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: isError ? Colors.red.shade50 : _accentLight,
              shape: BoxShape.circle,
            ),
            child: Icon(icon,
                size: 34,
                color: isError ? Colors.red.shade400 : _accent),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: commonTextStyle.copyWith(
              fontSize: 15,
              fontWeight: FontWeight.w500,
              color: _textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Leaderboard Card ──────────────────────────────────────────────────────────
class _LeaderboardCard extends StatelessWidget {
  final int index;
  final String name;
  final String? district;
  final dynamic points;

  const _LeaderboardCard({
    required this.index,
    required this.name,
    required this.district,
    required this.points,
  });

  @override
  Widget build(BuildContext context) {
    // Medal colors for top 3
    final isTop3 = index < 3;
    final rankEmojis = ['🥇', '🥈', '🥉'];
    final rankColors = [
      const Color(0xFFFBBF24), // Gold
      const Color(0xFF94A3B8), // Silver
      const Color(0xFFF97316), // Bronze
    ];
    final rankColor = isTop3 ? rankColors[index] : _textSecondary;

    // Top 3 get a highlighted card
    final isGold = index == 0;

    return Container(
      decoration: BoxDecoration(
        color: isGold ? _navyDark : _surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isTop3
              ? rankColor.withValues(alpha: 0.4)
              : _divider,
          width: isGold ? 0 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: isGold
                ? _navyDark.withValues(alpha: 0.25)
                : _accent.withValues(alpha: 0.05),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            // Rank badge
            Container(
              width: 36,
              height: 36,
              decoration: BoxDecoration(
                color: isTop3
                    ? rankColor.withValues(alpha: isGold ? 0.25 : 0.12)
                    : _accentLight,
                borderRadius: BorderRadius.circular(11),
              ),
              child: Center(
                child: isTop3
                    ? Text(rankEmojis[index],
                        style: const TextStyle(fontSize: 18))
                    : Text(
                        '#${index + 1}',
                        style: commonTextStyle.copyWith(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: _textSecondary,
                        ),
                      ),
              ),
            ),
            const SizedBox(width: 12),
            // Avatar
            CircleAvatar(
              radius: 20,
              backgroundColor:
                  rankColor.withValues(alpha: isGold ? 0.25 : 0.12),
              child: Icon(
                Icons.person_rounded,
                color: isGold ? Colors.amber : rankColor,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            // Name & district
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: commonTextStyle.copyWith(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: isGold ? Colors.white : _textPrimary,
                    ),
                  ),
                  if (district != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      district!,
                      style: commonTextStyle.copyWith(
                        fontSize: 10,
                        color: isGold ? Colors.white54 : _textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            // Points chip
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: isGold
                    ? Colors.white.withValues(alpha: 0.15)
                    : _accentLight,
                borderRadius: BorderRadius.circular(20),
                border: isGold
                    ? Border.all(
                        color: Colors.white.withValues(alpha: 0.2))
                    : Border.all(
                        color: _accent.withValues(alpha: 0.2)),
              ),
              child: Text(
                '$points pts',
                style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.w700,
                  fontSize: 12,
                  color: isGold ? Colors.white : _accent,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
