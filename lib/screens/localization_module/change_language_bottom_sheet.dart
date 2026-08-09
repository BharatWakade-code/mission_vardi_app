import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edusaas/screens/localization_module/locale_cubit.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';

class ChangeLanguageBottomSheet extends StatelessWidget {
  const ChangeLanguageBottomSheet({super.key});

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => const ChangeLanguageBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'select_language'.tr(),
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 20),
            _buildLanguageOption(context, 'English', 'en'),
            const Divider(),
            _buildLanguageOption(context, 'मराठी', 'mr'),
          ],
        ),
      ),
    );
  }

  Widget _buildLanguageOption(
      BuildContext context, String title, String languageCode) {
    final currentLocale = context.watch<LocaleCubit>().state.languageCode;
    final isSelected = currentLocale == languageCode;

    return ListTile(
      title: Text(
        title,
        style: TextStyle(
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          color: isSelected ? Colors.blue : Colors.black87,
        ),
      ),
      trailing: isSelected
          ? const Icon(Icons.check_circle, color: Colors.blue)
          : null,
      onTap: () {
        context.read<LocaleCubit>().setLocale(languageCode);
        Navigator.pop(context);
      },
    );
  }
}
