import 'dart:async';
import 'dart:convert';
import 'package:hive/hive.dart';

class CommonHiveData {
  static const String _boxName = 'common_box';
  static Box? _boxInstance;

  static Future<Box> get _instance async =>
      _boxInstance ??= await Hive.openBox(_boxName);

  static Future<void> init() async {
    _boxInstance ??= await Hive.openBox(_boxName);
  }

  // ================= GET =================

  static String getString(String key, [String defValue = ""]) {
    if (_boxInstance == null) return defValue;
    return _boxInstance!.get(key, defaultValue: defValue) as String;
  }

  static bool getBool(String key) {
    return _boxInstance?.get(key, defaultValue: false) as bool;
  }

  // ================= SET =================

  static Future<void> setString(String key, String value) async {
    final box = await _instance;
    await box.put(key, value);
  }

  static Future<void> setBool(String key, bool value) async {
    final box = await _instance;
    await box.put(key, value);
  }

  static Future<void> setObject(String key, Map<String, dynamic> value) async {
    final box = await _instance;
    await box.put(key, jsonEncode(value));
  }

  static Map<String, dynamic>? getObject(String key) {
    final jsonString = _boxInstance?.get(key);
    if (jsonString == null) return null;
    return jsonDecode(jsonString);
  }

  // ================= REMOVE =================

  static Future<bool> remove(String key) async {
    final box = await _instance;
    await box.delete(key);
    return true;
  }

  static Future<void> clearAll() async {
    final box = await _instance;
    await box.clear();
  }
}
