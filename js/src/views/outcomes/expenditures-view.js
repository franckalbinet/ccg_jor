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
        if (that.model.get("scenario").page === 4) this.render(that.model.get("scenario").chapter);
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
            //   .margins({top: 40, right: 265, bottom: 40, left: 45})
            //   .data(data)
            //   .color(d3.scale.ordinal().range(
            //     ["#003950","#745114","#88a3b6","#917E8A","#E59138","#6D8378",
            //      "#5E6666","#4C4322","#B45B49","#804D00","#706B5A","#AEB883",
            //      "#5F1D00","#A999A4"]).domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 97]))
            //   .relativeTo(total)
            //   .title("Expenditures that people who receive the Cash Grant spend it on")
            //   .xTitle("Wave")
            //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES)
            //   .on("highlighted", function (highlighted) {
            //     that.highlighted = highlighted;
            //     that.render(that.model.get("scenario").chapter); });

            this.chart = d3.multiSeriesTimeLineAlt()
              .width(600).height(350)
              .margins({top: 40, right: 150, bottom: 40, left: 180})
              .data(data)
              .color(d3.scale.ordinal().range(
                ["#003950","#E59138","#609078"]).domain([1, 2, 3]))
                // ["#E59138","#88A3B6","#706B5A"]).domain([1, 2, 3]))
                // ["#A1BDC5","#567888","#003950"]).domain([1, 2, 3]))
                // ["#E59138","#003950","#B45B49"]).domain([1, 2, 3]))
              .relativeTo(total)
              .yDomain([1,2,4,3,9,10,7,5,6,8,11,13,12,97])
              .title("Expenditures that people who receive the Cash Grant spend it on")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES)
              .on("highlighted", function (highlighted) {
                that.highlighted = highlighted;
                that.render(that.model.get("scenario").chapter); });
            break;
          case 2:
            this.chart = d3.barChartMultiStacked()
              .width(600).height(350)
              .margins({top: 40, right: 280, bottom: 40, left: 150})
              .data(data)
              .color(d3.scale.ordinal().range(["#A999A4", "#C0B491", "#EDDAC3", "#80A6B1"]).domain([1, 2, 3, 99]))
              .relativeTo(total)
              .title("Children-specific expenditures [Mostly spent each month]")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES_CHILD_MOST);
            break;
          case 3:
            this.chart = d3.multiSeriesTimeLineAlt()
              .width(600).height(350)
              .margins({top: 40, right: 150, bottom: 40, left: 180})
              .data(data)
              .color(d3.scale.ordinal().range(
                ["#003950","#E59138","#609078"]).domain([1, 2, 3]))
                // ["#E59138","#88A3B6","#706B5A"]).domain([1, 2, 3]))
                // ["#E59138","#003950","#B45B49"]).domain([1, 2, 3]))
                // ["#E59138","#003950","#B45B49"]).domain([1, 2, 3]))
                // ["#1f77b4","#d62728","#2ca02c"]).domain([1, 2, 3]))
              .relativeTo(total)
              .yDomain([10,6,3,9,7,5,2,11,4,12,13,99])
              .title("Children-specific expenditures that people who receive the Cash Grant spend it on")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES_CHILDREN)
              .on("highlighted", function (highlighted) {
                that.highlighted = highlighted;
                that.render(that.model.get("scenario").chapter); });
            break;

          case 4:
            this.chart = d3.barChartMultiStacked()
              .width(600).height(350)
              .margins({top: 40, right: 280, bottom: 40, left: 150})
              .data(data)
              .color(d3.scale.ordinal().range(['#003950','#567888','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
              // .color(d3.scale.ordinal().range(['#3c5f6b','#6d8d97','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
              // .color(d3.scale.ordinal().range(['#486280','#748fa2','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
              .relativeTo(total)
              .title("Covering of children basic needs")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.BASIC_NEEDS);
            break;
          default:
            console.log("no matching case.")
        }
      this.render(chapter);
    },

    render: function(chapter) {
      switch(chapter) {
          case 1:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            //   .highlighted(this.highlighted)
            // d3.select("#main-chart").call(this.chart);
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
              .highlighted(this.highlighted)
            d3.select("#main-chart").call(this.chart);
            break;
          case 2:
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
            d3.select("#main-chart").call(this.chart);
            break;
          case 3:
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
              .highlighted(this.highlighted)
            d3.select("#main-chart").call(this.chart);
            break;
          case 4:
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
            d3.select("#main-chart").call(this.chart);
            d3.selectAll(".bar-chart-multi-stacked rect").style("opacity", 0.7);
            break;
          default:
            console.log("no matching case.")
        }
    },

    getData: function(chapter) {
      switch(chapter) {
          case 1:
            // return this.model.expendituresByType.top(Infinity);
            return this.model.expendituresByRound.top(Infinity);
            break;
          case 2:
            return this.model.expendituresChildMostByRound.top(Infinity);
            break;
          case 3:
            return this.model.expendituresChildByRound.top(Infinity);
            break;
          case 4:
            return this.model.basicNeedsByRound.top(Infinity);
            break;
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
          return _.unique(this.model.expendituresHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        case 2:
          return _.unique(this.model.outcomesHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        case 3:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        case 4:
          return _.unique(this.model.outcomesHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
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
