/* wrappers.js */

var GDrinkerHelper = GDrinkerHelper || {};

GDrinkerHelper.confirm = function(msg, title, callback) {
  if (navigator.notification && navigator.notification.confirm) {
    navigator.notification.confirm(msg, callback, title, "Cancel,OK");
  } else {
    setTimeout(function(){
      var response = confirm(msg);
      if (response) {
        callback(2);
      } else {
        callback(1);
      }
    }, 0);
  }
};

GDrinkerHelper.setErrorOnForm = function(elementId, isValid) {
  if (isValid) {
    $(elementId).parents(".control-group").removeClass("error");
    $(elementId).parents(".ember-view .modal").find(".btn-primary").removeAttr("disabled");
  } else {
    $(elementId).parents(".control-group").addClass("error");
    $(elementId).parents(".ember-view .modal").find(".btn-primary").attr("disabled", "disabled");
  }
};

GDrinkerHelper.ValidateNumberInput = function(elementId, setError) {
  var value = $(elementId).val();
  var isValid = (value - 0) == value && value.length > 0;
  var min = $(elementId).attr("min") || "";
  if (min.length > 0) {
    if (value < parseFloat(min)) {
      isValid = false;
    }
  }
  var max = $(elementId).attr("max") || "";
  if (max.length > 0) {
    if (value > parseFloat(max)) {
      isValid = false;
    }
  }
  if (setError) {
    GDrinkerHelper.setErrorOnForm(elementId, isValid);
  }
  return isValid;
};

GDrinkerHelper.ValidateDateInput = function(elementId, setError) {
  var value = $(elementId).val();
  var isValid = value.length > 0;
  if (isValid && !moment(value, "YYYY-MM-DD").isValid()) {
    isValid = false;
  }
  if (setError) {
    GDrinkerHelper.setErrorOnForm(elementId, isValid);
  }
  return isValid;
};

GDrinkerHelper.ValidateTimeInput = function(elementId, setError) {
  var value = $(elementId).val();
  var isValid = value.length > 0;
  if (isValid && value === 0) {
    isValid = false;
  }
  if (isValid && !moment(value, "HH:mm").isValid()) {
    isValid = false;
  }
  if (setError) {
    GDrinkerHelper.setErrorOnForm(elementId, isValid);
  }
  return isValid;
};

GDrinkerHelper.ValidateRequiredTextInput = function(elementId, setError) {
  var value = $(elementId).val();
  var isValid = value.length > 0;
  if (setError) {
    GDrinkerHelper.setErrorOnForm(elementId, isValid);
  }
  return isValid;
};
