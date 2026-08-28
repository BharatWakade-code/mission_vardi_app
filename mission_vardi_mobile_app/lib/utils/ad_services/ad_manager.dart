import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdManager {
  AdManager._privateConstructor();
  static final AdManager instance = AdManager._privateConstructor();

  // Ad Unit IDs (Automatically toggles between Test IDs in Debug and Production IDs in Release)
  static String get bannerAdUnitId {
    if (kIsWeb) return '';
    if (kDebugMode) {
      if (Platform.isAndroid) {
        return 'ca-app-pub-3940256099942544/6300978111'; // Safe Google Test Banner ID (Android)
      } else if (Platform.isIOS) {
        return 'ca-app-pub-3940256099942544/2934735716'; // Safe Google Test Banner ID (iOS)
      }
    } else {
      if (Platform.isAndroid) {
        return 'ca-app-pub-5035062638976485/9730028275';
      } else if (Platform.isIOS) {
        return 'ca-app-pub-5035062638976485/7075944777';
      }
    }
    throw UnsupportedError('Unsupported platform');
  }

  static String get rewardedAdUnitId {
    if (kIsWeb) return '';
    if (kDebugMode) {
      if (Platform.isAndroid) {
        return 'ca-app-pub-3940256099942544/5224354917'; // Safe Google Test Rewarded ID (Android)
      } else if (Platform.isIOS) {
        return 'ca-app-pub-3940256099942544/1712485313'; // Safe Google Test Rewarded ID (iOS)
      }
    } else {
      if (Platform.isAndroid) {
        return 'ca-app-pub-3940256099942544/5224354917';
      } else if (Platform.isIOS) {
        return 'ca-app-pub-5035062638976485/6612584349';
      }
    }
    throw UnsupportedError('Unsupported platform');
  }

  RewardedAd? _rewardedAd;
  bool _isRewardedAdLoading = false;

  Future<void> initialize() async {
    if (kIsWeb) return;
    try {
      await MobileAds.instance.initialize();

      // OPTIONAL: Add your physical/emulator test device IDs here to safely test real App/Ad Unit IDs
      final requestConfiguration = RequestConfiguration(
        testDeviceIds: [
          '2B72F05D65B9840826D8C2C5D9DBF395',
        ],
      );

      await MobileAds.instance.updateRequestConfiguration(requestConfiguration);

      loadRewardedAd();
    } catch (e) {
      debugPrint('AdMob initialization error: $e');
    }
  }

  void loadRewardedAd() {
    if (kIsWeb) return;
    if (_rewardedAd != null || _isRewardedAdLoading) return;
    _isRewardedAdLoading = true;

    RewardedAd.load(
      adUnitId: rewardedAdUnitId,
      request: const AdRequest(),
      rewardedAdLoadCallback: RewardedAdLoadCallback(
        onAdLoaded: (ad) {
          _rewardedAd = ad;
          _isRewardedAdLoading = false;
          debugPrint('Rewarded ad loaded successfully.');
        },
        onAdFailedToLoad: (error) {
          _rewardedAd = null;
          _isRewardedAdLoading = false;
          debugPrint('Rewarded ad failed to load: $error');
        },
      ),
    );
  }

  void showRewardedAd({
    required VoidCallback onRewardEarned,
    required VoidCallback onAdDismissed,
  }) {
    if (kIsWeb) {
      debugPrint('Running on web. Triggering fallback reward.');
      onRewardEarned();
      onAdDismissed();
      return;
    }

    if (_rewardedAd == null) {
      debugPrint('Rewarded ad not ready. Triggering fallback reward.');
      onRewardEarned();
      onAdDismissed();
      loadRewardedAd();
      return;
    }

    _rewardedAd!.fullScreenContentCallback = FullScreenContentCallback(
      onAdDismissedFullScreenContent: (ad) {
        ad.dispose();
        _rewardedAd = null;
        onAdDismissed();
        loadRewardedAd();
      },
      onAdFailedToShowFullScreenContent: (ad, error) {
        ad.dispose();
        _rewardedAd = null;
        onRewardEarned(); // Fallback so player gets reward
        onAdDismissed();
        loadRewardedAd();
      },
    );

    _rewardedAd!.show(
      onUserEarnedReward: (ad, reward) {
        debugPrint('User earned reward: ${reward.amount} ${reward.type}');
        onRewardEarned();
      },
    );
  }

  BannerAd createBannerAd({
    required VoidCallback onAdLoaded,
    required void Function(LoadAdError) onAdFailedToLoad,
  }) {
    return BannerAd(
      adUnitId: bannerAdUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (ad) => onAdLoaded(),
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
          onAdFailedToLoad(error);
        },
      ),
    );
  }
}
