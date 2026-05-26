import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/screens/auth_module/auth_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/vardi_dashboard_module/vardi_dashboard_cubit.dart';
import 'package:mission_vardi/screens/vardi_home_module/vardi_home_cubit.dart';
import 'package:mission_vardi/screens/profile_module/profile_cubit.dart';
import 'package:mission_vardi/utils/depenedency_injection/get_it_setup.dart';

providerList() {
  return [
    BlocProvider(
      create: (_) => getIt<LanguageCubit>()..loadSavedLanguage(),
    ),
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
  ];
}
