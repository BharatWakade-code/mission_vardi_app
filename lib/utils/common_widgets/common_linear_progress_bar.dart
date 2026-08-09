import 'package:flutter/material.dart';
import 'package:edusaas/utils/constants.dart';

class CommonLinearProgressBar extends StatelessWidget {
 final double? value;
  const CommonLinearProgressBar({super.key,this.value});

  @override
  Widget build(BuildContext context) {
    return  Stack(
      children: [
        Container(
          height: 6,
          decoration: BoxDecoration(
            color: Colors.grey.shade300,
            borderRadius: BorderRadius.circular(10),
          ),
        ),

        // Progress (gradient fill)
        FractionallySizedBox(
          widthFactor: value,
          child: Container(
            height: 6,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(10),
              gradient: LinearGradient(
                colors: [
                  Constants.secondaryGreenColour,
                  Constants.secondaryGreenColour,
                  Constants.primaryGreenColour,
                ],
              ),
            ),
          ),
        ),
      ],
    );
  }
}
