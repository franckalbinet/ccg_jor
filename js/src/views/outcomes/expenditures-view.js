// Expenditures view
Vis.Views.Expenditures = Backbone.View.extend({
    el: '.container',

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
            this.chart = d3.multiSeriesTimeLine()
              .width(600).height(350)
              .margins({top: 40, right: 160, bottom: 40, left: 45})
              .data(data)
              .relativeTo(total)
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES);
            break;
          case 2:
            this.chart = d3.multiSeriesTimeLine()
              .width(600).height(350)
              .margins({top: 40, right: 160, bottom: 40, left: 45})
              .data(data)
              .relativeTo(total)
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES_CHILD_MOST);
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
            return this.model.expendituresByType.top(Infinity);
            break;
          case 2:
            return this.model.expendituresChildMostByType.top(Infinity);
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
          return _.unique(this.model.expendituresChildMostHousehold.top(Infinity)
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
      if(!d3.select(".time-line svg").empty()) d3.select(".time-line svg").remove();
    }
});
