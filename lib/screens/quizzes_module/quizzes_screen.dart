import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/screens/quizzes_module/quiz_play_screen.dart';
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
  }

  @override
  Widget build(BuildContext context) {
    final isMarathi =
        context.watch<LanguageCubit>().state.locale.languageCode == 'mr';

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText:
            isMarathi ? 'परीक्षा आणि सराव केंद्र' : 'Exam & Practice Center',
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
                                isMarathi
                                    ? "दैनिक आव्हान क्विझ उपलब्ध!"
                                    : "Daily Challenge Available!",
                                style: commonTextStyle.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                isMarathi
                                    ? "पूर्ण करा आणि दुपटीने गुण मिळवा"
                                    : "Complete and win 2x Coins",
                                style: commonTextStyle.copyWith(
                                  color: Colors.white70,
                                  fontSize: 12,
                                ),
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
                          onPressed: () {},
                          child: Text(
                            isMarathi ? "सुरू करा" : "Start",
                            style: commonTextStyle.copyWith(
                              color: const Color(0xFF0A2540),
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  /// Practice mode
                  Text(
                    isMarathi ? "सराव प्रकार निवडा" : "Select Practice Mode",
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
                        title: isMarathi ? "वेळेनुसार (Mock)" : "Mock (Timed)",
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
                        title: isMarathi ? "सराव पद्धत" : "Practice Mode",
                        isSelected: state.selectedPracticeMode == "Practice",
                        onTap: () {
                          context
                              .read<QuizzesCubit>()
                              .changePracticeMode("Practice");
                        },
                        isComingSoon: true,
                      ),
                      const SizedBox(width: 10),
                      _ModeCard(
                        icon: Icons.shuffle,
                        title: isMarathi ? "रँडम टेस्ट" : "Random Quiz",
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
                    isMarathi ? "विषय निवडा" : "Choose Quizz Subject",
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
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 1.4,
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
    final isMarathi =
        context.watch<LanguageCubit>().state.locale.languageCode == 'mr';

    return Expanded(
      child: GestureDetector(
        onTap: () {
          if (isComingSoon) {
            ScaffoldMessenger.of(context).clearSnackBars();
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  isMarathi ? "लवकरच येत आहे! 🚀" : "Coming soon! 🚀",
                  style: commonTextStyle.copyWith(
                      color: Colors.white, fontWeight: FontWeight.bold),
                ),
                backgroundColor: Constants.primaryBlueColour,
                duration: const Duration(seconds: 1),
              ),
            );
          } else {
            onTap();
          }
        },
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
              decoration: BoxDecoration(
                color: isComingSoon
                    ? Colors.grey.shade100
                    : (isSelected ? Constants.primaryBlueColour : Colors.white),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(
                  color: isSelected
                      ? Colors.transparent
                      : (isComingSoon
                          ? Colors.grey.shade200
                          : Colors.grey.shade300),
                ),
                boxShadow: (isSelected && !isComingSoon)
                    ? [
                        BoxShadow(
                          color: Colors.blue.withOpacity(0.3),
                          blurRadius: 6,
                          offset: const Offset(0, 3),
                        ),
                      ]
                    : [],
              ),
              child: Column(
                children: [
                  Icon(
                    icon,
                    color: isComingSoon
                        ? Colors.grey.shade400
                        : (isSelected ? Colors.white : Colors.grey),
                    size: 24,
                  ),
                  const SizedBox(height: 6),
                  Text(
                    title,
                    textAlign: TextAlign.center,
                    style: commonTextStyle.copyWith(
                      fontSize: 11,
                      fontWeight: FontWeight.bold,
                      color: isComingSoon
                          ? Colors.grey.shade400
                          : (isSelected ? Colors.white : Colors.black87),
                    ),
                  ),
                ],
              ),
            ),
            if (isComingSoon)
              Positioned(
                top: -5,
                right: -3,
                child: Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: Colors.red.shade400,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    isMarathi ? "लवकरच" : "Soon",
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 7,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
          ],
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
    final isMarathi =
        context.watch<LanguageCubit>().state.locale.languageCode == 'mr';

    return Container(
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
              Text(
                count,
                style: commonTextStyle.copyWith(
                    fontSize: 10,
                    color: Colors.grey,
                    fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 10),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                isMarathi ? titleMr : title,
                style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 3),
              GestureDetector(
                onTap: onTap,
                child: Row(
                  children: [
                    Text(
                      isMarathi ? "सुरू करा" : "Start now",
                      style: commonTextStyle.copyWith(
                          fontSize: 11,
                          color: Constants.primaryBlueColour,
                          fontWeight: FontWeight.bold),
                    ),
                    Icon(Icons.arrow_forward,
                        size: 10, color: Constants.primaryBlueColour),
                  ],
                ),
              )
            ],
          ),
        ],
      ),
    );
  }
}
