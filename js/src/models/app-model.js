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

  // create crossfilters + associated dimensions and groups
  bundle: function(data) {
    var that = this;

    // lookup tables
    var housholdsLookUp = that.createLookup(data.households, "hh");

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
