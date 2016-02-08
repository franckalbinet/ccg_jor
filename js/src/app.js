// Global namespace's method used to bootstrap the application from html
$(function () {
  'use strict';
  Vis.initialize = function () {
    /* Initialization sequence:
        1. the "app-router" parses hash string then dispatch "data:loading" event
           and send scenario to model
        2. the "app-collection" loads datasets then dispatch "data:loaded" event
        3. the "app-model" creates crossfilters dimensions, grps, ...
        4. the scenarios view listen to data:ready and new scenario to manage
           views and filters accordingly
    */

    Vis.Models.app = new Vis.Models.App();
    Vis.Collections.app = new Vis.Collections.App();
    Vis.Views.navigation = new Vis.Views.Navigation({model: Vis.Models.app});
    new Vis.Views.Scenarios({model: Vis.Models.app});


    Vis.Routers.app = new Vis.Routers.App();
    Backbone.history.start();
  };
});
