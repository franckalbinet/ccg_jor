// Conclusion view
Vis.Views.Conclusion = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 10) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 10) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 10 && !d.silent) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    Vis.utils.clearCharts();

    $(".conclusion").show();
    $(".profile").hide();

    ["main-text", "quote"].forEach(function(d) {
      Vis.utils.setTextContent.call(that, d);
    });

    $(".footer").show();

    $("#pending").hide();
    $(".charts").hide();
  }
});
