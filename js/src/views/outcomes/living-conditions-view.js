// Living conditions view
Vis.Views.LivingConditions = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    this.chart = new Array(2);

    if (that.model.get("scenario").page === 6) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 6) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 6) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this,
        template = _.template(Vis.Templates["living-conditions"]);

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();

    Vis.utils.clearCharts();

    $("#main-chart").html(template());

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $(".profile").show();
    $("#pending").hide();
    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this;
        // data = this.getData(chapter),
        // total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart[0] = d3.barChartMultiStacked()
            .width(320).height(350)
            .margins({top: 40, right: 110, bottom: 40, left: 60})
            .data(this.getData(chapter, 0))
            .color(d3.scale.ordinal().range(['#003950','#567888','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            // .color(d3.scale.ordinal().range(['#3c5f6b','#6d8d97','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            // .color(d3.scale.ordinal().range(['#486280','#748fa2','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
            .title("Covering of children basic needs")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.BASIC_NEEDS);

          this.chart[1] = d3.barChartMultiStacked()
            .width(320).height(350)
            .margins({top: 40, right: 110, bottom: 40, left: 80})
            .data(this.getData(chapter, 1))
            // .color(d3.scale.ordinal().range(["#003950", "#E59138"]).domain([1, 2]))
            .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
            .title("Improvement of family's overall living conditions")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.LIVING_CONDITIONS);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart[0]
            .data(this.getData(chapter, 0))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
          d3.select("#basic-needs").call(this.chart[0]);

          this.chart[1]
            .data(this.getData(chapter, 1))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
          d3.select("#improvement").call(this.chart[1]);

          this.fixPositionning();
          break;
        case 2:
          // this.chart
          //   .data(this.getData(chapter))
          //   .relativeTo(this.getTotalHouseholds(chapter))
          // d3.select("#main-chart").call(this.chart);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter, index) {
    switch(chapter) {
        case 1:
          if(index == 0) {
             return this.model.basicNeedsByRound.top(Infinity);
          } else {
            return this.model.livingConditionsByRound.top(Infinity);
            // return this.model.stoppedCopingByType.top(Infinity);
          }

          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter, index) {
    switch(chapter) {
      case 1:
        if(index == 0) {
          return _.unique(this.model.outcomesHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
        } else {
          return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
        }
        break;
      case 2:
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());
  },

  // clearCharts: function() {
  //   // if (this.chart) this.chart = null;
  //   if (this.chart) this.chart = new Array(2);
  //   if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  // },

  fixPositionning: function() {
    d3.selectAll("#basic-needs .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });

    d3.selectAll("#improvement .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });
  }

});
