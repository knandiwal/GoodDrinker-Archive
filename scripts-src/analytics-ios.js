/* analytics.js */

var cordova = cordova || {};
var FastClick = FastClick || {};
var GDrinker = GDrinker || {};
GDrinker.Analytics = {};

GDrinker.Analytics.init = function() {
  var id = "UA-9988000-21";
  cordova.exec("GoogleAnalyticsPlugin.startTrackerWithAccountID", id);
  GDrinker.Analytics.trackEvent("DeviceInit", "ios");
  GDrinker.Analytics.trackEvent("Version", GDrinker.Version);
};

GDrinker.Analytics.trackEvent = function(category, action, label, value) {
  var options = {category: category, action: action, label: label, value: value};
  cordova.exec("GoogleAnalyticsPlugin.trackEvent", options);
};

GDrinker.Analytics.trackPageView = function(url) {
  cordova.exec("GoogleAnalyticsPlugin.trackPageview", url);
};

document.addEventListener("deviceready", function() {
  GDrinker.Analytics.init();
  new FastClick(document.body);
}, false);
