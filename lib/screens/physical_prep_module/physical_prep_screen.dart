import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';

class PhysicalPrepScreen extends StatefulWidget {
  const PhysicalPrepScreen({super.key});

  @override
  State<PhysicalPrepScreen> createState() => _PhysicalPrepScreenState();
}

class _PhysicalPrepScreenState extends State<PhysicalPrepScreen> {
  // Physical event state
  int pushupCount = 18;
  int pushupGoal = 40;
  int situpCount = 22;
  int situpGoal = 45;

  // Stopwatch state
  bool isStopwatchRunning = false;
  int stopwatchMilliseconds = 0;
  Timer? stopwatchTimer;
  List<String> lapTimes = [];

  void startStopwatch() {
    setState(() {
      isStopwatchRunning = true;
    });
    stopwatchTimer?.cancel();
    stopwatchTimer = Timer.periodic(const Duration(milliseconds: 10), (timer) {
      setState(() {
        stopwatchMilliseconds += 10;
      });
    });
  }

  void stopStopwatch() {
    setState(() {
      isStopwatchRunning = false;
    });
    stopwatchTimer?.cancel();
  }

  void resetStopwatch() {
    stopStopwatch();
    setState(() {
      stopwatchMilliseconds = 0;
      lapTimes.clear();
    });
  }

  void recordLap() {
    setState(() {
      lapTimes.insert(0, formatTime(stopwatchMilliseconds));
    });
  }

  String formatTime(int ms) {
    int minutes = (ms ~/ 60000) % 60;
    int seconds = (ms ~/ 1000) % 60;
    int hundredths = (ms ~/ 10) % 100;
    return "${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}.${hundredths.toString().padLeft(2, '0')}";
  }

  @override
  void dispose() {
    stopwatchTimer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isMarathi = context.watch<LanguageCubit>().state.locale.languageCode == 'mr';

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        backgroundColor: Constants.scaffoldBackgroundColour,
        appBar: CustomAppBar(
          titleText: isMarathi ? 'मैदानी चाचणी ट्रॅकर' : 'Physical Test Tracker',
          titleIcon: Icons.fitness_center,
          bottom: PreferredSize(
            preferredSize: const Size.fromHeight(66),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              padding: const EdgeInsets.all(4),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.18),
                borderRadius: BorderRadius.circular(30),
              ),
              child: TabBar(
                indicator: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(26),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 6,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                indicatorSize: TabBarIndicatorSize.tab,
                dividerColor: Colors.transparent,
                labelColor: Constants.primaryBlueColour,
                unselectedLabelColor: Colors.white,
                labelStyle: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                unselectedLabelStyle: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                tabs: [
                  Tab(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.fitness_center, size: 18),
                        const SizedBox(width: 8),
                        Text(isMarathi ? "व्यायाम ट्रॅकर" : "Workout Track"),
                      ],
                    ),
                  ),
                  Tab(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.timer_outlined, size: 18),
                        const SizedBox(width: 8),
                        Text(isMarathi ? "धावणे टाइमर" : "Running Timer"),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
        body: TabBarView(
          children: [
            // Workout Tracker Tab
            SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Streak Header
                  _cardContainer(
                    child: Row(
                      children: [
                        const CircleAvatar(
                          backgroundColor: Colors.orangeAccent,
                          child: Icon(Icons.local_fire_department, color: Colors.white),
                        ),
                        const SizedBox(width: 15),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                isMarathi ? "आजचे व्यायाम ध्येय!" : "Today's Workout Target!",
                                style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 15),
                              ),
                              const SizedBox(height: 3),
                              Text(
                                isMarathi ? "शारीरिक चाचणीत १०० पैकी १०० मिळवण्यासाठी रोज सराव करा" : "Train daily to score 100% in ground test.",
                                style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey.shade600),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Pushups Card
                  _trackerCard(
                    title: isMarathi ? "दंड (Push-ups)" : "Push-ups Counter",
                    count: pushupCount,
                    goal: pushupGoal,
                    isMarathi: isMarathi,
                    onAdd: () {
                      setState(() {
                        if (pushupCount < pushupGoal) pushupCount++;
                      });
                    },
                    onReset: () {
                      setState(() {
                        pushupCount = 0;
                      });
                    },
                  ),
                  const SizedBox(height: 15),

                  // Situps Card
                  _trackerCard(
                    title: isMarathi ? "उठबशा (Sit-ups)" : "Sit-ups Counter",
                    count: situpCount,
                    goal: situpGoal,
                    isMarathi: isMarathi,
                    onAdd: () {
                      setState(() {
                        if (situpCount < situpGoal) situpCount++;
                      });
                    },
                    onReset: () {
                      setState(() {
                        situpCount = 0;
                      });
                    },
                  ),
                  const SizedBox(height: 20),

                  // Police Physical Standards info
                  Text(
                    isMarathi ? "पोलीस भरती निकष" : "Police Physical Standards",
                    style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  const SizedBox(height: 10),
                  _standardItem(
                    title: isMarathi ? "१६०० मीटर धावणे (पुरुष)" : "1600 Meters Run (Male)",
                    desc: isMarathi ? "उत्कृष्ट वेळ: ५ मि. १० सेकंद (३० गुण)" : "Excellent target: 5 mins 10 secs (30 Marks)",
                    score: "30 M",
                  ),
                  _standardItem(
                    title: isMarathi ? "१०० मीटर धावणे" : "100 Meters Sprint",
                    desc: isMarathi ? "उत्कृष्ट वेळ: ११.५० सेकंद (१५ गुण)" : "Excellent target: 11.50 secs (15 Marks)",
                    score: "15 M",
                  ),
                  _standardItem(
                    title: isMarathi ? "गोळाफेक" : "Shot Put Throw",
                    desc: isMarathi ? "उत्कृष्ट अंतर: ८.५० मीटर (१५ गुण)" : "Excellent throw: 8.50 meters (15 Marks)",
                    score: "15 M",
                  ),
                ],
              ),
            ),

            // Running Stopwatch Tab
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const SizedBox(height: 20),
                  // Stopwatch Display
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 10,
                          offset: const Offset(0, 5),
                        ),
                      ],
                      border: Border.all(color: Colors.grey.shade200),
                    ),
                    child: Column(
                      children: [
                        Text(
                          isMarathi ? "१६०० मी / १०० मी धावण्याची वेळ" : "Running Event stopwatch",
                          style: commonTextStyle.copyWith(color: Colors.grey, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 15),
                        Text(
                          formatTime(stopwatchMilliseconds),
                          style: GoogleFonts.shareTechMono(
                            fontSize: 48,
                            fontWeight: FontWeight.bold,
                            color: Constants.primaryBlueColour,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),

                  // Stopwatch Buttons
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      // Reset Button
                      _stopwatchButton(
                        icon: Icons.refresh,
                        color: Colors.grey.shade400,
                        onTap: resetStopwatch,
                      ),
                      // Start/Stop Button
                      _stopwatchButton(
                        icon: isStopwatchRunning ? Icons.pause : Icons.play_arrow,
                        color: isStopwatchRunning ? Colors.red : Colors.green,
                        isLarge: true,
                        onTap: isStopwatchRunning ? stopStopwatch : startStopwatch,
                      ),
                      // Lap Button
                      _stopwatchButton(
                        icon: Icons.flag,
                        color: Colors.blue.shade400,
                        onTap: isStopwatchRunning ? recordLap : null,
                      ),
                    ],
                  ),
                  const SizedBox(height: 30),

                  // Lap Times Header
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        isMarathi ? "नोंदवलेली वेळ (Laps)" : "Recorded Splits (Laps)",
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        "${lapTimes.length} ${isMarathi ? 'फेऱ्या' : 'Laps'}",
                        style: commonTextStyle.copyWith(color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                  const Divider(),

                  // Lap Times List
                  Expanded(
                    child: lapTimes.isEmpty
                        ? Center(
                            child: Text(
                              isMarathi ? "धावणे सुरू करा आणि लॅप्स नोंदवा" : "Start timer & record split lap markers.",
                              style: commonTextStyle.copyWith(color: Colors.grey, fontSize: 13),
                            ),
                          )
                        : ListView.separated(
                            itemCount: lapTimes.length,
                            separatorBuilder: (_, __) => const Divider(),
                            itemBuilder: (context, index) {
                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Text(
                                      "${isMarathi ? 'फेरी' : 'Lap'} ${lapTimes.length - index}",
                                      style: commonTextStyle.copyWith(fontWeight: FontWeight.w600),
                                    ),
                                    Text(
                                      lapTimes[index],
                                      style: GoogleFonts.shareTechMono(
                                          fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
                                    ),
                                  ],
                                ),
                              );
                            },
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

  Widget _cardContainer({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: child,
    );
  }

  Widget _trackerCard({
    required String title,
    required int count,
    required int goal,
    required bool isMarathi,
    required VoidCallback onAdd,
    required VoidCallback onReset,
  }) {
    final progress = count / goal;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 15),
              ),
              IconButton(
                icon: const Icon(Icons.rotate_left, color: Colors.grey, size: 20),
                onPressed: onReset,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              // Circular progress
              SizedBox(
                height: 70,
                width: 70,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CircularProgressIndicator(
                      value: progress,
                      backgroundColor: Colors.grey.shade200,
                      valueColor: AlwaysStoppedAnimation<Color>(Constants.primaryBlueColour),
                      strokeWidth: 8,
                    ),
                    Text(
                      "${(progress * 100).toInt()}%",
                      style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "$count / $goal reps",
                      style: commonTextStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      isMarathi ? "दैनिक उद्दिष्ट साध्य करण्यासाठी क्लिक करा" : "Click '+' button to count reps.",
                      style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey),
                    ),
                  ],
                ),
              ),
              // Add button
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: const CircleBorder(),
                  padding: const EdgeInsets.all(14),
                  backgroundColor: Constants.primaryBlueColour,
                ),
                onPressed: onAdd,
                child: const Icon(Icons.add, color: Colors.white),
              )
            ],
          ),
        ],
      ),
    );
  }

  Widget _standardItem({required String title, required String desc, required String score}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 3),
                Text(desc, style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber.shade100,
              borderRadius: BorderRadius.circular(5),
            ),
            child: Text(
              score,
              style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 11, color: Colors.amber.shade900),
            ),
          ),
        ],
      ),
    );
  }

  Widget _stopwatchButton({
    required IconData icon,
    required Color color,
    bool isLarge = false,
    required VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(isLarge ? 20 : 14),
        decoration: BoxDecoration(
          color: onTap == null ? Colors.grey.shade100 : color,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: (onTap == null ? Colors.transparent : color).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Icon(icon, color: Colors.white, size: isLarge ? 30 : 22),
      ),
    );
  }
}
