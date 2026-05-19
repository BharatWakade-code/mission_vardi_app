import 'package:flutter/services.dart';

class NoEmojiFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {

    final emojiRegex = RegExp(
      r'[\u{1F600}-\u{1F64F}'
      r'\u{1F300}-\u{1F5FF}'
      r'\u{1F680}-\u{1F6FF}'
      r'\u{1F700}-\u{1F77F}'
      r'\u{1F780}-\u{1F7FF}'
      r'\u{1F800}-\u{1F8FF}'
      r'\u{1F900}-\u{1F9FF}'
      r'\u{1FA70}-\u{1FAFF}'
      r'\u{2600}-\u{26FF}'
      r'\u{2700}-\u{27BF}]',
      unicode: true,
    );

    if (emojiRegex.hasMatch(newValue.text)) {
      return oldValue;
    }

    return newValue;
  }
}

class NoSpecialCharactersFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
      TextEditingValue oldValue, TextEditingValue newValue) {

    // Block characters: space, dot, comma, dash
    final blockRegex = RegExp(r'[ \.,-]');

    if (blockRegex.hasMatch(newValue.text)) {
      return oldValue;
    }

    return newValue;
  }
}