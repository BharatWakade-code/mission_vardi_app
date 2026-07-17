import 'dart:ui';
import 'package:firebase_core/firebase_core.dart';
import 'package:upgrader/upgrader.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:mission_vardi/utils/ad_services/ad_manager.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/depenedency_injection/get_it_setup.dart';
import 'package:mission_vardi/utils/network_services/check_internet_services.dart';
import 'package:mission_vardi/utils/providers_list.dart';
import 'package:mission_vardi/utils/routes_services/go_router_service.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';
import 'firebase_options.dart';
import 'package:mission_vardi/utils/push_notifications.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:mission_vardi/screens/localization_module/locale_cubit.dart';
import 'package:flutter_native_splash/flutter_native_splash.dart';

Future<void> main() async {
  WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);

  try {
    if (Firebase.apps.isEmpty) {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    }
  } on FirebaseException catch (e) {
    if (e.code != 'duplicate-app') {
      rethrow;
    }
  } catch (e) {
    debugPrint('Firebase initialization error: $e');
  }

  // .env must be loaded FIRST before dependency injection
  // so ApiClient gets BASE_URL when it is constructed by GetIt
  try {
    await dotenv.load(fileName: ".env");
  } catch (e) {
    debugPrint('Error loading .env file: $e');
  }

  if (!kIsWeb) {
    try {
      // Do not await AdManager initialization as it can block the UI for up to 1 min waiting for network
      AdManager.instance.initialize().catchError((e) {
        debugPrint('AdManager init error: $e');
      });
    } catch (e) {
      debugPrint('AdManager init error: $e');
    }
  }

  try {
    configureDependencies();
  } catch (e) {
    debugPrint('Dependency injection error: $e');
  }

  try {
    await Hive.initFlutter();
    await CommonHiveData.init();
  } catch (e) {
    debugPrint('Hive init error: $e');
  }

  // Initialize push notifications (FCM + local)
  // Do not await this as it makes network requests (getToken, subscribeToTopic) that can block the UI
  try {
    PushNotificationService.instance.initialize().catchError((e) {
      debugPrint('Push notifications init error: $e');
    });
  } catch (e) {
    debugPrint('Push notifications init error: $e');
  }

  runApp(
    MultiBlocProvider(
      providers: providerList(),
      child: const MyApp(),
    ),
  );

  // Remove the native splash screen after the app is initialized
  FlutterNativeSplash.remove();
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
    CheckInternetService.startListening();
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LocaleCubit, Locale>(
      builder: (context, locale) {
        return MaterialApp.router(
          routerConfig: router,
          builder: (context, child) => UpgradeAlert(
            upgrader: Upgrader(
              durationUntilAlertAgain: const Duration(hours: 3),
            ),
            child: child ?? const SizedBox.shrink(),
          ),
          debugShowCheckedModeBanner: false,
          title: 'missionvardi'.tr(),
          scrollBehavior: MyCustomScrollBehavior(),
          locale: locale,
          supportedLocales: const [
            Locale('en', ''),
            Locale('mr', ''),
          ],
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          theme: ThemeData(
            primarySwatch: Colors.blue,
            canvasColor: Colors.white,
            scaffoldBackgroundColor: Constants.scaffoldBackgroundColour,
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
