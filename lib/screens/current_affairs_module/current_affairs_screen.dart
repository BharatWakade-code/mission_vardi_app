import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/current_affairs_module/current_affairs_cubit.dart';
import 'package:mission_vardi/screens/current_affairs_module/current_affairs_state.dart';
import 'package:mission_vardi/screens/current_affairs_module/data/current_affairs_model.dart';
import 'package:mission_vardi/utils/common_widgets/commonTextField.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';

class CurrentAffairsScreen extends StatefulWidget {
  const CurrentAffairsScreen({super.key});

  @override
  State<CurrentAffairsScreen> createState() => _CurrentAffairsScreenState();
}

class _CurrentAffairsScreenState extends State<CurrentAffairsScreen> {
  final TextEditingController _searchController = TextEditingController();
  Timer? _searchDebounce;

  final List<Map<String, dynamic>> _categories = [
    {'key': 'All', 'en': 'All', 'mr': 'सर्व', 'icon': Icons.grid_view_rounded},
    {'key': 'National', 'en': 'National', 'mr': 'राष्ट्रीय', 'icon': Icons.flag_rounded},
    {'key': 'Maharashtra', 'en': 'Maharashtra', 'mr': 'महाराष्ट्र', 'icon': Icons.map_rounded},
    {'key': 'Sports', 'en': 'Sports', 'mr': 'क्रीडा', 'icon': Icons.sports_cricket_rounded},
    {'key': 'Defense', 'en': 'Defense', 'mr': 'संरक्षण', 'icon': Icons.shield_rounded},
    {'key': 'Awards', 'en': 'Awards', 'mr': 'पुरस्कार', 'icon': Icons.emoji_events_rounded},
  ];

  @override
  void initState() {
    super.initState();
    // Load articles on mount
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<CurrentAffairsCubit>().loadCurrentAffairs();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchDebounce?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
  
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: "affairs",
        titleIcon: Icons.newspaper_rounded,
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Search and Filter Header Container
            Container(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  // Search Bar
                  Container(
                    height: 46,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: CommonTextFormField(
                      controller: _searchController,
                      onChanged: (val) {
                        _searchDebounce?.cancel();
                        _searchDebounce = Timer(const Duration(milliseconds: 500), () {
                          if (mounted) {
                            context.read<CurrentAffairsCubit>().searchArticles(val);
                          }
                        });
                      },
                      hintText: "search_articles",
                      prefixIcon: Icons.search_rounded,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Categories Horizontal List
                  SizedBox(
                    height: 38,
                    child: BlocBuilder<CurrentAffairsCubit, CurrentAffairsState>(
                      builder: (context, state) {
                        return ListView.builder(
                          scrollDirection: Axis.horizontal,
                          itemCount: _categories.length,
                          itemBuilder: (context, index) {
                            final cat = _categories[index];
                            final isSelected = state.selectedCategory == cat['key'];

                            return Padding(
                              padding: const EdgeInsets.only(right: 8.0),
                              child: InkWell(
                                onTap: () {
                                  context
                                      .read<CurrentAffairsCubit>()
                                      .changeCategory(cat['key']);
                                },
                                borderRadius: BorderRadius.circular(20),
                                child: Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 14,
                                    vertical: 8,
                                  ),
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? Constants.primaryBlueColour
                                        : Colors.white,
                                    borderRadius: BorderRadius.circular(20),
                                    border: Border.all(
                                      color: isSelected
                                          ? Constants.primaryBlueColour
                                          : const Color(0xFFE2E8F0),
                                    ),
                                    boxShadow: isSelected
                                        ? [
                                            BoxShadow(
                                              color: Constants.primaryBlueColour
                                                  .withOpacity(0.3),
                                              blurRadius: 6,
                                              offset: const Offset(0, 2),
                                            )
                                          ]
                                        : null,
                                  ),
                                  child: Row(
                                    children: [
                                      Icon(
                                        cat['icon'] as IconData,
                                        size: 16,
                                        color: isSelected
                                            ? Colors.white
                                            : const Color(0xFF64748B),
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                         cat['en'],
                                        style: commonTextStyle.copyWith(
                                          fontSize: 12,
                                          fontWeight: isSelected
                                              ? FontWeight.bold
                                              : FontWeight.w600,
                                          color: isSelected
                                              ? Colors.white
                                              : const Color(0xFF475569),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

            // Articles Feed List
            Expanded(
              child: BlocBuilder<CurrentAffairsCubit, CurrentAffairsState>(
                builder: (context, state) {
                  if (state.isLoading) {
                    return const Center(
                      child: CircularProgressIndicator(
                        valueColor:
                            AlwaysStoppedAnimation<Color>(Constants.primaryBlueColour),
                      ),
                    );
                  }

                  if (state.errorMessage.isNotEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Icon(Icons.error_outline_rounded,
                              size: 54, color: Colors.red),
                          const SizedBox(height: 12),
                          Text(
                            "failed_to_load_affairs",
                            style: commonTextStyle.copyWith(
                              fontWeight: FontWeight.bold,
                              color: Colors.red,
                            ),
                          ),
                          const SizedBox(height: 8),
                          ElevatedButton(
                            onPressed: () {
                              context.read<CurrentAffairsCubit>().loadCurrentAffairs();
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Constants.primaryBlueColour,
                            ),
                            child: Text("retry"),
                          )
                        ],
                      ),
                    );
                  }

                  if (state.articles.isEmpty) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.article_outlined,
                            size: 64,
                            color: Colors.grey.shade400,
                          ),
                          const SizedBox(height: 12),
                          Text(
                            "no_articles_found",
                            style: commonTextStyle.copyWith(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.grey.shade600,
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            "try_clearing_filters",
                            style: commonTextStyle.copyWith(
                              fontSize: 12,
                              color: Colors.grey,
                            ),
                          ),
                        ],
                      ),
                    );
                  }

                  return RefreshIndicator(
                    onRefresh: () async {
                      await context.read<CurrentAffairsCubit>().loadCurrentAffairs();
                    },
                    child: ListView.builder(
                      padding: const EdgeInsets.all(16),
                      itemCount: state.articles.length,
                      itemBuilder: (context, index) {
                        final article = state.articles[index];
                        return _buildArticleCard(context, article);
                      },
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildArticleCard(
      BuildContext context, CurrentAffairsModel article) {
    final title = article.titleEn;
    final desc = article.descriptionEn;

    // Categorized colors for tags
    Color tagBg = Colors.grey.shade100;
    Color tagText = Colors.grey.shade700;

    switch (article.category.toLowerCase()) {
      case 'national':
        tagBg = const Color(0xFFEFF6FF);
        tagText = const Color(0xFF1E40AF);
        break;
      case 'maharashtra':
        tagBg = const Color(0xFFFFF7ED);
        tagText = const Color(0xFFC2410C);
        break;
      case 'sports':
        tagBg = const Color(0xFFF0FDF4);
        tagText = const Color(0xFF166534);
        break;
      case 'defense':
        tagBg = const Color(0xFFF0FDFA);
        tagText = const Color(0xFF0F766E);
        break;
      case 'awards':
        tagBg = const Color(0xFFFEF9C3);
        tagText = const Color(0xFF854D0E);
        break;
    }

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      elevation: 2,
      shadowColor: Colors.black.withOpacity(0.05),
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: () {
          context.push('/currentAffairsDetailScreen', extra: article);
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image Section
            if (article.imageUrl != null && article.imageUrl!.isNotEmpty)
              Stack(
                children: [
                  Image.network(
                    article.imageUrl!,
                    height: 160,
                    width: double.infinity,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) =>
                        _buildImagePlaceholder(article.category),
                  ),
                  // Trending Badge
                  if (article.isTrending)
                    Positioned(
                      top: 12,
                      right: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 10,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.red.shade600,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.red.shade600.withOpacity(0.4),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            )
                          ],
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(
                              Icons.trending_up,
                              color: Colors.white,
                              size: 14,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              "trending",
                              style: commonTextStyle.copyWith(
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                ],
              )
            else
              _buildImagePlaceholder(article.category),

            // Content Section
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Row with Category Tag and Date
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: tagBg,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                           article.category,
                          style: commonTextStyle.copyWith(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: tagText,
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          Icon(Icons.calendar_today_outlined,
                              size: 12, color: Colors.grey.shade500),
                          const SizedBox(width: 4),
                          Text(
                            article.publishedDate,
                            style: commonTextStyle.copyWith(
                              fontSize: 11,
                              color: Colors.grey.shade600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  // Title
                  Text(
                    title,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: commonTextStyle.copyWith(
                      fontSize: 15,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 6),
                  // Description
                  Text(
                    desc,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: commonTextStyle.copyWith(
                      fontSize: 12.5,
                      color: Colors.grey.shade600,
                      height: 1.35,
                    ),
                  ),
                  const SizedBox(height: 12),
                  // Bottom bar with "Read More" button
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      Text(
                        "read_full_article",
                        style: commonTextStyle.copyWith(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: Constants.primaryBlueColour,
                        ),
                      ),
                      const SizedBox(width: 4),
                      const Icon(
                        Icons.arrow_forward_rounded,
                        size: 14,
                        color: Constants.primaryBlueColour,
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImagePlaceholder(String category) {
    Color bg = const Color(0xFFEFF6FF);
    IconData icon = Icons.newspaper;

    switch (category.toLowerCase()) {
      case 'sports':
        bg = const Color(0xFFF0FDF4);
        icon = Icons.sports_cricket_rounded;
        break;
      case 'defense':
        bg = const Color(0xFFF0FDFA);
        icon = Icons.shield_rounded;
        break;
      case 'awards':
        bg = const Color(0xFFFEF9C3);
        icon = Icons.emoji_events_rounded;
        break;
    }

    return Container(
      height: 130,
      width: double.infinity,
      color: bg,
      child: Icon(icon, size: 48, color: Colors.blue.shade400.withOpacity(0.6)),
    );
  }

  
}
