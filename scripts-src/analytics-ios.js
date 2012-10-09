/* analytics.js */

var cordova = cordova || {};
var GDrinker = GDrinker || {};
GDrinker.Analytics = {};

GDrinker.Analytics.init = function() {
  var id = "UA-9988000-21";
  cordova.exec("GoogleAnalyticsPlugin.startTrackerWithAccountID", id);
  GDrinker.Analytics.trackPageView("/App/iOS/");
  GDrinker.Analytics.trackEvent("DeviceInit", "ios");
  GDrinker.Analytics.trackEvent("Version", GDrinker.Version);
};

GDrinker.Analytics.trackEvent = function(category, action, label, value) {
  try {
    var options = {category: category, action: action, label: label, value: value};
    cordova.exec("GoogleAnalyticsPlugin.trackEvent", options);
  } catch (ex) {
    console.log("Exception");
  }
};

GDrinker.Analytics.trackPageView = function(url) {
  try {
    cordova.exec("GoogleAnalyticsPlugin.trackPageview", url);
  } catch (ex) {
    console.log("Exception");
  }
};

document.addEventListener("deviceready", function() {
  GDrinker.Analytics.init();
}, false);
