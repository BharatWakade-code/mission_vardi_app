import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

class CategoryItemsScreen extends StatefulWidget {
  final String categoryMode; // "Timed", "Practice", "Notes"

  const CategoryItemsScreen({super.key, required this.categoryMode});

  @override
  State<CategoryItemsScreen> createState() => _CategoryItemsScreenState();
}

class _CategoryItemsScreenState extends State<CategoryItemsScreen> {

  @override
  void initState() {
    super.initState();
    if (widget.categoryMode != "Notes") {
      context.read<QuizzesCubit>().changePracticeMode(widget.categoryMode);
      context.read<QuizzesCubit>().getQuizzesList();
    } else {
      context.read<QuizzesCubit>().getNotesList();
    }
  }

  @override
  Widget build(BuildContext context) {
    final title = widget.categoryMode == "Notes"
        ? "Subject Wise Notes"
        : (widget.categoryMode == "Timed" ? "Mock Tests" : "Practice Tests");

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: title,
        titleIcon: widget.categoryMode == "Notes" ? Icons.menu_book : Icons.quiz,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: widget.categoryMode == "Notes"
          ? _buildNotesList()
          : _buildQuizzesList(),
    );
  }

  Widget _buildQuizzesList() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        if (state.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state.data.isEmpty) {
          return Center(
            child: Text(
              "No quizzes available for this category.",
              style: TextStyle(fontFamily: 'Outfit', color: Colors.grey.shade600, fontSize: 16),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: state.data.length,
          itemBuilder: (context, index) {
            final item = state.data[index];
            return Card(
              elevation: 2,
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                leading: CircleAvatar(
                  backgroundColor: Constants.primaryBlueColour.withOpacity(0.1),
                  child: Icon(Icons.quiz, color: Constants.primaryBlueColour),
                ),
                title: Text(
                  item.title ?? "Untitled",
                  style: const TextStyle(fontFamily: 'Outfit', fontWeight: FontWeight.bold, fontSize: 15),
                ),
                subtitle: Text(
                  item.category ?? "General",
                  style: TextStyle(fontFamily: 'Outfit', color: Colors.grey.shade600, fontSize: 13),
                ),
                trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey),
                onTap: () {
                  context.push(RoutesNames.quizPlayScreen, extra: item.id);
                },
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildNotesList() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        if (state.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state.errorMsg.isNotEmpty) {
          return Center(
            child: Text(
              state.errorMsg,
              style: TextStyle(fontFamily: 'Outfit', color: Colors.red.shade400, fontSize: 16),
            ),
          );
        }

        if (state.notesList.isEmpty) {
          return Center(
            child: Text(
              "No notes available yet.",
              style: TextStyle(fontFamily: 'Outfit', color: Colors.grey.shade600, fontSize: 16),
            ),
          );
        }

        return ListView.builder(
          padding: const EdgeInsets.all(16),
          itemCount: state.notesList.length,
          itemBuilder: (context, index) {
            final note = state.notesList[index];
            final title = note['title'] ?? 'Untitled Note';
            
            return Card(
              elevation: 1,
              margin: const EdgeInsets.only(bottom: 12),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: ListTile(
                contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                leading: CircleAvatar(
                  backgroundColor: Colors.blue.shade50,
                  child: Icon(Icons.library_books, color: Colors.blue.shade700),
                ),
                title: Text(
                  title,
                  style: const TextStyle(
                    fontFamily: 'Outfit', 
                    fontWeight: FontWeight.w600, 
                    fontSize: 15,
                    color: Color(0xFF0A2540)
                  ),
                ),
                subtitle: note['category'] != null
                    ? Text(
                        note['category'],
                        style: TextStyle(fontFamily: 'Outfit', color: Colors.grey.shade600, fontSize: 12),
                      )
                    : null,
                trailing: const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
                onTap: () {
                  // Pass the note map as extra
                  context.push(RoutesNames.noteReadingScreen, extra: note);
                },
              ),
            );
          },
        );
      },
    );
  }
}
