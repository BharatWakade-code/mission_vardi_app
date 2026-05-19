class GetUserByIdResponse {
  bool? status;
  String? message;
  UserData? data;
  String? responseTimestamp;

  GetUserByIdResponse(
      {this.status, this.message, this.data, this.responseTimestamp});

  GetUserByIdResponse.fromJson(Map<String, dynamic> json) {
    status = json['status'];
    message = json['message'];
    data = json['data'] != null ? new UserData.fromJson(json['data']) : null;
    responseTimestamp = json['responseTimestamp'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['status'] = this.status;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.toJson();
    }
    data['responseTimestamp'] = this.responseTimestamp;
    return data;
  }
}

class UserData {
  String? sId;
  String? firstName;
  String? lastName;
  String? fullName;
  String? phone;
  String? preferredLanguage;
  ProfileImage? profileImage;
  String? status;
  List<Addresses>? addresses;
  Addresses? defaultAddress;
  ProviderProfile? providerProfile;
  List<String>? role; // Add this line

  UserData(
      {this.sId,
        this.firstName,
        this.lastName,
        this.fullName,
        this.phone,
        this.preferredLanguage,
        this.profileImage,
        this.status,
        this.addresses,
        this.defaultAddress,
        this.providerProfile,
        this.role}); // Add this parameter

  UserData.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    fullName = json['fullName'];
    phone = json['phone'];
    preferredLanguage = json['preferredLanguage'];
    profileImage = json['profileImage'] != null
        ? new ProfileImage.fromJson(json['profileImage'])
        : null;
    status = json['status'];
    if (json['addresses'] != null) {
      addresses = <Addresses>[];
      json['addresses'].forEach((v) {
        addresses!.add(new Addresses.fromJson(v));
      });
    }
    defaultAddress = json['defaultAddress'] != null
        ? new Addresses.fromJson(json['defaultAddress'])
        : null;
    providerProfile = json['providerProfile'] != null
        ? new ProviderProfile.fromJson(json['providerProfile'])
        : null;
    role = json['role'] != null ? List<String>.from(json['role']) : null; // Add this line
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['fullName'] = this.fullName;
    data['phone'] = this.phone;
    data['preferredLanguage'] = this.preferredLanguage;
    if (this.profileImage != null) {
      data['profileImage'] = this.profileImage!.toJson();
    }
    data['status'] = this.status;
    if (this.addresses != null) {
      data['addresses'] = this.addresses!.map((v) => v.toJson()).toList();
    }
    if (this.defaultAddress != null) {
      data['defaultAddress'] = this.defaultAddress!.toJson();
    }
    if (this.providerProfile != null) {
      data['providerProfile'] = this.providerProfile!.toJson();
    }
    if (this.role != null) {
      data['role'] = this.role; // Add this line
    }
    return data;
  }
}

class ProfileImage {
  String? sId;
  String? path;

  ProfileImage({this.sId, this.path});

  ProfileImage.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    path = json['path'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['path'] = this.path;
    return data;
  }
}

class Addresses {
  String? sId;
  String? label;
  String? addressline;
  String? village;
  String? locality;
  String? district;
  String? state;
  String? pincode;
  bool? isDefault;
  String? status;

  Addresses(
      {this.sId,
        this.label,
        this.addressline,
        this.village,
        this.locality,
        this.district,
        this.state,
        this.pincode,
        this.isDefault,
        this.status});

  Addresses.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    label = json['label'];
    addressline = json['addressline'];
    village = json['village'];
    locality = json['locality'];
    district = json['district'];
    state = json['state'];
    pincode = json['pincode'];
    isDefault = json['isDefault'];
    status = json['status'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['label'] = this.label;
    data['addressline'] = this.addressline;
    data['village'] = this.village;
    data['locality'] = this.locality;
    data['district'] = this.district;
    data['state'] = this.state;
    data['pincode'] = this.pincode;
    data['isDefault'] = this.isDefault;
    data['status'] = this.status;
    return data;
  }
}

class ProviderProfile {
  String? sId;
  List<ServiceCategories>? serviceCategories;
  String? kycStatus;
  int? serviceRadiusKm;
  int? ratingAverage;
  int? totalBookings;
  String? status;
  List<Documents>? documents;
  List<Equipment>? equipment;
  List<Rates>? rates;
  List<Availability>? availability;

  ProviderProfile(
      {this.sId,
        this.serviceCategories,
        this.kycStatus,
        this.serviceRadiusKm,
        this.ratingAverage,
        this.totalBookings,
        this.status,
        this.documents,
        this.equipment,
        this.rates,
        this.availability});

  ProviderProfile.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    if (json['serviceCategories'] != null) {
      serviceCategories = <ServiceCategories>[];
      json['serviceCategories'].forEach((v) {
        serviceCategories!.add(new ServiceCategories.fromJson(v));
      });
    }
    kycStatus = json['kycStatus'];
    serviceRadiusKm = json['serviceRadiusKm'];
    ratingAverage = json['ratingAverage'];
    totalBookings = json['totalBookings'];
    status = json['status'];
    if (json['documents'] != null) {
      documents = <Documents>[];
      json['documents'].forEach((v) {
        documents!.add(new Documents.fromJson(v));
      });
    }
    if (json['equipment'] != null) {
      equipment = <Equipment>[];
      json['equipment'].forEach((v) {
        equipment!.add(new Equipment.fromJson(v));
      });
    }
    if (json['rates'] != null) {
      rates = <Rates>[];
      json['rates'].forEach((v) {
        rates!.add(new Rates.fromJson(v));
      });
    }
    if (json['availability'] != null) {
      availability = <Availability>[];
      json['availability'].forEach((v) {
        availability!.add(new Availability.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    if (this.serviceCategories != null) {
      data['serviceCategories'] =
          this.serviceCategories!.map((v) => v.toJson()).toList();
    }
    data['kycStatus'] = this.kycStatus;
    data['serviceRadiusKm'] = this.serviceRadiusKm;
    data['ratingAverage'] = this.ratingAverage;
    data['totalBookings'] = this.totalBookings;
    data['status'] = this.status;
    if (this.documents != null) {
      data['documents'] = this.documents!.map((v) => v.toJson()).toList();
    }
    if (this.equipment != null) {
      data['equipment'] = this.equipment!.map((v) => v.toJson()).toList();
    }
    if (this.rates != null) {
      data['rates'] = this.rates!.map((v) => v.toJson()).toList();
    }
    if (this.availability != null) {
      data['availability'] = this.availability!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class ServiceCategories {
  String? sId;
  String? name;

  ServiceCategories({this.sId, this.name});

  ServiceCategories.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    return data;
  }
}

class Documents {
  String? sId;
  String? documentType;
  ProfileImage? documentFile;

  Documents({this.sId, this.documentType, this.documentFile});

  Documents.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    documentType = json['documentType'];
    documentFile = json['documentFile'] != null
        ? new ProfileImage.fromJson(json['documentFile'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['documentType'] = this.documentType;
    if (this.documentFile != null) {
      data['documentFile'] = this.documentFile!.toJson();
    }
    return data;
  }
}

class Equipment {
  String? sId;
  List<Implement>? implement;

  Equipment({this.sId, this.implement});

  Equipment.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    if (json['implement'] != null) {
      implement = <Implement>[];
      json['implement'].forEach((v) {
        implement!.add(new Implement.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    if (this.implement != null) {
      data['implement'] = this.implement!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Implement {
  String? sId;
  String? name;
  String? type;
  String? workingWidth;

  Implement({this.sId, this.name, this.type, this.workingWidth});

  Implement.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    name = json['name'];
    type = json['type'];
    workingWidth = json['workingWidth'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['name'] = this.name;
    data['type'] = this.type;
    data['workingWidth'] = this.workingWidth;
    return data;
  }
}

class Rates {
  String? sId;
  int? rate;
  int? basePrice;
  ServiceCategories? serviceCategory;
  ServiceCategories? crop;
  ServiceCategories? rateType;

  Rates(
      {this.sId,
        this.rate,
        this.basePrice,
        this.serviceCategory,
        this.crop,
        this.rateType});

  Rates.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    rate = json['rate'];
    basePrice = json['basePrice'];
    serviceCategory = json['serviceCategory'] != null
        ? new ServiceCategories.fromJson(json['serviceCategory'])
        : null;
    crop = json['crop'] != null
        ? new ServiceCategories.fromJson(json['crop'])
        : null;
    rateType = json['rateType'] != null
        ? new ServiceCategories.fromJson(json['rateType'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['rate'] = this.rate;
    data['basePrice'] = this.basePrice;
    if (this.serviceCategory != null) {
      data['serviceCategory'] = this.serviceCategory!.toJson();
    }
    if (this.crop != null) {
      data['crop'] = this.crop!.toJson();
    }
    if (this.rateType != null) {
      data['rateType'] = this.rateType!.toJson();
    }
    return data;
  }
}

class Availability {
  String? sId;
  bool? friday;
  bool? monday;
  bool? saturday;
  bool? sunday;
  bool? thursday;
  bool? tuesday;
  bool? wednesday;

  Availability(
      {this.sId,
        this.friday,
        this.monday,
        this.saturday,
        this.sunday,
        this.thursday,
        this.tuesday,
        this.wednesday});

  Availability.fromJson(Map<String, dynamic> json) {
    sId = json['_id'];
    friday = json['friday'];
    monday = json['monday'];
    saturday = json['saturday'];
    sunday = json['sunday'];
    thursday = json['thursday'];
    tuesday = json['tuesday'];
    wednesday = json['wednesday'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['_id'] = this.sId;
    data['friday'] = this.friday;
    data['monday'] = this.monday;
    data['saturday'] = this.saturday;
    data['sunday'] = this.sunday;
    data['thursday'] = this.thursday;
    data['tuesday'] = this.tuesday;
    data['wednesday'] = this.wednesday;
    return data;
  }
}
