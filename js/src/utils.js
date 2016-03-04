/*  Utilities functions*/
Vis.utils = _.extend(Vis.DEFAULTS, {

  reset: function() {
    Vis.utils.clearTimer();
    $(".page-header").css("visibility", "visible");
    $("#narration").css("height", "250px");
    $(".footer").hide();
  },

  // renderProfileViews: function {
  //   new Vis.Views.HouseholdsChildren({model: Vis.Models.app});
  //   new Vis.Views.HouseholdsLocation({model: Vis.Models.app});
  //   new Vis.Views.HouseholdsPoverty({model: Vis.Models.app});
  //   new Vis.Views.HouseholdsHead({model: Vis.Models.app});
  //   new Vis.Views.ChildrenGender({model: Vis.Models.app});
  // },

  resetLayout: function() {
    Vis.utils.resetChartsCanvas();

    $(".outcomes").removeClass("col-md-12").addClass("col-md-8");
    $(".charts").show();
    $(".profile").show();
    $(".home").hide();
    $(".conclusion").hide();
    $(".child-empowerment").hide();
    Vis.utils.clearTimer();
    $(".page-header").css("visibility", "visible");
    $(".narration").show();
    Vis.Models.app.filterByChildren(null, true);
    $(".home-title").hide();
    $(".logos").css("visibility", "hidden");
    $(".footer").hide();
    $(".home .ui").css("visibility", "hidden");
  },


  clearTimer: function() {
    if (Vis.utils.chartDelay) clearTimeout(Vis.utils.chartDelay);
    if (Vis.utils.filterDelay) clearTimeout(Vis.utils.filterDelay);
  },

  setTextContent: function(attr, animated) {
    if (typeof(animated) === "undefined") animated = true;
    var scenario = this.model.get("scenario"),
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    if (attr == "main-text" && animated) $(".narration").animate({ opacity: 0 }, 0);
    $("#" + attr).html(template());
    if (attr == "main-text" && animated) $(".narration").animate({ opacity: 1 }, 1500);
  },

  chartDelay: null,

  filterDelay: null,

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
