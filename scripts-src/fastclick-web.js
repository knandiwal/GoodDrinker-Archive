var FastClick = FastClick || {};
var console = console || {};

$(window).load(function () {
  new FastClick(document.body);
  console.log("FastClick Registered (Web)");
});
