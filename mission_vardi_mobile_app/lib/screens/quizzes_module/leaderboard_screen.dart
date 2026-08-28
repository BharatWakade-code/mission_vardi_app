import 'package:flutter/material.dart';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

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
  List<String> _districts = ['All Maharashtra'];

  @override
  void initState() {
    super.initState();
    _fetchDistricts();
    
    // Reset district value when visiting screen to prevent dropdown crash
    final cubit = context.read<QuizzesCubit>();
    if (cubit.state.selectedDistrict != 'All Maharashtra') {
      cubit.changeSelectedDistrict('All Maharashtra');
    } else {
      cubit.getLeaderboardList();
    }
  }

  Future<void> _fetchDistricts() async {
    try {
      final response = await NetworkServices().getApi('/home/districts');
      if (response.data != null && response.data['status'] == true) {
        final List<String> fetched = List<String>.from(response.data['data']);
        setState(() {
          _districts = ['All Maharashtra', ...fetched];
        });
      }
    } catch (e) {
      debugPrint("Failed to fetch districts: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar:  CustomAppBar(
        titleText: 'leaderboard'.tr(),
        titleIcon: Icons.emoji_events_rounded,
      ),
      body: BlocBuilder<QuizzesCubit, QuizzesState>(
        builder: (context, state) {
          return Column(
            children: [
              _buildDistrictFilter(),
              Expanded(child: _buildLeaderboardList()),
              if (state.userRankData != null)
                _buildUserStickyBar(state.userRankData!),
            ],
          );
        },
      ),
    );
  }

  Widget _buildUserStickyBar(Map<String, dynamic> userRankData) {
    final rank = userRankData['rank'] ?? 0;
    final globalRank = userRankData['global_rank'];
    final districtRank = userRankData['district_rank'];
    final name = userRankData['name'] ?? 'You';
    final points = userRankData['points'] ?? 0;
    final district = userRankData['district'];

    String rankDisplay = "#$rank";
    if (globalRank != null && districtRank != null && district != "Unknown") {
      rankDisplay = "State #$globalRank • District #$districtRank";
    } else if (globalRank != null) {
      rankDisplay = "State #$globalRank";
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: _navyDark,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    "You ($name)",
                    style: commonTextStyle.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.15),
                      borderRadius: BorderRadius.circular(6),
                    ),
                    child: Text(
                      rankDisplay,
                      style: commonTextStyle.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 11,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: _accentLight.withOpacity(0.15),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.stars_rounded, size: 14, color: Color(0xFFFBBF24)),
                  const SizedBox(width: 4),
                  Text(
                    "$points pts",
                    style: commonTextStyle.copyWith(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
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
            message: 'no_top_performers_foundnfor_this_region_yet'.tr(),
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
              name: (item['name'] as String?) ?? 'Unknown User',
              district: item['district'] as String?,
              avatarUrl: item['avatar_url'] as String?,
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
  final String? avatarUrl;
  final dynamic points;

  const _LeaderboardCard({
    required this.index,
    required this.name,
    required this.district,
    this.avatarUrl,
    required this.points,
  });

  @override
  Widget build(BuildContext context) {
    final rankEmojis = ['🥇', '🥈', '🥉'];
    final isTop3 = index < 3;

    return Container(
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _divider, width: 1),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            // Rank
            SizedBox(
              width: 30,
              child: Text(
                isTop3 ? rankEmojis[index] : '#${index + 1}',
                style: commonTextStyle.copyWith(
                  fontSize: isTop3 ? 18 : 14,
                  fontWeight: FontWeight.w600,
                  color: _textSecondary,
                ),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(width: 12),
            
            // Avatar
            CircleAvatar(
              radius: 18,
              backgroundColor: _accentLight,
              backgroundImage: (avatarUrl != null && avatarUrl!.isNotEmpty)
                  ? NetworkImage(avatarUrl!)
                  : NetworkImage(
                      'https://ui-avatars.com/api/?name=${Uri.encodeComponent(name)}&background=random&color=fff'),
            ),
            const SizedBox(width: 12),
            
            // Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: commonTextStyle.copyWith(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: _textPrimary,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (district != null && district!.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(
                      district!,
                      style: commonTextStyle.copyWith(
                        fontSize: 12,
                        color: _textSecondary,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                  ],
                ],
              ),
            ),
            
            // Points
            const SizedBox(width: 8),
            Text(
              '$points pts',
              style: commonTextStyle.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: _accent,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
