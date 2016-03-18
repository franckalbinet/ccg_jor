// Family conditions view
Vis.Views.FamilyConditions = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this,
        viewId = Vis.DEFAULTS.VIEW_PAGE_LOOKUP["familyConditions"];

    if (that.model.get("scenario").page === viewId) this.render();

    this.model.on("change:scenario", function() {
      this.chart =  null;
      if (that.model.get("scenario").page === viewId) this.render();
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === viewId  && !d.silent) this.renderChart();
      }, this);
  },

  render: function() {
    var that = this,
        scenario = this.model.get("scenario"),
        chapter = scenario.chapter;

    this.renderTemplate();
    this.renderChart();

    $("#charts").animate({ opacity: 0 }, 0);
    Vis.Utils.chartDelay = setTimeout(function() {
      $("#charts").animate({ opacity: 1 }, 1000);
    }, 2000);

    Backbone.trigger("view:rendered");
  },

  renderTemplate: function() {
    var templateNarration = _.template(Vis.Templates["narration"]),
        templateCharts = _.template(Vis.Templates["charts-profile"]),
        templateMainText = this.model.getTemplateMainText(),
        templateQuote = this.model.getTemplateQuote();

        Vis.Utils.reset();

        $("#content").html(templateNarration() + templateCharts());
        new Vis.Views.Profile();
        $("#main-text").html(templateMainText());
        $("#quote").html(templateQuote());
        $("#narration").animate({ opacity: 0 }, 0);
        $("#narration").animate({ opacity: 1 }, 1500);
  },

  renderChart: function() {
    var that = this,
        scenario = this.model.get("scenario"),
        chapter = scenario.chapter,
        total = this.getTotalHouseholds(chapter),
        data = this.getData(chapter);

    switch(chapter) {
        case 1:
          // if does not exist - init
          if (!this.chart) {
            this.chart = d3.barChartMultiStacked()
              .width(600).height(350)
              .margins({top: 40, right: 250, bottom: 40, left: 200})
              .data(data)
              .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
              .relativeTo(total)
              .title("Improvement of family's overall living conditions")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.LIVING_CONDITIONS);
          }
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

  // initChart: function(chapter) {
  //   var that = this,
  //       data = this.getData(chapter),
  //       total = this.getTotalHouseholds(chapter);
  //
  //   switch(chapter) {
  //       case 1:
  //         this.chart = d3.barChartMultiStacked()
  //           .width(600).height(350)
  //           .margins({top: 40, right: 250, bottom: 40, left: 200})
  //           .data(data)
  //           .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
  //           .relativeTo(total)
  //           .title("Improvement of family's overall living conditions")
  //           .xTitle("")
  //           .lookUp(Vis.DEFAULTS.LOOKUP_CODES.LIVING_CONDITIONS);
  //         break;
  //       case 2:
  //         break;
  //       default:
  //         console.log("no matching case.")
  //     }
  //   this.render(chapter);
  // },
  //
  // render: function(chapter) {
  //   switch(chapter) {
  //       case 1:
  //         this.chart
  //           .data(this.getData(chapter))
  //           .relativeTo(this.getTotalHouseholds(chapter))
  //         d3.select("#main-chart").call(this.chart);
  //
  //         this.fixPositionning();
  //         break;
  //       case 2:
  //         break;
  //       default:
  //         console.log("no matching case.")
  //     }
  // },

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

  fixPositionning: function() {
    d3.selectAll("#main-chart .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });
  }
});
