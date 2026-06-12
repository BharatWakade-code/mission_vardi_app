import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';

import 'package:mission_vardi/screens/auth_module/auth_cubit.dart';
import 'package:mission_vardi/screens/profile_module/profile_cubit.dart';
import 'package:mission_vardi/screens/profile_module/profile_state.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:intl/intl.dart';

import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';
import 'package:mission_vardi/utils/common_widgets/common_bottom_sheet.dart';
import 'package:mission_vardi/utils/common_widgets/common_auth_widgets.dart';
import 'package:mission_vardi/screens/profile_module/history_details_bottom_sheet.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:mission_vardi/screens/localization_module/change_language_bottom_sheet.dart';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:mission_vardi/screens/localization_module/locale_cubit.dart';

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
    context.watch<LocaleCubit>();

    // Watch LanguageCubit to trigger an instant rebuild when language changes

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
          titleText: 'profile'.tr(),
          titleIcon: Icons.person,
          actions: [
            IconButton(
              icon: const Icon(Icons.language, color: Colors.blue),
              onPressed: () => ChangeLanguageBottomSheet.show(context),
            ),
            _buildLogoutButton(context),
          ],
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: 'profile'.tr(),
        titleIcon: Icons.person,
        actions: [
          IconButton(
            icon: const Icon(Icons.language, color: Colors.blue),
            onPressed: () => ChangeLanguageBottomSheet.show(context),
          ),
          _buildLogoutButton(context),
        ],
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
                  // Police badge avatar with upload gesture
                  GestureDetector(
                    onTap: () => _pickAndUploadImage(context),
                    child: Stack(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: const BoxDecoration(
                            color: Colors.amber,
                            shape: BoxShape.circle,
                          ),
                          child: CircleAvatar(
                            radius: 35,
                            backgroundColor: Colors.white,
                            backgroundImage: user?.avatarUrl != null &&
                                    user!.avatarUrl!.isNotEmpty
                                ? NetworkImage(user.avatarUrl!)
                                : null,
                            child: user?.avatarUrl == null ||
                                    user!.avatarUrl!.isEmpty
                                ? const Icon(Icons.person,
                                    size: 40, color: Colors.grey)
                                : null,
                          ),
                        ),
                        if (profileState.isLoading)
                          Positioned.fill(
                            child: Container(
                              margin: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(
                                color: Colors.black45,
                                shape: BoxShape.circle,
                              ),
                              child: const Center(
                                child: CircularProgressIndicator(
                                  strokeWidth: 3,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.amber),
                                ),
                              ),
                            ),
                          ),
                        Positioned(
                          bottom: 0,
                          right: 0,
                          child: Container(
                            padding: const EdgeInsets.all(6),
                            decoration: BoxDecoration(
                              color: Colors.amber.shade700,
                              shape: BoxShape.circle,
                              border: Border.all(color: Colors.white, width: 2),
                            ),
                            child: const Icon(
                              Icons.camera_alt,
                              size: 14,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ],
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
                                          content:
                                              Text('verification_link_sent'.tr())),
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
                                    'verify'.tr(),
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
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            const Icon(Icons.location_on, size: 12, color: Colors.amber),
                            const SizedBox(width: 4),
                            Text(
                              user?.district ?? "Global Student",
                              style: commonTextStyle.copyWith(
                                color: Colors.white70,
                                fontSize: 11,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
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
              'study_progress_accuracy'.tr(),
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
                        'overall_mcq_accuracy'.tr(),
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
                        'weekly_study_hours'.tr(),
                        style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        "$hoursStr hrs",
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
              'achievement_badges'.tr(),
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 10),
            earnedBadges.isEmpty
                ? Padding(
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    child: Center(
                      child: Text(
                        'no_badges_earned_yet'.tr(),
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

            // Activity History Tab
            GestureDetector(
              onTap: () {
                context.push(RoutesNames.activityHistoryScreen);
              },
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(15),
                  border: Border.all(color: Colors.grey.shade200),
                ),
                padding:
                    const EdgeInsets.symmetric(vertical: 16, horizontal: 16),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Constants.primaryBlueColour.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Icon(Icons.history,
                          color: Constants.primaryBlueColour, size: 28),
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'activity_history'.tr(),
                            style: commonTextStyle.copyWith(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'view_your_past_quizzes_and_detailed_answers'.tr(),
                            style: commonTextStyle.copyWith(
                              fontSize: 12,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios,
                        color: Colors.grey.shade400, size: 16),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),

            // Admin CMS Portal (Only visible to admin)
            if (user?.email == 'bharatwakade012@gmail.com' ||
                user?.email == 'admin@missionvardi.com') ...[
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    backgroundColor: Colors.indigo,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  icon: const Icon(Icons.admin_panel_settings,
                      color: Colors.white),
                  label: Text(
                    'admin_cms_portal'.tr(),
                    style: commonTextStyle.copyWith(
                        color: Colors.white, fontWeight: FontWeight.bold),
                  ),
                  onPressed: () {
                    context.push(RoutesNames.adminDashboardScreen);
                  },
                ),
              ),
              const SizedBox(height: 15),
            ],

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
                  'logout_account'.tr(),
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

  Widget _buildLogoutButton(BuildContext context) {
    return IconButton(
      tooltip: 'logout'.tr(),
      icon: Container(
        width: 34,
        height: 34,
        decoration: BoxDecoration(
          color: Colors.red.withOpacity(0.18),
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: Colors.red.withOpacity(0.35)),
        ),
        child: const Icon(
          Icons.logout_rounded,
          color: Colors.redAccent,
          size: 18,
        ),
      ),
      onPressed: () async {
        final confirmed = await showDialog<bool>(
          context: context,
          builder: (ctx) => Dialog(
            backgroundColor: Colors.transparent,
            child: Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0B1437), Color(0xFF1A3572)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                    color: Colors.white.withOpacity(0.1)),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.4),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Icon
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.15),
                      shape: BoxShape.circle,
                      border: Border.all(
                          color: Colors.red.withOpacity(0.3)),
                    ),
                    child: const Icon(Icons.logout_rounded,
                        color: Colors.redAccent, size: 28),
                  ),
                  const SizedBox(height: 16),
                  // Title
                  Text(
                    'logout'.tr(),
                    style: commonTextStyle.copyWith(
                      color: Colors.white,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  // Message
                  Text(
                    'are_you_sure_you_want_to_logout'.tr(),
                    textAlign: TextAlign.center,
                    style: commonTextStyle.copyWith(
                      color: Colors.white60,
                      fontSize: 13,
                    ),
                  ),
                  const SizedBox(height: 24),
                  // Buttons
                  Row(
                    children: [
                      // Cancel
                      Expanded(
                        child: GestureDetector(
                          onTap: () => Navigator.pop(ctx, false),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                  color:
                                      Colors.white.withOpacity(0.15)),
                            ),
                            child: Center(
                              child: Text(
                                'cancel'.tr(),
                                style: commonTextStyle.copyWith(
                                  color: Colors.white70,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      // Logout
                      Expanded(
                        child: GestureDetector(
                          onTap: () => Navigator.pop(ctx, true),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                                vertical: 12),
                            decoration: BoxDecoration(
                              color: Colors.redAccent,
                              borderRadius: BorderRadius.circular(12),
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.red.withOpacity(0.4),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            ),
                            child: Center(
                              child: Text(
                                'logout'.tr(),
                                style: commonTextStyle.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        );
        if (confirmed == true && context.mounted) {
          context.read<ProfileCubit>().clearProfile();
          await context.read<AuthCubit>().signOut();
          if (context.mounted) {
            context.go(RoutesNames.signInScreen);
          }
        }
      },
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

  Future<void> _pickAndUploadImage(BuildContext context) async {
    final ImagePicker picker = ImagePicker();

    final ImageSource? source = await showModalBottomSheet<ImageSource>(
      context: context,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (BuildContext context) {
        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'choose_profile_photo'.tr(),
                  style: commonTextStyle.copyWith(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Constants.primaryBlueColour,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      icon: const Icon(Icons.camera_alt, color: Colors.white),
                      label: Text(
                        'camera'.tr(),
                        style: commonTextStyle.copyWith(
                            color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      onPressed: () =>
                          Navigator.pop(context, ImageSource.camera),
                    ),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey.shade800,
                        padding: const EdgeInsets.symmetric(
                            horizontal: 20, vertical: 12),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      icon:
                          const Icon(Icons.photo_library, color: Colors.white),
                      label: Text(
                        'gallery'.tr(),
                        style: commonTextStyle.copyWith(
                            color: Colors.white, fontWeight: FontWeight.bold),
                      ),
                      onPressed: () =>
                          Navigator.pop(context, ImageSource.gallery),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
              ],
            ),
          ),
        );
      },
    );

    if (source != null) {
      final XFile? pickedFile = await picker.pickImage(
        source: source,
        imageQuality: 75,
        maxWidth: 512,
        maxHeight: 512,
      );

      if (pickedFile != null) {
        final bytes = await pickedFile.readAsBytes();
        if (!context.mounted) return;

        final profileCubit = context.read<ProfileCubit>();
        final messenger = ScaffoldMessenger.of(context);

        await profileCubit.uploadAvatar(bytes: bytes);

        final state = profileCubit.state;
        if (state.errorMsg.isNotEmpty) {
          messenger.showSnackBar(
            SnackBar(
              content: Text(state.errorMsg),
              backgroundColor: Colors.red,
            ),
          );
        } else {
          messenger.showSnackBar(
            SnackBar(
              content: Text('profile_photo_updated_successfully'.tr()),
              backgroundColor: Colors.green,
            ),
          );
        }
      }
    }
  }

  void _showEditProfileBottomSheet(BuildContext context, user) {
    final _formKey = GlobalKey<FormState>();
    final TextEditingController nameController =
        TextEditingController(text: user.name);
    final TextEditingController mobileController =
        TextEditingController(text: user.mobile);

    final List<String> districts = [
      'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar (Aurangabad)', 
      'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 
      'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 
      'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 
      'Dharashiv (Osmanabad)', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 
      'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 
      'Wardha', 'Washim', 'Yavatmal',
    ];

    String? initialDistrict = user.district;
    if (initialDistrict != null && !districts.contains(initialDistrict)) {
      initialDistrict = null;
    }

    // Initialize Cubit state for the dropdown
    context.read<ProfileCubit>().initEditDistrict(initialDistrict);

    CommonBottomSheet.show(
      context: context,
      title: 'update_profile'.tr(),
      child: BlocBuilder<ProfileCubit, ProfileState>(
        builder: (context, state) {
          final selectedDistrict = state.editDistrict;

          return Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                CommonAuthInputField(
                  controller: nameController,
                  label: 'full_name'.tr(),
                  hint: 'enter_your_full_name'.tr(),
                  icon: Icons.person_outline,
                ),
                const SizedBox(height: 16),
                CommonAuthInputField(
                  controller: mobileController,
                  label: 'mobile_number'.tr(),
                  hint: 'enter_10_digit_mobile_number'.tr(),
                  icon: Icons.phone_outlined,
                  keyboardType: TextInputType.phone,
                  validator: (value) {
                    if (value == null || value.isEmpty) return null; // optional field
                    final digits = value.replaceAll(RegExp(r'\D'), '');
                    if (digits.length != 10) {
                      return 'please_enter_a_valid_10_digit_mobile_number'.tr();
                    }
                    if (!RegExp(r'^[6-9]\d{9}$').hasMatch(digits)) {
                      return 'mobile_number_must_start_with_6_7_8_or_9'.tr();
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 16),
                Padding(
                  padding: const EdgeInsets.only(left: 4),
                  child: Text(
                    'district_optional'.tr(),
                    style: commonTextStyle.copyWith(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: const Color(0xFF1E293B),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: DropdownButtonHideUnderline(
                    child: DropdownButton<String>(
                      value: selectedDistrict,
                      isExpanded: true,
                      hint: Text(
                        'select_your_district_global_if_none'.tr(),
                        style: commonTextStyle.copyWith(color: Colors.grey),
                      ),
                      icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.grey),
                      style: commonTextStyle.copyWith(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                        color: Colors.black87,
                      ),
                      onChanged: (String? newValue) {
                        context.read<ProfileCubit>().changeEditDistrict(newValue);
                      },
                      items: districts
                          .map((v) => DropdownMenuItem<String>(
                                value: v,
                                child: Text(v),
                              ))
                          .toList(),
                    ),
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.info_outline_rounded, size: 14, color: Colors.blueGrey),
                    const SizedBox(width: 6),
                    Expanded(
                      child: Text(
                        'add_your_district_to_participate_in_local_district_leaderboard_competitions_otherwise_youll_only_compete_globally'.tr(),
                        style: commonTextStyle.copyWith(
                          fontSize: 11,
                          color: Colors.blueGrey,
                          height: 1.3,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 24),
                CommonAuthButton(
                  label: 'save_changes'.tr(),
                  onTap: () {
                    if (!_formKey.currentState!.validate()) return;

                    final Map<String, dynamic> body = {};
                    if (nameController.text.isNotEmpty)
                      body["name"] = nameController.text;
                    if (mobileController.text.isNotEmpty)
                      body["mobile"] = mobileController.text.replaceAll(RegExp(r'\D'), '');
                    if (selectedDistrict != null) {
                      body["district"] = selectedDistrict;
                    }

                    context.read<ProfileCubit>().updateProfile(body: body);
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
          );
        }
      ),
    );
  }
}
