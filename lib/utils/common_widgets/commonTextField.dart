import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:edusaas/utils/constants.dart';

class CommonTextFormField extends StatelessWidget {
  final String? hintText;
  final TextEditingController? controller;
  final FormFieldValidator<String>? validator;
  final TextInputType keyboardType;
  final bool obscureText;
  final IconData? prefixIcon;
  final IconData? suffixIcon;
  final VoidCallback? onSuffixIconPressed;
  final bool enabled;
  final bool? isGreyField;
  final int? maxLines;
  final void Function(String)? onChanged;
  final int? maxLength;
  final List<TextInputFormatter>? inputFormatters;

  /// 🔥 NEW PROPERTIES
  final Color? fillColor;
  final Color? textColor;
  final Color? hintColor;
  final InputBorder? border;
  final TextStyle? customTextStyle;
  final EdgeInsets? contentPadding;

  const CommonTextFormField({
    super.key,
    this.hintText,
    this.controller,
    this.validator,
    this.keyboardType = TextInputType.text,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.onSuffixIconPressed,
    this.enabled = true,
    this.isGreyField,
    this.maxLines = 1,
    this.onChanged,
    this.maxLength = 20,
    this.inputFormatters,

    /// 🔥 NEW
    this.fillColor,
    this.textColor,
    this.hintColor,
    this.border,
    this.customTextStyle,
    this.contentPadding,
  });

  @override
  Widget build(BuildContext context) {
    final bool useGrey = isGreyField == true;

    final defaultBorder = OutlineInputBorder(
      borderRadius: BorderRadius.circular(10),
      borderSide: useGrey
          ? BorderSide(color: Constants.blackDarkColour)
          : BorderSide(color: Constants.blackDarkColour.withAlpha(18)),
    );

    return TextFormField(
      controller: controller,
      keyboardType: keyboardType,
      obscureText: obscureText,
      enabled: enabled,
      validator: validator,
      maxLines: maxLines,
      onChanged: onChanged,
      maxLength: maxLength,
      inputFormatters: inputFormatters,
      style: customTextStyle ??
          commonTextStyle.copyWith(
            fontSize: 12,
            color: textColor ??
                (enabled
                    ? Constants.blackColour
                    : Constants.greyColour),
            fontWeight: FontWeight.w500,
          ),
      onTapOutside: (event) {
        FocusManager.instance.primaryFocus?.unfocus();
      },
      decoration: InputDecoration(
        hintText: hintText,
        filled: true,
        fillColor: fillColor ?? Colors.white,

        /// 🔥 BORDER CONTROL
        border: border ?? defaultBorder,
        enabledBorder: border ?? defaultBorder,
        focusedBorder: border ?? defaultBorder,
        disabledBorder: border ?? defaultBorder,

        contentPadding: contentPadding ??
            EdgeInsets.symmetric(
              vertical: maxLines! > 1 ? 10 : 0,
              horizontal: 12.0,
            ),

        counterText: '',

        errorStyle: commonTextStyle.copyWith(
          fontSize: 8,
          color: Constants.redColour,
          fontWeight: FontWeight.w300,
        ),

        hintStyle: commonTextStyle.copyWith(
          fontSize: 12,
          color: hintColor ?? Constants.greyColour,
          fontWeight: FontWeight.w300,
        ),

        prefixIcon: prefixIcon != null
            ? Icon(
          prefixIcon,
          color: hintColor ?? Constants.greyColour,
        )
            : null,

        suffixIcon: suffixIcon != null
            ? IconButton(
          icon: Icon(
            suffixIcon,
            color: Constants.primaryGreenColour,
          ),
          onPressed: onSuffixIconPressed,
        )
            : null,
      ),
    );
  }
}

class CommonDropDownFieldForType<T> extends StatelessWidget {
  final String? hintText;
  final TextEditingController? controller;
  final T? selectedValue;
  final void Function(T?)? onChanged;
  final List<T>? items;
  final String Function(T)? itemAsString;
  final bool isEnable;
  final String? Function(T?)? validator;
  final AutovalidateMode? autovalidateMode;
  const CommonDropDownFieldForType(
      {super.key,
      this.hintText,
      this.controller,
      this.selectedValue,
      this.onChanged,
      this.items,
      this.itemAsString,
      this.isEnable = true,
      this.validator,this.autovalidateMode});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: DropdownButtonHideUnderline(
        child: DropdownButtonFormField2<T>(
          isExpanded: true,
          autovalidateMode: autovalidateMode,
          validator: validator,
          hint: Text(
            hintText ?? 'NA',
            style: commonTextStyle.copyWith(
              fontSize: 10,
              color: Constants.greyColour,
              fontWeight: FontWeight.w300,
            ),
          ),
          decoration: InputDecoration(
            filled: true,
            fillColor: Constants.whiteColour,
            errorStyle: commonTextStyle.copyWith(
              fontSize: 8,
              color: Constants.redColour,
              fontWeight: FontWeight.w300,
            ),
            enabled: isEnable,
            contentPadding: EdgeInsets.zero,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide:
                  BorderSide(color: Constants.blackDarkColour.withAlpha(18)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide:
                  BorderSide(color: Constants.blackDarkColour.withAlpha(18)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide:
                  BorderSide(color: Constants.blackDarkColour.withAlpha(18)),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide: BorderSide(color: Colors.red.withAlpha(180)),
            ),
            disabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(10),
              borderSide:
                  BorderSide(color: Constants.blackDarkColour.withAlpha(120)),
            ),
          ),
          items: items?.map((item) {
            return DropdownMenuItem<T>(
              value: item,
              child: Text(
                itemAsString!(item),
                style: commonTextStyle.copyWith(
                  fontSize: 12,
                  color: Constants.blackColour,
                  fontWeight: FontWeight.w300,
                ),
              ),
            );
          }).toList(),
          value: selectedValue,
          onChanged: onChanged,
          buttonStyleData: const ButtonStyleData(
            padding: EdgeInsets.only(bottom: 0, left: 10, right: 5, top: 0),
            height: 45,
            width: 200,
          ),
          dropdownStyleData: const DropdownStyleData(
              maxHeight: 200,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.all(Radius.circular(10)))),
          menuItemStyleData: const MenuItemStyleData(
            height: 40,
          ),
          onMenuStateChange: (isOpen) {
            if (!isOpen) {
              controller?.clear();
            }
          },
        ),
      ),
    );
  }
}

extension ListExtension<T> on List<T> {
  T? firstWhereOrNull(bool Function(T) test) {
    for (final item in this) {
      if (test(item)) {
        return item;
      }
    }
    return null;
  }
}
