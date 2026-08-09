import 'package:flutter/material.dart';
import 'package:edusaas/utils/common_widgets/common_white_container.dart';

class CommonServiceProviderWidget extends StatelessWidget {
  final Widget? child;

  const CommonServiceProviderWidget({super.key, this.child});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 15),
      child: Column(
        spacing: 10,
        mainAxisSize: MainAxisSize.max,
        children: [
          /// Fixed Logo
          Image.asset(
            'assets/images/app_logo.png',
            fit: BoxFit.fill,
            height: 80,
            width: 150,
          ),


          /// Scrollable Content
          Flexible(
            child: CommonFadeGreenContainer(
              child: SingleChildScrollView(child: child),
            ),
          ),
        ],
      ),
    );
  }
}
