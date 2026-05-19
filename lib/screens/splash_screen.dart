import 'dart:async';
import 'package:flutter/material.dart';

class MissionVardiSplash extends StatefulWidget {
  const MissionVardiSplash({super.key});

  @override
  State<MissionVardiSplash> createState() => _MissionVardiSplashState();
}

class _MissionVardiSplashState extends State<MissionVardiSplash> {
  bool _isExpanded = false;
  bool _isWhiteBackground = false;
  bool _showLogo = false;

  @override
  void initState() {
    super.initState();
    _startAnimation();
  }

  void _startAnimation() async {
    // Phase 1: Expand green shapes
    await Future.delayed(const Duration(milliseconds: 500));
    if (!mounted) return;
    setState(() => _isExpanded = true);

    // Phase 2: Change background to white
    await Future.delayed(const Duration(milliseconds: 800));
    if (!mounted) return;
    setState(() => _isWhiteBackground = true);

    // Phase 3: Show logo
    await Future.delayed(const Duration(milliseconds: 300));
    if (!mounted) return;
    setState(() => _showLogo = true);

    // Phase 4: Navigate (optional)
    await Future.delayed(const Duration(seconds: 3));
    if (!mounted) return;
    // Navigator.pushReplacement(
    //   context,
    //   MaterialPageRoute(builder: (_) => const LoginScreen()),
    // );
  }

  @override
  Widget build(BuildContext context) {
    final screenHeight = MediaQuery.of(context).size.height;
    final screenWidth = MediaQuery.of(context).size.width;

    return Scaffold(
      backgroundColor: Colors.white,
      body: Stack(
        children: [
          /// Bottom Left Animated Shape
          AnimatedPositioned(
            duration: const Duration(milliseconds: 1000),
            curve: Curves.easeInOutQuart,
            bottom: _isExpanded ? -100 : 20,
            left: _isExpanded ? -100 : 20,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 1000),
              curve: Curves.easeInOutQuart,
              height: _isExpanded ? screenHeight * 1.5 : 150,
              width: _isExpanded ? screenWidth * 1.5 : 150,
              decoration: BoxDecoration(
                color: _isWhiteBackground
                    ? Colors.white
                    : const Color(0xFF0D47A1),
                borderRadius:
                BorderRadius.circular(_isExpanded ? 0 : 40),
              ),
            ),
          ),

          /// Top Right Animated Shape
          AnimatedPositioned(
            duration: const Duration(milliseconds: 1000),
            curve: Curves.easeInOutQuart,
            top: _isExpanded ? -100 : 20,
            right: _isExpanded ? -100 : 20,
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 1000),
              curve: Curves.easeInOutQuart,
              height: _isExpanded ? screenHeight * 1.5 : 150,
              width: _isExpanded ? screenWidth * 1.5 : 150,
              decoration: BoxDecoration(
                color: _isWhiteBackground
                    ? Colors.white
                    : const Color(0xFF0D47A1),
                borderRadius:
                BorderRadius.circular(_isExpanded ? 0 : 40),
              ),
            ),
          ),

          /// Logo Animation
          Center(
            child: AnimatedOpacity(
              duration: const Duration(milliseconds: 800),
              opacity: _showLogo ? 1.0 : 0.0,
              child: AnimatedScale(
                duration: const Duration(milliseconds: 800),
                curve: Curves.easeOutBack,
                scale: _showLogo ? 1.0 : 0.8,
                child: Image.asset(
                  'assets/images/app_logo.png',
                  width: 250,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
