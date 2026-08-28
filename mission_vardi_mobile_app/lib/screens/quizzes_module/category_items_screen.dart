import 'package:flutter/material.dart';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/localization_module/locale_cubit.dart';
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
  final String categoryMode; // "Timed", "Practice", 'notes'.tr()
  const CategoryItemsScreen({super.key, required this.categoryMode});

  @override
  State<CategoryItemsScreen> createState() => _CategoryItemsScreenState();
}

class _CategoryItemsScreenState extends State<CategoryItemsScreen> {
  /// Which category accordion is expanded (null = all collapsed)
  String? _expandedCategory;

  @override
  void initState() {
    super.initState();
    if (widget.categoryMode != 'notes'.tr()) {
      context.read<QuizzesCubit>().changePracticeMode(widget.categoryMode);
      context.read<QuizzesCubit>().getQuizzesList();
    } else {
      context.read<QuizzesCubit>().getNotesList();
    }
  }

  @override
  Widget build(BuildContext context) {
    final isNotes = widget.categoryMode == 'notes'.tr();
    final title = isNotes
        ? 'subject_wise_notes'.tr()
        : (widget.categoryMode == "Timed"
            ? 'mock_tests'.tr()
            : 'practice_tests'.tr());
    final titleIcon =
        isNotes ? Icons.library_books_rounded : Icons.quiz_rounded;

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: title,
        titleIcon: titleIcon,
      ),
      body: isNotes ? _buildNotesHierarchy() : _buildQuizzesList(),
    );
  }

  // ─── Quizzes List ──────────────────────────────────────────────────────────
  Widget _buildQuizzesList() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        if (state.isLoading) {
          return Center(
            child: CircularProgressIndicator(color: _accent, strokeWidth: 2.5),
          );
        }
        if (state.data.isEmpty) {
          return _emptyState(
            icon: Icons.quiz_rounded,
            message: 'no_quizzes_availablenfor_this_category'.tr(),
          );
        }
        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          itemCount: state.data.length,
          separatorBuilder: (_, __) => const SizedBox(height: 10),
          itemBuilder: (context, index) {
            final item = state.data[index];
            final langCode = context.watch<LocaleCubit>().state.languageCode;
            final titleMr = item.titleMr ?? '';
            final localizedTitle = (langCode == 'mr' && titleMr.isNotEmpty)
                ? titleMr
                : (item.title ?? 'Untitled');
            final totalQ = item.totalQuestions ?? (item.questions?.length ?? 25);
            final marks = totalQ * 2;
            
            return _QuizCard(
              title: localizedTitle,
              subtitle: '${item.category ?? 'General'} • $totalQ Questions • $marks Marks',
              index: index,
              onTap: () =>
                  context.push(RoutesNames.quizPlayScreen, extra: item.id),
            );
          },
        );
      },
    );
  }

  // ─── Notes: Category → Subject → Notes accordion ──────────────────────────
  Widget _buildNotesHierarchy() {
    return BlocBuilder<QuizzesCubit, QuizzesState>(
      builder: (context, state) {
        if (state.isLoading) {
          return Center(
              child:
                  CircularProgressIndicator(color: _accent, strokeWidth: 2.5));
        }
        if (state.errorMsg.isNotEmpty) {
          return _emptyState(
              icon: Icons.error_outline_rounded,
              message: state.errorMsg,
              isError: true);
        }
        if (state.notesList.isEmpty) {
          return _emptyState(
              icon: Icons.library_books_rounded,
              message: 'no_notes_available_yet'.tr());
        }

        // ── Group: category → subject → [notes] ──────────────────────────
        // Each note map is expected to have: title, category, subject (optional)
        final Map<String, Map<String, List<dynamic>>> grouped = {};
        for (final note in state.notesList) {
          final cat = (note['category'] ?? 'General').toString();
          final sub = (note['subject'] ?? 'General').toString();
          grouped.putIfAbsent(cat, () => {});
          grouped[cat]!.putIfAbsent(sub, () => []);
          grouped[cat]![sub]!.add(note);
        }
        final categories = grouped.keys.toList()..sort();

        return ListView.separated(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 32),
          itemCount: categories.length,
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, catIdx) {
            final category = categories[catIdx];
            final subjects = grouped[category]!;
            final totalNotes =
                subjects.values.fold<int>(0, (sum, list) => sum + list.length);
            final isExpanded = _expandedCategory == category;

            return _CategoryAccordion(
              category: category,
              totalNotes: totalNotes,
              subjects: subjects,
              isExpanded: isExpanded,
              catIndex: catIdx,
              onToggle: () => setState(
                  () => _expandedCategory = isExpanded ? null : category),
              onNoteTap: (note) =>
                  context.push(RoutesNames.noteReadingScreen, extra: note),
            );
          },
        );
      },
    );
  }

  // ─── Empty State ───────────────────────────────────────────────────────────
  Widget _emptyState(
      {required IconData icon, required String message, bool isError = false}) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: isError ? Colors.red.shade50 : _accentLight,
              shape: BoxShape.circle,
            ),
            child: Icon(icon,
                size: 34, color: isError ? Colors.red.shade400 : _accent),
          ),
          const SizedBox(height: 16),
          Text(
            message,
            textAlign: TextAlign.center,
            style: commonTextStyle.copyWith(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: _textSecondary,
                height: 1.5),
          ),
        ],
      ),
    );
  }
}

// ─── Category Accordion Card ──────────────────────────────────────────────────
class _CategoryAccordion extends StatelessWidget {
  final String category;
  final int totalNotes;
  final Map<String, List<dynamic>> subjects;
  final bool isExpanded;
  final int catIndex;
  final VoidCallback onToggle;
  final void Function(dynamic note) onNoteTap;

  const _CategoryAccordion({
    required this.category,
    required this.totalNotes,
    required this.subjects,
    required this.isExpanded,
    required this.catIndex,
    required this.onToggle,
    required this.onNoteTap,
  });

  static const _catColors = [
    Color(0xFF1D4ED8), // blue
    Color(0xFF7C3AED), // violet
    Color(0xFF059669), // emerald
    Color(0xFF0891B2), // cyan
    Color(0xFFD97706), // amber
    Color(0xFFDC2626), // red
  ];

  @override
  Widget build(BuildContext context) {
    final color = _catColors[catIndex % _catColors.length];

    return AnimatedContainer(
      duration: const Duration(milliseconds: 250),
      curve: Curves.easeInOut,
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isExpanded ? color.withOpacity(0.4) : _divider,
          width: isExpanded ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: color.withOpacity(isExpanded ? 0.12 : 0.04),
            blurRadius: isExpanded ? 18 : 8,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        children: [
          // ── Header (tap to expand) ──────────────────────────────────────
          GestureDetector(
            onTap: onToggle,
            behavior: HitTestBehavior.opaque,
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      color: color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: color.withOpacity(0.25)),
                    ),
                    child: Icon(Icons.folder_rounded, color: color, size: 24),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          category,
                          style: commonTextStyle.copyWith(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: _textPrimary,
                          ),
                        ),
                        const SizedBox(height: 3),
                        Text(
                          '$totalNotes note${totalNotes == 1 ? '' : 's'} · '
                          '${subjects.length} subject${subjects.length == 1 ? '' : 's'}',
                          style: commonTextStyle.copyWith(
                              fontSize: 11, color: _textSecondary),
                        ),
                      ],
                    ),
                  ),
                  AnimatedRotation(
                    duration: const Duration(milliseconds: 250),
                    turns: isExpanded ? 0.5 : 0.0,
                    child: Container(
                      width: 30,
                      height: 30,
                      decoration: BoxDecoration(
                        color: color.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Icon(Icons.keyboard_arrow_down_rounded,
                          color: color, size: 20),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Subjects + Notes (when expanded) ───────────────────────────
          if (isExpanded) ...[
            Divider(height: 1, color: color.withOpacity(0.15)),
            Padding(
              padding: const EdgeInsets.fromLTRB(12, 12, 12, 16),
              child: Column(
                children: subjects.entries.toList().asMap().entries.map((e) {
                  final subjectName = e.value.key;
                  final notes = e.value.value;
                  return _SubjectSection(
                    subjectName: subjectName,
                    notes: notes,
                    catColor: color,
                    onNoteTap: onNoteTap,
                  );
                }).toList(),
              ),
            ),
          ],
        ],
      ),
    );
  }
}

// ─── Subject Section ──────────────────────────────────────────────────────────
class _SubjectSection extends StatelessWidget {
  final String subjectName;
  final List<dynamic> notes;
  final Color catColor;
  final void Function(dynamic note) onNoteTap;

  const _SubjectSection({
    required this.subjectName,
    required this.notes,
    required this.catColor,
    required this.onNoteTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Subject label row
          Padding(
            padding: const EdgeInsets.only(left: 4, bottom: 8),
            child: Row(
              children: [
                Icon(Icons.book_rounded,
                    size: 14, color: catColor.withOpacity(0.7)),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    subjectName,
                    style: commonTextStyle.copyWith(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: catColor,
                      letterSpacing: 0.3,
                    ),
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                  decoration: BoxDecoration(
                    color: catColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${notes.length}',
                    style: commonTextStyle.copyWith(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: catColor),
                  ),
                ),
              ],
            ),
          ),
          ...notes.asMap().entries.map((e) {
            final note = e.value;
            final langCode = context.watch<LocaleCubit>().state.languageCode;
            final titleMr = note['title_mr']?.toString() ?? '';
            final localizedTitle = (langCode == 'mr' && titleMr.isNotEmpty)
                ? titleMr
                : (note['title'] ?? 'Untitled Note').toString();
            return Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: _NoteRow(
                title: localizedTitle,
                color: catColor,
                onTap: () => onNoteTap(note),
              ),
            );
          }),
        ],
      ),
    );
  }
}

// ─── Note Row ─────────────────────────────────────────────────────────────────
class _NoteRow extends StatelessWidget {
  final String title;
  final Color color;
  final VoidCallback onTap;

  const _NoteRow(
      {required this.title, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.04),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.15)),
        ),
        child: Row(
          children: [
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: color.withOpacity(0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(Icons.description_rounded, color: color, size: 15),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                title,
                style: commonTextStyle.copyWith(
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                  color: _textPrimary,
                ),
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded,
                size: 12, color: color.withOpacity(0.6)),
          ],
        ),
      ),
    );
  }
}

// ─── Quiz Card ────────────────────────────────────────────────────────────────
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
    const iconColors = [
      Color(0xFF6366F1),
      Color(0xFF0891B2),
      Color(0xFF1D4ED8),
      Color(0xFF7C3AED),
      Color(0xFF059669),
    ];
    final color = iconColors[index % iconColors.length];

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
              color: _accent.withOpacity(0.06),
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
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(Icons.quiz_rounded, color: color, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title,
                      style: commonTextStyle.copyWith(
                          fontSize: 14,
                          fontWeight: FontWeight.w700,
                          color: _textPrimary),
                      maxLines: 2,
                      overflow: TextOverflow.ellipsis),
                  const SizedBox(height: 3),
                  Text(subtitle,
                      style: commonTextStyle.copyWith(
                          fontSize: 11,
                          color: _textSecondary,
                          fontWeight: FontWeight.w400)),
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
              child: const Icon(Icons.arrow_forward_ios_rounded,
                  color: _accent, size: 14),
            ),
          ],
        ),
      ),
    );
  }
}
