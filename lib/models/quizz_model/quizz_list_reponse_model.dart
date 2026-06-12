class QuizzListResponseModel {
  bool? status;
  String? message;
  List<QuizzListData>? data;

  QuizzListResponseModel({this.status, this.message, this.data});

  QuizzListResponseModel.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    message = json['message'];
    if (json['data'] != null) {
      data = <QuizzListData>[];
      json['data'].forEach((v) {
        data!.add(new QuizzListData.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class QuizzListData {
  String? id;
  String? title;
  String? titleMr;
  String? description;
  String? descriptionMr;
  String? category;
  String? type;
  List<Questions>? questions;
  String? createdAt;
  int? timeLimit;

  QuizzListData(
      {this.id,
      this.title,
      this.titleMr,
      this.description,
      this.descriptionMr,
      this.category,
      this.type,
      this.questions,
      this.createdAt,
      this.timeLimit});

  String getLocalizedTitle(String langCode) {
    if (langCode == 'mr' && titleMr != null && titleMr!.isNotEmpty) return titleMr!;
    return title ?? '';
  }

  String getLocalizedDescription(String langCode) {
    if (langCode == 'mr' && descriptionMr != null && descriptionMr!.isNotEmpty) return descriptionMr!;
    return description ?? '';
  }

  QuizzListData.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    title = json['title'];
    titleMr = json['title_mr'];
    description = json['description'];
    descriptionMr = json['description_mr'];
    category = json['category'];
    type = json['type'];
    if (json['questions'] != null) {
      questions = <Questions>[];
      json['questions'].forEach((v) {
        questions!.add(new Questions.fromJson(v));
      });
    }
    createdAt = json['createdAt'];
    timeLimit = json['timeLimit'] ?? json['time_limit'] ?? json['duration'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['title'] = this.title;
    data['title_mr'] = this.titleMr;
    data['description'] = this.description;
    data['description_mr'] = this.descriptionMr;
    data['category'] = this.category;
    data['type'] = this.type;
    if (this.questions != null) {
      data['questions'] = this.questions!.map((v) => v.toJson()).toList();
    }
    data['createdAt'] = this.createdAt;
    data['timeLimit'] = this.timeLimit;
    return data;
  }
}

class Questions {
  String? id;
  String? text;
  String? textMr;
  List<String>? options;
  List<String>? optionsMr;
  String? correctAnswer;

  Questions({this.id, this.text, this.textMr, this.options, this.optionsMr, this.correctAnswer});

  String getLocalizedText(String langCode) {
    if (langCode == 'mr' && textMr != null && textMr!.isNotEmpty) return textMr!;
    return text ?? '';
  }

  List<String> getLocalizedOptions(String langCode) {
    if (langCode == 'mr' && optionsMr != null && optionsMr!.isNotEmpty) return optionsMr!;
    return options ?? [];
  }

  Questions.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    text = json['text'];
    textMr = json['text_mr'];
    options = json['options']?.cast<String>();
    optionsMr = json['options_mr']?.cast<String>();
    correctAnswer = json['correctAnswer'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['text'] = this.text;
    data['text_mr'] = this.textMr;
    data['options'] = this.options;
    data['options_mr'] = this.optionsMr;
    data['correctAnswer'] = this.correctAnswer;
    return data;
  }
}
