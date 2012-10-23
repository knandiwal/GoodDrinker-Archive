GDrinker.Services = angular.module('GDrinker.config', []);

GDrinker.Services.factory('config', function() {
  var settings = localStorage.GDrinkerSettings;
  if (settings === undefined) {
    settings = {
      ConfigVersion: 1,
      TimeBetweenDrinks: 60,
      DrinkSize: 2,
      DrinkDescription: 'Drink',
      WarningForSoon: 0.95,
      FirstRun: true,
      AutoRefreshRate: 100,
      Language: 'en-us'
    };
    localStorage.GDrinkerSettings = JSON.stringify(settings);
  } else {
    settings = JSON.parse(settings);
  }
  GDrinker.Languages.Init(settings.Language);
  return settings;
});
