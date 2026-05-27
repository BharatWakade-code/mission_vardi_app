import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

@immutable
class LanguageState {
  final Locale locale;
  final bool isTablet;

  const LanguageState({
    required this.locale,
    this.isTablet = false,
  });

  LanguageState copyWith({
    Locale? locale,
    bool? isTablet,
  }) {
    return LanguageState(
      locale: locale ?? this.locale,
      isTablet: isTablet ?? this.isTablet,
    );
  }
}

@injectable
class LanguageCubit extends Cubit<LanguageState> {
  LanguageCubit()
      : super(const LanguageState(locale: Locale('en')));

  void loadSavedLanguage() {
    final code = CommonHiveData.getString('language_code');

    Locale locale;

    if (code == null || code.isEmpty) {
      locale = const Locale('en');
    } else if (code.contains('_')) {
      final parts = code.split('_');
      locale = Locale(parts[0], parts[1]);
    } else {
      locale = Locale(code);
    }

    emit(state.copyWith(locale: locale));
  }

  Future<void> changeLanguage(String code) async {
    if (code != 'en' && code != 'mr') return;

    await CommonHiveData.setString('language_code', code);

    emit(state.copyWith(locale: Locale(code)));
  }

  void updateDeviceType(BuildContext context) {
    final shortestSide = MediaQuery.of(context).size.shortestSide;

    emit(state.copyWith(
      isTablet: shortestSide >= 600,
    ));
  }

  /// Use 'key'.tr() directly in widgets for translations.
  /// EasyLocalization handles locale-aware string resolution automatically.
}


