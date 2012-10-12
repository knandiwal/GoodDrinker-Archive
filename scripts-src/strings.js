
var GDrinker = GDrinker || {};
GDrinker.Strings = GDrinker.Strings || {};
GDrinker.Languages = {};

// drink more water

GDrinker.Languages.default_strings = {
    "language": "en-us",
    "url": "--DEFAULT--",
    "language_name": "English",
    "language_version": 1,
    "default_drink_name": "Drink",
    "yes": "YES",
    "no": "NO",
    "soon": "SOON",
    "plenty_of_time": "a while",
    "time_since_last_drink": "It's been <b>{{time}}</b> since your last drink",
    "wait_until": "You should wait until at least <b>{{time}}</b>",
    "drink_now": "Be smart, <b>always</b> drink responsibily.",
    "hours": "hours",
    "one_hour": "1 hour",
    "slow_down_title": "Wow, slow down there!",
    "slow_down_msg": "You didn't leave enough time between your drinks.  Be careful!",
    "switch_language_failed": {
      "header": "Error",
      "message": "Unable to get language pack."
    },
    "action_buttons": {
        "fast_add": "Fast Add",
        "add": "Add",
        "history": "History",
        "settings": "Settings"
    },
    "dialog_add": {
        "header": "Add a drink",
        "description": "Description",
        "amount": "Amount",
        "time": "Time",
        "date": "Date"
    },
    "dialog_history": {
        "header": "History",
        "last24": "Last 24 hours",
        "last48": "Last 48 hours",
        "last72": "Last 72 hours",
        "lastW": "Last week",
        "lastM": "Last month",
        "allTime": "All time"
    },
    "dialog_settings": {
        "header": "Settings",
        "time_between": "Time Between Drinks",
        "default_drink_size": "Default Drink Size",
        "default_description": "Default Description",
        "clear_all": "Clear All Data",
        "clear_all_button": "Erase",
        "clear_msg": "This will delete all of your settings and is unrecoverable, are you sure?",
        "clear_title": "Erase everying?",
        "about": "About",
        "about_button": "About",
        "short_time_title": "Slow down!",
        "short_time_msg": "Be smart, leave more time between drinks and drink in moderation."
    },
    "dialog_about": {
        "header": "About",
        "body": "about body",
        "version": "Version",
        "build_date": "Build Date"
    },
    "dialog_welcome": {
        "header": "Welcome",
        "body": "<p>Welcome to GoodDrinker! Please remember to always drink responsibly. This app is not meant to provide any medical or legal advice about how drunk you are, but instead only to keep track of how many drinks you've had and when your last drink was.</p><p>Please, be smart, <strong class='text-red'>never</strong> drink and drive. And if you're not old enough to drink, please close this app, you should <strong class='text-red'>not</strong> be drinking.</p><p>The developers of GoodDrinker are not liable for any good or bad decisions you make, or the outcome of those decisions.  Enjoy responsibility!</p>",
        "button": "I Got It!"
    },
    "close": "Close",
    "save": "Save"
};

GDrinker.Languages.Init = function(lang) {
  try {
    var langPacks = localStorage.LanguagePacks;
    if (langPacks === undefined) {
      langPacks = {};
    } else {
      langPacks = JSON.parse(langPacks);
    }
    langPacks["en-us"] = GDrinker.Languages.default_strings;
    if (langPacks[lang]) {
      if (langPacks[lang].language_version === 1) {
        GDrinker.Strings = langPacks[lang];
        setTimeout(function() {
          GDrinker.Languages.UpdateUI();
        }, 25);
      } else {
        GDrinker.Strings = langPacks["en-us"];
      }
    } else {
      GDrinker.Strings = langPacks["en-us"];
    }
  } catch (ex) {
    GDrinker.Strings = GDrinker.Languages.default_strings;
  }
};

GDrinker.Languages.UpdateUI = function() {
  $("#strButFastAdd", "#footerBar").text(GDrinker.Strings.action_buttons.fast_add);
  $("#strButAdd","#footerBar").text(GDrinker.Strings.action_buttons.add);
  $("#strButHistory", "#footerBar").text(GDrinker.Strings.action_buttons.history);
  $("#strButSettings", "#footerBar").text(GDrinker.Strings.action_buttons.settings);

  $("#strDlgAddHeader", "#dlgAddDrink").text(GDrinker.Strings.dialog_add.header);
  $("#strDlgAddDesc", "#dlgAddDrink").text(GDrinker.Strings.dialog_add.description);
  $("#strDlgAddDate", "#dlgAddDrink").text(GDrinker.Strings.dialog_add.date);
  $("#strDlgAddTime", "#dlgAddDrink").text(GDrinker.Strings.dialog_add.time);
  $("#strDlgAddAmount", "#dlgAddDrink").text(GDrinker.Strings.dialog_add.amount);

  $("#strDlgSettingsHeader", "#dlgSettings").text(GDrinker.Strings.dialog_settings.header);
  $("#strDlgSettingsTimeBetween", "#dlgSettings").text(GDrinker.Strings.dialog_settings.time_between);
  $("#strDlgSettingsDrinkSize", "#dlgSettings").text(GDrinker.Strings.dialog_settings.default_drink_size);
  $("#strDlgSettingsDescription", "#dlgSettings").text(GDrinker.Strings.dialog_settings.default_description);
  $("#strDlgSettingsErase", "#dlgSettings").text(GDrinker.Strings.dialog_settings.clear_all);
  $("#strDlgSettingsButErase", "#dlgSettings").text(GDrinker.Strings.dialog_settings.clear_all_button);
  $("#strDlgSettingsAbout", "#dlgSettings").text(GDrinker.Strings.dialog_settings.about);
  $("#strDlgSettingsButAbout", "#dlgSettings").text(GDrinker.Strings.dialog_settings.about_button);

  $("#strDlgHistoryHeader", "#dlgHistory").text(GDrinker.Strings.dialog_history.header);
  $("#strDlgHistoryLast24", "#dlgHistory").text(GDrinker.Strings.dialog_history.last24);
  $("#strDlgHistoryLast48", "#dlgHistory").text(GDrinker.Strings.dialog_history.last48);
  $("#strDlgHistoryLast72", "#dlgHistory").text(GDrinker.Strings.dialog_history.last72);
  $("#strDlgHistoryLastW", "#dlgHistory").text(GDrinker.Strings.dialog_history.lastW);
  $("#strDlgHistoryLastM", "#dlgHistory").text(GDrinker.Strings.dialog_history.lastM);
  $("#strDlgHistoryAllTime", "#dlgHistory").text(GDrinker.Strings.dialog_history.allTime);

  $("#strDlgAboutHeader", "#dlgAbout").text(GDrinker.Strings.dialog_about.header);
  $("#strDlgAboutBody", "#dlgAbout").html(GDrinker.Strings.dialog_about.body);
  $("#strDlgAboutVersion", "#dlgAbout").text(GDrinker.Strings.dialog_about.version);
  $("#strDlgAboutBuild", "#dlgAbout").text(GDrinker.Strings.dialog_about.build_date);

  $("#strDlgFirstRunHeader", "#dlgFirstRun").text(GDrinker.Strings.dialog_welcome.header);
  $("#strDlgFirstRunBody", "#dlgFirstRun").html(GDrinker.Strings.dialog_welcome.body);
  $("#strDlgFirstRunButOK", "#dlgFirstRun").text(GDrinker.Strings.dialog_welcome.button);

  $(".strButClose").text(GDrinker.Strings.close);
  $(".strButSave").text(GDrinker.Strings.save);
};

GDrinker.Languages.LoadLanguageResources = function(url) {
  var jqxhr = $.ajax({url: url, cache:false})
  .done(function(result) {
    var langPacks = localStorage.LanguagePacks || {};
    console.log(result.language);
    langPacks[result.language] = result;
    localStorage.LanguagePacks = JSON.stringify(langPacks);
  })
  .fail(function(result) {
    GDrinker.Helpers.alert(GDrinker.Strings.switch_language_failed.message,
      GDrinker.Strings.switch_language_failed.header, function() {});
  });
};




