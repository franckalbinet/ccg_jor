/* Global Vis object
	 Set up global application namespace using object literals.
*/
var Vis = Vis		|| {};
Vis.DEFAULTS		|| (Vis.DEFAULTS = {});
Vis.Routers			|| (Vis.Routers = {});
Vis.Templates		|| (Vis.Templates = {});
Vis.Utils				|| (Vis.Utils = {});
Vis.Models			|| (Vis.Models = {});
Vis.Collections	|| (Vis.Collections = {});
Vis.Views				|| (Vis.Views = {});
/*  Default/config values
    Stores all application configuration.
*/
Vis.DEFAULTS = _.extend(Vis.DEFAULTS, {
  FAKED_DATASET: false,
  DATASETS: {
    CHILDREN: "children.json",
    HOUSEHOLDS: "households.json",
    OUTCOMES: "outcomes.json",
    TEMPLATES: "templates.json",
    INCOMES: "incomes.json",
    MILESTONES: "milestones.json"
  },
  LOOKUP_CODES: {
    GOVERNORATES: {1:"Irbid", 2:"Ajloun", 3:"Jarash", 4:"Amman", 5:"Zarqa", 6:"Madaba", 11:"Mafraq", 99:"Others"},
    POVERTY: {1:"High", 2:"Severe"},
    HEAD: {1:"Father", 2:"Mother"},
    GENDER: {1:"Male", 2:"Female"}
  }
});
/*  Utilities functions*/
Vis.utils = _.extend(Vis.DEFAULTS, {
  Timer: function(callback, delay) {
      var timerId, start, remaining = delay;

      this.pause = function() {
          window.clearTimeout(timerId);
          remaining -= new Date() - start;
      };

      this.resume = function() {
          start = new Date();
          window.clearTimeout(timerId);
          timerId = window.setTimeout(callback, remaining);
      };

      this.clear = function() {
        window.clearTimeout(timerId);
      };

      this.resume();
  }
});
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
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.TEMPLATES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.MILESTONES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.INCOMES)
      .await(_ready);

    // on success
    function _ready(error, children, households, outcomes, templates, milestones, incomes) {
      var that = this;

      // coerce data
      var timeFormatter = d3.time.format("%L");
      milestones.forEach(function(d) {
        d.time = timeFormatter.parse(d.time.toString()),
        d.page = d.page.toString(),
        d.chapter = d.chapter.toString()
      });

      Backbone.trigger("data:loaded", {
        children: children,
        households: households,
        outcomes: outcomes,
        templates: templates,
        incomes: incomes,
        milestones: milestones
      });
    }
  }
});
// Application model: save app. states
Vis.Models.App = Backbone.Model.extend({
  defaults: {
    // navigation
    scenario: null,

    // data
    initialized: false,

    // filters
    children: null, // [1,2,3,4,5,6,7,8,9]
    ages: null,
    genders: null,
    locations: null,
    heads: null,
    poverties: null,
    disabilities: null
  },

  initialize: function () {
    Backbone.on("scenario:updating", function(data) {
      this.set("scenario", {page: data.page, chapter: data.chapter});
    }, this);

    Backbone.on("data:loaded", function(data) { this.bundle(data); }, this);
    Backbone.on("filtering", function(d) { this.sync(d); }, this);
  },

  sync: function() {
    // this.outcomesHead.filter( this.filterExactList(this.getHouseholds()));
    Backbone.trigger("filtered");
  },

  // DIMENSION FILTER PROXIES
  filterByAge: function(args) {
    this.filterBy(args, "ages", this.childrenAge, this.childrenByAge);
  },

  filterByGender: function(args) {
    this.filterBy(args, "genders", this.childrenGender, this.childrenByGender);
  },

  filterByEducation: function(args) {
    this.filterBy(args, "educations", this.childrenEducation, this.childrenByEducation);
  },

  filterByWork: function(args) {
    this.filterBy(args, "works", this.childrenWork, this.childrenByWork);
  },

  filterByLocation: function(args) {
    this.filterBy(args, "locations", this.householdsLocation, this.householdsByLocation);
  },

  filterByChildren: function(args) {
    var that = this;
    this.set("children", args || [1,2,3,4,5,6,7,8,9]);
    if (args !== null) {
      var filter = this.getHouseholdsFiltered(this.get("children"));
      this.childrenHousehold.filter(this.filterExactList(filter));
    } else {
      this.childrenHousehold.filter(null);
    }
    Backbone.trigger("filtering");
  },

  filterByHead: function(args) {
    this.filterBy(args, "heads", this.householdsHead, this.householdsByHead);
  },

  filterByPoverty: function(args) {
    this.filterBy(args,"poverties", this.householdsPoverty, this.householdsByPoverty);
  },

  filterByDisability: function(args) {
    this.filterBy(args,"disabilities", this.householdsDisability, this.householdsByDisability);
  },

  filterBy: function(args, attr, dim, grp) {
      var filter = (args !== null) ? this.filterExactList(args) : null;
      this.set(attr, args || this.getKeys(grp));
      dim.filter(filter);
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

  // transform children -- hh to nb. households by nb. children
  getHouseholdsByChildren: function() {
    var that = this,
        nested = d3.nest()
          .key(function(d) { return d.value; })
          .rollup(function(leaves) {
            return {
              length: leaves.length,
              hh: leaves.map(function(d) { return d.key; })
             };
          })
          .entries(this.childrenByHousehold.top(Infinity));
    return nested
      .map(function(d) { return {key: +d.key, values: d.values}; });
  },

  // to get the list of all households within a particular range of nb.
  // of children by household, ie. [1, 3]
  getHouseholdsFiltered: function(selection) {
    var byNbChildren = d3.nest()
          .key(function(d) { return d.age; })
          .rollup(function(leaves) {
            return {
              length: leaves.length,
              hh: leaves.map(function(d) { return d.hh; })
             };
          })
          .entries(this.data.children)
          .map(function(d) { return {key: +d.key, values: d.values}; });
      var households = [];
      byNbChildren.forEach(function(d) {
        if (selection.indexOf(d.key) > -1) {
          households = households.concat(d.values.hh)
        }
      });
    return households;
  },

  getMainTextTemplateId: function(page, chapter) {
    return this.data.templates
      .filter(function(d) {
        return +d.page === +page && +d.chapter === +chapter; })[0]
      .mainText;
  },

  getSubTextTemplateId: function(page, chapter) {
    return this.data.templates
      .filter(function(d) {
        return +d.page === +page && +d.chapter === +chapter; })[0]
      .subText;
  },

  getMilestones: function() {
    return this.data.milestones;
  },

  getIncomes: function() {
    var that = this
        data = this.data.incomes.filter(function(d) {
          return that.getHouseholds().indexOf(d.hh) !== -1; });

    return d3.nest()
            .key(function(d) { return d.income; })
            .key(function(d) { return d.round; })
            .rollup(function(leaves) { return leaves.length; })
            .entries(data);
  },

  // create crossfilters + associated dimensions and groups
  bundle: function(data) {
    var that = this;
    this.data = data;

    // lookup tables
    var housholdsLookUp = that.createLookup(data.households, "hh");

    // PROFILES
    var childrenCf = crossfilter(data.children);
    // dimensions
    this.childrenAge = childrenCf.dimension(function(d) { return d.age; }); // 1
    this.childrenGender = childrenCf.dimension(function(d) { return d.gender; }); // 2
    this.childrenHousehold = childrenCf.dimension(function(d) { return d.hh; }); // 3

    this.householdsHead = childrenCf.dimension(function(d) { // 4
      return housholdsLookUp[d.hh].head;
    });
    this.householdsPoverty = childrenCf.dimension(function(d) { // 5
       return housholdsLookUp[d.hh].pov_line;
     });
    this.householdsDisability = childrenCf.dimension(function(d) { // 6
       return housholdsLookUp[d.hh].has_dis;
    });
    this.householdsLocation = childrenCf.dimension(function(d) { // 7
      return housholdsLookUp[d.hh].loc;
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
    this.householdsByLocation = this.householdsLocation.group().reduce(
      this.reduceAddUniq(), this.reduceRemoveUniq(), this.reduceInitUniq()
    );

    // init. associated filters
    this.set("ages", this.getKeys(this.childrenByAge));
    this.set("children", this.getHouseholdsByChildren().map(
      function(d) { return d.key; })
    );
    this.set("genders", this.getKeys(this.childrenByGender));
    this.set("locations", this.getKeys(this.householdsByLocation));
    this.set("heads", this.getKeys(this.householdsByHead));
    this.set("poverties", this.getKeys(this.householdsByPoverty));
    this.set("disabilities", this.getKeys(this.householdsByDisability));

    // debugger;
    // this.getHouseholdsFiltered([1,2,3]);
    // OUTCOMES
    // var outcomes = crossfilter(data.outcomes);
    // dimensions
    // this.outcomesHead = outcomes.dimension(function(d) { return d.hh; });

    $(".container").show();
    $(".spinner").hide();
    $(".loading").hide();

    this.set("initialized", true);
  }
})
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
    // new Vis.Views.Navigation({model: Vis.Models.app});
    new Vis.Views.App({model: Vis.Models.app});

    Vis.Routers.app = new Vis.Routers.App();
    Backbone.history.start();
  };
});
// main application view
Vis.Views.App = Backbone.View.extend({
    el: '#container',
    isViewsCreated: false,
    currentPage: null,

    initialize: function () {
      this.model.on("change:initialized change:scenario", function() {
        // ensure that data is ready and scenario available
        if (this.model.get("initialized") && this.model.get("scenario")) {
          if(!this.isViewsCreated) {
            new Vis.Views.TimeLineNavigation({model: Vis.Models.app});
            this.initProfileViews();
            this.initOutcomeViews();
            this.isViewsCreated = true;
          }
        }
      }, this);
    },

    initProfileViews: function() {
      new Vis.Views.HouseholdsChildren({model: Vis.Models.app});
      new Vis.Views.ChildrenAge({model: Vis.Models.app});
      new Vis.Views.HouseholdsLocation({model: Vis.Models.app});
      new Vis.Views.HouseholdsPoverty({model: Vis.Models.app});
      new Vis.Views.HouseholdsHead({model: Vis.Models.app});
      new Vis.Views.ChildrenGender({model: Vis.Models.app});
    },

    initOutcomeViews: function() {
      var scenario = this.model.get("scenario"),
          page = +scenario.page,
          chapter = +scenario.chapter;

      new Vis.Views.Background({model: Vis.Models.app});
      new Vis.Views.Education({model: Vis.Models.app});
      new Vis.Views.Incomes({model: Vis.Models.app});
      // new Vis.Views.IncomeExpenditure({model: Vis.Models.app});
      // new Vis.Views.CopingMechanism({model: Vis.Models.app});
      // new Vis.Views.LivingCondition({model: Vis.Models.app});
    }

      // Backbone.trigger("brush:childrenAge", [5,11]);
      // Backbone.trigger("brush:householdsChildren", [2,5]);
      // Backbone.trigger("select:householdsLocation", [1]);
      // Backbone.trigger("select:householdsPoverty", [1]);
  });
// Navigation view
Vis.Views.Navigation = Backbone.View.extend({
    el: '.container',

    events: {
      "click #nav": "updatePage",
      "click #sub-nav": "updateChapter",
    },

    initialize: function () {
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
      var scenario = this.model.get("scenario"),
          page = scenario.page,
          chapter = scenario.chapter;

      this.updatePageBtn(page);
      this.updateChapterList(chapter, page);
    },

    updatePage: function(e) {
        e.preventDefault();
        var page = $(e.target).attr("id").split("-")[1];
        Vis.Routers.app.navigate("#page/" + page +"/chapter/1", {trigger: true});
    },

    updateChapter: function(e) {
      e.preventDefault();
      var chapter = $(e.target).attr("id").split("-")[1],
          currentPage = this.model.get("scenario").page;

      Vis.Routers.app.navigate("#page/" + currentPage +"/chapter/" + chapter, {trigger: true});
    },

    updatePageBtn: function(page) {
      $("#nav .btn").removeClass("active");
      $("#nav #page-" + page).addClass("active");
    },

    updateChapterList: function(chapter, page) {
      $("#sub-nav li").removeClass("active");
      $("#sub-nav #chapter-" + chapter).addClass("active");

      $("#sub-nav li").show();

      switch(+page) {
        case 1:
          $("#sub-nav li").hide();
          break;
        case 2:
          this.hideList([3,4]);
          break;
        case 3:
          this.hideList([4]);
          break;
        case 4:
          this.hideList([2,3,4]);
          break;
        case 5:
          this.hideList([2,3,4]);
          break;
      }
    },

    hideList(hiddenArray) {
      hiddenArray.forEach(function(d) { $("#sub-nav li#chapter-" + d).hide();});
    }
});
// Children by age chart
Vis.Views.ChildrenAge = Backbone.View.extend({
    el: '#children-age',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("brush:childrenAge", function(d) { this.brush(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.model.childrenByAge.top(Infinity);

      this.chart = d3.barChartAge()
        .width(150).height(250)
        .margins({top: 40, right: 20, bottom: 10, left: 45})
        .data(data)
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.value; })]))
        .y(d3.scale.linear().domain([0,18]))
        .xAxis(d3.svg.axis().orient("top").tickValues([50, 100]))
        .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,18)))
        .title("By age")
        .hasBrush(true);

      this.chart.on("filtering", function (selected) {
        that.model.filterByAge(selected);
      });

      this.chart.on("filtered", function (brush) {
        if (brush.empty()) that.model.filterByAge(null);
      });

      this.render();
    },

    render: function() {
      this.chart.selected(this.model.get("ages"));
      d3.select(this.el).call(this.chart);
    },

    brush: function(extent) {
      this.chart.brushExtent(extent);
      this.render();
    }
});
// Households by nb. children chart
Vis.Views.HouseholdsChildren = Backbone.View.extend({
    el: '#households-children',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("brush:householdsChildren", function(d) { this.brush(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.barChartChildren()
        .width(150).height(155)
        .margins({top: 40, right: 20, bottom: 0, left: 45})
        .data(data)
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.values.length; })]))
        .y(d3.scale.linear().domain([0,10]))
        .xAxis(d3.svg.axis().orient("top").tickValues([50, 100]))
        .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,10)))
        .title("By nb. of children")
        .hasBrush(true);

      this.chart.on("filtering", function (selected) {
        that.model.filterByChildren(selected);
      });

      this.chart.on("filtered", function (brush) {
        if (brush.empty()) that.model.filterByChildren(null, null);
      });
      this.render();
    },

    render: function() {
      this.chart
        .data(this.getData())
        .selected(this.model.get("children"));
      d3.select(this.el).call(this.chart);
    },

    brush: function(extent) {
      this.chart.brushExtent(extent);
      this.render();
    },

    getData: function() {
      var data = this.model.getHouseholdsByChildren();
      data = data.filter(function(d) { return d.key !== 0; });
      return data;
    },

});
// Households by location (governorate)
Vis.Views.HouseholdsLocation = Backbone.View.extend({
    el: '#households-location',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("select:householdsLocation", function(d) { this.select(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.barChartLocation()
        .width(150).height(135)
        .margins({top: 40, right: 20, bottom: 10, left: 45})
        .data(data)
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.value.householdCount; })]))
        .y(d3.scale.ordinal().domain(["Amman", "Irbid", "Mafraq", "Zarqa", "Madaba", "Jarash", "Ajloun", "Others"]))
        .xAxis(d3.svg.axis().orient("top").tickValues([50, 100]))
        .yAxis(d3.svg.axis().orient("left"))
        .title("By governorate")
        .hasBrush(false);

      this.chart.on("filtered", function (selected) {
        that.model.filterByLocation(selected);
      });
      this.render();
    },

    render: function() {
      this.chart
        .data(this.getData())
        .selected(this.model.get("locations"));
      d3.select(this.el).call(this.chart);
    },

    getData: function() {
      var data = this.model.householdsByLocation.top(Infinity);
      data.forEach(function(d) {
        d.name = Vis.DEFAULTS.LOOKUP_CODES.GOVERNORATES[d.key] });
      return data;
    },

    select: function(selection) {
      this.chart.select(selection);
      this.render();
    }
});
// Households by poverty level
Vis.Views.HouseholdsPoverty = Backbone.View.extend({
    el: '#households-poverty',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("select:householdsPoverty", function(d) { this.select(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.barChartStackedHouseholds()
        .width(150).height(150)
        .margins({top: 40, right: 20, bottom: 0, left: 80})
        .data(data)
        .color(d3.scale.ordinal().range(["#538dbc", "#b6cee2"]).domain(["Severe", "High"]))
        .title("By poverty level")
        .hasBrush(false);

      // this.chart.on("filtering", function (selected) {
      //   that.model.filterByLocation(selected);
      // });

      this.chart.on("filtered", function (selected) {
        that.model.filterByPoverty(selected);
      });
      this.render();
    },

    render: function() {
      if(!this.isDataEmpty(this.getData())) {
        this.chart
          .data(this.getData())
          .selected(this.model.get("poverties"));
        d3.select(this.el).call(this.chart);
      }
    },

    getData: function() {
      var data = this.model.householdsByPoverty.top(Infinity);
      // filter "resilient" level 3 - not relevant
      data = data.filter(function(d) { return d.key !== 3; });
      data.forEach(function(d) {
        d.name = Vis.DEFAULTS.LOOKUP_CODES.POVERTY[d.key] });
      return data;
    },

    joinData: function(data) {
      data.forEach(function(d) {
        d.name = Vis.DEFAULTS.LOOKUP_CODES.GOVERNORATES[d.key] });
      return data;
    },

    select: function(selection) {
      this.chart.select(selection);
      this.render();
    },

    isDataEmpty: function(data) {
      var nullLength = data.filter(function(d) {
        return d.value.householdCount === 0; }).length;
      return (nullLength === data.length);
    }
});
// Households by head of family
Vis.Views.HouseholdsHead = Backbone.View.extend({
    el: '#households-head',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("select:householdsHead", function(d) { this.select(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.barChartStackedHouseholds()
        .width(150).height(150)
        .margins({top: 40, right: 20, bottom: 10, left: 80})
        .data(data)
        .color(d3.scale.ordinal().range(["#538dbc", "#d2766c"]).domain(["Mother", "Father"]))
        .title("By head of family")
        .hasBrush(false);

      // this.chart.on("filtering", function (selected) {
      //   that.model.filterByLocation(selected);
      // });

      this.chart.on("filtered", function (selected) {
        that.model.filterByHead(selected);
      });
      this.render();
    },

    render: function() {
      if(!this.isDataEmpty(this.getData())) {
        this.chart
          .data(this.getData())
          .selected(this.model.get("heads"));
        d3.select(this.el).call(this.chart);
      }
    },

    getData: function() {
      var data = this.model.householdsByHead.top(Infinity);
      data = data.filter(function(d) { return d.key !== 97; });
      data.forEach(function(d) {
        d.name = Vis.DEFAULTS.LOOKUP_CODES.HEAD[d.key] });
      return data;
    },

    select: function(selection) {
      this.chart.select(selection);
      this.render();
    },

    isDataEmpty: function(data) {
      var nullLength = data.filter(function(d) {
        return d.value.householdCount === 0; }).length;
      return (nullLength === data.length);
    }
});
// Children by gender
Vis.Views.ChildrenGender = Backbone.View.extend({
    el: '#children-gender',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("select:childrenGender", function(d) { this.select(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.barChartStackedChildren()
        .width(150).height(150)
        .margins({top: 40, right: 20, bottom: 10, left: 80})
        .data(data)
        .color(d3.scale.ordinal().range(["#538dbc", "#d2766c"]).domain(["Female", "Male"]))
        .title("By gender")
        .hasBrush(false);

      this.chart.on("filtered", function (selected) {
        that.model.filterByGender(selected);
      });
      this.render();
    },

    render: function() {
      if(!this.isDataEmpty(this.getData())) {
        this.chart
          .data(this.getData())
          .selected(this.model.get("genders"));
        d3.select(this.el).call(this.chart);
      }
    },

    getData: function() {
      var data = this.model.childrenByGender.top(Infinity);
      data.forEach(function(d) {
        d.name = Vis.DEFAULTS.LOOKUP_CODES.GENDER[d.key] });
      return data;
    },

    select: function(selection) {
      this.chart.select(selection);
      this.render();
    },

    isDataEmpty: function(data) {
      var nullLength = data.filter(function(d) {
        return d.value === 0; }).length;
      return (nullLength === data.length);
    }
});
// Background view -- 1
Vis.Views.Background = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.render();
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
      var scenario = this.model.get("scenario"),
          page = scenario.page,
          chapter = scenario.chapter;

      if (page === 1) {
        this.setTitle(page);
        this.setMainText(page, chapter);
        this.setSubText(page, chapter);
      }
    },

    setTitle: function(page) {
      $("#page-title").text("Background");
    },

    setMainText: function(page, chapter) {
      var id = this.model.getMainTextTemplateId(page, chapter);
      $("#main-text").html(_.template(Vis.Templates["main-text"][id]));
    },

    setSubText: function(page, chapter) {
      var id = this.model.getSubTextTemplateId(page, chapter);
      $("#sub-text").html(_.template(Vis.Templates["sub-text"][id]));
    }
});
// Coping mechanism view
Vis.Views.CopingMechanism = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.setTitle(this.model.get("scenario").page);
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
        this.setTitle(this.model.get("scenario").page);
    },

    setTitle: function(page) {
      if (page === 4) $("#page-title").text("Negative coping mechanisms");
    }
});
// Education view
Vis.Views.Education = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.setTitle(this.model.get("scenario").page);
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
        this.setTitle(this.model.get("scenario").page);
    },

    setTitle: function(page) {
      if (page === 2) $("#page-title").text("Education");
    }
});
// Living condition view
Vis.Views.LivingCondition = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.setTitle(this.model.get("scenario").page);
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
        this.setTitle(this.model.get("scenario").page);
    },

    setTitle: function(page) {
      if (page === 5) $("#page-title").text("Living conditions & psychological wellbeing");
    }
});
// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      // this.setTitle(this.model.get("scenario").page);
      this.dispatch(this.model.get("scenario"));
      this.model.on("change:scenario", function() {
        this.dispatch(this.model.get("scenario"));
        },this);
    },

    dispatch: function(scenario) {
      var scenario = this.model.get("scenario");
      if (scenario.page === 3) {
        switch(scenario.chapter) {
          case 1:
              this.render();
              break;
          case 2:
              // code block
              break;
          default:
              // default code block
        }
      }
    },

    render: function() {
      // var data = this.model.getIncomes();
      // debugger;
        // this.setTitle(this.model.get("scenario").page);
    },

    setTitle: function(page) {
      // if (page === 3) $("#page-title").text("Income & expenditure patterns");
    }
});
// Background view -- 1
Vis.Views.TimeLineNavigation = Backbone.View.extend({
    el: '#time-line-navigation',

    clock: null,
    cursor: 0,
    timer: null,
    last: false,

    events: {
      "click button": "clickHandler",
    },
    initialize: function () {
      var that = this;
      this.initChart();
      this.btnToPause($("#time-line-navigation .btn"));
      this.model.on("change:scenario", function() {
        var milestone = this.findMilestone();
        that.render();
        if(this.isLast()) {
          this.btnToPause($("#time-line-navigation .btn"));
          this.stop()
          this.cursor = 0;
        }
        },this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.timeLineNavigation()
        .width(500).height(80)
        .margins({top: 20, right: 20, bottom: 20, left: 20})
        .data(data)
        .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.time; })));

      this.render();
    },

    render: function() {
      this.chart
        .data(this.getData())
        .elapsed(this.model.get("scenario"));
      d3.select(this.el).select(".chart").call(this.chart);
    },

    getData: function() {
      return this.model.getMilestones();
    },

    start: function() {
      var that = this;
      if(!this.clock) {
        this.clock = setInterval(
          function() {
            var idx = that.getTimes().indexOf(that.cursor);
            console.log(that.cursor);
            if (idx !== -1) {
              var milestone = that.getData()[idx];
              Vis.Routers.app.navigate("#page/" + milestone.page + "/chapter/" + milestone.chapter, {trigger: true});
            }
            that.cursor += 5;
          }
          , 500);
      }
    },

    stop: function() {
      window.clearInterval(this.clock);
      this.clock = null;
    },

    clickHandler: function(e) {
      e.preventDefault();
      var btn = $(e.currentTarget);
      btn.blur();

      if (btn.hasClass("play")) {
        this.btnToPause(btn);
        this.stop();
      } else {
        this.btnToPlay(btn);
        if(this.isLast()) {
          Vis.Routers.app.navigate("#page/1/chapter/1", {trigger: true});
          // this.stop()
          // this.cursor = 0;
        }
        this.start();
      }
    },


    btnToPause: function(btn) {
      btn.removeClass("play").addClass("pause");
      btn.find("span").html("Play");
      btn.find("i").removeClass("fa-pause").addClass("fa-play");
    },

    btnToPlay: function(btn) {
      btn.removeClass("pause").addClass("play");
      btn.find("span").html("Pause");
      btn.find("i").removeClass("fa-play").addClass("fa-pause");
    },

    isPaused: function() {
      return $("#time-line-navigation .btn").hasClass("pause");
    },

    isLast: function() {
      var page = this.model.get("scenario").page,
          chapter = this.model.get("scenario").chapter,
          idx = _.findIndex(this.getData(), function(d) {
            return +d.chapter === chapter && +d.page === page ; } );

      return (idx === this.getData().length - 1);
    },

    getTimes: function() {
      return this.getData().map(function(d) { return d.time.getMilliseconds(); });
    },

    findMilestone: function() {
      var page = this.model.get("scenario").page,
          chapter = this.model.get("scenario").chapter;

          return this.getData().filter(function(d) {
            return +d.chapter === chapter && +d.page === page ; })[0];
    }
});
/* CREATE BAR CHART INSTANCE*/
d3.barChartAge = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = null,
      y = null,
      elasticY = false,
      xDomain = null,
      barHeight = 7,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;

    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      if (brushExtent) {
        brush.extent([brushExtent[0] - 0.5, brushExtent[1] - 0.5]);
        _gBrush.call(brush);
        brushExtent = null;
        _listeners.filtering(_getDataBrushed(brush));
      }

      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN
        var rects =  _gBars.selectAll("rect").data(data);
        rects.exit().remove();
        rects.enter().append("rect");
        rects
            .classed("not-selected", function(d) {
              if (hasBrush) return (selected.indexOf(d.key) === -1) ? true : false;
              return false;
            })
            // .transition()
            .attr("x", function(d) { return 0; })
            .attr("y", function(d) { return y(d.key) - barHeight/2  })
            .attr("width", function(d) { return x(d.value); })
            .attr("height", function(d) { return barHeight; });
      }

      function _skeleton() {
        // set scales range
        x.range([0 , _gWidth]);
        y.range([0, _gHeight]);

        // set brush
        if (hasBrush) brush.y(y);

        xAxis
          .innerTickSize(-_gHeight)
          .tickPadding(5);

        // set axis
        xAxis.scale(x);
        yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        g.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "start")
          .attr("x", -15)
          .attr("y", -25)
          .text(title);

        _gBrush = g.append("g").attr("class", "brush").call(brush);
        _gBrush.selectAll("rect").attr("width", _gWidth);

        brush.on("brush", function() {
          _listeners.filtering(_getDataBrushed(brush));
        });

        brush.on("brushend", function() {
          _listeners.filtered(brush);
        });
      }

      function _getDataBrushed(brush) {
        var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
        return data
          .map(function(d) { return d.key; })
          .filter(function(d) {
            return d >= extent[0] && d <= extent[1];
          });
      }
    });
  }

  // Getters and Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margins = function(_) {
    if (!arguments.length) return margins;
    margins = _;
    return chart;
  };
  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };
  chart.elasticY = function(_) {
    if (!arguments.length) return elasticY;
    elasticY = _;
    return chart;
  };
  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };
  chart.hasYAxis = function(_) {
    if (!arguments.length) return hasYAxis;
    hasYAxis = _;
    return chart;
  };
  // chart.brushClickReset = function(_) {
  //   if (!arguments.length) return brushClickReset;
  //   brushClickReset = _;
  //   return chart;
  // };
  // chart.clearBrush = function(_) {
  //   if (!arguments.length) {
  //     _gBrush.call(brush.clear());
  //     brush.event(_gBrush);
  //   }
  //   return chart;
  // };
  // chart.roundXDomain = function(_) {
  //   if (!arguments.length) return roundXDomain;
  //   roundXDomain = _;
  //   return chart;
  // };
  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
    return chart;
  };
  // chart.hasBrushLabel = function(_) {
  //   if (!arguments.length) return hasBrushLabel;
  //   hasBrushLabel = _;
  //   return chart;
  // };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.selected = function(_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  // chart.brushExtentToMax = function(_) {
  //   if (!arguments.length) return brushExtentToMax;
  //   brushExtentToMax = _;
  //   return chart;
  // };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE BAR CHART INSTANCE*/
d3.barChartChildren = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = null,
      y = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      yData = null,
      barHeight = 7,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      if (brushExtent) {
        brush.extent([brushExtent[0] - 0.5, brushExtent[1] - 0.5]);
        _gBrush.call(brush);
        brushExtent = null;
        _listeners.filtering(_getDataBrushed(brush));
      }
      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.key; });
        rects.exit().remove();
        rects.enter().append("rect");
        rects
            .classed("not-selected", function(d) {
              if (hasBrush) return (selected.indexOf(d.key) === -1) ? true : false;
              return false;
            })
            // .transition()
            .attr("x", function(d) { return 0; })
            .attr("y", function(d) {
              return y(d.key) - barHeight/2  })
            .attr("width", function(d) {
              return x(d.values.length); })
            .attr("height", function(d) { return barHeight; });
      }

      function _skeleton() {
        // set scales range
        x.range([0 , _gWidth]);
        y.range([0, _gHeight]);

        // set brush
        if (hasBrush) brush.y(y);

        xAxis
          .innerTickSize(-_gHeight)
          .tickPadding(5);

        // set axis
        xAxis.scale(x);
        yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        g.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "start")
          .attr("x", -15)
          .attr("y", -25)
          .text(title);

        _gBrush = g.append("g").attr("class", "brush").call(brush);
        _gBrush.selectAll("rect").attr("width", _gWidth);

        brush.on("brush", function() {
          _listeners.filtering(_getDataBrushed(brush));
        });

        brush.on("brushend", function() {
          _listeners.filtered(brush);
        });
      }

      function _getDataBrushed(brush) {
        var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
        return data
          .map(function(d) { return d.key; })
          .filter(function(d) {
            return d >= extent[0] && d <= extent[1];
          });
      }
    });
  }

  // Getters and Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margins = function(_) {
    if (!arguments.length) return margins;
    margins = _;
    return chart;
  };
  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };
  chart.xData = function(_) {
    if (!arguments.length) return xData;
    xData = _;
    return chart;
  };
  chart.yData = function(_) {
    if (!arguments.length) return yData;
    yData = _;
    return chart;
  };
  chart.elasticY = function(_) {
    if (!arguments.length) return elasticY;
    elasticY = _;
    return chart;
  };
  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };
  chart.hasYAxis = function(_) {
    if (!arguments.length) return hasYAxis;
    hasYAxis = _;
    return chart;
  };
  // chart.brushClickReset = function(_) {
  //   if (!arguments.length) return brushClickReset;
  //   brushClickReset = _;
  //   return chart;
  // };
  // chart.clearBrush = function(_) {
  //   if (!arguments.length) {
  //     _gBrush.call(brush.clear());
  //     brush.event(_gBrush);
  //   }
  //   return chart;
  // };
  // chart.roundXDomain = function(_) {
  //   if (!arguments.length) return roundXDomain;
  //   roundXDomain = _;
  //   return chart;
  // };
  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
    return chart;
  };
  // chart.hasBrushLabel = function(_) {
  //   if (!arguments.length) return hasBrushLabel;
  //   hasBrushLabel = _;
  //   return chart;
  // };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.selected = function(_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  // chart.brushExtentToMax = function(_) {
  //   if (!arguments.length) return brushExtentToMax;
  //   brushExtentToMax = _;
  //   return chart;
  // };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE BAR CHART INSTANCE*/
d3.barChartLocation = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = null,
      y = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      yData = null,
      barHeight = 7,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      // brushExtent = null,
      select = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      if (select) {
        var selection = select;
        select = null;
        _listeners.filtered(selection);
      }
      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.key; });
        rects.exit().remove();
        rects.enter().append("rect")
          .on("click", clickHandler)
          .on("mouseover", function(d) {
            d3.select(this)
              .attr("height", barHeight + 2)
              .attr("y", function(d) {
                return y(d.name) - barHeight/2 - 1 });

            d3.select(this).classed("hovered", true);
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .attr("height", barHeight)
              .attr("y", function(d) {
                return y(d.name) - barHeight/2 })


            d3.select(this).classed("hovered", false);
          })

        rects
            .classed("not-selected", function(d) {
              return (selected.indexOf(d.key) === -1) ? true : false;
            })
            // .transition()
            .attr("x", function(d) { return 0; })
            .attr("y", function(d) {
              return y(d.name) - barHeight/2  })
            .attr("width", function(d) {
              return x(d.value.householdCount); })
            .attr("height", function(d) { return barHeight; });
      }

      function _skeleton() {
        // set scales range
        x.range([0 , _gWidth]);
        // y.range([0, _gHeight]);
        y.rangeRoundPoints([0, _gHeight], 0, 0.5);

        // set brush
        if (hasBrush) brush.y(y);

        xAxis
          .innerTickSize(-_gHeight - 10)
          .tickPadding(15);

        // set axis
        xAxis.scale(x);
        yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        // required to shift the ticks up
        _gXAxis.selectAll("line").attr("y1", -10);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);


        g.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "start")
          .attr("x", -15)
          .attr("y", -30)
          .text(title);
      }

      function clickHandler(d) {
        if (selected.length > 1) {
          _listeners.filtered([d.key]);
        } else {
          if (selected[0] == d.key) {
            _listeners.filtered(null);
          } else {
            _listeners.filtered([d.key]);
          }
        }
      }

      function _getDataBrushed(brush) {
        var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
        return data
          .map(function(d) { return d.key; })
          .filter(function(d) {
            return d >= extent[0] && d <= extent[1];
          });
      }
    });
  }

  // Getters and Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margins = function(_) {
    if (!arguments.length) return margins;
    margins = _;
    return chart;
  };
  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };
  chart.xData = function(_) {
    if (!arguments.length) return xData;
    xData = _;
    return chart;
  };
  chart.yData = function(_) {
    if (!arguments.length) return yData;
    yData = _;
    return chart;
  };
  chart.elasticY = function(_) {
    if (!arguments.length) return elasticY;
    elasticY = _;
    return chart;
  };
  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };
  chart.hasYAxis = function(_) {
    if (!arguments.length) return hasYAxis;
    hasYAxis = _;
    return chart;
  };
  // chart.brushClickReset = function(_) {
  //   if (!arguments.length) return brushClickReset;
  //   brushClickReset = _;
  //   return chart;
  // };
  // chart.clearBrush = function(_) {
  //   if (!arguments.length) {
  //     _gBrush.call(brush.clear());
  //     brush.event(_gBrush);
  //   }
  //   return chart;
  // };
  // chart.roundXDomain = function(_) {
  //   if (!arguments.length) return roundXDomain;
  //   roundXDomain = _;
  //   return chart;
  // };
  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
    return chart;
  };
  // chart.hasBrushLabel = function(_) {
  //   if (!arguments.length) return hasBrushLabel;
  //   hasBrushLabel = _;
  //   return chart;
  // };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.select = function(_) {
    if (!arguments.length) return select;
    select = _;
    return chart;
  };
  chart.selected = function(_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  // chart.brushExtentToMax = function(_) {
  //   if (!arguments.length) return brushExtentToMax;
  //   brushExtentToMax = _;
  //   return chart;
  // };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE BAR CHART STACKEDINSTANCE*/
d3.barChartStackedHouseholds = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      y = d3.scale.linear(),
      color,
      elasticY = false,
      xData = null,
      xDomain = null,
      barHeight = 7,
      barWidth = 11,
      yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      select = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _gLabel,
      _gLegend,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      data = _transformData(data);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      if (select) {
        var selection = select;
        select = null;
        _listeners.filtered(selection);
      }

      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.key; });
        rects.exit().remove();
        rects.enter().append("rect")
          .on("click", clickHandler)
          .on("mouseover", function(d) {
            d3.select(this)
              .attr("width", barWidth + 1)
              .attr("x", -0.5);
            d3.select(this).classed("hovered", true);
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .attr("width", barWidth)
              .attr("x", 0);
            d3.select(this).classed("hovered", false);
          });


        rects
            .classed("not-selected", function(d) {
              return (selected.indexOf(d.key) === -1) ? true : false;
            })
            .attr("x", function(d) { return 0; })
            .attr("width", function(d) {
              return barWidth; })
            .transition(50)
            .attr("y", function(d) {
              return y(d.y1); })
            .attr("height", function(d) {
              return y(d.y0) - y(d.y1); })
            .style("fill", function(d) { return color(d.name); });

        _gLabel
          .transition(50)
          .attr("transform", "translate(" + 0 + "," + y(data[0].y1) + ")");
        _gLabel.select("text").text(data[0].y1 + "%");
      }

      function _transformData(data) {
        var y0 = y1 = 0;

        data.sort(function(a, b) { return b.key - a.key; });

        data.forEach(function(d) {
          y0 = y1;
          d.y0 = y0;
          d.y1 = y1 += d.value.householdCount;
        })

        data.forEach(function(d) {
          d.y0 = Math.round((d.y0 / data[data.length-1].y1) * 100);
          d.y1 = Math.round((d.y1 / data[data.length-1].y1) * 100);
        })

        return data;
      }

      function _skeleton() {
        // set scales range
        y.rangeRound([_gHeight, 0]);
        y.domain([0, 100]);

        yAxis.tickValues([50, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // label showing intermediate percentage
        _gLabel = g.append("g").attr("class", "label");
        _gLabel.append("line")
          .attr("x1", barWidth).attr("y1", 0)
          .attr("x2", barWidth + 8).attr("y2", 0)
        _gLabel.append("text")
          .attr("x", barWidth + 12).attr("y", 0)
          .attr("dy", +3);

        // legend
        _gLegend = g.append("g").attr("class", "legends");

        var legend = _gLegend.selectAll(".legend")
            .data(color.domain().slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            // .attr("x", width - 18)
            .attr("x", -60)
            .attr("y", 25)
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", color);

        legend.append("text")
            .attr("x", -42)
            .attr("y", 32)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { return d; });

        g.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "start")
          .attr("x", -60)
          .attr("y", -25)
          .text(title);
      }

      function clickHandler(d) {
        if (selected.length > 1) {
          _listeners.filtered([d.key]);
        } else {
          if (selected[0] == d.key) {
            _listeners.filtered(null);
          } else {
            _listeners.filtered([d.key]);
          }
        }
      }

      function _getDataBrushed(brush) {
        var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
        return data
          .map(function(d) { return d.key; })
          .filter(function(d) {
            return d >= extent[0] && d <= extent[1];
          });
      }
    });
  }

  // Getters and Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margins = function(_) {
    if (!arguments.length) return margins;
    margins = _;
    return chart;
  };
  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };
  chart.xData = function(_) {
    if (!arguments.length) return xData;
    xData = _;
    return chart;
  };
  chart.yData = function(_) {
    if (!arguments.length) return yData;
    yData = _;
    return chart;
  };
  chart.elasticY = function(_) {
    if (!arguments.length) return elasticY;
    elasticY = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };

  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
    return chart;
  };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.selected = function(_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };
  chart.select = function(_) {
    if (!arguments.length) return select;
    select = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE BAR CHART STACKEDINSTANCE*/
d3.barChartStackedChildren = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      y = d3.scale.linear(),
      color,
      elasticY = false,
      xData = null,
      xDomain = null,
      barHeight = 7,
      barWidth = 11,
      yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      select = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _gLabel,
      _gLegend,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      data = _transformData(data);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      if (select) {
        var selection = select;
        select = null;
        _listeners.filtered(selection);
      }

      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.key; });
        rects.exit().remove();
        rects.enter().append("rect")
          .on("click", clickHandler)
          .on("mouseover", function(d) {
            d3.select(this)
              .attr("width", barWidth + 1)
              .attr("x", -0.5);
            d3.select(this).classed("hovered", true);
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .attr("width", barWidth)
              .attr("x", 0);
            d3.select(this).classed("hovered", false);
          });


        rects
            .classed("not-selected", function(d) {
              return (selected.indexOf(d.key) === -1) ? true : false;
            })
            .attr("x", function(d) { return 0; })
            .attr("width", function(d) {
              return barWidth; })
            .transition(50)
            .attr("y", function(d) {
              return y(d.y1); })
            .attr("height", function(d) {
              return y(d.y0) - y(d.y1); })
            .style("fill", function(d) { return color(d.name); });

        _gLabel
          .transition(50)
          .attr("transform", "translate(" + 0 + "," + y(data[0].y1) + ")");
        _gLabel.select("text").text(data[0].y1 + "%");
      }

      function _transformData(data) {
        var y0 = y1 = 0;

        data.sort(function(a, b) { return b.key - a.key; });

        data.forEach(function(d) {
          y0 = y1;
          d.y0 = y0;
          d.y1 = y1 += d.value;
        })

        data.forEach(function(d) {
          d.y0 = Math.round((d.y0 / data[data.length-1].y1) * 100);
          d.y1 = Math.round((d.y1 / data[data.length-1].y1) * 100);
        })

        return data;
      }

      function _skeleton() {
        // set scales range
        y.rangeRound([_gHeight, 0]);
        y.domain([0, 100]);

        yAxis.tickValues([50, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // label showing intermediate percentage
        _gLabel = g.append("g").attr("class", "label");
        _gLabel.append("line")
          .attr("x1", barWidth).attr("y1", 0)
          .attr("x2", barWidth + 8).attr("y2", 0)
        _gLabel.append("text")
          .attr("x", barWidth + 12).attr("y", 0)
          .attr("dy", +3);

        // legend
        _gLegend = g.append("g").attr("class", "legends");

        var legend = _gLegend.selectAll(".legend")
            .data(color.domain().slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            // .attr("x", width - 18)
            .attr("x", -60)
            .attr("y", 25)
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", color);

        legend.append("text")
            .attr("x", -42)
            .attr("y", 32)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { return d; });

        g.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "start")
          .attr("x", -60)
          .attr("y", -25)
          .text(title);
      }

      function clickHandler(d) {
        if (selected.length > 1) {
          _listeners.filtered([d.key]);
        } else {
          if (selected[0] == d.key) {
            _listeners.filtered(null);
          } else {
            _listeners.filtered([d.key]);
          }
        }
      }

      function _getDataBrushed(brush) {
        var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
        return data
          .map(function(d) { return d.key; })
          .filter(function(d) {
            return d >= extent[0] && d <= extent[1];
          });
      }
    });
  }

  // Getters and Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margins = function(_) {
    if (!arguments.length) return margins;
    margins = _;
    return chart;
  };
  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };
  chart.xData = function(_) {
    if (!arguments.length) return xData;
    xData = _;
    return chart;
  };
  chart.yData = function(_) {
    if (!arguments.length) return yData;
    yData = _;
    return chart;
  };
  chart.elasticY = function(_) {
    if (!arguments.length) return elasticY;
    elasticY = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };

  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
    return chart;
  };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.selected = function(_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };
  chart.select = function(_) {
    if (!arguments.length) return select;
    select = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE TIME LINE NAVIGATION INSTANCE*/
d3.timeLineNavigation = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = null,
      y = null,
      elapsed = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      yData = null,
      barHeight = 7,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      // if (brushExtent) {
      //   brush.extent([brushExtent[0] - 0.5, brushExtent[1] - 0.5]);
      //   _gBrush.call(brush);
      //   brushExtent = null;
      //   _listeners.filtering(_getDataBrushed(brush));
      // }
      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN
        var circles =  _gCircles.selectAll("circle")
          .data(data);
        circles.exit().remove();
        circles.enter().append("circle");
        circles
            .classed("elapsed", function(d) {
              var page = elapsed.page,
                  chapter = elapsed.chapter;
              // debugger;
              return (+(d.page + d.chapter) <= (10 * page + chapter)) ?
                true : false;
            })
            // .transition()
            .attr("cx", function(d) {
              return x(d.time); })
            .attr("cy", 0)
            .attr("r", function(d) { return (d.isMain) ? 6:3; });
      }

      function _skeleton() {
        // set scales range
        x.range([0 , _gWidth]);
        // y.range([0, _gHeight]);

        // set brush
        // if (hasBrush) brush.y(y);

        // xAxis
        //   .innerTickSize(-_gHeight)
        //   .tickPadding(5);

        // set axis
        // xAxis.scale(x);
        // yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gCircles = g.append("g")
            .attr("class", "circles");

        // set x Axis
        // _gXAxis = g.append("g")
        //     .attr("class", "x axis")
        //     .call(xAxis);
        //
        // _gYAxis = g.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis);

        // g.append("text")
        //   .attr("class", "x label")
        //   .attr("text-anchor", "start")
        //   .attr("x", -15)
        //   .attr("y", -25)
        //   .text(title);

        // _gBrush = g.append("g").attr("class", "brush").call(brush);
        // _gBrush.selectAll("rect").attr("width", _gWidth);
        //
        // brush.on("brush", function() {
        //   _listeners.filtering(_getDataBrushed(brush));
        // });
        //
        // brush.on("brushend", function() {
        //   _listeners.filtered(brush);
        // });
      }

      // function _getDataBrushed(brush) {
      //   var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
      //   return data
      //     .map(function(d) { return d.key; })
      //     .filter(function(d) {
      //       return d >= extent[0] && d <= extent[1];
      //     });
      // }
    });
  }

  // Getters and Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margins = function(_) {
    if (!arguments.length) return margins;
    margins = _;
    return chart;
  };
  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };
  chart.xData = function(_) {
    if (!arguments.length) return xData;
    xData = _;
    return chart;
  };
  chart.yData = function(_) {
    if (!arguments.length) return yData;
    yData = _;
    return chart;
  };
  chart.elasticY = function(_) {
    if (!arguments.length) return elasticY;
    elasticY = _;
    return chart;
  };
  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };
  chart.hasYAxis = function(_) {
    if (!arguments.length) return hasYAxis;
    hasYAxis = _;
    return chart;
  };
  // chart.brushClickReset = function(_) {
  //   if (!arguments.length) return brushClickReset;
  //   brushClickReset = _;
  //   return chart;
  // };
  // chart.clearBrush = function(_) {
  //   if (!arguments.length) {
  //     _gBrush.call(brush.clear());
  //     brush.event(_gBrush);
  //   }
  //   return chart;
  // };
  // chart.roundXDomain = function(_) {
  //   if (!arguments.length) return roundXDomain;
  //   roundXDomain = _;
  //   return chart;
  // };
  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
    return chart;
  };
  // chart.hasBrushLabel = function(_) {
  //   if (!arguments.length) return hasBrushLabel;
  //   hasBrushLabel = _;
  //   return chart;
  // };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.elapsed = function(_) {
    if (!arguments.length) return elapsed;
    elapsed = _;
    return chart;
  };
  chart.selected = function(_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  // chart.brushExtentToMax = function(_) {
  //   if (!arguments.length) return brushExtentToMax;
  //   brushExtentToMax = _;
  //   return chart;
  // };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
// Underscore Templates
Vis.Templates["main-text"] =[
  "<p>This is my first variant of main text</p>", // 0
  "<p>This is my second variant of main text</p>", // 1
  "<p>This is my third variant of main text</p>", // 2
];

Vis.Templates["sub-text"] =[
  "<p>This is my first variant of sub text</p>", // 0
  "<p>This is my second variant of sub text</p>", // 1
  "<p>This is my third variant of sub text</p>", // 2
];
