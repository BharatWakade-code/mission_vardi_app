import 'package:flutter/material.dart';
import 'package:mission_vardi/utils/constants.dart';

class KeyValuePairWithText extends StatelessWidget {
  final String label1;
  final String label2;

  final Widget child1;
  final Widget child2;

  const KeyValuePairWithText({
    super.key,
    required this.label1,
    required this.label2,
    required this.child1,
    required this.child2,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildField(label: label1,child: child1),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: _buildField(label: label2, child: child2),
        ),
      ],
    );
  }

  Widget _buildField({
    required String label,
    required Widget child,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: commonTextStyle.copyWith(
            fontSize: 14,
            color: Constants.blackColour,
            fontWeight: FontWeight.w300,
          ),
        ),
        const SizedBox(height: 5),
        child,
      ],
    );
  }
}
