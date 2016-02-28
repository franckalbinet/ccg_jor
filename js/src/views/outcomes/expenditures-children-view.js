// Expenditures children view
Vis.Views.ExpendituresChildren = Backbone.View.extend({
    el: '.container',

    highlighted: [],

    initialize: function () {
      var that = this;

      if (that.model.get("scenario").page === 99) this.preRender(this.model.get("scenario").chapter);

      this.model.on("change:scenario", function() {
        if (that.model.get("scenario").page === 99) this.preRender(that.model.get("scenario").chapter);
        },this);

      Backbone.on("filtered", function(d) {
        if (that.model.get("scenario").page === 99 && !d.silent) this.render(that.model.get("scenario").chapter);
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
      var that = this,
          data = this.getData(chapter),
          total = this.getTotalHouseholds(chapter);

      switch(chapter) {
          case 1:
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
          // case 2:
          //   this.chart
          //     .data(this.getData(chapter))
          //     .relativeTo(this.getTotalHouseholds(chapter))
          //   d3.select("#main-chart").call(this.chart);
          //   break;
          case 2:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            //   .highlighted(this.highlighted)
            // d3.select("#main-chart").call(this.chart);
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
            return this.model.covChildExpByRound.top(Infinity);
            break;
          // case 2:
          //   return this.model.expendituresChildMostByRound.top(Infinity);
          //   break;
          case 2:
            // return this.model.expendituresChildByRound.top(Infinity);
            break;
          // case 4:
          //   return this.model.basicNeedsByRound.top(Infinity);
          //   break;
          default:
            console.log("no matching case.")
        }
    },

    // test: _.throttle(function (highlighted) {
    //   this.highlighted = highlighted;
    //   this.render(this.model.get("scenario").chapter);
    //   console.log("test");
    // }, 300),

    getTotalHouseholds: function(chapter) {
      switch(chapter) {
        case 1:
          // return _.unique(this.model.expendituresHousehold.top(Infinity)
          //         .map(function(d) { return d.hh })).length;
          return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
          break;
        // case 2:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
        case 2:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        // case 4:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
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
    },

    fixPositionning: function() {
      d3.selectAll("#main-chart .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });
    }
});
