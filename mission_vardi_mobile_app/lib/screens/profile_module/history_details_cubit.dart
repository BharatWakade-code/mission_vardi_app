import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';
import 'package:mission_vardi/screens/profile_module/history_details_state.dart';

class HistoryDetailsCubit extends Cubit<HistoryDetailsState> {
  HistoryDetailsCubit() : super(HistoryDetailsState());

  Future<void> fetchDetails(String sessionId, String quizId) async {
    emit(state.copyWith(isLoading: true, errorMsg: ''));

    try {
      final sessionRes =
          await NetworkServices().getApi('/study/session/$sessionId');

      if (sessionRes.data is Map && sessionRes.data['status'] == true) {
        final sessionData = sessionRes.data['data'];
        Map<String, dynamic>? quizData;
        String errorMsg = '';

        try {
          final quizRes = await NetworkServices().getApi('/quiz/$quizId');
          if (quizRes.data is Map && quizRes.data['status'] == true) {
            quizData = quizRes.data['data'];
          } else {
            errorMsg = (quizRes.data is Map)
                ? (quizRes.data['message'] ?? 'Quiz not found')
                : 'Quiz not found';
          }
        } catch (e) {
          errorMsg = 'Quiz not found';
        }

        emit(state.copyWith(
          isLoading: false,
          sessionData: sessionData,
          quizData: quizData,
          errorMsg: errorMsg,
        ));
      } else {
        emit(state.copyWith(
          isLoading: false,
          errorMsg: (sessionRes.data is Map)
              ? (sessionRes.data['message'] ?? 'Failed to load session')
              : 'Failed to load session',
        ));
      }
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        errorMsg: e.toString(),
      ));
    }
  }
}
