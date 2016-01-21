// Global namespace's method used to bootstrap the application from html
$(function () {
  'use strict';
  Vis.initialize = function () {
    Vis.Collections.app = new Vis.Collections.App();
    // Vis.Routers.app = new Vis.Routers.App();
    new Vis.Routers.App();
    Backbone.history.start();
  };
});
