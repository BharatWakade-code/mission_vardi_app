// dart format width=80
// GENERATED CODE - DO NOT MODIFY BY HAND

// **************************************************************************
// InjectableConfigGenerator
// **************************************************************************

// ignore_for_file: type=lint
// coverage:ignore-file

// ignore_for_file: no_leading_underscores_for_library_prefixes
import 'package:get_it/get_it.dart' as _i174;
import 'package:injectable/injectable.dart' as _i526;

import '../../localization/language_cubit.dart' as _i928;
import '../../screens/quizzes_module/data/quizzes_data_source.dart' as _i585;
import '../../screens/quizzes_module/quizzes_cubit.dart' as _i932;
import '../../screens/quizzes_module/repository/quizzes_repository.dart'
    as _i707;
import '../../screens/vardi_dashboard_module/vardi_dashboard_cubit.dart'
    as _i319;
import '../../screens/vardi_home_module/data/home_repository.dart' as _i421;
import '../../screens/vardi_home_module/vardi_home_cubit.dart' as _i672;

extension GetItInjectableX on _i174.GetIt {
// initializes the registration of main-scope dependencies inside of GetIt
  _i174.GetIt init({
    String? environment,
    _i526.EnvironmentFilter? environmentFilter,
  }) {
    final gh = _i526.GetItHelper(
      this,
      environment,
      environmentFilter,
    );
    gh.factory<_i928.LanguageCubit>(() => _i928.LanguageCubit());
    gh.factory<_i585.QuizzesDataSource>(() => _i585.QuizzesDataSource());
    gh.factory<_i319.VardiDashboardCubit>(() => _i319.VardiDashboardCubit());
    gh.factory<_i421.HomeRepository>(() => _i421.HomeRepository());
    gh.factory<_i672.VardiHomeCubit>(
        () => _i672.VardiHomeCubit(gh<_i421.HomeRepository>()));
    gh.factory<_i707.QuizzesRepository>(
        () => _i707.QuizzesRepository(gh<_i585.QuizzesDataSource>()));
    gh.factory<_i932.QuizzesCubit>(
        () => _i932.QuizzesCubit(gh<_i707.QuizzesRepository>()));
    return this;
  }
}
