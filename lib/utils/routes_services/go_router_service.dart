import 'dart:async';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

final navigatorKey = GlobalKey<NavigatorState>(debugLabel: 'root');

/// Bridges a [Stream] to a [ChangeNotifier] so GoRouter can listen to it.
/// Whenever Firebase emits a new auth state, GoRouter re-evaluates redirect.
class GoRouterRefreshStream extends ChangeNotifier {
  GoRouterRefreshStream(Stream<dynamic> stream) {
    notifyListeners();
    _subscription = stream.asBroadcastStream().listen((_) => notifyListeners());
  }

  late final StreamSubscription<dynamic> _subscription;

  @override
  void dispose() {
    _subscription.cancel();
    super.dispose();
  }
}

final GoRouter router = GoRouter(
  debugLogDiagnostics: true,
  navigatorKey: navigatorKey,
  initialLocation: RoutesNames.signInScreen,
  routes: routesList(),

  /// Tells GoRouter to re-run redirect() every time Firebase auth state changes
  refreshListenable: GoRouterRefreshStream(
    FirebaseAuth.instance.authStateChanges(),
  ),

  redirect: (context, state) {
    // ✅ Only trust the backend JWT stored in Hive as proof of a successful login.
    // Firebase auth alone (firebaseUser != null) is NOT sufficient — the backend
    // must have responded with 200 and we must have saved its token.
    // This prevents a 422 /auth/google response from still landing on dashboard.
    final hiveToken = CommonHiveData.getString('token');
    final isLoggedIn = hiveToken.isNotEmpty;

    final isAuthRoute = state.uri.path == RoutesNames.signInScreen ||
        state.uri.path == RoutesNames.signUpScreen;

    // Not logged in → always go to sign in
    if (!isLoggedIn && !isAuthRoute) {
      return RoutesNames.signInScreen;
    }

    // Already logged in and on an auth screen → go to dashboard
    if (isLoggedIn && isAuthRoute) {
      return RoutesNames.dashboardScreen;
    }

    return null; // no redirect needed
  },
);
