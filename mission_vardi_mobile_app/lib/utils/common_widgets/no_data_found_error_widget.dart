import 'package:flutter/material.dart';
import 'package:mission_vardi/utils/constants.dart';

class NoDataFoundErrorWidget extends StatelessWidget {
  final String? errMSg;
  const NoDataFoundErrorWidget({super.key , this.errMSg});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              'assets/images/no_data_error.png',
              height: 150,
              width: 150,
              fit: BoxFit.cover,
            ),
            SizedBox(height: 15),
            Text(
              errMSg ?? 'No Data Found',
              style: commonTextStyle.copyWith(
                fontSize: 14,
                color: Constants.blackDarkColour,
                fontWeight: FontWeight.w600,
              ),
              overflow: TextOverflow.ellipsis,
            )
          ],
        ),
      ),
    );
  }
}
