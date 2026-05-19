import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

final TextStyle commonTextStyle = GoogleFonts.philosopher(
  color: Colors.black,
  fontSize: 14,
  fontWeight: FontWeight.w400,
);

class Constants {
  //Api Constants
  /// static String baseurl ="https://petrolynks.com/v1";
   static String aiBaseurl ="https://p4ry83y2u0.execute-api.us-east-1.amazonaws.com/";



   static String login ="/api/v1/app/login";
   static String getDashboardData ="/api/v1/store/dashboard";
   static String getLiveSalesData ="/api/v1/live-sales";
   static String getStoreList ="/api/v1/store/list";
   static String petroView ="/api/v1/crop-petroview-dashboard";
   static String storeReports ="/api/v1/petroview-report";


   //Colour Constants
   static Color blackColour = Colors.black;
   static Color greyColour = Colors.grey;
   static Color whiteColour = Colors.white;
   static const Color primaryGreenColour = Color(0xFF0D47A1); // Deep Police Blue (Mapped for legacy references)
   static const Color secondaryGreenColour = Color(0xFF1976D2); // Steel Blue (Mapped for legacy references)
   static Color scaffoldBackgroundColour = Color(0xFFF4F6FA);

   static const Color primaryBlueColour = Color(0xFF0D47A1); // Primary Blue
   static const Color secondaryBlueColour = Color(0xFF1E88E5); // Secondary Blue
   static const Color accentBlueColour = Color(0xFF82B1FF); // Accent Blue

   static const Color secondBlueColour = Color(0xFF0D47A1);
   static const Color thirdBlueColour = Color(0xFF1565C0);
   static const Color blackDarkColour = Color(0xFF212121);
   static const Color greenColour = Color(0xFF4CAF50);
   static const Color bgColour = Color(0xFFF4F6FA);
   static const Color redColour = Colors.red;
   static const Color yellowColour = Colors.amber;

   static const farmerGradient = [
     Constants.primaryBlueColour,
     Constants.secondaryBlueColour,
   ];

   static String s3ImageBaseUrl ="https://xbox456.s3.ap-south-1.amazonaws.com/";


}

class ApiUrls {
   static String login ="/api/mobile/auth/send-otp";
   static String verifyOtp ="/api/mobile/auth/verify-otp";
   static String providerRegister ="/api/mobile/auth/register";
   static String getServiceCategories ="/api/mobile/categories/services";

   ///Profile
   static String getProfileByID ="/api/mobile/users/id";
   static String updateSetAvailability ="/api/mobile/users/availability";
   static String updateProfile ="/api/mobile/users/profile";
   static String updateProfileImage ="/api/mobile/users/profile-image";

   ///Address
   static String getAllAddress ="/api/mobile/users/addresses";
   static String updateAddress ="/api/mobile/users/update/addresses";
   static String deleteAddress ="/api/mobile/users/delete/addresses";
   static String setDefaultAddress ="/api/mobile/users/default/addresses";
   static String addAddress ="/api/mobile/users/addresses";

   ///Global
   static String getAllCropList ="/api/mobile/users/crop";
   static String getAllRateLimitList ="/api/mobile/users/rate-type";
   static String updateRateBasis ="/api/mobile/users/rates";
   static String deleteRateBasis ="/api/mobile/users/delete/rate";


   static String updateKyc ="/api/mobile/users/kyc-document";
   static String deleteDocument ="/api/mobile/users/delete/kyc-document";

}

class AppUtils {
  static String getFormattedCurrency(
      BuildContext context,
      double value, {
        bool noDecimals = true,
      }) {
    final germanFormat = NumberFormat.currency(
      symbol: '€',
      decimalDigits: noDecimals && value % 1 == 0 ? 0 : 2,
    );
    return germanFormat.format(value);
  }
}