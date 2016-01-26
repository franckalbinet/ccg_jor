// Global namespace's method used to bootstrap the application from html
$(function () {
  'use strict';
  Vis.initialize = function () {
    /* Initialization sequence:
        1. the "app-router" parses hash string then dispatch "data:loading" event
        2. the "app-collection" loads datasets then dispatch "data:loaded" event
        3. the "app-model" creates crossfilters dimensions, grps, ...
        4. views ...
    */
    Vis.Models.app = new Vis.Models.App();
    Vis.Collections.app = new Vis.Collections.App();

    // VIEWS INSTANCIATION
    // profile
    new Vis.Views.Scenarios({model: Vis.Models.app});
    new Vis.Views.ChildrenAge({model: Vis.Models.app});
    new Vis.Views.ChildrenGender({model: Vis.Models.app});
    new Vis.Views.HouseholdsHead({model: Vis.Models.app});

    // outcomes
    new Vis.Views.LifeImprovement({model: Vis.Models.app});

    new Vis.Routers.App();
    Backbone.history.start();
  };
});
