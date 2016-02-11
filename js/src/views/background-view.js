// Background view -- 1
Vis.Views.Background = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.render();
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
      var scenario = this.model.get("scenario"),
          page = scenario.page,
          chapter = scenario.chapter;

      if (page === 1) {
        this.setTitle(page);
        this.setMainText(page, chapter);
        this.setSubText(page, chapter);
      }
    },

    setTitle: function(page) {
      $("#page-title").text("Background");
    },

    setMainText: function(page, chapter) {
      var id = this.model.getMainTextTemplateId(page, chapter);
      $("#main-text").html(_.template(Vis.Templates["main-text"][id]));
    },

    setSubText: function(page, chapter) {
      var id = this.model.getSubTextTemplateId(page, chapter);
      $("#sub-text").html(_.template(Vis.Templates["sub-text"][id]));
    }
});
