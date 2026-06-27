import 'dart:async';
import 'dart:convert';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';
import 'physical_prep_state.dart';

class PhysicalPrepCubit extends Cubit<PhysicalPrepState> {
  Timer? _stopwatchTimer;

  PhysicalPrepCubit() : super(const PhysicalPrepState()) {
    _loadSavedPlayers();
  }

  void _loadSavedPlayers() {
    final playersStr = CommonHiveData.getString('savedPlayers');
    if (playersStr.isNotEmpty) {
      try {
        final List<dynamic> parsed = jsonDecode(playersStr);
        final players = parsed.cast<String>();
        emit(state.copyWith(savedPlayers: players));
      } catch (_) {}
    }
  }

  void _persistSavedPlayers(List<String> players) {
    CommonHiveData.setString('savedPlayers', jsonEncode(players));
  }

  void addSavedPlayer(String name) {
    if (name.trim().isEmpty) return;
    final updated = List<String>.from(state.savedPlayers)..add(name.trim());
    _persistSavedPlayers(updated);
    emit(state.copyWith(savedPlayers: updated, playerName: name.trim()));
  }

  void editSavedPlayer(String oldName, String newName) {
    if (newName.trim().isEmpty) return;
    final updated = List<String>.from(state.savedPlayers);
    final index = updated.indexOf(oldName);
    if (index != -1) {
      updated[index] = newName.trim();
      _persistSavedPlayers(updated);
      emit(state.copyWith(savedPlayers: updated, playerName: newName.trim()));
    }
  }

  void deleteSavedPlayer(String name) {
    final updated = List<String>.from(state.savedPlayers)..remove(name);
    _persistSavedPlayers(updated);
    emit(state.copyWith(savedPlayers: updated, playerName: updated.isNotEmpty ? updated.first : 'Player 1'));
  }

  void updatePlayerName(String name) {
    emit(state.copyWith(playerName: name));
  }

  // 1. Workout methods
  void incrementPushups() {
    if (state.pushupCount < state.pushupGoal) {
      emit(state.copyWith(pushupCount: state.pushupCount + 1));
    }
  }

  void resetPushups() {
    emit(state.copyWith(pushupCount: 0));
  }

  void incrementSitups() {
    if (state.situpCount < state.situpGoal) {
      emit(state.copyWith(situpCount: state.situpCount + 1));
    }
  }

  void resetSitups() {
    emit(state.copyWith(situpCount: 0));
  }

  // 2. Stopwatch methods
  void startStopwatch() {
    if (state.isStopwatchRunning) return;
    emit(state.copyWith(isStopwatchRunning: true));
    _stopwatchTimer?.cancel();
    _stopwatchTimer = Timer.periodic(const Duration(milliseconds: 10), (timer) {
      emit(state.copyWith(
          stopwatchMilliseconds: state.stopwatchMilliseconds + 10));
    });
  }

  void stopStopwatch() {
    _stopwatchTimer?.cancel();
    emit(state.copyWith(isStopwatchRunning: false));
  }

  void resetStopwatch() {
    stopStopwatch();
    emit(state.copyWith(
      stopwatchMilliseconds: 0,
      lapTimes: [],
    ));
  }

  void recordLap() {
    final lapTime = formatTime(state.stopwatchMilliseconds);
    final updatedLaps = List<String>.from(state.lapTimes)..insert(0, lapTime);
    emit(state.copyWith(lapTimes: updatedLaps));
  }

  String formatTime(int ms) {
    int minutes = (ms ~/ 60000) % 60;
    int seconds = (ms ~/ 1000) % 60;
    int hundredths = (ms ~/ 10) % 100;
    return "${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}.${hundredths.toString().padLeft(2, '0')}";
  }

  // 3. Calculator methods
  void changeGender(String newGender) {
    emit(state.copyWith(gender: newGender));
    calculatePhysicalMarks();
  }

  void updateRunningTime(String time) {
    emit(state.copyWith(runningTime: time));
    calculatePhysicalMarks();
  }

  void updateSprint(String sprint) {
    emit(state.copyWith(sprint: sprint));
    calculatePhysicalMarks();
  }

  void updateShotPut(String shotPut) {
    emit(state.copyWith(shotPut: shotPut));
    calculatePhysicalMarks();
  }

  void calculatePhysicalMarks() {
    double runMinVal = 0;
    double runSecVal = 0;

    final cleanTime = state.runningTime.trim().replaceAll(' ', '');
    if (cleanTime.isNotEmpty) {
      if (cleanTime.contains(':')) {
        final parts = cleanTime.split(':').where((x) => x.isNotEmpty).toList();
        if (parts.isNotEmpty) {
          runMinVal = double.tryParse(parts[0]) ?? 0;
          if (parts.length > 1) {
            runSecVal = double.tryParse(parts[1]) ?? 0;
          }
        }
      } else if (cleanTime.contains('.')) {
        final parts = cleanTime.split('.').where((x) => x.isNotEmpty).toList();
        if (parts.isNotEmpty) {
          runMinVal = double.tryParse(parts[0]) ?? 0;
          if (parts.length > 1) {
            String secPart = parts[1];
            if (secPart.length == 1) secPart += "0";
            runSecVal = double.tryParse(secPart) ?? 0;
          }
        }
      } else {
        runMinVal = double.tryParse(cleanTime) ?? 0;
      }
    }

    final double? sprintVal = double.tryParse(state.sprint.trim());
    final double? shotPutVal = double.tryParse(state.shotPut.trim());

    int rMarks = 0;
    int sMarks = 0;
    int spMarks = 0;

    // 1. Long Run Calculation (20 Marks)
    if (runMinVal > 0 || runSecVal > 0) {
      double totalSeconds = (runMinVal * 60) + runSecVal;
      if (state.gender == 'male') {
        // Male 1600m
        if (totalSeconds <= 310) {
          // 5:10
          rMarks = 20;
        } else if (totalSeconds <= 330) {
          // 5:30
          rMarks = 18;
        } else if (totalSeconds <= 350) {
          // 5:50
          rMarks = 15;
        } else if (totalSeconds <= 370) {
          // 6:10
          rMarks = 12;
        } else if (totalSeconds <= 390) {
          // 6:30
          rMarks = 10;
        } else if (totalSeconds <= 420) {
          // 7:00
          rMarks = 8;
        } else if (totalSeconds <= 450) {
          // 7:30
          rMarks = 5;
        } else {
          rMarks = 0;
        }
      } else {
        // Female 800m
        if (totalSeconds <= 170) {
          // 2:50
          rMarks = 20;
        } else if (totalSeconds <= 180) {
          // 3:00
          rMarks = 18;
        } else if (totalSeconds <= 190) {
          // 3:10
          rMarks = 15;
        } else if (totalSeconds <= 200) {
          // 3:20
          rMarks = 12;
        } else if (totalSeconds <= 210) {
          // 3:30
          rMarks = 10;
        } else if (totalSeconds <= 220) {
          // 3:40
          rMarks = 8;
        } else if (totalSeconds <= 240) {
          // 4:00
          rMarks = 5;
        } else {
          rMarks = 0;
        }
      }
    }

    // 2. Sprint Calculation (15 Marks)
    if (sprintVal != null && sprintVal > 0) {
      if (state.gender == 'male') {
        if (sprintVal <= 11.50) {
          sMarks = 15;
        } else if (sprintVal <= 12.50) {
          sMarks = 12;
        } else if (sprintVal <= 13.50) {
          sMarks = 10;
        } else if (sprintVal <= 14.50) {
          sMarks = 8;
        } else if (sprintVal <= 15.50) {
          sMarks = 6;
        } else if (sprintVal <= 16.50) {
          sMarks = 4;
        } else {
          sMarks = 0;
        }
      } else {
        if (sprintVal <= 14.00) {
          sMarks = 15;
        } else if (sprintVal <= 15.00) {
          sMarks = 12;
        } else if (sprintVal <= 16.00) {
          sMarks = 10;
        } else if (sprintVal <= 17.00) {
          sMarks = 8;
        } else if (sprintVal <= 18.00) {
          sMarks = 6;
        } else if (sprintVal <= 19.00) {
          sMarks = 4;
        } else {
          sMarks = 0;
        }
      }
    }

    // 3. Shot Put Calculation (15 Marks)
    if (shotPutVal != null && shotPutVal > 0) {
      if (state.gender == 'male') {
        if (shotPutVal >= 8.50) {
          spMarks = 15;
        } else if (shotPutVal >= 7.90) {
          spMarks = 12;
        } else if (shotPutVal >= 7.30) {
          spMarks = 10;
        } else if (shotPutVal >= 6.70) {
          spMarks = 8;
        } else if (shotPutVal >= 6.10) {
          spMarks = 6;
        } else if (shotPutVal >= 5.50) {
          spMarks = 4;
        } else {
          spMarks = 0;
        }
      } else {
        if (shotPutVal >= 6.00) {
          spMarks = 15;
        } else if (shotPutVal >= 5.50) {
          spMarks = 12;
        } else if (shotPutVal >= 5.00) {
          spMarks = 10;
        } else if (shotPutVal >= 4.50) {
          spMarks = 8;
        } else if (shotPutVal >= 4.00) {
          spMarks = 6;
        } else if (shotPutVal >= 3.50) {
          spMarks = 4;
        } else {
          spMarks = 0;
        }
      }
    }

    int totalCustomAchieved = 0;
    int totalCustomMax = 0;
    for (final event in state.customEvents) {
      totalCustomAchieved += event.achievedMarks;
      totalCustomMax += event.maxMarks;
    }

    emit(state.copyWith(
      runMarks: rMarks,
      sprintMarks: sMarks,
      shotPutMarks: spMarks,
      calculatedScore: rMarks + sMarks + spMarks + totalCustomAchieved,
      totalMaxMarks: 50 + totalCustomMax,
    ));
  }

  void addCustomEvent({
    required String name,
    required int maxMarks,
    required String scoringType,
    required double ruleValue,
    required double targetValue,
    required String targetComparison,
    required String rawInput,
  }) {
    int achieved = 0;
    if (scoringType == 'direct') {
      achieved = int.tryParse(rawInput) ?? 0;
    } else if (scoringType == 'multiplier') {
      final reps = double.tryParse(rawInput) ?? 0.0;
      achieved = (reps * ruleValue).toInt();
    } else if (scoringType == 'threshold') {
      final value = double.tryParse(rawInput) ?? 0.0;
      bool passed = false;
      if (targetComparison == '>=') {
        passed = value >= targetValue;
      } else {
        passed = value <= targetValue;
      }
      achieved = passed ? maxMarks : 0;
    }

    if (achieved > maxMarks) achieved = maxMarks;
    if (achieved < 0) achieved = 0;

    final newEvent = CustomPhysicalEvent(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      name: name,
      maxMarks: maxMarks,
      achievedMarks: achieved,
      scoringType: scoringType,
      ruleValue: ruleValue,
      targetValue: targetValue,
      targetComparison: targetComparison,
      rawInput: rawInput,
    );

    final updatedList = List<CustomPhysicalEvent>.from(state.customEvents)
      ..add(newEvent);
    emit(state.copyWith(customEvents: updatedList));
    calculatePhysicalMarks();
  }

  void updateCustomEventInput(String id, String newInput) {
    final updatedList = state.customEvents.map((e) {
      if (e.id == id) {
        int achieved = 0;
        if (e.scoringType == 'direct') {
          achieved = int.tryParse(newInput) ?? 0;
        } else if (e.scoringType == 'multiplier') {
          final reps = double.tryParse(newInput) ?? 0.0;
          achieved = (reps * e.ruleValue).toInt();
        } else if (e.scoringType == 'threshold') {
          final value = double.tryParse(newInput) ?? 0.0;
          bool passed = false;
          if (e.targetComparison == '>=') {
            passed = value >= e.targetValue;
          } else {
            passed = value <= e.targetValue;
          }
          achieved = passed ? e.maxMarks : 0;
        }

        if (achieved > e.maxMarks) achieved = e.maxMarks;
        if (achieved < 0) achieved = 0;

        return e.copyWith(rawInput: newInput, achievedMarks: achieved);
      }
      return e;
    }).toList();

    emit(state.copyWith(customEvents: updatedList));
    calculatePhysicalMarks();
  }

  void removeCustomEvent(String id) {
    final updatedList = state.customEvents.where((e) => e.id != id).toList();
    emit(state.copyWith(customEvents: updatedList));
    calculatePhysicalMarks();
  }

  Future<void> saveFitnessLog() async {
    try {
      final userId = CommonHiveData.getString('userId') ?? 'test_user';
      double runMinVal = 0;
      double runSecVal = 0;
      final cleanTime = state.runningTime.trim().replaceAll(' ', '');
      if (cleanTime.isNotEmpty) {
        if (cleanTime.contains(':')) {
          final parts =
              cleanTime.split(':').where((x) => x.isNotEmpty).toList();
          if (parts.isNotEmpty) {
            runMinVal = double.tryParse(parts[0]) ?? 0;
            if (parts.length > 1) runSecVal = double.tryParse(parts[1]) ?? 0;
          }
        } else if (cleanTime.contains('.')) {
          final parts =
              cleanTime.split('.').where((x) => x.isNotEmpty).toList();
          if (parts.isNotEmpty) {
            runMinVal = double.tryParse(parts[0]) ?? 0;
            if (parts.length > 1) {
              String secPart = parts[1];
              if (secPart.length == 1) secPart += "0";
              runSecVal = double.tryParse(secPart) ?? 0;
            }
          }
        } else {
          runMinVal = double.tryParse(cleanTime) ?? 0;
        }
      }
      final totalSeconds = (runMinVal * 60) + runSecVal;
      final sprintVal = double.tryParse(state.sprint.trim()) ?? 0.0;
      final shotPutVal = double.tryParse(state.shotPut.trim()) ?? 0.0;

      final List<Map<String, dynamic>> customEventsList = state.customEvents.map((e) => {
        "name": e.name.trim(),
        "input": e.rawInput.trim(),
        "achievedMarks": e.achievedMarks,
        "maxMarks": e.maxMarks,
      }).toList();

      final String finalPlayerName = state.playerName.trim().isEmpty 
          ? "Player ${state.fitnessHistory.length + 1}" 
          : state.playerName.trim();

      final notesJson = {
        "player_name": finalPlayerName,
        "score": state.calculatedScore,
        "custom_events": customEventsList,
        "pushups": state.pushupCount,
        "situps": state.situpCount,
        "laps": state.lapTimes,
        "stopwatch_ms": state.stopwatchMilliseconds,
      };

      final data = {
        "user_id": userId,
        "run_1600m_seconds": totalSeconds,
        "run_100m_seconds": sprintVal,
        "shot_put_meters": shotPutVal,
        "notes": jsonEncode(notesJson),
      };

      String? existingLogId;
      for (var log in state.fitnessHistory) {
        try {
          if (log['notes'] != null) {
            String notesStr = log['notes'].toString();
            final notesMap = jsonDecode(notesStr);
            if (notesMap['player_name'] == finalPlayerName) {
              existingLogId = log['id']?.toString();
              break;
            }
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }

      if (existingLogId != null) {
        final response = await NetworkServices()
            .putApi("${ApiUrls.fitnessLogs}/$existingLogId", request: data);
        print("Fitness log updated: $response");
      } else {
        final response =
            await NetworkServices().postApi(ApiUrls.fitnessLogs, data);
        print("Fitness log saved: $response");
      }
      
      // Refresh the history
      await getFitnessLogs();
    } catch (e) {
      print("Error saving fitness log: $e");
    }
  }

  Future<void> getFitnessLogs() async {
    emit(state.copyWith(isLoadingHistory: true));
    try {
      final userId = CommonHiveData.getString('userId') ?? 'test_user';
      final response =
          await NetworkServices().getApi("${ApiUrls.fitnessLogs}/$userId");
      var responseData = response.data;
      
      if (responseData is String) {
        try {
          responseData = jsonDecode(responseData);
        } catch (e) {
          print("Error decoding response string: $e");
        }
      }

      if (responseData != null && responseData is List) {
        final List<Map<String, dynamic>> history = responseData.map((e) => Map<String, dynamic>.from(e as Map)).toList();
        history.sort((a, b) {
          final dateA = a['created_at'] != null ? DateTime.tryParse(a['created_at'].toString()) ?? DateTime.fromMillisecondsSinceEpoch(0) : DateTime.fromMillisecondsSinceEpoch(0);
          final dateB = b['created_at'] != null ? DateTime.tryParse(b['created_at'].toString()) ?? DateTime.fromMillisecondsSinceEpoch(0) : DateTime.fromMillisecondsSinceEpoch(0);
          return dateB.compareTo(dateA);
        });
        emit(state.copyWith(
          fitnessHistory: history,
          isLoadingHistory: false,
        ));
      } else if (responseData != null &&
          responseData is Map &&
          responseData['data'] != null) {
        final List<dynamic> dataList = responseData['data'] is List ? responseData['data'] : [];
        final List<Map<String, dynamic>> history = dataList.map((e) => Map<String, dynamic>.from(e as Map)).toList();
        history.sort((a, b) {
          final dateA = a['created_at'] != null ? DateTime.tryParse(a['created_at'].toString()) ?? DateTime.fromMillisecondsSinceEpoch(0) : DateTime.fromMillisecondsSinceEpoch(0);
          final dateB = b['created_at'] != null ? DateTime.tryParse(b['created_at'].toString()) ?? DateTime.fromMillisecondsSinceEpoch(0) : DateTime.fromMillisecondsSinceEpoch(0);
          return dateB.compareTo(dateA);
        });
        emit(state.copyWith(
          fitnessHistory: history,
          isLoadingHistory: false,
        ));
      } else {
        // Fallback to empty if unexpected format
        emit(state.copyWith(isLoadingHistory: false, fitnessHistory: []));
      }
    } catch (e) {
      print("Error fetching fitness logs: $e");
      emit(state.copyWith(isLoadingHistory: false));
    }
  }

  Future<void> deleteFitnessLog(String logId) async {
    try {
      // Optimistic UI update
      final currentList = List<Map<String, dynamic>>.from(state.fitnessHistory);
      currentList.removeWhere((log) => log['id'] == logId);
      emit(state.copyWith(fitnessHistory: currentList));

      await NetworkServices().deleteApi("${ApiUrls.fitnessLogs}/$logId");
      print("Fitness log deleted successfully");
    } catch (e) {
      print("Error deleting fitness log: $e");
      // If backend fails, we might want to re-fetch to restore the state
      getFitnessLogs();
    }
  }

  @override
  Future<void> close() {
    _stopwatchTimer?.cancel();
    return super.close();
  }
}
