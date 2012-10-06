/* analytics.js */

var GDrinker = GDrinker || {};
GDrinker.Analytics = {};

GDrinker.Analytics.init = function() {
  var id = "UA-9988000-21";
  cordova.exec(GDrinker.Analytics.onSuccess, GDrinker.Analytics.onFailure,
    'GoogleAnalyticsTracker', 'start', [id]);
  GDrinker.Analytics.trackEvent("DeviceInit", "ios");
  GDrinker.Analytics.trackEvent("Version", GDrinker.Version);
};

GDrinker.Analytics.trackEvent = function(category, action, label, value) {
  return cordova.exec(GDrinker.Analytics.onSuccess, GDrinker.Analytics.onFailure,
    'GoogleAnalyticsTracker', 'trackEvent',
    [category, action, typeof label === "undefined" ? "" : label,
    (isNaN(parseInt(value,10))) ? 0 : parseInt(value, 10)]);
};

GDrinker.Analytics.trackPageView = function(url) {
  return cordova.exec(GDrinker.Analytics.onSuccess, GDrinker.Analytics.onFailure,
    'GoogleAnalyticsTracker', 'trackPageView', [url]);
};

document.addEventListener("deviceready", function() {
  GDrinker.Analytics.init();
  new FastClick(document.body);
  console.log("FastClick registered");
  navigator.splashscreen.hide();
}, false);

GDrinker.Analytics.onSuccess = function(result) {
  console.log("Analytics onSuccess", result);
};

GDrinker.Analytics.onFailure = function(result) {
  console.log("Analytics onFailure", result);
};
