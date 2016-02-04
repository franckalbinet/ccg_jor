// Application router
Vis.Routers.App = Backbone.Router.extend({
  loaded: false,
  routes: {
    "page/:page/chapter/:chapter": "refresh"
  },

  refresh: function (page, chapter) {
    var page = page || 1,
        chapter = chapter || 1;

    console.log(this.loaded);
    if(!this.loaded) {
      $(".container").hide();
      window.setTimeout(this.load, 1000);
    }
    this.loaded = true;
    Backbone.trigger("scenario:updating", {page: +page, chapter: +chapter});
  },

  load: function() {
    Backbone.trigger("data:loading");
  }
});
