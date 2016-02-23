// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
  el: '.container',

  highlighted: [],

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 2) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 2) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 2) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    this.clearCharts();

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
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          // this.chart = d3.multiSeriesTimeLine()
          //   .width(600).height(350)
          //   .margins({top: 40, right: 200, bottom: 40, left: 45})
          //   .color(d3.scale.ordinal().range(["#5e5e66", "#e59138", "#6d8378", "#b45b49"]).domain([1, 2, 5, 99]))
          //   .data(data)
          //   .relativeTo(total)
          //   .title("Main sources of income")
          //   .xTitle("Wave")
          //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.INCOME)
          //   .on("highlighted", function (highlighted) {
          //     // console.log("in on in chart");
          //     that.highlighted = highlighted;
          //     that.render(that.model.get("scenario").chapter); });

          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 280, bottom: 40, left: 150})
            .data(data)
            .color(d3.scale.ordinal().range(["#003950", "#88A3B6", "#E59138","#EDDAC3"]).domain([1, 2, 5, 99]))
            .relativeTo(total)
            .title("Main sources of income (% of answers) - TBC")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.INCOME);

          break;
        case 2:
          this.chart = d3.multiSeriesTimeLine()
            .width(600).height(350)
            .margins({top: 40, right: 200, bottom: 40, left: 45})
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
        case 4:
          // this.chart = d3.barChartMultiStacked()
          //   .width(455).height(350)
          //   .margins({top: 40, right: 160, bottom: 40, left: 200})
          //   .data(data)
          //   .color(d3.scale.ordinal().range(['#003950','#567888','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
          //   // .color(d3.scale.ordinal().range(['#3c5f6b','#6d8d97','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
          //   // .color(d3.scale.ordinal().range(['#486280','#748fa2','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
          //   .relativeTo(total)
          //   .title("Covering of children basic needs")
          //   .xTitle("Wave")
          //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.BASIC_NEEDS);
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
            // .highlighted(this.highlighted)
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 2:
          this.chart
            .data(this.getData(chapter))
            .highlighted(this.highlighted)
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 4:
          // this.chart
          //   .data(this.getData(chapter))
          //   .relativeTo(this.getTotalHouseholds(chapter))
          // d3.select("#main-chart").call(this.chart);
          // d3.selectAll(".bar-chart-multi-stacked rect").style("opacity", 0.7);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          // return this.model.incomesByType.top(Infinity);
          return this.model.incomesByRound.top(Infinity);
          break;
        case 2:
          return this.model.ecoContribByType.top(Infinity);
          break;
        case 4:
          // return this.model.basicNeedsByRound.top(Infinity);
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
        // return _.unique(this.model.incomesHousehold.top(Infinity).map(function(d) {
        //   return d.hh })).length;
        break;
      case 2:
        return _.unique(this.model.ecoContribHousehold.top(Infinity)
                .map(function(d) { return d.hh })).length;
        break;
      case 4:
        // return _.unique(this.model.outcomesHousehold.top(Infinity)
        //         .map(function(d) { return d.hh })).length;
        break;
      default:
        console.log("no matching case.")
    }
  },

  // getHighlighted: function(highlighted) {
  //   var bp = null;
  // }

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
