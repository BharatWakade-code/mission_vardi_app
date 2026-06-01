import 'package:flutter/material.dart';
import 'package:mission_vardi/utils/common_widgets/common_app_bar.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/network_services/api_services.dart';

import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_cubit.dart';
import 'package:mission_vardi/screens/quizzes_module/quizzes_state.dart';

class LeaderboardScreen extends StatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  State<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends State<LeaderboardScreen> {
  final List<String> _districts = const [
    'All Maharashtra',
    'Ahmednagar', 'Akola', 'Amravati', 'Chhatrapati Sambhajinagar (Aurangabad)', 
    'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 
    'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 
    'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Dharashiv (Osmanabad)', 'Palghar', 
    'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 
    'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
  ];

  @override
  void initState() {
    super.initState();
    // Fetch leaderboard initially
    context.read<QuizzesCubit>().getLeaderboardList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Constants.scaffoldBackgroundColour,
      appBar: CustomAppBar(
        titleText: 'Leaderboard',
        titleIcon: Icons.emoji_events_rounded,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
      ),
      body: Column(
        children: [
          // Filter section
          BlocBuilder<QuizzesCubit, QuizzesState>(
            builder: (context, state) {
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: [
                    BoxShadow(
                      color: Colors.grey.withOpacity(0.05),
                      blurRadius: 5,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(Icons.filter_list_rounded, color: Colors.grey, size: 20),
                    const SizedBox(width: 12),
                    Expanded(
                      child: DropdownButtonHideUnderline(
                        child: DropdownButton<String>(
                          value: state.selectedDistrict,
                          isExpanded: true,
                          icon: const Icon(Icons.keyboard_arrow_down_rounded, color: Colors.grey),
                          style: const TextStyle(
                            fontFamily: 'Outfit',
                            fontSize: 15,
                            fontWeight: FontWeight.w600,
                            color: Color(0xFF0A2540),
                          ),
                          onChanged: (String? newValue) {
                            if (newValue != null) {
                              context.read<QuizzesCubit>().changeSelectedDistrict(newValue);
                            }
                          },
                          items: _districts.map<DropdownMenuItem<String>>((String value) {
                            return DropdownMenuItem<String>(
                              value: value,
                              child: Text(value),
                            );
                          }).toList(),
                        ),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
          
          // Leaderboard List
          Expanded(
            child: BlocBuilder<QuizzesCubit, QuizzesState>(
              builder: (context, state) {
                if (state.isLoading) {
                  return const Center(child: CircularProgressIndicator());
                }
                
                if (state.errorMsg.isNotEmpty) {
                  return Center(
                    child: Text(
                      state.errorMsg,
                      style: TextStyle(fontFamily: 'Outfit', color: Colors.red.shade400),
                    ),
                  );
                }
                
                if (state.leaderboardData.isEmpty) {
                  return Center(
                    child: Text(
                      'No top performers found for this region.',
                      style: TextStyle(
                        fontFamily: 'Outfit',
                        color: Colors.grey.shade600,
                        fontSize: 16,
                      ),
                    ),
                  );
                }
                
                return ListView.builder(
                  padding: const EdgeInsets.all(16),
                  itemCount: state.leaderboardData.length,
                  itemBuilder: (context, index) {
                    final item = state.leaderboardData[index];
                              final isTopRank = index == 0;
                              final isSecond = index == 1;
                              final isThird = index == 2;

                              Color rankColor = Colors.grey.shade500;
                              if (isTopRank) rankColor = Colors.amber;
                              if (isSecond) rankColor = Colors.grey.shade400;
                              if (isThird) rankColor = Colors.orange.shade300;

                              return Card(
                                margin: const EdgeInsets.only(bottom: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                elevation: 1,
                                child: ListTile(
                                  contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                                  leading: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Text(
                                        "#${index + 1}",
                                        style: TextStyle(
                                          fontFamily: 'Outfit',
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                          color: rankColor,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      CircleAvatar(
                                        backgroundColor: rankColor.withOpacity(0.15),
                                        child: Icon(
                                          isTopRank ? Icons.emoji_events_rounded : Icons.person_rounded,
                                          color: rankColor,
                                        ),
                                      ),
                                    ],
                                  ),
                                  title: Text(
                                    item['name'] ?? 'Unknown User',
                                    style: const TextStyle(
                                      fontFamily: 'Outfit',
                                      fontWeight: FontWeight.bold,
                                      fontSize: 15,
                                    ),
                                  ),
                                  subtitle: (item['district'] != null)
                                      ? Text(
                                          item['district'],
                                          style: TextStyle(
                                            fontFamily: 'Outfit',
                                            fontSize: 12,
                                            color: Colors.grey.shade600,
                                          ),
                                        )
                                      : null,
                                  trailing: Column(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    crossAxisAlignment: CrossAxisAlignment.end,
                                    children: [
                                      Text(
                                        '${item['points'] ?? 0}',
                                        style: TextStyle(
                                          fontFamily: 'Outfit',
                                          fontWeight: FontWeight.bold,
                                          fontSize: 16,
                                          color: Constants.primaryBlueColour,
                                        ),
                                      ),
                                      Text(
                                        'Pts',
                                        style: TextStyle(
                                          fontFamily: 'Outfit',
                                          fontSize: 10,
                                          color: Colors.grey.shade500,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
