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
      if (that.model.get("scenario").page === 3  && !d.silent) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    Vis.utils.resetLayout();

    $(".profile").show();

    ["main-text", "quote"].forEach(function(d) {
      Vis.utils.setTextContent.call(that, d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    $(".charts").animate({ opacity: 0 }, 0);
    Vis.utils.chartDelay = setTimeout(function() {
      that.initChart(chapter);
      $(".charts").animate({ opacity: 1 }, 1500);
    }, 4000);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiClustered()
            .width(600).height(350)
            .margins({top: 40, right: 100, bottom: 40, left: 60})
            .data(data)
            .color(d3.scale.ordinal().range(["#003950", "#E59138", "#609078"]).domain([1, 2, 3]))
            .relativeTo(total)
            .title("Main sources of income")
            .xTitle("")
            .lookUpX(Vis.DEFAULTS.LOOKUP_CODES.INCOME)
            .lookUpColors(Vis.DEFAULTS.LOOKUP_CODES.WAVES);

          break;
        case 2:
          this.chart = d3.multiSeriesTimeLine()
            .width(600).height(350)
            .margins({top: 40, right: 200, bottom: 40, left: 100})
            .color(d3.scale.ordinal().range(["#E59138","#003950","#88a3b6","#003950","#B45B49","#5F1D00"]).domain([1, 2, 3, 4, 5, 6]))
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
          // return this.model.incomesByRound.top(Infinity);
          return this.model.incomesByType.top(Infinity);
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
        // var totals = {};
        // this.model.incomesByRound.top(Infinity)
        //   .forEach(function(d) { totals[d.key] = d3.sum(d.value.map(function(v) { return v.count; })) });
        // return totals;
        return _.unique(this.model.incomesType.top(Infinity)
                .map(function(d) { return d.hh })).length;
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
    d3.select(".legends").attr("transform", "translate(-40,0)");
    // d3.selectAll("#main-chart .x.axis text")
    //   .data(["UN Cash Assistance", "WFP Voucher", "Paid Labour", "Other"])
    //   .text(function(d) { return d; });

      // Cash Assistance (UNICEF and UNHCR)", 2:"Food Voucher (WFP)", 5:"Paid labour", 99:"Other"
  }
});
