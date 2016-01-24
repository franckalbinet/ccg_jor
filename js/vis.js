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
  FAKED_DATASET: true,
  DATASETS: {
    CHILDREN: "children.json",
    HOUSEHOLDS: "households.json"
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

  url: (Vis.DEFAULTS.FAKED_DATASET) ? "data/test/" : "data/",

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
        that.url + Vis.DEFAULTS.DATASETS.CHILDREN)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.HOUSEHOLDS)
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
    ages: null,
    genders: null,
    heads: null
  },

  initialize: function () {
    Backbone.on("data:loaded", function(data) { this.bundle(data); }, this);
    Backbone.on("filtering", function(d) { this.sync(d); }, this);
  },

  sync: function(dim) {
    this.childrenKey.filter(this.filterExactList(this.getIntersectedKey()));
    this.householdKey.filter(this.filterExactList(this.getIntersectedKey()));
    Backbone.trigger("filtered", dim);
  },

  unsync: function() {
    this.childrenKey.filter(null);
    this.householdKey.filter(null);
  },

  getIntersectedKey: function() {
    return _.intersection(
      this.getChildrenKey(),
      this.getHouseholdsKey()
    )
  },

  // crossfilter keys (used to join)
  getChildrenKey: function() {
    return _.uniq(this.childrenKey.top(Infinity)
      .map(function(d) { return d.hh; }));
  },

  getHouseholdsKey: function() {
    return this.householdKey.top(Infinity).map(function(d) { return d.hh; });
  },

  // DIMENSION FILTER PROXIES
  filterByAge: function(args) {
    this.unsync();
    var filter = (args) ? this.filterExactList(args) : null;
    this.set("ages", args || this.getAll(this.childrenByAge, "ages"));
    this.childrenAge.filter(filter);
    Backbone.trigger("filtering", "childrenAge");
  },

  filterByGender: function(args) {
    this.unsync();
    var filter = (args !== null) ? this.filterExactList(args) : null;
    this.set("genders", args || this.getAll(this.childrenByGender, "genders"));
    this.childrenGender.filter(filter);
    Backbone.trigger("filtering", "childrenGender");
  },

  filterByHead: function(args) {
    this.unsync();
    var filter = (args !== null) ? this.filterExactList(args) : null;
    this.set("heads", args || this.getAll(this.householdsByHead, "heads"));
    this.householdHead.filter(filter);
    Backbone.trigger("filtering", "householdsHead");
  },

  // UTILITY FUNCTIONS
  // allows filtering crossfilter dimensions by list of values
  filterExactList: function(array) {
    return function(d) { return array.indexOf(d) > -1; }
  },

  getAll: function(grp, variable) {
    return grp.top(Infinity).map(function(d) { return d.key; });
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
    // init. associated filters
    this.set("ages", this.getAll(this.childrenByAge, "ages"));
    this.set("genders", this.getAll(this.childrenByGender, "genders"));

    // dataset "households"
    // household (one) -> head, poverty, disability, ... (one)
    var household = crossfilter(data.households);
    // dimensions
    this.householdKey = household.dimension(function(d) { return d.hh; });
    this.householdHead = household.dimension(function(d) { return d.head; });
    this.houseHoldPoverty = household.dimension(function(d) { return d.poverty; });
    this.householdDisability = household.dimension(function(d) { return d.hasDis; });
    // groups
    this.householdsByHead = this.householdHead.group();
    this.householdsByPoverty = this.houseHoldPoverty.group();
    this.householdsByDisability = this.householdDisability.group();
    // init. associated filters
    this.set("heads", this.getAll(this.householdsByHead, "heads"));

    // ignite scenarios
    Backbone.trigger("play");

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
    new Vis.Views.Scenarios({model: Vis.Models.app});
    new Vis.Views.ChildrenAge({model: Vis.Models.app});
    new Vis.Views.ChildrenGender({model: Vis.Models.app});
    new Vis.Views.HouseholdsHead({model: Vis.Models.app});

    new Vis.Routers.App();
    Backbone.history.start();
  };
});
// Scenarios
Vis.Views.Scenarios = Backbone.View.extend({
    el: '#scenarios',

    events: {
    },

    initialize: function () {
      Backbone.on("play", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      // default scenario (nothing filtered);
      this.model.filterByAge(null);
      this.model.filterByGender(null);
      this.model.filterByHead(null);
    }
  });
// Children By Age View
Vis.Views.ChildrenAge = Backbone.View.extend({
    el: '#children-by-age',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        if (d !== "childrenAge") this.render();
        if (this.myChart) this.setAesthetics();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.childrenByAge.top(Infinity);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-children-by-age", 400, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(60, 5, 350, 120);
        var x = this.myChart.addCategoryAxis("x", "key");
        this.myChart.addMeasureAxis("y", "value");
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.updateSelection(e);});
      }
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      d3.selectAll("#chart-children-by-age rect").classed("selected", false);
      this.model.get("ages").forEach(function(d) {
        d3.select("#children-by-age #chart-children-by-age rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })

    },

    updateSelection: function(e) {
        var filter = this.model.get("ages"),
            selected = e.xValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByAge(filter);
    }
});
// Children By Gender View
Vis.Views.ChildrenGender = Backbone.View.extend({
    el: '#children-by-gender',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        if (d !== "childrenGender") this.render();
        if (this.myChart) this.setAesthetics();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.childrenByGender.top(Infinity);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-children-by-gender", 400, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(60, 5, 350, 120);
        var x = this.myChart.addCategoryAxis("x", "key");
        this.myChart.addMeasureAxis("y", "value");
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.updateSelection(e);});
      }
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      d3.selectAll("#chart-children-by-gender rect").classed("selected", false);
      this.model.get("genders").forEach(function(d) {
        d3.select("#children-by-gender #chart-children-by-gender rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })

    },

    updateSelection: function(e) {
        var filter = this.model.get("genders"),
            selected = e.xValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByGender(filter);
    }
  });
// Households By Head of family View
Vis.Views.HouseholdsHead = Backbone.View.extend({
    el: '#households-by-head',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        if (d !== "householdsHead") this.render();
        if (this.myChart) this.setAesthetics();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.householdsByHead.top(Infinity);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-households-by-head", 400, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(60, 5, 350, 120);
        var x = this.myChart.addCategoryAxis("x", "key");
        this.myChart.addMeasureAxis("y", "value");
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.updateSelection(e);});
      }
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      d3.selectAll("#chart-households-by-head rect").classed("selected", false);
      this.model.get("heads").forEach(function(d) {
        d3.select("#households-by-head #chart-households-by-head rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })

    },

    updateSelection: function(e) {
        var filter = this.model.get("heads"),
            selected = e.xValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByHead(filter);
    }
});
