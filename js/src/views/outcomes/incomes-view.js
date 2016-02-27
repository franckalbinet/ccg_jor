// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
  el: '.container',

  highlighted: [],

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 3) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 3) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 3) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    Vis.utils.clearCharts();

    $(".profile").show();

    ["main-text", "quote"].forEach(function(d) {
      Vis.utils.setTextContent.call(that, d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 280, bottom: 40, left: 160})
            .data(data)
            .color(d3.scale.ordinal().range(["#003950", "#88A3B6", "#E59138","#EDDAC3"]).domain([1, 2, 5, 99]))
            .relativeTo(total)
            .title("Main sources of income (% of answers)")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.INCOME);

          break;
        case 2:
          this.chart = d3.multiSeriesTimeLine()
            .width(600).height(350)
            .margins({top: 40, right: 200, bottom: 40, left: 100})
            .color(d3.scale.ordinal().range(["#E59138","#6D8378","#88a3b6","#003950", "#A999A4","#5F1D00"]).domain([1, 2, 3, 4, 5, 6]))
            .data(data)
            .relativeTo(total)
            .title("Main economic contributors to the family")
            .xTitle("")
            .elasticY(true)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.ECO_CONTRIBUTORS)
            .on("highlighted", function (highlighted) {
              that.highlighted = highlighted;
              that.render(that.model.get("scenario").chapter); });
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
          this.chart
            .data(this.getData(chapter))
            .highlighted(this.highlighted)
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
          return this.model.incomesByRound.top(Infinity);
          break;
        case 2:
          return this.model.ecoContribByType.top(Infinity);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter) {
    switch(chapter) {
      case 1:
        var totals = {};
        this.model.incomesByRound.top(Infinity)
          .forEach(function(d) { totals[d.key] = d3.sum(d.value.map(function(v) { return v.count; })) });
        return totals;
        break;
      case 2:
        return _.unique(this.model.ecoContribHousehold.top(Infinity)
                .map(function(d) { return d.hh })).length;
        break;
      default:
        console.log("no matching case.")
    }
  },

  fixPositionning: function() {
    d3.selectAll("#main-chart .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });
  }
});
