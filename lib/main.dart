import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:hive_flutter/adapters.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/utils/ad_services/ad_manager.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/depenedency_injection/get_it_setup.dart';
import 'package:mission_vardi/utils/network_services/check_internet_services.dart';
import 'package:mission_vardi/utils/providers_list.dart';
import 'package:mission_vardi/utils/request_permission.dart';
import 'package:mission_vardi/utils/routes_services/go_router_service.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';
import 'package:flutter_gen/gen_l10n/app_localizations.dart';
import 'package:loader_overlay/loader_overlay.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize AdMob Ads
  await AdManager.instance.initialize();

  configureDependencies();

  await Hive.initFlutter();
  await CommonHiveData.init();

  // try {
  //   await dotenv.load(fileName: ".env");
  // } catch (e) {
  //   throw Exception('Error loading .env file: $e');
  // }

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

    requestCameraAndLocationPermission();
    CheckInternetService.startListening();

    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LanguageCubit>().loadSavedLanguage();
    });
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<LanguageCubit, LanguageState>(
      builder: (context, state) {
        return MaterialApp.router(
          locale: state.locale,
          routerConfig: router,
          debugShowCheckedModeBanner: false,
          title: 'MissionVardi',
          scrollBehavior: MyCustomScrollBehavior(),
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          supportedLocales: const [
            Locale('en'),
            Locale('mr'),
          ],
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