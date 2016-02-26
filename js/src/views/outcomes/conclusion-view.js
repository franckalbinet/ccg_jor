// Conclusion view
Vis.Views.Conclusion = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 10) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 10) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 10) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();
    Vis.utils.clearCharts();

    $(".conclusion").show();
    $(".profile").hide();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();
    $(".charts").hide();

    // this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 280, bottom: 40, left: 150})
            .data(data)
            // .color(d3.scale.ordinal().range(["#003950", "#E59138"]).domain([1, 2]))
            .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            .relativeTo(total)
            .title("Improvement in families overall living conditions.")
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
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 2:
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          return this.model.livingConditionsByRound.top(Infinity);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter) {
    switch(chapter) {
      case 1:
        return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
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

  clearCharts: function() {
    if (this.chart) this.chart = null;
    // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  }
});
