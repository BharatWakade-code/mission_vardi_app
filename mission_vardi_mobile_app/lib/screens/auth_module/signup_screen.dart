import 'package:flutter/material.dart';
import 'package:mission_vardi/screens/localization_module/app_localizations.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:mission_vardi/screens/auth_module/auth_cubit.dart';
import 'package:mission_vardi/screens/auth_module/auth_state.dart';
import 'package:mission_vardi/utils/constants.dart';
import 'package:mission_vardi/utils/routes_services/routes_name.dart';

class SignUpScreen extends StatefulWidget {
  const SignUpScreen({super.key});

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _firstNameController = TextEditingController();
  final _lastNameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirm = true;
  bool _agreedToTerms = false;
  late AnimationController _fadeController;
  late AnimationController _slideController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();
    _fadeController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _slideController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 700),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _fadeController,
      curve: Curves.easeIn,
    );
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(
        CurvedAnimation(parent: _slideController, curve: Curves.easeOut));

    _fadeController.forward();
    _slideController.forward();
  }

  @override
  void dispose() {
    _fadeController.dispose();
    _slideController.dispose();
    _firstNameController.dispose();
    _lastNameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _signUp() {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreedToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            'please_accept_the_terms_conditions'.tr(),
            style: commonTextStyle.copyWith(color: Colors.white, fontSize: 13),
          ),
          backgroundColor: Colors.redAccent,
          behavior: SnackBarBehavior.floating,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        ),
      );
      return;
    }

    context.read<AuthCubit>().signUp(
          firstName: _firstNameController.text.trim(),
          lastName: _lastNameController.text.trim(),
          email: _emailController.text.trim(),
          phone: _phoneController.text.trim(),
          password: _passwordController.text.trim(),
        );
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<AuthCubit, AuthState>(
      listener: (context, state) {
        if (state.isSuccess) {
          context.go(RoutesNames.dashboardScreen);
        } else if (state.errorMsg.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                state.errorMsg,
                style: commonTextStyle.copyWith(color: Colors.white, fontSize: 13),
              ),
              backgroundColor: Colors.redAccent,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
          );
        }
      },
      child: Scaffold(
        body: Container(
          width: double.infinity,
          height: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Color(0xFF0A2540),
                Color(0xFF0D47A1),
                Color(0xFF1565C0),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: SafeArea(
            child: FadeTransition(
              opacity: _fadeAnimation,
              child: SlideTransition(
                position: _slideAnimation,
                child: SingleChildScrollView(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      const SizedBox(height: 10),

                      /// Back Button
                      Align(
                        alignment: Alignment.centerLeft,
                        child: GestureDetector(
                          onTap: () => context.go(RoutesNames.signInScreen),
                          child: Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.08),
                              shape: BoxShape.circle,
                              border: Border.all(
                                  color: Colors.white.withOpacity(0.15)),
                            ),
                            child: const Icon(
                              Icons.arrow_back_ios_new_rounded,
                              color: Colors.white70,
                              size: 18,
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 16),

                      /// Icon
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.08),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: Colors.amber.withOpacity(0.5),
                            width: 2,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.amber.withOpacity(0.2),
                              blurRadius: 20,
                              spreadRadius: 4,
                            ),
                          ],
                        ),
                        child: const Icon(
                          Icons.security_rounded,
                          size: 54,
                          color: Colors.amber,
                        ),
                      ),

                      const SizedBox(height: 16),

                      Text(
                        'create_account'.tr(),
                        style: commonTextStyle.copyWith(
                          color: Colors.white,
                          fontSize: 26,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'join_10_000_aspirants_on_mission_vardi'.tr(),
                        style: commonTextStyle.copyWith(
                          color: Colors.white60,
                          fontSize: 13,
                          fontWeight: FontWeight.w400,
                        ),
                      ),

                      const SizedBox(height: 28),

                      /// Form Card
                      Container(
                        padding: const EdgeInsets.all(24),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.07),
                          borderRadius: BorderRadius.circular(24),
                          border: Border.all(
                            color: Colors.white.withOpacity(0.15),
                            width: 1,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 20,
                              offset: const Offset(0, 8),
                            ),
                          ],
                        ),
                        child: Form(
                          key: _formKey,
                          child: Column(
                            children: [
                              /// First Name + Last Name (side by side)
                              Row(
                                children: [
                                  Expanded(
                                    child: _buildInputField(
                                      controller: _firstNameController,
                                      label: 'first_name'.tr(),
                                      hint: "First name",
                                      icon: Icons.person_outline_rounded,
                                      validator: (val) =>
                                          val == null || val.isEmpty
                                              ? "Required"
                                              : null,
                                    ),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: _buildInputField(
                                      controller: _lastNameController,
                                      label: 'last_name'.tr(),
                                      hint: "Last name",
                                      icon: Icons.person_outline_rounded,
                                      validator: (val) =>
                                          val == null || val.isEmpty
                                              ? "Required"
                                              : null,
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16),

                              _buildInputField(
                                controller: _emailController,
                                label: 'email_address'.tr(),
                                hint: "Enter your email",
                                icon: Icons.email_outlined,
                                keyboardType: TextInputType.emailAddress,
                                validator: (val) {
                                  if (val == null || val.isEmpty) {
                                    return "Email is required";
                                  }
                                  if (!val.contains('@')) {
                                    return "Invalid email";
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              /// Phone — optional
                              _buildInputField(
                                controller: _phoneController,
                                label: 'phone_number_optional'.tr(),
                                hint: "Enter your 10-digit mobile number",
                                icon: Icons.phone_outlined,
                                keyboardType: TextInputType.phone,
                                validator: (val) {
                                  // optional — skip if empty
                                  if (val != null &&
                                      val.isNotEmpty &&
                                      val.length < 10) {
                                    return "Enter valid 10-digit number";
                                  }
                                  return null;
                                },
                              ),
                              const SizedBox(height: 16),

                              _buildInputField(
                                controller: _passwordController,
                                label: 'password'.tr(),
                                hint: "Create a strong password",
                                icon: Icons.lock_outline_rounded,
                                obscure: _obscurePassword,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscurePassword
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: Colors.white54,
                                    size: 20,
                                  ),
                                  onPressed: () => setState(() =>
                                      _obscurePassword = !_obscurePassword),
                                ),
                                validator: (val) => val == null || val.length < 6
                                    ? "Min 6 characters"
                                    : null,
                              ),
                              const SizedBox(height: 16),

                              _buildInputField(
                                controller: _confirmPasswordController,
                                label: 'confirm_password'.tr(),
                                hint: "Re-enter your password",
                                icon: Icons.lock_outline_rounded,
                                obscure: _obscureConfirm,
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscureConfirm
                                        ? Icons.visibility_off_outlined
                                        : Icons.visibility_outlined,
                                    color: Colors.white54,
                                    size: 20,
                                  ),
                                  onPressed: () => setState(
                                      () => _obscureConfirm = !_obscureConfirm),
                                ),
                                validator: (val) {
                                  if (val != _passwordController.text) {
                                    return "Passwords do not match";
                                  }
                                  return null;
                                },
                              ),

                              const SizedBox(height: 20),

                              /// Terms & Conditions checkbox
                              GestureDetector(
                                onTap: () => setState(
                                    () => _agreedToTerms = !_agreedToTerms),
                                child: Row(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    AnimatedContainer(
                                      duration:
                                          const Duration(milliseconds: 200),
                                      width: 20,
                                      height: 20,
                                      margin: const EdgeInsets.only(top: 1),
                                      decoration: BoxDecoration(
                                        color: _agreedToTerms
                                            ? Colors.amber
                                            : Colors.transparent,
                                        borderRadius: BorderRadius.circular(5),
                                        border: Border.all(
                                          color: _agreedToTerms
                                              ? Colors.amber
                                              : Colors.white38,
                                          width: 1.5,
                                        ),
                                      ),
                                      child: _agreedToTerms
                                          ? const Icon(
                                              Icons.check_rounded,
                                              size: 14,
                                              color: Color(0xFF0A2540),
                                            )
                                          : null,
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: RichText(
                                        text: TextSpan(
                                          style: commonTextStyle.copyWith(
                                            color: Colors.white60,
                                            fontSize: 12,
                                          ),
                                          children: [
                                            const TextSpan(
                                                text: "I agree to the "),
                                            TextSpan(
                                              text: "Terms & Conditions",
                                              style: commonTextStyle.copyWith(
                                                color: Colors.amber.shade300,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w700,
                                                decoration:
                                                    TextDecoration.underline,
                                                decorationColor:
                                                    Colors.amber.shade300,
                                              ),
                                            ),
                                            const TextSpan(text: " and "),
                                            TextSpan(
                                              text: "Privacy Policy",
                                              style: commonTextStyle.copyWith(
                                                color: Colors.amber.shade300,
                                                fontSize: 12,
                                                fontWeight: FontWeight.w700,
                                                decoration:
                                                    TextDecoration.underline,
                                                decorationColor:
                                                    Colors.amber.shade300,
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),

                              const SizedBox(height: 24),

                              /// Sign Up Button
                              BlocBuilder<AuthCubit, AuthState>(
                                builder: (context, state) {
                                  return state.isLoading
                                      ? const Center(
                                          child: CircularProgressIndicator(
                                              color: Colors.amber),
                                        )
                                      : _buildPrimaryButton(
                                          label: 'create_account'.tr(),
                                          onTap: _signUp,
                                        );
                                },
                              ),
                            ],
                          ),
                        ),
                      ),

                      const SizedBox(height: 24),

                      /// Divider
                      Row(
                        children: [
                          Expanded(
                            child: Divider(
                                color: Colors.white.withOpacity(0.2),
                                thickness: 1),
                          ),
                          Padding(
                            padding:
                                const EdgeInsets.symmetric(horizontal: 12),
                            child: Text(
                              'or'.tr(),
                              style: commonTextStyle.copyWith(
                                color: Colors.white38,
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                          Expanded(
                            child: Divider(
                                color: Colors.white.withOpacity(0.2),
                                thickness: 1),
                          ),
                        ],
                      ),

                      const SizedBox(height: 20),

                      /// Google Sign Up — calls the same Google auth flow
                      BlocBuilder<AuthCubit, AuthState>(
                        builder: (context, state) {
                          return GestureDetector(
                            onTap: state.isLoading
                                ? null
                                : () => context
                                    .read<AuthCubit>()
                                    .signInWithGoogle(),
                            child: Container(
                              width: double.infinity,
                              padding:
                                  const EdgeInsets.symmetric(vertical: 14),
                              decoration: BoxDecoration(
                                color: state.isLoading
                                    ? Colors.white60
                                    : Colors.white,
                                borderRadius: BorderRadius.circular(30),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.15),
                                    blurRadius: 8,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              ),
                              child: state.isLoading
                                  ? const Center(
                                      child: SizedBox(
                                        height: 20,
                                        width: 20,
                                        child: CircularProgressIndicator(
                                          strokeWidth: 2.5,
                                          color: Colors.black38,
                                        ),
                                      ),
                                    )
                                  : Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.center,
                                      children: [
                                        const Icon(Icons.g_mobiledata_rounded,
                                            size: 26, color: Colors.red),
                                        const SizedBox(width: 10),
                                        Text(
                                          'continue_with_google'.tr(),
                                          style: commonTextStyle.copyWith(
                                            color: Colors.black87,
                                            fontSize: 15,
                                            fontWeight: FontWeight.bold,
                                          ),
                                        ),
                                      ],
                                    ),
                            ),
                          );
                        },
                      ),

                      const SizedBox(height: 20),

                      /// Sign In Link
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text(
                            'already_have_an_account'.tr(),
                            style: commonTextStyle.copyWith(
                              color: Colors.white60,
                              fontSize: 14,
                            ),
                          ),
                          GestureDetector(
                            onTap: () => context.go(RoutesNames.signInScreen),
                            child: Text(
                              'sign_in'.tr(),
                              style: commonTextStyle.copyWith(
                                color: Colors.amber,
                                fontSize: 14,
                                fontWeight: FontWeight.w800,
                                decoration: TextDecoration.underline,
                                decorationColor: Colors.amber,
                              ),
                            ),
                          ),
                        ],
                      ),

                      const SizedBox(height: 24),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String label,
    required String hint,
    required IconData icon,
    bool obscure = false,
    TextInputType? keyboardType,
    Widget? suffixIcon,
    String? Function(String?)? validator,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: commonTextStyle.copyWith(
            color: Colors.white70,
            fontSize: 12,
            fontWeight: FontWeight.w600,
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          obscureText: obscure,
          keyboardType: keyboardType,
          validator: validator,
          onChanged: (_) => context.read<AuthCubit>().clearError(),
          style: commonTextStyle.copyWith(color: Colors.white, fontSize: 14),
          decoration: InputDecoration(
            hintText: hint,
            hintStyle:
                commonTextStyle.copyWith(color: Colors.white30, fontSize: 13),
            prefixIcon: Icon(icon, color: Colors.white38, size: 20),
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: Colors.white.withOpacity(0.08),
            contentPadding:
                const EdgeInsets.symmetric(vertical: 14, horizontal: 16),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide:
                  BorderSide(color: Colors.white.withOpacity(0.15)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide:
                  BorderSide(color: Colors.white.withOpacity(0.15)),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide:
                  const BorderSide(color: Colors.amber, width: 1.5),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Colors.redAccent),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: const BorderSide(color: Colors.redAccent),
            ),
            errorStyle: commonTextStyle.copyWith(
              color: Colors.redAccent.shade100,
              fontSize: 11,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPrimaryButton(
      {required String label, required VoidCallback onTap}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: double.infinity,
        padding: const EdgeInsets.symmetric(vertical: 15),
        decoration: BoxDecoration(
          color: Colors.amber,
          borderRadius: BorderRadius.circular(30),
          boxShadow: [
            BoxShadow(
              color: Colors.amber.withOpacity(0.4),
              blurRadius: 14,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Center(
          child: Text(
            label,
            style: commonTextStyle.copyWith(
              color: const Color(0xFF0A2540),
              fontSize: 16,
              fontWeight: FontWeight.w800,
              letterSpacing: 0.5,
            ),
          ),
        ),
      ),
    );
  }
}
