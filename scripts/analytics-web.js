/* analytics.js */

var GDrinker = GDrinker || {};
GDrinker.Analytics = {};

GDrinker.Analytics.init = function() {
  var id = "UA-9988000-21";
  window._gaq = window._gaq || [];
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  window._gaq.push(['_setAccount', id]);
  GDrinker.Analytics.trackEvent("DeviceInit", "web");
};

GDrinker.Analytics.trackEvent = function(category, action, label, value) {
  window._gaq.push(["_trackEvent", category, action, label, value]);
};

GDrinker.Analytics.trackPageView = function(url) {
  window._gaq.push(['_trackPageview', url]);
};


$(document).ready(function() {
  GDrinker.Analytics.init();
});

