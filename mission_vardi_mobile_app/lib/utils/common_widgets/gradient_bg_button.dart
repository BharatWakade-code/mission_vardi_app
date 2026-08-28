import 'dart:ui' as ui;
import 'package:flutter/material.dart';

class NeonGradientCardDemo extends StatelessWidget {
  const NeonGradientCardDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return const Center(
      child: NeonCard(
        intensity: 0.6,
        glowSpread: 1.3,
        child: Padding(
          padding: EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: GradientText(
            text: 'AI MODE',
            fontSize: 14,
            gradientColors: [
              Color(0xFFFFFFFF), // White
              Color(0xFF00BFFF), // Deep Sky Blue
              Color(0xFF1E90FF), // Dodger Blue
            ],
          ),
        ),
      ),
    );
  }
}

class NeonCard extends StatefulWidget {
  final Widget child;
  final double intensity;
  final double glowSpread;

  const NeonCard({
    super.key,
    required this.child,
    this.intensity = 0.5,
    this.glowSpread = 2.0,
  });

  @override
  _NeonCardState createState() => _NeonCardState();
}

class _NeonCardState extends State<NeonCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 4),
      vsync: this,
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: AnimatedBuilder(
        animation: _controller,
        builder: (_, __) {
          return CustomPaint(
            painter: GlowRectanglePainter(
              progress: _controller.value,
              intensity: widget.intensity,
              glowSpread: widget.glowSpread,
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(18),
              child: Container(
                color: Colors.black.withOpacity(0.85),
                child: widget.child,
              ),
            ),
          );
        },
      ),
    );
  }
}

class GlowRectanglePainter extends CustomPainter {
  final double progress;
  final double intensity;
  final double glowSpread;

  GlowRectanglePainter({
    required this.progress,
    this.intensity = 0.4,
    this.glowSpread = 2.0,
  });

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = size.width * glowSpread;

    const colorBlue = Color(0xFF00BFFF);
    const colorWhite = Color(0xFFFFFFFF);

    final mixedColor = Color.lerp(colorWhite, colorBlue, progress)!;

    final radialShader = ui.Gradient.radial(
      center,
      radius,
      [
        mixedColor.withOpacity(intensity),
        mixedColor.withOpacity(0.0),
      ],
    );

    final glowPaint = Paint()
      ..shader = radialShader
      ..maskFilter = const MaskFilter.blur(BlurStyle.normal, 60);

    canvas.drawCircle(center, radius, glowPaint);

    final rrect = RRect.fromRectAndRadius(
      Offset.zero & size,
      const Radius.circular(18),
    );

    final borderShader = ui.Gradient.linear(
      const Offset(0, 0),
      Offset(size.width, size.height),
      [
        Color.lerp(colorBlue, colorWhite, progress)!,
        Color.lerp(colorWhite, colorBlue, progress)!,
      ],
    );

    final borderPaint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = 3
      ..shader = borderShader;

    canvas.drawRRect(rrect, borderPaint);
  }

  @override
  bool shouldRepaint(covariant GlowRectanglePainter old) =>
      old.progress != progress ||
          old.intensity != intensity ||
          old.glowSpread != glowSpread;
}

class GradientText extends StatelessWidget {
  final String text;
  final double fontSize;
  final List<Color> gradientColors;

  const GradientText({
    super.key,
    required this.text,
    required this.fontSize,
    required this.gradientColors,
  });

  @override
  Widget build(BuildContext context) {
    return ShaderMask(
      blendMode: BlendMode.srcIn,
      shaderCallback: (bounds) {
        return LinearGradient(
          colors: gradientColors,
          stops: const [0.0, 0.4, 1.0],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ).createShader(bounds);
      },
      child: Text(
        text,
        style: TextStyle(
          fontSize: fontSize,
          fontWeight: FontWeight.bold,
          letterSpacing: 1.2,
          color: Colors.white,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}
