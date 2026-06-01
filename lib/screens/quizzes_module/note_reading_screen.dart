import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';

class NoteReadingScreen extends StatelessWidget {
  final Map<String, dynamic> noteData;

  const NoteReadingScreen({super.key, required this.noteData});

  @override
  Widget build(BuildContext context) {
    final title = noteData['title'] ?? 'Note';
    final category = noteData['category'] ?? '';
    final description = noteData['description'] ?? '';
    final content = noteData['content'];
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
                const Text(
                  "No content available for this note.",
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
                    label: const Text(
                      "View PDF Note",
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
