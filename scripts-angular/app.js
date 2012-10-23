var GDrinker = angular.module('GDrinker', ['GDrinker.config', 'GDrinker.services', 'GDrinker.lastDrinkTimer']);

GDrinker.Version = "--BUILDVERSION--";
GDrinker.BuildDate = "--BUILDDATE--";
GDrinker.VersionCode = "--VERSIONCODE--";

GDrinker.run(function(drinks, config, lastDrinkTimer) {
  //console.log("GDrinker.run", drinks, config, lastDrinkTimer);
});

GDrinker.AppController = function($scope, drinks) {
  $scope.drinks = drinks;
};

GDrinker.DrinkList = function($scope, drinks) {

  $scope.predicate = "-time";

  $scope.removeDrink = function(drink) {
    drinks.remove(drink.drink);
  };
};


GDrinker.HeaderController = function($scope, lastDrinkTimer) {

  $scope.status = lastDrinkTimer;

  $scope.$watch('status.lastDrink', function(newVal) {
    console.log("FIRED", newVal);
    lastDrinkTimer.update();
  });

};

GDrinker.FooterController = function($scope, drinks, config) {

  $scope.fastAdd = function() {
    console.log("Fast Add");
    var drink = {};
    drink.time = Date.now();
    drink.amount = config.DrinkSize;
    drink.description = config.DrinkDescription;
    drinks.add(drink);
  };

  $scope.showAdd = function() {
    console.log("Show Add Drink");
    GDrinker.AddDialogController.show();
  };

  $scope.showHistory = function() {
    console.log("Show History");
  };

  $scope.showSettings = function() {
    console.log("Show Settings");
  };
};

GDrinker.AddDialogController = function($scope, drinks, config) {

  $scope.show = function() {

  };

};
