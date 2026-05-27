import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/auth_module/signin_screen.dart';
import 'package:mission_vardi/screens/auth_module/signup_screen.dart';
import 'package:mission_vardi/screens/pyq_module/pyq_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/quiz_play_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/quiz_result_screen.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_screen.dart';
import 'package:mission_vardi/screens/welcome_screen.dart';
import 'package:mission_vardi/screens/vardi_home_module/pdf_viewer_screen.dart';
import 'package:mission_vardi/screens/vardi_home_module/police_bharti_info_screen.dart';
import 'package:mission_vardi/screens/current_affairs_module/current_affairs_screen.dart';
import 'package:mission_vardi/screens/current_affairs_module/current_affairs_detail_screen.dart';
import 'package:mission_vardi/screens/current_affairs_module/data/current_affairs_model.dart';

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
  static const String currentAffairsDetailScreen = '/currentAffairsDetailScreen';
  static const String policeBhartiInfoScreen = '/policeBhartiInfoScreen';
  static const String pyqScreen = '/pyqScreen';
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
    GoRoute(
      path: RoutesNames.currentAffairsScreen,
      builder: (context, state) => const CurrentAffairsScreen(),
    ),
    GoRoute(
      path: RoutesNames.currentAffairsDetailScreen,
      builder: (context, state) {
        final article = state.extra as CurrentAffairsModel;
        return CurrentAffairsDetailScreen(article: article);
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
  ];
}
