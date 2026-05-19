import 'package:dio/dio.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:mission_vardi/utils/shared_pref_data.dart';

class ApiClient {
  late final Dio dio;

  ApiClient() {
    final baseUrl = dotenv.env['BASE_URL'] ?? '';
    dio = Dio(
      BaseOptions(
        baseUrl: baseUrl,
        connectTimeout: const Duration(minutes: 4),
        receiveTimeout: const Duration(minutes: 15),
        validateStatus: (status) {
          return status == 200 || status == 400 || status == 409 || status == 405 || status == 422 || status == 404 || status == 500 ;
        },
      ),
    );

    /// Add Interceptors
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = CommonHiveData.getString('token') ?? '';
          if (token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          options.headers['Accept'] = 'application/json';
          print("REQUEST[${options.method}] => ${options.path}");
          print("HEADERS: ${options.headers}");
          return handler.next(options);
        },
        onResponse: (response, handler) {
          print(
              "RESPONSE[${response.statusCode}] => ${response.requestOptions.path}");
          return handler.next(response);
        },
        onError: (DioException e, handler) {
          print("ERROR[${e.response?.statusCode}] => ${e.message}");
          return handler.next(e);
        },
      ),
    );
  }
}
