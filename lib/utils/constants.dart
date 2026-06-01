import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

final TextStyle commonTextStyle = GoogleFonts.philosopher(
  color: Colors.black,
  fontSize: 14,
  fontWeight: FontWeight.w400,
);

class Constants {
 
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
   static String signIn ="/auth/login";
   static String signUp ="/auth/register";
   static String googleAuth ="/auth/google"; // Google OAuth → backend profile sync
   static String forgotPassword ="/auth/forgot-password";
   static String getQuizzesList ="/quiz";
   static String getProfile ="/user/getProfile/";
   static String updateProfile = "/user/updateProfile";
   static String getUploadUrl = "/upload/url";
   static String startStudySession ="/study/session/start";
   static String getGlobalLeaderboard = "/leaderboard/global";
   static String getHomeDashboard = "/home/dashboard";
   static String fitnessLogs = "/fitness";
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