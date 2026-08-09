import 'dart:developer';
import 'dart:io';
import 'package:dio/dio.dart';
import 'package:edusaas/utils/network_services/api_client.dart';
import 'package:edusaas/utils/shared_pref_data.dart';

class NetworkServices {
  final ApiClient _apiClient = ApiClient();

  Dio get _dio => _apiClient.dio;

  Future<Response> postApi(String url, dynamic request) async {
    try {
      log('Request URL: $url Full request: $request');

      final response = await _dio.post(url, data: request);
      log('response.statusCode: ${response.statusCode}');

      final fullUrlPrint = Uri.https(
        response.requestOptions.uri.host,
        response.requestOptions.uri.path,
        response.requestOptions.queryParameters,
      );
      log('Full URL: $fullUrlPrint Full request: $request');

      if (response.statusCode == 200 ||
          response.statusCode == 400 ||
          response.statusCode == 401 ||
          response.statusCode == 404 ||
          response.statusCode == 500 ||
          response.statusCode == 403 ||
          response.statusCode == 409 ||
          response.statusCode == 422) {
        log('postApi response: $response');
        return response;
      } else {
        throw DioException.badResponse(
          statusCode: response.statusCode ?? 0,
          requestOptions: response.requestOptions,
          response: response,
        );
      }
    } on DioException catch (e) {
      print("DioException: ${e.message}");
      rethrow;
    } catch (e) {
      print("Unexpected error: $e");
      throw Exception("An unexpected error occurred");
    }
  }

  Future<Response> putApi(String url,
      {dynamic request, dynamic queryParameters}) async {
    try {
      log('Request URL: $url Full request: $request');

      final response =
          await _dio.put(url, data: request, queryParameters: queryParameters);
      log('response.statusCode: ${response.statusCode}');

      final fullUrlPrint = Uri.https(
        response.requestOptions.uri.host,
        response.requestOptions.uri.path,
        response.requestOptions.queryParameters,
      );
      log('Full URL: $fullUrlPrint Full request: $request');

      if (response.statusCode == 200 ||
          response.statusCode == 400 ||
          response.statusCode == 500 ||
          response.statusCode == 403 ||
          response.statusCode == 422) {
        log('postApi response: $response');
        return response;
      } else {
        throw DioException.badResponse(
          statusCode: response.statusCode ?? 0,
          requestOptions: response.requestOptions,
          response: response,
        );
      }
    } on DioException catch (e) {
      print("DioException: ${e.message}");
      rethrow;
    } catch (e) {
      print("Unexpected error: $e");
      throw Exception("An unexpected error occurred");
    }
  }

  Future<Response> uploadFileWithMultiPartPut({
    required String url,
    String? filePath,
    Map<String, dynamic>? queryParameters,
  }) async {
    try {
      Map<String, dynamic> formMap = {};
      if (filePath != null && filePath.isNotEmpty) {
        formMap['file'] = await MultipartFile.fromFile(
          filePath,
          filename: filePath.split('/').last,
        );
      }

      final formData = FormData.fromMap(formMap);

      final response = await _dio.put(
        url,
        data: formData,
        queryParameters: queryParameters,
        options: Options(
          contentType: Headers.multipartFormDataContentType,
          validateStatus: (status) {
            return status == 200 || status == 400;
          },
        ),
      );

      if (response.statusCode == 200 || response.statusCode == 400) {
        log('postApi response: $response');
        return response;
      } else {
        throw DioException.badResponse(
          statusCode: response.statusCode ?? 0,
          requestOptions: response.requestOptions,
          response: response,
        );
      }
    } on DioException catch (e) {
      log("Upload Error: ${e.response?.data}");
      rethrow;
    }
  }

  ///MultiPart Post Request
  Future<Response> uploadFileWithMultiPartPost(
      {required String url,
      String? filePath,
      required Map<String, dynamic> body,
      String? audioFile}) async {
    try {
      print('api body $body  $audioFile $url');
      Map<String, dynamic> formMap = {...body};

      if (filePath != null && filePath.isNotEmpty) {
        formMap['image'] = await MultipartFile.fromFile(
          filePath,
          filename: filePath.split('/').last,
        );
      }

      if (audioFile != null && audioFile.isNotEmpty) {
        final file = File(audioFile);

        if (await file.exists()) {
          formMap['audio_file'] = await MultipartFile.fromFile(
            audioFile,
            filename: audioFile.split('/').last,
          );
        } else {
          print("Audio file not found!");
        }
      }

      log('multiPart Body: $formMap');

      final formData = FormData.fromMap(formMap);

      final response = await _dio.post(
        url,
        data: formData,
        options: Options(
          contentType: Headers.multipartFormDataContentType,
          validateStatus: (status) {
            return status == 200 ||
                status == 400 ||
                status == 500 ||
                status == 422;
          },
        ),
      );
      if (response.statusCode == 200 ||
          response.statusCode == 400 ||
          response.statusCode == 500 ||
          response.statusCode == 422) {
        log('postApi response: $response');
        return response;
      } else {
        throw DioException.badResponse(
          statusCode: response.statusCode ?? 0,
          requestOptions: response.requestOptions,
          response: response,
        );
      }
    } on DioException catch (e) {
      log("Upload Error: ${e.response?.data}");
      rethrow;
    }
  }

  Future<Response> getApi(String url,
      {Map<String, dynamic>? queryParameters}) async {
    try {
      final fullUrl = url;
      log('Full URL: $fullUrl  $queryParameters');

      final response = await _dio.get(
        url,
        queryParameters: queryParameters,
      );

      log("FULL URL: ${response.requestOptions.uri}");

      if (response.statusCode == 200 ||
          response.statusCode == 404 ||
          response.statusCode == 422 ||
          response.statusCode == 400 ||
          response.statusCode == 401 ||
          response.statusCode == 403) {
        log('getApi response: $response');
        return response;
      } else {
        throw DioException.badResponse(
          statusCode: response.statusCode ?? 0,
          requestOptions: response.requestOptions,
          response: response,
        );
      }
    } on DioException catch (e) {
      print("DioException: $e");

      rethrow;
    } catch (e) {
      print("Unexpected error: $e");
      throw Exception("An unexpected error occurred");
    }
  }

  Future<Response> deleteApi(String url,
      {Map<String, dynamic>? queryParameters}) async {
    try {
      final fullUrl = '$url';
      log('Full URL: $fullUrl  $queryParameters');

      final response = await _dio.delete(
        fullUrl,
        queryParameters: queryParameters,
      );
      log('Full response: $response');

      log('Status Code: ${response.statusCode}');

      if (response.statusCode == 200 ||
          response.statusCode == 404 ||
          response.statusCode == 422) {
        log('getApi response: $response');
        return response;
      } else {
        throw DioException.badResponse(
          statusCode: response.statusCode ?? 0,
          requestOptions: response.requestOptions,
          response: response,
        );
      }
    } on DioException catch (e) {
      print("DioException: $e");

      rethrow;
    } catch (e) {
      print("Unexpected error: $e");
      throw Exception("An unexpected error occurred");
    }
  }

  Future<Response> getApiWithoutBaseUrl(String fullUrl) async {
    try {
      log('Full URL: $fullUrl');

      final dio = Dio();

      final response = await dio.get(fullUrl);

      log('Status Code: ${response.statusCode}');
      log('Response: ${response.data}');

      if (response.statusCode == 200 ||
          response.statusCode == 400 ||
          response.statusCode == 404 ||
          response.statusCode == 422) {
        return response;
      } else {
        throw DioException.badResponse(
          statusCode: response.statusCode ?? 0,
          requestOptions: response.requestOptions,
          response: response,
        );
      }
    } on DioException catch (e) {
      log("DioException: ${e.message}");
      rethrow;
    } catch (e) {
      log("Unexpected error: $e");
      throw Exception("Unexpected error occurred");
    }
  }

  Future<Response> putBinaryWithoutBaseUrl(
      String fullUrl, List<int> bytes, String contentType) async {
    try {
      log('S3 Put Full URL: $fullUrl');
      final dio = Dio();
      final response = await dio.put(
        fullUrl,
        data: Stream.fromIterable([bytes]),
        options: Options(
          headers: {
            Headers.contentLengthHeader: bytes.length,
          },
          contentType: contentType,
        ),
      );
      log('S3 Put Status Code: ${response.statusCode}');
      return response;
    } on DioException catch (e) {
      log("S3 Put Error: ${e.response?.data}");
      rethrow;
    } catch (e) {
      log("Unexpected S3 upload error: $e");
      throw Exception("Failed to upload file to storage");
    }
  }
}
