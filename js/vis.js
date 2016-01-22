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
// Application router
Vis.Routers.App = Backbone.Router.extend({
  routes: {
    "*path": "load",
  },
  load: function (params) {
    Backbone.trigger("data:loading", params);
  }
});
/* Loading "tidy" data */
Vis.Collections.App = Backbone.Collection.extend({
  initialize: function(options) {
    Backbone.on("data:loading", function(params) { this.load(); }, this);
  },

  load: function() {
    var that = this;

    queue()
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        Vis.DEFAULTS.DATASETS_URL.CHILDREN)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        Vis.DEFAULTS.DATASETS_URL.HOUSEHOLDS)
      .await(_ready);

    // on success
    function _ready(error, children, households) {
      // coerce data
      Backbone.trigger("data:loaded", {
        children: children,
        households: households
      });
    }
  }
});
// Application model: save app. states
Vis.Models.App = Backbone.Model.extend({
  defaults: {
  },

  initialize: function () {
    Backbone.on("data:loaded", function(data) { this.bundle(data); }, this);
  },

  // coupling
  sync: function() {
    var that = this;
    this.intersectKeys();
    this.childrenKey.filter(this.filterExactList(that.intersectedKeys));
    this.householdKey.filter(this.filterExactList(that.intersectedKeys));
    Backbone.trigger("filter:synced");
  },

  // decoupling
  unsync: function() {
    this.childrenKey.filter(null);
    this.householdKey.filter(null);
  },

  intersectKeys: function() {
    this.intersectedKeys = _.intersection(
      this.getChildrenKeys(),
      this.getHouseholdsKeys()
    );
  },

  // "children" dataset
  getChildrenKeys: function() {
    var that = this;
    return _.uniq(this.childrenKey.top(Infinity)
      .map(function(d) { return d.hh; }));
  },

  filterByAge: function(args) {
    this.unsync();
    this.childrenAge.filter(args);
    this.sync();
  },

  // "households" dataset
  getHouseholdsKeys: function() {
    return this.householdKey.top(Infinity)
      .map(function(d) { return d.hh; });
  },

  filterByHead: function(args) {
    this.unsync();
    var filter = (args !== null) ? this.filterExactList(args) : null;
    this.householdHead.filter(filter);
    this.sync();
  },

  // allows filtering crossfilter dimensions by list of values
  filterExactList: function(array) {
    return function(d) { return array.indexOf(d) > -1; }
  },

  // filter: function() {
  //   this.unsync();
  //   // this.childrenByAge.filter(args);
  //   this.setChildrenKeys();
  //   this.sync();
  // },

  getHouseholdsByHead: function() {
    return this.householdsByHead.top(Infinity);
  },

  getHouseholdsByChildren: function() {
    var that = this;
    return d3.nest()
      .key(function(d) { return d.value; })
      .rollup(function(leaves) { return leaves.length; })
      .entries(that.childrenByHousehold.top(Infinity));
  },

  // create crossfilters + associated dimensions and groups
  bundle: function(data) {
    var that = this;

    // dataset "children"
    // household (one) -> child (many)
    var children = crossfilter(data.children);
    // dimensions
    this.childrenKey = children.dimension(function(d) { return d.hh; });
    this.childrenGender = children.dimension(function(d) { return d.gender; });
    this.childrenAge = children.dimension(function(d) { return d.age; });
    this.childrenHousehold = children.dimension(function(d) { return d.hh; });
    // groups
    this.childrenByHousehold = this.childrenHousehold.group();
    this.childrenByAge = this.childrenAge.group();
    this.childrenByGender = this.childrenGender.group();

    // dataset "households"
    // household (one) -> head, poverty, disability, ... (one)
    var households = crossfilter(data.households);
    // dimensions
    this.householdKey = households.dimension(function(d) { return d.hh; });
    this.householdHead = households.dimension(function(d) { return d.head; });
    this.houseHoldPoverty = households.dimension(function(d) { return d.poverty; });
    this.householdDisability = households.dimension(function(d) { return d.hasDis; });
    // groups
    this.householdsByHead = this.householdHead.group();
    this.householdsByPoverty = this.houseHoldPoverty.group();
    this.householdsByDisability = this.householdDisability.group();

    // dataset "incomes"
    // this.sourcesIncome = crossfilter(data.sourcesIncome);

    // dataset "expenditures"
    // this.expenditures = crossfilter(data.expenditures);

    // dataset "coping" (coping mechanisms)
    // this.coping = crossfilter(data.coping);
  }
})
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

    // Views instantiation
    new Vis.Views.ChildrenAge({model: Vis.Models.app});
    new Vis.Views.HouseholdsHead({model: Vis.Models.app});

    new Vis.Routers.App();
    Backbone.history.start();
  };
});
// Children By Age View
Vis.Views.ChildrenAge = Backbone.View.extend({
    el: '#children-by-age',

    events: {
      "keyup input": "parseFilter"
    },

    initialize: function () {
      Backbone.on("filter:synced", function(d) { this.render(); }, this);
    },

    render: function() {
      this.$el.find("#result")
        .text(JSON.stringify(this.model.childrenByHousehold.top(Infinity)));
    },

    parseFilter: function(e) {
      if (e.keyCode == 13) {
        var filter = (e.currentTarget.value !== "") ?
          JSON.parse(e.currentTarget.value) : null;
        this.model.filterByAge(filter);
      }
    }
  });
// Households By Head of family View
Vis.Views.HouseholdsHead = Backbone.View.extend({
    el: '#households-by-head',

    events: {
      "keyup input": "parseFilter"
    },

    initialize: function () {
      Backbone.on("filter:synced", function(d) { this.render(); }, this);
    },

    render: function() {
      this.$el.find("#result")
        .text(JSON.stringify(this.model.householdsByHead.top(Infinity)));
    },

    parseFilter: function(e) {
      if (e.keyCode == 13) {
        var filter = (e.currentTarget.value !== "") ?
          JSON.parse(e.currentTarget.value) : null;
        this.model.filterByHead(filter);
      }
    }
  });
