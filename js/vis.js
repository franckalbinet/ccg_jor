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
  FAKED_DATASET: false,
  DATASETS: {
    CHILDREN: "children.json",
    HOUSEHOLDS: "households.json",
    OUTCOMES: "outcomes.json"
  }
});
// Application router
Vis.Routers.App = Backbone.Router.extend({
  loaded: false,
  routes: {
    "page/:page/chapter/:chapter": "refresh"
  },

  refresh: function (page, chapter) {
    var page = page || 1,
        chapter = chapter || 1;

    if(!this.loaded) {
      $(".container").hide();
      window.setTimeout(this.load, 1000);
    }
    Backbone.trigger("scenario:updating", {page: +page, chapter: +chapter});
  },

  load: function() {
    Backbone.trigger("data:loading");
    this.loaded = true;
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
    // navigation
    scenario: null,

    // data
    ready: false,

    // filters
    children: null, // [1,2,3,4,5,6,7,8,9]
    ages: null,
    genders: null,
    educations: null,
    works: null,
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
    // propagate selected houseolds to outcomes
    // console.log(this.children.size());
    this.outcomesHead.filter( this.filterExactList(this.getHouseholds()));
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

  filterByChildren: function(args) {
    var that = this;
    this.set("children", args || this.getHouseholdsByChildren().map(
      function(d) { return d.key; }));

    var households = [];

    this.getHouseholdsByChildren().forEach(function(d) {
      if (that.get("children").indexOf(d.key) > -1) {
        households = households.concat(d.values.hh)
      }
    });

    this.childrenHousehold.filter(this.filterExactList(households) );
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

  getHouseholdsByChildren: function() {
    var that = this;
    return d3.nest()
      .key(function(d) { return d.value; })
      .rollup(function(leaves) {
        return {
          length: leaves.length,
          hh: leaves.map(function(d) { return d.key; })
         };
      })
      .entries(this.childrenByHousehold.top(Infinity));
  },

  // create crossfilters + associated dimensions and groups
  bundle: function(data) {
    var that = this;

    // lookup tables
    var housholdsLookUp = that.createLookup(data.households, "hh");

    // PROFILES
    var childrenCf = crossfilter(data.children);
    // dimensions
    this.childrenAge = childrenCf.dimension(function(d) { return d.age; });
    this.childrenGender = childrenCf.dimension(function(d) { return d.gender; });
    this.childrenHousehold = childrenCf.dimension(function(d) { return d.hh; });
    this.childrenEducation = childrenCf.dimension(function(d) { return d.edu_rec; });
    this.childrenWork = childrenCf.dimension(function(d) { return d.work; });

    this.householdsHead = childrenCf.dimension(function(d) {
      return housholdsLookUp[d.hh].head;
    });
    this.householdsPoverty = childrenCf.dimension(function(d) {
       return housholdsLookUp[d.hh].pov_line;
     });
    this.householdsDisability = childrenCf.dimension(function(d) {
       return housholdsLookUp[d.hh].has_dis;
    });
    // groups
    this.childrenByAge = this.childrenAge.group();
    this.childrenByGender = this.childrenGender.group();
    this.childrenByHousehold = this.childrenHousehold.group();
    this.childrenByEducation = this.childrenEducation.group();
    this.childrenByWork = this.childrenWork.group();
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
    this.set("children", this.getHouseholdsByChildren().map(
      function(d) { return d.key; })
    );
    this.set("genders", this.getKeys(this.childrenByGender));
    this.set("educations", this.getKeys(this.childrenByEducation));
    this.set("works", this.getKeys(this.childrenByWork));
    this.set("heads", this.getKeys(this.householdsByHead));
    this.set("poverties", this.getKeys(this.householdsByPoverty));
    this.set("disabilities", this.getKeys(this.householdsByDisability));

    // OUTCOMES
    var outcomes = crossfilter(data.outcomes);
    // dimensions
    this.outcomesHead = outcomes.dimension(function(d) { return d.hh; });

    this.set("ready", true);
    $(".container").show();
    $(".spinner").hide();
    $(".loading").hide();
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

    // var opts = {
    //   lines: 13 // The number of lines to draw
    //   , length: 28 // The length of each line
    //   , width: 14 // The line thickness
    //   , radius: 42 // The radius of the inner circle
    //   , scale: 1 // Scales overall size of the spinner
    //   , corners: 1 // Corner roundness (0..1)
    //   , color: '#000' // #rgb or #rrggbb or array of colors
    //   , opacity: 0.25 // Opacity of the lines
    //   , rotate: 0 // The rotation offset
    //   , direction: 1 // 1: clockwise, -1: counterclockwise
    //   , speed: 1 // Rounds per second
    //   , trail: 60 // Afterglow percentage
    //   , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
    //   , zIndex: 2e9 // The z-index (defaults to 2000000000)
    //   , className: 'spinner' // The CSS class to assign to the spinner
    //   , top: '50%' // Top position relative to parent
    //   , left: '50%' // Left position relative to parent
    //   , shadow: false // Whether to render a shadow
    //   , hwaccel: false // Whether to use hardware acceleration
    //   , position: 'absolute' // Element positioning
    // }
    // var target = $("body");
    // var spinner = new Spinner(opts).spin(target);
    // var spinner = new Spinner().spin(target);




    // VIEWS INSTANCIATION
    // profile
    new Vis.Views.Scenarios({model: Vis.Models.app});
    // new Vis.Views.ChildrenAge({model: Vis.Models.app});
    // new Vis.Views.ChildrenGender({model: Vis.Models.app});
    // new Vis.Views.HouseholdsHead({model: Vis.Models.app});
    // new Vis.Views.HouseholdsPoverty({model: Vis.Models.app});

    // new Vis.Views.HouseholdsChildren({model: Vis.Models.app});
    //
    // new Vis.Views.BarChartHorizontal({
    //   el: "#children-by-age",
    //   model: Vis.Models.app,
    //   grp: "childrenByAge",
    //   attr: "ages",
    //   filter: "filterByAge",
    //   accessor: function(d) { return { key: d.key, value: d.value}; },
    //   xTitle: "Age",
    //   yTitle: "Nb. Children"
    // });
    //
    // new Vis.Views.BarChartVertical({
    //   el: "#children-by-gender",
    //   model: Vis.Models.app,
    //   grp: "childrenByGender",
    //   attr: "genders",
    //   filter: "filterByGender",
    //   accessor: function(d) { return { key: d.key, value: d.value}; },
    //   xTitle: "Nb. Children",
    //   yTitle: "Gender"
    // });
    //
    // new Vis.Views.BarChartVertical({
    //   el: "#households-by-head",
    //   model: Vis.Models.app,
    //   grp: "householdsByHead",
    //   attr: "heads",
    //   filter: "filterByHead",
    //   accessor: function(d) {
    //     return { key: d.key, value: d.value.householdCount}; },
    //   yTitle: "Head",
    //   xTitle: "Nb. households",
    // });
    //
    // new Vis.Views.BarChartVertical({
    //   el: "#households-by-poverty",
    //   model: Vis.Models.app,
    //   grp: "householdsByPoverty",
    //   attr: "poverties",
    //   filter: "filterByPoverty",
    //   accessor: function(d) {
    //     return  { key: d.key, value: d.value.householdCount}; },
    //   yTitle: "Poverty line",
    //   xTitle: "Nb. households",
    // });
    //
    // new Vis.Views.BarChartVertical({
    //   el: "#households-by-disability",
    //   model: Vis.Models.app,
    //   grp: "householdsByDisability",
    //   attr: "disabilities",
    //   filter: "filterByDisability",
    //   accessor: function(d) {
    //     return { key: d.key, value: d.value.householdCount}; },
    //   yTitle: "Disability",
    //   xTitle: "Nb. households",
    // });
    //
    // new Vis.Views.BarChartVertical({
    //   el: "#children-by-education",
    //   model: Vis.Models.app,
    //   grp: "childrenByEducation",
    //   attr: "educations",
    //   filter: "filterByEducation",
    //   accessor: function(d) { return { key: d.key, value: d.value}; },
    //   yTitle: "Rec. Education",
    //   xTitle: "Nb. Children"
    // });
    //
    // new Vis.Views.BarChartVertical({
    //   el: "#children-by-work",
    //   model: Vis.Models.app,
    //   grp: "childrenByWork",
    //   attr: "works",
    //   filter: "filterByWork",
    //   accessor: function(d) { return { key: d.key, value: d.value}; },
    //   yTitle: "Work",
    //   xTitle: "Nb. Children"
    // });

    // outcomes
    // new Vis.Views.LifeImprovement({model: Vis.Models.app});
    // new Vis.Views.CoveringNeeds({model: Vis.Models.app});

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
      this.model.on("change:ready change:scenario", function() {
        // ensure that data is ready and scenario available
        if (this.model.get("ready") && this.model.get("scenario")) this.render();
        },this);
    },

    render: function() {
      console.log(this.model.get("scenario"));

      // default scenario (nothing filtered);
      this.model.filterByAge(null);
      // this.model.filterByHousehold(null);
      this.model.filterByChildren(null);

      this.model.filterByGender(null);
      this.model.filterByHead(null);
      this.model.filterByPoverty(null);
      this.model.filterByDisability(null);
      this.model.filterByEducation(null);
      this.model.filterByWork(null);
    }
  });
// Template Horizontal BarChart view
Vis.Views.BarChartHorizontal = Backbone.View.extend({
    events: {
    },

    initialize: function (options) {
      _.extend(this, _.pick(options, "grp", "attr", "filter", "accessor",
        "yTitle", "xTitle"));

      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model[this.grp].top(Infinity)
            .map(this.accessor);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#" + this.el.id + " .chart", 480, 150);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(45, 10, 400, 90);
        var x = this.myChart.addCategoryAxis("x", "key");
        x.title = this.xTitle;
        var y = this.myChart.addMeasureAxis("y", "value");
        y.title = this.yTitle;
        y.ticks = 4;
        x.hidden = false;
        y.showGridlines = false;
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.update(e);});
      } else {
        this.myChart.data = data;
      }
      this.setAesthetics();
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      var that = this;
      d3.selectAll("#" + this.el.id + " .chart rect").classed("selected", false);
      this.model.get(this.attr).forEach(function(d) {
        d3.select("#" + that.el.id + " .chart rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })
    },

    update: function(e) {
      var filter = this.model.get(this.attr),
          selected = e.xValue;

      if (filter.indexOf(selected) === -1) { filter.push(selected); }
      else { filter = _.without(filter, selected);}
      this.model[this.filter](filter);
    },
});
// Template Vertical BarChart view
Vis.Views.BarChartVertical = Backbone.View.extend({
    events: {
    },

    initialize: function (options) {
      _.extend(this, _.pick(options, "grp", "attr", "filter", "accessor",
        "yTitle", "xTitle"));

      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model[this.grp].top(Infinity)
            .map(this.accessor);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#" + this.el.id + " .chart", 480, 120);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(40, 20, 400, 60);
        var x = this.myChart.addMeasureAxis("x", "value");
        x.title = this.xTitle;
        var y = this.myChart.addCategoryAxis("y", "key");
        y.title = this.yTitle;
        x.showGridlines = false;
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.update(e);});
      } else {
        this.myChart.data = data;
      }
      this.setAesthetics();
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      var that = this;
      d3.selectAll("#" + this.el.id + " .chart rect").classed("selected", false);
      this.model.get(this.attr).forEach(function(d) {
        d3.select("#" + that.el.id + " .chart rect#dimple-all--" + d + "--")
          .classed("selected", true);
      })
    },

    update: function(e) {
      var filter = this.model.get(this.attr),
          selected = e.yValue;

      if (filter.indexOf(selected) === -1) { filter.push(selected); }
      else { filter = _.without(filter, selected);}
      this.model[this.filter](filter);
    },
});
// Nb. households by nb. of children
Vis.Views.HouseholdsChildren = Backbone.View.extend({
    el: '#households-by-children',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.getHouseholdsByChildren()
          .map(function(d) {
            return { key: d.key, value: d.values.length};
          })
          .filter(function(d) {
            return d.key !== "0";
          });

      if (this.myChart) d3.select("#households-by-children svg").remove();

      // if (!this.myChart) {
        this.svg = dimple.newSvg("#" + this.el.id + " .chart", 480, 150);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(50, 10, 400, 90);
        var x = this.myChart.addCategoryAxis("x", "key");
        x.title = "Children by household";
        var y = this.myChart.addMeasureAxis("y", "value");
        y.ticks = 4;
        y.title = "Nb. of households";
        x.hidden = false;
        y.showGridlines = false;
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.update(e);});
      // } else {
        // this.myChart.data = data;
        // this.myChart.axes = [];
        // d3.selectAll("#households-by-children .dimple-axis").remove()
        // var x = this.myChart.addCategoryAxis("x", "key");
        // x.title = "Children by household";
        // var y = this.myChart.addMeasureAxis("y", "value");
        // y.ticks = 4;
        // y.title = "Nb. of households";
        // x.hidden = false;
        // y.showGridlines = false;

      // }
      this.myChart.draw(500);
      this.setAesthetics();
    },

    setAesthetics: function() {
      var that = this;
      d3.selectAll("#" + this.el.id + " .chart rect").classed("selected", false);
      this.model.get("children").forEach(function(d) {
        d3.select("#" + that.el.id + " .chart rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })
    },

    update: function(e) {
        var filter = this.model.get("children"),
            selected = e.xValue;

        // filter = this.model.getHouseholdsByChildren()[clicked].values.hh

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByChildren(filter);
    },
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
        this.svg = dimple.newSvg("#chart-life-improvement", 480, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(30, 20, 400, 120);
        this.myChart.addPctAxis("x", "hh");
        this.myChart.addCategoryAxis("y", "round");
        this.mySeries = this.myChart.addSeries("imp", dimple.plot.bar);
        // myChart.addLegend(60, 10, 510, 20, "right");
        this.mySeries.addEventHandler("click", function (e) {
          that.updateSelection(e);
        });
      } else {
        this.myChart.data = data;
      }
      // this.setAesthetics();
      this.myChart.draw(500);
    },

    // setAesthetics: function() {
    //   d3.selectAll("#chart-households-by-head rect").classed("selected", false);
    //   this.model.get("heads").forEach(function(d) {
    //     d3.select("#households-by-head #chart-households-by-head rect#dimple-all--" + d + "--")
    //       .classed("selected", true);
    //   })
    //
    // },
    //
    updateSelection: function(e) {
      var pattern = /\d+/g,
          id = e.selectedShape.attr("id"),
          match = id.match(pattern),
          round = +match[1],
          imp = +match[0];

      // console.log("round: " + round);
      // console.log("imp: " + imp);
      //
      // debugger;

      // console.log("xValue: " + e.xValue);
      // console.log("yValue: " + e.yValue);
      // console.log("zValue: " + e.zValue);
      // console.log("colorValue: " + e.colorValue);
      // console.log("shape id: " + e.selectedShape.attr("id"));

      var households = this.model.outcomesHead.top(Infinity)
        .filter(function(d) { return (d.imp === imp && d.round === round); })
        .map(function(d) { return d.hh; });

        // var filter = this.model.get("heads"),
        //     selected = e.yValue;
        //
        // if (filter.indexOf(selected) === -1) { filter.push(selected); }
        // else { filter = _.without(filter, selected);}
        // this.model.filterByHead(filter);
    }
});
// Covering Basic Needs View
Vis.Views.CoveringNeeds = Backbone.View.extend({
    el: '#covering-needs',

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
        this.svg = dimple.newSvg("#chart-covering-needs", 480, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(30, 20, 400, 120);
        this.myChart.addPctAxis("x", "hh");
        this.myChart.addCategoryAxis("y", "round");
        this.mySeries = this.myChart.addSeries("needs", dimple.plot.bar);
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

    // setAesthetics: function() {
    //   d3.selectAll("#chart-households-by-head rect").classed("selected", false);
    //   this.model.get("heads").forEach(function(d) {
    //     d3.select("#households-by-head #chart-households-by-head rect#dimple-all--" + d + "--")
    //       .classed("selected", true);
    //   })
    //
    // },
    //
    // updateSelection: function(e) {
    //     var filter = this.model.get("heads"),
    //         selected = e.yValue;
    //
    //     if (filter.indexOf(selected) === -1) { filter.push(selected); }
    //     else { filter = _.without(filter, selected);}
    //     this.model.filterByHead(filter);
    // }
});
