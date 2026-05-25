import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';

class ImagePreviewWidget extends StatelessWidget {
  final String? imageUrl;
  const ImagePreviewWidget({super.key, this.imageUrl});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Constants.bgColour,
      appBar: CustomAppBar(
        title: Text(
          'Image View',
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
          child: (imageUrl != null && imageUrl!.trim().isNotEmpty && imageUrl!.startsWith('http'))
              ? Image.network(
                  imageUrl!,
                  fit: BoxFit.contain,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.broken_image_rounded,
                    size: 60,
                    color: Colors.grey,
                  ),
                )
              : const Icon(
                  Icons.broken_image_rounded,
                  size: 60,
                  color: Colors.grey,
                ),
        ),
      ),
    );
  }
}
