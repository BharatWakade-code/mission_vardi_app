import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:hive_flutter/hive_flutter.dart';

class LocaleCubit extends Cubit<Locale> {
  LocaleCubit() : super(const Locale('en')) {
    _loadLocale();
  }

  static const _boxName = 'settingsBox';
  static const _localeKey = 'languageCode';

  Future<void> _loadLocale() async {
    try {
      final box = await Hive.openBox(_boxName);
      final langCode = box.get(_localeKey, defaultValue: 'en');
      emit(Locale(langCode));
    } catch (_) {
      emit(const Locale('en'));
    }
  }

  Future<void> setLocale(String languageCode) async {
    try {
      final box = await Hive.openBox(_boxName);
      await box.put(_localeKey, languageCode);
      emit(Locale(languageCode));
    } catch (_) {
      emit(Locale(languageCode));
    }
  }
}
