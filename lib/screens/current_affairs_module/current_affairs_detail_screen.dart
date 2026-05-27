import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:mission_vardi/localization/language_cubit.dart';
import 'package:mission_vardi/screens/current_affairs_module/data/current_affairs_model.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/common_widgets/common_toast_message.dart';
import 'package:url_launcher/url_launcher.dart';

class CurrentAffairsDetailScreen extends StatefulWidget {
  final CurrentAffairsModel article;

  const CurrentAffairsDetailScreen({super.key, required this.article});

  @override
  State<CurrentAffairsDetailScreen> createState() => _CurrentAffairsDetailScreenState();
}

class _CurrentAffairsDetailScreenState extends State<CurrentAffairsDetailScreen> {
  late bool _isMarathiReadingMode;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Default the reading language to the device/app current language setting
    final currentLanguageCode = Localizations.localeOf(context).languageCode;
    _isMarathiReadingMode = currentLanguageCode == 'mr';
  }

  @override
  Widget build(BuildContext context) {
    final title = _isMarathiReadingMode ? widget.article.titleMr : widget.article.titleEn;
    final content = _isMarathiReadingMode ? widget.article.contentMr : widget.article.contentEn;
    final category = _isMarathiReadingMode
        ? _getCategoryMr(widget.article.category)
        : widget.article.category;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          // Scrollable content
          CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Beautiful Sliver App Bar with Hero Image
              SliverAppBar(
                expandedHeight: 250,
                pinned: true,
                stretch: true,
                backgroundColor: Constants.primaryBlueColour,
                leading: Container(
                  margin: const EdgeInsets.all(8),
                  decoration: const BoxDecoration(
                    color: Colors.black26,
                    shape: BoxShape.circle,
                  ),
                  child: IconButton(
                    icon: const Icon(Icons.arrow_back, color: Colors.white),
                    onPressed: () => Navigator.of(context).pop(),
                  ),
                ),
                actions: [
                  // Language Toggle Button inside transparent circle
                  Container(
                    margin: const EdgeInsets.only(right: 12, top: 8, bottom: 8),
                    decoration: const BoxDecoration(
                      color: Colors.black26,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: Icon(
                        _isMarathiReadingMode ? Icons.translate_rounded : Icons.g_translate_rounded,
                        color: Colors.amber,
                        size: 20,
                      ),
                      tooltip: _isMarathiReadingMode ? "Switch to English" : "मराठीत वाचा",
                      onPressed: () {
                        final targetLang = _isMarathiReadingMode ? 'en' : 'mr';
                        context.read<LanguageCubit>().changeLanguage(targetLang);
                        context.setLocale(Locale(targetLang));
                        setState(() {
                          _isMarathiReadingMode = !_isMarathiReadingMode;
                        });
                      },
                    ),
                  ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  stretchModes: const [
                    StretchMode.zoomBackground,
                    StretchMode.blurBackground,
                  ],
                  background: Stack(
                    fit: StackFit.expand,
                    children: [
                      if (widget.article.imageUrl != null && widget.article.imageUrl!.isNotEmpty)
                        Image.network(
                          widget.article.imageUrl!,
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => Container(
                            color: const Color(0xFFEFF6FF),
                            child: const Icon(
                              Icons.newspaper_rounded,
                              size: 80,
                              color: Constants.primaryBlueColour,
                            ),
                          ),
                        )
                      else
                        Container(
                          color: const Color(0xFFEFF6FF),
                          child: const Icon(
                            Icons.newspaper_rounded,
                            size: 80,
                            color: Constants.primaryBlueColour,
                          ),
                        ),
                      // Top gradient for back button visibility and bottom gradient for title contrast
                      const DecoratedBox(
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                              Colors.black54,
                              Colors.transparent,
                              Colors.transparent,
                              Colors.black87,
                            ],
                            stops: [0.0, 0.3, 0.7, 1.0],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              // Article Body
              SliverToBoxAdapter(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Category tag & Date Row
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: Constants.primaryBlueColour.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              category.toUpperCase(),
                              style: commonTextStyle.copyWith(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: Constants.primaryBlueColour,
                              ),
                            ),
                          ),
                          Row(
                            children: [
                              const Icon(Icons.access_time_rounded, size: 14, color: Colors.grey),
                              const SizedBox(width: 4),
                              Text(
                                widget.article.publishedDate,
                                style: commonTextStyle.copyWith(
                                  fontSize: 12,
                                  color: Colors.grey.shade600,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Large Title
                      Text(
                        title,
                        style: commonTextStyle.copyWith(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                          color: const Color(0xFF1E293B),
                          height: 1.3,
                        ),
                      ),
                      const Divider(height: 32, thickness: 1.2, color: Color(0xFFF1F5F9)),

                      // Parsed Markdown / Study content
                      ..._parseContentToWidgets(content),

                      const SizedBox(height: 24),


                      // 🌐 Read Full Article button card
                      if (widget.article.pdfUrl != null && widget.article.pdfUrl!.isNotEmpty)
                        InkWell(
                          onTap: () async {
                            final uri = Uri.tryParse(widget.article.pdfUrl!);
                            if (uri != null && await canLaunchUrl(uri)) {
                              await launchUrl(uri, mode: LaunchMode.externalApplication);
                            } else {
                              GlobalToast.show(
                                "could_not_open_article".tr(),
                                icon: Icons.error_outline_rounded,
                                accentColor: Colors.red,
                              );
                            }
                          },
                          borderRadius: BorderRadius.circular(16),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              gradient: const LinearGradient(
                                colors: [Color(0xFFF0FDF4), Color(0xFFDCFCE7)],
                              ),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFBBF7D0)),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(10),
                                  decoration: const BoxDecoration(
                                    color: Colors.white,
                                    shape: BoxShape.circle,
                                  ),
                                  child: const Icon(
                                    Icons.language_rounded,
                                    color: Colors.green,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "read_original_article".tr(),
                                        style: commonTextStyle.copyWith(
                                          fontSize: 13,
                                          fontWeight: FontWeight.bold,
                                          color: const Color(0xFF166534),
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        "read_full_article_source".tr(),
                                        style: commonTextStyle.copyWith(
                                          fontSize: 11,
                                          color: const Color(0xFF15803D),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(
                                  Icons.open_in_new_rounded,
                                  color: Color(0xFF15803D),
                                )
                              ],
                            ),
                          ),
                        ),

                      const SizedBox(height: 40),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }



  // Parses mock markdown string to simple beautifully padded widgets
  List<Widget> _parseContentToWidgets(String contentText) {
    final List<Widget> widgets = [];
    final lines = contentText.split('\n');

    for (var line in lines) {
      final trimmed = line.trim();
      if (trimmed.isEmpty) {
        widgets.add(const SizedBox(height: 10));
        continue;
      }

      if (trimmed.startsWith('### ')) {
        // Main Section Header
        widgets.add(
          Padding(
            padding: const EdgeInsets.only(top: 14.0, bottom: 6.0),
            child: Text(
              trimmed.replaceFirst('### ', ''),
              style: GoogleFonts.philosopher(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Constants.primaryBlueColour,
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('#### ')) {
        // Sub Section Header
        widgets.add(
          Padding(
            padding: const EdgeInsets.only(top: 10.0, bottom: 4.0),
            child: Text(
              trimmed.replaceFirst('#### ', ''),
              style: commonTextStyle.copyWith(
                fontSize: 14,
                fontWeight: FontWeight.bold,
                color: const Color(0xFF334155),
              ),
            ),
          ),
        );
      } else if (trimmed.startsWith('- ')) {
        // Bullet Point Card - extremely beautiful glassmorphic visual card
        final bulletText = trimmed.replaceFirst('- ', '');
        widgets.add(
          Container(
            width: double.infinity,
            margin: const EdgeInsets.only(bottom: 8.0),
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFF1F5F9)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Padding(
                  padding: EdgeInsets.only(top: 2.0),
                  child: Icon(
                    Icons.verified_user_rounded,
                    color: Constants.primaryBlueColour,
                    size: 14,
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    bulletText,
                    style: commonTextStyle.copyWith(
                      fontSize: 12.5,
                      color: const Color(0xFF334155),
                      height: 1.35,
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      } else {
        // Paragraph Text
        widgets.add(
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 4.0),
            child: Text(
              trimmed,
              style: commonTextStyle.copyWith(
                fontSize: 13,
                color: const Color(0xFF475569),
                height: 1.45,
              ),
            ),
          ),
        );
      }
    }

    return widgets;
  }

  String _getCategoryMr(String key) {
    switch (key.toLowerCase()) {
      case 'national':
        return 'राष्ट्रीय';
      case 'maharashtra':
        return 'महाराष्ट्र';
      case 'sports':
        return 'क्रीडा';
      case 'defense':
        return 'संरक्षण';
      case 'awards':
        return 'पुरस्कार';
      default:
        return key;
    }
  }
}
