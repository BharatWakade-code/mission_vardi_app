class GetPdfNotesResponseModel {
  bool? status;
  String? message;
  List<PdfNoteModel>? data;

  GetPdfNotesResponseModel({this.status, this.message, this.data});

  GetPdfNotesResponseModel.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    message = json['message'];
    if (json['data'] != null) {
      data = <PdfNoteModel>[];
      json['data'].forEach((v) {
        data!.add(new PdfNoteModel.fromJson(v));
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

class PdfNoteModel {
  String? id;
  String? title;
  String? description;
  String? pdfUrl;
  String? category;
  String? createdAt;

  PdfNoteModel(
      {this.id,
      this.title,
      this.description,
      this.pdfUrl,
      this.category,
      this.createdAt});

  PdfNoteModel.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    title = json['title'];
    description = json['description'];
    pdfUrl = json['pdfUrl'];
    category = json['category'];
    createdAt = json['createdAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['title'] = this.title;
    data['description'] = this.description;
    data['pdfUrl'] = this.pdfUrl;
    data['category'] = this.category;
    data['createdAt'] = this.createdAt;
    return data;
  }
}
