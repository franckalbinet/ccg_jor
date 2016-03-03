// Context view
Vis.Views.Context = Backbone.View.extend({
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

    Vis.utils.resetLayout();

    $(".home").show();
    $(".charts").hide();
    $(".profile").hide();

    if (this.model.get("scenario").chapter !== 1 ) {
      $(".narration").show();
      ["main-text", "quote"].forEach(function(d) {
        Vis.utils.setTextContent.call(that, d, true);
      });
    } else {
      $(".page-header").css("visibility", "hidden");
      $(".home .ui").css("visibility", "visible");
      $(".narration").hide();
      $(".home-title").show();
      $(".logos").css("visibility", "visible");
      $(".footer").show();
    }

    $("#pending").hide();
  }
});
