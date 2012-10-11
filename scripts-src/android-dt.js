/**
 * Phonegap DatePicker Plugin Copyright (c) Greg Allen 2011 MIT Licensed
 * Reused and ported to Android plugin by Daniel van 't Oever
 */
if (typeof cordova !== "undefined") {
  /**
   * Constructor
   */
  function DatePicker() {
    this._callback;
  }

  /**
   * show - true to show the ad, false to hide the ad
   */
  DatePicker.prototype.show = function(options, cb) {
    if (options.date) {
      options.date = (options.date.getMonth() + 1) + "/" + (options.date.getDate()) + "/" + (options.date.getFullYear()) + "/"
          + (options.date.getHours()) + "/" + (options.date.getMinutes());
    }
    var defaults = {
      mode : '',
      date : '',
      allowOldDates : true
    };

    for ( var key in defaults) {
      if (typeof options[key] !== "undefined")
        defaults[key] = options[key];
    }
    this._callback = cb;

    return cordova.exec(cb, failureCallback, 'DatePickerPlugin', defaults.mode, new Array(defaults));
  };

  DatePicker.prototype._dateSelected = function(date) {
    var d = new Date(parseFloat(date) * 1000);
    if (this._callback)
      this._callback(d);
  };

  function failureCallback(err) {
    console.log("datePickerPlugin.js failed: " + err);
  }

  cordova.addConstructor(function() {
    if (!window.plugins) {
      window.plugins = {};
    }
    window.plugins.datePicker = new DatePicker();
  });
};



document.addEventListener("deviceready", function() {

  $("input[type='time']").click(function(evt) {
    var currentField = $(this);
    time = currentField.val();
    var myNewTime = new Date();

    myNewTime.setHours(time.substr(0, 2));
    myNewTime.setMinutes(time.substr(3, 2));

    window.plugins.datePicker.show({
      date: myNewTime,
      mode: 'time',
      allowOldDates: false
    }, function(returnTime) {
      var newTime = moment(returnTime);
      currentField.val(newTime.format("H:mm"));
      currentField.blur();
    });
  });


  $("input[type='date']").click(function(evt) {
    var currentField = $(this);
    var myNewDate = new Date(currentField.val()) || new Date();

    window.plugins.datePicker.show({
      date: myNewDate,
      mode: 'date',
      allowOldDates: false
    }, function(returnDate) {
      var newDate = moment(returnDate);
      currentField.val(newDate.format("YYYY-MM-DD"));
      currentField.blur();
    });
  });
  console.log("DatePicker Registered");
});
