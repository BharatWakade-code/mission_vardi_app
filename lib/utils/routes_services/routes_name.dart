import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/quizzes_module/quiz_play_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/quiz_result_screen.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_screen.dart';
import 'package:mission_vardi/screens/welcome_screen.dart';
import 'package:mission_vardi/screens/vardi_home_module/pdf_viewer_screen.dart';

class RoutesNames {
  /// Login Module
  static const String welcomeScreen = '/welcomeScreen';
  static const String dashboardScreen = '/dashboardScreen';
  static const String quizPlayScreen = '/quizPlayScreen';
  static const String quizResultScreen = '/quizResultScreen';
  static const String pdfViewerScreen = '/pdfViewerScreen';
}

List<RouteBase> routesList() {
  return [
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
      builder: (context, state) => QuizPlayScreen(quizId: state.extra as String),
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
  ];
}
