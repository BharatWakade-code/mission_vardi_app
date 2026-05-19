import 'package:flutter/material.dart';
import 'package:mission_vardi/utils/common_widgets/common_button.dart';
import 'package:mission_vardi/utils/constants.dart';

class BasicServiceApprovalDialog extends StatelessWidget {
  const BasicServiceApprovalDialog({super.key});

  @override
  Widget build(BuildContext context) {
    return Dialog(
      backgroundColor: Constants.scaffoldBackgroundColour,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
      ),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            /// 🔔 Header (Service Received)
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Constants.greenColour.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(
                    Icons.check_circle_outline_rounded,
                    color: Constants.greenColour,
                    size: 22,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Service Request Received',
                    style: commonTextStyle.copyWith(
                      color: Constants.blackDarkColour,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            /// Details Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                children: [
                  _basicRow(
                    icon: Icons.person_outline_rounded,
                    value: 'Ramesh Kumar',
                  ),
                  _basicRow(
                    icon: Icons.call_outlined,
                    value: '+91 98765 43210',
                  ),
                  _basicRow(
                    icon: Icons.location_on_outlined,
                    value: '36 , Omkar Nagar , Nagpur',
                  ),
                  ListTile(
                    contentPadding: EdgeInsets.all(0),
                    leading: Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Constants.greenColour.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.agriculture_outlined,
                        color: Constants.greenColour,
                        size: 30,
                      ),
                    ),
                    title: Text(
                      'Equipment',
                      style: commonTextStyle.copyWith(
                        color: Constants.blackDarkColour,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    subtitle: Text(
                      'Tractor · Tractor with Rotavator',
                      style: commonTextStyle.copyWith(
                        color: Constants.blackDarkColour.withOpacity(0.7),
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    onTap: () {
                    },
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  )
                ],
              ),
            ),

            const SizedBox(height: 16),

            /// Amount Highlight
            Container(
              padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
              decoration: BoxDecoration(
                color: Constants.greenColour.withOpacity(0.08),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Service Amount',
                    style: commonTextStyle.copyWith(
                      fontSize: 13,
                      color: Constants.blackDarkColour.withOpacity(0.7),
                    ),
                  ),
                  Text(
                    '₹1,200',
                    style: commonTextStyle.copyWith(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Constants.greenColour,
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            /// Actions
            Row(
              children: [
                Expanded(
                  child: CommonButton(
                    title: 'Deny',
                    color: Constants.whiteColour,
                    border: Border.all(color: Constants.redColour),
                    style: commonTextStyle.copyWith(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Constants.redColour,
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    width: double.infinity,
                    onTap: () {},
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: CommonButton(
                    title: 'Approve',
                    color: Constants.greenColour,
                    style: commonTextStyle.copyWith(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Constants.whiteColour,
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    width: double.infinity,
                    onTap: () {},
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _basicRow({
    required IconData icon,
    required String value,
  }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, size: 18, color: Colors.black45),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              value,
              style: commonTextStyle.copyWith(
                color: Constants.blackDarkColour,
                fontSize: 14,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }
}
