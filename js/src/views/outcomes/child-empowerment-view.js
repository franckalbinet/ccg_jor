// Children empowerment view
Vis.Views.ChildEmpowerment = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 8) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 8) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 8) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    Vis.utils.clearCharts();

    $(".profile").hide();

    ["main-text", "quote"].forEach(function(d) {
      Vis.utils.setTextContent.call(that, d);
    });

    $("#pending").hide();
    $("#main-chart").show();
  }
});
