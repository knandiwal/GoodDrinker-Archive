/* analytics.js */

var GDrinker = GDrinker || {};
GDrinker.Analytics = {};
GDrinker.Analytics.service = "none";

GDrinker.Analytics.init = function() {
  var id = "UA-9988000-21";
  if (GDrinker.Analytics.service == "web") {
    window._gaq = window._gaq || [];
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    window._gaq.push(['_setAccount', id]);
  } else if (GDrinker.Analytics.service == "phonegap") {
    PhoneGap.exec("GoogleAnalyticsPlugin.startTrackerWithAccountID", id);
  }
  GDrinker.Analytics.trackEvent("Analytics", "init");
};

GDrinker.Analytics.trackEvent = function(category, action, label, value) {
  if (GDrinker.Analytics.service == "web") {
    window._gaq.push(["_trackEvent", category, action, label, value]);
  } else if (GDrinker.Analytics.service == "phonegap") {
    var options = {category: category, action: action, label: label, value: value};
    PhoneGap.exec("GoogleAnalyticsPlugin.trackEvent", options);
  }
};

GDrinker.Analytics.trackPageView = function(url) {
  if (GDrinker.Analytics.service == "web") {
    window._gaq.push(['_trackPageview']);
  } else if (GDrinker.Analytics.service == "phonegap") {
    PhoneGap.exec("GoogleAnalyticsPlugin.trackPageview", url);
  }
};


/*
document.addEventListener("deviceready", function() {
  GDrinker.Analytics.service = "phonegap";
  GDrinker.Analytics.init();

  document.addEventListener("resume", function() {
    GDrinker.Analytics.trackEvent("lifecycle", "resume");
  }, false);

  document.addEventListener("pause", function() {
    GDrinker.Analytics.trackEvent("lifecycle", "pause");
  }, false);
}, false);
*/


$(document).ready(function() {
  GDrinker.Analytics.service = "web";
  GDrinker.Analytics.init();
});

