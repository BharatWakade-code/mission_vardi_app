import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';
import 'package:edusaas/models/home_module/get_pdf_answers_response.dart';
import 'package:edusaas/screens/vardi_home_module/data/home_repository.dart';

part 'vardi_home_state.dart';

@injectable
class VardiHomeCubit extends Cubit<VardiHomeState> {
  VardiHomeCubit(this._repository) : super( VardiHomeState());

  final HomeRepository _repository;

  Future<void> getHomeDashboardData() async {
    emit(state.copyWith(isLoading: true, errorMsg: '', successMsg: ''));
    final either = await _repository.getHomeDashboard();
    either.fold(
      (error) {
        emit(state.copyWith(isLoading: false, errorMsg: error.toString()));
      },
      (data) {
        List<PdfNoteModel> notes = [];
        if (data['notes'] != null) {
          data['notes'].forEach((v) {
            notes.add(PdfNoteModel.fromJson(v));
          });
        }
        
        emit(state.copyWith(
          isLoading: false,
          isSuccess: true,
          data: notes,
          alerts: data['alerts'] ?? [],
          dailyQuotes: data['daily_quotes'] ?? [],
          countdown: data['countdown'],
        ));
      }
    );
  }

  Future<void> getGlobalData() async {
    final either = await _repository.getGlobalData();
    either.fold(
      (error) => print("getGlobalData error: $error"),
      (data) {
        emit(state.copyWith(
          leaderboard: data['leaderboard']
        ));
      }
    );
  }
}
