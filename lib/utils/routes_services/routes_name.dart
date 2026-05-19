import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_screen.dart';
import 'package:mission_vardi/screens/welcome_screen.dart';

class RoutesNames {
  /// Login Module
  static const String welcomeScreen = '/welcomeScreen';
  static const String dashboardScreen = '/dashboardScreen';
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
  ];
}
