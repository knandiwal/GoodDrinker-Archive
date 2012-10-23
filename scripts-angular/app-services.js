GDrinker.Drinks = angular.module('GDrinker.services', []);

function Drink(time, amount, description) {
  this.time = time;
  this.amount = amount;
  this.description = description;
}

/*
Drink.prototype.$$hashKey = function() {
  return this.time;
};
*/

GDrinker.Drinks.factory('drinks', ['lastDrinkTimer',  function(lastDrinkTimer) {
  var storage_key = "GDrinkerDrinks";

  function importFromLawnChair() {
    var records = localStorage["records._index_"];
    if (records !== undefined) {
      records = JSON.parse(records);
      records.forEach(function(item) {
        var record = localStorage[item];
        drinks.add(JSON.parse(record));
        localStorage.removeItem(item);
      });
      localStorage.removeItem("records._index_");
    }
  }

  var drinks = {
    all: [],
    getDrinksFromDataStore: function() {
      console.log("GetDrinksFromDataStore");
      var records = localStorage[storage_key];
      if (records !== undefined) {
        records = JSON.parse(records);
        this.all = this.all.concat(records);
        this.all.sort(function(a, b) {
          return a.time - b.time;
        });
        lastDrinkTimer.setLastDrink(this.all[this.all.length - 1]);
      }
    },
    add: function(drink) {
      var d = new Drink(drink.time, drink.amount, drink.description);
      this.all.push(d);
      lastDrinkTimer.setLastDrink(d);
      localStorage[storage_key] = JSON.stringify(this.all);
    },
    remove: function(drink) {
      var drinkIndex = $.inArray(drink, this.all);
      if (drinkIndex >= 0) {
        this.all.splice(drinkIndex, 1);
        if (this.all.length >= 1) {
          lastDrinkTimer.setLastDrink(this.all[this.all.length - 1]);
        } else {
          lastDrinkTimer.setLastDrink(new Drink(0, 0, "Empty"));
        }
        localStorage[storage_key] = JSON.stringify(this.all);
      }
    }
  };
  importFromLawnChair();
  drinks.getDrinksFromDataStore();
  return drinks;
}]);
