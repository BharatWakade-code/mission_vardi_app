import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';
import 'package:mission_vardi/utils/common_widgets/banner_ad_widget.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

// ─── Data model for a PYQ paper entry ────────────────────────────────────────
class _PYQPaper {
  final String year;
  final String title;
  final String titleMr;
  final String subject;
  final String subjectMr;
  final int totalQuestions;
  final int totalMarks;
  final String duration;
  final Color accentColor;
  final IconData icon;
  final String quizId; // maps to backend quiz_id

  const _PYQPaper({
    required this.year,
    required this.title,
    required this.titleMr,
    required this.subject,
    required this.subjectMr,
    required this.totalQuestions,
    required this.totalMarks,
    required this.duration,
    required this.accentColor,
    required this.icon,
    required this.quizId,
  });

  factory _PYQPaper.fromJson(Map<String, dynamic> json) {
    Color parseColor(String hexString) {
      hexString = hexString.replaceAll("0x", "").replaceAll("#", "");
      if (hexString.length == 6) {
        hexString = "FF$hexString"; // 8 char with opacity 100%
      }
      return Color(int.parse(hexString, radix: 16));
    }

    IconData parseIcon(String iconName) {
      switch (iconName) {
        case 'workspace_premium_rounded':
          return Icons.workspace_premium_rounded;
        case 'translate_rounded':
          return Icons.translate_rounded;
        case 'public_rounded':
          return Icons.public_rounded;
        case 'star_rounded':
          return Icons.star_rounded;
        case 'calculate_rounded':
          return Icons.calculate_rounded;
        case 'history_edu_rounded':
          return Icons.history_edu_rounded;
        default:
          return Icons.history_edu_rounded;
      }
    }

    return _PYQPaper(
      year: json['year']?.toString() ?? '',
      title: json['title'] ?? '',
      titleMr: json['titleMr'] ?? '',
      subject: json['subject'] ?? '',
      subjectMr: json['subjectMr'] ?? '',
      totalQuestions: json['totalQuestions'] ?? 0,
      totalMarks: json['totalMarks'] ?? 0,
      duration: json['duration'] ?? '',
      accentColor: parseColor(json['accentColorHex'] ?? '0xFF0D47A1'),
      icon: parseIcon(json['iconName'] ?? ''),
      quizId: json['quizId'] ?? '',
    );
  }
}
// ─── Screen ───────────────────────────────────────────────────────────────────
class PYQScreen extends StatefulWidget {
  const PYQScreen({super.key});

  @override
  State<PYQScreen> createState() => _PYQScreenState();
}

class _PYQScreenState extends State<PYQScreen>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<String> _years = ['All'];
  String _selectedYear = 'All';
  List<_PYQPaper> _pyqCatalogue = [];
  bool _isLoading = true;
  String _errorMessage = '';

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _years.length, vsync: this);
    _fetchCatalogue();
  }

  Future<void> _fetchCatalogue() async {
    try {
      final response = await NetworkServices().getApi('/quiz/pyq-catalogue');
      if (response.data['status'] == true) {
        final List<dynamic> data = response.data['data'] ?? [];
        final catalogue = data.map((json) => _PYQPaper.fromJson(json)).toList();
        
        final yearsSet = <String>{};
        for (var p in catalogue) {
          yearsSet.add(p.year);
        }
        final yearsList = yearsSet.toList()..sort((a, b) => b.compareTo(a));
        
        setState(() {
          _pyqCatalogue = catalogue;
          _years = ['All', ...yearsList];
          _tabController.dispose(); // Dispose old controller
          _tabController = TabController(length: _years.length, vsync: this);
          _tabController.addListener(_handleTabChange);
          _isLoading = false;
        });
      } else {
        setState(() {
          _errorMessage = response.data['message'] ?? 'Failed to load';
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = e.toString();
        _isLoading = false;
      });
    }
  }

  void _handleTabChange() {
    if (!_tabController.indexIsChanging) {
      setState(() => _selectedYear = _years[_tabController.index]);
    }
  }

  @override
  void dispose() {
    if (_years.length > 1) {
      _tabController.dispose();
    }
    super.dispose();
  }

  List<_PYQPaper> get _filteredPapers => _selectedYear == 'All'
      ? _pyqCatalogue
      : _pyqCatalogue.where((p) => p.year == _selectedYear).toList();

  // Group papers by year for "All" view
  Map<String, List<_PYQPaper>> get _papersGroupedByYear {
    final map = <String, List<_PYQPaper>>{};
    for (final p in _filteredPapers) {
      map.putIfAbsent(p.year, () => []).add(p);
    }
    return map;
  }

  @override
  Widget build(BuildContext context) {
    final isMr = false;

    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      body: NestedScrollView(
        headerSliverBuilder: (context, _) => [
          _buildSliverAppBar(isMr),
          if (!_isLoading && _errorMessage.isEmpty) _buildSliverTabBar(),
        ],
        body: _isLoading 
            ? const Center(child: CircularProgressIndicator())
            : _errorMessage.isNotEmpty 
                ? _buildError(_errorMessage, isMr) 
                : BlocListener<QuizzesCubit, QuizzesState>(
                    listenWhen: (prev, curr) =>
                        prev.isLoading && !curr.isLoading && curr.isQuizRunning,
                    listener: (context, state) {
                      if (state.isQuizRunning) {
                        context.push(RoutesNames.quizPlayScreen,
                            extra: state.quizId ?? '');
                      }
                    },
                    child: BlocBuilder<QuizzesCubit, QuizzesState>(
                      builder: (context, state) {
                        return CustomScrollView(
                          slivers: [
                            if (state.isLoading)
                              const SliverFillRemaining(
                                child: Center(child: CircularProgressIndicator()),
                              )
                            else if (state.errorMsg.isNotEmpty)
                              SliverFillRemaining(child: _buildError(state.errorMsg, isMr))
                            else
                              _buildPaperList(isMr),
                            const SliverToBoxAdapter(child: BannerAdWidget()),
                            const SliverToBoxAdapter(child: SizedBox(height: 24)),
                          ],
                        );
                      },
                    ),
                  ),
      ),
    );
  }

  // ── App Bar ────────────────────────────────────────────────────────────────
  SliverAppBar _buildSliverAppBar(bool isMr) {
    return SliverAppBar(
      expandedHeight: 160,
      floating: false,
      pinned: true,
      elevation: 0,
      backgroundColor: const Color(0xFF0A2540),
      leading: IconButton(
        icon: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.15),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.arrow_back_ios_new_rounded,
              color: Colors.white, size: 15),
        ),
        onPressed: () => Navigator.of(context).pop(),
      ),
      flexibleSpace: FlexibleSpaceBar(
        titlePadding:
            const EdgeInsets.only(left: 56, bottom: 14, right: 16),
        title: Text(
          isMr ? 'मागील वर्षांच्या प्रश्नपत्रिका' : 'Previous Year Papers',
          style: const TextStyle(
            color: Colors.white,
            fontFamily: 'Outfit',
            fontWeight: FontWeight.bold,
            fontSize: 16,
          ),
        ),
        background: Stack(
          fit: StackFit.expand,
          children: [
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF0A2540), Color(0xFF1565C0)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
            ),
            Positioned(
              top: 20,
              right: 20,
              child: Opacity(
                opacity: 0.12,
                child: Icon(Icons.history_edu_rounded,
                    size: 130, color: Colors.white),
              ),
            ),
            Positioned(
              bottom: 50,
              left: 16,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _statBadge(
                    isMr ? 'एकूण पेपर्स' : 'Total Papers',
                    '${_pyqCatalogue.length}',
                    Icons.description_rounded,
                  ),
                  const SizedBox(height: 6),
                  _statBadge(
                    isMr ? 'वर्षे' : 'Years Covered',
                    '2021 – 2024',
                    Icons.calendar_month_rounded,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statBadge(String label, String value, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.15),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: Colors.amber, size: 14),
          const SizedBox(width: 6),
          Text(
            '$value  •  $label',
            style: const TextStyle(
              color: Colors.white,
              fontFamily: 'Outfit',
              fontSize: 12,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  // ── Tab Bar ────────────────────────────────────────────────────────────────
  SliverPersistentHeader _buildSliverTabBar() {
    return SliverPersistentHeader(
      pinned: true,
      delegate: _TabBarDelegate(
        TabBar(
          controller: _tabController,
          isScrollable: true,
          tabAlignment: TabAlignment.start,
          indicator: BoxDecoration(
            color: const Color(0xFF0A2540),
            borderRadius: BorderRadius.circular(20),
          ),
          indicatorSize: TabBarIndicatorSize.tab,
          indicatorPadding:
              const EdgeInsets.symmetric(horizontal: -4, vertical: 6),
          dividerColor: Colors.transparent,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.grey.shade600,
          labelStyle: const TextStyle(
              fontFamily: 'Outfit',
              fontSize: 13,
              fontWeight: FontWeight.bold),
          unselectedLabelStyle: const TextStyle(
              fontFamily: 'Outfit',
              fontSize: 13,
              fontWeight: FontWeight.w500),
          tabs: _years
              .map((y) => Tab(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 4),
                      child: Text(y == 'All' ? 'All Years' : y),
                    ),
                  ))
              .toList(),
        ),
        backgroundColor: Constants.scaffoldBackgroundColour,
      ),
    );
  }

  // ── Paper List ─────────────────────────────────────────────────────────────
  Widget _buildPaperList(bool isMr) {
    if (_selectedYear == 'All') {
      // Grouped by year
      final grouped = _papersGroupedByYear;
      final yearKeys = grouped.keys.toList()..sort((a, b) => b.compareTo(a));

      return SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final year = yearKeys[index];
            final papers = grouped[year]!;
            return _buildYearGroup(year, papers, isMr);
          },
          childCount: yearKeys.length,
        ),
      );
    } else {
      return SliverPadding(
        padding: const EdgeInsets.all(16),
        sliver: SliverList(
          delegate: SliverChildBuilderDelegate(
            (context, index) => _PaperCard(
              paper: _filteredPapers[index],
              isMr: isMr,
              onTap: () => _startPaper(_filteredPapers[index]),
            ),
            childCount: _filteredPapers.length,
          ),
        ),
      );
    }
  }

  Widget _buildYearGroup(
      String year, List<_PYQPaper> papers, bool isMr) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Year Header
          Row(
            children: [
              Container(
                padding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFF0A2540),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  year,
                  style: const TextStyle(
                    color: Colors.white,
                    fontFamily: 'Outfit',
                    fontWeight: FontWeight.bold,
                    fontSize: 13,
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Divider(color: Colors.grey.shade300, thickness: 1),
              ),
              const SizedBox(width: 8),
              Text(
                '${papers.length} papers',
                style: TextStyle(
                  color: Colors.grey.shade500,
                  fontSize: 11,
                  fontFamily: 'Outfit',
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          ...papers.map((p) => _PaperCard(
                paper: p,
                isMr: isMr,
                onTap: () => _startPaper(p),
              )),
        ],
      ),
    );
  }

  void _startPaper(_PYQPaper paper) {
    context.read<QuizzesCubit>().changePracticeMode('Practice');
    context
        .read<QuizzesCubit>()
        .getQuizzById(quiz_id: paper.quizId);
  }

  Widget _buildError(String msg, bool isMr) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.wifi_off_rounded,
                size: 64, color: Colors.grey.shade400),
            const SizedBox(height: 16),
            Text(
              'Could not load papers',
              style: const TextStyle(
                fontFamily: 'Outfit',
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              msg,
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.grey.shade600, fontSize: 13),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF0A2540),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
              onPressed: () {
                context.read<QuizzesCubit>().resetToMenu();
              },
              icon: const Icon(Icons.arrow_back_rounded, size: 18),
              label: Text(
                'Go Back',
                style: const TextStyle(
                  fontFamily: 'Outfit',
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── Paper Card Widget ────────────────────────────────────────────────────────
class _PaperCard extends StatelessWidget {
  final _PYQPaper paper;
  final bool isMr;
  final VoidCallback onTap;

  const _PaperCard({
    required this.paper,
    required this.isMr,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade100),
          boxShadow: [
            BoxShadow(
              color: paper.accentColor.withOpacity(0.08),
              blurRadius: 12,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          children: [
            // Header strip
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    paper.accentColor,
                    paper.accentColor.withOpacity(0.75),
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(16)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child:
                        Icon(paper.icon, color: Colors.white, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          paper.title,
                          style: const TextStyle(
                            color: Colors.white,
                            fontFamily: 'Outfit',
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          paper.subject,
                          style: TextStyle(
                            color: Colors.white.withOpacity(0.8),
                            fontFamily: 'Outfit',
                            fontSize: 11,
                          ),
                        ),
                      ],
                    ),
                  ),
                  // Year badge
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: Colors.white.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      paper.year,
                      style: const TextStyle(
                        color: Colors.white,
                        fontFamily: 'Outfit',
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Stats row
            Padding(
              padding:
                  const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Row(
                children: [
                  _stat(
                      Icons.help_outline_rounded,
                      '${paper.totalQuestions}',
                      'Questions',
                      paper.accentColor),
                  _divider(),
                  _stat(Icons.score_rounded, '${paper.totalMarks}',
                      'Marks', Colors.green),
                  _divider(),
                  _stat(Icons.timer_outlined, paper.duration,
                      'Duration', Colors.orange),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: paper.accentColor,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          'Start',
                          style: const TextStyle(
                            color: Colors.white,
                            fontFamily: 'Outfit',
                            fontWeight: FontWeight.bold,
                            fontSize: 13,
                          ),
                        ),
                        const SizedBox(width: 4),
                        const Icon(Icons.play_arrow_rounded,
                            color: Colors.white, size: 16),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _stat(
      IconData icon, String value, String label, Color color) {
    return Row(
      children: [
        Icon(icon, size: 14, color: color),
        const SizedBox(width: 4),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(value,
                style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 13,
                    fontWeight: FontWeight.bold,
                    color: color)),
            Text(label,
                style: TextStyle(
                    fontFamily: 'Outfit',
                    fontSize: 9,
                    color: Colors.grey.shade500)),
          ],
        ),
      ],
    );
  }

  Widget _divider() => Container(
        height: 28,
        width: 1,
        margin: const EdgeInsets.symmetric(horizontal: 10),
        color: Colors.grey.shade200,
      );
}

// ─── SliverPersistentHeaderDelegate for TabBar ────────────────────────────────
class _TabBarDelegate extends SliverPersistentHeaderDelegate {
  final TabBar tabBar;
  final Color backgroundColor;

  const _TabBarDelegate(this.tabBar, {required this.backgroundColor});

  @override
  double get minExtent => tabBar.preferredSize.height + 8;
  @override
  double get maxExtent => tabBar.preferredSize.height + 8;

  @override
  Widget build(
      BuildContext context, double shrinkOffset, bool overlapsContent) {
    return Container(
      color: backgroundColor,
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: tabBar,
    );
  }

  @override
  bool shouldRebuild(_TabBarDelegate old) => false;
}
