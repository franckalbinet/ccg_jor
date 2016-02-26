// Grant impacts view
Vis.Views.GrantImpacts = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 6) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 6) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 6) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();
    Vis.utils.clearCharts();

    $(".profile").show();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this;
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 250, bottom: 40, left: 200})
            .data(data)
            .color(d3.scale.ordinal().range(['#003950','#567888','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            .relativeTo(total)
            .title("Covering of children basic needs")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.BASIC_NEEDS);
          break;
        case 2:
          break;
        case 4:
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
          this.fixPositionning();
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter, index) {
    switch(chapter) {
        case 1:
          return this.model.basicNeedsByRound.top(Infinity);
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
    // if (this.chart) this.chart = null;
    if (this.chart) this.chart = new Array(2);
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  },

  fixPositionning: function() {
    d3.selectAll("#basic-needs .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });
  }
});
