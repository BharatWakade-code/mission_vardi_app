import 'package:flutter_bloc/flutter_bloc.dart';

import 'package:edusaas/screens/auth_module/auth_cubit.dart';
import 'package:edusaas/screens/quizzes_module/quizzes_cubit.dart';
import 'package:edusaas/screens/vardi_dashboard_module/vardi_dashboard_cubit.dart';
import 'package:edusaas/screens/vardi_home_module/vardi_home_cubit.dart';
import 'package:edusaas/screens/profile_module/profile_cubit.dart';

import 'package:edusaas/screens/admin_module/admin_cubit.dart';

import 'package:edusaas/screens/physical_prep_module/physical_prep_cubit.dart';
import 'package:edusaas/utils/depenedency_injection/get_it_setup.dart';
import 'package:edusaas/screens/localization_module/locale_cubit.dart';

providerList() {
  return [
    BlocProvider(
      create: (_) => getIt<AuthCubit>(),
    ),
    BlocProvider(
      create: (_) => getIt<VardiDashboardCubit>(),
    ),
    BlocProvider(
      create: (_) => getIt<VardiHomeCubit>(),
    ),
    BlocProvider(
      create: (_) => getIt<QuizzesCubit>(),
    ),
    BlocProvider(
      create: (_) => getIt<ProfileCubit>(),
    ),
    BlocProvider(
      create: (_) => PhysicalPrepCubit(),
    ),
    BlocProvider(
      create: (_) => AdminCubit(),
    ),

    BlocProvider(
      create: (_) => LocaleCubit(),
    ),
  ];
}
