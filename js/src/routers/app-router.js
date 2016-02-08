// Application router
Vis.Routers.App = Backbone.Router.extend({
  loaded: false,
  routes: {
    "page/:page/chapter/:chapter": "load",
    "*path": "default"
  },

  load: function (page, chapter) {
    var page = page || 1,
        chapter = chapter || 1;

    if(!this.loaded) {
      Backbone.trigger("data:loading");
      this.loaded = true;
    }
    Backbone.trigger("scenario:updating", {page: +page, chapter: +chapter});
  },

  default: function(params) {
    this.navigate("#page/1/chapter/1", {trigger: true});
  }
});
