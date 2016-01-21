/* Global Vis object
	 Set up global application namespace using object literals.
*/
var Vis = Vis   || {};
Vis.DEFAULTS 		|| (Vis.DEFAULTS = {});
Vis.Routers     || (Vis.Routers = {});
Vis.Templates 	|| (Vis.Templates = {});
Vis.Models 			|| (Vis.Models = {});
Vis.Collections || (Vis.Collections = {});
Vis.Views 			|| (Vis.Views = {});
/*  Default/config values
    Stores all application configuration.
*/
Vis.DEFAULTS = _.extend(Vis.DEFAULTS, {
  DATASETS_URL: {
    CHILDREN: "data/children.json",
    HOUSEHOLDS: "data/households.json"
  }
});
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
