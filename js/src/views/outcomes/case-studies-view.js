// Case Studies view
Vis.Views.CaseStudies = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this,
        viewId = Vis.DEFAULTS.VIEW_PAGE_LOOKUP["caseStudies"];

    if (that.model.get("scenario").page === viewId) this.render();

    this.model.on("change:scenario", function() {
      this.chart =  null;
      if (that.model.get("scenario").page === viewId) this.render();
      },this);

  },

  render: function() {
    var that = this,
        scenario = this.model.get("scenario"),
        chapter = scenario.chapter;

    this.renderTemplate();
    // this.renderChart();

    $("#case-studies").animate({ opacity: 0 }, 0);
    Vis.utils.chartDelay = setTimeout(function() {
      $("#case-studies").animate({ opacity: 1 }, 1000);
    }, 2000);

    Backbone.trigger("view:rendered");
  },

  renderTemplate: function() {
    var templateNarration = _.template(Vis.Templates["narration"]),
        templateContent = _.template(Vis.Templates["case-studies"]),
        templateMainText = this.model.getTemplateMainText(),
        templateQuote = this.model.getTemplateQuote();

        Vis.utils.reset();

        $("#content").html(templateNarration() + templateContent());
        new Vis.Views.Profile();
        $("#main-text").html(templateMainText());
        $("#quote").html(templateQuote());
        $("#narration").animate({ opacity: 0 }, 0);
        $("#narration").animate({ opacity: 1 }, 1500);
  },

  // preRender: function(chapter) {
  //   var that = this;
  //
  //   $("#households-children").show();
  //   $("#children-gender").hide();
  //
  //   Vis.utils.resetLayout();
  //
  //   $(".profile").hide();
  //
  //   ["main-text", "quote"].forEach(function(d) {
  //     Vis.utils.setTextContent.call(that, d);
  //   });
  //
  //   $("#pending").hide();
  //   $(".charts").hide();
  //   $(".child-empowerment").animate({ opacity: 0 }, 0);
  //   $(".child-empowerment").show();
  //   $(".child-empowerment").animate({ opacity: 1 }, 1500);
  //
  // }
});
