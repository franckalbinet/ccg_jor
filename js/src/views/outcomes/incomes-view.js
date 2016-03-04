// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
  el: '.container',

  highlighted: [],

  initialize: function () {
    var that = this,
        viewId = Vis.DEFAULTS.VIEW_PAGE_LOOKUP["incomes"];

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
    Vis.utils.chartDelay = setTimeout(function() {
      $("#charts").animate({ opacity: 1 }, 1000);
    }, 2000);

    Backbone.trigger("view:rendered");
  },

  renderTemplate: function() {
    var templateNarration = _.template(Vis.Templates["narration"]),
        templateCharts = _.template(Vis.Templates["charts-profile"]),
        templateMainText = this.model.getTemplateMainText(),
        templateQuote = this.model.getTemplateQuote();

        Vis.utils.reset();

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
          }
          // render
          this.chart
            .data(data)
            .relativeTo(total)
          d3.select("#main-chart").call(this.chart);
          this.fixPositionning();
          break;
        case 2:
          // if does not exist - init
          if (!this.chart) {
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
                that.renderChart();
              });
          }
          // render
          this.chart
            .data(data)
            .highlighted(this.highlighted)
            .relativeTo(total)
          d3.select("#main-chart").call(this.chart);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
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
  }
});
