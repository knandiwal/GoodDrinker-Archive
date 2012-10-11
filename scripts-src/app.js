
var Ember = Ember || {};
var Em = Em || {};
var moment = moment || {};
var Lawnchair = Lawnchair || {};

// Create or open the data store where objects are stored for offline use
var store = new Lawnchair({adapter: 'dom'}, function() {
});

var GDrinker = Em.Application.create({
  ready: function() {
    // Call the superclass's `ready` method.
    this._super();

    // Read items from local store
    GDrinker.GetFromLocalStore();

    if (GDrinker.Settings.FirstRun) {
      GDrinker.FirstRun(null);
    }

    GDrinker.Timer.start();

    // Add handlers for buttons
    $("#btnQuickAdd").bind('click', GDrinker.QuickAdd);
    $("#btnAdd").bind('click', GDrinker.ToggleAddDrinkDlg);
    $("#btnHistory").bind('click', GDrinker.ToggleHistoryDlg);
    $("#btnSettings").bind('click', GDrinker.ToggleSettingsDlg);

  }
});

GDrinker.Version = "--BUILDVERSION--";
GDrinker.BuildDate = "--BUILDDATE--";
GDrinker.VersionCode = "--VERSIONCODE--";

GDrinker.QuickAdd = function(evt) {
  var item = {};
  item.time = Date.now();
  item.description = GDrinker.Settings.DrinkDescription;
  item.amount = GDrinker.Settings.DrinkSize;
  GDrinker.dataController.addItem(item, true);
  GDrinker.Analytics.trackEvent("AddDrink", "QuickAdd", GDrinker.Settings.DrinkSize);
};

GDrinker.DlgShowDefaults = {
  "show": true,
  "backdrop": "static",
  "keyboard": false
};

GDrinker.FirstRun = function() {
  GDrinker.Settings.FirstRun = false;
  localStorage.GDrinkerSettings = JSON.stringify(GDrinker.Settings);
  $("#dlgFirstRun").modal(GDrinker.DlgShowDefaults);
  GDrinker.Analytics.trackEvent("ShowDialog", "FirstRun");
};

GDrinker.ToggleAddDrinkDlg = function() {
  var sema = GDrinker.dataController.get('dlgAddVisible') + 1;
  GDrinker.dataController.set('dlgAddVisible', sema);
  $("#dlgAddDrink").modal(GDrinker.DlgShowDefaults);
  GDrinker.Analytics.trackEvent("ShowDialog", "AddDrink");
};

GDrinker.ToggleHistoryDlg = function() {
  var sema = GDrinker.dataController.get('dlgHistoryVisible') + 1;
  GDrinker.dataController.set('dlgHistoryVisible', sema);
  $("#dlgHistory").modal(GDrinker.DlgShowDefaults);
  GDrinker.Analytics.trackEvent("ShowDialog", "History");
};

GDrinker.ToggleAboutDlg = function() {
  var sema = GDrinker.dataController.get('dlgAboutVisible') + 1;
  GDrinker.dataController.set('dlgAboutVisible', sema);
  $("#dlgAbout").modal(GDrinker.DlgShowDefaults);
  GDrinker.Analytics.trackEvent("ShowDialog", "About");
};

GDrinker.ToggleSettingsDlg = function() {
  var sema = GDrinker.dataController.get('dlgSettingsVisible') + 1;
  GDrinker.dataController.set('dlgSettingsVisible', sema);
  $("#dlgSettings").modal(GDrinker.DlgShowDefaults);
  GDrinker.Analytics.trackEvent("ShowDialog", "Settings");
};

GDrinker.Settings = null;

GDrinker.Item = Em.Object.extend({
  time: 0,
  description: null,
  amount: null
});

GDrinker.PadTime = function(val) {
  if (val <= 9) {
    return "0" + val.toString();
  } else {
    return val.toString();
  }
};

GDrinker.GetFromLocalStore = function() {
  var settings = localStorage.GDrinkerSettings;
  if (settings === undefined) {
    settings = {
      TimeBetweenDrinks: 60,
      DrinkSize: 2,
      DrinkDescription: GDrinker.Strings.default_drink_name,
      WarningForSoon: 54,
      FirstRun: true,
      AutoRefreshRate: 1000
    };
    localStorage.GDrinkerSettings = JSON.stringify(settings);
  } else {
    settings = JSON.parse(settings);
  }
  GDrinker.Settings = settings;
  store.all(function(arr) {
    arr.forEach(function(entry) {
      GDrinker.dataController.addItem(entry, false);
    });
  });
};

GDrinker.dataController = Em.ArrayController.create({
  // content array for Ember's data
  content: [],
  lastDrink: null,
  timer: 0,
  dlgAddVisible: 0,
  dlgHistoryVisible: 0,
  dlgSettingsVisible: 0,
  dlgAboutVisible: 0,

  // Adds an item to the controller if it's not already in the controller
  addItem: function(item, save) {
    // Create the Ember object
    var emItem = GDrinker.Item.create(item);

    // Check to see if there are any items in the controller with the same
    //  time already
    var exists = this.filterProperty('time', emItem.time).length;
    if (exists === 0) {
      // If no results are returned, we insert the new item into the data
      // controller in order of publication date
      var length = this.get('length'), idx;
      idx = this.binarySearch(emItem.get('time'), 0, length);
      this.insertAt(idx, emItem);
      if (idx === 0) {
        this.set('lastDrink', emItem);
        this.set('timer', 0);
      }
      if (save) {
        item.key = item.time;
        store.save(item);
      }
      return true;
    } else {
      // It's already in the data controller, so we won't re-add it.
      return false;
    }
  },

  removeItem: function(item) {
    var length = this.get('length'), idx;
    idx = this.binarySearch(item.get('time'), 0, length);
    if (idx >= 0) {
      store.remove(item.get('time'));
      this.removeAt(idx);
      if (idx === 0) {
        if (this.get('length') === 0) {
          this.set('lastDrink', null);
          this.set('timer', 0);
        } else {
          this.set('lastDrink', this.objectAt(0));
          this.set('timer', 0);
        }
      }
      return true;
    } else {
      return false;
    }
  },

  // Binary search implementation that finds the index where a entry
  // should be inserted when sorting by date.
  binarySearch: function(value, low, high) {
    var mid, midValue;
    if (low === high) {
      return low;
    }
    mid = low + Math.floor((high - low) / 2);
    midValue = this.objectAt(mid).get('time');

    if (value < midValue) {
      return this.binarySearch(value, mid + 1, high);
    } else if (value > midValue) {
      return this.binarySearch(value, low, mid);
    }
    return mid;
  },

  // A 'property' that returns the count of items
  itemCount: function() {
    return this.get('length');
  }.property('@each'),

  canHaveAnother: function() {
    if (GDrinker.dataController.lastDrink !== null) {
      var elapsed = this.get('elapsedTime').asMinutes();
      if (elapsed > GDrinker.Settings.TimeBetweenDrinks) {
        return GDrinker.Strings.yes;
      } else if (elapsed > GDrinker.Settings.WarningForSoon) {
        return GDrinker.Strings.soon;
      } else {
        return GDrinker.Strings.no;
      }
    } else {
      return GDrinker.Strings.yes;
    }
  }.property('timer'),
  elapsedTime: function() {
    if (GDrinker.dataController.lastDrink !== null) {
      return moment.duration((Date.now() - GDrinker.dataController.lastDrink.get('time')), "milliseconds");
    } else {
      return 0;
    }
  }.property('timer'),
  drinkCount: function(hours) {
    var result = {
      drinks: 0,
      amount: 0
    };
    var time = moment(Date.now());
    if (hours >= 0) {
      time.subtract('hours', hours);
    } else {
      time = moment(0);
    }
    var list = this.get('content');
    list.forEach(function(item) {
      if (item.time > time.valueOf()) {
        result.drinks++;
        result.amount += parseFloat(item.amount);
      }
    });
    return result;
  }
});

GDrinker.StatusView = Em.View.extend({
  tagName: 'header',
  classNames: ['alert'],
  classNameBindings: ['drinkNow:alert-success','drinkSoon:alert-warning', 'drinkNo:alert-error'],
  drinkNow: function() {
    if (GDrinker.dataController.get('canHaveAnother') === GDrinker.Strings.yes) {
      return true;
    }
    return false;
  }.property('GDrinker.dataController.canHaveAnother'),
  drinkSoon: function() {
    if (GDrinker.dataController.get('canHaveAnother') === GDrinker.Strings.soon) {
      return true;
    }
    return false;
  }.property('GDrinker.dataController.canHaveAnother'),
  drinkNo: function () {
    if (GDrinker.dataController.get('canHaveAnother') === GDrinker.Strings.no) {
      return true;
    }
    return false;
  }.property('GDrinker.dataController.canHaveAnother'),
  message: function() {
    return GDrinker.dataController.get('canHaveAnother');
  }.property('GDrinker.dataController.canHaveAnother'),
  time_since: function() {
    var result = GDrinker.Strings.time_since_last_drink;
    if (GDrinker.dataController.lastDrink !== null) {
      var eTime = GDrinker.dataController.get('elapsedTime');
      var since = "";
      if (eTime.days() >= 1) {
        since = eTime.humanize(false);
      } else if (eTime.hours() > 1) {
        since = eTime.hours() + " hours ";
      } else if (eTime.hours() === 1) {
        since = " 1 hour ";
      }
      since += Math.floor(eTime.minutes()) + ":" + GDrinker.PadTime(eTime.seconds());
      result = result.replace("{{time}}", since);
    } else {
      result = result.replace("{{time}}", GDrinker.Strings.plenty_of_time);
    }
    return new Handlebars.SafeString(result);
  }.property('GDrinker.dataController.timer'),
  wait_until: function() {
    var result = GDrinker.Strings.wait_until;
    if (GDrinker.dataController.lastDrink !== null) {
      if (GDrinker.dataController.get('canHaveAnother') === GDrinker.Strings.yes) {
        return new Handlebars.SafeString(GDrinker.Strings.drink_now);
      } else {
        var timeOfLastDrink = GDrinker.dataController.lastDrink.get('time');
        var timeOfNextDrink = timeOfLastDrink + (GDrinker.Settings.TimeBetweenDrinks * 60 * 1000);
        timeOfNextDrink = moment(timeOfNextDrink).format("h:mm a");
        result = result.replace("{{time}}", timeOfNextDrink);
      }
    } else {
      return new Handlebars.SafeString(GDrinker.Strings.drink_now);
    }
    return new Handlebars.SafeString(result);
  }.property('GDrinker.dataController.timer'),
  timeSince: function() {
    if (GDrinker.dataController.lastDrink !== null) {
      var eTime = GDrinker.dataController.get('elapsedTime');
      var result = "";
      if (eTime.days() >= 1) {
        return eTime.humanize(false);
      } else if (eTime.hours() > 1) {
        result += eTime.hours() + " hours ";
      } else if (eTime.hours() === 1) {
        result += " 1 hour ";
      }
      result += Math.floor(eTime.minutes()) + ":" + GDrinker.PadTime(eTime.seconds());
      return result;
    } else {
      return GDrinker.Strings.plenty_of_time;
    }
  }.property('GDrinker.dataController.timer'),
  drinkAt: function() {
    if (GDrinker.dataController.lastDrink !== null) {
      if (GDrinker.dataController.get('canHaveAnother') === GDrinker.Strings.yes) {
        return GDrinker.Strings.now;
      } else {
        var timeOfLastDrink = GDrinker.dataController.lastDrink.get('time');
        var timeOfNextDrink = timeOfLastDrink + (GDrinker.Settings.TimeBetweenDrinks * 60 * 1000);
        return "at " + moment(timeOfNextDrink).format("h:mm a");
      }
    } else {
        return GDrinker.Strings.now;
    }
  }.property('GDrinker.dataController.canHaveAnother')
});

GDrinker.DrinkListView = Em.View.extend({
  tagName: 'tr',
  classNames: ['aa'],
  minutesAgo: function() {
    return this.get('content').get('timeSinceHumanized') + " ago";
  }.property('WReader.itemsController.@each'),
  drinkTime: function() {
    var drinkTime = moment(this.get('content').get('time'));
    return drinkTime.format("h:mm a on MMM Do, YYYY");
  }.property('WReader.itemsController.@each'),
  remove: function() {
    var drink = this.get('content');
    GDrinker.dataController.removeItem(drink);
    GDrinker.Analytics.trackEvent("RemoveDrink", "Single-StatusView");
  }
});

GDrinker.AboutView = Em.View.extend({
  classNames: ['modal', 'hide'],
  close: function() {
    $('#dlgAbout').modal('hide');
    $('#dlgSettings').removeClass("fadeDialog");
  },
  version: function() {
    return GDrinker.Version;
  }.property()
});

GDrinker.SettingsView = Em.View.extend({
  classNames: ['modal', 'hide'],
  about: function() {
    $('#dlgSettings').addClass("fadeDialog");
    GDrinker.ToggleAboutDlg();
  },
  close: function() {
    $('#dlgSettings').modal('hide');
    $("#dlgSettings .control-group").removeClass("error");
    $("#dlgSettings .btn-primary").removeAttr("disabled");
  },
  save: function() {
    var isValid = GDrinker.Helpers.ValidateNumberInput("#setTimeBetween", true) &&
      GDrinker.Helpers.ValidateNumberInput("#setDrinkSize", true) &&
      GDrinker.Helpers.ValidateRequiredTextInput("#setDesc", true);

    if (isValid) {
      GDrinker.Settings.TimeBetweenDrinks = $('#setTimeBetween').val();
      GDrinker.Settings.DrinkSize = $('#setDrinkSize').val();
      GDrinker.Settings.DrinkDescription = $('#setDesc').val();
      localStorage.GDrinkerSettings = JSON.stringify(GDrinker.Settings);
      GDrinker.Analytics.trackEvent("Settings", "TimeBetween", GDrinker.Settings.TimeBetweenDrinks);
      GDrinker.Analytics.trackEvent("Settings", "DrinkSize", GDrinker.Settings.DrinkSize);
      this.close();
    }
  },
  timeBetween: function() {
    return GDrinker.Settings.TimeBetweenDrinks;
  }.property('GDrinker.dataController.dlgSettingsVisible'),
  drinkSize: function() {
    return GDrinker.Settings.DrinkSize;
  }.property('GDrinker.dataController.dlgSettingsVisible'),
  drinkDescription: function() {
    return GDrinker.Settings.DrinkDescription;
  }.property('GDrinker.dataController.dlgSettingsVisible'),
  clearAll: function() {
    GDrinker.Helpers.confirm(GDrinker.Strings.clear_msg,
      GDrinker.Strings.clear_title,
      function(butIndex) {
        if (butIndex === 2) {
          GDrinker.dataController.set('lastDrink', null);
          GDrinker.dataController.set('content', []);
          store.nuke();
          GDrinker.Analytics.trackEvent("ClearSettings", "true");
        } else {
          GDrinker.Analytics.trackEvent("ClearSettings", "false");
        }
    });
  }
});

GDrinker.AddDrinkView = Em.View.extend({
  classNames: ['modal', 'hide'],
  close: function() {
    $('#dlgAddDrink').modal('hide');
    $("#dlgAddDrink .control-group").removeClass("error");
    $("#dlgAddDrink .btn-primary").removeAttr("disabled");
  },
  save: function() {
    var isValid = GDrinker.Helpers.ValidateRequiredTextInput("#addDesc", true) &&
      GDrinker.Helpers.ValidateNumberInput("#addAmount", true) &&
      GDrinker.Helpers.ValidateTimeInput("#addTime", true) &&
      GDrinker.Helpers.ValidateDateInput("#addDate", true);

    if (isValid) {
      var item = {};
      var datetime = $("#addDate").val() + " " + $("#addTime").val();
      item.time = moment(datetime, ["YYYY-MM-DD H:mm", "YYYY-MM-DD h:mm a", "YYYY-MM-DD h:mma"]).valueOf();
      item.description = $("#addDesc").val();
      item.amount = $("#addAmount").val();
      GDrinker.dataController.addItem(item, true);
      this.close();
      GDrinker.Analytics.trackEvent("AddDrink", "Custom", item.amount);
    }
  },
  drinkSize: function() {
    return GDrinker.Settings.DrinkSize;
  }.property('GDrinker.dataController.dlgAddVisible'),
  drinkDescription: function() {
    return GDrinker.Settings.DrinkDescription;
  }.property('GDrinker.dataController.dlgAddVisible'),
  currentTime: function() {
    var time = moment(Date.now());
    return time.format('HH:mm');
  }.property('GDrinker.dataController.dlgAddVisible'),
  currentDate: function() {
    var time = moment(Date.now());
    return time.format('YYYY-MM-DD');
  }.property('GDrinker.dataController.dlgAddVisible')
});

GDrinker.HistoryView = Em.View.extend({
  classNames: ['modal', 'hide'],
  close: function() {
    GDrinker.dataController.set('dlgHistoryVisible', false);
    $('#dlgHistory').modal('hide');
  },
  drinks24: function() {
    return GDrinker.dataController.drinkCount(24).drinks;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  qty24: function() {
    return GDrinker.dataController.drinkCount(24).amount;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  drinks48: function() {
    return GDrinker.dataController.drinkCount(48).drinks;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  qty48: function() {
    return GDrinker.dataController.drinkCount(48).amount;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  drinks72: function() {
    return GDrinker.dataController.drinkCount(72).drinks;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  qty72: function() {
    return GDrinker.dataController.drinkCount(72).amount;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  drinks168: function() {
    return GDrinker.dataController.drinkCount(168).drinks;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  qty168: function() {
    return GDrinker.dataController.drinkCount(168).amount;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  drinks720: function() {
    return GDrinker.dataController.drinkCount(720).drinks;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  qty720: function() {
    return GDrinker.dataController.drinkCount(720).amount;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  drinksAll: function() {
    return GDrinker.dataController.drinkCount().drinks;
  }.property('GDrinker.dataController.dlgHistoryVisible'),
  qtyAll: function() {
    return GDrinker.dataController.drinkCount().amount;
  }.property('GDrinker.dataController.dlgHistoryVisible')
});

GDrinker.NumberInput = Ember.TextField.extend({
  attributeBindings: ['min', 'max', 'step'],
  change: function(evt) {
    var id = "#" + evt.srcElement.id;
    GDrinker.Helpers.ValidateNumberInput(id, true);
  }
});

GDrinker.DateInput = Ember.TextField.extend({
  change: function(evt) {
    var id = "#" + evt.srcElement.id;
    GDrinker.Helpers.ValidateDateInput(id, true);
  }
});

GDrinker.TimeInput = Ember.TextField.extend({
  change: function(evt) {
    var id = "#" + evt.srcElement.id;
    GDrinker.Helpers.ValidateTimeInput(id, true);
  }
});

GDrinker.RequiredTextInput = Ember.TextField.extend({
  change: function(evt) {
    var id = "#" + evt.srcElement.id;
    GDrinker.Helpers.ValidateRequiredTextInput(id, true);
  }
});

GDrinker.Timer = {};
GDrinker.Timer.timerId = -1;

GDrinker.Timer.start = function() {
  if ((GDrinker.Settings.AutoRefreshRate > 0) && (GDrinker.Timer.timerId === -1)) {
    GDrinker.Timer.timerId = setInterval(function() {
      GDrinker.dataController.set('timer', Date.now());
    }, GDrinker.Settings.AutoRefreshRate);
  }
};

GDrinker.Timer.stop = function() {
  if (GDrinker.Timer.timerId >= 0) {
    clearInterval(GDrinker.Timer.timerId);
    GDrinker.Timer.timerId = -1;
  }
};
