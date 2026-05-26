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
import 'package:mission_vardi/utils/common_widgets/common_bottom_sheet.dart';
import 'package:mission_vardi/utils/common_widgets/common_auth_widgets.dart';
import 'package:firebase_auth/firebase_auth.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) {
        final profileCubit = context.read<ProfileCubit>();
        if (profileCubit.state.profileData == null) {
          profileCubit.getProfile();
        }
      }
    });
  }

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
    double accuracy =
        (stats['average_score_percent'] as num?)?.toDouble() ?? 0.0;
    int totalTimeSeconds = (stats['total_time_seconds'] as num?)?.toInt() ?? 0;
    double hours = totalTimeSeconds / 3600;
    String hoursStr = hours.toStringAsFixed(1);
    if (hoursStr.endsWith(".0"))
      hoursStr = hoursStr.substring(0, hoursStr.length - 2);

    List<dynamic> recentSessions = stats['recent_sessions'] ?? [];
    List<dynamic> weeklyHoursData = stats['weekly_study_hours'] ?? [];
    List<dynamic> earnedBadges = stats['badges'] ?? [];

    double maxWeeklyHours = 0;
    for (var w in weeklyHoursData) {
      double m = (w['minutes'] as num?)?.toDouble() ??
          ((w['hours'] as num?)?.toDouble() ?? 0.0) * 60;
      if (m > maxWeeklyHours) maxWeeklyHours = m;
    }
    if (maxWeeklyHours == 0) maxWeeklyHours = 1; // prevent division by zero



    if (profileState.isLoading && user == null) {
      return Scaffold(
        backgroundColor: Constants.scaffoldBackgroundColour,
        appBar: CustomAppBar(
          titleText: isMarathi ? 'माहिती व प्रगती' : 'Profile & Statistics',
          titleIcon: Icons.person,
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

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
                      backgroundImage:
                          user?.avatarUrl != null && user!.avatarUrl!.isNotEmpty
                              ? NetworkImage(user.avatarUrl!)
                              : null,
                      child: user?.avatarUrl == null || user!.avatarUrl!.isEmpty
                          ? const Icon(Icons.person,
                              size: 40, color: Colors.grey)
                          : null,
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
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: Colors.amber,
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    'Email : ${user?.email ?? "test@gmail.com"}',
                                    style: commonTextStyle.copyWith(
                                      color: const Color(0xFF0A2540),
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                    ),
                                  ),
                                  if (user?.isVerified == true) ...[
                                    const SizedBox(width: 4),
                                    const Icon(Icons.verified,
                                        size: 14, color: Colors.green),
                                  ]
                                ],
                              ),
                            ),
                            if (user?.isVerified != true) ...[
                              const SizedBox(width: 8),
                              GestureDetector(
                                onTap: () async {
                                  try {
                                    final auth = FirebaseAuth.instance;
                                    await auth.currentUser
                                        ?.sendEmailVerification();
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(
                                          content: Text(isMarathi
                                              ? "व्हेरिफिकेशन लिंक पाठवली!"
                                              : "Verification link sent!")),
                                    );
                                  } catch (e) {
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      SnackBar(content: Text("Error: $e")),
                                    );
                                  }
                                },
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                      horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: Colors.red.shade400,
                                    borderRadius: BorderRadius.circular(10),
                                  ),
                                  child: Text(
                                    isMarathi ? "Verify करा" : "Verify",
                                    style: commonTextStyle.copyWith(
                                        color: Colors.white,
                                        fontSize: 10,
                                        fontWeight: FontWeight.bold),
                                  ),
                                ),
                              ),
                            ],
                          ],
                        ),
                        // District removed
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.edit, color: Colors.white),
                    onPressed: () {
                      if (user != null) {
                        _showEditProfileBottomSheet(context, user);
                      }
                    },
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
                  // Weekly study hours chart
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: weeklyHoursData.isEmpty
                        ? List.generate(7, (index) => _barItem("-", 0.0, "0h"))
                        : weeklyHoursData
                            .map((w) {
                              String dayStr = w['day'] ?? "";
                              double m = (w['minutes'] as num?)?.toDouble() ??
                                  ((w['hours'] as num?)?.toDouble() ?? 0.0) *
                                      60;
                              double fill =
                                  maxWeeklyHours > 0 ? m / maxWeeklyHours : 0.0;

                              String valueStr =
                                  m > 0 ? "${m.toStringAsFixed(1)}m" : "0m";
                              if (valueStr.endsWith(".0m")) {
                                valueStr = "${m.toInt()}m";
                              }

                              return _barItem(dayStr, fill, valueStr);
                            })
                            .toList()
                            .cast<Widget>(),
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
            earnedBadges.isEmpty
                ? Padding(
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    child: Center(
                      child: Text(
                        isMarathi
                            ? "अद्याप कोणतेही पदक नाही"
                            : "No badges earned yet",
                        style: commonTextStyle.copyWith(color: Colors.grey),
                      ),
                    ),
                  )
                : Wrap(
                    spacing: 20,
                    runSpacing: 20,
                    alignment: WrapAlignment.center,
                    children: earnedBadges.map((badge) {
                      final badgeId = badge['id'] ?? '';
                      IconData icon;
                      Color color;

                      if (badgeId.startsWith('streak')) {
                        icon = Icons.local_fire_department;
                        color = Colors.orange;
                      } else if (badgeId.startsWith('quiz')) {
                        icon = Icons.military_tech;
                        color = Colors.amber;
                      } else if (badgeId == 'merit') {
                        icon = Icons.workspace_premium;
                        color = Colors.purple;
                      } else if (badgeId == 'first_quiz') {
                        icon = Icons.star_rounded;
                        color = Colors.blue;
                      } else {
                        icon = Icons.emoji_events;
                        color = Colors.teal;
                      }

                      return SizedBox(
                        width: 90,
                        child: _badgeItem(
                          icon: icon,
                          color: color,
                          title: badge['title'] ?? '',
                          desc: badge['desc'] ?? '',
                        ),
                      );
                    }).toList(),
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
                          isMarathi
                              ? "कोणताही इतिहास नाही"
                              : "No history found",
                          style: commonTextStyle.copyWith(color: Colors.grey),
                        ),
                      ),
                    )
                  : Column(
                      children: recentSessions.map((session) {
                        DateTime date = DateTime.tryParse(session['ended_at'] ??
                                session['submittedAt'] ??
                                '') ??
                            DateTime.now();
                        String timeStr =
                            DateFormat('dd MMM, hh:mm a').format(date);
                        String quizTitle = session['quiz_title'] ??
                            (session['category'] ??
                                (isMarathi ? "सराव" : "Practice"));
                        int score = session['score'] ?? 0;
                        int total = session['total'] ?? 0;
                        int attempted = session['attempted'] ?? score;
                        int wrong = attempted - score;
                        if (wrong < 0) wrong = 0;

                        return Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  vertical: 14, horizontal: 16),
                              child: Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(12),
                                    decoration: BoxDecoration(
                                      color: Constants.primaryBlueColour
                                          .withOpacity(0.08),
                                      borderRadius: BorderRadius.circular(12),
                                    ),
                                    child: Icon(Icons.quiz_rounded,
                                        color: Constants.primaryBlueColour,
                                        size: 24),
                                  ),
                                  const SizedBox(width: 14),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Row(
                                          mainAxisAlignment:
                                              MainAxisAlignment.spaceBetween,
                                          crossAxisAlignment:
                                              CrossAxisAlignment.start,
                                          children: [
                                            Expanded(
                                              child: Text(
                                                quizTitle,
                                                style: commonTextStyle.copyWith(
                                                  fontWeight: FontWeight.w700,
                                                  fontSize: 14,
                                                  color: Colors.black87,
                                                ),
                                                maxLines: 2,
                                                overflow: TextOverflow.ellipsis,
                                              ),
                                            ),
                                            const SizedBox(width: 8),
                                            Text(
                                              timeStr,
                                              style: commonTextStyle.copyWith(
                                                  fontSize: 10,
                                                  color: Colors.grey.shade500),
                                            ),
                                          ],
                                        ),
                                        const SizedBox(height: 10),
                                        Row(
                                          children: [
                                            _buildStatChip(
                                                isMarathi
                                                    ? "सोडवले"
                                                    : "Attempted",
                                                "$attempted/$total",
                                                Colors.blue),
                                            const SizedBox(width: 8),
                                            _buildStatChip(
                                                isMarathi ? "बरोबर" : "Correct",
                                                "$score",
                                                Colors.green),
                                            const SizedBox(width: 8),
                                            _buildStatChip(
                                                isMarathi ? "चूक" : "Wrong",
                                                "$wrong",
                                                Colors.red),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            if (session != recentSessions.last)
                              Divider(
                                  height: 1,
                                  color: Colors.grey.shade100,
                                  indent: 70,
                                  endIndent: 16),
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
                onPressed: () async {
                  context.read<ProfileCubit>().clearProfile();
                  await context.read<AuthCubit>().signOut();
                  if (context.mounted) {
                    context.go(RoutesNames.signInScreen);
                  }
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

  Widget _buildStatChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            "$label: ",
            style: commonTextStyle.copyWith(
                fontSize: 10, color: color.withOpacity(0.9)),
          ),
          Text(
            value,
            style: commonTextStyle.copyWith(
                fontSize: 10, fontWeight: FontWeight.bold, color: color),
          ),
        ],
      ),
    );
  }

  void _showEditProfileBottomSheet(BuildContext context, user) {
    final TextEditingController nameController =
        TextEditingController(text: user.name);
    final TextEditingController mobileController =
        TextEditingController(text: user.mobile);
    final TextEditingController avatarController =
        TextEditingController(text: user.avatarUrl);
    final TextEditingController bioController =
        TextEditingController(text: user.bio);
    final TextEditingController examController =
        TextEditingController(text: user.targetExam);

    CommonBottomSheet.show(
      context: context,
      title: "Update Profile",
      child: Column(
        children: [
          CommonAuthInputField(
            controller: nameController,
            label: "Full Name",
            hint: "Enter your full name",
            icon: Icons.person_outline,
          ),
          const SizedBox(height: 16),
          CommonAuthInputField(
            controller: mobileController,
            label: "Mobile",
            hint: "Enter your mobile number",
            icon: Icons.phone_outlined,
            keyboardType: TextInputType.phone,
          ),
          const SizedBox(height: 16),
          CommonAuthInputField(
            controller: avatarController,
            label: "Avatar URL",
            hint: "Enter a valid image URL for your profile",
            icon: Icons.image_outlined,
          ),
          const SizedBox(height: 16),
          CommonAuthInputField(
            controller: bioController,
            label: "Bio",
            hint: "Short description about yourself",
            icon: Icons.info_outline,
          ),
          const SizedBox(height: 16),
          CommonAuthInputField(
            controller: examController,
            label: "Target Exam",
            hint: "e.g. police_bharti",
            icon: Icons.track_changes_outlined,
          ),
          const SizedBox(height: 24),
          CommonAuthButton(
            label: "Save Changes",
            onTap: () {
              final Map<String, dynamic> body = {};
              if (nameController.text.isNotEmpty)
                body["name"] = nameController.text;
              if (mobileController.text.isNotEmpty)
                body["mobile"] = mobileController.text;
              if (avatarController.text.isNotEmpty)
                body["avatar_url"] = avatarController.text;
              if (bioController.text.isNotEmpty)
                body["bio"] = bioController.text;
              if (examController.text.isNotEmpty)
                body["target_exam"] = examController.text;

              context.read<ProfileCubit>().updateProfile(body: body);
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}
