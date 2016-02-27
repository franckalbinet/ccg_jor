// Education view
Vis.Views.Education = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 7) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 7) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 7) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    Vis.utils.clearCharts();

    $(".profile").show();

    ["main-text", "quote"].forEach(function(d) {
      Vis.utils.setTextContent.call(that, d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    $("#households-children").hide();
    $("#children-gender").show();

    $(".charts").animate({ opacity: 0 }, 0);
    Vis.utils.chartDelay = setTimeout(function() {
      that.initChart(chapter);
      $(".charts").animate({ opacity: 1 }, 1500);
    }, 4000);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartEducation()
            .width(600).height(350)
            .margins({top: 40, right: 240, bottom: 40, left: 140})
            .data(data)
            .title("Education attendance among school-aged children")
            .xTitle("");
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
