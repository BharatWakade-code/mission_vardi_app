import 'package:flutter/material.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edusaas/screens/localization_module/locale_cubit.dart';
import 'package:edusaas/utils/routes_services/routes_name.dart';
import 'package:edusaas/utils/common_widgets/common_app_bar.dart';
import 'package:edusaas/utils/constants.dart';

class NoteReadingScreen extends StatelessWidget {
  final Map<String, dynamic> noteData;

  const NoteReadingScreen({super.key, required this.noteData});

  @override
  Widget build(BuildContext context) {
    final langCode = context.watch<LocaleCubit>().state.languageCode;

    final rawTitle = noteData['title'] ?? 'Note';
    final titleMr = noteData['title_mr'] ?? '';
    final title = (langCode == 'mr' && titleMr.toString().isNotEmpty) ? titleMr.toString() : rawTitle.toString();

    final category = noteData['category'] ?? '';

    final rawDesc = noteData['description'] ?? '';
    final descMr = noteData['description_mr'] ?? '';
    final description = (langCode == 'mr' && descMr.toString().isNotEmpty) ? descMr.toString() : rawDesc.toString();

    final rawContent = noteData['content'];
    final contentMr = noteData['content_mr'];
    final content = (langCode == 'mr' && contentMr != null && contentMr.toString().isNotEmpty) ? contentMr.toString() : rawContent;
    final pdfUrl = noteData['pdfUrl'];

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: title,
        titleIcon: Icons.menu_book,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Container(
          width: double.infinity,
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.grey.withOpacity(0.1),
                blurRadius: 10,
                offset: const Offset(0, 5),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontFamily: 'Outfit',
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF0A2540),
                ),
              ),
              if (category.isNotEmpty) ...[
                const SizedBox(height: 8),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: Colors.blue.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    category,
                    style: TextStyle(
                      fontFamily: 'Outfit',
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: Colors.blue.shade700,
                    ),
                  ),
                ),
              ],
              const SizedBox(height: 20),
              if (description.isNotEmpty) ...[
                Text(
                  description,
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Constants.primaryBlueColour,
                  ),
                ),
                const SizedBox(height: 15),
              ],
              if (content != null && content.toString().isNotEmpty) ...[
                Text(
                  content.toString(),
                  style: const TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 15,
                    height: 1.6,
                    color: Colors.black87,
                  ),
                ),
                const SizedBox(height: 30),
              ] else if (pdfUrl == null || pdfUrl.toString().isEmpty) ...[
                 Text(
                  'no_content_available_for_this_note'.tr(),
                  style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 15,
                    fontStyle: FontStyle.italic,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(height: 30),
              ],
              if (pdfUrl != null && pdfUrl.toString().isNotEmpty) ...[
                const SizedBox(height: 10),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Constants.primaryBlueColour,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: () {
                      context.push(
                        RoutesNames.pdfViewerScreen,
                        extra: {
                          'title': title,
                          'description': description,
                          'pdfUrl': pdfUrl,
                        },
                      );
                    },
                    icon: const Icon(Icons.picture_as_pdf_rounded),
                    label:  Text(
                      'view_pdf_note'.tr(),
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        fontWeight: FontWeight.bold,
                        fontSize: 16,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
