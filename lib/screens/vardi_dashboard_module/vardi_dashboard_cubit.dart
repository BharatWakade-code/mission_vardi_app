import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:injectable/injectable.dart';
import 'package:edusaas/screens/vardi_dashboard_module/vardi_dashboard_state.dart';

@injectable
class VardiDashboardCubit extends Cubit<VardiDashboardState> {
  VardiDashboardCubit() : super(VardiDashboardState());

  void onChangeIndex(int index) {
    emit(state.copyWith(selectedIndex: index));
  }
}
