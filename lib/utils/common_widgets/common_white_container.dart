import 'package:flutter/material.dart';
import 'package:mission_vardi/utils/constants.dart';

class CommonWhiteContainer extends StatelessWidget {
  final Widget? child;
  final double? width;
  final EdgeInsetsGeometry? padding;
  final BorderRadiusGeometry? borderRadius;
  final Color? borderColour;
  const CommonWhiteContainer(
      {super.key,
      this.child,
      this.width,
      this.padding,
      this.borderRadius,
      this.borderColour});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width ?? double.infinity,
      decoration: BoxDecoration(
        color: Constants.whiteColour,
        border: Border.all(color: borderColour ?? Constants.greyColour.withAlpha(60)),
        borderRadius: borderRadius ?? BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      padding: padding ?? EdgeInsets.all(20),
      child: child,
    );
  }
}

class ContainerWithGreenGradient extends StatelessWidget {
  final String? description;
  const ContainerWithGreenGradient({super.key, this.description});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(10),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            Colors.green.shade50,
            Colors.green.shade100,
            Colors.green.shade50,
          ],
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(
          color: Constants.primaryGreenColour.withOpacity(0.3),
        ),
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Icon(
            Icons.info_outline_rounded,
            color: Constants.primaryGreenColour,
            size: 22,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              description ?? 'Description not found',
              style: commonTextStyle.copyWith(
                fontSize: 12,
                color: Constants.blackDarkColour,
                height: 1.2,
                fontWeight: FontWeight.w100,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class CommonFadeGreenContainer extends StatelessWidget {
  final Widget? child;
  final EdgeInsetsGeometry? padding;
  final double? width;
  final Color? color;
  const CommonFadeGreenContainer(
      {super.key, this.child, this.padding, this.width,this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Constants.primaryGreenColour.withAlpha(20),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(
          color: Constants.primaryGreenColour.withOpacity(0.3),
        ),
      ),
      padding: padding ?? const EdgeInsets.all(15),
      child: child,
    );
  }
}
