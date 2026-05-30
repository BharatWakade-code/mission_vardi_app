import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';


import 'package:mission_vardi/screens/vardi_home_module/vardi_home_cubit.dart';
import 'package:mission_vardi/screens/current_affairs_module/current_affairs_cubit.dart';
import 'package:mission_vardi/screens/current_affairs_module/current_affairs_state.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_cubit.dart';
import 'package:mission_vardi/utils/common_widgets/commonTextField.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/download_service.dart';

class FarmerHomeScreen extends StatefulWidget {
  const FarmerHomeScreen({super.key});

  @override
  State<FarmerHomeScreen> createState() => _FarmerHomeScreenState();
}

class _FarmerHomeScreenState extends State<FarmerHomeScreen> {
  // App Toggles (Active simulation)
  bool isDarkMode = false;
  bool isOfflineMode = false;
  bool isLowDataMode = false;
  bool isUpdateDismissed = false;

  // Selection states
  // Removed district string
  String searchQuery = "";

  // Controllers
  final TextEditingController searchController = TextEditingController();
  Timer? _searchDebounce;

  // Dynamic Quote State
  int quoteIndex = 0;
  final List<Map<String, String>> quotes = [
    {
      "en":
          "“Duty, Honor, Courage. The uniform is not a job, it's a responsibility.”",
      "mr": "“कर्तव्य, सन्मान, धाडस. वर्दी ही नोकरी नाही, ती एक जबाबदारी आहे.”"
    },
    {
      "en": "“Sweat more in training, bleed less in battle.”",
      "mr": "“सराव करताना जास्त घाम गाळा, जेणेकरून युद्धात कमी रक्त सांडेल.”"
    },
    {
      "en":
          "“Success isn't given. It's earned. On the track and in the books.”",
      "mr": "“यश मिळत नाही, ते मिळवावे लागते. धावपट्टीवर आणि पुस्तकांमध्ये.”"
    }
  ];

  // Exam Countdown (Remaining duration mock: ~4 months, 12 days, 4 hours)
  late Timer countdownTimer;
  int daysLeft = 132;
  int hoursLeft = 4;
  int minutesLeft = 35;
  int secondsLeft = 19;

  @override
  void initState() {
    super.initState();
    context.read<VardiHomeCubit>().getPDFNotesAndSolvedPapers();
    context.read<VardiHomeCubit>().getGlobalData();
    context.read<CurrentAffairsCubit>().loadCurrentAffairs();

    // Ticking seconds countdown
    countdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
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
                if (daysLeft > 0) {
                  daysLeft--;
                }
              }
            }
          }
        });
      }
    });
  }

  @override
  void dispose() {
    countdownTimer.cancel();
    _searchDebounce?.cancel();
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeColor = isDarkMode ? const Color(0xFF121212) : const Color(0xFFF3F4F6); // Soft gray background

    return Scaffold(
      backgroundColor: themeColor,
      appBar: homeAppBar(),
      body: SafeArea(
        child: RefreshIndicator(
          color: Constants.primaryBlueColour,
          onRefresh: () async {
            context.read<VardiHomeCubit>().getGlobalData();
            context.read<VardiHomeCubit>().getPDFNotesAndSolvedPapers();
            context.read<CurrentAffairsCubit>().loadCurrentAffairs();
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.only(left: 16, right: 16, top: 10, bottom: 30),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildGreetingAndCountdown(),
                const SizedBox(height: 24),
                _buildQuickActionGrid(),
                const SizedBox(height: 24),
                _buildBhartiInfoBanner(isDarkMode),
                const SizedBox(height: 24),
                _buildMotivationCard(),
                const SizedBox(height: 24),
                _buildGlobalAlerts(),
                _trendingCurrentAffairs(),
                const SizedBox(height: 24),
                _buildSectionTitle('📚 PDF Notes & Solved Papers', 'Download and study offline'),
                const SizedBox(height: 12),
                _pdfNotesLibrary(),
                const SizedBox(height: 24),
                if ((context.watch<VardiHomeCubit>().state.leaderboard ?? []).isNotEmpty) ...[
                  _buildSectionTitle('🏆 Global Leaderboard', 'Top performers this week'),
                  const SizedBox(height: 12),
                  _leaderboardList(),
                ]
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ─── Modern Hero Countdown ──────────────────────────────────────────────────
  Widget _buildGreetingAndCountdown() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF1E3A8A)], // Deep Navy to Royal Blue
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF1E3A8A).withOpacity(0.3),
            blurRadius: 15,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome, Future Officer! 🇮🇳',
                    style: commonTextStyle.copyWith(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Your dream uniform awaits.',
                    style: commonTextStyle.copyWith(
                      color: Colors.blue.shade100,
                      fontSize: 12,
                    ),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.local_police_rounded, color: Colors.amber, size: 28),
              )
            ],
          ),
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 16),
            child: Divider(color: Colors.white24, height: 1),
          ),
          Center(
            child: Text(
              'MAHARASHTRA POLICE BHARTI EXAM',
              style: commonTextStyle.copyWith(
                color: Colors.white70,
                fontSize: 10,
                fontWeight: FontWeight.bold,
                letterSpacing: 1.2,
              ),
            ),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              _modernTimerDigit(daysLeft.toString(), 'Days'),
              _timerColon(),
              _modernTimerDigit(hoursLeft.toString().padLeft(2, '0'), 'Hrs'),
              _timerColon(),
              _modernTimerDigit(minutesLeft.toString().padLeft(2, '0'), 'Min'),
              _timerColon(),
              _modernTimerDigit(secondsLeft.toString().padLeft(2, '0'), 'Sec'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _modernTimerDigit(String value, String label) {
    return Column(
      children: [
        Container(
          width: 55,
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.15),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withOpacity(0.3)),
          ),
          child: Center(
            child: Text(
              value,
              style: GoogleFonts.shareTechMono(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
          ),
        ),
        const SizedBox(height: 6),
        Text(
          label.toUpperCase(),
          style: commonTextStyle.copyWith(
            fontSize: 9,
            color: Colors.blue.shade200,
            fontWeight: FontWeight.bold,
            letterSpacing: 1,
          ),
        ),
      ],
    );
  }

  Widget _timerColon() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Text(
        ':',
        style: GoogleFonts.shareTechMono(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Colors.white54,
        ),
      ),
    );
  }

  // ─── Quick Actions Grid ─────────────────────────────────────────────────────
  Widget _buildQuickActionGrid() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionTitle('⚡ Quick Actions', 'What do you want to practice today?'),
        const SizedBox(height: 16),
        GridView.count(
          crossAxisCount: 2,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          mainAxisSpacing: 14,
          crossAxisSpacing: 14,
          childAspectRatio: 1.8,
          children: [
            _actionCard(
              title: 'Mock Quizzes',
              subtitle: 'Test your skills',
              icon: Icons.quiz_rounded,
              gradient: const [Color(0xFF6366F1), Color(0xFF4338CA)], // Indigo
              onTap: () => context.read<VardiDashboardCubit>().onChangeIndex(1),
            ),
            _actionCard(
              title: 'Physical Test',
              subtitle: 'Track your run',
              icon: Icons.directions_run_rounded,
              gradient: const [Color(0xFF10B981), Color(0xFF047857)], // Emerald
              onTap: () => context.read<VardiDashboardCubit>().onChangeIndex(2),
            ),
            _actionCard(
              title: 'Daily News',
              subtitle: 'Stay updated',
              icon: Icons.newspaper_rounded,
              gradient: const [Color(0xFFF59E0B), Color(0xFFB45309)], // Amber
              onTap: () => context.read<VardiDashboardCubit>().onChangeIndex(3),
            ),
            _actionCard(
              title: 'My Profile',
              subtitle: 'View progress',
              icon: Icons.person_rounded,
              gradient: const [Color(0xFFEC4899), Color(0xFFBE185D)], // Pink
              onTap: () => context.read<VardiDashboardCubit>().onChangeIndex(4),
            ),
          ],
        ),
      ],
    );
  }

  Widget _actionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required List<Color> gradient,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: gradient,
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [
            BoxShadow(
              color: gradient.last.withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            children: [
              // Decorative large background icon
              Positioned(
                right: -15,
                bottom: -15,
                child: Icon(icon, size: 80, color: Colors.white.withOpacity(0.15)),
              ),
              Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(icon, color: Colors.white, size: 22),
                    ),
                    const Spacer(),
                    Text(
                      title,
                      style: commonTextStyle.copyWith(
                        fontWeight: FontWeight.bold,
                        fontSize: 14,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: commonTextStyle.copyWith(
                        fontSize: 10,
                        color: Colors.white.withOpacity(0.8),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Motivation Card ────────────────────────────────────────────────────────
  Widget _buildMotivationCard() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.format_quote_rounded, color: Colors.amber.shade600, size: 36),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Daily Motivation",
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 11,
                    color: Colors.grey.shade600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  quotes[quoteIndex]["en"]!,
                  style: commonTextStyle.copyWith(
                    fontStyle: FontStyle.italic,
                    fontSize: 14,
                    height: 1.4,
                    fontWeight: FontWeight.w600,
                    color: isDarkMode ? Colors.white : const Color(0xFF1F2937),
                  ),
                ),
                const SizedBox(height: 10),
                GestureDetector(
                  onTap: () {
                    setState(() {
                      quoteIndex = (quoteIndex + 1) % quotes.length;
                    });
                  },
                  child: Row(
                    children: [
                      Icon(Icons.refresh_rounded, size: 14, color: Constants.primaryBlueColour),
                      const SizedBox(width: 4),
                      Text(
                        "Next Quote",
                        style: commonTextStyle.copyWith(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: Constants.primaryBlueColour,
                        ),
                      ),
                    ],
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── Global Alerts ──────────────────────────────────────────────────────────
  Widget _buildGlobalAlerts() {
    final state = context.watch<VardiHomeCubit>().state;
    final alerts = state.alerts ?? [];
    if (alerts.isEmpty) return const SizedBox.shrink();

    final latest = alerts.first;
    final message = latest['message_en'] ?? "New updates available.";

    return Container(
      margin: const EdgeInsets.only(bottom: 24),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.red.shade50,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.red.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.red.shade100,
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.campaign_rounded, color: Colors.red.shade700, size: 24),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Official Alert',
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                    color: Colors.red.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  message,
                  style: commonTextStyle.copyWith(
                    fontSize: 13,
                    color: Colors.red.shade900,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── Trending Affairs ───────────────────────────────────────────────────────
  Widget _trendingCurrentAffairs() {
    return BlocBuilder<CurrentAffairsCubit, CurrentAffairsState>(
      builder: (context, state) {
        final trendingArticles = state.articles.where((a) => a.isTrending).toList();
        if (trendingArticles.isEmpty) return const SizedBox();

        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildSectionTitle('🔥 Trending News', 'Important updates for exams'),
                GestureDetector(
                  onTap: () => context.read<VardiDashboardCubit>().onChangeIndex(3),
                  child: Text(
                    'View All',
                    style: commonTextStyle.copyWith(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Constants.primaryBlueColour,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            ListView.separated(
              itemCount: trendingArticles.take(2).length,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final article = trendingArticles[index];
                
                return InkWell(
                  onTap: () => context.push('/currentAffairsDetailScreen', extra: article),
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    decoration: BoxDecoration(
                      color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          if (article.imageUrl != null && article.imageUrl!.isNotEmpty)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(12),
                              child: Image.network(
                                article.imageUrl!,
                                width: 80,
                                height: 80,
                                fit: BoxFit.cover,
                              ),
                            )
                          else
                            Container(
                              width: 80,
                              height: 80,
                              decoration: BoxDecoration(
                                color: Colors.blue.shade50,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Icon(Icons.newspaper_rounded, color: Colors.blue.shade300, size: 30),
                            ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  article.titleEn,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: commonTextStyle.copyWith(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                    height: 1.2,
                                    color: isDarkMode ? Colors.white : const Color(0xFF111827),
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Row(
                                  children: [
                                    Icon(Icons.local_fire_department_rounded, color: Colors.orange.shade600, size: 14),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Trending Now',
                                      style: commonTextStyle.copyWith(
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold,
                                        color: Colors.orange.shade700,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        );
      },
    );
  }

  // ─── PDF Library ────────────────────────────────────────────────────────────
  Widget _pdfNotesLibrary() {
    final state = context.watch<VardiHomeCubit>().state;
    final papers = state.data ?? [];

    return Column(
      children: [
        Container(
          height: 48,
          decoration: BoxDecoration(
            color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.04),
                blurRadius: 8,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: CommonTextFormField(
            controller: searchController,
            onChanged: (val) {
              setState(() => searchQuery = val);
              _searchDebounce?.cancel();
              _searchDebounce = Timer(const Duration(milliseconds: 500), () {
                if (mounted) {
                  context.read<VardiHomeCubit>().getPDFNotesAndSolvedPapers(search: val);
                }
              });
            },
            hintText: 'Search Notes & Previous Papers...',
            prefixIcon: Icons.search_rounded,
          ),
        ),
        const SizedBox(height: 16),
        if (state.isLoading)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(child: CircularProgressIndicator()),
          )
        else if (papers.isEmpty)
          Center(
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24),
              child: Column(
                children: [
                  Icon(Icons.search_off_rounded, size: 48, color: Colors.grey.shade400),
                  const SizedBox(height: 12),
                  Text(
                    'No documents found',
                    style: commonTextStyle.copyWith(
                      color: Colors.grey.shade600,
                      fontWeight: FontWeight.bold,
                      fontSize: 14,
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ListView.separated(
            itemCount: papers.length,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final item = papers[index];
              return InkWell(
                onTap: () {
                  context.push(
                    RoutesNames.pdfViewerScreen,
                    extra: {
                      'pdfUrl': item.pdfUrl ?? '',
                      'title': item.title ?? '',
                      'description': item.description ?? '',
                    },
                  );
                },
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  decoration: BoxDecoration(
                    color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.04),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.red.shade50,
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(Icons.picture_as_pdf_rounded, color: Colors.red.shade600, size: 28),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title ?? 'Untitled Document',
                                style: commonTextStyle.copyWith(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 14,
                                  color: isDarkMode ? Colors.white : const Color(0xFF111827),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item.description ?? 'No description available.',
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: commonTextStyle.copyWith(
                                  fontSize: 11,
                                  color: Colors.grey.shade600,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 12),
                        IconButton(
                          style: IconButton.styleFrom(
                            backgroundColor: Colors.blue.shade50,
                            foregroundColor: Constants.primaryBlueColour,
                          ),
                          onPressed: () async {
                            await DownloadService.downloadPDF(
                              context: context,
                              url: item.pdfUrl ?? '',
                              title: item.title ?? '',
                            );
                          },
                          icon: const Icon(Icons.file_download_outlined),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
      ],
    );
  }

  // ─── Global Leaderboard ─────────────────────────────────────────────────────
  Widget _leaderboardList() {
    final state = context.watch<VardiHomeCubit>().state;
    final List<dynamic> leaders = state.leaderboard ?? [];

    return Container(
      decoration: BoxDecoration(
        color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListView.separated(
        itemCount: leaders.length,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        separatorBuilder: (_, __) => Divider(height: 1, color: Colors.grey.shade100),
        itemBuilder: (context, index) {
          final item = leaders[index];
          final isTopRank = index == 0;
          final isSecond = index == 1;
          final isThird = index == 2;

          Color rankColor = Colors.grey.shade500;
          if (isTopRank) rankColor = Colors.amber;
          if (isSecond) rankColor = Colors.grey.shade400; // Silver
          if (isThird) rankColor = Colors.orange.shade300; // Bronze

          return ListTile(
            contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
            leading: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "#${index + 1}",
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                    color: rankColor,
                  ),
                ),
                const SizedBox(width: 12),
                CircleAvatar(
                  radius: 18,
                  backgroundColor: rankColor.withOpacity(0.2),
                  child: Icon(
                    isTopRank ? Icons.emoji_events_rounded : Icons.person_rounded,
                    color: rankColor,
                    size: 20,
                  ),
                ),
              ],
            ),
            title: Text(
              item["name"] ?? "Unknown User",
              style: commonTextStyle.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 13,
                color: isDarkMode ? Colors.white : const Color(0xFF111827),
              ),
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.blue.shade50,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(
                "${item["score_str"] ?? "0"} Pts",
                style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Constants.primaryBlueColour,
                  fontSize: 11,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  // ─── Bharti Banner ──────────────────────────────────────────────────────────
  Widget _buildBhartiInfoBanner(bool isDarkMode) {
    return InkWell(
      onTap: () => context.push(RoutesNames.policeBhartiInfoScreen),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          color: const Color(0xFF0D9488), // Teal color for a fresh look
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF0D9488).withOpacity(0.3),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Stack(
          children: [
            Positioned(
              right: -10,
              top: -20,
              child: Icon(Icons.article_rounded, size: 100, color: Colors.white.withOpacity(0.1)),
            ),
            Padding(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.menu_book_rounded, color: Color(0xFF0D9488), size: 28),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Police Bharti Complete Guide',
                          style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 15,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Syllabus, Age limit, Salary & more',
                          style: commonTextStyle.copyWith(
                            fontSize: 11,
                            color: Colors.white.withOpacity(0.9),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const Icon(Icons.arrow_forward_ios_rounded, color: Colors.white, size: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ─── Helper: App Bar ──────────────────────────────────────────────────────
  CustomAppBar homeAppBar() {
    return const CustomAppBar(
      titleText: "Mission Vardi",
      titleIcon: Icons.shield_rounded,
    );
  }

  // ─── Helper: Section Title ────────────────────────────────────────────────
  Widget _buildSectionTitle(String title, String subtitle) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          title,
          style: commonTextStyle.copyWith(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: isDarkMode ? Colors.white : const Color(0xFF111827),
          ),
        ),
        const SizedBox(height: 2),
        Text(
          subtitle,
          style: commonTextStyle.copyWith(
            fontSize: 11,
            color: Colors.grey.shade600,
          ),
        ),
      ],
    );
  }
}

