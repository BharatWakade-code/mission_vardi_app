class CustomPhysicalEvent {
  final String id;
  final String name;
  final int maxMarks;
  final int achievedMarks;
  
  // All-India Dynamic Rules Engine fields
  final String scoringType;      // 'direct', 'multiplier', 'threshold'
  final double ruleValue;        // e.g. 4 marks per pull-up
  final double targetValue;      // e.g. 14.0 feet or 24.0 mins
  final String targetComparison;  // '>=', '<='
  final String rawInput;         // raw input from user (e.g. '8' pullups or '13.5' feet)

  CustomPhysicalEvent({
    required this.id,
    required this.name,
    required this.maxMarks,
    required this.achievedMarks,
    this.scoringType = 'direct',
    this.ruleValue = 0.0,
    this.targetValue = 0.0,
    this.targetComparison = '>=',
    this.rawInput = '',
  });

  CustomPhysicalEvent copyWith({
    String? name,
    int? maxMarks,
    int? achievedMarks,
    String? scoringType,
    double? ruleValue,
    double? targetValue,
    String? targetComparison,
    String? rawInput,
  }) {
    return CustomPhysicalEvent(
      id: id,
      name: name ?? this.name,
      maxMarks: maxMarks ?? this.maxMarks,
      achievedMarks: achievedMarks ?? this.achievedMarks,
      scoringType: scoringType ?? this.scoringType,
      ruleValue: ruleValue ?? this.ruleValue,
      targetValue: targetValue ?? this.targetValue,
      targetComparison: targetComparison ?? this.targetComparison,
      rawInput: rawInput ?? this.rawInput,
    );
  }
}

class PhysicalPrepState {
  final int pushupCount;
  final int pushupGoal;
  final int situpCount;
  final int situpGoal;

  final bool isStopwatchRunning;
  final int stopwatchMilliseconds;
  final List<String> lapTimes;

  final String gender;
  final String runningTime;
  final String sprint;
  final String shotPut;
  final int runMarks;
  final int sprintMarks;
  final int shotPutMarks;
  final int calculatedScore;
  final int totalMaxMarks;
  final List<CustomPhysicalEvent> customEvents;

  PhysicalPrepState({
    this.pushupCount = 18,
    this.pushupGoal = 40,
    this.situpCount = 22,
    this.situpGoal = 45,
    this.isStopwatchRunning = false,
    this.stopwatchMilliseconds = 0,
    this.lapTimes = const [],
    this.gender = 'male',
    this.runningTime = '',
    this.sprint = '',
    this.shotPut = '',
    this.runMarks = 0,
    this.sprintMarks = 0,
    this.shotPutMarks = 0,
    this.calculatedScore = 0,
    this.totalMaxMarks = 50,
    this.customEvents = const [],
  });

  PhysicalPrepState copyWith({
    int? pushupCount,
    int? pushupGoal,
    int? situpCount,
    int? situpGoal,
    bool? isStopwatchRunning,
    int? stopwatchMilliseconds,
    List<String>? lapTimes,
    String? gender,
    String? runningTime,
    String? sprint,
    String? shotPut,
    int? runMarks,
    int? sprintMarks,
    int? shotPutMarks,
    int? calculatedScore,
    int? totalMaxMarks,
    List<CustomPhysicalEvent>? customEvents,
  }) {
    return PhysicalPrepState(
      pushupCount: pushupCount ?? this.pushupCount,
      pushupGoal: pushupGoal ?? this.pushupGoal,
      situpCount: situpCount ?? this.situpCount,
      situpGoal: situpGoal ?? this.situpGoal,
      isStopwatchRunning: isStopwatchRunning ?? this.isStopwatchRunning,
      stopwatchMilliseconds: stopwatchMilliseconds ?? this.stopwatchMilliseconds,
      lapTimes: lapTimes ?? this.lapTimes,
      gender: gender ?? this.gender,
      runningTime: runningTime ?? this.runningTime,
      sprint: sprint ?? this.sprint,
      shotPut: shotPut ?? this.shotPut,
      runMarks: runMarks ?? this.runMarks,
      sprintMarks: sprintMarks ?? this.sprintMarks,
      shotPutMarks: shotPutMarks ?? this.shotPutMarks,
      calculatedScore: calculatedScore ?? this.calculatedScore,
      totalMaxMarks: totalMaxMarks ?? this.totalMaxMarks,
      customEvents: customEvents ?? this.customEvents,
    );
  }
}
