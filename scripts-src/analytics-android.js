/* analytics.js */

var cordova = cordova || {};
var GDrinker = GDrinker || {};
GDrinker.Analytics = {};

GDrinker.Analytics.init = function() {
  var id = "UA-9988000-21";
  cordova.exec(GDrinker.Analytics.onSuccess, GDrinker.Analytics.onFailure,
    'GoogleAnalyticsTracker', 'start', [id]);
  GDrinker.Analytics.trackPageView("/App/Android/");
  GDrinker.Analytics.trackEvent("DeviceInit", "android");
  GDrinker.Analytics.trackEvent("Version", GDrinker.Version);
};

GDrinker.Analytics.trackEvent = function(category, action, label, value) {
  try {
    return cordova.exec(GDrinker.Analytics.onSuccess, GDrinker.Analytics.onFailure,
      'GoogleAnalyticsTracker', 'trackEvent',
      [category, action, typeof label === "undefined" ? "" : label,
      (isNaN(parseInt(value,10))) ? 0 : parseInt(value, 10)]);
  } catch (ex) {
    console.log(ex);
  }
};

GDrinker.Analytics.trackPageView = function(url) {
  try {
    return cordova.exec(GDrinker.Analytics.onSuccess, GDrinker.Analytics.onFailure,
      'GoogleAnalyticsTracker', 'trackPageView', [url]);
  } catch (ex) {
    console.log(ex);
  }
};

document.addEventListener("deviceready", function() {
  GDrinker.Analytics.init();
  navigator.splashscreen.hide();
}, false);

GDrinker.Analytics.onSuccess = function(result) {
  console.log("Analytics onSuccess", result);
};

GDrinker.Analytics.onFailure = function(result) {
  console.log("Analytics onFailure", result);
};
