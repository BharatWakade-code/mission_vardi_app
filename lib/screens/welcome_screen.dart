import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/utils/common_widgets/common_button.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: Constants.primaryBlueColour,
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Color(0xFF0A2540), // Dark Navy Blue
              Color(0xFF0D47A1), // Royal Police Blue
              Color(0xFF1565C0), // Dark Blue
            ],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 25, vertical: 20),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    /// Police Badge Icon / App Emblem
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.1),
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Colors.amber.withOpacity(0.5),
                          width: 2,
                        ),
                      ),
                      child: const Icon(
                        Icons.security,
                        size: 90,
                        color: Colors.amber,
                      ),
                    ),
                    const SizedBox(height: 25),

                    /// Header Title
                    Text(
                      "MISSION VARDI",
                      textAlign: TextAlign.center,
                      style: commonTextStyle.copyWith(
                        color: Colors.white,
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 1.5,
                      ),
                    ),

                    const SizedBox(height: 5),

                    /// Subtitle Tag line
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                      decoration: BoxDecoration(
                        color: Colors.amber.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: Colors.amber.withOpacity(0.3),
                          width: 1,
                        ),
                      ),
                      child: Text(
                        "Maharashtra's #1 Police Bharti App 👮‍♂️",
                        style: commonTextStyle.copyWith(
                          color: Colors.amber.shade200,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),

                    const SizedBox(height: 30),

                    /// Slogan Text
                    Text(
                      "Your Dream Uniform is Within Reach",
                      textAlign: TextAlign.center,
                      style: commonTextStyle.copyWith(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.bold,
                        height: 1.2,
                      ),
                    ),

                    const SizedBox(height: 15),

                    /// Description text
                    Text(
                      "Prepare with daily MCQ tests, real-time mock timers, physical test trackers, and district-wise rank analysis. Track sit-ups, pushups, and 1600m sprints.",
                      textAlign: TextAlign.center,
                      style: commonTextStyle.copyWith(
                        color: Colors.white.withOpacity(0.85),
                        fontSize: 13,
                        fontWeight: FontWeight.w400,
                        height: 1.5,
                      ),
                    ),

                    const SizedBox(height: 40),

                    /// Phone OTP / Sign In Button
                    GestureDetector(
                      onTap: () {
                        context.go(RoutesNames.dashboardScreen);
                      },
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.amber,
                          borderRadius: BorderRadius.circular(30),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.amber.withOpacity(0.4),
                              blurRadius: 10,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Center(
                          child: Text(
                            "Get Started with Phone OTP",
                            style: commonTextStyle.copyWith(
                              color: const Color(0xFF0A2540),
                              fontSize: 16,
                              fontWeight: FontWeight.w800,
                            ),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(height: 15),

                    /// Sign In with Google
                    GestureDetector(
                      onTap: () {
                        // Simulate Google Sign-in and go to Home
                        CommonHiveData.setString('role', 'FARMER');
                        CommonHiveData.setString('token', 'google_mock_token');
                        context.go(RoutesNames.dashboardScreen);
                      },
                      child: Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(30),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.g_mobiledata, size: 24, color: Colors.red),
                            const SizedBox(width: 8),
                            Text(
                              "Sign in with Google",
                              style: commonTextStyle.copyWith(
                                color: Colors.black87,
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    /// Guest Mode Bypass
                    TextButton(
                      onPressed: () {
                        // Skip onboarding and go directly as Guest
                        CommonHiveData.setString('role', 'FARMER');
                        CommonHiveData.setString('token', 'guest_mock_token');
                        context.go(RoutesNames.dashboardScreen);
                      },
                      child: Text(
                        "Continue as Guest Mode",
                        style: commonTextStyle.copyWith(
                          color: Colors.white70,
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          decoration: TextDecoration.underline,
                          decorationColor: Colors.white70,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class KeyValueIconAndLabel extends StatelessWidget {
  final Widget? icon;
  final String label;

  const KeyValueIconAndLabel({
    super.key,
    this.icon,
    required this.label,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      spacing: 5,
      children: [
        if (icon != null) ...[
          icon!,
        ],
        Text(
          label,
          style: commonTextStyle.copyWith(
            color: Constants.whiteColour,
            fontSize: 12,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
