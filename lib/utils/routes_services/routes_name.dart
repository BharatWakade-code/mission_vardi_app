import 'package:go_router/go_router.dart';
import 'package:edusaas/screens/auth_module/signin_screen.dart';
import 'package:edusaas/screens/auth_module/signup_screen.dart';
import 'package:edusaas/screens/pyq_module/pyq_screen.dart';
import 'package:edusaas/screens/quizzes_module/quiz_play_screen.dart';
import 'package:edusaas/screens/quizzes_module/quiz_result_screen.dart';
import 'package:edusaas/screens/vardi_dashboard_module/vardi_dashboard_screen.dart';
import 'package:edusaas/screens/welcome_screen.dart';
import 'package:edusaas/screens/pdf_viewer_module/pdf_viewer_screen.dart';
import 'package:edusaas/screens/vardi_home_module/police_bharti_info_screen.dart';
import 'package:edusaas/screens/quizzes_module/category_items_screen.dart';
import 'package:edusaas/screens/quizzes_module/note_reading_screen.dart';
import 'package:edusaas/screens/quizzes_module/leaderboard_screen.dart';
import 'package:edusaas/screens/admin_module/admin_dashboard_screen.dart';
import 'package:edusaas/screens/profile_module/activity_history_screen.dart';
import 'package:edusaas/screens/profile_module/activity_history_cubit.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/locale_cubit.dart';

class RoutesNames {
  /// Auth Module
  static const String signInScreen = '/signInScreen';
  static const String signUpScreen = '/signUpScreen';

  /// Main Module
  static const String welcomeScreen = '/welcomeScreen';
  static const String dashboardScreen = '/dashboardScreen';
  static const String quizPlayScreen = '/quizPlayScreen';
  static const String quizResultScreen = '/quizResultScreen';
  static const String pdfViewerScreen = '/pdfViewerScreen';
  static const String currentAffairsScreen = '/currentAffairsScreen';
  static const String currentAffairsDetailScreen =
      '/currentAffairsDetailScreen';
  static const String policeBhartiInfoScreen = '/policeBhartiInfoScreen';
  static const String pyqScreen = '/pyqScreen';
  static const String categoryItemsScreen = '/categoryItemsScreen';
  static const String noteReadingScreen = '/noteReadingScreen';
  static const String leaderboardScreen = '/leaderboardScreen';
  static const String adminDashboardScreen = '/adminDashboardScreen';
  static const String activityHistoryScreen = '/activityHistoryScreen';
}

List<RouteBase> routesList() {
  return [
    GoRoute(
      path: RoutesNames.signInScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const SignInScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.signUpScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const SignUpScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.welcomeScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const WelcomeScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.dashboardScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const VardiDashboardScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.quizPlayScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: QuizPlayScreen(quizId: state.extra as String)),
      ),
    ),
    GoRoute(
      path: RoutesNames.quizResultScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const QuizResultScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.pdfViewerScreen,
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>;
        return BlocBuilder<LocaleCubit, Locale>(
          builder: (context, locale) => KeyedSubtree(
            key: ValueKey(locale),
            child: PdfViewerScreen(
              pdfUrl: extra['pdfUrl'] as String,
              title: extra['title'] as String,
              description: extra['description'] as String,
            ),
          ),
        );
      },
    ),
    GoRoute(
      path: RoutesNames.policeBhartiInfoScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const PoliceBhartiInfoScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.pyqScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const PYQScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.categoryItemsScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: CategoryItemsScreen(categoryMode: state.extra as String)),
      ),
    ),
    GoRoute(
      path: RoutesNames.noteReadingScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: NoteReadingScreen(noteData: state.extra as Map<String, dynamic>)),
      ),
    ),
    GoRoute(
      path: RoutesNames.leaderboardScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const LeaderboardScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.adminDashboardScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(key: ValueKey(locale), child: const AdminDashboardScreen()),
      ),
    ),
    GoRoute(
      path: RoutesNames.activityHistoryScreen,
      builder: (context, state) => BlocBuilder<LocaleCubit, Locale>(
        builder: (context, locale) => KeyedSubtree(
          key: ValueKey(locale),
          child: BlocProvider(
            create: (context) => ActivityHistoryCubit(),
            child: const ActivityHistoryScreen(),
          ),
        ),
      ),
    ),
  ];
}
