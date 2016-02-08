// Navigation view
Vis.Views.Navigation = Backbone.View.extend({
    el: '.container',

    events: {
      "click #nav": "updatePage",
      "click #sub-nav": "updateChapter",
    },

    initialize: function () {
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
      var scenario = this.model.get("scenario"),
          page = scenario.page,
          chapter = scenario.chapter;

      $("#nav .btn").removeClass("active");
      $("#nav #page-" + page).addClass("active");

      $("#sub-nav li").removeClass("active");
      $("#sub-nav #chapter-" + chapter).addClass("active");
    },

    updatePage: function(e) {
        e.preventDefault();
        // $(e.target).blur();
        var page = $(e.target).attr("id").split("-")[1];
        Vis.Routers.app.navigate("#page/" + page +"/chapter/1", {trigger: true});
    },

    updateChapter: function(e) {
      e.preventDefault();
      var chapter = $(e.target).attr("id").split("-")[1],
          currentPage = this.model.get("scenario").page;

      Vis.Routers.app.navigate("#page/" + currentPage +"/chapter/" + chapter, {trigger: true});
    },




});
