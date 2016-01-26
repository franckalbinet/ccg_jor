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
    HOUSEHOLDS: "households.json",
    OUTCOMES: "outcomes.json"
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
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.OUTCOMES)
      .await(_ready);

    // on success
    function _ready(error, children, households, outcomes) {
      // coerce data
      Backbone.trigger("data:loaded", {
        children: children,
        households: households,
        outcomes: outcomes
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

  sync: function() {
    // propagate selected houseolds to outcomes
    this.outcomesHead.filter( this.filterExactList(this.getHouseholds()));
    Backbone.trigger("filtered");
  },

  // DIMENSION FILTER PROXIES
  filterByAge: function(args) {
    var filter = (args) ? this.filterExactList(args) : null;
    this.set("ages", args || this.getKeys(this.childrenByAge));
    this.childrenAge.filter(filter);
    Backbone.trigger("filtering");
  },

  filterByGender: function(args) {
    var filter = (args !== null) ? this.filterExactList(args) : null;
    this.set("genders", args || this.getKeys(this.childrenByGender));
    this.childrenGender.filter(filter);
    Backbone.trigger("filtering");
  },

  filterByHead: function(args) {
    var filter = (args !== null) ? this.filterExactList(args) : null;
    this.set("heads", args || this.getKeys(this.householdsByHead));
    this.householdsHead.filter(filter);
    Backbone.trigger("filtering");
  },

  // UTILITY FUNCTIONS
  // allows filtering crossfilter dimensions by list of values
  filterExactList: function(array) {
    return function(d) { return array.indexOf(d) > -1; }
  },

  createLookup: function(dataset, key) {
    return dataset.reduce(function(p,d) { p[d[key]] = d; return p; }, {});
  },

  reduceAddUniq: function() {
    return function(p, v) {
      if (v.hh in p.households) p.households[v.hh]++;
      else {
          p.households[v.hh] = 1;
          p.householdCount++;
      }
      return p;
    }
  },

  reduceRemoveUniq: function() {
    return function(p, v) {
      p.households[v.hh]--;
      if (p.households[v.hh] === 0) {
         delete p.households[v.hh];
         p.householdCount--;
      }
      return p;
    }
  },

  reduceInitUniq: function() {
    return function() {
      return { householdCount: 0, households: {} };
    }
  },

  getKeys: function(grp) {
    return grp.top(Infinity).map(function(d) { return d.key; });
  },

  getHouseholds: function() {
    return _.unique(this.childrenHousehold.top(Infinity).map(function(d) {
      return d.hh; }));
  },

  // create crossfilters + associated dimensions and groups
  bundle: function(data) {
    var that = this;

    // lookup tables
    var housholdsLookUp = that.createLookup(data.households, "hh");

    // PROFILES
    var children = crossfilter(data.children);
    // dimensions
    this.childrenAge = children.dimension(function(d) { return d.age; });
    this.childrenGender = children.dimension(function(d) { return d.gender; });
    this.childrenHousehold = children.dimension(function(d) { return d.hh; });
    this.householdsHead = children.dimension(function(d) {
      return housholdsLookUp[d.hh].head;
    });
    this.householdsPoverty = children.dimension(function(d) {
       return housholdsLookUp[d.hh].poverty;
     });
    this.householdsDisability = children.dimension(function(d) {
       return housholdsLookUp[d.hh].hasDis;
    });
    // groups
    this.childrenByAge = this.childrenAge.group();
    this.childrenByGender = this.childrenGender.group();
    this.childrenByHousehold = this.childrenHousehold.group();
    this.householdsByHead = this.householdsHead.group().reduce(
      this.reduceAddUniq(), this.reduceRemoveUniq(), this.reduceInitUniq()
    );
    this.householdsByPoverty = this.householdsPoverty.group().reduce(
      this.reduceAddUniq(), this.reduceRemoveUniq(), this.reduceInitUniq()
    );
    this.householdsByDisability = this.householdsDisability.group().reduce(
      this.reduceAddUniq(), this.reduceRemoveUniq(), this.reduceInitUniq()
    );
    // init. associated filters
    this.set("ages", this.getKeys(this.childrenByAge));
    this.set("genders", this.getKeys(this.childrenByGender));
    this.set("heads", this.getKeys(this.householdsByHead));

    // OUTCOMES
    var outcomes = crossfilter(data.outcomes);
    // dimensions
    this.outcomesHead = outcomes.dimension(function(d) { return d.hh; });

    // debugger;

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
        this.render();
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
      this.setAesthetics();
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
        this.render();
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
      this.setAesthetics();
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
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.householdsByHead.top(Infinity)
            .map(function(d) {
              return { key: d.key, value: d.value.householdCount };
            });

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-households-by-head", 400, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(60, 5, 350, 120);
        this.myChart.addMeasureAxis("x", "value");
        this.myChart.addCategoryAxis("y", "key");
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.updateSelection(e);});
      } else {
        this.myChart.data = data;
      }
      this.setAesthetics();
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      d3.selectAll("#chart-households-by-head rect").classed("selected", false);
      this.model.get("heads").forEach(function(d) {
        d3.select("#households-by-head #chart-households-by-head rect#dimple-all--" + d + "--")
          .classed("selected", true);
      })

    },

    updateSelection: function(e) {
        var filter = this.model.get("heads"),
            selected = e.yValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByHead(filter);
    }
});
// Life improvement View
Vis.Views.LifeImprovement = Backbone.View.extend({
    el: '#life-improvement',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.outcomesHead.top(Infinity);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-life-improvement", 400, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(60, 5, 350, 120);
        this.myChart.addPctAxis("x", "hh");
        this.myChart.addCategoryAxis("y", "round");
        this.mySeries = this.myChart.addSeries("imp", dimple.plot.bar);
        // myChart.addLegend(60, 10, 510, 20, "right");
        this.mySeries.addEventHandler("click", function (e) {
          // that.updateSelection(e);
        });
      } else {
        this.myChart.data = data;
      }
      // this.setAesthetics();
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      d3.selectAll("#chart-households-by-head rect").classed("selected", false);
      this.model.get("heads").forEach(function(d) {
        d3.select("#households-by-head #chart-households-by-head rect#dimple-all--" + d + "--")
          .classed("selected", true);
      })

    },

    updateSelection: function(e) {
        var filter = this.model.get("heads"),
            selected = e.yValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByHead(filter);
    }
});
