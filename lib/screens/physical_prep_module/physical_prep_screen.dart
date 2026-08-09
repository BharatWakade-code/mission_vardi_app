import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:edusaas/screens/physical_prep_module/physical_prep_cubit.dart';
import 'package:edusaas/screens/physical_prep_module/physical_prep_state.dart';
import 'package:edusaas/utils/common_widgets/commonTextField.dart';
import 'package:edusaas/utils/common_widgets/common_app_bar.dart';
import 'package:edusaas/utils/constants.dart';
import 'package:edusaas/screens/localization_module/app_localizations.dart';
import 'package:edusaas/screens/localization_module/locale_cubit.dart';

class PhysicalPrepScreen extends StatefulWidget {
  const PhysicalPrepScreen({super.key});

  @override
  State<PhysicalPrepScreen> createState() => _PhysicalPrepScreenState();
}

class _PhysicalPrepScreenState extends State<PhysicalPrepScreen> {
  late final TextEditingController runningTimeController;
  late final TextEditingController sprintController;
  late final TextEditingController shotPutController;
  late final TextEditingController playerNameController;
  DateTime? selectedFilterDate;
  int historyCategoryIndex = 0;

  @override
  void initState() {
    super.initState();
    final cubit = context.read<PhysicalPrepCubit>();
    runningTimeController = TextEditingController(text: cubit.state.runningTime);
    sprintController = TextEditingController(text: cubit.state.sprint);
    shotPutController = TextEditingController(text: cubit.state.shotPut);
    playerNameController = TextEditingController(text: cubit.state.playerName);

    runningTimeController.addListener(() {
      cubit.updateRunningTime(runningTimeController.text);
    });
    sprintController.addListener(() {
      cubit.updateSprint(sprintController.text);
    });
    shotPutController.addListener(() {
      cubit.updateShotPut(shotPutController.text);
    });
    playerNameController.addListener(() {
      cubit.updatePlayerName(playerNameController.text);
    });

    // Fetch fitness logs
    cubit.getFitnessLogs();
  }

  @override
  void dispose() {
    runningTimeController.dispose();
    sprintController.dispose();
    shotPutController.dispose();
    playerNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    context.watch<LocaleCubit>();

    // Watch LanguageCubit to trigger an instant rebuild when language changes
   
    return BlocBuilder<PhysicalPrepCubit, PhysicalPrepState>(
      builder: (context, state) {
        final cubit = context.read<PhysicalPrepCubit>();

        return DefaultTabController(
          length: 4,
          child: Builder(
            builder: (context) {
              final tabController = DefaultTabController.of(context);
              return Scaffold(
                backgroundColor: Constants.scaffoldBackgroundColour,
                floatingActionButton: AnimatedBuilder(
                  animation: tabController,
                  builder: (context, child) {
                    if (tabController.index == 3) return const SizedBox.shrink();
                    return FloatingActionButton.extended(
                      onPressed: () => _showSaveDialog(context, cubit),
                      backgroundColor: Constants.primaryGreenColour,
                      icon: const Icon(Icons.save_rounded, color: Colors.white),
                      label: Text(
                        'save'.tr(),
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    );
                  },
                ),
                appBar: CustomAppBar(
              titleText: 'physical_test_tracker'.tr(),
              titleIcon: Icons.fitness_center,    
              bottom: PreferredSize(
                preferredSize: const Size.fromHeight(66),
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.18),
                    borderRadius: BorderRadius.circular(30),
                  ),
                  child: TabBar(
                    indicator: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(26),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.15),
                          blurRadius: 6,
                          offset: const Offset(0, 3),
                        ),
                      ],
                    ),
                    indicatorSize: TabBarIndicatorSize.tab,
                    dividerColor: Colors.transparent,
                    labelColor: Constants.primaryBlueColour,
                    unselectedLabelColor: Colors.white,
                    labelStyle: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 11),
                    unselectedLabelStyle: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 11),
                    tabs: [
                      Tab(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.fitness_center, size: 14),
                              const SizedBox(width: 4),
                              Text('workout'.tr()),
                            ],
                          ),
                        ),
                      ),
                      Tab(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.timer_outlined, size: 14),
                              const SizedBox(width: 4),
                              Text('running_tab'.tr()),
                            ],
                          ),
                        ),
                      ),
                      Tab(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.calculate_rounded, size: 14),
                              const SizedBox(width: 4),
                              Text('ground_tab'.tr()),
                            ],
                          ),
                        ),
                      ),
                      Tab(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.history_rounded, size: 14),
                              const SizedBox(width: 4),
                              Text('history'.tr()),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            body: TabBarView(
              children: [
                // 1. Workout Tracker Tab
                SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _cardContainer(
                        child: Row(
                          children: [
                            const CircleAvatar(
                              backgroundColor: Colors.orangeAccent,
                              child: Icon(Icons.local_fire_department, color: Colors.white),
                            ),
                            const SizedBox(width: 15),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'workout_target_title'.tr(),
                                    style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 15),
                                  ),
                                  const SizedBox(height: 3),
                                  Text(
                                    'workout_target_desc'.tr(),
                                    style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey.shade600),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      _trackerCard(
                        title: 'pushups_counter'.tr(),
                        count: state.pushupCount,
                        goal: state.pushupGoal,
                        onAdd: cubit.incrementPushups,
                        onReset: cubit.resetPushups,
                      ),
                      const SizedBox(height: 15),

                      _trackerCard(
                        title: 'situps_counter'.tr(),
                        count: state.situpCount,
                        goal: state.situpGoal,
                        onAdd: cubit.incrementSitups,
                        onReset: cubit.resetSitups,
                      ),
                      const SizedBox(height: 20),

                      Text(
                        'police_physical_standards'.tr(),
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 10),
                      _standardItem(
                        title: 'run_1600m_male'.tr(),
                        desc: 'excellent_target_5_mins_10_secs_30_marks'.tr(),
                        score: "30 M",
                      ),
                      _standardItem(
                        title: 'sprint_100m'.tr(),
                        desc: 'excellent_target_11_50_secs_15_marks'.tr(),
                        score: "15 M",
                      ),
                      _standardItem(
                        title: 'shot_put_throw'.tr(),
                        desc: 'excellent_throw_8_50_meters_15_marks'.tr(),
                        score: "15 M",
                      ),
                      const SizedBox(height: 60),
                    ],
                  ),
                ),

                // 2. Running Stopwatch Tab
                SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const SizedBox(height: 10),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
                        decoration: BoxDecoration(
                          gradient: const LinearGradient(
                            colors: [Color(0xFF1E3A8A), Color(0xFF3B82F6)], // Dark Blue to Light Blue
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(24),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF3B82F6).withOpacity(0.3),
                              blurRadius: 15,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Column(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.timer_outlined, color: Colors.white, size: 16),
                                  const SizedBox(width: 6),
                                  Text(
                                    'running_stopwatch'.tr(),
                                    style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.w600, fontSize: 12),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 20),
                            Text(
                              cubit.formatTime(state.stopwatchMilliseconds),
                              style: const TextStyle(
                                fontFamily: 'Inter',
                                fontSize: 56,
                                fontWeight: FontWeight.bold,
                                color: Colors.white,
                                letterSpacing: 2,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 32),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildModernStopwatchButton(
                            icon: Icons.refresh_rounded,
                            label: "Reset",
                            color: Colors.grey.shade700,
                            backgroundColor: Colors.grey.shade100,
                            onTap: cubit.resetStopwatch,
                          ),
                          _buildModernStopwatchButton(
                            icon: state.isStopwatchRunning ? Icons.pause_rounded : Icons.play_arrow_rounded,
                            label: state.isStopwatchRunning ? "Pause" : "Start",
                            color: Colors.white,
                            backgroundColor: state.isStopwatchRunning ? Constants.redColour : Constants.primaryGreenColour,
                            isLarge: true,
                            onTap: state.isStopwatchRunning ? cubit.stopStopwatch : cubit.startStopwatch,
                          ),
                          _buildModernStopwatchButton(
                            icon: Icons.flag_rounded,
                            label: "Lap",
                            color: state.isStopwatchRunning ? Colors.white : Colors.grey.shade400,
                            backgroundColor: state.isStopwatchRunning ? Constants.primaryBlueColour : Colors.grey.shade100,
                            onTap: state.isStopwatchRunning ? cubit.recordLap : null,
                          ),
                        ],
                      ),
                      const SizedBox(height: 32),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.list_alt_rounded, color: Colors.grey, size: 20),
                              const SizedBox(width: 8),
                              Text(
                                'recorded_splits'.tr(),
                                style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Constants.primaryBlueColour.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              "${state.lapTimes.length} Laps",
                              style: commonTextStyle.copyWith(color: Constants.primaryBlueColour, fontSize: 12, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      if (state.lapTimes.isEmpty)
                        Container(
                          width: double.infinity,
                          padding: const EdgeInsets.symmetric(vertical: 40),
                          decoration: BoxDecoration(
                            color: Colors.grey.shade50,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.grey.shade200, style: BorderStyle.solid),
                          ),
                          child: Column(
                            children: [
                              Icon(Icons.timer_off_outlined, color: Colors.grey.shade400, size: 40),
                              const SizedBox(height: 12),
                              Text(
                                'start_timer_desc'.tr(),
                                style: commonTextStyle.copyWith(color: Colors.grey.shade500, fontSize: 13),
                              ),
                            ],
                          ),
                        )
                      else
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: Colors.grey.shade200),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.02),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: ListView.separated(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: state.lapTimes.length,
                            separatorBuilder: (_, __) => Divider(height: 1, color: Colors.grey.shade100),
                            itemBuilder: (context, index) {
                              final isLatest = index == 0;
                              return Padding(
                                padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
                                child: Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Row(
                                      children: [
                                        Container(
                                          width: 28,
                                          height: 28,
                                          alignment: Alignment.center,
                                          decoration: BoxDecoration(
                                            color: isLatest ? Constants.primaryBlueColour.withOpacity(0.1) : Colors.grey.shade100,
                                            shape: BoxShape.circle,
                                          ),
                                          child: Text(
                                            "${state.lapTimes.length - index}",
                                            style: commonTextStyle.copyWith(
                                              fontWeight: FontWeight.bold,
                                              fontSize: 12,
                                              color: isLatest ? Constants.primaryBlueColour : Colors.grey.shade600,
                                            ),
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Text(
                                          "Lap",
                                          style: commonTextStyle.copyWith(
                                            fontWeight: FontWeight.w600,
                                            color: isLatest ? Colors.black87 : Colors.grey.shade700,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Text(
                                      state.lapTimes[index],
                                      style: const TextStyle(
                                        fontFamily: 'Inter',
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700,
                                        color: Colors.black87,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
                      
                      const SizedBox(height: 80),
                    ],
                  ),
                ),

                // 3. Ground Marks Calculator Tab
                SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Guidance Clarification Note
                      Container(
                        width: double.infinity,
                        margin: const EdgeInsets.only(bottom: 16),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFFEFF6FF),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: const Color(0xFFBFDBFE)),
                        ),
                        child: Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Icon(Icons.info_outline_rounded, color: Constants.primaryBlueColour, size: 20),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    'important_note'.tr(),
                                    style: commonTextStyle.copyWith(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 12.5,
                                      color: const Color(0xFF1E40AF),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '1_initially_all_values_are_set_to_0n2_enter_your_actual_timingsdistances_to_see_your_marksn3_a_minimum_of_25_out_of_50_marks_is_required_to_qualify'.tr(),
                                    style: commonTextStyle.copyWith(
                                      fontSize: 11,
                                      color: const Color(0xFF1E3A8A),
                                      height: 1.5,
                                    ),
                                  ),
                                  const SizedBox(height: 12),
                                  ElevatedButton.icon(
                                    onPressed: () => _showScoringRulesBottomSheet(context, state.gender),
                                    icon: const Icon(Icons.table_chart_outlined, size: 16),
                                    label: Text("View Scoring Chart", style: commonTextStyle.copyWith(fontSize: 12, fontWeight: FontWeight.bold)),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: Colors.white,
                                      foregroundColor: Constants.primaryBlueColour,
                                      elevation: 0,
                                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                      minimumSize: const Size(0, 32),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(20),
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: state.calculatedScore >= 45
                                ? [const Color(0xFF15803D), const Color(0xFF166534)] // Green
                                : state.calculatedScore >= 35
                                    ? [const Color(0xFF1D4ED8), const Color(0xFF1E40AF)] // Blue
                                    : state.calculatedScore >= 25
                                        ? [const Color(0xFFB45309), const Color(0xFF92400E)] // Amber
                                        : [const Color(0xFFDC2626), const Color(0xFF991B1B)], // Red
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: (state.calculatedScore >= 45
                                      ? const Color(0xFF15803D)
                                      : state.calculatedScore >= 35
                                          ? const Color(0xFF1D4ED8)
                                          : state.calculatedScore >= 25
                                              ? const Color(0xFFB45309)
                                              : const Color(0xFFDC2626))
                                  .withOpacity(0.35),
                              blurRadius: 12,
                              offset: const Offset(0, 6),
                            )
                          ],
                        ),
                        child: Column(
                          children: [
                            Text(
                              'total_physical_marks'.tr(),
                              style: commonTextStyle.copyWith(
                                color: Colors.white70,
                                fontWeight: FontWeight.bold,
                                fontSize: 13,
                              ),
                            ),
                            const SizedBox(height: 8),
                            Text(
                              "${state.calculatedScore} / ${state.totalMaxMarks}",
                              style: commonTextStyle.copyWith(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 42,
                              ),
                            ),
                            const SizedBox(height: 10),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.18),
                                borderRadius: BorderRadius.circular(30),
                              ),
                              child: Text(
                                state.calculatedScore >= 45
                                    ? "🏆 Vardi Confirmed (Outstanding!)"
                                    : state.calculatedScore >= 35
                                        ? "⚡ Excellent Performance!"
                                        : state.calculatedScore >= 25
                                            ? "👍 Qualified (Need Practice)"
                                            : "❌ Unqualified (25 Min Required)",
                                style: commonTextStyle.copyWith(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 24),

                      Text(
                        'select_gender'.tr(),
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 10),
                      Row(
                        children: [
                          Expanded(
                            child: _genderButton(
                              label: 'male'.tr(),
                              icon: Icons.male_rounded,
                              isSelected: state.gender == 'male',
                              onTap: () => cubit.changeGender('male'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _genderButton(
                              label: 'female'.tr(),
                              icon: Icons.female_rounded,
                              isSelected: state.gender == 'female',
                              onTap: () => cubit.changeGender('female'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      Text(
                        'enter_physical_timings'.tr(),
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 12),

                      _calculatorInputRow(
                        title: state.gender == 'male'
                            ? "1600 Meters Run"
                            : "800 Meters Run",
                        subTitle: state.runningTime.isEmpty
                            ? "Target: <= 5.10 mins"
                            : _getParsedRunningTimeDescription(state.runningTime),
                        score: "${state.runMarks} / 20",
                        controller: runningTimeController,
                        hint: "5.10",
                      ),
                      const SizedBox(height: 14),

                      _calculatorInputRow(
                        title: 'sprint_100m'.tr(),
                        subTitle: "Target: <= 11.50 secs",
                        score: "${state.sprintMarks} / 15",
                        controller: sprintController,
                        hint: "11.5",
                      ),
                      const SizedBox(height: 14),

                      _calculatorInputRow(
                        title: 'shot_put_throw'.tr(),
                        subTitle: "Target: >= 8.50 meters",
                        score: "${state.shotPutMarks} / 15",
                        controller: shotPutController,
                        hint: "8.5",
                      ),
                      const SizedBox(height: 14),

                      ...state.customEvents.map((customEvent) {
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 14),
                          child: Container(
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(color: const Color(0xFFF1F5F9)),
                            ),
                            child: Row(
                              children: [
                                Expanded(
                                  flex: 3,
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        customEvent.name,
                                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13.5),
                                      ),
                                      const SizedBox(height: 3),
                                      Text(
                                        customEvent.scoringType == 'multiplier'
                                            ? "Rule: ${customEvent.ruleValue} marks/rep | Input: ${customEvent.rawInput}"
                                            : customEvent.scoringType == 'threshold'
                                                ? "Target: ${customEvent.targetComparison} ${customEvent.targetValue} | Input: ${customEvent.rawInput}"
                                                : "Direct score entry: ${customEvent.achievedMarks}",
                                        style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey.shade600),
                                      ),
                                    ],
                                  ),
                                ),
                                const SizedBox(width: 12),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFEFF6FF),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text(
                                    "${customEvent.achievedMarks} / ${customEvent.maxMarks}",
                                    style: commonTextStyle.copyWith(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                      color: Constants.primaryBlueColour,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 14),
                                IconButton(
                                  icon: const Icon(Icons.delete_outline, color: Colors.redAccent, size: 20),
                                  onPressed: () => cubit.removeCustomEvent(customEvent.id),
                                ),
                              ],
                            ),
                          ),
                        );
                      }).toList(),

                      // 'add_custom_event'.tr() Button
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: OutlinedButton.icon(
                          onPressed: () => _showAddEventBottomSheet(context, cubit),
                          icon: const Icon(Icons.add, size: 20),
                          label: Text(
                            'add_custom_event'.tr(),
                            style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13.5),
                          ),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Constants.primaryBlueColour,
                            side: BorderSide(color: Constants.primaryBlueColour.withOpacity(0.5)),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 60),
                    ],
                  ),
                ),

                // 4. History Tab
                _buildHistoryTab(context, cubit, state),
              ],
            ),
          );
        }),
      );
    });
  }

  Widget _buildHistoryTab(BuildContext context, PhysicalPrepCubit cubit, PhysicalPrepState state) {
    if (state.isLoadingHistory) {
      return const Center(child: CircularProgressIndicator(color: Constants.primaryBlueColour));
    }

    if (state.fitnessHistory.isEmpty) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.history_rounded, size: 60, color: Colors.grey.shade300),
            const SizedBox(height: 16),
            Text(
              'no_history_found'.tr(),
              style: commonTextStyle.copyWith(fontSize: 16, color: Colors.grey.shade600, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 8),
            Text(
              'save_fitness_log_to_see_here'.tr(),
              style: commonTextStyle.copyWith(fontSize: 12, color: Colors.grey.shade500),
            ),
          ],
        ),
      );
    }

    List<Map<String, dynamic>> dateFiltered = state.fitnessHistory;
    if (selectedFilterDate != null) {
      dateFiltered = state.fitnessHistory.where((log) {
        final date = log['created_at'] != null ? DateTime.parse(log['created_at']) : DateTime.now();
        return date.year == selectedFilterDate!.year &&
               date.month == selectedFilterDate!.month &&
               date.day == selectedFilterDate!.day;
      }).toList();
    }

    List<Map<String, dynamic>> filteredHistory = [];
    for (var log in dateFiltered) {
      bool hasWorkout = false;
      bool hasRunning = false;
      bool hasGround = false;

      if (log['notes'] != null) {
        final notesStr = log['notes'].toString();
        if (notesStr.startsWith('{')) {
          try {
            final parsed = jsonDecode(notesStr);
            if (parsed['pushups'] != null && parsed['pushups'] > 0) hasWorkout = true;
            if (parsed['situps'] != null && parsed['situps'] > 0) hasWorkout = true;
            if (parsed['laps'] != null && (parsed['laps'] as List).isNotEmpty) hasRunning = true;
            if (parsed['stopwatch_ms'] != null && parsed['stopwatch_ms'] > 0) hasRunning = true;
          } catch (_) {}
        }
      }
      if (log['run_1600m_seconds'] != null || log['run_100m_seconds'] != null || log['shot_put_meters'] != null) {
        hasGround = true;
      }
      
      if (historyCategoryIndex == 0) {
        filteredHistory.add(log);
      } else if (historyCategoryIndex == 1 && hasWorkout) {
        filteredHistory.add(log);
      } else if (historyCategoryIndex == 2 && hasRunning) {
        filteredHistory.add(log);
      } else if (historyCategoryIndex == 3 && hasGround) {
        filteredHistory.add(log);
      }
    }

    return Column(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                selectedFilterDate == null
                    ? "activity_history".tr()
                    : "History for ${selectedFilterDate!.day}/${selectedFilterDate!.month}/${selectedFilterDate!.year}",
                style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16, color: Constants.primaryBlueColour),
              ),
              Row(
                children: [
                  if (selectedFilterDate != null)
                    IconButton(
                      icon: const Icon(Icons.clear, color: Colors.redAccent, size: 20),
                      onPressed: () {
                        setState(() {
                          selectedFilterDate = null;
                        });
                      },
                    ),
                  IconButton(
                    icon: const Icon(Icons.calendar_month_rounded, color: Constants.primaryBlueColour),
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: selectedFilterDate ?? DateTime.now(),
                        firstDate: DateTime(2020),
                        lastDate: DateTime.now(),
                        builder: (context, child) {
                          return Theme(
                            data: Theme.of(context).copyWith(
                              colorScheme: const ColorScheme.light(
                                primary: Constants.primaryBlueColour,
                                onPrimary: Colors.white,
                                onSurface: Colors.black,
                              ),
                            ),
                            child: child!,
                          );
                        },
                      );
                      if (picked != null) {
                        setState(() {
                          selectedFilterDate = picked;
                        });
                      }
                    },
                  ),
                ],
              ),
            ],
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              children: [
                _buildHistoryCategoryTab("All", 0),
                _buildHistoryCategoryTab("Workout", 1),
                _buildHistoryCategoryTab("Running", 2),
                _buildHistoryCategoryTab("Ground", 3),
              ],
            ),
          ),
        ),
        const SizedBox(height: 8),
        if (filteredHistory.isEmpty)
          Expanded(
            child: Center(
              child: Text(
                'no_history_found'.tr(),
                style: commonTextStyle.copyWith(color: Colors.grey, fontSize: 16),
              ),
            ),
          )
        else
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              itemCount: filteredHistory.length,
              itemBuilder: (context, index) {
                final log = filteredHistory[index];
        final date = log['created_at'] != null ? DateTime.parse(log['created_at']) : DateTime.now();
        // Assuming log contains run_1600m_seconds, run_100m_seconds, shot_put_meters, notes

        String scoreText = "";
        String playerName = "Player ${state.fitnessHistory.length - index}";
        List<dynamic> customEvents = [];
        int? pushups;
        int? situps;
        List<dynamic> laps = [];
        int? stopwatchMs;

        if (log['notes'] != null) {
          final notesStr = log['notes'].toString();
          if (notesStr.startsWith('{')) {
            try {
              final parsed = jsonDecode(notesStr);
              scoreText = "Score: ${parsed['score']}";
              if (parsed['player_name'] != null) {
                playerName = parsed['player_name'].toString();
              }
              if (parsed['custom_events'] != null) {
                customEvents = parsed['custom_events'] is List ? parsed['custom_events'] : [];
              }
              if (parsed['pushups'] != null) pushups = parsed['pushups'];
              if (parsed['situps'] != null) situps = parsed['situps'];
              if (parsed['laps'] != null) laps = parsed['laps'] is List ? parsed['laps'] : [];
              if (parsed['stopwatch_ms'] != null) stopwatchMs = parsed['stopwatch_ms'];
            } catch (e) {
              scoreText = notesStr;
            }
          } else {
            scoreText = notesStr;
          }
        }
        
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade200),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.03),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: Constants.primaryBlueColour.withOpacity(0.1),
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(Icons.person_rounded, size: 20, color: Constants.primaryBlueColour),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            playerName,
                            style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          Text(
                            "${date.day}/${date.month}/${date.year}",
                            style: commonTextStyle.copyWith(fontSize: 12, color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    ],
                  ),
                  Row(
                    children: [
                      if (scoreText.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: Constants.primaryGreenColour.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Constants.primaryGreenColour.withOpacity(0.3)),
                          ),
                          child: Text(
                            scoreText,
                            style: commonTextStyle.copyWith(
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                              color: Constants.primaryGreenColour,
                            ),
                          ),
                        ),
                      const SizedBox(width: 8),
                      IconButton(
                        icon: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 20),
                        onPressed: () {
                          showDialog(
                            context: context,
                            builder: (ctx) => Dialog(
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                              child: Padding(
                                padding: const EdgeInsets.all(24.0),
                                child: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.all(16),
                                      decoration: BoxDecoration(
                                        color: Colors.red.shade50,
                                        shape: BoxShape.circle,
                                      ),
                                      child: const Icon(Icons.delete_outline_rounded, color: Colors.redAccent, size: 36),
                                    ),
                                    const SizedBox(height: 16),
                                    Text(
                                      'delete_log'.tr(),
                                      style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 18),
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      'delete_log_confirmation'.tr(),
                                      textAlign: TextAlign.center,
                                      style: commonTextStyle.copyWith(color: Colors.grey.shade600, fontSize: 14),
                                    ),
                                    const SizedBox(height: 24),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: OutlinedButton(
                                            onPressed: () => Navigator.pop(ctx),
                                            style: OutlinedButton.styleFrom(
                                              padding: const EdgeInsets.symmetric(vertical: 12),
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                              side: BorderSide(color: Colors.grey.shade300),
                                            ),
                                            child: Text('cancel'.tr(), style: commonTextStyle.copyWith(color: Colors.grey.shade700, fontWeight: FontWeight.bold)),
                                          ),
                                        ),
                                        const SizedBox(width: 12),
                                        Expanded(
                                          child: ElevatedButton(
                                            onPressed: () {
                                              Navigator.pop(ctx);
                                              if (log['id'] != null) {
                                                cubit.deleteFitnessLog(log['id'].toString());
                                              }
                                            },
                                            style: ElevatedButton.styleFrom(
                                              backgroundColor: Colors.redAccent,
                                              padding: const EdgeInsets.symmetric(vertical: 12),
                                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                              elevation: 0,
                                            ),
                                            child: Text('delete'.tr(), style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              
              // Stats
              Wrap(
                alignment: WrapAlignment.spaceEvenly,
                spacing: 16,
                runSpacing: 16,
                children: [
                  if (historyCategoryIndex == 0 || historyCategoryIndex == 3) ...[
                    _historyStatItem(
                      icon: Icons.directions_run_rounded,
                      value: log['run_1600m_seconds'] != null ? "${(log['run_1600m_seconds'] / 60).floor()}:${(log['run_1600m_seconds'] % 60).toInt().toString().padLeft(2, '0')} m" : "-",
                      label: "1600m",
                    ),
                    _historyStatItem(
                      icon: Icons.timer_rounded,
                      value: log['run_100m_seconds'] != null ? "${log['run_100m_seconds']} s" : "-",
                      label: "100m",
                    ),
                    _historyStatItem(
                      icon: Icons.sports_baseball_rounded,
                      value: log['shot_put_meters'] != null ? "${log['shot_put_meters']} m" : "-",
                      label: "Shot Put",
                    ),
                    for (final ev in customEvents)
                      _historyStatItem(
                        icon: Icons.star_rounded,
                        value: ev['input'] != null ? ev['input'].toString() : "-",
                        label: ev['name']?.toString() ?? "Custom",
                      ),
                  ],
                  if (historyCategoryIndex == 0 || historyCategoryIndex == 1) ...[
                    if (pushups != null && pushups > 0)
                      _historyStatItem(
                        icon: Icons.fitness_center_rounded,
                        value: "$pushups",
                        label: "Push-ups",
                      ),
                    if (situps != null && situps > 0)
                      _historyStatItem(
                        icon: Icons.accessibility_new_rounded,
                        value: "$situps",
                        label: "Sit-ups",
                      ),
                  ],
                  if (historyCategoryIndex == 0 || historyCategoryIndex == 2) ...[
                    if (stopwatchMs != null && stopwatchMs > 0)
                      _historyStatItem(
                        icon: Icons.timer_outlined,
                        value: cubit.formatTime(stopwatchMs),
                        label: "Stopwatch",
                      ),
                    if (laps.isNotEmpty)
                      _historyStatItem(
                        icon: Icons.flag_rounded,
                        value: "${laps.length}",
                        label: "Laps",
                      ),
                  ]
                ],
              ),
            ],
          ),
        );
      },
            ),
          ),
      ],
    );
  }

  Widget _buildHistoryCategoryTab(String title, int index) {
    final isSelected = historyCategoryIndex == index;
    return Expanded(
      child: GestureDetector(
        onTap: () {
          setState(() {
            historyCategoryIndex = index;
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: isSelected ? Constants.primaryBlueColour : Colors.transparent,
            borderRadius: BorderRadius.circular(20),
            boxShadow: isSelected
                ? [BoxShadow(color: Colors.black.withOpacity(0.1), blurRadius: 4, offset: const Offset(0, 2))]
                : null,
          ),
          child: Text(
            title,
            textAlign: TextAlign.center,
            style: commonTextStyle.copyWith(
              color: isSelected ? Colors.white : Colors.grey.shade600,
              fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
              fontSize: 12,
            ),
          ),
        ),
      ),
    );
  }

  Widget _historyStatItem({required IconData icon, required String value, required String label}) {
    return Container(
      width: 90,
      padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        children: [
          Icon(icon, color: Constants.primaryBlueColour, size: 20),
          const SizedBox(height: 8),
          Text(
            value,
            style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 14, color: Colors.black87),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: commonTextStyle.copyWith(fontSize: 10, color: Colors.grey.shade600),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }

  Widget _cardContainer({required Widget child}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: child,
    );
  }

  Widget _trackerCard({
    required String title,
    required int count,
    required int goal,
    required VoidCallback onAdd,
    required VoidCallback onReset,
  }) {
    final progress = count / goal;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 15),
              ),
              IconButton(
                icon: const Icon(Icons.rotate_left, color: Colors.grey, size: 20),
                onPressed: onReset,
              ),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              SizedBox(
                height: 70,
                width: 70,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    CircularProgressIndicator(
                      value: progress,
                      backgroundColor: Colors.grey.shade200,
                      valueColor: const AlwaysStoppedAnimation<Color>(Constants.primaryBlueColour),
                      strokeWidth: 8,
                    ),
                    Text(
                      "${(progress * 100).toInt()}%",
                      style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 20),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "$count / $goal reps",
                      style: commonTextStyle.copyWith(fontSize: 16, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 5),
                    Text(
                      'click_button_to_count_reps'.tr(),
                      style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey),
                    ),
                  ],
                ),
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  shape: const CircleBorder(),
                  padding: const EdgeInsets.all(14),
                  backgroundColor: Constants.primaryBlueColour,
                ),
                onPressed: onAdd,
                child: const Icon(Icons.add, color: Colors.white),
              )
            ],
          ),
        ],
      ),
    );
  }

  Widget _standardItem({required String title, required String desc, required String score}) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: Colors.grey.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13)),
                const SizedBox(height: 3),
                Text(desc, style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: Colors.amber.shade100,
              borderRadius: BorderRadius.circular(5),
            ),
            child: Text(
              score,
              style: commonTextStyle.copyWith(
                  fontWeight: FontWeight.bold, fontSize: 11, color: Colors.amber.shade900),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildModernStopwatchButton({
    required IconData icon,
    required String label,
    required Color color,
    required Color backgroundColor,
    required VoidCallback? onTap,
    bool isLarge = false,
  }) {
    final double size = isLarge ? 80 : 60;
    final double iconSize = isLarge ? 36 : 28;

    return Column(
      children: [
        GestureDetector(
          onTap: onTap,
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 200),
            width: size,
            height: size,
            decoration: BoxDecoration(
              color: onTap == null ? Colors.grey.shade200 : backgroundColor,
              shape: BoxShape.circle,
              boxShadow: onTap != null
                  ? [
                      BoxShadow(
                        color: backgroundColor.withOpacity(0.4),
                        blurRadius: 15,
                        offset: const Offset(0, 8),
                      )
                    ]
                  : [],
            ),
            child: Icon(icon, color: onTap == null ? Colors.grey.shade400 : color, size: iconSize),
          ),
        ),
        const SizedBox(height: 12),
        Text(
          label,
          style: commonTextStyle.copyWith(
            color: onTap != null ? Colors.black87 : Colors.grey,
            fontWeight: FontWeight.w600,
            fontSize: 13,
          ),
        ),
      ],
    );
  }

  Widget _genderButton({
    required String label,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? Constants.primaryBlueColour : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected ? Constants.primaryBlueColour : const Color(0xFFE2E8F0),
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: Constants.primaryBlueColour.withOpacity(0.25),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  )
                ]
              : null,
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              icon,
              color: isSelected ? Colors.white : const Color(0xFF64748B),
              size: 20,
            ),
            const SizedBox(width: 8),
            Text(
              label,
              style: commonTextStyle.copyWith(
                color: isSelected ? Colors.white : const Color(0xFF475569),
                fontWeight: FontWeight.bold,
                fontSize: 13,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _calculatorInputRow({
    required String title,
    required String subTitle,
    required String score,
    TextEditingController? controller,
    String? hint,
  }) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFF1F5F9)),
      ),
      child: Row(
        children: [
          Expanded(
            flex: 3,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13.5),
                ),
                const SizedBox(height: 3),
                Text(
                  subTitle,
                  style: commonTextStyle.copyWith(fontSize: 11, color: Colors.grey.shade600),
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            flex: 2,
            child: Container(
              height: 42,
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: CommonTextFormField(
                      controller: controller,
                      keyboardType: const TextInputType.numberWithOptions(decimal: true),
                      customTextStyle: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 14),
                      hintText: hint,
                      maxLength: null,
                      inputFormatters: [DoubleOrTimeInputFormatter()],
                      contentPadding: const EdgeInsets.only(left: 8, bottom: 8),
                      fillColor: Colors.transparent,
                      border: InputBorder.none,
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: Text(
                      title.contains("100") || title.contains("१०० मी")
                          ? 's'
                          : (title.contains("Run") || title.contains("धावणे") ? 'min' : 'm'),
                      style: const TextStyle(fontSize: 10, color: Colors.grey),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(
              score,
              style: commonTextStyle.copyWith(
                fontWeight: FontWeight.bold,
                fontSize: 11,
                color: Constants.primaryBlueColour,
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _showAddEventBottomSheet(BuildContext context, PhysicalPrepCubit cubit) {
    final nameController = TextEditingController();
    final maxMarksController = TextEditingController();
    
    // Rule Specific Controllers
    final achievedController = TextEditingController(); // for direct
    final ruleValueController = TextEditingController(); // for multiplier
    final repsController = TextEditingController();      // for multiplier count
    final targetValueController = TextEditingController(); // for threshold target
    final rawInputController = TextEditingController();    // for threshold actual result

    String selectedRuleType = 'direct'; // 'direct', 'multiplier', 'threshold'
    String targetComparison = '>='; // '>=', '<='

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return Padding(
              padding: EdgeInsets.only(
                left: 20,
                right: 20,
                top: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          'add_custom_event'.tr(),
                          style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 18),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    
                    // Event Name
                    Text(
                      'event_name_e_g_long_jump_pull_ups'.tr(),
                      style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(height: 8),
                    CommonTextFormField(
                      controller: nameController,
                      hintText: 'e_g_long_jump_pull_ups'.tr(),
                    ),
                    const SizedBox(height: 16),

                    // Max Marks
                    Text(
                      'maximum_total_marks'.tr(),
                      style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(height: 8),
                    CommonTextFormField(
                      controller: maxMarksController,
                      keyboardType: TextInputType.number,
                      hintText: '15'.tr().tr(),
                    ),
                    const SizedBox(height: 18),

                    // Scoring Rule Selector Dropdown/Segment
                    Text(
                      'select_scoring_rule_type'.tr(),
                      style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: selectedRuleType,
                          isExpanded: true,
                          icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.grey),
                          items: [
                            DropdownMenuItem(
                              value: 'direct',
                              child: Text(
                                'direct_score_input'.tr(),
                                style: commonTextStyle.copyWith(fontSize: 13, fontWeight: FontWeight.w500),
                              ),
                            ),
                            DropdownMenuItem(
                              value: 'multiplier',
                              child: Text(
                                'per_rep_count_multiplier'.tr(),
                                style: commonTextStyle.copyWith(fontSize: 13, fontWeight: FontWeight.w500),
                              ),
                            ),
                            DropdownMenuItem(
                              value: 'threshold',
                              child: Text(
                                'target_pass_fail_threshold'.tr(),
                                style: commonTextStyle.copyWith(fontSize: 13, fontWeight: FontWeight.w500),
                              ),
                            ),
                          ],
                          onChanged: (val) {
                            if (val != null) {
                              setState(() {
                                selectedRuleType = val;
                              });
                            }
                          },
                        ),
                      ),
                    ),
                    const SizedBox(height: 18),

                    // DYNAMIC FIELDS BASED ON RULE TYPE
                    if (selectedRuleType == 'direct') ...[
                      Text(
                        'your_achieved_marks'.tr(),
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      CommonTextFormField(
                        controller: achievedController,
                        keyboardType: TextInputType.number,
                        hintText: '12'.tr().tr(),
                      ),
                    ] else if (selectedRuleType == 'multiplier') ...[
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'marks_per_rep'.tr(),
                                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 12.5),
                                ),
                                const SizedBox(height: 8),
                                CommonTextFormField(
                                  controller: ruleValueController,
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  hintText: '4_0'.tr(),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'your_reps_count'.tr(),
                                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 12.5),
                                ),
                                const SizedBox(height: 8),
                                CommonTextFormField(
                                  controller: repsController,
                                  keyboardType: TextInputType.number,
                                  hintText: '10'.tr().tr(),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ] else if (selectedRuleType == 'threshold') ...[
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'comparison'.tr(),
                                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 12.5),
                                ),
                                const SizedBox(height: 8),
                                Container(
                                  height: 45,
                                  padding: const EdgeInsets.symmetric(horizontal: 10),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFF8FAFC),
                                    borderRadius: BorderRadius.circular(10),
                                    border: Border.all(color: const Color(0xFFE2E8F0)),
                                  ),
                                  child: DropdownButtonHideUnderline(
                                    child: DropdownButton<String>(
                                      value: targetComparison,
                                      isExpanded: true,
                                      items: [
                                        DropdownMenuItem(
                                          value: '>=',
                                          child: Text(
                                            'at_least'.tr(),
                                            style: commonTextStyle.copyWith(fontSize: 12.5),
                                          ),
                                        ),
                                        DropdownMenuItem(
                                          value: '<=',
                                          child: Text(
                                            'at_most'.tr(),
                                            style: commonTextStyle.copyWith(fontSize: 12.5),
                                          ),
                                        ),
                                      ],
                                      onChanged: (val) {
                                        if (val != null) {
                                          setState(() {
                                            targetComparison = val;
                                          });
                                        }
                                      },
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 16),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'target_value'.tr(),
                                  style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 12.5),
                                ),
                                const SizedBox(height: 8),
                                CommonTextFormField(
                                  controller: targetValueController,
                                  keyboardType: const TextInputType.numberWithOptions(decimal: true),
                                  hintText: '14_0'.tr(),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'your_actual_result_value'.tr(),
                        style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      const SizedBox(height: 8),
                      CommonTextFormField(
                        controller: rawInputController,
                        keyboardType: const TextInputType.numberWithOptions(decimal: true),
                        hintText: '14_5'.tr(),
                      ),
                    ],

                    const SizedBox(height: 28),

                    // Submit Button
                    SizedBox(
                      width: double.infinity,
                      height: 48,
                      child: ElevatedButton(
                        onPressed: () {
                          final name = nameController.text.trim();
                          final maxMarks = int.tryParse(maxMarksController.text) ?? 0;

                          if (name.isEmpty || maxMarks <= 0) {
                            return;
                          }

                          String rawInput = '';
                          double ruleValue = 0.0;
                          double targetValue = 0.0;

                          if (selectedRuleType == 'direct') {
                            rawInput = achievedController.text.trim();
                          } else if (selectedRuleType == 'multiplier') {
                            ruleValue = double.tryParse(ruleValueController.text) ?? 0.0;
                            rawInput = repsController.text.trim();
                          } else if (selectedRuleType == 'threshold') {
                            targetValue = double.tryParse(targetValueController.text) ?? 0.0;
                            rawInput = rawInputController.text.trim();
                          }

                          cubit.addCustomEvent(
                            name: name,
                            maxMarks: maxMarks,
                            scoringType: selectedRuleType,
                            ruleValue: ruleValue,
                            targetValue: targetValue,
                            targetComparison: targetComparison,
                            rawInput: rawInput,
                          );

                          Navigator.pop(context);
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Constants.primaryBlueColour,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: Text(
                          'save_event'.tr(),
                          style: commonTextStyle.copyWith(
                            fontWeight: FontWeight.bold,
                            fontSize: 14,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  String _getParsedRunningTimeDescription(String timeStr) {
    double runMinVal = 0;
    double runSecVal = 0;
    final cleanTime = timeStr.trim().replaceAll(' ', '');
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
    final min = runMinVal.toInt();
    final sec = runSecVal.toInt();
    return "Parsed: $min min $sec sec";
  }

  void _showScoringRulesBottomSheet(BuildContext context, String gender) {
    final isMale = gender == 'male';

    final runData = isMale
        ? [
            {"label": "<= 5.10 mins", "marks": 20},
            {"label": "5.10 to 5.30", "marks": 18},
            {"label": "5.30 to 5.50", "marks": 15},
            {"label": "5.50 to 6.10", "marks": 12},
            {"label": "6.10 to 6.30", "marks": 10},
            {"label": "6.30 to 7.00", "marks": 8},
            {"label": "7.00 to 7.30", "marks": 5},
            {"label": "> 7.30 mins", "marks": 0},
          ]
        : [
            {"label": "<= 2.50 mins", "marks": 20},
            {"label": "2.50 to 3.00", "marks": 18},
            {"label": "3.00 to 3.10", "marks": 15},
            {"label": "3.10 to 3.20", "marks": 12},
            {"label": "3.20 to 3.30", "marks": 10},
            {"label": "3.30 to 3.40", "marks": 8},
            {"label": "3.40 to 4.00", "marks": 5},
            {"label": "> 4.00 mins", "marks": 0},
          ];

    final sprintData = isMale
        ? [
            {"label": "<= 11.50 secs", "marks": 15},
            {"label": "11.50 to 12.50", "marks": 12},
            {"label": "12.50 to 13.50", "marks": 10},
            {"label": "13.50 to 14.50", "marks": 8},
            {"label": "14.50 to 15.50", "marks": 6},
            {"label": "15.50 to 16.50", "marks": 4},
            {"label": "> 16.50 secs", "marks": 0},
          ]
        : [
            {"label": "<= 14.00 secs", "marks": 15},
            {"label": "14.00 to 15.00", "marks": 12},
            {"label": "15.00 to 16.00", "marks": 10},
            {"label": "16.00 to 17.00", "marks": 8},
            {"label": "17.00 to 18.00", "marks": 6},
            {"label": "18.00 to 19.00", "marks": 4},
            {"label": "> 19.00 secs", "marks": 0},
          ];

    final shotPutData = isMale
        ? [
            {"label": ">= 8.50 meters", "marks": 15},
            {"label": "7.90 to 8.50", "marks": 12},
            {"label": "7.30 to 7.90", "marks": 10},
            {"label": "6.70 to 7.30", "marks": 8},
            {"label": "6.10 to 6.70", "marks": 6},
            {"label": "5.50 to 6.10", "marks": 4},
            {"label": "< 5.50 meters", "marks": 0},
          ]
        : [
            {"label": ">= 6.00 meters", "marks": 15},
            {"label": "5.50 to 6.00", "marks": 12},
            {"label": "5.00 to 5.50", "marks": 10},
            {"label": "4.50 to 5.00", "marks": 8},
            {"label": "4.00 to 4.50", "marks": 5},
            {"label": "< 4.00 meters", "marks": 0},
          ];

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return Container(
          height: MediaQuery.of(ctx).size.height * 0.75,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            children: [
              Container(
                margin: const EdgeInsets.only(top: 12, bottom: 8),
                height: 5,
                width: 40,
                decoration: BoxDecoration(color: Colors.grey.shade300, borderRadius: BorderRadius.circular(10)),
              ),
              Text(
                isMale ? "Male Scoring Rules" : "Female Scoring Rules",
                style: commonTextStyle.copyWith(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 12),
              Expanded(
                child: DefaultTabController(
                  length: 3,
                  child: Column(
                    children: [
                      TabBar(
                        labelColor: Constants.primaryBlueColour,
                        unselectedLabelColor: Colors.grey,
                        indicatorColor: Constants.primaryBlueColour,
                        labelStyle: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13),
                        tabs: [
                          Tab(text: isMale ? "1600m Run" : "800m Run"),
                          const Tab(text: "100m Sprint"),
                          const Tab(text: "Shot Put"),
                        ],
                      ),
                      Expanded(
                        child: TabBarView(
                          children: [
                            _buildRuleTable(runData, "Timing"),
                            _buildRuleTable(sprintData, "Timing"),
                            _buildRuleTable(shotPutData, "Distance"),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildRuleTable(List<Map<String, dynamic>> data, String headerLabel) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey.shade300),
          borderRadius: BorderRadius.circular(12),
        ),
        child: DataTable(
          headingRowColor: WidgetStateProperty.all(Colors.grey.shade100),
          columns: [
            DataColumn(label: Text(headerLabel, style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13))),
            DataColumn(label: Text("Marks", style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13))),
          ],
          rows: data.map((e) {
            return DataRow(
              cells: [
                DataCell(Text(e["label"] as String, style: commonTextStyle.copyWith(fontSize: 13, fontWeight: FontWeight.w500))),
                DataCell(Text("${e["marks"]}", style: commonTextStyle.copyWith(fontSize: 13, fontWeight: FontWeight.bold, color: Constants.primaryBlueColour))),
              ],
            );
          }).toList(),
        ),
      ),
    );
  }

  void _showAddPlayerDialog(BuildContext context, PhysicalPrepCubit cubit) {
    final controller = TextEditingController();
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Add Player', style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16)),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: 'Enter Player Name'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              cubit.addSavedPlayer(controller.text);
              Navigator.pop(ctx);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Constants.primaryBlueColour),
            child: const Text('Add', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showEditPlayerDialog(BuildContext context, PhysicalPrepCubit cubit, String oldName) {
    final controller = TextEditingController(text: oldName);
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Edit Player', style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 16)),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(hintText: 'Enter Player Name'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              cubit.editSavedPlayer(oldName, controller.text);
              Navigator.pop(ctx);
            },
            style: ElevatedButton.styleFrom(backgroundColor: Constants.primaryBlueColour),
            child: const Text('Save', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showSaveDialog(BuildContext context, PhysicalPrepCubit cubit) {
    showDialog(
      context: context,
      builder: (ctx) {
        return BlocBuilder<PhysicalPrepCubit, PhysicalPrepState>(
          builder: (context, state) {
            String? activePlayer = state.savedPlayers.contains(state.playerName) 
                ? state.playerName 
                : (state.savedPlayers.isNotEmpty ? state.savedPlayers.first : null);

            return Dialog(
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
              child: Padding(
                padding: const EdgeInsets.all(24.0),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.save_rounded, size: 50, color: Constants.primaryGreenColour),
                    const SizedBox(height: 16),
                    Text(
                      'saving_fitness_log'.tr(),
                      style: commonTextStyle.copyWith(fontSize: 18, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 20),
                    
                    if (state.savedPlayers.isNotEmpty)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.grey.shade300),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: activePlayer,
                            isExpanded: true,
                            items: state.savedPlayers.map((p) => DropdownMenuItem(value: p, child: Text(p, style: commonTextStyle.copyWith(fontSize: 14)))).toList(),
                            onChanged: (val) {
                              if (val != null) cubit.updatePlayerName(val);
                            },
                          ),
                        ),
                      ),
                    
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        TextButton.icon(
                          onPressed: () => _showAddPlayerDialog(context, cubit),
                          icon: const Icon(Icons.add_circle_outline, size: 18, color: Constants.primaryBlueColour),
                          label: Text("Add", style: commonTextStyle.copyWith(color: Constants.primaryBlueColour, fontWeight: FontWeight.bold, fontSize: 12)),
                        ),
                        if (activePlayer != null)
                          TextButton.icon(
                            onPressed: () => _showEditPlayerDialog(context, cubit, activePlayer),
                            icon: const Icon(Icons.edit_outlined, size: 18, color: Colors.grey),
                            label: Text("Edit", style: commonTextStyle.copyWith(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 12)),
                          ),
                      ],
                    ),

                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: () => Navigator.pop(ctx),
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                              side: BorderSide(color: Colors.grey.shade300),
                            ),
                            child: Text('cancel'.tr(), style: commonTextStyle.copyWith(color: Colors.grey.shade700, fontWeight: FontWeight.bold)),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: ElevatedButton(
                        onPressed: () async {
                          Navigator.pop(ctx);
                          ScaffoldMessenger.of(context).showSnackBar(
                             SnackBar(content: Text('saving_fitness_log'.tr())),
                          );
                          await cubit.saveFitnessLog();
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                               SnackBar(
                                content: Text('fitness_log_saved_successfully'.tr()),
                                backgroundColor: Colors.green,
                              ),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Constants.primaryGreenColour,
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          elevation: 0,
                        ),
                        child: Text('save'.tr(), style: commonTextStyle.copyWith(color: Colors.white, fontWeight: FontWeight.bold)),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          );
        });
      },
    );
  }
}

class DoubleOrTimeInputFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    final text = newValue.text;
    
    // Allow empty text
    if (text.isEmpty) {
      return newValue;
    }

    // Only allow digits, dot, and colon
    final allowedRegex = RegExp(r'^[0-9.:]*$');
    if (!allowedRegex.hasMatch(text)) {
      return oldValue;
    }

    // Count separators (dots + colons)
    int separatorCount = 0;
    for (int i = 0; i < text.length; i++) {
      if (text[i] == '.' || text[i] == ':') {
        separatorCount++;
      }
    }

    // If more than 1 separator combined, reject the edit
    if (separatorCount > 1) {
      return oldValue;
    }

    return newValue;
  }
}
