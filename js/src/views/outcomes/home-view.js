// Home view
Vis.Views.Home = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 1) this.render(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 1) this.render(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 1 && !d.silent) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  render: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    Vis.utils.clearCharts();

    $(".home").show();
    $(".charts").hide();
    $(".profile").hide();
    $(".page-header img").hide();
    // $(".page-header h3").animate({"font-size": "21px"}, 500);
    $(".page-header h3").css("font-size", "21px");

    if (this.model.get("scenario").chapter !== 1 ) {
      $(".narration").css("visibility", "visible");
      ["main-text", "quote"].forEach(function(d) {
        Vis.utils.setTextContent.call(that, d, true);
      });
    } else {
      $(".narration").css("visibility", "hidden");
    }

    $("#pending").hide();
  }
});
