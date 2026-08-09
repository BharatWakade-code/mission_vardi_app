import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:edusaas/utils/constants.dart';
import 'package:edusaas/utils/network_services/check_internet_services.dart';

class CommonButton extends StatelessWidget {
  final String? title;
  final TextStyle? style;
  final double? width;
  final void Function()? onTap;
  final Color? color;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BoxBorder? border;
  final bool isGrey;

  const CommonButton({
    super.key,
    this.title,
    this.onTap,
    this.color,
    this.padding,
    this.margin,
    this.border,
    this.style,
    this.width,
    this.isGrey = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () async {
        final hasInternet = await CheckInternetService.hasInternet();
        if (!hasInternet) {
          return;
        }

        onTap?.call();
      },
      child: Container(
        padding: padding ?? const EdgeInsets.symmetric(vertical: 14),
        width: width ?? double.infinity,
        margin: margin,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(14),
          border: border,
          color: isGrey ? const Color(0xFFE5E7EB) : null,
          gradient: isGrey
              ? null
              : const LinearGradient(
                  colors: [Color(0xFF0B1437), Color(0xFF1A3572), Color(0xFF2563EB)],
                  begin: Alignment.centerLeft,
                  end: Alignment.centerRight,
                ),
        ),
        child: Text(
          title ?? 'Confirm',
          style: style ??
              commonTextStyle.copyWith(
                fontSize: 15,
                color: isGrey ? const Color(0xFF6B7280) : Colors.white,
                fontWeight: FontWeight.w600,
                letterSpacing: 0.1,
              ),
          textAlign: TextAlign.center,
        ),
      ),
    );
  }
}

class GradientContainer extends StatelessWidget {
  final String? title;
  final TextStyle? style;
  final double? width;
  final Color? color;
  final EdgeInsetsGeometry? padding;
  final EdgeInsetsGeometry? margin;
  final BoxBorder? border;
  final Gradient? gradient;
  final BorderRadiusGeometry? borderRadius;
  final Widget? buttonIcon;

  const GradientContainer(
      {super.key,
      this.title,
      this.color,
      this.padding,
      this.margin,
      this.border,
      this.style,
      this.width,
      this.gradient,
      this.borderRadius,
      this.buttonIcon});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: padding,
      width: width ?? double.infinity,
      margin: margin,
      decoration: BoxDecoration(
        borderRadius: borderRadius ?? BorderRadius.circular(10),
        color: color,
        border: border,
        gradient: LinearGradient(
          colors: [
            Constants.secondaryGreenColour,
            Constants.secondaryGreenColour,
            Constants.primaryGreenColour,
          ],
        ),
      ),
      child: Row(
        mainAxisAlignment: buttonIcon != null
            ? MainAxisAlignment.spaceAround
            : MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            title ?? 'Confirm',
            style: style,
            textAlign: TextAlign.center,
          ),
          Center(child: buttonIcon ?? SizedBox.shrink())
        ],
      ),
    );
  }
}

class CommonFloatingButton extends StatelessWidget {
  final String? title;
  final VoidCallback? onPressed;
  const CommonFloatingButton({super.key, this.onPressed, this.title});

  @override
  Widget build(BuildContext context) {
    return FloatingActionButton.extended(
      elevation: 6,
      backgroundColor: Constants.primaryGreenColour,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(25),
      ),
      onPressed: onPressed,
      label: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            title ?? 'next'.tr(),
            style: commonTextStyle.copyWith(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: Constants.whiteColour,
            ),
          ),
          const SizedBox(width: 6),
          const Icon(
            Icons.chevron_right_rounded,
            size: 25,
            color: Colors.white,
          ),
        ],
      ),
    );
  }
}
