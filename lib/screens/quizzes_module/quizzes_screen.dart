import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';


import 'package:mission_vardi/screens/profile_module/profile_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/common_widgets/banner_ad_widget.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';

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
    // Watch LanguageCubit to trigger an instant rebuild when language changes

    
    // Watch ProfileCubit to get the current streak
    final profileState = context.watch<ProfileCubit>().state;
    final int currentStreak = profileState.profileData?.stats?['current_streak_days'] ?? 0;
    
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: "Exam & Practice Center",
        titleIcon: Icons.quiz,
      ),
      body: BlocBuilder<QuizzesCubit, QuizzesState>(
        builder: (context, state) {
          if (state.isLoading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }

          return SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  /// Banner
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0D47A1), Color(0xFF1E88E5)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(15),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.blue.withOpacity(0.2),
                          blurRadius: 8,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.flash_on,
                            color: Colors.amber,
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 15),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                "Daily Challenge Available!",
                                style: commonTextStyle.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Icon(Icons.local_fire_department_rounded, 
                                      color: currentStreak > 0 ? Colors.orange : Colors.grey.shade400, 
                                      size: 14),
                                  const SizedBox(width: 4),
                                  Text(
                                    currentStreak > 0
                                      ? '$currentStreak Day Streak!'
                                      : "Complete and win 2x Coins",
                                    style: commonTextStyle.copyWith(
                                      color: currentStreak > 0 ? Colors.orange.shade200 : Colors.white70,
                                      fontSize: 12,
                                      fontWeight: currentStreak > 0 ? FontWeight.bold : FontWeight.normal,
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
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(20),
                            ),
                          ),
                          onPressed: () {
                            context.read<QuizzesCubit>().changePracticeMode("Timed");
                            context.push(RoutesNames.quizPlayScreen, extra: 'daily-challenge');
                          },
                          child: Text(
                            "Start",
                            style: commonTextStyle.copyWith(
                              color: const Color(0xFF0A2540),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  /// ── PYQ Banner ──────────────────────────────────────────
                  GestureDetector(
                    onTap: () => context.push(RoutesNames.pyqScreen),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        gradient: const LinearGradient(
                          colors: [Color(0xFF4A148C), Color(0xFF7B1FA2)],
                          begin: Alignment.topLeft,
                          end: Alignment.bottomRight,
                        ),
                        borderRadius: BorderRadius.circular(15),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.purple.withOpacity(0.25),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.history_edu_rounded,
                              color: Colors.white,
                              size: 26,
                            ),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Previous Year Question Papers',
                                style: commonTextStyle.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.bold,
                                    fontSize: 15,
                                  ),
                                ),
                                const SizedBox(height: 3),
                                Text(
                                  '2021 – 2024  |  7 Papers Available',
                                  style: commonTextStyle.copyWith(
                                    color: Colors.white70,
                                    fontSize: 12,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              children: [
                                Text(
                                  'View',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontFamily: 'Outfit',
                                    fontWeight: FontWeight.bold,
                                    fontSize: 13,
                                  ),
                                ),
                                const SizedBox(width: 4),
                                const Icon(Icons.arrow_forward_ios_rounded,
                                    color: Colors.white, size: 12),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  /// Practice mode
                  Text(
                    "Select Practice Mode",
                    style: commonTextStyle.copyWith(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 10),

                  Row(
                    children: [
                      _ModeCard(
                        icon: Icons.timer,
                        title: "Mock (Timed)",
                        isSelected: state.selectedPracticeMode == "Timed",
                        onTap: () {
                          context
                              .read<QuizzesCubit>()
                              .changePracticeMode("Timed");
                        },
                      ),
                      const SizedBox(width: 10),
                      _ModeCard(
                        icon: Icons.menu_book,
                        title: "Practice Mode",
                        isSelected: state.selectedPracticeMode == "Practice",
                        onTap: () {
                          context
                              .read<QuizzesCubit>()
                              .changePracticeMode("Practice");
                        },
                      ),
                      const SizedBox(width: 10),
                      _ModeCard(
                        icon: Icons.shuffle,
                        title: "Random Quiz",
                        isSelected: state.selectedPracticeMode == "Random",
                        onTap: () {
                          context
                              .read<QuizzesCubit>()
                              .changePracticeMode("Random");
                        },
                        isComingSoon: true,
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  /// Categories
                  Text(
                    "Choose Quiz Subject",
                    style: commonTextStyle.copyWith(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),

                  const SizedBox(height: 10),

                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 3,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.78,
                    ),
                    itemCount: state.data.length,
                    itemBuilder: (context, index) {
                      final item = state.data[index];

                      Color cardColor = Colors.blue.shade400;
                      IconData cardIcon = Icons.quiz;

                      final category = item.category ?? "";
                      if (category == "GK & Updates" ||
                          category == "General Knowledge" ||
                          category == "Police Bharti") {
                        cardColor = Colors.red.shade400;
                        cardIcon = Icons.public;
                      } else if (category == "Marathi Grammar") {
                        cardColor = Colors.teal.shade400;
                        cardIcon = Icons.translate;
                      } else if (category == "Mathematics") {
                        cardColor = Colors.orange.shade400;
                        cardIcon = Icons.calculate;
                      } else if (category == "Intellectual Ability") {
                        cardColor = Colors.purple.shade400;
                        cardIcon = Icons.psychology;
                      }

                      return _CategoryCard(
                        title: item.title ?? "",
                        titleMr: item.title ?? "",
                        color: cardColor,
                        icon: cardIcon,
                        count: item.type ?? "Mock Test",
                        onTap: () => context.push(RoutesNames.quizPlayScreen,
                            extra: item.id),
                      );
                    },
                  ),
                  const SizedBox(height: 20),

                  const BannerAdWidget(),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}

class _ModeCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final bool isSelected;
  final VoidCallback onTap;
  final bool isComingSoon;

  const _ModeCard({
    required this.icon,
    required this.title,
    required this.isSelected,
    required this.onTap,
    this.isComingSoon = false,
  });

  @override
  Widget build(BuildContext context) {
    final bool isDisabled = isComingSoon;

    return Expanded(
      child: GestureDetector(
        onTap: () {
          if (isDisabled) {
            ScaffoldMessenger.of(context).clearSnackBars();

            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                behavior: SnackBarBehavior.floating,
                margin: const EdgeInsets.all(16),
                elevation: 0,
                backgroundColor: Colors.transparent,
                duration: const Duration(seconds: 1),
                content: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: LinearGradient(
                      colors: [
                        Constants.primaryBlueColour,
                        Constants.primaryBlueColour.withOpacity(0.85),
                      ],
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Constants.primaryBlueColour.withOpacity(0.25),
                        blurRadius: 12,
                        offset: const Offset(0, 5),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.rocket_launch_rounded,
                          color: Colors.white, size: 20),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          "This feature is coming soon!",
                          style: commonTextStyle.copyWith(
                            color: Colors.white,
                            fontWeight: FontWeight.w600,
                            fontSize: 13,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            );
          } else {
            onTap();
          }
        },
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeInOut,
          padding: const EdgeInsets.all(2),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: isSelected && !isDisabled
                ? LinearGradient(
                    colors: [
                      Constants.primaryBlueColour,
                      Constants.primaryBlueColour.withOpacity(0.75),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  )
                : null,
            boxShadow: [
              BoxShadow(
                color: isSelected
                    ? Constants.primaryBlueColour.withOpacity(0.22)
                    : Colors.black.withOpacity(0.05),
                blurRadius: isSelected ? 14 : 8,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Container(
            padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 10),
            decoration: BoxDecoration(
              color: isDisabled
                  ? Colors.grey.shade100
                  : (isSelected ? Colors.transparent : Colors.white),
              borderRadius: BorderRadius.circular(18),
              border: Border.all(
                color: isSelected ? Colors.transparent : Colors.grey.shade200,
              ),
            ),
            child: Stack(
              clipBehavior: Clip.none,
              alignment: Alignment.center,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: isDisabled
                            ? Colors.grey.shade200
                            : (isSelected
                                ? Colors.white.withOpacity(0.18)
                                : Constants.primaryBlueColour
                                    .withOpacity(0.08)),
                      ),
                      child: Icon(
                        icon,
                        size: 24,
                        color: isDisabled
                            ? Colors.grey.shade400
                            : (isSelected
                                ? Colors.white
                                : Constants.primaryBlueColour),
                      ),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      title,
                      textAlign: TextAlign.center,
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis,
                      style: commonTextStyle.copyWith(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        height: 1.3,
                        color: isDisabled
                            ? Colors.grey.shade500
                            : (isSelected ? Colors.white : Colors.black87),
                      ),
                    ),
                  ],
                ),

                /// Coming Soon Badge
                if (isComingSoon)
                  Positioned(
                    top: -12,
                    right: -8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          colors: [
                            Colors.orange.shade400,
                            Colors.red.shade400,
                          ],
                        ),
                        borderRadius: BorderRadius.circular(30),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.red.withOpacity(0.25),
                            blurRadius: 8,
                            offset: const Offset(0, 3),
                          ),
                        ],
                      ),
                      child: Text(
                        "SOON",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.6,
                        ),
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final String title;
  final String titleMr;
  final Color color;
  final IconData icon;
  final String count;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.title,
    required this.titleMr,
    required this.color,
    required this.icon,
    required this.count,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isMarathi = false;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(6),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    count,
                    textAlign: TextAlign.end,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: commonTextStyle.copyWith(
                        fontSize: 10,
                        color: Colors.grey,
                        fontWeight: FontWeight.bold),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isMarathi ? titleMr : title,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: commonTextStyle.copyWith(
                      fontWeight: FontWeight.bold, fontSize: 13),
                ),
                const SizedBox(height: 3),
                Row(
                  children: [
                    Text(
                      "Start now",
                      style: commonTextStyle.copyWith(
                          fontSize: 11,
                          color: Constants.primaryBlueColour,
                          fontWeight: FontWeight.bold),
                    ),
                    Icon(Icons.arrow_forward,
                        size: 10, color: Constants.primaryBlueColour),
                  ],
                )
              ],
            ),
          ],
        ),
      ),
    );
  }
}
