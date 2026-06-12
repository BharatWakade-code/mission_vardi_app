import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/screens/physical_prep_module/physical_prep_cubit.dart';
import 'package:mission_vardi/screens/physical_prep_module/physical_prep_state.dart';
import 'package:mission_vardi/utils/common_widgets/commonTextField.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:mission_vardi/screens/localization_module/locale_cubit.dart';

class PhysicalPrepScreen extends StatefulWidget {
  const PhysicalPrepScreen({super.key});

  @override
  State<PhysicalPrepScreen> createState() => _PhysicalPrepScreenState();
}

class _PhysicalPrepScreenState extends State<PhysicalPrepScreen> {
  late final TextEditingController runningTimeController;
  late final TextEditingController sprintController;
  late final TextEditingController shotPutController;

  @override
  void initState() {
    super.initState();
    final cubit = context.read<PhysicalPrepCubit>();
    runningTimeController = TextEditingController(text: cubit.state.runningTime);
    sprintController = TextEditingController(text: cubit.state.sprint);
    shotPutController = TextEditingController(text: cubit.state.shotPut);

    runningTimeController.addListener(() {
      cubit.updateRunningTime(runningTimeController.text);
    });
    sprintController.addListener(() {
      cubit.updateSprint(sprintController.text);
    });
    shotPutController.addListener(() {
      cubit.updateShotPut(shotPutController.text);
    });
  }

  @override
  void dispose() {
    runningTimeController.dispose();
    sprintController.dispose();
    shotPutController.dispose();
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
          length: 3,
          child: Scaffold(
            backgroundColor: Constants.scaffoldBackgroundColour,
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
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.fitness_center, size: 14),
                            const SizedBox(width: 4),
                            Text('workout'.tr()),
                          ],
                        ),
                      ),
                      Tab(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.timer_outlined, size: 14),
                            const SizedBox(width: 4),
                            Text('timer'.tr()),
                          ],
                        ),
                      ),
                      Tab(
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            const Icon(Icons.calculate_rounded, size: 14),
                            const SizedBox(width: 4),
                            Text('calculator'.tr()),
                          ],
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
                    ],
                  ),
                ),

                // 2. Running Stopwatch Tab
                Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      const SizedBox(height: 20),
                      Container(
                        padding: const EdgeInsets.symmetric(vertical: 30, horizontal: 20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(20),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.04),
                              blurRadius: 10,
                              offset: const Offset(0, 5),
                            ),
                          ],
                          border: Border.all(color: Colors.grey.shade200),
                        ),
                        child: Column(
                          children: [
                            Text(
                              'running_stopwatch'.tr(),
                              style: commonTextStyle.copyWith(color: Colors.grey, fontWeight: FontWeight.bold),
                            ),
                            const SizedBox(height: 15),
                            Text(
                              cubit.formatTime(state.stopwatchMilliseconds),
                              style: commonTextStyle.copyWith(
                                fontSize: 48,
                                fontWeight: FontWeight.bold,
                                color: Constants.primaryBlueColour,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 30),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _stopwatchButton(
                            icon: Icons.refresh,
                            color: Colors.grey.shade400,
                            onTap: cubit.resetStopwatch,
                          ),
                          _stopwatchButton(
                            icon: state.isStopwatchRunning ? Icons.pause : Icons.play_arrow,
                            color: state.isStopwatchRunning ? Colors.red : Colors.green,
                            isLarge: true,
                            onTap: state.isStopwatchRunning ? cubit.stopStopwatch : cubit.startStopwatch,
                          ),
                          _stopwatchButton(
                            icon: Icons.flag,
                            color: Colors.blue.shade400,
                            onTap: state.isStopwatchRunning ? cubit.recordLap : null,
                          ),
                        ],
                      ),
                      const SizedBox(height: 30),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            'recorded_splits'.tr(),
                            style: commonTextStyle.copyWith(fontWeight: FontWeight.bold),
                          ),
                          Text(
                            "${state.lapTimes.length} laps",
                            style: commonTextStyle.copyWith(color: Colors.grey, fontSize: 12),
                          ),
                        ],
                      ),
                      const Divider(),

                      Expanded(
                        child: state.lapTimes.isEmpty
                            ? Center(
                                child: Text(
                                  'start_timer_desc'.tr(),
                                  style: commonTextStyle.copyWith(color: Colors.grey, fontSize: 13),
                                ),
                              )
                            : ListView.separated(
                                itemCount: state.lapTimes.length,
                                separatorBuilder: (_, __) => const Divider(),
                                itemBuilder: (context, index) {
                                  return Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 8),
                                    child: Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          "Lap ${state.lapTimes.length - index}",
                                          style: commonTextStyle.copyWith(fontWeight: FontWeight.w600),
                                        ),
                                        Text(
                                          state.lapTimes[index],
                                          style: commonTextStyle.copyWith(
                                              fontSize: 16, fontWeight: FontWeight.bold, color: Colors.black87),
                                        ),
                                      ],
                                    ),
                                  );
                                },
                              ),
                      ),
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
                      const SizedBox(height: 14),

                      // 'save_fitness_log'.tr() Button
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton.icon(
                          onPressed: () async {
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
                          icon: const Icon(Icons.save_rounded, size: 20, color: Colors.white),
                          label: Text(
                            'save_fitness_log'.tr(),
                            style: commonTextStyle.copyWith(fontWeight: FontWeight.bold, fontSize: 13.5, color: Colors.white),
                          ),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Constants.primaryGreenColour,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 30),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
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

  Widget _stopwatchButton({
    required IconData icon,
    required Color color,
    bool isLarge = false,
    required VoidCallback? onTap,
  }) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(isLarge ? 20 : 14),
        decoration: BoxDecoration(
          color: onTap == null ? Colors.grey.shade100 : color,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: (onTap == null ? Colors.transparent : color).withOpacity(0.3),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Icon(icon, color: Colors.white, size: isLarge ? 30 : 22),
      ),
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
            runSecVal = double.tryParse(parts[1]) ?? 0;
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
