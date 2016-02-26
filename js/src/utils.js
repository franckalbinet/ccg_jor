/*  Utilities functions*/
Vis.utils = _.extend(Vis.DEFAULTS, {

  clearCharts: function() {
    if (this.chart) this.chart = null;
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    d3.select("#main-chart #living-conditions").remove();
    d3.select("#main-chart #background-sample").remove();
    d3.select("#main-chart #coping-mechanisms").remove();
    $(".outcomes").removeClass("col-md-12").addClass("col-md-8");
    $(".charts").show();
    $(".profile").show();
    $(".home").hide();
  }

  // Timer: function(callback, delay) {
  //     var timerId, start, remaining = delay;
  //
  //     this.pause = function() {
  //         window.clearTimeout(timerId);
  //         remaining -= new Date() - start;
  //     };
  //
  //     this.resume = function() {
  //         start = new Date();
  //         window.clearTimeout(timerId);
  //         timerId = window.setTimeout(callback, remaining);
  //     };
  //
  //     this.clear = function() {
  //       window.clearTimeout(timerId);
  //     };
  //
  //     this.resume();
  // }
});
