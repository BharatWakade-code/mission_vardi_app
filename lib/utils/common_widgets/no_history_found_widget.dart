import 'package:flutter/material.dart';
import 'package:edusaas/utils/constants.dart';

class NoHistoryFoundWidget extends StatelessWidget {
  final String? title ;
  final String? subTitle ;
  final IconData? icon;
  const NoHistoryFoundWidget({super.key,this.title,this.subTitle,this.icon});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          spacing: 10,
          children: [
            // Icon
            Container(
              height: 96,
              width: 96,
              decoration: BoxDecoration(
                color: Constants.primaryGreenColour
                    .withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(
                icon ?? Icons.history,
                size: 48,
                color: Constants.primaryGreenColour,
              ),
            ),


            Text(
              title ?? 'No History Found',
              style: commonTextStyle.copyWith(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Constants.blackColour,
              ),
            ),


            Text(
              subTitle ??  'Your completed services and orders\nwill appear here.',
              textAlign: TextAlign.center,
              style: commonTextStyle.copyWith(
                fontSize: 14,
                color: Constants.greyColour,
                height: 1.4,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
