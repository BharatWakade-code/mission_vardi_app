class VardiDashboardState {
  final int selectedIndex;

  VardiDashboardState({this.selectedIndex = 0});

  VardiDashboardState copyWith({int? selectedIndex}) {
    return VardiDashboardState(
      selectedIndex: selectedIndex ?? this.selectedIndex,
    );
  }
}
