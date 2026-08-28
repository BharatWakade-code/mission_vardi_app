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
          _buildLogoutButton(context),
        ],
      ),
      body: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        child: Column(
          children: [
            // Top Section (Profile Card)
            // =======================
// Modern Profile Header
// =======================

            Container(
              margin: const EdgeInsets.fromLTRB(16, 12, 16, 0),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(32),
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [
                    Color(0xFF2563EB),
                    Color(0xFF1D4ED8),
                    Color(0xFF1E40AF),
                  ],
                ),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF2563EB).withOpacity(0.25),
                    blurRadius: 25,
                    offset: const Offset(0, 10),
                  ),
                ],
              ),
              child: Stack(
                children: [
                  // Background Circle Effects
                  Positioned(
                    top: -40,
                    right: -30,
                    child: Container(
                      width: 140,
                      height: 140,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.06),
                      ),
                    ),
                  ),

                  Positioned(
                    bottom: -50,
                    left: -40,
                    child: Container(
                      width: 160,
                      height: 160,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: Colors.white.withOpacity(0.04),
                      ),
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(22),
                    child: Column(
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // ===================
                            // Profile Image
                            // ===================

                            Stack(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    border: Border.all(
                                      color: Colors.white.withOpacity(0.25),
                                      width: 2,
                                    ),
                                  ),
                                  child: CircleAvatar(
                                    radius: 42,
                                    backgroundColor: Colors.white24,
                                    backgroundImage: (user?.avatarUrl != null &&
                                            user!.avatarUrl!.isNotEmpty)
                                        ? NetworkImage(user!.avatarUrl!)
                                        : NetworkImage(
                                            'https://ui-avatars.com/api/?name=${user?.name ?? 'User'}&background=random&color=fff'),
                                  ),
                                ),
                                Positioned(
                                  bottom: 2,
                                  right: 2,
                                  child: InkWell(
                                    onTap: () => _pickAndUploadImage(context),
                                    borderRadius: BorderRadius.circular(50),
                                    child: Container(
                                      padding: const EdgeInsets.all(8),
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(
                                            color:
                                                Colors.black.withOpacity(0.15),
                                            blurRadius: 8,
                                          ),
                                        ],
                                      ),
                                      child: const Icon(
                                        Icons.camera_alt_rounded,
                                        size: 16,
                                        color: Color(0xFF2563EB),
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),

                            const SizedBox(width: 18),

                            // ===================
                            // User Details
                            // ===================

                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Expanded(
                                        child: Text(
                                          user?.name ?? "User Name",
                                          maxLines: 1,
                                          overflow: TextOverflow.ellipsis,
                                          style: commonTextStyle.copyWith(
                                            color: Colors.white,
                                            fontSize: 22,
                                            fontWeight: FontWeight.w700,
                                            letterSpacing: 0.2,
                                          ),
                                        ),
                                      ),
                                      InkWell(
                                        onTap: () {
                                          if (user != null) {
                                            _showEditProfileBottomSheet(
                                                context, user);
                                          }
                                        },
                                        borderRadius: BorderRadius.circular(12),
                                        child: Container(
                                          padding: const EdgeInsets.all(8),
                                          decoration: BoxDecoration(
                                            color:
                                                Colors.white.withOpacity(0.12),
                                            borderRadius:
                                                BorderRadius.circular(12),
                                            border: Border.all(
                                              color: Colors.white
                                                  .withOpacity(0.08),
                                            ),
                                          ),
                                          child: const Icon(
                                            Icons.edit_rounded,
                                            size: 18,
                                            color: Colors.white,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),

                                  const SizedBox(height: 8),

                                  if (user?.district != null && user!.district!.isNotEmpty)
                                    Container(
                                      padding: const EdgeInsets.symmetric(
                                        horizontal: 10,
                                        vertical: 6,
                                      ),
                                      decoration: BoxDecoration(
                                        color: Colors.white.withOpacity(0.12),
                                        borderRadius: BorderRadius.circular(30),
                                      ),
                                      child: Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          const Icon(
                                            Icons.location_on_rounded,
                                            size: 14,
                                            color: Colors.amber,
                                          ),
                                          const SizedBox(width: 5),
                                          Flexible(
                                            child: Text(
                                              user!.district!,
                                              overflow: TextOverflow.ellipsis,
                                              style: commonTextStyle.copyWith(
                                                color: Colors.white,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w600,
                                              ),
                                            ),
                                          ),
                                        ],
                                      ),
                                    ),

                                  const SizedBox(height: 14),

                                  // ===================
                                  // Email Container
                                  // ===================

                                  Container(
                                    width: double.infinity,
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 14,
                                      vertical: 12,
                                    ),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.10),
                                      borderRadius: BorderRadius.circular(18),
                                      border: Border.all(
                                        color: Colors.white.withOpacity(0.08),
                                      ),
                                    ),
                                    child: Row(
                                      children: [
                                        const Icon(
                                          Icons.email_rounded,
                                          color: Colors.white70,
                                          size: 18,
                                        ),
                                        const SizedBox(width: 10),
                                        Expanded(
                                          child: Text(
                                            user?.email ?? "example@gmail.com",
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            style: commonTextStyle.copyWith(
                                              color: Colors.white,
                                              fontSize: 13,
                                              fontWeight: FontWeight.w600,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        if (user?.isVerified == true)
                                          Container(
                                            padding: const EdgeInsets.symmetric(
                                              horizontal: 10,
                                              vertical: 5,
                                            ),
                                            decoration: BoxDecoration(
                                              color: Colors.green
                                                  .withOpacity(0.18),
                                              borderRadius:
                                                  BorderRadius.circular(30),
                                            ),
                                            child: Row(
                                              children: [
                                                const Icon(
                                                  Icons.verified_rounded,
                                                  color: Colors.greenAccent,
                                                  size: 14,
                                                ),
                                                const SizedBox(width: 4),
                                                Text(
                                                  "Verified",
                                                  style:
                                                      commonTextStyle.copyWith(
                                                    color: Colors.white,
                                                    fontSize: 11,
                                                    fontWeight: FontWeight.w700,
                                                  ),
                                                ),
                                              ],
                                            ),
                                          )
                                        else
                                          GestureDetector(
                                            onTap: () async {
                                              try {
                                                final auth =
                                                    FirebaseAuth.instance;

                                                await auth.currentUser
                                                    ?.sendEmailVerification();

                                                ScaffoldMessenger.of(context)
                                                    .showSnackBar(
                                                  SnackBar(
                                                    content: Text(
                                                      'verification_link_sent'
                                                          .tr(),
                                                    ),
                                                  ),
                                                );
                                              } catch (e) {
                                                ScaffoldMessenger.of(context)
                                                    .showSnackBar(
                                                  SnackBar(
                                                    content: Text("Error: $e"),
                                                  ),
                                                );
                                              }
                                            },
                                            child: Container(
                                              padding:
                                                  const EdgeInsets.symmetric(
                                                horizontal: 12,
                                                vertical: 6,
                                              ),
                                              decoration: BoxDecoration(
                                                color: Colors.orange,
                                                borderRadius:
                                                    BorderRadius.circular(30),
                                              ),
                                              child: Text(
                                                "Verify",
                                                style: commonTextStyle.copyWith(
                                                  color: Colors.white,
                                                  fontSize: 11,
                                                  fontWeight: FontWeight.bold,
                                                ),
                                              ),
                                            ),
                                          ),
                                      ],
                                    ),
                                  ),
                                ],
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
            Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Two-column Stats
                  Row(
                    children: [
                      Expanded(
                        child: _buildStatCard(
                          title: 'overall_mcq_accuracy'.tr(),
                          value: "${accuracy.toStringAsFixed(0)}%",
                          icon: Icons.check_circle_outline,
                          iconColor: Colors.green.shade600,
                          progress: accuracy / 100.0,
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: _buildStatCard(
                          title: 'weekly_study_hours'.tr(),
                          value: "$hoursStr hrs",
                          icon: Icons.access_time_filled,
                          iconColor: Colors.orange.shade600,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 28),

                  // Weekly Progress Chart
                  Text(
                    'weekly_progress'.tr(),
                    style: commonTextStyle.copyWith(
                        fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 12),
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.04),
                            blurRadius: 10,
                            offset: const Offset(0, 4))
                      ],
                      border: Border.all(color: Colors.grey.shade100),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: weeklyHoursData.isEmpty
                          ? List.generate(
                              7, (index) => _barItem("-", 0.0, "0h"))
                          : weeklyHoursData
                              .map((w) {
                                String dayStr = w['day'] ?? "";
                                double m = (w['minutes'] as num?)?.toDouble() ??
                                    ((w['hours'] as num?)?.toDouble() ?? 0.0) *
                                        60;
                                double fill = maxWeeklyHours > 0
                                    ? m / maxWeeklyHours
                                    : 0.0;
                                String valueStr =
                                    m > 0 ? "${m.toStringAsFixed(1)}m" : "0m";
                                if (valueStr.endsWith(".0m"))
                                  valueStr = "${m.toInt()}m";
                                return _barItem(dayStr, fill, valueStr);
                              })
                              .toList()
                              .cast<Widget>(),
                    ),
                  ),
                  const SizedBox(height: 28),

                  // Achievement Badges
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'achievement_badges'.tr(),
                        style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold, fontSize: 18),
                      ),
                      Icon(Icons.workspace_premium,
                          color: Colors.amber.shade600, size: 24),
                    ],
                  ),
                  const SizedBox(height: 12),
                  earnedBadges.isEmpty
                      ? Container(
                          width: double.infinity,
                          padding: const EdgeInsets.all(24),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(
                                color: Colors.grey.shade200,
                                style: BorderStyle.solid),
                          ),
                          child: Column(
                            children: [
                              Icon(Icons.military_tech_outlined,
                                  size: 40, color: Colors.grey.shade400),
                              const SizedBox(height: 8),
                              Text(
                                'no_badges_earned_yet'.tr(),
                                style: commonTextStyle.copyWith(
                                    color: Colors.grey.shade600,
                                    fontWeight: FontWeight.w500),
                              ),
                            ],
                          ),
                        )
                      : GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 3,
                            crossAxisSpacing: 12,
                            mainAxisSpacing: 12,
                            childAspectRatio: 0.85,
                          ),
                          itemCount: earnedBadges.length,
                          itemBuilder: (context, index) {
                            final badge = earnedBadges[index];
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
                            return _badgeItem(
                                icon: icon,
                                color: color,
                                title: badge['title'] ?? '',
                                desc: badge['desc'] ?? '');
                          },
                        ),
                  const SizedBox(height: 28),

                  // Activity History Tab
                  _buildActionTile(
                    title: 'activity_history'.tr(),
                    subtitle:
                        'view_your_past_quizzes_and_detailed_answers'.tr(),
                    icon: Icons.history_rounded,
                    iconColor: Constants.primaryBlueColour,
                    onTap: () =>
                        context.push(RoutesNames.activityHistoryScreen),
                  ),
                  const SizedBox(height: 16),

                  // Admin CMS Portal
                  if (user?.email == 'bharatwakade012@gmail.com' ||
                      user?.email == 'admin@missionvardi.com') ...[
                    _buildActionTile(
                      title: 'admin_cms_portal'.tr(),
                      subtitle: 'Manage app content and users',
                      icon: Icons.admin_panel_settings_rounded,
                      iconColor: Colors.indigo,
                      onTap: () =>
                          context.push(RoutesNames.adminDashboardScreen),
                      isPrimary: true,
                    ),
                    const SizedBox(height: 28),
                  ],

                  // Settings / Others
                  Text(
                    'account_settings'.tr(),
                    style: commonTextStyle.copyWith(
                        fontWeight: FontWeight.bold, fontSize: 18),
                  ),
                  const SizedBox(height: 12),

                  Container(
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      boxShadow: [
                        BoxShadow(
                            color: Colors.black.withOpacity(0.02),
                            blurRadius: 8,
                            offset: const Offset(0, 2))
                      ],
                      border: Border.all(color: Colors.grey.shade100),
                    ),
                    child: Column(
                      children: [
                        _buildSettingsTile(
                          title: 'about_app'.tr(),
                          icon: Icons.info_outline_rounded,
                          color: Constants.primaryBlueColour,
                          onTap: () => _showAboutAppDialog(context),
                        ),
                        Divider(
                            height: 1, color: Colors.grey.shade100, indent: 56),
                        _buildSettingsTile(
                          title: 'logout_account'.tr(),
                          icon: Icons.logout_rounded,
                          color: Colors.orange.shade700,
                          onTap: () async {
                            final confirmed = await showDialog<bool>(
                              context: context,
                              builder: (ctx) => Dialog(
                                backgroundColor: Colors.transparent,
                                child: Container(
                                  padding: const EdgeInsets.all(24),
                                  decoration: BoxDecoration(
                                    gradient: const LinearGradient(
                                      colors: [
                                        Color(0xFF0B1437),
                                        Color(0xFF1A3572)
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                        color: Colors.white.withOpacity(0.1)),
                                  ),
                                  child: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.all(16),
                                        decoration: BoxDecoration(
                                          color: Colors.red.withOpacity(0.1),
                                          shape: BoxShape.circle,
                                        ),
                                        child: const Icon(Icons.logout_rounded,
                                            color: Colors.redAccent, size: 40),
                                      ),
                                      const SizedBox(height: 20),
                                      Text(
                                        'logout_account'.tr(),
                                        style: commonTextStyle.copyWith(
                                          color: Colors.white,
                                          fontSize: 20,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      const SizedBox(height: 12),
                                      Text(
                                        'are_you_sure_you_want_to_logout'.tr(),
                                        textAlign: TextAlign.center,
                                        style: commonTextStyle.copyWith(
                                          color: Colors.white70,
                                          fontSize: 14,
                                        ),
                                      ),
                                      const SizedBox(height: 30),
                                      Row(
                                        children: [
                                          Expanded(
                                            child: TextButton(
                                              onPressed: () =>
                                                  Navigator.of(ctx).pop(false),
                                              style: TextButton.styleFrom(
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                        vertical: 14),
                                                shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            12)),
                                              ),
                                              child: Text(
                                                'cancel'.tr(),
                                                style: commonTextStyle.copyWith(
                                                    color: Colors.white70,
                                                    fontWeight:
                                                        FontWeight.bold),
                                              ),
                                            ),
                                          ),
                                          const SizedBox(width: 12),
                                          Expanded(
                                            child: ElevatedButton(
                                              onPressed: () =>
                                                  Navigator.of(ctx).pop(true),
                                              style: ElevatedButton.styleFrom(
                                                backgroundColor:
                                                    Colors.redAccent,
                                                foregroundColor: Colors.white,
                                                padding:
                                                    const EdgeInsets.symmetric(
                                                        vertical: 14),
                                                shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            12)),
                                                elevation: 0,
                                              ),
                                              child: Text(
                                                'logout'.tr(),
                                                style: commonTextStyle.copyWith(
                                                    fontWeight:
                                                        FontWeight.bold),
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
                        ),
                        Divider(
                            height: 1, color: Colors.grey.shade100, indent: 56),
                        _buildSettingsTile(
                          title: 'delete_account'.tr(),
                          icon: Icons.delete_forever_rounded,
                          color: Colors.red.shade700,
                          onTap: () => _showDeleteAccountDialog(context),
                          isDanger: true,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
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
                border: Border.all(color: Colors.white.withOpacity(0.1)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Colors.red.withOpacity(0.1),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.logout_rounded,
                        color: Colors.redAccent, size: 40),
                  ),
                  const SizedBox(height: 20),
                  Text(
                    'logout_account'.tr(),
                    style: commonTextStyle.copyWith(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    'are_you_sure_you_want_to_logout'.tr(),
                    textAlign: TextAlign.center,
                    style: commonTextStyle.copyWith(
                      color: Colors.white70,
                      fontSize: 14,
                    ),
                  ),
                  const SizedBox(height: 30),
                  Row(
                    children: [
                      Expanded(
                        child: TextButton(
                          onPressed: () => Navigator.of(ctx).pop(false),
                          style: TextButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                          ),
                          child: Text(
                            'cancel'.tr(),
                            style: commonTextStyle.copyWith(
                                color: Colors.white70,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          onPressed: () => Navigator.of(ctx).pop(true),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.redAccent,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12)),
                            elevation: 0,
                          ),
                          child: Text(
                            'logout'.tr(),
                            style: commonTextStyle.copyWith(
                                fontWeight: FontWeight.bold),
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

  void _showAboutAppDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          title: Row(
            children: [
              const Icon(Icons.info, color: Constants.primaryBlueColour),
              const SizedBox(width: 8),
              Text('about_app'.tr(),
                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Mission Vardi',
                  style: commonTextStyle.copyWith(
                      fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text('Version 1.0.0',
                  style: commonTextStyle.copyWith(color: Colors.grey)),
              const SizedBox(height: 16),
              Text(
                'This app is dedicated to helping aspirants prepare for the Maharashtra Police Bharti exams. We provide daily quizzes, detailed notes, study tracking, and fitness logs.',
                style: commonTextStyle.copyWith(fontSize: 14, height: 1.4),
              ),
              const SizedBox(height: 16),
              Text('Developer:',
                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold)),
              Text('Bharat Wakade',
                  style: commonTextStyle.copyWith(color: Colors.grey.shade700)),
              Text('bharatwakade012@gmail.com',
                  style: commonTextStyle.copyWith(
                      color: Constants.primaryBlueColour)),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('close'.tr(),
                  style: commonTextStyle.copyWith(
                      color: Constants.primaryBlueColour,
                      fontWeight: FontWeight.bold)),
            ),
          ],
        );
      },
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => Dialog(
        backgroundColor: Colors.transparent,
        child: Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                    color: Colors.red.withOpacity(0.1), shape: BoxShape.circle),
                child: const Icon(Icons.delete_forever,
                    color: Colors.redAccent, size: 40),
              ),
              const SizedBox(height: 20),
              Text(
                'delete_account'.tr(),
                style: commonTextStyle.copyWith(
                    color: Colors.red,
                    fontSize: 20,
                    fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Text(
                'This action cannot be undone. All your progress, fitness logs, and profile data will be permanently deleted.',
                textAlign: TextAlign.center,
                style: commonTextStyle.copyWith(
                    color: Colors.black87, fontSize: 14, height: 1.4),
              ),
              const SizedBox(height: 30),
              Row(
                children: [
                  Expanded(
                    child: TextButton(
                      onPressed: () => Navigator.of(ctx).pop(),
                      style: TextButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                      child: Text('cancel'.tr(),
                          style: commonTextStyle.copyWith(
                              color: Colors.grey.shade700,
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        Navigator.of(ctx).pop();
                        // Delete logic handled by AuthCubit (e.g. deactivate user)
                        context.read<ProfileCubit>().clearProfile();
                        await context.read<AuthCubit>().signOut();
                        if (context.mounted) {
                          context.go(RoutesNames.signInScreen);
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.redAccent,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                        elevation: 0,
                      ),
                      child: Text('delete'.tr(),
                          style: commonTextStyle.copyWith(
                              fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _barItem(String label, double fill, String value) {
    return Column(
      children: [
        Text(value,
            style: commonTextStyle.copyWith(
                fontSize: 10,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.w600)),
        const SizedBox(height: 6),
        Container(
          height: 100,
          width: 16,
          decoration: BoxDecoration(
            color: Colors.grey.shade100,
            borderRadius: BorderRadius.circular(8),
          ),
          alignment: Alignment.bottomCenter,
          child: Container(
            height: 100 * fill,
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E88E5), Color(0xFF0D47A1)],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.circular(8),
            ),
          ),
        ),
        const SizedBox(height: 8),
        Text(label,
            style: commonTextStyle.copyWith(
                fontSize: 11,
                color: Colors.grey.shade700,
                fontWeight: FontWeight.w500)),
      ],
    );
  }

  Widget _badgeItem(
      {required IconData icon,
      required Color color,
      required String title,
      required String desc}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.02),
              blurRadius: 8,
              offset: const Offset(0, 2))
        ],
      ),
      padding: const EdgeInsets.all(10),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 8),
          Text(title,
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold, fontSize: 11),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis),
          const SizedBox(height: 2),
          Text(desc,
              style: commonTextStyle.copyWith(
                  fontSize: 9, color: Colors.grey.shade600),
              textAlign: TextAlign.center,
              maxLines: 2,
              overflow: TextOverflow.ellipsis),
        ],
      ),
    );
  }

  Widget _buildStatCard(
      {required String title,
      required String value,
      required IconData icon,
      required Color iconColor,
      double? progress}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.03),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                    color: iconColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10)),
                child: Icon(icon, color: iconColor, size: 18),
              ),
              const SizedBox(width: 8),
              Expanded(
                  child: Text(title,
                      style: commonTextStyle.copyWith(
                          fontSize: 12,
                          color: Colors.grey.shade600,
                          fontWeight: FontWeight.w600),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis)),
            ],
          ),
          const SizedBox(height: 12),
          Text(value,
              style: commonTextStyle.copyWith(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.black87)),
          if (progress != null) ...[
            const SizedBox(height: 8),
            ClipRRect(
              borderRadius: BorderRadius.circular(4),
              child: LinearProgressIndicator(
                value: progress,
                minHeight: 6,
                backgroundColor: Colors.grey.shade100,
                valueColor: AlwaysStoppedAnimation<Color>(iconColor),
              ),
            ),
          ]
        ],
      ),
    );
  }

  Widget _buildActionTile(
      {required String title,
      required String subtitle,
      required IconData icon,
      required Color iconColor,
      required VoidCallback onTap,
      bool isPrimary = false}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        decoration: BoxDecoration(
          color: isPrimary ? iconColor : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: isPrimary ? null : Border.all(color: Colors.grey.shade100),
          boxShadow: isPrimary
              ? [
                  BoxShadow(
                      color: iconColor.withOpacity(0.3),
                      blurRadius: 10,
                      offset: const Offset(0, 4))
                ]
              : [
                  BoxShadow(
                      color: Colors.black.withOpacity(0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 4))
                ],
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: isPrimary
                    ? Colors.white.withOpacity(0.2)
                    : iconColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(icon,
                  color: isPrimary ? Colors.white : iconColor, size: 24),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: commonTextStyle.copyWith(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: isPrimary ? Colors.white : Colors.black87)),
                  const SizedBox(height: 4),
                  Text(subtitle,
                      style: commonTextStyle.copyWith(
                          fontSize: 12,
                          color: isPrimary
                              ? Colors.white70
                              : Colors.grey.shade600)),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded,
                color: isPrimary ? Colors.white70 : Colors.grey.shade400,
                size: 16),
          ],
        ),
      ),
    );
  }

  Widget _buildSettingsTile(
      {required String title,
      required IconData icon,
      required Color color,
      required VoidCallback onTap,
      bool isDanger = false}) {
    return Material(
      color: Colors.transparent,
      child: ListTile(
        onTap: onTap,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title,
            style: commonTextStyle.copyWith(
                fontWeight: FontWeight.w600,
                fontSize: 15,
                color: isDanger ? Colors.redAccent : Colors.black87)),
        trailing: Icon(Icons.arrow_forward_ios_rounded,
            size: 14, color: Colors.grey.shade400),
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

    final List<String> districts = context.read<ProfileCubit>().state.districts;

    String? initialDistrict = user.district;
    if (initialDistrict != null && !districts.contains(initialDistrict)) {
      initialDistrict = null;
    }

    // Initialize Cubit state for the dropdown
    context.read<ProfileCubit>().initEditDistrict(initialDistrict);

    CommonBottomSheet.show(
      context: context,
      title: 'update_profile'.tr(),
      child: BlocBuilder<ProfileCubit, ProfileState>(builder: (context, state) {
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
                  if (value == null || value.isEmpty)
                    return null; // optional field
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
                    icon: const Icon(Icons.keyboard_arrow_down_rounded,
                        color: Colors.grey),
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
                  const Icon(Icons.info_outline_rounded,
                      size: 14, color: Colors.blueGrey),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      'add_your_district_to_participate_in_local_district_leaderboard_competitions_otherwise_youll_only_compete_globally'
                          .tr(),
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
                    body["mobile"] =
                        mobileController.text.replaceAll(RegExp(r'\D'), '');
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
      }),
    );
  }
}
