var FastClick = FastClick || {};

document.addEventListener("deviceready", function() {
  var buttons = $(".btn");
  buttons.each(function(i, item) {
    new FastClick(item);
  });
  console.log("FastClick Registered (iOS) " + buttons.length.toString());
});
