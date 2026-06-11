import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/screens/admin_module/admin_state.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

@injectable
class AdminCubit extends Cubit<AdminState> {
  AdminCubit() : super(AdminState());

  void clearMessage() {
    emit(state.copyWith(message: '', isSuccess: false));
  }

  // ---------------- FETCH OPERATIONS ---------------- //

  Future<void> fetchItems(String endpoint) async {
    emit(state.copyWith(isLoading: true, message: '', items: []));
    try {
      final res = await NetworkServices().getApi(endpoint);
      if (res.data['status'] == true) {
        emit(state.copyWith(
          isLoading: false,
          items: res.data['data'] ?? [],
        ));
      } else {
        emit(state.copyWith(
          isLoading: false,
          message: "Failed to fetch: ${res.data['message']}",
        ));
      }
    } catch (e) {
      emit(state.copyWith(isLoading: false, message: e.toString()));
    }
  }

  // ---------------- DELETE OPERATIONS ---------------- //

  Future<void> deleteItem(String endpoint, String fetchEndpoint) async {
    emit(state.copyWith(isLoading: true, message: ''));
    try {
      final res = await NetworkServices().deleteApi(endpoint);
      if (res.data['status'] == true) {
        emit(state.copyWith(
          isLoading: false,
          isSuccess: true,
          message: "Deleted successfully!",
        ));
        fetchItems(fetchEndpoint); // Refresh list
      } else {
        emit(state.copyWith(
          isLoading: false,
          isSuccess: false,
          message: "Delete failed: ${res.data['message']}",
        ));
      }
    } catch (e) {
      emit(state.copyWith(isLoading: false, isSuccess: false, message: e.toString()));
    }
  }

  // ---------------- CREATE OPERATIONS ---------------- //

  Future<void> createNote({
    required String title,
    required String description,
    required String category,
    required String subject,
    required String pdfUrl,
    required String content,
  }) async {
    _createGeneric('/notes', {
      "title": title,
      "description": description,
      "category": category.isEmpty ? "General" : category,
      "subject": subject.isEmpty ? "General" : subject,
      "pdfUrl": pdfUrl.isEmpty ? null : pdfUrl,
      "content": content.isEmpty ? null : content,
    }, '/notes');
  }

  Future<void> createPYQ({
    required String title,
    required int year,
    required String category,
    required String pdfUrl,
  }) async {
    _createGeneric('/pyqs', {
      "title": title,
      "year": year,
      "category": category,
      "pdfUrl": pdfUrl.isEmpty ? null : pdfUrl,
    }, '/pyqs');
  }

  Future<void> createNotification({
    required String title,
    required String body,
    required String imageUrl,
  }) async {
    _createGeneric('/notifications', {
      "title": title,
      "body": body,
      "imageUrl": imageUrl.isEmpty ? null : imageUrl,
    }, '/notifications');
  }

  Future<void> createQuiz({
    required String title,
    required String description,
    required String category,
    required String type,
    required String jsonQuestions,
  }) async {
    emit(state.copyWith(isLoading: true, message: ''));
    try {
      List<dynamic> questionsList = [];
      if (jsonQuestions.isNotEmpty) {
         questionsList = jsonDecode(jsonQuestions);
      }
      
      final body = {
        "title": title,
        "description": description,
        "category": category,
        "type": type,
        "questions": questionsList
      };

      final res = await NetworkServices().postApi('/quiz', body);
      if (res.data['status'] == true) {
        emit(state.copyWith(
          isLoading: false,
          isSuccess: true,
          message: "Quiz created successfully!",
        ));
        fetchItems('/quiz');
      } else {
        emit(state.copyWith(
          isLoading: false,
          isSuccess: false,
          message: "Failed: ${res.data['message']}",
        ));
      }
    } catch (e) {
      emit(state.copyWith(isLoading: false, isSuccess: false, message: "Invalid JSON or Error: $e"));
    }
  }

  Future<void> _createGeneric(String endpoint, Map<String, dynamic> body, String fetchEndpoint) async {
    emit(state.copyWith(isLoading: true, message: ''));
    try {
      final res = await NetworkServices().postApi(endpoint, body);
      if (res.data['status'] == true) {
        emit(state.copyWith(
          isLoading: false,
          isSuccess: true,
          message: "Created successfully!",
        ));
        fetchItems(fetchEndpoint);
      } else {
        emit(state.copyWith(
          isLoading: false,
          isSuccess: false,
          message: "Failed: ${res.data['message']}",
        ));
      }
    } catch (e) {
      emit(state.copyWith(isLoading: false, isSuccess: false, message: e.toString()));
    }
  }
}
