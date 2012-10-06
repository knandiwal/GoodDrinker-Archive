
var GDrinker = GDrinker || {};
GDrinker.Visibility = {};
GDrinker.Visibility.hidden = null;
GDrinker.Visibility.eventName = null;

GDrinker.Visibility.init = function() {
  if (typeof document.hidden !== "undefined") {
    GDrinker.Visibility.hidden = "hidden";
    GDrinker.Visibility.eventName = "visibilitychange";
  } else if (typeof document.mozHidden !== "undefined") {
    GDrinker.Visibility.hidden = "mozHidden";
    GDrinker.Visibility.eventName = "mozvisibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    GDrinker.Visibility.hidden = "msHidden";
    GDrinker.Visibility.eventName = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    GDrinker.Visibility.hidden = "webkitHidden";
    GDrinker.Visibility.eventName = "webkitvisibilitychange";
  }
  if (GDrinker.Visibility.eventName !== null) {
    document.addEventListener(GDrinker.Visibility.eventName,
      GDrinker.Visibility.handleChange, false);
  }
};

GDrinker.Visibility.handleChange = function() {
  if (document[GDrinker.Visibility.hidden]) {
    GDrinker.Timer.stop();
  } else {
    GDrinker.Timer.start();
  }
};

GDrinker.Visibility.init();
