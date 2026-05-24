import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/screens/auth_module/auth_cubit.dart';
import 'package:mission_vardi/screens/profile_module/profile_cubit.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:intl/intl.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  // Coin balance and Referral state
  int coins = 450;
  String referCode = "VARDI777";

  @override
  Widget build(BuildContext context) {
    final isMarathi =
        context.watch<LanguageCubit>().state.locale.languageCode == 'mr';
    final profileState = context.watch<ProfileCubit>().state;
    final user = profileState.profileData;
    
    final stats = user?.stats ?? {};
    double accuracy = (stats['average_score_percent'] as num?)?.toDouble() ?? 0.0;
    int totalTimeSeconds = (stats['total_time_seconds'] as num?)?.toInt() ?? 0;
    double hours = totalTimeSeconds / 3600;
    String hoursStr = hours.toStringAsFixed(1);
    if (hoursStr.endsWith(".0")) hoursStr = hoursStr.substring(0, hoursStr.length - 2);

    List<dynamic> recentSessions = stats['recent_sessions'] ?? [];

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: isMarathi ? 'माहिती व प्रगती' : 'Profile & Statistics',
        titleIcon: Icons.person,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // User Rank Profile Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0D47A1), Color(0xFF1E88E5)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: Colors.blue.withOpacity(0.15),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Row(
                children: [
                  // Police badge avatar
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.amber,
                      shape: BoxShape.circle,
                    ),
                    child: CircleAvatar(
                      radius: 35,
                      backgroundColor: Colors.white,
                      backgroundImage: NetworkImage(user?.avatarUrl ?? ""),
                    ),
                  ),
                  const SizedBox(width: 15),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user?.name ?? "User",
                          style: commonTextStyle.copyWith(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.amber,
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Text(
                            'Email : ${user?.email ?? "test@gmail.com"}',
                            style: commonTextStyle.copyWith(
                              color: const Color(0xFF0A2540),
                              fontWeight: FontWeight.bold,
                              fontSize: 11,
                            ),
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          isMarathi
                              ? "चालू जिल्हा: ${user?.district ?? 'N/A'}"
                              : "District: ${user?.district ?? 'N/A'}",
                          style: commonTextStyle.copyWith(
                              color: Colors.white70, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Statistics Header
            Text(
              isMarathi ? "अभ्यासाची प्रगती" : "Study Progress & Accuracy",
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),

            // Accuracy % and Weekly Progress metrics
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        isMarathi ? "एकूण अचूकता" : "Overall MCQ Accuracy",
                        style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        "${accuracy.toStringAsFixed(0)}%",
                        style: commonTextStyle.copyWith(
                          fontWeight: FontWeight.bold,
                          color: Constants.primaryBlueColour,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(5),
                    child: LinearProgressIndicator(
                      value: accuracy / 100.0,
                      minHeight: 10,
                      backgroundColor: Colors.grey.shade100,
                      valueColor: AlwaysStoppedAnimation<Color>(
                          Constants.primaryBlueColour),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // Weekly hours charts
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        isMarathi ? "दैनिक अभ्यास तास" : "Weekly Study Hours",
                        style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        "$hoursStr Hrs Total",
                        style: commonTextStyle.copyWith(
                            color: Colors.grey, fontSize: 12),
                      ),
                    ],
                  ),
                  const SizedBox(height: 15),
                  // Simulated bar charts
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      _barItem("Mon", 0.4, "3h"),
                      _barItem("Tue", 0.7, "5h"),
                      _barItem("Wed", 0.85, "6h"),
                      _barItem("Thu", 0.5, "3.5h"),
                      _barItem("Fri", 0.6, "4h"),
                      _barItem("Sat", 0.3, "2h"),
                      _barItem("Sun", 0.2, "1h"),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),

            // Achievement Badges
            Text(
              isMarathi ? "प्राप्त पदके (Badges)" : "Achievement Badges",
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                _badgeItem(
                  icon: Icons.run_circle_outlined,
                  color: Colors.blue,
                  title: isMarathi ? "धावपटू" : "Sprint Star",
                  desc: "100m in <12s",
                ),
                _badgeItem(
                  icon: Icons.military_tech,
                  color: Colors.amber,
                  title: isMarathi ? "टॉपर" : "Topper Badge",
                  desc: "Rank #1 Quiz",
                ),
                _badgeItem(
                  icon: Icons.local_fire_department,
                  color: Colors.orange,
                  title: isMarathi ? "सातत्य" : "Daily Streak",
                  desc: "7 Day Study",
                ),
              ],
            ),
            const SizedBox(height: 25),

            // Recent Activity History
            Text(
              isMarathi ? "अलीकडील हालचाली" : "Recent Activity History",
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),
            Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(15),
                border: Border.all(color: Colors.grey.shade200),
              ),
              child: recentSessions.isEmpty
                  ? Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Center(
                        child: Text(
                          isMarathi ? "कोणताही इतिहास नाही" : "No history found",
                          style: commonTextStyle.copyWith(color: Colors.grey),
                        ),
                      ),
                    )
                  : Column(
                      children: recentSessions.map((session) {
                        DateTime date = DateTime.tryParse(session['ended_at'] ?? session['submittedAt'] ?? '') ?? DateTime.now();
                        String timeStr = DateFormat('dd MMM, hh:mm a').format(date);
                        String category = session['category'] ?? (isMarathi ? "सराव" : "Practice");
                        int score = session['score'] ?? 0;
                        int total = session['total'] ?? 0;
                        int wrong = total - score;

                        return Column(
                          children: [
                            _activityTile(
                              icon: Icons.quiz_rounded,
                              title: isMarathi
                                  ? "$category क्विझ पूर्ण केली"
                                  : "Completed $category Quiz",
                              time: timeStr,
                              subtitle: "Score: $score/$total | Wrong: $wrong",
                            ),
                            if (session != recentSessions.last)
                              const Divider(height: 1),
                          ],
                        );
                      }).toList(),
                    ),
            ),
            const SizedBox(height: 30),

            // Logout Bypass button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  side: const BorderSide(color: Colors.red),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.logout, color: Colors.red),
                label: Text(
                  isMarathi ? "लॉगआउट" : "Logout Account",
                  style: commonTextStyle.copyWith(
                      color: Colors.red, fontWeight: FontWeight.bold),
                ),
                onPressed: () {
                  context.read<AuthCubit>().signOut();
                  context.go(RoutesNames.signInScreen);
                },
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _barItem(String label, double fill, String value) {
    return Column(
      children: [
        Text(value,
            style: commonTextStyle.copyWith(
                fontSize: 9, color: Colors.grey, fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Container(
          height: 60,
          width: 12,
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(6),
          ),
          alignment: Alignment.bottomCenter,
          child: Container(
            height: 60 * fill,
            decoration: BoxDecoration(
              color: Constants.primaryBlueColour,
              borderRadius: BorderRadius.circular(6),
            ),
          ),
        ),
        const SizedBox(height: 6),
        Text(label,
            style: commonTextStyle.copyWith(
                fontSize: 10, color: Colors.grey.shade600)),
      ],
    );
  }

  Widget _badgeItem(
      {required IconData icon,
      required Color color,
      required String title,
      required String desc}) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            shape: BoxShape.circle,
            border: Border.all(color: color.withOpacity(0.3), width: 2),
          ),
          child: Icon(icon, color: color, size: 28),
        ),
        const SizedBox(height: 6),
        Text(title,
            style: commonTextStyle.copyWith(
                fontWeight: FontWeight.bold, fontSize: 12)),
        Text(desc,
            style: commonTextStyle.copyWith(fontSize: 10, color: Colors.grey)),
      ],
    );
  }

  Widget _activityTile(
      {required IconData icon,
      required String title,
      required String time,
      required String subtitle}) {
    return ListTile(
      leading: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: Colors.blue.shade50,
          shape: BoxShape.circle,
        ),
        child: Icon(icon, color: Constants.primaryBlueColour, size: 20),
      ),
      title: Text(title,
          style: commonTextStyle.copyWith(
              fontWeight: FontWeight.bold, fontSize: 13)),
      subtitle: Text(subtitle,
          style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey)),
      trailing: Text(time,
          style: commonTextStyle.copyWith(fontSize: 10, color: Colors.grey)),
    );
  }
}
