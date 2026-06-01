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
  String? description;
  String? category;
  String? type;
  List<Questions>? questions;
  String? createdAt;
  int? timeLimit;

  QuizzListData(
      {this.id,
      this.title,
      this.description,
      this.category,
      this.type,
      this.questions,
      this.createdAt,
      this.timeLimit});

  QuizzListData.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    title = json['title'];
    description = json['description'];
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
    data['description'] = this.description;
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
  List<String>? options;
  String? correctAnswer;

  Questions({this.id, this.text, this.options, this.correctAnswer});

  Questions.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    text = json['text'];
    options = json['options'].cast<String>();
    correctAnswer = json['correctAnswer'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['text'] = this.text;
    data['options'] = this.options;
    data['correctAnswer'] = this.correctAnswer;
    return data;
  }
}
