import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';
import 'package:mission_vardi/screens/profile_module/activity_history_state.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

class ActivityHistoryCubit extends Cubit<ActivityHistoryState> {
  ActivityHistoryCubit() : super(ActivityHistoryState());

  final int limit = 15;

  Future<void> fetchHistory({bool isRefresh = false}) async {
    if (isRefresh) {
      emit(state.copyWith(
          isLoading: true, page: 1, hasReachedMax: false, sessions: []));
    } else if (state.hasReachedMax ||
        state.isLoading ||
        state.isPaginationLoading) {
      return;
    } else if (state.sessions.isNotEmpty) {
      emit(state.copyWith(isPaginationLoading: true));
    } else {
      emit(state.copyWith(isLoading: true));
    }

    try {
      final userId = CommonHiveData.getString('userId');
      final response = await NetworkServices().getApi(
        '/study/history/$userId',
        queryParameters: {'page': state.page, 'limit': limit},
      );

      if (response.data['status'] == true) {
        final data = response.data['data'];
        final List<dynamic> newSessions = data['sessions'] ?? [];

        final hasReachedMax = newSessions.length < limit;

        emit(state.copyWith(
          isLoading: false,
          isPaginationLoading: false,
          sessions:
              isRefresh ? newSessions : [...state.sessions, ...newSessions],
          page: state.page + 1,
          hasReachedMax: hasReachedMax,
        ));
      } else {
        emit(state.copyWith(
          isLoading: false,
          isPaginationLoading: false,
          errorMsg: response.data['message'] ?? 'Failed to load history',
        ));
      }
    } catch (e) {
      emit(state.copyWith(
        isLoading: false,
        isPaginationLoading: false,
        errorMsg: e.toString(),
      ));
    }
  }
}
