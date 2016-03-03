// Expenditures view
Vis.Views.Expenditures = Backbone.View.extend({
    el: '.container',

    highlighted: [],

    initialize: function () {
      var that = this;

      if (that.model.get("scenario").page === 4) this.preRender(this.model.get("scenario").chapter);

      this.model.on("change:scenario", function() {
        if (that.model.get("scenario").page === 4) this.preRender(that.model.get("scenario").chapter);
        },this);

      Backbone.on("filtered", function(d) {
        if (that.model.get("scenario").page === 4 && !d.silent) this.render(that.model.get("scenario").chapter);
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
            this.chart = d3.multiSeriesTimeLineAlt()
              .width(600).height(350)
              .margins({top: 40, right: 150, bottom: 40, left: 180})
              .data(data)
              .color(d3.scale.ordinal().range(
                ["#003950","#E59138","#5F1D00"]).domain([1, 2, 3]))
              .relativeTo(total)
              .yDomain([1,2,4,3,9,10,7,5,6,8,11,13,12,97])
              .title("Reported expenditures")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES)
              .on("highlighted", function (highlighted) {
                that.highlighted = highlighted;
                that.render(that.model.get("scenario").chapter); });
            break;
          case 2:
            this.chart = d3.multiSeriesTimeLineAlt()
              .width(600).height(350)
              .margins({top: 40, right: 150, bottom: 40, left: 180})
              .data(data)
              .color(d3.scale.ordinal().range(
                ["#003950","#E59138","#5F1D00"]).domain([1, 2, 3]))
              .relativeTo(total)
              // .yDomain([10,6,3,9,1,7,5,2,11,4,12,13,99])
              .yDomain([10,6,3,9,7,5,2,11,4,12,13,99])
              .title("Children-specific expenditures")
              .xTitle("")
              .isExpenditureChildren(true)
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES_CHILDREN)
              .on("highlighted", function (highlighted) {
                that.highlighted = highlighted;
                that.render(that.model.get("scenario").chapter); });
            break;
          case 3:
            this.chart = d3.barChartMultiStacked()
              .width(600).height(350)
              .margins({top: 40, right: 250, bottom: 40, left: 200})
              .data(data)
              .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
              .relativeTo(total)
              .title("Were you able to cover expenses for your children that were not a priority before ?")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COV_CHILD_EXP);
            break;
          default:
            console.log("no matching case.")
        }
      this.render(chapter);
    },

    render: function(chapter) {
      var that = this;
      switch(chapter) {
          case 1:
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
              .highlighted(this.highlighted)
            d3.select("#main-chart").call(this.chart);
            break;
          case 2:
            Vis.utils.filterDelay = setTimeout(function() {
              that.model.filterByChildren([4,5,6,7,8,9]);
            }, 3000);

            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
              .highlighted(this.highlighted)
            d3.select("#main-chart").call(this.chart);
            break;
          case 3:
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
            d3.select("#main-chart").call(this.chart);
            this.fixPositionning();
            break;
          default:
            console.log("no matching case.")
        }
    },

    getData: function(chapter) {
      switch(chapter) {
          case 1:
            return this.model.expendituresByRound.top(Infinity);
            break;
          case 2:
            return this.model.expendituresChildByRound.top(Infinity);
            break;
          case 3:
            return this.model.covChildExpByRound.top(Infinity);
            break;
          default:
            console.log("no matching case.")
        }
    },

    getTotalHouseholds: function(chapter) {
      switch(chapter) {
        case 1:
          return _.unique(this.model.expendituresHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        case 2:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        case 3:
          return _.unique(this.model.outcomesHousehold.top(Infinity)
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
