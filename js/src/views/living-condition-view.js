// Living condition view
Vis.Views.LivingCondition = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.setTitle(this.model.get("scenario").page);
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
        this.setTitle(this.model.get("scenario").page);
    },

    setTitle: function(page) {
      if (page === 5) $("#page-title").text("Living conditions & psychological wellbeing");
    }
});
