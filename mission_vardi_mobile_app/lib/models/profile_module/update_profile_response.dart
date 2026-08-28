class ProfileUpdateResponse {
  bool? status;
  String? message;
  String? responseTimestamp;

  ProfileUpdateResponse({this.status, this.message, this.responseTimestamp});

  ProfileUpdateResponse.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    message = json['message'];
    responseTimestamp = json['responseTimestamp'];
  }
}
