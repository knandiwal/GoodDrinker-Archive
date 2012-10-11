var FastClick = FastClick || {};
var GDrinker = GDrinker || {};

$(window).load(function () {
  new FastClick(document.body);
  console.log("FastClick Registered on Body (Android)");
});
