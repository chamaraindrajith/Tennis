/** FUNCTIONS START */

/*

// showAd(type) // banner, interstitial, reward // Commmon Function

AppLovinApp.initialize(); // Init

AppLovinApp.loadRewardedAds(); // Load Reward
AppLovinApp.showRewardedAds(); // Show Reward
AppLovinApp.isRewardedAdReady(); // is Reward Ad Ready

AppLovinApp.loadInterstitialAds(); // Load Interstitial
AppLovinApp.showInterstitialAds(); // Show Interstitial
AppLovinApp.isInterstitialReady(); // is Interstitial Ad Ready

AppLovinApp.loadBannerAds(); // Load Banner
AppLovinApp.showBannerAds(); // Show Banner
AppLovinApp.hideBannerAds(); // Hide Banner

/** FUNCTIONS END */

var SDK_KEY =
  "7RSCQyIR7-udq3XKVTQm03zGauyvPh4wskMuNmMPZ5t7iiPWiEWT0yv5GyD5xHLZqVO3u1JmFGzr9rA0zMdT9g";

// REWARDED_AD_UNIT_ID
var REWARDED_AD_UNIT_ID;
if (window.cordova.platformId.toUpperCase() === "IOS") {
  REWARDED_AD_UNIT_ID = "YOUR_IOS_REWARDED_AD_UNIT_ID";
} else {
  REWARDED_AD_UNIT_ID = "03e1db645aefe3c3";
}

// INTER_AD_UNIT_ID
var INTER_AD_UNIT_ID;
if (window.cordova.platformId.toUpperCase() === "IOS") {
  INTER_AD_UNIT_ID = "YOUR_IOS_INTER_AD_UNIT_ID";
} else {
  INTER_AD_UNIT_ID = "5854338fadb7b73b";
}

var BANNER_AD_UNIT_ID;
if (window.cordova.platformId.toUpperCase() === "IOS") {
  BANNER_AD_UNIT_ID = "YOUR_IOS_BANNER_AD_UNIT_ID";
} else {
  // Assume Android
  BANNER_AD_UNIT_ID = "c22cd18cce593547";
}

/** showAd  Start */
// showAd(type) // banner, interstitial, reward

var AD_ROTATION = 4; // AD_ROTATION Count

localStorage.setItem("show_video", AD_ROTATION);
localStorage.setItem("show_interstitial", AD_ROTATION);

function showAd(type) {
  var ad_request_count = 0;
  switch (type) {
    case "banner":
      AppLovinApp.showBannerAds(); // Show Banner
      break;
    case "interstitial":
      var show_interstitial = localStorage.getItem("show_interstitial");
      ad_request_count = show_interstitial;
      if (show_interstitial % AD_ROTATION == 0) {
        AppLovinApp.showInterstitialAds(); // Show Interstitial
      }
      show_interstitial++;
      localStorage.setItem("show_interstitial", show_interstitial);
      break;
    case "reward":
      var show_video = localStorage.getItem("show_video");
      ad_request_count = show_video;
      if (show_video % AD_ROTATION == 0) {
        AppLovinApp.showRewardedAds(); // Show Reward
      }
      show_video++;
      localStorage.setItem("show_video", show_video);
      break;
    default:
      break;
  }
  console.log(
    "Requested to load ad type: " + type + ", count: " + ad_request_count
  );
}
/** showAd  End */

var AppLovinApp = {
  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },
  onDeviceReady: function () {
    // this.receivedEvent('deviceready');
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );

    AppLovinMAX.initialize(SDK_KEY, function (configuration) {
      // SDK is initialized, start loading ads
      AppLovinApp.loadRewardedAds(); // Load Reward
      AppLovinApp.loadInterstitialAds(); // Load Interstitial
      AppLovinApp.loadBannerAds(); // Load Banner

      console.log("SDK is initialized");
    });
  },

  loadRewardedAds: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    var retryAttempt = 0;

    window.addEventListener("OnRewardedAdLoadedEvent", function (adInfo) {
      // Rewarded ad is ready to be shown. AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID) will now return 'true'

      // Reset retry attempt
      retryAttempt = 0;
      console.log("Rewarded ad loaded");
    });

    window.addEventListener("OnRewardedAdLoadFailedEvent", function (adInfo) {
      // OnRewardedAd failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)

      retryAttempt++;
      var retryDelay = Math.pow(2, Math.min(6, retryAttempt));

      console.log(adInfo);

      setTimeout(function () {
        loadRewardedAd();
      }, retryDelay * 1000);
    });

    window.addEventListener("OnRewardedAdClickedEvent", function (adInfo) {});
    window.addEventListener("OnRewardedAdDisplayedEvent", function (adInfo) {});
    window.addEventListener(
      "OnRewardedAdFailedToDisplayEvent",
      function (adInfo) {
        // Rewarded ad failed to display. We recommend loading the next ad
        loadRewardedAd();
      }
    );
    window.addEventListener("OnRewardedAdHiddenEvent", function (adInfo) {
      loadRewardedAd();
    });
    window.addEventListener(
      "OnRewardedAdReceivedRewardEvent",
      function (adInfo) {
        // Rewarded ad was displayed and user should receive the reward
      }
    );

    // Load the first rewarded ad
    loadRewardedAd();

    function loadRewardedAd() {
      AppLovinMAX.loadRewardedAd(REWARDED_AD_UNIT_ID);
    }
  },

  showRewardedAds: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    if (AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID)) {
      AppLovinMAX.showRewardedAd(REWARDED_AD_UNIT_ID);
    }
  },

  isRewardedAdReady: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    if (AppLovinMAX.isRewardedAdReady(REWARDED_AD_UNIT_ID)) {
        return true;
    } else {
        return false;
    }
  },

  loadInterstitialAds: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    var retryAttempt = 0;
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    window.addEventListener("OnInterstitialLoadedEvent", function (adInfo) {
      // Interstitial ad is ready to be shown. AppLovinMAX.isInterstitialReady(INTER_AD_UNIT_ID) will now return 'true'

      // Reset retry attempt
      retryAttempt = 0;
      console.log("Interstitial ad loaded");
    });

    window.addEventListener("OnInterstitialLoadFailedEvent", function (adInfo) {
      // Interstitial ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)

      retryAttempt++;
      var retryDelay = Math.pow(2, Math.min(6, retryAttempt));

      console.log(
        "Interstitial ad failed to load - retrying in " + retryDelay + "s"
      );

      setTimeout(function () {
        loadInterstitial();
      }, retryDelay * 1000);
    });

    window.addEventListener("OnInterstitialClickedEvent", function (adInfo) {});
    window.addEventListener(
      "OnInterstitialDisplayedEvent",
      function (adInfo) {}
    );
    window.addEventListener(
      "OnInterstitialAdFailedToDisplayEvent",
      function (adInfo) {
        // Interstitial ad failed to display. We recommend loading the next ad
        loadInterstitial();
      }
    );
    window.addEventListener("OnInterstitialHiddenEvent", function (adInfo) {
      loadInterstitial();
    });

    // Load the first interstitial
    loadInterstitial();

    function loadInterstitial() {
      AppLovinMAX.loadInterstitial(INTER_AD_UNIT_ID);
    }
  },

  showInterstitialAds: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    if (AppLovinMAX.isInterstitialReady(INTER_AD_UNIT_ID)) {
      AppLovinMAX.showInterstitial(INTER_AD_UNIT_ID);
    }
  },

  isInterstitialReady: function () {
    if (AppLovinMAX.isInterstitialReady(INTER_AD_UNIT_ID)) {
        return true;
    } else {
        return false;
    }
  },

  loadBannerAds: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    var retryAttempt = 0;

    window.addEventListener("OnBannerAdLoadedEvent", function (adInfo) {
      // Banner ad is ready to be shown. AppLovinMAX.isBannerReady(BANNER_AD_UNIT_ID) will now return 'true'
      AppLovinApp.showBannerAds();
      // Reset retry attempt
      retryAttempt = 0;
      console.log("Banner ad loaded");
    });

    window.addEventListener("OnBannerAdLoadFailedEvent", function (adInfo) {
      // Banner ad failed to load
      // We recommend retrying with exponentially higher delays up to a maximum delay (in this case 64 seconds)

      retryAttempt++;
      var retryDelay = Math.pow(2, Math.min(6, retryAttempt));

      setTimeout(function () {
        console.log(
          "Banner ad failed to load - retrying in " + retryDelay + "s"
        );
        loadBanner();
      }, retryDelay * 1000);
    });

    // Load the first Banner
    loadBanner();

    function loadBanner() {
      // Banners are automatically sized to 320x50 on phones and 728x90 on tablets
      // You may use the utility method `AppLovinMAX.isTablet()` to help with view sizing adjustments
      AppLovinMAX.createBanner(
        BANNER_AD_UNIT_ID,
        AppLovinMAX.AdViewPosition.BOTTOM_CENTER
      );
      //   AppLovinMAX.setBannerBackgroundColor(BANNER_AD_UNIT_ID, "#000000");
    }

    // Set background or background color for banners to be fully functional
    // In this case we are setting it to black - PLEASE USE HEX STRINGS ONLY
  },

  showBannerAds: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    AppLovinMAX.showBanner(BANNER_AD_UNIT_ID);
  },

  hideBannerAds: function () {
    var AppLovinMAX = cordova.require(
      "cordova-plugin-applovin-max.AppLovinMAX"
    );
    AppLovinMAX.hideBanner(BANNER_AD_UNIT_ID);
  },
};

AppLovinApp.initialize();