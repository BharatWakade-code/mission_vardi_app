import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:edusaas/utils/common_widgets/common_app_bar.dart';
import 'package:edusaas/utils/constants.dart';

class ImagePreviewWidget extends StatelessWidget {
  final String? imageUrl;
  const ImagePreviewWidget({super.key, this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Constants.bgColour,
      appBar: CustomAppBar(
        title: Text(
          'image_view'.tr(),
          style: commonTextStyle.copyWith(
            fontSize: 17,
            color: Constants.whiteColour,
            fontWeight: FontWeight.w600,
          ),
        ),
        leading: GestureDetector(
          onTap: () {
            if (context.canPop()) {
              context.pop();
            }
          },
          child: Icon(
            Icons.arrow_circle_left_outlined,
            color: Constants.whiteColour,
            size: 25,
          ),
        ),
        backgroundColor: Constants.secondBlueColour,
        actions: [],
      ),
      body: Center(
        child: Hero(
          tag: imageUrl.toString(),
          child: imageUrl != null && imageUrl!.isNotEmpty
              ? Image.network(
                  imageUrl!,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => Image.asset(
                    'assets/images/error_vine_bottle.png',
                    height: 60,
                    width: 60,
                  ),
                )
              : Image.asset(
                  'assets/images/error_vine_bottle.png',
                  height: 60,
                  width: 60,
                ),
        ),
      ),
    );
  }
}
