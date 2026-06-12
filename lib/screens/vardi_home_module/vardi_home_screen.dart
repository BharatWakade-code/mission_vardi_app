import 'dart:async';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import 'package:mission_vardi/screens/vardi_home_module/vardi_home_cubit.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_cubit.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/download_service.dart';
import 'package:mission_vardi/screens/localization_module/locale_cubit.dart';
import 'package:mission_vardi/screens/localization_module/change_language_bottom_sheet.dart';

// ─── Design Tokens (Blue Theme) ────────────────────────────────────────────
const _surface = Color(0xFFFFFFFF);
const _navyDark = Color(0xFF0B1437);
const _navyMid = Color(0xFF1A3572);
const _accent = Color(0xFF1D4ED8);       // rich royal blue
const _accentLight = Color(0xFFDBEAFE); // pale blue for chips/tags
const _textPrimary = Color(0xFF0F172A);
const _textSecondary = Color(0xFF4B5563);
const _divider = Color(0xFFDBEAFE);     // blue-tinted divider

class FarmerHomeScreen extends StatefulWidget {
  const FarmerHomeScreen({super.key});

  @override
  State<FarmerHomeScreen> createState() => _FarmerHomeScreenState();
}

class _FarmerHomeScreenState extends State<FarmerHomeScreen>
    with TickerProviderStateMixin {
  // Quote state
  int quoteIndex = 0;
  final List<Map<String, String>> quotes = [
    {
      "en": '"Duty, Honor, Courage — the uniform is a responsibility."',
      "mr": '"कर्तव्य, सन्मान, धाडस — वर्दी ही जबाबदारी आहे."'
    },
    {
      "en": '"Sweat more in training, bleed less in battle."',
      "mr": '"सराव करताना जास्त घाम गाळा, युद्धात कमी रक्त सांडेल."'
    },
    {
      "en": '"Success is earned on the track and in the books."',
      "mr": '"यश धावपट्टीवर आणि पुस्तकांमध्ये मिळवावे लागते."'
    },
  ];

  // Countdown state
  late Timer _countdownTimer;
  late AnimationController _pulseController;
  int daysLeft = 132, hoursLeft = 4, minutesLeft = 35, secondsLeft = 19;

  @override
  void initState() {
    super.initState();
    context.read<VardiHomeCubit>().getHomeDashboardData();
   // context.read<VardiHomeCubit>().getGlobalData();

    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);

    _countdownTimer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        if (secondsLeft > 0) {
          secondsLeft--;
        } else {
          secondsLeft = 59;
          if (minutesLeft > 0) {
            minutesLeft--;
          } else {
            minutesLeft = 59;
            if (hoursLeft > 0) {
              hoursLeft--;
            } else {
              hoursLeft = 23;
              if (daysLeft > 0) daysLeft--;
            }
          }
        }
      });
    });
  }

  @override
  void dispose() {
    _countdownTimer.cancel();
    _pulseController.dispose();
    super.dispose();
  }

  // ─── BUILD ──────────────────────────────────────────────────────────────────
  @override
  Widget build(BuildContext context) {
    context.watch<LocaleCubit>();
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: _buildAppBar(),
      body: BlocListener<VardiHomeCubit, VardiHomeState>(
        listenWhen: (p, c) => p.countdown == null && c.countdown != null,
        listener: (context, state) {
          if (state.countdown != null) {
            setState(() {
              daysLeft = state.countdown!['daysLeft'] ?? 0;
              hoursLeft = state.countdown!['hoursLeft'] ?? 0;
              minutesLeft = state.countdown!['minutesLeft'] ?? 0;
              secondsLeft = state.countdown!['secondsLeft'] ?? 0;
            });
          }
        },
        child: RefreshIndicator(
          color: _accent,
          backgroundColor: _surface,
          onRefresh: () async {
            context.read<VardiHomeCubit>().getHomeDashboardData();
            context.read<VardiHomeCubit>().getGlobalData();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                      const SizedBox(height: 20),
                      _buildHeroCountdown(),
                      const SizedBox(height: 24),
                      _buildQuickActionsGrid(),
                      const SizedBox(height: 24),
                      _buildMotivationCard(),
                      const SizedBox(height: 24),
                      _buildBhartiInfoBanner(),
                      const SizedBox(height: 24),
                _buildLeaderboardSection(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─── App Bar ──────────────────────────────────────────────────────────────────
  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: _navyDark,
      elevation: 0,
      scrolledUnderElevation: 0,
      shadowColor: Colors.transparent,
      surfaceTintColor: Colors.transparent,
      titleSpacing: 16,
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [_navyDark, _navyMid, Color(0xFF1E40AF)],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
        ),
      ),
      title: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
            ),
            child: const Icon(Icons.local_police_rounded,
                color: Colors.amber, size: 20),
          ),
          const SizedBox(width: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'title'.tr(),
                style: commonTextStyle.copyWith(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  letterSpacing: -0.3,
                ),
              ),
              Text(
                'maharashtra_police_bharti'.tr(),
                style: commonTextStyle.copyWith(
                  fontSize: 10,
                  color: Colors.white60,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
      actions: [
        IconButton(
          onPressed: () {
            ChangeLanguageBottomSheet.show(context);
          },
          icon: const Icon(Icons.language_rounded, color: Colors.white, size: 24),
        ),
        IconButton(
          onPressed: () {},
          icon: Stack(
            children: [
              const Icon(Icons.notifications_outlined,
                  color: Colors.white, size: 24),
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  width: 8,
                  height: 8,
                  decoration: const BoxDecoration(
                    color: Color(0xFFFBBF24),
                    shape: BoxShape.circle,
                  ),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 4),
      ],
    );
  }

  // ─── Hero Countdown Card ─────────────────────────────────────────────────────
  Widget _buildHeroCountdown() {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [_navyDark, _navyMid, Color(0xFF1D4ED8)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          stops: [0.0, 0.5, 1.0],
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: _navyMid.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Decorative circle
          Positioned(
            top: -30,
            right: -30,
            child: Container(
              width: 120,
              height: 120,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04),
              ),
            ),
          ),
          Positioned(
            bottom: -20,
            left: -20,
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04),
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Header row
                Row(
                  children: [
                    AnimatedBuilder(
                      animation: _pulseController,
                      builder: (_, child) => Container(
                        width: 8,
                        height: 8,
                        decoration: BoxDecoration(
                          color: Color.lerp(
                            const Color(0xFF4ADE80),
                            const Color(0xFF86EFAC),
                            _pulseController.value,
                          ),
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      'exam_countdown'.tr(),
                      style: commonTextStyle.copyWith(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: Colors.white60,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  'welcome_future_officer'.tr(),
                  style: commonTextStyle.copyWith(
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                    letterSpacing: -0.3,
                  ),
                ),
                Text(
                  'your_dream_uniform_awaits_keep_going'.tr(),
                  style: commonTextStyle.copyWith(
                    fontSize: 12,
                    color: Colors.white54,
                    fontWeight: FontWeight.w400,
                  ),
                ),
                const SizedBox(height: 20),
                // Countdown tiles
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    _countdownTile(daysLeft.toString(), 'Days'),
                    _countdownDivider(),
                    _countdownTile(hoursLeft.toString().padLeft(2, '0'), 'Hrs'),
                    _countdownDivider(),
                    _countdownTile(
                        minutesLeft.toString().padLeft(2, '0'), 'Min'),
                    _countdownDivider(),
                    _countdownTile(
                        secondsLeft.toString().padLeft(2, '0'), 'Sec'),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _countdownTile(String value, String label) {
    return Column(
      children: [
        Container(
          width: 60,
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withOpacity(0.15)),
          ),
          child: Center(
            child: Text(
              value,
              style: commonTextStyle.copyWith(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),
        const SizedBox(height: 5),
        Text(
          label.toUpperCase(),
          style: commonTextStyle.copyWith(
            fontSize: 9,
            color: Colors.blue.shade200,
            fontWeight: FontWeight.w600,
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }

  Widget _countdownDivider() => Padding(
        padding: const EdgeInsets.only(bottom: 22),
        child: Text(
          ':',
          style: commonTextStyle.copyWith(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.white30,
          ),
        ),
      );

  // ─── Quick Actions Grid ──────────────────────────────────────────────────────
  Widget _buildQuickActionsGrid() {
    final actions = [
      _ActionItem(
        title: 'mock_quizzes'.tr(),
        subtitle: 'test_your_skills'.tr(),
        icon: Icons.timer_rounded,
        color: const Color(0xFF6366F1),
        lightColor: const Color(0xFFEEF2FF),
        onTap: () =>
            context.push(RoutesNames.categoryItemsScreen, extra: 'Timed'),
      ),
      _ActionItem(
        title: 'pyq_papers'.tr(),
        subtitle: 'previous_year_papers'.tr(),
        icon: Icons.history_edu_rounded,
        color: const Color(0xFF059669),
        lightColor: const Color(0xFFECFDF5),
        onTap: () => context.push(RoutesNames.pyqScreen),
      ),
      _ActionItem(
        title: 'subject_notes'.tr(),
        subtitle: 'read_study'.tr(),
        icon: Icons.library_books_rounded,
        color: const Color(0xFFD97706),
        lightColor: const Color(0xFFFFFBEB),
        onTap: () =>
            context.push(RoutesNames.categoryItemsScreen, extra: 'notes'.tr()),
      ),
      _ActionItem(
        title: 'leaderboard'.tr(),
        subtitle: 'your_rank_score'.tr(),
        icon: Icons.emoji_events_rounded,
        color: const Color(0xFFDB2777),
        lightColor: const Color(0xFFFDF2F8),
        onTap: () => context.push(RoutesNames.leaderboardScreen),
      ),
      _ActionItem(
        title: 'physical_test'.tr(),
        subtitle: 'track_your_run'.tr(),
        icon: Icons.directions_run_rounded,
        color: const Color(0xFF0891B2),
        lightColor: const Color(0xFFECFEFF),
        onTap: () => context.read<VardiDashboardCubit>().onChangeIndex(2),
      ),
      _ActionItem(
        title: 'my_profile'.tr(),
        subtitle: 'view_your_progress'.tr(),
        icon: Icons.person_rounded,
        color: const Color(0xFF7C3AED),
        lightColor: const Color(0xFFF5F3FF),
        onTap: () => context.read<VardiDashboardCubit>().onChangeIndex(3),
      ),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionHeader('quick_actions'.tr(), 'what_do_you_want_to_do_today'.tr()),
        const SizedBox(height: 14),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.15,
          ),
          itemCount: actions.length,
          itemBuilder: (context, i) => _buildActionTile(actions[i]),
        ),
      ],
    );
  }

  Widget _buildActionTile(_ActionItem item) {
    return GestureDetector(
      onTap: item.onTap,
      child: Container(
        decoration: BoxDecoration(
          color: _surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: _divider),
          boxShadow: [
            BoxShadow(
              color: _accent.withValues(alpha: 0.06),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 34,
                height: 34,
                decoration: BoxDecoration(
                  color: item.lightColor,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(item.icon, color: item.color, size: 17),
              ),
              const Spacer(),
              Text(
                item.title,
                style: commonTextStyle.copyWith(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: _textPrimary,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 2),
              Text(
                item.subtitle,
                style: commonTextStyle.copyWith(
                  fontSize: 9,
                  color: _textSecondary,
                  fontWeight: FontWeight.w400,
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Motivation Card ─────────────────────────────────────────────────────────
  Widget _buildMotivationCard() {
    final state = context.watch<VardiHomeCubit>().state;
    final quotesList =
        (state.dailyQuotes != null && state.dailyQuotes!.isNotEmpty)
            ? state.dailyQuotes!
            : quotes;
    if (quoteIndex >= quotesList.length) quoteIndex = 0;
    final currentQuote = quotesList[quoteIndex];
    final quoteText =
        (currentQuote is Map) ? (currentQuote["en"] ?? currentQuote["mr"] ?? "") : currentQuote.toString();

    return Container(
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFFBEB),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Icon(Icons.format_quote_rounded,
                      color: Color(0xFFD97706), size: 18),
                ),
                const SizedBox(width: 10),
                Text(
                  'daily_motivation'.tr(),
                  style: commonTextStyle.copyWith(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: _textPrimary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: _accentLight,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: _accent.withValues(alpha: 0.2)),
              ),
              child: Text(
                quoteText,
                style: commonTextStyle.copyWith(
                  fontSize: 13,
                  fontStyle: FontStyle.italic,
                  height: 1.6,
                  fontWeight: FontWeight.w500,
                  color: _textPrimary,
                ),
              ),
            ),
            const SizedBox(height: 12),
            GestureDetector(
              onTap: () => setState(
                  () => quoteIndex = (quoteIndex + 1) % quotesList.length),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.refresh_rounded, size: 14, color: _accent),
                  const SizedBox(width: 4),
                  Text(
                    'next_quote'.tr(),
                    style: commonTextStyle.copyWith(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: _accent,
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

  // ─── Bharti Info Banner ──────────────────────────────────────────────────────
  Widget _buildBhartiInfoBanner() {
    return GestureDetector(
      onTap: () => context.push(RoutesNames.policeBhartiInfoScreen),
      child: Container(
        decoration: BoxDecoration(
          gradient: const LinearGradient(
            colors: [Color(0xFF1E3A8A), Color(0xFF1D4ED8), Color(0xFF2563EB)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: _accent.withValues(alpha: 0.3),
              blurRadius: 14,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(Icons.menu_book_rounded,
                    color: Colors.white, size: 24),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'police_bharti_complete_guide'.tr(),
                      style: commonTextStyle.copyWith(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      'syllabus_age_limit_salary_more'.tr(),
                      style: commonTextStyle.copyWith(
                        fontSize: 11,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.arrow_forward_rounded,
                    color: Colors.white, size: 16),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Leaderboard Section ─────────────────────────────────────────────────────
  Widget _buildLeaderboardSection() {
    final state = context.watch<VardiHomeCubit>().state;
    final leaders = state.leaderboard ?? [];
    if (leaders.isEmpty) return const SizedBox.shrink();

    return Column(
      children: [
        _sectionHeader('global_leaderboard'.tr(), 'top_performers_this_week'.tr()),
        const SizedBox(height: 14),
        Container(
          decoration: BoxDecoration(
            color: _surface,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: leaders.length,
            separatorBuilder: (_, __) =>
                const Divider(height: 1, color: _divider, indent: 16, endIndent: 16),
            itemBuilder: (context, index) {
              final item = leaders[index];
              final rankColors = [
                const Color(0xFFFBBF24), // Gold
                const Color(0xFF94A3B8), // Silver
                const Color(0xFFF97316), // Bronze
              ];
              final rankColor = index < 3 ? rankColors[index] : _textSecondary;
              final isTop3 = index < 3;

              return Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 16, vertical: 12),
                child: Row(
                  children: [
                    // Rank badge
                    Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: rankColor.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Center(
                        child: isTop3
                            ? Text(
                                ['🥇', '🥈', '🥉'][index],
                                style: const TextStyle(fontSize: 16),
                              )
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
                      radius: 18,
                      backgroundColor: rankColor.withOpacity(0.15),
                      child: Icon(
                        Icons.person_rounded,
                        color: rankColor,
                        size: 18,
                      ),
                    ),
                    const SizedBox(width: 10),
                    // Name
                    Expanded(
                      child: Text(
                        item["name"] ?? "Unknown User",
                        style: commonTextStyle.copyWith(
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                          color: _textPrimary,
                        ),
                      ),
                    ),
                    // Score chip
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 10, vertical: 5),
                      decoration: BoxDecoration(
                        color: _accentLight,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: _accent.withValues(alpha: 0.2)),
                      ),
                      child: Text(
                        '${item["score_str"] ?? "0"} pts',
                        style: commonTextStyle.copyWith(
                          fontWeight: FontWeight.w700,
                          color: _accent,
                          fontSize: 11,
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  // ─── Section Header ───────────────────────────────────────────────────────────
  Widget _sectionHeader(String title, String subtitle) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: commonTextStyle.copyWith(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: _textPrimary,
                letterSpacing: -0.3,
              ),
            ),
            Text(
              subtitle,
              style: commonTextStyle.copyWith(
                fontSize: 11,
                color: _textSecondary,
              ),
            ),
          ],
        ),
      ],
    );
  }
}

// ─── Data Class ───────────────────────────────────────────────────────────────
class _ActionItem {
  final String title;
  final String subtitle;
  final IconData icon;
  final Color color;
  final Color lightColor;
  final VoidCallback onTap;

  const _ActionItem({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.lightColor,
    required this.onTap,
  });
}
