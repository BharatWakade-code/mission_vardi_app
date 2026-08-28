import 'package:flutter/material.dart';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_cubit.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_state.dart';
import 'package:mission_vardi/screens/vardi_home_module/vardi_home_screen.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_screen.dart';
import 'package:mission_vardi/screens/physical_prep_module/physical_prep_screen.dart';
import 'package:mission_vardi/screens/profile_module/profile_screen.dart';
import 'package:intl/intl.dart';

import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/screens/localization_module/locale_cubit.dart';

class VardiDashboardScreen extends StatefulWidget {
  const VardiDashboardScreen({super.key});

  @override
  State<VardiDashboardScreen> createState() => _VardiDashboardScreenState();
}

class _VardiDashboardScreenState extends State<VardiDashboardScreen> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  @override
  Widget build(BuildContext context) {
    context.watch<LocaleCubit>();
    final dashboardCubit = context.watch<VardiDashboardCubit>();

    List<Widget> screens = [
      const FarmerHomeScreen(), // Mapped to the home screen class in vardi_home_screen
      const QuizzesScreen(),
      const PhysicalPrepScreen(),
      const ProfileScreen(),
    ];

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: Constants.scaffoldBackgroundColour,
      bottomNavigationBar: mainBottomNavigationBar(dashboardCubit, context),
      body: screens[dashboardCubit.state.selectedIndex],
    );
  }

  BottomNavigationBar mainBottomNavigationBar(
      VardiDashboardCubit dashboardCubit, BuildContext context) {
    return BottomNavigationBar(
      type: BottomNavigationBarType.fixed,
      currentIndex: dashboardCubit.state.selectedIndex,
      selectedItemColor: Colors.amber,
      unselectedItemColor: Colors.white.withOpacity(0.7),
      backgroundColor: Constants.primaryBlueColour,
      onTap: (index) {
        dashboardCubit.onChangeIndex(index);
      },
      selectedLabelStyle: commonTextStyle.copyWith(
        color: Colors.amber,
        fontSize: 10,
        fontWeight: FontWeight.bold,
      ),
      unselectedLabelStyle: commonTextStyle.copyWith(
        color: Colors.white70,
        fontSize: 10,
        fontWeight: FontWeight.normal,
      ),
      items: [
        BottomNavigationBarItem(
          icon: const Icon(Icons.home_filled),
          label: 'home'.tr(),
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.quiz_rounded),
          label: 'quiz'.tr(),
        ),
        BottomNavigationBarItem(
          icon: const Icon(Icons.directions_run_rounded),
          label: 'physical'.tr(),
        ),

        BottomNavigationBarItem(
          icon: const Icon(Icons.person_rounded),
          label: 'profile'.tr(),
        ),
      ],
    );
  }
}
