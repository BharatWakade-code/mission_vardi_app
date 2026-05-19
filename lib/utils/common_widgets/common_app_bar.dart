import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/network_services/check_internet_services.dart';

class CustomAppBar extends StatefulWidget implements PreferredSizeWidget {
  final Widget? title;
  final String? titleText;
  final IconData? titleIcon;
  final List<Widget>? actions;
  final Widget? leading;
  final PreferredSizeWidget? bottom;
  final ShapeBorder? shape;
  final Gradient? gradient;
  final Color? backgroundColor;

  const CustomAppBar({
    super.key,
    this.title,
    this.titleText,
    this.titleIcon,
    this.actions,
    this.leading,
    this.bottom,
    this.shape,
    this.gradient,
    this.backgroundColor,
  });

  @override
  State<CustomAppBar> createState() => _CustomAppBarState();

  @override
  Size get preferredSize => Size.fromHeight(
        bottom == null ? kToolbarHeight : kToolbarHeight + bottom!.preferredSize.height);
}

class _CustomAppBarState extends State<CustomAppBar> {
  bool isDarkMode = false;
  bool isOfflineMode = false;
  bool isLowDataMode = false;

  @override
  Widget build(BuildContext context) {
    final isMarathi = context.watch<LanguageCubit>().state.locale.languageCode == 'mr';

    // Build the dynamic unified title if titleText is provided
    Widget? appBarTitle = widget.title;
    if (widget.titleText != null) {
      appBarTitle = ValueListenableBuilder<bool>(
        valueListenable: CheckInternetService.connectionStatusNotifier,
        builder: (context, isOffline, child) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(widget.titleIcon ?? Icons.shield, color: Colors.amber, size: 20),
                  const SizedBox(width: 6),
                  Text(
                    widget.titleText!,
                    style: commonTextStyle.copyWith(
                      fontSize: 16,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                  if (isOffline) ...[
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: Colors.red.shade600,
                        borderRadius: BorderRadius.circular(10),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.red.withOpacity(0.4),
                            blurRadius: 4,
                            offset: const Offset(0, 1),
                          ),
                        ],
                      ),
                      child: Text(
                        isMarathi ? "ऑफलाइन" : "Offline",
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 8,
                          fontWeight: FontWeight.bold,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
              const SizedBox(height: 2),
              Text(
                isOffline
                    ? (isMarathi ? "ऑफलाइन मोड सक्रिय ⚠️" : "Offline Mode Active ⚠️")
                    : (isMarathi ? "वर्दी हेच स्वप्न!" : "Focus, Train, Conquer!"),
                style: commonTextStyle.copyWith(
                  fontSize: 10,
                  color: isOffline ? Colors.red.shade300 : Colors.white70,
                  fontWeight: isOffline ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ],
          );
        },
      );
    }

    // Build default unified actions if none are specified
    List<Widget>? appBarActions = widget.actions;
    if (appBarActions == null) {
      appBarActions = [
        IconButton(
          icon: Icon(isDarkMode ? Icons.light_mode : Icons.dark_mode, color: Colors.white, size: 20),
          tooltip: "Dark/Light Mode",
          onPressed: () {
            setState(() {
              isDarkMode = !isDarkMode;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  isDarkMode
                      ? (isMarathi ? "डार्क मोड सक्रिय केला!" : "Dark Mode Enabled!")
                      : (isMarathi ? "लाईट मोड सक्रिय केला!" : "Light Mode Enabled!"),
                ),
                duration: const Duration(seconds: 1),
              ),
            );
          },
        ),
        IconButton(
          icon: Icon(isOfflineMode ? Icons.wifi_off : Icons.wifi, color: Colors.white, size: 20),
          tooltip: "Offline Mode Toggle",
          onPressed: () {
            setState(() {
              isOfflineMode = !isOfflineMode;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  isOfflineMode
                      ? (isMarathi ? "ऑफलाइन मोड सुरू! साठवलेला डेटा दाखवत आहे." : "Offline Mode Active! Showing cached data.")
                      : (isMarathi ? "ऑनलाइन मोड पुनर्संचयित!" : "Online Mode Restored!"),
                ),
                duration: const Duration(seconds: 1),
              ),
            );
          },
        ),
        IconButton(
          icon: Icon(isLowDataMode ? Icons.data_usage_rounded : Icons.data_saver_off_rounded, color: Colors.white, size: 20),
          tooltip: "Low Data Mode Toggle",
          onPressed: () {
            setState(() {
              isLowDataMode = !isLowDataMode;
            });
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                  isLowDataMode
                      ? (isMarathi ? "लो डेटा मोड सक्रिय!" : "Low Data Mode Active!")
                      : (isMarathi ? "लो डेटा मोड बंद!" : "Low Data Mode Disabled!"),
                ),
                duration: const Duration(seconds: 1),
              ),
            );
          },
        ),
        TextButton(
          onPressed: () {
            final targetLang = isMarathi ? 'en' : 'mr';
            context.read<LanguageCubit>().changeLanguage(targetLang);
          },
          child: Text(
            isMarathi ? "English" : "मराठी",
            style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12),
          ),
        ),
      ];
    }

    return AppBar(
      title: appBarTitle,
      leading: widget.leading,
      iconTheme: IconThemeData(color: Colors.white),
      backgroundColor: widget.gradient == null ? (widget.backgroundColor ?? Constants.primaryBlueColour) : Colors.transparent,
      elevation: 0,
      actions: [
        ...appBarActions,
        const SizedBox(width: 5),
      ],
      centerTitle: false,
      bottom: widget.bottom,
      surfaceTintColor: Colors.transparent,
      shape: widget.shape,
      flexibleSpace: widget.gradient != null
          ? ClipRRect(
              borderRadius: widget.shape is RoundedRectangleBorder
                  ? (widget.shape as RoundedRectangleBorder).borderRadius
                  : BorderRadius.zero,
              child: Container(
                decoration: BoxDecoration(
                  gradient: widget.gradient,
                ),
              ),
            )
          : null,
    );
  }
}
