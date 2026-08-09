import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edusaas/screens/localization_module/locale_cubit.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:edusaas/utils/network_services/check_internet_services.dart';
import 'package:edusaas/screens/localization_module/change_language_bottom_sheet.dart';

import 'package:edusaas/utils/constants.dart';
// ─── Design tokens (navy blue theme) ─────────────────────────────────────────
const _navyDark = Color(0xFF0B1437);
const _navyMid = Color(0xFF1A3572);
const _navyLight = Color(0xFF1E40AF);

class CustomAppBar extends StatelessWidget implements PreferredSizeWidget {
  final Widget? title;
  final String? titleText;
  final IconData? titleIcon;
  final List<Widget>? actions;
  final Widget? leading;
  final PreferredSizeWidget? bottom;
  final ShapeBorder? shape;
  // Legacy fields kept for API compatibility
  final Gradient? gradient;
  final Color? backgroundColor;
  final bool? showBackButton;

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
    this.showBackButton,
  });

  @override
  Size get preferredSize => Size.fromHeight(
        bottom == null
            ? kToolbarHeight
            : kToolbarHeight + bottom!.preferredSize.height,
      );

  @override
  Widget build(BuildContext context) {
    final canPop = showBackButton ?? Navigator.of(context).canPop();

    Widget appBarTitle = title ?? const SizedBox.shrink();
    if (titleText != null) {
      appBarTitle = ValueListenableBuilder<bool>(
        valueListenable: CheckInternetService.connectionStatusNotifier,
        builder: (context, isOffline, child) {
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                titleText!,
                overflow: TextOverflow.ellipsis,
                maxLines: 1,
                style: commonTextStyle.copyWith(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                  letterSpacing: -0.3,
                ),
              ),
              if (isOffline)
                Text(
                  'offline_mode'.tr(),
                  style: commonTextStyle.copyWith(
                    fontSize: 10,
                    color: Colors.amber.shade300,
                    fontWeight: FontWeight.w600,
                  ),
                ),
            ],
          );
        },
      );
    }

    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      scrolledUnderElevation: 0,
      surfaceTintColor: Colors.transparent,
      centerTitle: false,
      titleSpacing: canPop ? 0 : 16,
      bottom: bottom,
      shape: shape,
      // Navy gradient background — same across all screens
      flexibleSpace: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [_navyDark, _navyMid, _navyLight],
            begin: Alignment.centerLeft,
            end: Alignment.centerRight,
          ),
        ),
      ),

      // Back button — frosted white pill
      leading: leading ??
          (canPop
              ? IconButton(
                  icon: Container(
                    width: 34,
                    height: 34,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(
                          color: Colors.white.withValues(alpha: 0.2)),
                    ),
                    child: const Icon(
                      Icons.arrow_back_ios_new_rounded,
                      color: Colors.white,
                      size: 16,
                    ),
                  ),
                  onPressed: () => Navigator.of(context).pop(),
                )
              : null),

      title: titleText != null
          ? Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (titleIcon != null) ...[
                  Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(9),
                      border: Border.all(
                          color: Colors.white.withValues(alpha: 0.2)),
                    ),
                    child: Icon(titleIcon, color: Colors.amber, size: 16),
                  ),
                  const SizedBox(width: 10),
                ],
                Flexible(child: appBarTitle),
              ],
            )
          : appBarTitle,

      actions: [
        GestureDetector(
          onTap: () => ChangeLanguageBottomSheet.show(context),
          child: Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.white.withValues(alpha: 0.15),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.language_rounded, color: Colors.white, size: 16),
                const SizedBox(width: 4),
                Text(
                  context.watch<LocaleCubit>().state.languageCode == 'mr' ? 'मराठी' : 'English',
                  style: commonTextStyle.copyWith(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ),
        ...(actions ?? []),
      ],

      iconTheme: const IconThemeData(color: Colors.white),
    );
  }
}
