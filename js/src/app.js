// Global namespace's method used to bootstrap the application from html
$(function () {
  'use strict';
  Vis.initialize = function () {
    console.log("app boostrapped. Congrats!")
    // Instantiate Application model
    // Vis.Models.app = new Vis.Models.App();

    // router = new Vis.Routers();
    // Backbone.history.start();
  };
});
