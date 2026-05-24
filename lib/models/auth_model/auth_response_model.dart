
class AuthResponseModel {
  bool? status;
  String? message;
  AuthData? data;

  AuthResponseModel({this.status, this.message, this.data});

  AuthResponseModel.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    message = json['message'];
    data = json['data'] != null ? new AuthData.fromJson(json['data']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    return data;
  }
}

class AuthData {
  String? accessToken;
  String? tokenType;
  User? user;

  AuthData({this.accessToken, this.tokenType, this.user});

  AuthData.fromJson(Map<String, dynamic> json) {
    accessToken = json['access_token'];
    tokenType = json['token_type'];
    user = json['user'] != null ? new User.fromJson(json['user']) : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['access_token'] = this.accessToken;
    data['token_type'] = this.tokenType;
    if (this.user != null) {
      data['user'] = this.user!.toJson();
    }
    return data;
  }
}

class User {
  String? id;
  String? name;
  String? email;
  String? mobile;
  String? district;
  String? authProvider;
  String? googleId;
  String? avatarUrl;
  String? bio;
  String? targetExam;
  int? studyGoalMinutes;
  bool? isVerified;
  String? createdAt;
  Map<String, dynamic>? stats;

  User(
      {this.id,
      this.name,
      this.email,
      this.mobile,
      this.district,
      this.authProvider,
      this.googleId,
      this.avatarUrl,
      this.bio,
      this.targetExam,
      this.studyGoalMinutes,
      this.isVerified,
      this.createdAt,
      this.stats});

  User.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    email = json['email'];
    mobile = json['mobile'];
    district = json['district'];
    authProvider = json['auth_provider'];
    googleId = json['google_id'];
    avatarUrl = json['avatar_url'];
    bio = json['bio'];
    targetExam = json['target_exam'];
    studyGoalMinutes = json['study_goal_minutes'];
    isVerified = json['is_verified'];
    createdAt = json['createdAt'];
    stats = json['stats'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['email'] = this.email;
    data['mobile'] = this.mobile;
    data['district'] = this.district;
    data['auth_provider'] = this.authProvider;
    data['google_id'] = this.googleId;
    data['avatar_url'] = this.avatarUrl;
    data['bio'] = this.bio;
    data['target_exam'] = this.targetExam;
    data['study_goal_minutes'] = this.studyGoalMinutes;
    data['is_verified'] = this.isVerified;
    data['createdAt'] = this.createdAt;
    if (this.stats != null) {
      data['stats'] = this.stats;
    }
    return data;
  }
}
