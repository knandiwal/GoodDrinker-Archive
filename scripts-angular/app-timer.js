GDrinker.LastDrinkTimer = angular.module('GDrinker.lastDrinkTimer', []);


GDrinker.LastDrinkTimer.factory('lastDrinkTimer', ['$timeout', 'config',  function($timeout, config) {
  var lastDrink = {};
  lastDrink.time = 0;
  lastDrink.amount = 0;
  lastDrink.description = "";

  var cssClass = "";
  var message = "";
  var time_since = "";
  var wait_until = GDrinker.Strings.wait_until;

  function setLastDrink(drink) {
    lastDrink = drink;
    var timeOfNextDrink = lastDrink.time + (config.TimeBetweenDrinks * 60 * 1000);
    timeOfNextDrink = moment(timeOfNextDrink).format("h:mm a");
    wait_until = GDrinker.Strings.wait_until.replace("{{time}}", timeOfNextDrink);
    update();
  }

  function update() {
    var timeNow = Date.now();
    elapsedTime = moment.duration(Date.now() - lastDrink.time, "milliseconds");
    if (elapsedTime.asMinutes() > config.TimeBetweenDrinks) {
      message = GDrinker.Strings.yes;
      cssClass = "alert-success";
      wait_until = GDrinker.Strings.drink_now;
    } else if (elapsedTime.asMinutes() > config.TimeBetweenDrinks * config.WarningForSoon) {
      message = GDrinker.Strings.soon;
      cssClass = "alert-warning";
    } else {
      message = GDrinker.Strings.no;
      cssClass = "alert-danger";
    }
    var since = "";
    if (lastDrink.time === 0) {
      since = GDrinker.Strings.plenty_of_time;
    } else if (elapsedTime.asDays() >= 1) {
      since = elapsedTime.humanize(false);
    } else if (elapsedTime.hours() > 1) {
      since = elapsedTime.hours() + " " + GDrinker.Strings.hours + " ";
      since += Math.floor(elapsedTime.minutes()) + ":" + GDrinker.Helpers.PadTime(elapsedTime.seconds());
    } else if (elapsedTime.hours() === 1) {
      since = "" + GDrinker.Strings.one_hour + " ";
      since += Math.floor(elapsedTime.minutes()) + ":" + GDrinker.Helpers.PadTime(elapsedTime.seconds());
    } else {
      since = Math.floor(elapsedTime.minutes()) + ":" + GDrinker.Helpers.PadTime(elapsedTime.seconds());
    }
    time_since = GDrinker.Strings.time_since_last_drink;
    time_since = time_since.replace("{{time}}", since);
  }

  var result = {};
  (function tick() {
    update();
    result.cssClass = cssClass;
    result.message = message;
    result.time_since = time_since;
    result.wait_until = wait_until;
    result.setLastDrink = setLastDrink;
    result.lastDrink = lastDrink;
    result.update = update;
    $timeout(tick, config.AutoRefreshRate);
  })();
  return result;
}]);
