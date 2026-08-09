import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:edusaas/utils/common_widgets/common_button.dart';
import 'package:edusaas/utils/constants.dart';

class CommonConfirmDialog extends StatelessWidget {
  final String title;
  final String? subtitle;
  final String cancelText;
  final String okText;
  final VoidCallback? onCancel;
  final VoidCallback? onOk;

  const CommonConfirmDialog({
    super.key,
    required this.title,
    this.subtitle,
    this.cancelText = 'cancel',
    this.okText = 'OK',
    this.onCancel,
    this.onOk,
  });

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Constants.whiteColour,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            /// Title
            Text(
              title,
              style: commonTextStyle.copyWith(
                fontSize: 18,
                fontWeight: FontWeight.w600,
                color: Constants.blackDarkColour,
              ),
              textAlign: TextAlign.center,
            ),

            /// Subtitle
            if (subtitle != null) ...[
              const SizedBox(height: 10),
              Text(
                subtitle!,
                style: commonTextStyle.copyWith(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: Constants.blackDarkColour,
                ),
                textAlign: TextAlign.center,
              ),
            ],

            const SizedBox(height: 20),

            /// Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              spacing: 10,
              children: [
                CommonButton(
                  padding: const EdgeInsets.all(5),
                  margin: const EdgeInsets.symmetric(vertical: 10),
                  width: 100,
                  isGrey: true,
                  onTap: onCancel ??
                      () {
                        context.pop();
                      },
                  style: commonTextStyle.copyWith(
                    color: Constants.whiteColour,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                  title: cancelText,
                  color: Constants.greyColour,
                ),
                CommonButton(
                  padding: const EdgeInsets.all(5),
                  margin: const EdgeInsets.symmetric(vertical: 10),
                  width: 100,
                  onTap: onOk,
                  style: commonTextStyle.copyWith(
                    color: Constants.whiteColour,
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                  title: okText,
                  color: Constants.primaryGreenColour,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
