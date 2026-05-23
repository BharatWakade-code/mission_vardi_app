import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';
import 'package:mission_vardi/models/home_module/get_pdf_answers_response.dart';
import 'package:mission_vardi/screens/vardi_home_module/data/home_repository.dart';

part 'vardi_home_state.dart';

@injectable
class VardiHomeCubit extends Cubit<VardiHomeState> {
  VardiHomeCubit(this._repository) : super( VardiHomeState());

  final HomeRepository _repository;

  /// Get PDF Notes & Solved Papers
  Future<void> getPDFNotesAndSolvedPapers({String? search}) async {
    print('api call');
    emit(state.copyWith(
      isLoading: true,
      errorMsg: '',
      successMsg: '',
    ));

    Map<String, dynamic>? queryParams;
    if (search != null && search.isNotEmpty) {
      queryParams = {'search': search};
    }

    final either = await _repository.getPDFNotesAndSolvedPapers(queryParameters: queryParams);

    either.fold(
      (error) {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: error.toString(),
        ));
      },
      (response) {
        responseHandle(response);
      },
    );
  }

  void responseHandle(GetPdfNotesResponseModel response) {
    if (response.status == true) {
      emit(state.copyWith(
        isLoading: false,
        successMsg: response.message ?? '',
        isSuccess: true,
        data: response.data,
        errorMsg: '',
      ));
    } else {
      emit(state.copyWith(
        isLoading: false,
        errorMsg: response.message ?? 'Something went wrong',
      ));
    }
  }


}
