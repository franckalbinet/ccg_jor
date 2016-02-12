// Coping mechanism view
Vis.Views.CopingMechanism = Backbone.View.extend({
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
      if (page === 4) $("#page-title").text("Negative coping mechanisms");
    }
});
