// Application model: save app. states
Vis.Models.App = Backbone.Model.extend({
  defaults: {
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

  // dimension filters proxy
  filterByAge: function(args) {
    this.unsync();
    this.childrenAge.filter(args);
    Backbone.trigger("filtering", "childrenAge");
  },

  filterByGender: function(args) {
    this.unsync();
    var filter = (args !== null) ? this.filterExactList(args) : null;
    this.childrenGender.filter(filter);
    Backbone.trigger("filtering", "childrenGender");
  },

  filterByHead: function(args) {
    this.unsync();
    var filter = (args !== null) ? this.filterExactList(args) : null;
    this.householdHead.filter(filter);
    Backbone.trigger("filtering", "householdsHead");
  },

  // allows filtering crossfilter dimensions by list of values
  filterExactList: function(array) {
    return function(d) { return array.indexOf(d) > -1; }
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

    // init all views
    Backbone.trigger("filtered", null);

    // debugger;
    // dataset "incomes"
    // this.sourcesIncome = crossfilter(data.sourcesIncome);

    // dataset "expenditures"
    // this.expenditures = crossfilter(data.expenditures);

    // dataset "coping" (coping mechanisms)
    // this.coping = crossfilter(data.coping);
  }
})
