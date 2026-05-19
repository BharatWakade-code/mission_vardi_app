import 'package:bloc/bloc.dart';
import 'package:flutter/material.dart';
import 'package:injectable/injectable.dart';

part 'vardi_home_state.dart';

@injectable
class VardiHomeCubit extends Cubit<VardiHomeState> {
  VardiHomeCubit() : super(const VardiHomeState());
}
