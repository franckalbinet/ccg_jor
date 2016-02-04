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
