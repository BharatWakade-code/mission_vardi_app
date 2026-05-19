import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';


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
  String selectedDistrict = "Mumbai"; // Mumbai, Nagpur, Pune, Thane
  String searchQuery = "";

  // Controllers
  final TextEditingController searchController = TextEditingController();

  // Dynamic Quote State
  int quoteIndex = 0;
  final List<Map<String, String>> quotes = [
    {
      "en": "“Duty, Honor, Courage. The uniform is not a job, it's a responsibility.”",
      "mr": "“कर्तव्य, सन्मान, धाडस. वर्दी ही नोकरी नाही, ती एक जबाबदारी आहे.”"
    },
    {
      "en": "“Sweat more in training, bleed less in battle.”",
      "mr": "“सराव करताना जास्त घाम गाळा, जेणेकरून युद्धात कमी रक्त सांडेल.”"
    },
    {
      "en": "“Success isn't given. It's earned. On the track and in the books.”",
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
    searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isMarathi = context.watch<LanguageCubit>().state.locale.languageCode == 'mr';
    final themeColor = isDarkMode ? const Color(0xFF121212) : Constants.scaffoldBackgroundColour;

    return Scaffold(
      backgroundColor: themeColor,
      appBar: homeAppBar(isMarathi),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // 🚨 Offline banner if offline
              if (isOfflineMode)
                Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 15),
                  padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.red.shade400,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.wifi_off, color: Colors.white, size: 20),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Text(
                          isMarathi ? "तुम्ही ऑफलाइन आहात. साठवलेला डेटा दर्शविला जात आहे." : "Offline Mode Active. Showing cached study assets.",
                          style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),

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
                      const Icon(Icons.system_update_alt, color: Colors.amber, size: 28),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isMarathi ? "नवीन अपडेट उपलब्ध (v2.0)" : "App Update Available (v2.0)",
                              style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13, color: Colors.amber.shade900),
                            ),
                            Text(
                              isMarathi ? "नवीन प्रश्नपत्रिका आणि जलद मॉक टेस्ट समाविष्ट!" : "Contains 2026 Solved Papers & Speed Timers.",
                              style: commonTextStyle.copyWith(fontSize: 11, color: Colors.amber.shade900),
                            ),
                          ],
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close, size: 18),
                        onPressed: () => setState(() => isUpdateDismissed = true),
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
                    BoxShadow(color: Colors.black.withOpacity(0.02), blurRadius: 10),
                  ],
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.event, color: Constants.primaryBlueColour, size: 20),
                        const SizedBox(width: 8),
                        Text(
                          isMarathi ? "पोलीस भरती लेखी परीक्षा countdown" : "Maharashtra Police Bharti Exam Timer",
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
                        _timerDigit(daysLeft.toString(), isMarathi ? "दिवस" : "Days"),
                        _timerDigit(hoursLeft.toString().padLeft(2, '0'), isMarathi ? "तास" : "Hrs"),
                        _timerDigit(minutesLeft.toString().padLeft(2, '0'), isMarathi ? "मिनिटे" : "Mins"),
                        _timerDigit(secondsLeft.toString().padLeft(2, '0'), isMarathi ? "सेकंद" : "Secs"),
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
                          isMarathi ? "💡 आजचे प्रेरणादायी विचार" : "💡 Daily Motivation",
                          style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 12,
                            color: isDarkMode ? Colors.amber : Colors.blue.shade900,
                          ),
                        ),
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              quoteIndex = (quoteIndex + 1) % quotes.length;
                            });
                          },
                          child: Icon(Icons.refresh, size: 18, color: isDarkMode ? Colors.amber : Colors.blue.shade900),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      isMarathi ? quotes[quoteIndex]["mr"]! : quotes[quoteIndex]["en"]!,
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

              // 👮‍♂️ District selection & Live Updates
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    isMarathi ? "जिल्हास्तरीय भरती अपडेट्स" : "District Bharti Alerts",
                    style: commonTextStyle.copyWith(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: isDarkMode ? Colors.white : Colors.black87,
                    ),
                  ),
                  DropdownButton<String>(
                    value: selectedDistrict,
                    dropdownColor: isDarkMode ? const Color(0xFF222222) : Colors.white,
                    style: commonTextStyle.copyWith(
                      color: Constants.primaryBlueColour,
                      fontWeight: FontWeight.bold,
                    ),
                    underline: const SizedBox.shrink(),
                    onChanged: (String? val) {
                      if (val != null) {
                        setState(() {
                          selectedDistrict = val;
                        });
                      }
                    },
                    items: ["Mumbai", "Nagpur", "Pune", "Thane"].map((String d) {
                      return DropdownMenuItem<String>(
                        value: d,
                        child: Text(d),
                      );
                    }).toList(),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              _districtNewsFeed(isMarathi),
              const SizedBox(height: 20),

              // 📚 Digital PDF Notes Library & Solved Papers
              Text(
                isMarathi ? "अभ्यास साहित्य आणि पेपर्स" : "PDF Notes & Solved Papers",
                style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: isDarkMode ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 10),
              _pdfNotesLibrary(isMarathi),
              const SizedBox(height: 20),

              // 📊 District-wise Leaderboard
              Text(
                isMarathi ? "जिल्हानुसार आघाडीवर (Leaderboard)" : "District-wise Leaderboard",
                style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: isDarkMode ? Colors.white : Colors.black87,
                ),
              ),
              const SizedBox(height: 10),
              _leaderboardList(isMarathi),
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
          style: commonTextStyle.copyWith(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.bold),
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

  // Mock News Feed
  Widget _districtNewsFeed(bool isMarathi) {
    String message = "";
    if (selectedDistrict == "Mumbai") {
      message = isMarathi ? "मुंबई पोलीस भरती मैदानी चाचणी वेळापत्रक जाहीर. २ जूनपासून सुरू." : "Mumbai Police Bharti Ground Test dates released. Starting June 2nd.";
    } else if (selectedDistrict == "Nagpur") {
      message = isMarathi ? "नागपूर विभाग लेखी परीक्षेसाठी नवीन मार्गदर्शक सूचना जारी." : "Nagpur division written exam guidelines updated.";
    } else if (selectedDistrict == "Pune") {
      message = isMarathi ? "पुणे पोलीस आयुक्तालय: १५,००० उमेदवारांची यादी अंतिम टप्प्यात." : "Pune Commissionary: list of 15k candidates in final validation phase.";
    } else {
      message = isMarathi ? "ठाणे शारीरिक चाचणीसाठी प्रवेशपत्रे उद्यापासून उपलब्ध होतील." : "Thane ground test admit cards downloadable from tomorrow.";
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
            child: const Icon(Icons.notifications_active, color: Colors.red, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "$selectedDistrict Bharti Alert",
                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13, color: isDarkMode ? Colors.white : Colors.black87),
                ),
                const SizedBox(height: 3),
                Text(
                  message,
                  style: commonTextStyle.copyWith(fontSize: 12, color: isDarkMode ? Colors.white70 : Colors.black54),
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
    final List<Map<String, String>> papers = [
      {
        "title": "Police Bharti 2024 Solved Paper",
        "titleMr": "पोलीस भरती २०२४ सोडवलेली प्रश्नपत्रिका",
        "desc": "Official answers and solved math logic",
        "descMr": "अधिकृत उत्तरे आणि गणित स्पष्टीकरण"
      },
      {
        "title": "Marathi Grammar Complete Syllabus",
        "titleMr": "मराठी व्याकरण संपूर्ण अभ्यासक्रम",
        "desc": "Basic to advanced grammar handbook",
        "descMr": "सविस्तर व्याकरण नियम आणि उदाहरणे"
      },
      {
        "title": "Maharashtra GK & History Notes",
        "titleMr": "महाराष्ट्र सामान्य ज्ञान आणि इतिहास",
        "desc": "Essential capsule notes for GK section",
        "descMr": "चालू घडामोडी आणि चालू इतिहास"
      }
    ];

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
          child: TextField(
            controller: searchController,
            onChanged: (val) {
              setState(() {
                searchQuery = val.toLowerCase();
              });
            },
            decoration: InputDecoration(
              hintText: isMarathi ? "पीडीएफ नोट्स आणि पेपर्स शोधा..." : "Search Notes & PDFs...",
              hintStyle: commonTextStyle.copyWith(fontSize: 13, color: Colors.grey),
              prefixIcon: const Icon(Icons.search, size: 20),
              border: InputBorder.none,
              contentPadding: const EdgeInsets.only(bottom: 5),
            ),
          ),
        ),

        // Notes items
        ListView.separated(
          itemCount: papers.length,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final item = papers[index];
            final titleStr = isMarathi ? item["titleMr"]! : item["title"]!;
            final descStr = isMarathi ? item["descMr"]! : item["desc"]!;

            // Search filter
            if (searchQuery.isNotEmpty && !titleStr.toLowerCase().contains(searchQuery)) {
              return const SizedBox.shrink();
            }

            return Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isDarkMode ? const Color(0xFF1E1E1E) : Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Row(
                children: [
                  const Icon(Icons.picture_as_pdf, color: Colors.red, size: 30),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          titleStr,
                          style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13, color: isDarkMode ? Colors.white : Colors.black87),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          descStr,
                          style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Constants.primaryBlueColour,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                    ),
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text(isMarathi ? "पीडीएफ डाउनलोड पूर्ण झाले आणि सुरक्षितपणे सेव्ह केले!" : "PDF downloaded and saved offline successfully!")),
                      );
                    },
                    child: const Icon(Icons.download, color: Colors.white, size: 18),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  // Topper/Leaderboard Widget
  Widget _leaderboardList(bool isMarathi) {
    final List<Map<String, String>> leaders = [
      {"name": "Anil Patil", "score": "194/200", "district": "Mumbai"},
      {"name": "Seema Shinde", "score": "191/200", "district": "Nagpur"},
      {"name": "Rahul Deshmukh", "score": "189/200", "district": "Pune"},
      {"name": "Vijay Gaikwad", "score": "186/200", "district": "Thane"},
    ];

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
                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13, color: isDarkMode ? Colors.white70 : Colors.black87),
                ),
                const SizedBox(width: 10),
                Icon(Icons.stars, color: isTopRank ? Colors.amber : Colors.grey.shade400, size: 20),
              ],
            ),
            title: Text(
              item["name"]!,
              style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13, color: isDarkMode ? Colors.white : Colors.black87),
            ),
            subtitle: Text(
              "${isMarathi ? 'जिल्हा' : 'District'}: ${item["district"]}",
              style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey),
            ),
            trailing: Text(
              item["score"]!,
              style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, color: Constants.primaryBlueColour, fontSize: 13),
            ),
          );
        },
      ),
    );
  }
}
