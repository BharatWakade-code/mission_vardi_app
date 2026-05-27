import 'dart:ui';
import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:mission_vardi/localization/http_asset_loader.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/utils/ad_services/ad_manager.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/depenedency_injection/get_it_setup.dart';
import 'package:mission_vardi/utils/network_services/check_internet_services.dart';
import 'package:mission_vardi/utils/providers_list.dart';
import 'package:mission_vardi/utils/request_permission.dart';
import 'package:mission_vardi/utils/routes_services/go_router_service.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';
import 'firebase_options.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
        options: DefaultFirebaseOptions.currentPlatform);
  } catch (e) {
    debugPrint('Firebase init error (web may need firebase_options.dart): $e');
  }

  if (!kIsWeb) {
    await AdManager.instance.initialize();
  }
  // EasyLocalization must be initialized before runApp
  await EasyLocalization.ensureInitialized();

  configureDependencies();

  await Hive.initFlutter();
  await CommonHiveData.init();

  // .env file — not supported on web filesystem
  if (!kIsWeb) {
    try {
      await dotenv.load(fileName: ".env");
    } catch (e) {
      debugPrint('Error loading .env file: $e');
    }
  }

  // One-time translation cache bust — bump the version string whenever new
  // translation keys are added to the bundled assets, to force a fresh merge.
  const trCacheVersion = 'tr_cache_v2';
  final versionBox = await Hive.openBox<String>('app_meta');
  if (versionBox.get('tr_cache_version') != trCacheVersion) {
    await HttpAssetLoader.clearCache();
    await versionBox.put('tr_cache_version', trCacheVersion);
    debugPrint('[Translations] Cache cleared — new version: $trCacheVersion');
  }

  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('en'), Locale('mr')],
      path: 'assets/translations',
      fallbackLocale: const Locale('en'),
      startLocale: const Locale('en'),
      assetLoader: const HttpAssetLoader(
        'https://ddndzzl303.execute-api.ap-south-1.amazonaws.com/',
      ),
      child: MultiBlocProvider(
        providers: providerList(),
        child: const MyApp(),
      ),
    ),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  @override
  void initState() {
    super.initState();

    // requestCameraAndLocationPermission();
    CheckInternetService.startListening();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      final code = CommonHiveData.getString('language_code') ?? 'en';
      context.setLocale(Locale(code));
      context.read<LanguageCubit>().loadSavedLanguage();
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LanguageCubit, LanguageState>(
      builder: (context, state) {
        return MaterialApp.router(
          locale: context.locale,
          routerConfig: router,
          debugShowCheckedModeBanner: false,
          title: 'MissionVardi',
          scrollBehavior: MyCustomScrollBehavior(),
          localizationsDelegates: context.localizationDelegates,
          supportedLocales: context.supportedLocales,
          theme: ThemeData(
            primarySwatch: Colors.blue,
            canvasColor: Colors.white,
          ),
        );
      },
    );
  }
}

class MyCustomScrollBehavior extends MaterialScrollBehavior {
  @override
  Set<PointerDeviceKind> get dragDevices => {
        PointerDeviceKind.touch,
        PointerDeviceKind.mouse,
        PointerDeviceKind.trackpad,
      };
}
