// Context view
Vis.Views.Context = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this,
        viewId = Vis.DEFAULTS.VIEW_PAGE_LOOKUP["context"];

    if (that.model.get("scenario").page === viewId) this.render();

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === viewId) this.render();
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === viewId && !d.silent) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  render: function() {
    var that = this,
        scenario = this.model.get("scenario"),
        chapter = scenario.chapter;

    switch (this.model.get("scenario").chapter) {
      case 1:
        Vis.utils.reset();
        var templateFrontPage =  _.template(Vis.Templates["front-page"]);
        $(".page-header").css("visibility", "hidden");
        $(".footer").show();
        $("#content").html(templateFrontPage());
        break;
      case 2:
        Vis.utils.reset();
        var templateNarration =  _.template(Vis.Templates["narration"]),
            templateMainText = this.model.getTemplateMainText();

        $("#content").html(templateNarration());
        $("#narration").css("height", "500px");

        $("#main-text").html(templateMainText());

        $("#narration").find("#main-text p").each(function(e) { $(this).animate({ opacity: 0 }, 0); });
        $("#narration").find("#main-text p:nth-child(1)").animate({ opacity: 1 }, 1000);

        break;
      case 3:
          $("#narration").find("#main-text p:nth-child(2)").animate({ opacity: 1 }, 1000);
        break;
      case 4:
          $("#narration").find("#main-text p:nth-child(3)").animate({ opacity: 1 }, 1000);
        break;
      case 5:
          $("#narration").find("#main-text p:nth-child(4)").animate({ opacity: 1 }, 1000);
        break;
      case 6:
        this.renderTemplate();
        this.renderChart();

        $("#context-timeline").animate({ opacity: 0 }, 0);
        Vis.utils.chartDelay = setTimeout(function() {
          $("#context-timeline").animate({ opacity: 1 }, 1000);
        }, 2000);
        break;
      default:
        break;
      }

    Backbone.trigger("view:rendered");
    $("#pending").hide();
  },

  renderTemplate: function() {
    var templateNarration = _.template(Vis.Templates["narration"]),
        templateCharts = _.template(Vis.Templates["context-timeline"]),
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
        data = this.getData(chapter);

    switch(chapter) {
      case 6:
        // if does not exist - init
        if (!this.chart) {
          this.chart = d3.contextTimeline()
            .width(900).height(350)
            .margins({top: 40, right: 20, bottom: 175, left: 60})
            .data(data)
          }
          // render
          d3.select("#context-timeline .chart").call(this.chart);
          break;
      default:
        console.log("no matching case.");
    }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 6:
          return this.model.data.contextTimeline;
          break;
        default:
          console.log("no matching case.")
      }
  }
});
