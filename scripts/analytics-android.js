/* analytics.js */

var GDrinker = GDrinker || {};
GDrinker.Analytics = {};

GDrinker.Analytics.init = function() {
  var id = "UA-9988000-21";
  cordova.exec(GDrinker.Analytics.onSuccess, GDrinker.Analytics.onFailure,
    'GoogleAnalyticsTracker', 'start', [id]);
  GDrinker.Analytics.trackEvent("DeviceInit", "ios");
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
  navigator.splashscreen.hide();
  
  document.addEventListener("resume", function() {
    GDrinker.Analytics.trackEvent("lifecycle", "resume");
  }, false);

  document.addEventListener("pause", function() {
    GDrinker.Analytics.trackEvent("lifecycle", "pause");
  }, false);
}, false);

GDrinker.Analytics.onSuccess = function(result) {
  console.log("Analytics onSuccess", result);
};

GDrinker.Analytics.onFailure = function(result) {
  console.log("Analytics onFailure", result);
};
