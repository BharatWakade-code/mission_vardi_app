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
  final String subject;
  final String quizId;
  final String pdfUrl;

  const _PYQPaper({
    required this.year,
    required this.title,
    required this.subject,
    required this.quizId,
    required this.pdfUrl,
  });

  factory _PYQPaper.fromJson(Map<String, dynamic> json) {
    return _PYQPaper(
      year: json['year']?.toString() ?? '',
      title: json['title'] ?? 'Untitled Paper',
      subject: json['category'] ?? json['subject'] ?? 'General',
      quizId: json['quizId'] ?? json['id'] ?? '',
      pdfUrl: json['pdfUrl'] ?? '',
    );
  }
}

// ─── Screen ───────────────────────────────────────────────────────────────────
class PYQScreen extends StatefulWidget {
  const PYQScreen({super.key});

  @override
  State<PYQScreen> createState() => _PYQScreenState();
}

class _PYQScreenState extends State<PYQScreen> with TickerProviderStateMixin {
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
      final response = await NetworkServices().getApi('/pyqs');
      if (!mounted) return;
      if (response.data['status'] == true) {
        final List<dynamic> data = response.data['data'] ?? [];
        final catalogue = data.map((json) => _PYQPaper.fromJson(json)).toList();
        
        final yearsSet = <String>{};
        for (var p in catalogue) {
          if (p.year.isNotEmpty) yearsSet.add(p.year);
        }
        final yearsList = yearsSet.toList()..sort((a, b) => b.compareTo(a));
        
        setState(() {
          _pyqCatalogue = catalogue;
          _years = ['All', ...yearsList];
          _tabController.dispose();
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
      if (!mounted) return;
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade50,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Constants.primaryBlueColour,
        iconTheme: const IconThemeData(color: Colors.white),
        title: Text(
          'Previous Year Papers',
          style: commonTextStyle.copyWith(
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
        bottom: !_isLoading && _errorMessage.isEmpty && _years.length > 1
            ? TabBar(
                controller: _tabController,
                isScrollable: true,
                tabAlignment: TabAlignment.start,
                indicatorColor: Colors.amber,
                indicatorWeight: 3,
                labelColor: Colors.white,
                unselectedLabelColor: Colors.white70,
                labelStyle: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 15),
                tabs: _years.map((y) => Tab(text: y)).toList(),
              )
            : null,
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }
    if (_errorMessage.isNotEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.error_outline, size: 60, color: Colors.red.shade300),
            const SizedBox(height: 16),
            Text(
              "Could not load papers",
              style: commonTextStyle.copyWith(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(_errorMessage, style: TextStyle(color: Colors.grey.shade600)),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.pop(),
              child: const Text("Go Back"),
            ),
          ],
        ),
      );
    }

    if (_filteredPapers.isEmpty) {
      return Center(
        child: Text(
          "No papers available for this year.",
          style: commonTextStyle.copyWith(fontSize: 16, color: Colors.grey),
        ),
      );
    }

    return BlocListener<QuizzesCubit, QuizzesState>(
      listenWhen: (prev, curr) => prev.isLoading && !curr.isLoading && curr.isQuizRunning,
      listener: (context, state) {
        if (state.isQuizRunning) {
          context.push(RoutesNames.quizPlayScreen, extra: state.quizId ?? '');
        }
      },
      child: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _filteredPapers.length + 1, // +1 for Ad
        itemBuilder: (context, index) {
          if (index == _filteredPapers.length) {
            return const Padding(
              padding: EdgeInsets.only(top: 16),
              child: BannerAdWidget(),
            );
          }
          final paper = _filteredPapers[index];
          return _PaperCard(
            paper: paper,
            onTap: () => _startPaper(paper),
          );
        },
      ),
    );
  }

  void _startPaper(_PYQPaper paper) {
    if (paper.pdfUrl.isNotEmpty) {
      context.push(
        RoutesNames.pdfViewerScreen,
        extra: {
          'title': paper.title,
          'pdfUrl': paper.pdfUrl,
          'description': '${paper.year} - ${paper.subject}',
        },
      );
    } else {
      context.read<QuizzesCubit>().changePracticeMode('Practice');
      context.read<QuizzesCubit>().getQuizzById(quiz_id: paper.quizId);
    }
  }
}

// ─── Paper Card Widget ────────────────────────────────────────────────────────
class _PaperCard extends StatelessWidget {
  final _PYQPaper paper;
  final VoidCallback onTap;

  const _PaperCard({
    required this.paper,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final isPdf = paper.pdfUrl.isNotEmpty;

    return Card(
      elevation: 2,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: isPdf ? Colors.red.shade50 : Colors.indigo.shade50,
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  isPdf ? Icons.picture_as_pdf : Icons.quiz,
                  color: isPdf ? Colors.red.shade400 : Colors.indigo.shade400,
                  size: 24,
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      paper.title,
                      style: commonTextStyle.copyWith(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: Colors.black87,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade200,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            paper.year,
                            style: commonTextStyle.copyWith(
                              fontSize: 11,
                              fontWeight: FontWeight.w600,
                              color: Colors.grey.shade700,
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            paper.subject,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: commonTextStyle.copyWith(
                              fontSize: 13,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              Icon(Icons.arrow_forward_ios, size: 16, color: Colors.grey.shade400),
            ],
          ),
        ),
      ),
    );
  }
}
