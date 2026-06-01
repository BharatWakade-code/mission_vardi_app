import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/auth_module/signin_screen.dart';
import 'package:mission_vardi/screens/auth_module/signup_screen.dart';
import 'package:mission_vardi/screens/pyq_module/pyq_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/quiz_play_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/quiz_result_screen.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_screen.dart';
import 'package:mission_vardi/screens/welcome_screen.dart';
import 'package:mission_vardi/screens/pdf_viewer_module/pdf_viewer_screen.dart';
import 'package:mission_vardi/screens/vardi_home_module/police_bharti_info_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/category_items_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/note_reading_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/leaderboard_screen.dart';
import 'package:mission_vardi/screens/admin_module/admin_dashboard_screen.dart';
import 'package:mission_vardi/screens/profile_module/activity_history_screen.dart';
import 'package:mission_vardi/screens/profile_module/activity_history_cubit.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

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
      builder: (context, state) => const SignInScreen(),
    ),
    GoRoute(
      path: RoutesNames.signUpScreen,
      builder: (context, state) => const SignUpScreen(),
    ),
    GoRoute(
      path: RoutesNames.welcomeScreen,
      builder: (context, state) => const WelcomeScreen(),
    ),
    GoRoute(
      path: RoutesNames.dashboardScreen,
      builder: (context, state) => const VardiDashboardScreen(),
    ),
    GoRoute(
      path: RoutesNames.quizPlayScreen,
      builder: (context, state) =>
          QuizPlayScreen(quizId: state.extra as String),
    ),
    GoRoute(
      path: RoutesNames.quizResultScreen,
      builder: (context, state) => const QuizResultScreen(),
    ),
    GoRoute(
      path: RoutesNames.pdfViewerScreen,
      builder: (context, state) {
        final extra = state.extra as Map<String, dynamic>;
        return PdfViewerScreen(
          pdfUrl: extra['pdfUrl'] as String,
          title: extra['title'] as String,
          description: extra['description'] as String,
        );
      },
    ),
    GoRoute(
      path: RoutesNames.policeBhartiInfoScreen,
      builder: (context, state) => const PoliceBhartiInfoScreen(),
    ),
    GoRoute(
      path: RoutesNames.pyqScreen,
      builder: (context, state) => const PYQScreen(),
    ),
    GoRoute(
      path: RoutesNames.categoryItemsScreen,
      builder: (context, state) {
        // We need to import the screen at the top later, or I'll just use dynamic imports if I use absolute paths, but better to import at the top. Wait, I will use `multi_replace` to add imports at the top.
        // Actually, let me just add the import below.
        return CategoryItemsScreen(categoryMode: state.extra as String);
      },
    ),
    GoRoute(
      path: RoutesNames.noteReadingScreen,
      builder: (context, state) {
        return NoteReadingScreen(noteData: state.extra as Map<String, dynamic>);
      },
    ),
    GoRoute(
      path: RoutesNames.leaderboardScreen,
      builder: (context, state) => const LeaderboardScreen(),
    ),
    GoRoute(
      path: RoutesNames.adminDashboardScreen,
      builder: (context, state) => const AdminDashboardScreen(),
    ),
    GoRoute(
      path: RoutesNames.activityHistoryScreen,
      builder: (context, state) => BlocProvider(
        create: (context) => ActivityHistoryCubit(),
        child: const ActivityHistoryScreen(),
      ),
    ),
  ];
}
