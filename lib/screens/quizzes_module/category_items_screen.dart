import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';

// ─── Design tokens ────────────────────────────────────────────────────────────
const _surface = Color(0xFFFFFFFF);
const _accent = Color(0xFF1D4ED8);
const _accentLight = Color(0xFFDBEAFE);
const _textPrimary = Color(0xFF0F172A);
const _textSecondary = Color(0xFF4B5563);
const _divider = Color(0xFFDBEAFE);

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
    final isNotes = widget.categoryMode == "Notes";
    final title = isNotes
        ? "Subject Wise Notes"
        : (widget.categoryMode == "Timed" ? "Mock Tests" : "Practice Tests");
    final titleIcon = isNotes ? Icons.library_books_rounded : Icons.quiz_rounded;

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: title,
        titleIcon: titleIcon,
      ),
      body: isNotes ? _buildNotesList() : _buildQuizzesList(),
    );
  }

  // ─── Quizzes List ──────────────────────────────────────────────────────────
  Widget _buildQuizzesList() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        if (state.isLoading) {
          return Center(
            child: CircularProgressIndicator(
              color: _accent,
              strokeWidth: 2.5,
            ),
          );
        }

        if (state.data.isEmpty) {
          return _emptyState(
            icon: Icons.quiz_rounded,
            message: 'No quizzes available\nfor this category.',
          );
        }

        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          itemCount: state.data.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final item = state.data[index];
            return _QuizCard(
              title: item.title ?? 'Untitled',
              subtitle: item.category ?? 'General',
              index: index,
              onTap: () => context.push(RoutesNames.quizPlayScreen, extra: item.id),
            );
          },
        );
      },
    );
  }

  // ─── Notes List ────────────────────────────────────────────────────────────
  Widget _buildNotesList() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        if (state.isLoading) {
          return Center(
            child: CircularProgressIndicator(color: _accent, strokeWidth: 2.5),
          );
        }

        if (state.errorMsg.isNotEmpty) {
          return _emptyState(
            icon: Icons.error_outline_rounded,
            message: state.errorMsg,
            isError: true,
          );
        }

        if (state.notesList.isEmpty) {
          return _emptyState(
            icon: Icons.library_books_rounded,
            message: 'No notes available yet.',
          );
        }

        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          itemCount: state.notesList.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final note = state.notesList[index];
            final title = note['title'] ?? 'Untitled Note';
            final category = note['category'];
            return _NoteCard(
              title: title,
              category: category,
              index: index,
              onTap: () => context.push(RoutesNames.noteReadingScreen, extra: note),
            );
          },
        );
      },
    );
  }

  // ─── Empty State ───────────────────────────────────────────────────────────
  Widget _emptyState({
    required IconData icon,
    required String message,
    bool isError = false,
  }) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: isError
                  ? Colors.red.shade50
                  : _accentLight,
              shape: BoxShape.circle,
            ),
            child: Icon(
              icon,
              size: 34,
              color: isError ? Colors.red.shade400 : _accent,
            ),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: GoogleFonts.inter(
              fontSize: 15,
              fontWeight: FontWeight.w500,
              color: _textSecondary,
              height: 1.5,
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Quiz Card ─────────────────────────────────────────────────────────────────
class _QuizCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final int index;
  final VoidCallback onTap;

  const _QuizCard({
    required this.title,
    required this.subtitle,
    required this.index,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    // Cycle through accent shades for variety
    final iconColors = [
      const Color(0xFF6366F1), // indigo
      const Color(0xFF0891B2), // cyan
      const Color(0xFF1D4ED8), // blue
      const Color(0xFF7C3AED), // violet
      const Color(0xFF059669), // emerald
    ];
    final color = iconColors[index % iconColors.length];
    final lightColor = color.withValues(alpha: 0.1);

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: _divider),
          boxShadow: [
            BoxShadow(
              color: _accent.withValues(alpha: 0.06),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: lightColor,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(Icons.quiz_rounded, color: color, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: _textPrimary,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: 3),
                  Text(
                    subtitle,
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      color: _textSecondary,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: _accentLight,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.arrow_forward_ios_rounded,
                color: _accent,
                size: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Note Card ─────────────────────────────────────────────────────────────────
class _NoteCard extends StatelessWidget {
  final String title;
  final String? category;
  final int index;
  final VoidCallback onTap;

  const _NoteCard({
    required this.title,
    required this.category,
    required this.index,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final noteColors = [
      const Color(0xFFD97706), // amber
      const Color(0xFF059669), // emerald
      const Color(0xFF7C3AED), // violet
      const Color(0xFF0891B2), // cyan
      const Color(0xFF1D4ED8), // blue
    ];
    final color = noteColors[index % noteColors.length];

    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: _surface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: _divider),
          boxShadow: [
            BoxShadow(
              color: _accent.withValues(alpha: 0.06),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: color.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(Icons.library_books_rounded, color: color, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: _textPrimary,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (category != null) ...[
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 2),
                      decoration: BoxDecoration(
                        color: _accentLight,
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        category!,
                        style: GoogleFonts.inter(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: _accent,
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(width: 8),
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: _accentLight,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(
                Icons.arrow_forward_ios_rounded,
                color: _accent,
                size: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
