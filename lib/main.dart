import 'dart:ui';
import 'package:firebase_core/firebase_core.dart';
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

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform);

  // .env must be loaded FIRST before dependency injection
  // so ApiClient gets BASE_URL when it is constructed by GetIt
  if (!kIsWeb) {
    try {
      await dotenv.load(fileName: ".env");
    } catch (e) {
      debugPrint('Error loading .env file: $e');
    }
  }

  if (!kIsWeb) {
    try {
      await AdManager.instance.initialize();
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
  try {
    await PushNotificationService.instance.initialize();
  } catch (e) {
    debugPrint('Push notifications init error: $e');
  }

  runApp(
    MultiBlocProvider(
      providers: providerList(),
      child: const MyApp(),
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
    CheckInternetService.startListening();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: router,
      debugShowCheckedModeBanner: false,
      title: 'MissionVardi',
      scrollBehavior: MyCustomScrollBehavior(),
      theme: ThemeData(
        primarySwatch: Colors.blue,
        canvasColor: Colors.white,
        scaffoldBackgroundColor: Constants.scaffoldBackgroundColour,
      ),
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

