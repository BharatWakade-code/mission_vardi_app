import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';

import 'package:flutter/material.dart';

class CommonLoader {
  static bool _isShowing = false;

  static void show(BuildContext context) {
    if (_isShowing) return;

    _isShowing = true;

    showDialog(
      context: context,
      barrierDismissible: false,
      barrierColor: Colors.black.withOpacity(0.3),
      builder: (_) {
        return const Center(
          child: CircularProgressIndicator(),
        );
      },
    );
  }

  static void hide(BuildContext context) {
    if (_isShowing) {
      Navigator.of(context, rootNavigator: true).pop();
      _isShowing = false;
    }
  }
}

class CommonShimmerListLoader extends StatelessWidget {
  const CommonShimmerListLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: const Color(0xFFE8F5E9), // light green (soft base)
      highlightColor: const Color(0xFFC8E6C9), // brighter green highlight
      child: ListView.builder(
        itemCount: 7,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemBuilder: (context, index) {
          return Container(
            width: double.infinity,
            height: 100,
            margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(
                color: const Color(0xFFE0E0E0),
                width: 1.2,
              ),
            ),
          );
        },
      ),
    );
  }
}

class CommonShimmerBoxLoader extends StatelessWidget {
  final double? height;
  final EdgeInsetsGeometry? margin;
  const CommonShimmerBoxLoader({super.key,this.height ,this.margin});

  @override
  Widget build(BuildContext context) {
    return Shimmer.fromColors(
      baseColor: Colors.grey[300]!,
      highlightColor: Colors.grey[100]!,
      child: Container(
        width: double.infinity,
        height: height,
        margin: margin,
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(
            color: Colors.grey.shade200,
            width: 1.2,
          ),
        ),
      ),
    );
  }
}
