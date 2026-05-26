import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
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
    final isMarathi =
        context.watch<LanguageCubit>().state.locale.languageCode == 'mr';
    final themeColor = isDarkMode
        ? const Color(0xFF121212)
        : Constants.scaffoldBackgroundColour;

    return Scaffold(
      backgroundColor: themeColor,
      appBar: homeAppBar(isMarathi),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 🔔 Dismissible App Update Alert
              if (!isUpdateDismissed)
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 15),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade100,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.amber.shade300),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.system_update_alt,
                          color: Colors.amber, size: 28),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isMarathi
                                  ? "नवीन अपडेट उपलब्ध (v2.0)"
                                  : "App Update Available (v2.0)",
                              style: commonTextStyle.copyWith(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                  color: Colors.amber.shade900),
                            ),
                            Text(
                              isMarathi
                                  ? "नवीन प्रश्नपत्रिका आणि जलद मॉक टेस्ट समाविष्ट!"
                                  : "Contains 2026 Solved Papers & Speed Timers.",
                              style: commonTextStyle.copyWith(
                                  fontSize: 11, color: Colors.amber.shade900),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, size: 18),
                        onPressed: () =>
                            setState(() => isUpdateDismissed = true),
                      )
                    ],
                  ),
                ),

              // ⏰ Exam Countdown Timer Banner
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(color: Colors.grey.shade200),
                  boxShadow: [
                    BoxShadow(
                        color: Colors.black.withOpacity(0.02), blurRadius: 10),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.event,
                            color: Constants.primaryBlueColour, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          isMarathi
                              ? "पोलीस भरती लेखी परीक्षा countdown"
                              : "Maharashtra Police Bharti Exam Timer",
                          style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                            color: isDarkMode ? Colors.white70 : Colors.black87,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _timerDigit(
                            daysLeft.toString(), isMarathi ? "दिवस" : "Days"),
                        _timerDigit(hoursLeft.toString().padLeft(2, '0'),
                            isMarathi ? "तास" : "Hrs"),
                        _timerDigit(minutesLeft.toString().padLeft(2, '0'),
                            isMarathi ? "मिनिटे" : "Mins"),
                        _timerDigit(secondsLeft.toString().padLeft(2, '0'),
                            isMarathi ? "सेकंद" : "Secs"),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 💭 Daily Motivation Quotes Card
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: isDarkMode
                        ? [const Color(0xFF333333), const Color(0xFF1F1F1F)]
                        : [const Color(0xFFE3F2FD), const Color(0xFFBBDEFB)],
                  ),
                  borderRadius: BorderRadius.circular(15),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          isMarathi
                              ? "💡 आजचे प्रेरणादायी विचार"
                              : "💡 Daily Motivation",
                          style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: isDarkMode
                                ? Colors.amber
                                : Colors.blue.shade900,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              quoteIndex = (quoteIndex + 1) % quotes.length;
                            });
                          },
                          child: Icon(Icons.refresh,
                              size: 18,
                              color: isDarkMode
                                  ? Colors.amber
                                  : Colors.blue.shade900),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      isMarathi
                          ? quotes[quoteIndex]["mr"]!
                          : quotes[quoteIndex]["en"]!,
                      textAlign: TextAlign.center,
                      style: commonTextStyle.copyWith(
                        fontStyle: FontStyle.italic,
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: isDarkMode ? Colors.white : Colors.blue.shade900,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // 🚨 Global Bharti Alerts
              if ((context.watch<VardiHomeCubit>().state.alerts ?? [])
                  .isNotEmpty) ...[
                Text(
                  isMarathi ? "पोलीस भरती अपडेट्स" : "Police Bharti Updates",
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: isDarkMode ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 10),
                _globalNewsFeed(isMarathi),
                const SizedBox(height: 20),
              ],

              // 📰 Trending Current Affairs Preview Card
              _trendingCurrentAffairs(isMarathi),

              // 📚 Digital PDF Notes Library & Solved Papers
              Text(
                isMarathi
                    ? "अभ्यास साहित्य आणि पेपर्स"
                    : "PDF Notes & Solved Papers",
                style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: isDarkMode ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 10),
              _pdfNotesLibrary(isMarathi),
              const SizedBox(height: 20),

              // 📊 Global Leaderboard
              if ((context.watch<VardiHomeCubit>().state.leaderboard ?? [])
                  .isNotEmpty) ...[
                Text(
                  isMarathi
                      ? "ग्लोबल लीडरबोर्ड (Leaderboard)"
                      : "Global Leaderboard",
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: isDarkMode ? Colors.white : Colors.black87,
                  ),
                ),
                const SizedBox(height: 10),
                _leaderboardList(isMarathi),
              ],
            ],
          ),
        ),
      ),
    );
  }

  // Header Digit Widget
  Widget _timerDigit(String value, String label) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
          decoration: BoxDecoration(
            color: Constants.primaryBlueColour,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            value,
            style: GoogleFonts.shareTechMono(
              fontSize: 22,
              fontWeight: FontWeight.bold,
              color: Colors.white,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: commonTextStyle.copyWith(
              fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
        ),
      ],
    );
  }

  // App Toggles and Localization
  CustomAppBar homeAppBar(bool isMarathi) {
    return const CustomAppBar(
      titleText: "MISSION VARDI",
      titleIcon: Icons.shield,
    );
  }

  // Dynamic News Feed
  Widget _globalNewsFeed(bool isMarathi) {
    final state = context.watch<VardiHomeCubit>().state;
    final alerts = state.alerts ?? [];

    String message = "";
    if (alerts.isNotEmpty) {
      final latest = alerts.first;
      message = isMarathi
          ? (latest['message_mr'] ?? "")
          : (latest['message_en'] ?? "");
    } else {
      message = isMarathi ? "कोणतेही अपडेट नाही." : "No updates available.";
    }

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: Colors.red.shade100,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.notifications_active,
                color: Colors.red, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isMarathi ? "नवीन अलर्ट" : "New Alert",
                  style: commonTextStyle.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: isDarkMode ? Colors.white : Colors.black87),
                ),
                const SizedBox(height: 3),
                Text(
                  message,
                  style: commonTextStyle.copyWith(
                      fontSize: 12,
                      color: isDarkMode ? Colors.white70 : Colors.black54),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // PDF Notes library with search simulation
  Widget _pdfNotesLibrary(bool isMarathi) {
    final state = context.watch<VardiHomeCubit>().state;
    final papers = state.data ?? [];

    return Column(
      children: [
        // Search notes bar
        Container(
          height: 42,
          margin: const EdgeInsets.only(bottom: 10),
          decoration: BoxDecoration(
            color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey.shade300),
          ),
          child: CommonTextFormField(
            controller: searchController,
            onChanged: (val) {
              setState(() {
                searchQuery = val;
              });
              _searchDebounce?.cancel();
              _searchDebounce = Timer(const Duration(milliseconds: 500), () {
                if (mounted) {
                  context
                      .read<VardiHomeCubit>()
                      .getPDFNotesAndSolvedPapers(search: val);
                }
              });
            },
            hintText: isMarathi
                ? "पीडीएफ नोट्स आणि पेपर्स शोधा..."
                : "Search Notes & PDFs...",
            prefixIcon: Icons.search,
          ),
        ),

        // Loader or content
        if (state.isLoading)
          const Padding(
            padding: EdgeInsets.symmetric(vertical: 24),
            child: Center(
              child: CircularProgressIndicator(),
            ),
          )
        else if (papers.isEmpty)
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 24),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.search_off, size: 48, color: Colors.grey.shade400),
                const SizedBox(height: 8),
                Text(
                  isMarathi ? "कोणतेही निकाल आढळले नाहीत" : "No results found",
                  style: commonTextStyle.copyWith(
                    color: Colors.grey.shade600,
                    fontWeight: FontWeight.bold,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  isMarathi
                      ? "दुसरा शब्द वापरून शोधा"
                      : "Try adjusting your keywords",
                  style: commonTextStyle.copyWith(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          )
        else
          // Notes items
          ListView.separated(
            itemCount: papers.length,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            separatorBuilder: (_, __) => const SizedBox(height: 10),
            itemBuilder: (context, index) {
              final item = papers[index];

              return Container(
                decoration: BoxDecoration(
                  color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: InkWell(
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
                        borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(12),
                          bottomLeft: Radius.circular(12),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            children: [
                              const Icon(Icons.picture_as_pdf,
                                  color: Colors.red, size: 30),
                              const SizedBox(width: 12),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      item.title ?? '',
                                      style: commonTextStyle.copyWith(
                                          fontWeight: FontWeight.bold,
                                          fontSize: 13,
                                          color: isDarkMode
                                              ? Colors.white
                                              : Colors.black87),
                                    ),
                                    const SizedBox(height: 2),
                                    Text(
                                      item.description ?? '',
                                      style: commonTextStyle.copyWith(
                                          fontSize: 11, color: Colors.grey),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Padding(
                      padding: const EdgeInsets.only(right: 12),
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Constants.primaryBlueColour,
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8)),
                          padding: const EdgeInsets.symmetric(horizontal: 10),
                        ),
                        onPressed: () async {
                          await DownloadService.downloadPDF(
                            context: context,
                            url: item.pdfUrl ?? '',
                            title: item.title ?? '',
                          );
                        },
                        child: const Icon(Icons.download,
                            color: Colors.white, size: 18),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
      ],
    );
  }

  // Global Leaderboard Widget
  Widget _leaderboardList(bool isMarathi) {
    final state = context.watch<VardiHomeCubit>().state;
    final List<dynamic> leaders = state.leaderboard ?? [];

    if (leaders.isEmpty) {
      return Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
          borderRadius: BorderRadius.circular(15),
          border: Border.all(color: Colors.grey.shade200),
        ),
        child: Center(
          child: Text(
            isMarathi
                ? "लीडरबोर्ड अद्याप उपलब्ध नाही"
                : "Leaderboard not available yet",
            style: commonTextStyle.copyWith(color: Colors.grey),
          ),
        ),
      );
    }

    return Container(
      decoration: BoxDecoration(
        color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: ListView.separated(
        itemCount: leaders.length,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        separatorBuilder: (_, __) => const Divider(height: 1),
        itemBuilder: (context, index) {
          final item = leaders[index];
          final isTopRank = index == 0;

          return ListTile(
            leading: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  "#${index + 1}",
                  style: commonTextStyle.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 13,
                      color: isDarkMode ? Colors.white70 : Colors.black87),
                ),
                const SizedBox(width: 10),
                Icon(Icons.stars,
                    color: isTopRank ? Colors.amber : Colors.grey.shade400,
                    size: 20),
              ],
            ),
            title: Text(
              item["name"] ?? "Unknown",
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: isDarkMode ? Colors.white : Colors.black87),
            ),
            trailing: Text(
              item["score_str"] ?? "0",
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Constants.primaryBlueColour,
                  fontSize: 13),
            ),
          );
        },
      ),
    );
  }

  // 📰 Beautiful dynamic premium widget for Trending Current Affairs on Dashboard
  Widget _trendingCurrentAffairs(bool isMarathi) {
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
                Text(
                  isMarathi ? "चालू घडामोडी (Trending)" : "Trending Current Affairs",
                  style: commonTextStyle.copyWith(
                    fontWeight: FontWeight.bold,
                    fontSize: 16,
                    color: isDarkMode ? Colors.white : Colors.black87,
                  ),
                ),
                GestureDetector(
                  onTap: () {
                    context.read<VardiDashboardCubit>().onChangeIndex(1);
                  },
                  child: Text(
                    isMarathi ? "सर्व पहा" : "View All",
                    style: commonTextStyle.copyWith(
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      color: Constants.primaryBlueColour,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 10),
            ListView.separated(
              itemCount: trendingArticles.take(2).length,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final article = trendingArticles[index];
                final title = isMarathi ? article.titleMr : article.titleEn;
                final desc = isMarathi ? article.descriptionMr : article.descriptionEn;

                return Container(
                  decoration: BoxDecoration(
                    color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.grey.shade200),
                  ),
                  child: InkWell(
                    onTap: () {
                      context.push('/currentAffairsDetailScreen', extra: article);
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        children: [
                          if (article.imageUrl != null && article.imageUrl!.isNotEmpty)
                            ClipRRect(
                              borderRadius: BorderRadius.circular(8),
                              child: Image.network(
                                article.imageUrl!,
                                width: 70,
                                height: 70,
                                fit: BoxFit.cover,
                              ),
                            )
                          else
                            Container(
                              width: 70,
                              height: 70,
                              decoration: BoxDecoration(
                                color: Colors.blue.shade50,
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: const Icon(Icons.newspaper_rounded, color: Colors.blue),
                            ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: Colors.red.shade50,
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    isMarathi ? "महत्त्वाचे" : "TRENDING",
                                    style: commonTextStyle.copyWith(
                                      fontSize: 8,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.red.shade700,
                                    ),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  title,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: commonTextStyle.copyWith(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 12.5,
                                    color: isDarkMode ? Colors.white : Colors.black87,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  desc,
                                  maxLines: 2,
                                  overflow: TextOverflow.ellipsis,
                                  style: commonTextStyle.copyWith(
                                    fontSize: 11,
                                    color: Colors.grey,
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
              },
            ),
            const SizedBox(height: 20),
          ],
        );
      },
    );
  }
}
