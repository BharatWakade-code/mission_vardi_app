import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';

import 'package:mission_vardi/screens/profile_module/profile_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/common_widgets/banner_ad_widget.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';

// ─── Design tokens ──────────────────────────────────────────────────────────
const _surface = Color(0xFFFFFFFF);
const _navyDark = Color(0xFF0B1437);
const _navyMid = Color(0xFF1A3572);
const _accent = Color(0xFF1D4ED8);
const _accentLight = Color(0xFFDBEAFE);
const _textPrimary = Color(0xFF0F172A);
const _textSecondary = Color(0xFF4B5563);
const _divider = Color(0xFFDBEAFE);

class QuizzesScreen extends StatefulWidget {
  const QuizzesScreen({super.key});

  @override
  State<QuizzesScreen> createState() => _QuizzesScreenState();
}

class _QuizzesScreenState extends State<QuizzesScreen> {
  @override
  void initState() {
    super.initState();
    context.read<QuizzesCubit>().getQuizzesList();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        final profileCubit = context.read<ProfileCubit>();
        if (profileCubit.state.profileData == null) {
          profileCubit.getProfile();
        }
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final profileState = context.watch<ProfileCubit>().state;
    final int currentStreak =
        profileState.profileData?.stats?['current_streak_days'] ?? 0;

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: const CustomAppBar(
        titleText: 'Quiz & Notes',
        titleIcon: Icons.quiz_rounded,
      ),
      body: BlocBuilder<QuizzesCubit, QuizzesState>(
        builder: (context, state) {
          if (state.isLoading) {
            return Center(
                child: CircularProgressIndicator(
                    color: _accent, strokeWidth: 2.5));
          }

          return SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 20, 16, 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // ─── Daily Challenge Banner ─────────────────────────────
                _buildDailyChallengeBanner(context, currentStreak),
                const SizedBox(height: 24),

                // ─── Section header ─────────────────────────────────────
                Text(
                  'Study Modes',
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: _textPrimary,
                    letterSpacing: -0.3,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  'Choose how you want to prepare',
                  style: GoogleFonts.inter(
                      fontSize: 11, color: _textSecondary),
                ),
                const SizedBox(height: 14),

                // ─── Menu Cards ─────────────────────────────────────────
                _menuCard(
                  context,
                  title: 'Mock (Timed)',
                  icon: Icons.timer_rounded,
                  color: const Color(0xFF6366F1),
                  onTap: () => context.push(RoutesNames.categoryItemsScreen,
                      extra: 'Timed'),
                ),
                const SizedBox(height: 10),
                _menuCard(
                  context,
                  title: 'Practice Mode',
                  icon: Icons.menu_book_rounded,
                  color: _accent,
                  onTap: () => context.push(RoutesNames.categoryItemsScreen,
                      extra: 'Practice'),
                ),
                const SizedBox(height: 10),
                _menuCard(
                  context,
                  title: 'Subject Wise Notes',
                  icon: Icons.library_books_rounded,
                  color: const Color(0xFF059669),
                  onTap: () => context.push(RoutesNames.categoryItemsScreen,
                      extra: 'Notes'),
                ),
                const SizedBox(height: 10),
                _menuCard(
                  context,
                  title: 'Previous Question Papers',
                  icon: Icons.history_edu_rounded,
                  color: const Color(0xFF7C3AED),
                  onTap: () => context.push(RoutesNames.pyqScreen),
                ),
                const SizedBox(height: 10),
                _menuCard(
                  context,
                  title: 'Leaderboard',
                  icon: Icons.emoji_events_rounded,
                  color: const Color(0xFFD97706),
                  onTap: () => context.push(RoutesNames.leaderboardScreen),
                ),
                const SizedBox(height: 10),
                _menuCard(
                  context,
                  title: 'Random Quiz',
                  icon: Icons.shuffle_rounded,
                  color: const Color(0xFFEF4444),
                  onTap: null,
                  isComingSoon: true,
                ),
                const SizedBox(height: 24),
                const BannerAdWidget(),
              ],
            ),
          );
        },
      ),
    );
  }

  // ─── Daily Challenge Banner ──────────────────────────────────────────────
  Widget _buildDailyChallengeBanner(
      BuildContext context, int currentStreak) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [_navyDark, _navyMid, Color(0xFF1E40AF)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: _navyMid.withValues(alpha: 0.3),
            blurRadius: 14,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              shape: BoxShape.circle,
            ),
            child:
                const Icon(Icons.flash_on, color: Colors.amber, size: 24),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Daily Challenge',
                  style: GoogleFonts.inter(
                    color: Colors.white,
                    fontWeight: FontWeight.w700,
                    fontSize: 15,
                  ),
                ),
                const SizedBox(height: 3),
                Row(
                  children: [
                    Icon(
                      Icons.local_fire_department_rounded,
                      color: currentStreak > 0
                          ? Colors.orange
                          : Colors.white38,
                      size: 13,
                    ),
                    const SizedBox(width: 4),
                    Text(
                      currentStreak > 0
                          ? '$currentStreak Day Streak!'
                          : 'Complete and earn 2x Coins',
                      style: GoogleFonts.inter(
                        color: currentStreak > 0
                            ? Colors.orange.shade200
                            : Colors.white60,
                        fontSize: 11,
                        fontWeight: currentStreak > 0
                            ? FontWeight.w600
                            : FontWeight.w400,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.amber,
              foregroundColor: _navyDark,
              elevation: 0,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              padding: const EdgeInsets.symmetric(
                  horizontal: 16, vertical: 10),
            ),
            onPressed: () {
              context.read<QuizzesCubit>().changePracticeMode('Timed');
              context.push(RoutesNames.quizPlayScreen,
                  extra: 'daily-challenge');
            },
            child: Text(
              'Start',
              style: GoogleFonts.inter(
                color: _navyDark,
                fontWeight: FontWeight.w700,
                fontSize: 13,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Menu Card ───────────────────────────────────────────────────────────
  Widget _menuCard(
    BuildContext context, {
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback? onTap,
    bool isComingSoon = false,
  }) {
    return GestureDetector(
      onTap: () {
        if (isComingSoon) {
          ScaffoldMessenger.of(context)
            ..clearSnackBars()
            ..showSnackBar(
              SnackBar(
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.all(16),
                elevation: 0,
                backgroundColor: Colors.transparent,
                duration: const Duration(seconds: 1),
                content: Container(
                  padding: const EdgeInsets.symmetric(
                      horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: const LinearGradient(
                        colors: [_navyDark, _navyMid]),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.rocket_launch_rounded,
                          color: Colors.white, size: 18),
                      const SizedBox(width: 10),
                      Text(
                        'This feature is coming soon!',
                        style: GoogleFonts.inter(
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
        } else {
          onTap?.call();
        }
      },
      child: Container(
        padding: const EdgeInsets.all(16),
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
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Text(
                title,
                style: GoogleFonts.inter(
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                  color: _textPrimary,
                ),
              ),
            ),
            if (isComingSoon)
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                decoration: BoxDecoration(
                  color: Colors.orange.shade50,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.orange.shade200),
                ),
                child: Text(
                  'SOON',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    fontWeight: FontWeight.w800,
                    color: Colors.orange.shade700,
                    letterSpacing: 0.5,
                  ),
                ),
              )
            else
              Container(
                width: 32,
                height: 32,
                decoration: BoxDecoration(
                  color: _accentLight,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(
                  Icons.arrow_forward_ios_rounded,
                  color: _accent,
                  size: 14,
                ),
              ),
          ],
        ),
      ),
    );
  }
}
