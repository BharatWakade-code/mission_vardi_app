import 'dart:convert';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/services.dart';
import 'package:flutter/widgets.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;

/// OTA (Over-The-Air) asset loader for easy_localization.
///
/// Translation JSON is cached in a dedicated Hive box so the app works
/// offline after the first successful network fetch.
///
/// Priority order:
///   1. Fetch from remote backend (5-second timeout).
///      → On success, persist JSON in Hive and return it.
///   2. Serve the cached string from Hive (offline fallback).
///   3. Load the bundled asset file (assets/translations/{locale}.json).
class HttpAssetLoader extends AssetLoader {
  /// Base URL **without** a trailing slash.
  /// e.g. "https://api.krishiwings.com/translations"
  final String baseUrl;

  /// Hive box name used exclusively for translation caches.
  static const String _boxName = 'ota_translations';

  const HttpAssetLoader(this.baseUrl);

  // ── helpers ──────────────────────────────────────────────────────────────

  Future<Box<String>> _openBox() async {
    if (Hive.isBoxOpen(_boxName)) {
      return Hive.box<String>(_boxName);
    }
    return await Hive.openBox<String>(_boxName);
  }

  // ── AssetLoader override ──────────────────────────────────────────────────

  @override
  Future<Map<String, dynamic>> load(String path, Locale locale) async {
    final localeCode = locale.languageCode;
    final url = Uri.parse('$baseUrl?lang=$localeCode');
    final box = await _openBox();

    // ── Step 1: Always load bundled asset as guaranteed base ─────────────────
    // This ensures newly added local keys are ALWAYS available, even when an
    // older remote/cached version is served.
    Map<String, dynamic> baseTranslations = {};
    try {
      final assetPath = '$path/$localeCode.json';
      final assetString = await rootBundle.loadString(assetPath);
      baseTranslations = json.decode(assetString) as Map<String, dynamic>;
    } catch (_) {
      // Bundled asset missing — proceed with empty base
    }

    // ── Step 2: Try remote fetch, merge on top of base ────────────────────────
    if (baseUrl.isNotEmpty) {
      try {
        final response =
            await http.get(url).timeout(const Duration(seconds: 15));

        if (response.statusCode == 200) {
          final jsonString = utf8.decode(response.bodyBytes);
          final decoded = json.decode(jsonString) as Map<String, dynamic>;

          final Map<String, dynamic> remoteMap =
              (decoded.containsKey('data') && decoded['data'] is Map)
                  ? Map<String, dynamic>.from(decoded['data'])
                  : decoded;

          // Merge: base keys first, remote overlays on top
          final merged = {...baseTranslations, ...remoteMap};
          await box.put(localeCode, json.encode(merged));
          return merged;
        }
      } catch (_) {
        // Network error / timeout — fall through to cache
      }
    }

    // ── Step 3: Serve from Hive cache, merged with base ───────────────────────
    final cached = box.get(localeCode);
    if (cached != null && cached.isNotEmpty) {
      final cachedMap = json.decode(cached) as Map<String, dynamic>;
      // Merge: base keys first, cache overlays on top
      return {...baseTranslations, ...cachedMap};
    }

    // ── Step 4: Bundled asset only (no network, no cache) ─────────────────────
    return baseTranslations;
  }

  /// Call this to wipe the translation cache (e.g. on logout or for testing).
  static Future<void> clearCache() async {
    final box = await Hive.openBox<String>(_boxName);
    await box.clear();
  }
}
