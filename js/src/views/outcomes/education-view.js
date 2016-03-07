// Education view
Vis.Views.Education = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this,
        viewId = Vis.DEFAULTS.VIEW_PAGE_LOOKUP["education"];

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
          this.chart = d3.barChartEducation()
            .width(600).height(350)
            .margins({top: 40, right: 240, bottom: 40, left: 140})
            .data(data)
            .title("Education attendance among school-aged children")
            .xTitle("");
        }
        // render
        this.chart
          .data(this.getData(chapter))
        d3.select("#main-chart").call(this.chart);
        break;
      default:
        console.log("no matching case.")
    }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          return this.model.educationByRound.top(Infinity);
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
      default:
        console.log("no matching case.")
    }
  }
});
