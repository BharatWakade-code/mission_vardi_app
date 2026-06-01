part of 'vardi_home_cubit.dart';

@immutable
class VardiHomeState {
  final bool isLoading;
  final bool isSuccess;
  final String errorMsg;
  final String successMsg;
  List<dynamic>? data;
  List<dynamic>? alerts;
  List<dynamic>? leaderboard;
  List<dynamic>? dailyQuotes;
  Map<String, dynamic>? countdown;

   VardiHomeState({
    this.isLoading = false,
    this.isSuccess = false,
    this.errorMsg = '',
    this.successMsg = '',
    this.data,
    this.alerts,
    this.leaderboard,
    this.dailyQuotes,
    this.countdown,
  });

  VardiHomeState copyWith({
    bool? isLoading,
    bool? isSuccess,
    String? errorMsg,
    String? successMsg,
    dynamic data,
    List<dynamic>? alerts,
    List<dynamic>? leaderboard,
    List<dynamic>? dailyQuotes,
    Map<String, dynamic>? countdown,
  }) {
    return VardiHomeState(
      isLoading: isLoading ?? this.isLoading,
      isSuccess: isSuccess ?? this.isSuccess,
      errorMsg: errorMsg ?? this.errorMsg,
      successMsg: successMsg ?? this.successMsg,
      data: data ?? this.data,
      alerts: alerts ?? this.alerts,
      leaderboard: leaderboard ?? this.leaderboard,
      dailyQuotes: dailyQuotes ?? this.dailyQuotes,
      countdown: countdown ?? this.countdown,
    );
  }
}
