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
      default:
        break;
      }

    Backbone.trigger("view:rendered");
    $("#pending").hide();
  }
});
