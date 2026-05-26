class CurrentAffairsModel {
  final String id;
  final String titleEn;
  final String titleMr;
  final String descriptionEn;
  final String descriptionMr;
  final String contentEn;
  final String contentMr;
  final String category;
  final String? imageUrl;
  final String? pdfUrl;
  final String publishedDate;
  final bool isTrending;
  final String createdAt;

  // Dynamic practice quiz attributes
  final String? quizQEn;
  final String? quizQMr;
  final List<String>? quizOptionsEn;
  final List<String>? quizOptionsMr;
  final int? quizCorrect;
  final String? quizExpEn;
  final String? quizExpMr;

  CurrentAffairsModel({
    required this.id,
    required this.titleEn,
    required this.titleMr,
    required this.descriptionEn,
    required this.descriptionMr,
    required this.contentEn,
    required this.contentMr,
    required this.category,
    this.imageUrl,
    this.pdfUrl,
    required this.publishedDate,
    required this.isTrending,
    required this.createdAt,
    this.quizQEn,
    this.quizQMr,
    this.quizOptionsEn,
    this.quizOptionsMr,
    this.quizCorrect,
    this.quizExpEn,
    this.quizExpMr,
  });

  factory CurrentAffairsModel.fromJson(Map<String, dynamic> json) {
    return CurrentAffairsModel(
      id: json['id'] ?? '',
      titleEn: json['title_en'] ?? '',
      titleMr: json['title_mr'] ?? '',
      descriptionEn: json['description_en'] ?? '',
      descriptionMr: json['description_mr'] ?? '',
      contentEn: json['content_en'] ?? '',
      contentMr: json['content_mr'] ?? '',
      category: json['category'] ?? '',
      imageUrl: json['imageUrl'],
      pdfUrl: json['pdfUrl'],
      publishedDate: json['publishedDate'] ?? '',
      isTrending: json['isTrending'] ?? false,
      createdAt: json['createdAt'] ?? '',
      quizQEn: json['quizQEn'],
      quizQMr: json['quizQMr'],
      quizOptionsEn: json['quizOptionsEn'] != null
          ? List<String>.from(json['quizOptionsEn'])
          : null,
      quizOptionsMr: json['quizOptionsMr'] != null
          ? List<String>.from(json['quizOptionsMr'])
          : null,
      quizCorrect: json['quizCorrect'],
      quizExpEn: json['quizExpEn'],
      quizExpMr: json['quizExpMr'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title_en': titleEn,
      'title_mr': titleMr,
      'description_en': descriptionEn,
      'description_mr': descriptionMr,
      'content_en': contentEn,
      'content_mr': contentMr,
      'category': category,
      'imageUrl': imageUrl,
      'pdfUrl': pdfUrl,
      'publishedDate': publishedDate,
      'isTrending': isTrending,
      'createdAt': createdAt,
      'quizQEn': quizQEn,
      'quizQMr': quizQMr,
      'quizOptionsEn': quizOptionsEn,
      'quizOptionsMr': quizOptionsMr,
      'quizCorrect': quizCorrect,
      'quizExpEn': quizExpEn,
      'quizExpMr': quizExpMr,
    };
  }
}
