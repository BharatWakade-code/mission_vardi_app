import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_pdfview/flutter_pdfview.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:path_provider/path_provider.dart';

enum ReadingTheme {
  light,
  sepia,
  eyeComfort,
  dark,
}

class PdfViewerScreen extends StatefulWidget {
  final String pdfUrl;
  final String title;
  final String description;

  const PdfViewerScreen({
    super.key,
    required this.pdfUrl,
    required this.title,
    required this.description,
  });

  @override
  State<PdfViewerScreen> createState() => _PdfViewerScreenState();
}

class _PdfViewerScreenState extends State<PdfViewerScreen> {
  // PDF
  String? _localPdfPath;
  bool _isLoading = true;
  String _loadingProgress = "0%";
  String? _errorMessage;

  // PDF Controller
  PDFViewController? _pdfController;

  // Pages
  int _currentPage = 0;
  int _totalPages = 0;

  // Theme
  ReadingTheme _activeTheme = ReadingTheme.light;

  // Bookmark
  bool _isBookmarked = false;

  // Notes
  final TextEditingController _notesController =
      TextEditingController();

  String _savedNotes = "";

  @override
  void initState() {
    super.initState();
    _initializePdf();
  }

  @override
  void dispose() {
    _pdfController = null;
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _initializePdf() async {
    if (!mounted) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
      _loadingProgress = "0%";
    });

    try {
      final url = widget.pdfUrl.trim();

      if (url.isEmpty) {
        throw Exception("Invalid PDF URL");
      }

      final uri = Uri.parse(url);

      String fileName = uri.pathSegments.isNotEmpty
          ? uri.pathSegments.last
          : "document_${DateTime.now().millisecondsSinceEpoch}.pdf";

      if (!fileName.endsWith(".pdf")) {
        fileName = "$fileName.pdf";
      }

      final directory = await getTemporaryDirectory();

      final filePath = "${directory.path}/$fileName";

      final file = File(filePath);

      // Use Cached File
      if (await file.exists()) {
        final size = await file.length();

        if (size > 1000) {
          if (!mounted) return;

          setState(() {
            _localPdfPath = filePath;
            _isLoading = false;
          });

          return;
        } else {
          await file.delete();
        }
      }

      final dio = Dio(
        BaseOptions(
          connectTimeout: const Duration(seconds: 20),
          receiveTimeout: const Duration(seconds: 20),
          sendTimeout: const Duration(seconds: 20),
        ),
      );

      await dio.download(
        url,
        filePath,
        deleteOnError: true,
        onReceiveProgress: (received, total) {
          if (!mounted) return;

          if (total > 0) {
            final progress =
                ((received / total) * 100).toStringAsFixed(0);

            setState(() {
              _loadingProgress = "$progress%";
            });
          }
        },
      );

      final downloadedFile = File(filePath);

      if (!await downloadedFile.exists()) {
        throw Exception("PDF not found");
      }

      final downloadedSize = await downloadedFile.length();

      if (downloadedSize < 1000) {
        await downloadedFile.delete();

        throw Exception("Corrupted PDF file");
      }

      if (!mounted) return;

      setState(() {
        _localPdfPath = filePath;
        _isLoading = false;
      });
    } on DioException catch (e) {
      if (!mounted) return;

      String message = "Failed to load PDF";

      switch (e.type) {
        case DioExceptionType.connectionTimeout:
          message = "Connection timeout";
          break;

        case DioExceptionType.receiveTimeout:
          message = "Server taking too long";
          break;

        case DioExceptionType.connectionError:
          message = "No internet connection";
          break;

        default:
          message = "Unable to open study material";
      }

      setState(() {
        _isLoading = false;
        _errorMessage = message;
      });
    } catch (e) {
      if (!mounted) return;

      setState(() {
        _isLoading = false;
        _errorMessage = e.toString();
      });
    }
  }

  Color _getBackgroundColor() {
    switch (_activeTheme) {
      case ReadingTheme.light:
        return const Color(0xFFF8FAFC);

      case ReadingTheme.sepia:
        return const Color(0xFFF4ECD8);

      case ReadingTheme.eyeComfort:
        return const Color(0xFFE8F5E9);

      case ReadingTheme.dark:
        return const Color(0xFF0F172A);
    }
  }

  Color _getTextColor() {
    switch (_activeTheme) {
      case ReadingTheme.light:
        return const Color(0xFF1E293B);

      case ReadingTheme.sepia:
        return const Color(0xFF4A3B32);

      case ReadingTheme.eyeComfort:
        return const Color(0xFF1B5E20);

      case ReadingTheme.dark:
        return const Color(0xFFF1F5F9);
    }
  }

  Color _getCardColor() {
    switch (_activeTheme) {
      case ReadingTheme.light:
        return Colors.white;

      case ReadingTheme.sepia:
        return const Color(0xFFEFE5CD);

      case ReadingTheme.eyeComfort:
        return const Color(0xFFC8E6C9);

      case ReadingTheme.dark:
        return const Color(0xFF1E293B);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bgColor = _getBackgroundColor();
    final textColor = _getTextColor();

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: bgColor,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back_ios,
            color: textColor,
          ),
          onPressed: () {
            Navigator.pop(context);
          },
        ),
        titleSpacing: 0,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.title,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: GoogleFonts.outfit(
                fontSize: 15,
                fontWeight: FontWeight.w700,
                color: textColor,
              ),
            ),
            if (_totalPages > 0)
              Text(
                "Page ${_currentPage + 1} of $_totalPages",
                style: GoogleFonts.outfit(
                  fontSize: 11,
                  color: textColor.withOpacity(0.6),
                ),
              ),
          ],
        ),
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                _isBookmarked = !_isBookmarked;
              });

              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    _isBookmarked
                        ? "Bookmarked"
                        : "Bookmark removed",
                  ),
                ),
              );
            },
            icon: Icon(
              _isBookmarked
                  ? Icons.bookmark
                  : Icons.bookmark_border,
              color: _isBookmarked
                  ? Colors.amber
                  : textColor,
            ),
          ),
          IconButton(
            onPressed: _showThemeSelector,
            icon: Icon(
              Icons.palette_outlined,
              color: textColor,
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: _buildBody(textColor),
      ),
    );
  }

  Widget _buildBody(Color textColor) {
    if (_isLoading) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 70,
              height: 70,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const CircularProgressIndicator(
                    strokeWidth: 4,
                  ),
                  Text(
                    _loadingProgress,
                    style: GoogleFonts.outfit(
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text(
              "Loading PDF...",
              style: GoogleFonts.outfit(
                color: textColor.withOpacity(0.7),
              ),
            ),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.picture_as_pdf_outlined,
                size: 70,
                color: Colors.red.shade300,
              ),
              const SizedBox(height: 20),
              Text(
                _errorMessage!,
                textAlign: TextAlign.center,
                style: GoogleFonts.outfit(
                  fontSize: 14,
                  color: textColor,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _initializePdf,
                child: const Text("Retry"),
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      children: [
        Expanded(
          child: Container(
            margin: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: _getCardColor(),
              borderRadius: BorderRadius.circular(16),
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: _localPdfPath == null
                  ? const Center(
                      child: CircularProgressIndicator(),
                    )
                  : PDFView(
                      key: ValueKey(_localPdfPath),
                      filePath: _localPdfPath!,
                      enableSwipe: true,
                      swipeHorizontal: false,
                      autoSpacing: true,
                      pageFling: true,
                      pageSnap: true,
                      fitPolicy: FitPolicy.BOTH,
                      nightMode:
                          _activeTheme == ReadingTheme.dark,

                      onRender: (pages) {
                        if (!mounted) return;

                        setState(() {
                          _totalPages = pages ?? 0;
                        });
                      },

                      onViewCreated:
                          (PDFViewController controller) {
                        _pdfController = controller;
                      },

                      onPageChanged: (page, total) {
                        if (!mounted) return;

                        setState(() {
                          _currentPage = page ?? 0;
                          _totalPages = total ?? 0;
                        });
                      },

                      onError: (error) {
                        debugPrint(error.toString());

                        if (!mounted) return;

                        setState(() {
                          _errorMessage =
                              "Unable to render PDF";
                        });
                      },

                      onPageError: (page, error) {
                        debugPrint(
                          "Page Error => $page : $error",
                        );
                      },
                    ),
            ),
          ),
        ),

        // Bottom Controls
        if (_totalPages > 0)
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _getCardColor(),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(24),
              ),
            ),
            child: Column(
              children: [
                Slider(
                  value: _currentPage.toDouble(),
                  min: 0,
                  max: (_totalPages > 0
                      ? (_totalPages - 1).toDouble()
                      : 1),

                  divisions: _totalPages > 1
                      ? _totalPages - 1
                      : 1,

                  onChanged: (value) async {
                    final page = value.toInt();

                    setState(() {
                      _currentPage = page;
                    });

                    await _pdfController?.setPage(page);
                  },
                ),

                Row(
                  children: [
                    IconButton(
                      onPressed: _currentPage > 0
                          ? () async {
                              final page =
                                  _currentPage - 1;

                              await _pdfController
                                  ?.setPage(page);
                            }
                          : null,
                      icon: const Icon(
                        Icons.arrow_back_ios,
                      ),
                    ),
                    Expanded(
                      child: Center(
                        child: Text(
                          "Page ${_currentPage + 1} / $_totalPages",
                          style: GoogleFonts.outfit(
                            fontWeight: FontWeight.w600,
                            color: textColor,
                          ),
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed:
                          _currentPage <
                                  (_totalPages - 1)
                              ? () async {
                                  final page =
                                      _currentPage + 1;

                                  await _pdfController
                                      ?.setPage(page);
                                }
                              : null,
                      icon: const Icon(
                        Icons.arrow_forward_ios,
                      ),
                    ),
                    const SizedBox(width: 10),
                    ElevatedButton.icon(
                      onPressed:
                          _showNotesBottomSheet,
                      icon: const Icon(
                        Icons.edit_note,
                      ),
                      label: const Text("Notes"),
                    ),
                  ],
                ),
              ],
            ),
          ),
      ],
    );
  }

  void _showThemeSelector() {
    showDialog(
      context: context,
      builder: (_) {
        return AlertDialog(
          backgroundColor: _getBackgroundColor(),
          title: Text(
            "Reading Theme",
            style: GoogleFonts.outfit(
              color: _getTextColor(),
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: ReadingTheme.values.map((theme) {
              String label = "";

              switch (theme) {
                case ReadingTheme.light:
                  label = "Light";
                  break;

                case ReadingTheme.sepia:
                  label = "Sepia";
                  break;

                case ReadingTheme.eyeComfort:
                  label = "Eye Comfort";
                  break;

                case ReadingTheme.dark:
                  label = "Dark";
                  break;
              }

              return ListTile(
                title: Text(
                  label,
                  style: GoogleFonts.outfit(
                    color: _getTextColor(),
                  ),
                ),
                onTap: () {
                  setState(() {
                    _activeTheme = theme;
                  });

                  Navigator.pop(context);
                },
              );
            }).toList(),
          ),
        );
      },
    );
  }

  void _showNotesBottomSheet() {
    _notesController.text = _savedNotes;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: _getBackgroundColor(),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(
          top: Radius.circular(24),
        ),
      ),
      builder: (_) {
        final textColor = _getTextColor();

        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom:
                MediaQuery.of(context).viewInsets.bottom +
                    20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                "Quick Notes",
                style: GoogleFonts.outfit(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: _notesController,
                maxLines: 6,
                style: GoogleFonts.outfit(
                  color: textColor,
                ),
                decoration: InputDecoration(
                  hintText: "Write notes here...",
                  border: OutlineInputBorder(
                    borderRadius:
                        BorderRadius.circular(14),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: () {
                  setState(() {
                    _savedNotes =
                        _notesController.text;
                  });

                  Navigator.pop(context);

                  ScaffoldMessenger.of(context)
                      .showSnackBar(
                    const SnackBar(
                      content: Text(
                        "Notes saved",
                      ),
                    ),
                  );
                },
                child: const Text("Save Notes"),
              ),
            ],
          ),
        );
      },
    );
  }
}