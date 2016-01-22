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
