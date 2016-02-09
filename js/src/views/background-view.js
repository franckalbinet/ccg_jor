// Background view -- 1
Vis.Views.Background = Backbone.View.extend({
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
      if (page === 1) $("#page-title").text("Background");
    }
});
