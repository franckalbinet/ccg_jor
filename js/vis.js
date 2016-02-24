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
    EXPENDITURES: "expenditures.json",
    CURRENT_COPING_MECHANISMS: "current_coping_mechanisms.json",
    STOPPED_COPING_MECHANISMS: "stopped_coping_mechanisms.json",
    EDUCATION: "education.json",
    ECO_CONTRIBUTORS: "eco_contributors.json",
    EXPENDITURES_CHILDREN: "expenditures_children.json",
    MILESTONES: "milestones.json"
  },
  LOOKUP_CODES: {
    GOVERNORATES: {1:"Irbid", 2:"Ajloun", 3:"Jarash", 4:"Amman", 5:"Zarqa", 6:"Madaba", 11:"Mafraq", 99:"Others"},
    POVERTY: {1:"High", 2:"Severe", 3:"Resilient"},
    HEAD: {1:"Father", 2:"Mother"},
    GENDER: {1:"Male", 2:"Female"},
    INCOME: {1:"Cash Assistance (UNICEF and UNHCR)", 2:"Food Voucher (WFP)", 5:"Paid labour", 99:"Other"},
    ECO_CONTRIBUTORS: {1:"Father",2:"Mother",3:"Other adult",4:"Child over 16",5:"Child under 16",6:"None"},
    EXPENDITURES: {1:"Rent", 2:"Utilities", 3:"Communications", 4:"Food", 5:"Education", 6:"Health care services [adults]",
                   7:"Medicine [adults]", 8:"Health care services [children]", 9:"Medicine [children]", 10:"Transportation",
                  11:"Debt payoff", 12:"Savings", 13:"Other children expenditures", 97:"Other"},
    EXPENDITURES_CHILDREN: {2:"Transportation to school", 3:"School-related expenses", 4:"Transport to healthcare facilities",
                            5:"Doctors fees for children",6:"Children’s medicine",7:"Infant/children’s milk and food",
                            9:"Fresh foods",10:"Children’s clothes and shoes",11:"Diapers/sanitation products",
                            12:"Recreation and toys",13:"Infant needs (e.g. pram)",99:"No spending on these items"},
    COV_CHILD_EXP: {1:"Yes", 2:"No"},
    EXPENDITURES_CHILD_MOST: {1:"Education", 2:"Health", 3:"Food", 99:"Other"},
    LIVING_CONDITIONS: {1:"Yes", 2:"No, not at all"},
    BASIC_NEEDS: {1:"Significantly", 2:"Moderatly", 3:"Slightly", 4: "Not at all"},
    COPING_MECHANISMS: {1:"Reduce accomodation costs by any means",2:"Reducing food intake [portion size or nb. of meals]",
                        3:"Choosing less preferred but cheaper food options",4:"Receiving cash assistance from family members",
                        5:"Receiving humanitarian assistance from NGOs/CBOs",6:"Selling properties/assets",7:"Selling food voucher",8:"Working more than one job",
                        9:"Borrowing money",10:"Using your savings",11:"Asking for money ",12:"Dropping children out of school",13:"Let your children work [child labor]",
                        14: "Let your children ask for money",15:"Reduction of essential expenditure on health",16:"Reduction of essential expenditure on education",
                        17:"Immigrate to another country for residency",18:"Move back to the refugee camp",19:"Return to Syria",97:"Other"}
  }
});
/*  Utilities functions*/
Vis.utils = _.extend(Vis.DEFAULTS, {

  clearCharts: function() {
    if (this.chart) this.chart = null;
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    d3.select("#main-chart #living-conditions").remove();
    d3.select("#main-chart #background-sample").remove();
    d3.select("#main-chart #coping-mechanisms").remove();
    // d3.select("#main-chart .heatmap").remove();
    $(".outcomes").removeClass("col-md-12").addClass("col-md-8");
  }

  // Timer: function(callback, delay) {
  //     var timerId, start, remaining = delay;
  //
  //     this.pause = function() {
  //         window.clearTimeout(timerId);
  //         remaining -= new Date() - start;
  //     };
  //
  //     this.resume = function() {
  //         start = new Date();
  //         window.clearTimeout(timerId);
  //         timerId = window.setTimeout(callback, remaining);
  //     };
  //
  //     this.clear = function() {
  //       window.clearTimeout(timerId);
  //     };
  //
  //     this.resume();
  // }
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
        that.url + Vis.DEFAULTS.DATASETS.MILESTONES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.INCOMES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.EXPENDITURES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.CURRENT_COPING_MECHANISMS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.STOPPED_COPING_MECHANISMS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.EDUCATION)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.ECO_CONTRIBUTORS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.EXPENDITURES_CHILDREN)
      .await(_ready);

    // on success
    function _ready(error, children, households, outcomes, milestones, incomes, expenditures, currentCoping, stoppedCoping, education, ecoContributors, expendituresChild) {
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
        incomes: incomes,
        expenditures: expenditures,
        currentCoping: currentCoping,
        stoppedCoping: stoppedCoping,
        education: education,
        ecoContributors: ecoContributors,
        expendituresChild: expendituresChild,
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
    this.incomesHousehold.filter( this.filterExactList(this.getHouseholds()));
    this.expendituresHousehold.filter( this.filterExactList(this.getHouseholds()));
    this.expendituresChildHousehold.filter( this.filterExactList(this.getHouseholds()));
    this.outcomesHousehold.filter( this.filterExactList(this.getHouseholds()));
    this.currentCopingHousehold.filter( this.filterExactList(this.getHouseholds()));
    this.stoppedCopingHousehold.filter( this.filterExactList(this.getHouseholds()));
    this.ecoContribHousehold.filter( this.filterExactList(this.getHouseholds()));

    if (this.get("scenario").page === 8) { // if children education page
      this.educationGender.filter(this.filterExactList(this.get("genders")));
      this.educationHead.filter(this.filterExactList(this.get("heads")));
      this.educationPoverty.filter(this.filterExactList(this.get("poverties")));
      this.educationLoc.filter(this.filterExactList(this.get("locations")));
    }
    Backbone.trigger("filtered");
  },

  // DIMENSION FILTER PROXIES
  filterByAge: function(args) {
    this.filterBy(args, "ages", this.childrenAge, this.childrenByAge);
  },

  filterByGender: function(args) {
    console.log(args);
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
      // if has 7 which measn 7+ actually -> include 8 and 9 as well
      if (args.indexOf(7) !== -1) args = args.concat([8,9]);
      var filter = this.getHouseholdsFiltered(this.get("children"));
      this.childrenHousehold.filter(this.filterExactList(filter));
    } else {
      this.childrenHousehold.filter(null);
    }
    Backbone.trigger("filtering");
  },

  filterByHead: function(args) {
    console.log(args);
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

  reduceAddType: function() {
    return function(p, v) {
      p.filter(function(d) { return d.round == v.round; })[0].count += 1;
      return p;
    }
  },
  reduceRemoveType: function() {
    return function(p, v) {
      p.filter(function(d) { return d.round == v.round; })[0].count -= 1;
      return p;
    }
  },
  reduceInitType: function() {
    return function() {
      return [{round: 1, count: 0}, {round: 2, count: 0}, {round: 3, count: 0}];
    }
  },

  reduceAddRound: function(category) {
    return function(p, v) {
      p.filter(function(d) { return d.category == v[category]; })[0].count += 1;
      return p;
    }
  },
  reduceRemoveRound: function(category) {
    return function(p, v) {
      p.filter(function(d) { return d.category == v[category]; })[0].count -= 1;
      return p;
    }
  },
  reduceInitRound: function(categories) {
    return function() {
      return categories.map(function(d) { return {category: d, count: 0}; });
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
    return this.cachedChildrenByHoushold
      .filter(function(d) {
        return selection.indexOf(d.values) > -1 })
      .map(function(d) { return +d.key; });

    //   var byNbChildren = d3.nest()
    //         .key(function(d) { return d.age; })
    //         .rollup(function(leaves) {
    //           return {
    //             length: leaves.length,
    //             hh: leaves.map(function(d) { return d.hh; })
    //            };
    //         })
    //       .entries(this.data.children)
    //       .map(function(d) { return {key: +d.key, values: d.values}; });
    //   var households = [];
    //   byNbChildren.forEach(function(d) {
    //     if (selection.indexOf(d.key) > -1) {
    //       households = households.concat(d.values.hh)
    //     }
    //   });
    // return households;
  },

  getTemplateId: function(page, chapter, attr) {
    return this.data.milestones
      .filter(function(d) {
        return +d.page === +page && +d.chapter === +chapter; })[0][attr];
  },

  getMainTextTemplateId: function(page, chapter) {
    return this.data.milestones
      .filter(function(d) {
        return +d.page === +page && +d.chapter === +chapter; })[0]
      .mainText;
  },

  getSubTextTemplateId: function(page, chapter) {
    return this.data.milestones
      .filter(function(d) {
        return +d.page === +page && +d.chapter === +chapter; })[0]
      .subText;
  },

  getQuoteTemplateId: function(page, chapter) {
    return this.data.milestones
      .filter(function(d) {
        return +d.page === +page && +d.chapter === +chapter; })[0]
      .subText;
  },

  getMilestones: function() {
    return this.data.milestones;
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
    // caching nb. of children by households -- for the sake of performance
    this.cachedChildrenByHoushold = d3.nest()
    .key(function(d) { return d.hh; })
    .rollup(function(leaves) {
      return leaves.length
    })
    .entries(this.data.children);

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


    // OUTCOMES
    // incomes
    var incomesCf = crossfilter(data.incomes);
    this.incomesHousehold = incomesCf.dimension(function(d) { return d.hh; });
    this.incomesType = incomesCf.dimension(function(d) { return d.income; });
    this.incomesRound = incomesCf.dimension(function(d) { return d.round; });
    this.incomesByType = this.incomesType.group().reduce(
      this.reduceAddType(), this.reduceRemoveType(), this.reduceInitType()
    );
    var catIncomes = _.unique(data.incomes.map(function(d) { return d.income; }));
    this.incomesByRound = this.incomesRound.group().reduce(
      this.reduceAddRound("income"), this.reduceRemoveRound("income"), this.reduceInitRound(catIncomes)
    );

    // economical contributor
    var ecoContribCf = crossfilter(data.ecoContributors);
    this.ecoContribHousehold = ecoContribCf.dimension(function(d) { return d.hh; });
    this.ecoContribType = ecoContribCf.dimension(function(d) { return d.eco_contrib; });
    this.ecoContribByType = this.ecoContribType.group().reduce(
      this.reduceAddType(), this.reduceRemoveType(), this.reduceInitType()
    );

    // expenditures
    var expendituresCf = crossfilter(data.expenditures);
    this.expendituresHousehold = expendituresCf.dimension(function(d) { return d.hh; });
    this.expendituresType = expendituresCf.dimension(function(d) { return d.exp; });
    this.expendituresRound = expendituresCf.dimension(function(d) { return d.round; });
    var catExp = _.unique(data.expenditures.map(function(d) { return d.exp; }));
    this.expendituresByRound = this.expendituresRound.group().reduce(
      this.reduceAddRound("exp"), this.reduceRemoveRound("exp"), this.reduceInitRound(catExp)
    );
    this.expendituresByType = this.expendituresType.group().reduce(
      this.reduceAddType(), this.reduceRemoveType(), this.reduceInitType()
    );

    // expenditures children-specific
    var expendituresChildCf = crossfilter(data.expendituresChild);
    this.expendituresChildHousehold = expendituresChildCf.dimension(function(d) { return d.hh; });
    this.expendituresChildType = expendituresChildCf.dimension(function(d) { return d.exp_child; });
    this.expendituresChildRound = expendituresChildCf.dimension(function(d) { return d.round; });
    var catExpChild = _.unique(data.expendituresChild.map(function(d) { return d.exp_child; }));
    this.expendituresChildByRound = this.expendituresChildRound.group().reduce(
      this.reduceAddRound("exp_child"), this.reduceRemoveRound("exp_child"), this.reduceInitRound(catExpChild)
    );

    // outcomes crossfilter [ 1 - 1 relation with households]
    var outcomesCf = crossfilter(data.outcomes);
    this.outcomesHousehold = outcomesCf.dimension(function(d) { return d.hh; });

    // expenditures children most
    this.expendituresChildMostRound = outcomesCf.dimension(function(d) { return d.round; });
    var catExpChildMost = _.unique(data.outcomes.map(function(d) { return d.exp_child_most; }))
    this.expendituresChildMostByRound = this.expendituresChildMostRound.group().reduce(
      this.reduceAddRound("exp_child_most"), this.reduceRemoveRound("exp_child_most"), this.reduceInitRound(catExpChildMost)
    );

    // living conditions
    this.livingConditionsRound = outcomesCf.dimension(function(d) { return d.round; });
    var catLivingConditions = _.unique(data.outcomes.map(function(d) { return d.imp; }))
    this.livingConditionsByRound = this.expendituresChildMostRound.group().reduce(
      this.reduceAddRound("imp"), this.reduceRemoveRound("imp"), this.reduceInitRound(catLivingConditions)
    );

    // covers basic children needs
    this.basicNeedsRound = outcomesCf.dimension(function(d) { return d.round; });
    var catBasicNeeds = _.unique(data.outcomes.map(function(d) { return d.needs; }))
    this.basicNeedsByRound = this.expendituresChildMostRound.group().reduce(
      this.reduceAddRound("needs"), this.reduceRemoveRound("needs"), this.reduceInitRound(catBasicNeeds)
    );

    // covers children expenses
    this.covChildExpRound = outcomesCf.dimension(function(d) { return d.round; });
    var catCovChildExp = _.unique(data.outcomes.map(function(d) { return d.cov_child_exp; }))
    this.covChildExpByRound = this.covChildExpRound.group().reduce(
      this.reduceAddRound("cov_child_exp"), this.reduceRemoveRound("cov_child_exp"), this.reduceInitRound(catCovChildExp)
    );

    // current coping mechanisms
    var currentCopingCf = crossfilter(data.currentCoping);
    this.currentCopingHousehold = currentCopingCf.dimension(function(d) { return d.hh; });
    this.currentCopingRound = currentCopingCf.dimension(function(d) { return d.round; });
    this.currentCopingType = currentCopingCf.dimension(function(d) { return d.curr_cop; });
    this.currentCopingByType = this.currentCopingType.group().reduce(
      this.reduceAddType(), this.reduceRemoveType(), this.reduceInitType()
    );

    // stopped coping mechanisms
    var stoppedCopingCf = crossfilter(data.stoppedCoping);
    this.stoppedCopingHousehold = stoppedCopingCf.dimension(function(d) { return d.hh; });
    this.stoppedCopingRound = stoppedCopingCf.dimension(function(d) { return d.round; });
    this.stoppedCopingType = stoppedCopingCf.dimension(function(d) { return d.stop_cop; });
    this.stoppedCopingByType = this.stoppedCopingType.group().reduce(
      this.reduceAddType(), this.reduceRemoveType(), this.reduceInitType()
    );

    // education
    var educationCf = crossfilter(data.education);
    this.educationAge = educationCf.dimension(function(d) { return d.age; });
    this.educationGender = educationCf.dimension(function(d) { return d.gender; });
    this.educationLoc = educationCf.dimension(function(d) { return d.loc; });
    this.educationPoverty = educationCf.dimension(function(d) { return d.pov_line; });
    this.educationHead = educationCf.dimension(function(d) { return d.head; });
    this.educationRound = educationCf.dimension(function(d) { return d.round; });
    this.educationByRound = this.educationRound.group().reduce(
      this.reduceAddRound("edu_rec"), this.reduceRemoveRound("edu_rec"), this.reduceInitRound([1,2])
    );
    this.educationAge.filter([6,18]);

    // debugger;

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
      // new Vis.Views.ChildrenAge({model: Vis.Models.app});
      new Vis.Views.HouseholdsLocation({model: Vis.Models.app});
      new Vis.Views.HouseholdsPoverty({model: Vis.Models.app});
      new Vis.Views.HouseholdsHead({model: Vis.Models.app});
      new Vis.Views.ChildrenGender({model: Vis.Models.app});
    },

    initOutcomeViews: function() {
      var scenario = this.model.get("scenario"),
          page = +scenario.page,
          chapter = +scenario.chapter;

      new Vis.Views.Home({model: Vis.Models.app});
      new Vis.Views.Background({model: Vis.Models.app});
      new Vis.Views.Education({model: Vis.Models.app});
      new Vis.Views.Incomes({model: Vis.Models.app});
      new Vis.Views.Expenditures({model: Vis.Models.app});
      new Vis.Views.ExpendituresChildren({model: Vis.Models.app});
      new Vis.Views.CopingMechanisms({model: Vis.Models.app});
      new Vis.Views.ChildEmpowerment({model: Vis.Models.app});
      new Vis.Views.Conclusion({model: Vis.Models.app});
      new Vis.Views.LivingConditions({model: Vis.Models.app});
      new Vis.Views.PsychologicalWellbeing({model: Vis.Models.app});

    }

      // Backbone.trigger("brush:childrenAge", [5,11]);
      // Backbone.trigger("brush:householdsChildren", [2,5]);
      // Backbone.trigger("select:householdsLocation", [1]);
      // Backbone.trigger("select:householdsPoverty", [1]);
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
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.relative; })]))
        .y(d3.scale.linear().domain([0,10]))
        // .xAxis(d3.svg.axis().orient("top").tickValues([, 100]))
        .xAxis(d3.svg.axis().orient("top").ticks(3).tickFormat(function(d) { return d + "%"; }))
        // .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,10)))
        .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,8)))
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

      this.fixPositioning();
    },

    brush: function(extent) {
      this.chart.brushExtent(extent);
      this.render();
    },

    getData: function() {
      var data = this.model.getHouseholdsByChildren();
      data = data.filter(function(d) { return d.key !== 0; });

      var total = d3.sum(data.map(function(d) { return d.values.length; }));

      data.forEach(function(d) {
        return d.relative = Math.round(d.values.length * 100 / total); });

      return data;
    },

    fixPositioning: function() {
      d3.selectAll("#households-children .x.axis text").attr("y", 0);
    }

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
        // .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.value.householdCount; })]))
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.relative; })]))
        .y(d3.scale.ordinal().domain(["Amman", "Irbid", "Mafraq", "Zarqa", "Madaba", "Jarash", "Ajloun", "Others"]))
        .xAxis(d3.svg.axis().orient("top").ticks(3).tickFormat(function(d) { return d + "%"; }))
        // .xAxis(d3.svg.axis().orient("top").tickValues([50, 100]))
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
      this.fixPositioning();
    },

    getData: function() {
      var data = this.model.householdsByLocation.top(Infinity);
      var total = d3.sum(data.map(function(d) { return d.value.householdCount; }));

      data.forEach(function(d) {
        return d.relative = Math.round(d.value.householdCount * 100 / total); });

      data.forEach(function(d) {
        d.name = Vis.DEFAULTS.LOOKUP_CODES.GOVERNORATES[d.key] });
      return data;
    },

    select: function(selection) {
      this.chart.select(selection);
      this.render();
    },

    fixPositioning: function() {
      d3.selectAll("#households-location .x.axis text").attr("y", -10);
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
        // .color(d3.scale.ordinal().range(["#538dbc", "#b6cee2"]).domain(["Severe", "High"]))
        .color(d3.scale.ordinal().range(["#5e5e66", "#80a6b1"]).domain(["Severe", "High"]))
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
        // .color(d3.scale.ordinal().range(["#538dbc", "#d2766c"]).domain(["Female", "Male"]))
        .color(d3.scale.ordinal().range(["#5e5e66", "#80a6b1"]).domain(["Female", "Male"]))
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
        .margins({top: 40, right: 20, bottom: 1, left: 80})
        .data(data)
        .color(d3.scale.ordinal().range(["#5e5e66", "#80a6b1"]).domain(["Female", "Male"]))
        // .color(d3.scale.ordinal().range(["#538dbc", "#d2766c"]).domain(["Female", "Male"]))
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
// Expenditures children view
Vis.Views.Background = Backbone.View.extend({
    el: '.container',

    highlighted: [],

    initialize: function () {
      var that = this;

      this.chart = new Array(3);

      if (that.model.get("scenario").page === 2) this.preRender(this.model.get("scenario").chapter);

      this.model.on("change:scenario", function() {
        if (that.model.get("scenario").page === 2) this.preRender(that.model.get("scenario").chapter);
        },this);

      Backbone.on("filtered", function(d) {
        if (that.model.get("scenario").page === 2) this.render(that.model.get("scenario").chapter);
        }, this);
    },

    preRender: function(chapter) {
      var that = this,
          templateSample = _.template(Vis.Templates["background-sample"]);

      $("#households-children").show();
      $("#children-gender").hide();

      // this.clearCharts();
      Vis.utils.clearCharts();

      $(".outcomes").removeClass("col-md-8").addClass("col-md-12");
      $("#main-chart").html(templateSample());

      $(".profile").hide();

      // set text content
      ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
        that.setTextContent(d);
      });

      $("#pending").hide();

      $("#main-chart").show();

      this.initChart(chapter);
    },

    initChart: function(chapter) {
      var that = this,
          data = this.getData(chapter),
          total = this.getTotal(chapter);

      switch(chapter) {
          case 1:
            // this.chart = d3.barChartMultiStacked()
            //   .width(600).height(350)
            //   .margins({top: 40, right: 250, bottom: 40, left: 200})
            //   .data(data)
            //   .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            //   .relativeTo(total)
            //   .title("Were you able to cover expenses for your children that were not a priority before ?")
            //   .xTitle("")
            //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COV_CHILD_EXP);
            break;
          case 2:
            /* barchart
            this.chart = d3.barChartAge()
              .width(200).height(400)
              .margins({top: 40, right: 20, bottom: 10, left: 45})
              .data(data)
              .relativeTo(total)
              // .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.value; })]))
              .x(d3.scale.linear())
              .y(d3.scale.linear().domain([0,18]))
              .xAxis(d3.svg.axis().orient("top").tickValues([50, 100]))
              .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,18)))
              .title("By age")
              .hasBrush(false);
            */

            break;

          case 4:
            break;
          default:
            console.log("no matching case.")
        }
      this.render(chapter);
    },

    render: function(chapter) {
      var that = this;
      switch(chapter) {
          case 1:
            this.chart[0] = c3.generate({
              bindto: d3.select("#background-sample #age"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 0),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Children age"
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6', '#609078', '#B45B49']
              }
            });

            this.chart[1] = c3.generate({
              bindto: d3.select("#background-sample #gender"),
              size: {
                width: 250,
                height: 250,
              },
              data: {
                columns: that.getData(chapter, 1),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Children gender"
              },
              color: {
                pattern: ['#003950', '#E59138']
              }
            });

            this.chart[2] = c3.generate({
              bindto: d3.select("#background-sample #poverty"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 2),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Poverty level",
                  label: {
                    threshold: 0.1
                  } 
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6']
              }
            });
            break;
          case 2:
            this.chart[0] = c3.generate({
              bindto: d3.select("#background-sample #age"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 0),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Children age"
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6', '#609078', '#B45B49']
              }
            });

            this.chart[1] = c3.generate({
              bindto: d3.select("#background-sample #gender"),
              size: {
                width: 250,
                height: 250,
              },
              data: {
                columns: that.getData(chapter, 1),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Children gender"
              },
              color: {
                pattern: ['#003950', '#E59138']
              }
            });

            this.chart[2] = c3.generate({
              bindto: d3.select("#background-sample #poverty"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 2),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Poverty level",
                  label: {
                    threshold: 0.1
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6']
              }
            });

            /* barchart
            this.chart
              .selected(this.model.get("ages"))
              .data(this.getData(chapter))
            d3.select("#main-chart").call(this.chart);
            */
            break;
          case 2:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            //   .highlighted(this.highlighted)
            // d3.select("#main-chart").call(this.chart);
            break;
          case 4:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            // d3.select("#main-chart").call(this.chart);
            // d3.selectAll(".bar-chart-multi-stacked rect").style("opacity", 0.7);
            break;
          default:
            console.log("no matching case.")
        }
    },

    getData: function(chapter, index) {
      switch(chapter) {
          case 1:
            switch(index) {
              case 0:
                return [
                  ["0-1 year"].concat(d3.range(1,8).map(function(d) { return 1; })),
                  ["2-4 years"].concat(d3.range(1,18).map(function(d) { return 1; })),
                  ["5-11 years"].concat(d3.range(1,47).map(function(d) { return 1; })),
                  ["12-15 years"].concat(d3.range(1,23).map(function(d) { return 1; })),
                  ["16-17 years"].concat(d3.range(1,9).map(function(d) { return 1; }))
                ];
                // var  = ["0-1 year"].concat(d3.range(1,7).map(function(d) { return 1; })),
                //     resilient = ["Resilient"].concat(d3.range(1,3).map(function(d) { return 1; })),
                //     severe = ["Severely Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; }));
                // return [high, resilient, severe];
                break;
              case 1:
              return [
                ["Male"].concat(d3.range(1,52).map(function(d) { return 1; })),
                ["Female"].concat(d3.range(1,50).map(function(d) { return 1; })),
              ];
                break;
              case 2:
                return [
                  ["Highly Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; })),
                  ["Severely Vulnerable"].concat(d3.range(1,59).map(function(d) { return 1; })),
                  ["Children with specific needs"].concat(d3.range(1,3).map(function(d) { return 1; })),
                ];

                // var total = d3.sum(this.model.householdsByPoverty.top(Infinity), function(d) { return d.value.householdCount; });
                // return this.model.householdsByPoverty.top(Infinity).map(function(d) {
                //   console.log(Math.round((d.value.householdCount / total)*100));
                //   return [Vis.DEFAULTS.LOOKUP_CODES.POVERTY[d.key]]
                //           .concat(d3.range(1, Math.round((d.value.householdCount / total)*100)+1).map());
                // });
                break;
              default:
                console.log("no matching case.")
            }
            // return this.model.covChildExpByRound.top(Infinity);
            break;
          case 2:
            switch(index) {
              case 0:
                return [
                  ["0-1 year"].concat(d3.range(1,7).map(function(d) { return 1; })),
                  ["2-4 years"].concat(d3.range(1,18).map(function(d) { return 1; })),
                  ["5-11 years"].concat(d3.range(1,46).map(function(d) { return 1; })),
                  ["12-15 years"].concat(d3.range(1,25).map(function(d) { return 1; })),
                  ["16-17 years"].concat(d3.range(1,9).map(function(d) { return 1; }))
                ];
                // var  = ["0-1 year"].concat(d3.range(1,7).map(function(d) { return 1; })),
                //     resilient = ["Resilient"].concat(d3.range(1,3).map(function(d) { return 1; })),
                //     severe = ["Severely Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; }));
                // return [high, resilient, severe];
                break;
              case 1:
                var total = d3.sum(this.model.childrenByGender.top(Infinity), function(d) { return d.value; });
                return this.model.childrenByGender.top(Infinity).map(function(d) {
                  return [d.name].concat(d3.range(1, Math.round((d.value / total)*100) + 1).map(function(d) { return 1; }));
                });
                break;
              case 2:
                var high = ["Highly Vulnerable"].concat(d3.range(1,59).map(function(d) { return 1; })),
                    resilient = ["Resilient"].concat(d3.range(1,3).map(function(d) { return 1; })),
                    severe = ["Severely Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; }));
                return [high, resilient, severe];

                // var total = d3.sum(this.model.householdsByPoverty.top(Infinity), function(d) { return d.value.householdCount; });
                // return this.model.householdsByPoverty.top(Infinity).map(function(d) {
                //   console.log(Math.round((d.value.householdCount / total)*100));
                //   return [Vis.DEFAULTS.LOOKUP_CODES.POVERTY[d.key]]
                //           .concat(d3.range(1, Math.round((d.value.householdCount / total)*100)+1).map());
                // });
                break;
              default:
                console.log("no matching case.")
            }
            break;
          // case 4:
          //   return this.model.basicNeedsByRound.top(Infinity);
          //   break;
          default:
            console.log("no matching case.")
        }
    },

    // test: _.throttle(function (highlighted) {
    //   this.highlighted = highlighted;
    //   this.render(this.model.get("scenario").chapter);
    //   console.log("test");
    // }, 300),

    getTotal: function(chapter) {
      switch(chapter) {
        case 1:
          // return _.unique(this.model.expendituresHousehold.top(Infinity)
          //         .map(function(d) { return d.hh })).length;
          // return _.unique(this.model.outcomesHousehold.top(Infinity)
          // .map(function(d) { return d.hh })).length;
          break;
        case 2:

          break;
        case 2:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        // case 4:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
        default:
          console.log("no matching case.")
      }
    },

    setTextContent: function(attr) {
      var scenario = this.model.get("scenario")
          id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
          template = _.template(Vis.Templates[attr][id]);

      $("#" + attr).html(template());

    },

    clearCharts: function() {
      if (this.chart) this.chart = null;
      // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
      if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    },

    fixPositionning: function() {
      d3.selectAll("#main-chart .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });
    }
});
// Coping mechanisms view
Vis.Views.CopingMechanisms = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    this.chart = new Array(3);

    if (that.model.get("scenario").page === 5) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 5) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 5) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this,
        template = _.template(Vis.Templates["coping-mechanisms"]);

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();
    Vis.utils.clearCharts();

    $("#main-chart").html(template());
    $(".profile").show();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this;
        // data = this.getData(chapter),
        // total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart[0] = d3.heatmap()
            .width(115).height(325)
            .margins({top: 40, right: 20, bottom: 30, left: 10})
            .data(this.getData(chapter, 0))
            .color(d3.scale.threshold()
              .domain([10,20,30,40,50,60,70,80,90,100.1])
               .range(['#f6eae9','#eed2cc','#e4b9b1','#daa295','#ce8a7c','#c27362','#b45b49','#9a4d3e','#7e4033','#643228']))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
            .title("Currently used")
            .xTitle("")
            .hasNames(false)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COPING_MECHANISMS);

          this.chart[1] = d3.heatmap()
            .width(390).height(365)
            .margins({top: 30, right: 300, bottom: 30, left: 5})
            .data(this.getData(chapter, 1))
            .color(d3.scale.threshold()
              // .domain([1,5,10,40,50,60,70,80,90,100.1])
              .domain([10,20,30,40,50,60,70,80,90,100.1])
              .range(['#dae6e9','#c2d1d6','#abbdc5','#94a8b3','#7d94a2','#668190','#506e80','#395c6f','#224a5f','#003950']))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
            .title("Stopped coping mechanisms")
            // .titleDeltaY(-15)
            // .xTitleDeltaX()
            .xTitle("")
            .hasNames(true)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COPING_MECHANISMS);

          this.chart[2] = d3.heatmapLegend()
            .width(100).height(310)
            .margins({top: 100, right: 10, bottom: 10, left: 40})
            // {values: [0,20,40,60,80,100]},
            .data({
              cold: ['#dae6e9','#c2d1d6','#abbdc5','#94a8b3','#7d94a2','#668190','#506e80','#395c6f','#224a5f','#003950'],
              hot: ['#f6eae9','#eed2cc','#e4b9b1','#daa295','#ce8a7c','#c27362','#b45b49','#9a4d3e','#7e4033','#643228']}
            )
            .title("% of answers")
            .xTitle("");
          break;
        case 2:
          break;
        case 4:
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart[0]
            .data(this.getData(chapter, 0))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
          d3.select("#current").call(this.chart[0]);

          this.chart[1]
            .data(this.getData(chapter, 1))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
          d3.select("#stopped").call(this.chart[1]);

          if (d3.select("#heatmap-legends svg").empty()) d3.select("#heatmap-legends").call(this.chart[2]);

          this.fixPositionning();
          break;
        case 2:
          break;
        case 4:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter, index) {
    switch(chapter) {
        case 1:
          if(index == 0) {
            return this.model.currentCopingByType.top(Infinity);
          } else {
            return this.model.stoppedCopingByType.top(Infinity);
          }
          // return (index == 0) ?
          //   this.model.currentCopingByType.top(Infinity):
          //   this.model.stoppedCopingByType.top(Infinity);
          break;
        case 2:
          break;
        case 4:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter, index) {
    switch(chapter) {
      case 1:
        if (index == 0) {
          return _.unique(this.model.currentCopingHousehold.top(Infinity)
            .map(function(d) { return d.hh })).length;
        } else {
          return _.unique(this.model.stoppedCopingHousehold.top(Infinity)
            .map(function(d) { return d.hh })).length;
        }
        break;
      case 2:
        // return _.unique(this.model.outcomesHousehold.top(Infinity)
        //         .map(function(d) { return d.hh })).length;
        break;
      case 4:
        // return _.unique(this.model.outcomesHousehold.top(Infinity)
        //         .map(function(d) { return d.hh })).length;
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());

  },

  clearCharts: function() {
    // if (this.chart) this.chart = null;
    if (this.chart) this.chart = new Array(2);
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  },

  fixPositionning: function() {
    d3.select("#stopped .main.title").attr("x", 82);
    // d3.selectAll("#main-chart .x.axis text")
    //   .data(["Jun.", "Aug.", "Nov."])
    //   .text(function(d) { return d; });
  }
});
// Home view
Vis.Views.Home = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 1) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 1) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 1) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();
    Vis.utils.clearCharts();

    $(".profile").hide();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    // this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 280, bottom: 40, left: 150})
            .data(data)
            // .color(d3.scale.ordinal().range(["#003950", "#E59138"]).domain([1, 2]))
            .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            .relativeTo(total)
            .title("Improvement in families overall living conditions.")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.LIVING_CONDITIONS);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 2:
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          return this.model.livingConditionsByRound.top(Infinity);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter) {
    switch(chapter) {
      case 1:
        return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
        break;
      case 2:
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());
  },

  clearCharts: function() {
    if (this.chart) this.chart = null;
    // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  }
});
// Education view
Vis.Views.Education = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 8) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 8) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 8) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    // this.clearCharts();
    Vis.utils.clearCharts();

    $(".profile").show();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    $("#households-children").hide();
    $("#children-gender").show();


    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter);
        // total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartEducation()
            .width(600).height(350)
            .margins({top: 40, right: 240, bottom: 40, left: 140})
            .data(data)
            .title("Education attendance among school-aged children")
            .xTitle("");

          break;
        case 2:
          break;
        case 4:
          this.chart = d3.barChartMultiStacked()
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart
            .data(this.getData(chapter))
            // .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 2:
          break;
        case 4:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          return this.model.educationByRound.top(Infinity);
          break;
        case 2:
          break;
        case 4:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter) {
    switch(chapter) {
      case 1:
        return _.unique(this.model.expendituresHousehold.top(Infinity)
                .map(function(d) { return d.hh })).length;
        break;
      case 2:
        break;
      case 4:
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());

  },

  clearCharts: function() {
    if (this.chart) this.chart = null;
    // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  }
});
// Living conditions view
Vis.Views.LivingConditions = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    this.chart = new Array(2);

    if (that.model.get("scenario").page === 6) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 6) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 6) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this,
        template = _.template(Vis.Templates["living-conditions"]);

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();

    Vis.utils.clearCharts();

    $("#main-chart").html(template());

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $(".profile").show();
    $("#pending").hide();
    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this;
        // data = this.getData(chapter),
        // total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart[0] = d3.barChartMultiStacked()
            .width(320).height(350)
            .margins({top: 40, right: 110, bottom: 40, left: 60})
            .data(this.getData(chapter, 0))
            .color(d3.scale.ordinal().range(['#003950','#567888','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            // .color(d3.scale.ordinal().range(['#3c5f6b','#6d8d97','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            // .color(d3.scale.ordinal().range(['#486280','#748fa2','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
            .title("Covering of children basic needs")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.BASIC_NEEDS);

          this.chart[1] = d3.barChartMultiStacked()
            .width(320).height(350)
            .margins({top: 40, right: 110, bottom: 40, left: 80})
            .data(this.getData(chapter, 1))
            // .color(d3.scale.ordinal().range(["#003950", "#E59138"]).domain([1, 2]))
            .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
            .title("Improvement of family's overall living conditions")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.LIVING_CONDITIONS);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart[0]
            .data(this.getData(chapter, 0))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
          d3.select("#basic-needs").call(this.chart[0]);

          this.chart[1]
            .data(this.getData(chapter, 1))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
          d3.select("#improvement").call(this.chart[1]);

          this.fixPositionning();
          break;
        case 2:
          // this.chart
          //   .data(this.getData(chapter))
          //   .relativeTo(this.getTotalHouseholds(chapter))
          // d3.select("#main-chart").call(this.chart);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter, index) {
    switch(chapter) {
        case 1:
          if(index == 0) {
             return this.model.basicNeedsByRound.top(Infinity);
          } else {
            return this.model.livingConditionsByRound.top(Infinity);
            // return this.model.stoppedCopingByType.top(Infinity);
          }

          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter, index) {
    switch(chapter) {
      case 1:
        if(index == 0) {
          return _.unique(this.model.outcomesHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
        } else {
          return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
        }
        break;
      case 2:
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());
  },

  // clearCharts: function() {
  //   // if (this.chart) this.chart = null;
  //   if (this.chart) this.chart = new Array(2);
  //   if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  // },

  fixPositionning: function() {
    d3.selectAll("#basic-needs .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });

    d3.selectAll("#improvement .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });
  }

});
// Children empowerment view
Vis.Views.ChildEmpowerment = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 9) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 9) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 9) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();
    Vis.utils.clearCharts();

    $(".profile").hide();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    // this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 280, bottom: 40, left: 150})
            .data(data)
            // .color(d3.scale.ordinal().range(["#003950", "#E59138"]).domain([1, 2]))
            .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            .relativeTo(total)
            .title("Improvement in families overall living conditions.")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.LIVING_CONDITIONS);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 2:
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          return this.model.livingConditionsByRound.top(Infinity);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter) {
    switch(chapter) {
      case 1:
        return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
        break;
      case 2:
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());
  },

  clearCharts: function() {
    if (this.chart) this.chart = null;
    // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  }
});
// Conclusion view
Vis.Views.Conclusion = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 10) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 10) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 10) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();
    Vis.utils.clearCharts();

    $(".profile").hide();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    // this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 280, bottom: 40, left: 150})
            .data(data)
            // .color(d3.scale.ordinal().range(["#003950", "#E59138"]).domain([1, 2]))
            .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            .relativeTo(total)
            .title("Improvement in families overall living conditions.")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.LIVING_CONDITIONS);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 2:
          this.chart
            .data(this.getData(chapter))
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          return this.model.livingConditionsByRound.top(Infinity);
          break;
        case 2:
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter) {
    switch(chapter) {
      case 1:
        return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
        break;
      case 2:
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());
  },

  clearCharts: function() {
    if (this.chart) this.chart = null;
    // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  }
});
// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
  el: '.container',

  highlighted: [],

  initialize: function () {
    var that = this;

    if (that.model.get("scenario").page === 3) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 3) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 3) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    // this.clearCharts();
    Vis.utils.clearCharts();

    $(".profile").show();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this,
        data = this.getData(chapter),
        total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart = d3.barChartMultiStacked()
            .width(600).height(350)
            .margins({top: 40, right: 280, bottom: 40, left: 180})
            .data(data)
            .color(d3.scale.ordinal().range(["#003950", "#88A3B6", "#E59138","#EDDAC3"]).domain([1, 2, 5, 99]))
            .relativeTo(total)
            .title("Main sources of income (% of answers)")
            .xTitle("")
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.INCOME);

          break;
        case 2:
          this.chart = d3.multiSeriesTimeLine()
            .width(600).height(350)
            .margins({top: 40, right: 200, bottom: 40, left: 100})
            .color(d3.scale.ordinal().range(["#E59138","#6D8378","#88a3b6","#003950", "#A999A4","#5F1D00"]).domain([1, 2, 3, 4, 5, 6]))
            .data(data)
            .relativeTo(total)
            .title("Main economic contributors to the family")
            .xTitle("")
            .elasticY(true)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.ECO_CONTRIBUTORS)
            .on("highlighted", function (highlighted) {
              that.highlighted = highlighted;
              that.render(that.model.get("scenario").chapter); });
          break;
        case 4:
          // this.chart = d3.barChartMultiStacked()
          //   .width(455).height(350)
          //   .margins({top: 40, right: 160, bottom: 40, left: 200})
          //   .data(data)
          //   .color(d3.scale.ordinal().range(['#003950','#567888','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
          //   // .color(d3.scale.ordinal().range(['#3c5f6b','#6d8d97','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
          //   // .color(d3.scale.ordinal().range(['#486280','#748fa2','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
          //   .relativeTo(total)
          //   .title("Covering of children basic needs")
          //   .xTitle("Wave")
          //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.BASIC_NEEDS);
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart
            .data(this.getData(chapter))
            // .highlighted(this.highlighted)
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          this.fixPositionning();
          break;
        case 2:
          this.chart
            .data(this.getData(chapter))
            .highlighted(this.highlighted)
            .relativeTo(this.getTotalHouseholds(chapter))
          d3.select("#main-chart").call(this.chart);
          break;
        case 4:
          // this.chart
          //   .data(this.getData(chapter))
          //   .relativeTo(this.getTotalHouseholds(chapter))
          // d3.select("#main-chart").call(this.chart);
          // d3.selectAll(".bar-chart-multi-stacked rect").style("opacity", 0.7);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter) {
    switch(chapter) {
        case 1:
          // return this.model.incomesByType.top(Infinity);
          return this.model.incomesByRound.top(Infinity);
          break;
        case 2:
          return this.model.ecoContribByType.top(Infinity);
          break;
        case 4:
          // return this.model.basicNeedsByRound.top(Infinity);
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter) {
    switch(chapter) {
      case 1:
        var totals = {};
        this.model.incomesByRound.top(Infinity)
          .forEach(function(d) { totals[d.key] = d3.sum(d.value.map(function(v) { return v.count; })) });
        return totals;
        // return _.unique(this.model.incomesHousehold.top(Infinity).map(function(d) {
        //   return d.hh })).length;
        break;
      case 2:
        return _.unique(this.model.ecoContribHousehold.top(Infinity)
                .map(function(d) { return d.hh })).length;
        break;
      case 4:
        // return _.unique(this.model.outcomesHousehold.top(Infinity)
        //         .map(function(d) { return d.hh })).length;
        break;
      default:
        console.log("no matching case.")
    }
  },

  // getHighlighted: function(highlighted) {
  //   var bp = null;
  // }

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());

  },

  clearCharts: function() {
    if (this.chart) this.chart = null;
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    d3.select("main-chart #living-conditions").remove();
    d3.select("main-chart .heatmap").remove();
  },

  fixPositionning: function() {
    d3.selectAll("#main-chart .x.axis text")
      .data(["Jun.", "Aug.", "Nov."])
      .text(function(d) { return d; });
  }
});
// Expenditures view
Vis.Views.Expenditures = Backbone.View.extend({
    el: '.container',

    highlighted: [],

    initialize: function () {
      var that = this;

      if (that.model.get("scenario").page === 4) this.preRender(this.model.get("scenario").chapter);

      this.model.on("change:scenario", function() {
        if (that.model.get("scenario").page === 4) this.preRender(that.model.get("scenario").chapter);
        },this);

      Backbone.on("filtered", function(d) {
        if (that.model.get("scenario").page === 4) this.render(that.model.get("scenario").chapter);
        }, this);
    },

    preRender: function(chapter) {
      var that = this;

      $("#households-children").show();
      $("#children-gender").hide();

      // this.clearCharts();
      Vis.utils.clearCharts();

      $(".profile").show();

      // set text content
      ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
        that.setTextContent(d);
      });

      $("#pending").hide();

      $("#main-chart").show();

      this.initChart(chapter);
    },

    initChart: function(chapter) {
      var that = this,
          data = this.getData(chapter),
          total = this.getTotalHouseholds(chapter);

      switch(chapter) {
          case 1:
            // this.chart = d3.multiSeriesTimeLine()
            //   .width(600).height(350)
            //   .margins({top: 40, right: 265, bottom: 40, left: 45})
            //   .data(data)
            //   .color(d3.scale.ordinal().range(
            //     ["#003950","#745114","#88a3b6","#917E8A","#E59138","#6D8378",
            //      "#5E6666","#4C4322","#B45B49","#804D00","#706B5A","#AEB883",
            //      "#5F1D00","#A999A4"]).domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 97]))
            //   .relativeTo(total)
            //   .title("Expenditures that people who receive the Cash Grant spend it on")
            //   .xTitle("Wave")
            //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES)
            //   .on("highlighted", function (highlighted) {
            //     that.highlighted = highlighted;
            //     that.render(that.model.get("scenario").chapter); });

            this.chart = d3.multiSeriesTimeLineAlt()
              .width(600).height(350)
              .margins({top: 40, right: 150, bottom: 40, left: 180})
              .data(data)
              .color(d3.scale.ordinal().range(
                ["#003950","#E59138","#609078"]).domain([1, 2, 3]))
                // ["#E59138","#88A3B6","#706B5A"]).domain([1, 2, 3]))
                // ["#A1BDC5","#567888","#003950"]).domain([1, 2, 3]))
                // ["#E59138","#003950","#B45B49"]).domain([1, 2, 3]))
              .relativeTo(total)
              .yDomain([1,2,4,3,9,10,7,5,6,8,11,13,12,97])
              .title("Expenditures that people who receive the Cash Grant spend it on")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES)
              .on("highlighted", function (highlighted) {
                that.highlighted = highlighted;
                that.render(that.model.get("scenario").chapter); });
            break;
          // case 2:
          //   this.chart = d3.barChartMultiStacked()
          //     .width(600).height(350)
          //     .margins({top: 40, right: 280, bottom: 40, left: 150})
          //     .data(data)
          //     .color(d3.scale.ordinal().range(["#A999A4", "#C0B491", "#EDDAC3", "#80A6B1"]).domain([1, 2, 3, 99]))
          //     .relativeTo(total)
          //     .title("Children-specific expenditures [Mostly spent each month]")
          //     .xTitle("")
          //     .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES_CHILD_MOST);
          //   break;
          case 2:
            this.chart = d3.multiSeriesTimeLineAlt()
              .width(600).height(350)
              .margins({top: 40, right: 150, bottom: 40, left: 180})
              .data(data)
              .color(d3.scale.ordinal().range(
                ["#003950","#E59138","#609078"]).domain([1, 2, 3]))
                // ["#E59138","#88A3B6","#706B5A"]).domain([1, 2, 3]))
                // ["#E59138","#003950","#B45B49"]).domain([1, 2, 3]))
                // ["#E59138","#003950","#B45B49"]).domain([1, 2, 3]))
                // ["#1f77b4","#d62728","#2ca02c"]).domain([1, 2, 3]))
              .relativeTo(total)
              .yDomain([10,6,3,9,7,5,2,11,4,12,13,99])
              .title("Children-specific expenditures")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.EXPENDITURES_CHILDREN)
              .on("highlighted", function (highlighted) {
                that.highlighted = highlighted;
                that.render(that.model.get("scenario").chapter); });
            break;

          case 4:
            // this.chart = d3.barChartMultiStacked()
            //   .width(600).height(350)
            //   .margins({top: 40, right: 280, bottom: 40, left: 150})
            //   .data(data)
            //   .color(d3.scale.ordinal().range(['#003950','#567888','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            //   // .color(d3.scale.ordinal().range(['#3c5f6b','#6d8d97','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            //   // .color(d3.scale.ordinal().range(['#486280','#748fa2','#a1bdc5', "#B45B49"]).domain([1, 2, 3, 4]))
            //   .relativeTo(total)
            //   .title("Covering of children basic needs")
            //   .xTitle("")
            //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.BASIC_NEEDS);
            break;
          default:
            console.log("no matching case.")
        }
      this.render(chapter);
    },

    render: function(chapter) {
      switch(chapter) {
          case 1:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            //   .highlighted(this.highlighted)
            // d3.select("#main-chart").call(this.chart);
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
              .highlighted(this.highlighted)
            d3.select("#main-chart").call(this.chart);
            break;
          // case 2:
          //   this.chart
          //     .data(this.getData(chapter))
          //     .relativeTo(this.getTotalHouseholds(chapter))
          //   d3.select("#main-chart").call(this.chart);
          //   break;
          case 2:
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
              .highlighted(this.highlighted)
            d3.select("#main-chart").call(this.chart);
            break;
          case 4:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            // d3.select("#main-chart").call(this.chart);
            // d3.selectAll(".bar-chart-multi-stacked rect").style("opacity", 0.7);
            break;
          default:
            console.log("no matching case.")
        }
    },

    getData: function(chapter) {
      switch(chapter) {
          case 1:
            // return this.model.expendituresByType.top(Infinity);
            return this.model.expendituresByRound.top(Infinity);
            break;
          // case 2:
          //   return this.model.expendituresChildMostByRound.top(Infinity);
          //   break;
          case 2:
            return this.model.expendituresChildByRound.top(Infinity);
            break;
          // case 4:
          //   return this.model.basicNeedsByRound.top(Infinity);
          //   break;
          default:
            console.log("no matching case.")
        }
    },

    // test: _.throttle(function (highlighted) {
    //   this.highlighted = highlighted;
    //   this.render(this.model.get("scenario").chapter);
    //   console.log("test");
    // }, 300),

    getTotalHouseholds: function(chapter) {
      switch(chapter) {
        case 1:
          return _.unique(this.model.expendituresHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        // case 2:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
        case 2:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        // case 4:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
        default:
          console.log("no matching case.")
      }
    },

    setTextContent: function(attr) {
      var scenario = this.model.get("scenario")
          id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
          template = _.template(Vis.Templates[attr][id]);

      $("#" + attr).html(template());

    },

    clearCharts: function() {
      if (this.chart) this.chart = null;
      // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
      if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    }
});
// Expenditures children view
Vis.Views.ExpendituresChildren = Backbone.View.extend({
    el: '.container',

    highlighted: [],

    initialize: function () {
      var that = this;

      if (that.model.get("scenario").page === 7) this.preRender(this.model.get("scenario").chapter);

      this.model.on("change:scenario", function() {
        if (that.model.get("scenario").page === 7) this.preRender(that.model.get("scenario").chapter);
        },this);

      Backbone.on("filtered", function(d) {
        if (that.model.get("scenario").page === 7) this.render(that.model.get("scenario").chapter);
        }, this);
    },

    preRender: function(chapter) {
      var that = this;

      $("#households-children").show();
      $("#children-gender").hide();

      // this.clearCharts();
      Vis.utils.clearCharts();

      $(".profile").show();

      // set text content
      ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
        that.setTextContent(d);
      });

      $("#pending").hide();

      $("#main-chart").show();

      this.initChart(chapter);
    },

    initChart: function(chapter) {
      var that = this,
          data = this.getData(chapter),
          total = this.getTotalHouseholds(chapter);

      switch(chapter) {
          case 1:
            this.chart = d3.barChartMultiStacked()
              .width(600).height(350)
              .margins({top: 40, right: 250, bottom: 40, left: 200})
              .data(data)
              .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
              .relativeTo(total)
              .title("Were you able to cover expenses for your children that were not a priority before ?")
              .xTitle("")
              .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COV_CHILD_EXP);
            break;
          case 2:
            break;

          case 4:
            break;
          default:
            console.log("no matching case.")
        }
      this.render(chapter);
    },

    render: function(chapter) {
      switch(chapter) {
          case 1:
            this.chart
              .data(this.getData(chapter))
              .relativeTo(this.getTotalHouseholds(chapter))
            d3.select("#main-chart").call(this.chart);
            this.fixPositionning();
            break;
          // case 2:
          //   this.chart
          //     .data(this.getData(chapter))
          //     .relativeTo(this.getTotalHouseholds(chapter))
          //   d3.select("#main-chart").call(this.chart);
          //   break;
          case 2:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            //   .highlighted(this.highlighted)
            // d3.select("#main-chart").call(this.chart);
            break;
          case 4:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            // d3.select("#main-chart").call(this.chart);
            // d3.selectAll(".bar-chart-multi-stacked rect").style("opacity", 0.7);
            break;
          default:
            console.log("no matching case.")
        }
    },

    getData: function(chapter) {
      switch(chapter) {
          case 1:
            return this.model.covChildExpByRound.top(Infinity);
            break;
          // case 2:
          //   return this.model.expendituresChildMostByRound.top(Infinity);
          //   break;
          case 2:
            // return this.model.expendituresChildByRound.top(Infinity);
            break;
          // case 4:
          //   return this.model.basicNeedsByRound.top(Infinity);
          //   break;
          default:
            console.log("no matching case.")
        }
    },

    // test: _.throttle(function (highlighted) {
    //   this.highlighted = highlighted;
    //   this.render(this.model.get("scenario").chapter);
    //   console.log("test");
    // }, 300),

    getTotalHouseholds: function(chapter) {
      switch(chapter) {
        case 1:
          // return _.unique(this.model.expendituresHousehold.top(Infinity)
          //         .map(function(d) { return d.hh })).length;
          return _.unique(this.model.outcomesHousehold.top(Infinity)
          .map(function(d) { return d.hh })).length;
          break;
        // case 2:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
        case 2:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        // case 4:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
        default:
          console.log("no matching case.")
      }
    },

    setTextContent: function(attr) {
      var scenario = this.model.get("scenario")
          id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
          template = _.template(Vis.Templates[attr][id]);

      $("#" + attr).html(template());

    },

    clearCharts: function() {
      if (this.chart) this.chart = null;
      // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
      if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    },

    fixPositionning: function() {
      d3.selectAll("#main-chart .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });
    }
});
// Psychological wellbeing view
Vis.Views.PsychologicalWellbeing = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    this.dispatch(this.model.get("scenario"));
    this.model.on("change:scenario", function() {
      this.dispatch(this.model.get("scenario"));
      },this);
    Backbone.on("filtered", function(d) { this.render();}, this);
  },

  dispatch: function(scenario) {
    var scenario = this.model.get("scenario"),
        that = this;

    // if (scenario.page === 7) {
    //
    //
    //   $(".profile").hide();
    //   this.clearCharts();
    //   // set text content
    //   ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
    //     that.setTextContent(d);
    //   });
    //
    //   $("#pending").show();
    //   $("#main-chart").hide();
    //
    //   switch(scenario.chapter) {
    //     case 1:
    //         // this.initChart();
    //         break;
    //     case 2:
    //         // code block
    //         break;
    //     default:
    //         // default code block
    //   }
    // }
  },

  render: function() {
  },

  initChart: function() {
  },

  getData: function() {
    return this.model.incomesByType.top(Infinity);
  },

  getTotalHouseholds: function() {
    return _.unique(this.model.incomesHousehold.top(Infinity).map(function(d) {
       return d.hh })).length;
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());
  },

  clearCharts: function() {
    if (this.chart) this.chart = null;
    // if(!d3.select(".time-line svg").empty()) d3.select(".time-line svg").remove();
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
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
        this.cursor = milestone.time.getMilliseconds();
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
        .width(800).height(60)
        .margins({top: 30, right: 50, bottom: 10, left: 40})
        .data(data)
        .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.time; })))
        .on("browsing", function(scenario) {
          Vis.Routers.app.navigate("page/" + scenario.page + "/chapter/" + scenario.chapter, {trigger: true});
        })

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
            if (idx !== -1) {
              var milestone = that.getData()[idx];
              Vis.Routers.app.navigate("#page/" + milestone.page + "/chapter/" + milestone.chapter, {trigger: true});
            }
            that.cursor += 5;
          }
          , 5000);
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
      barHeight = 15,
      xAxis = d3.svg.axis().orient("bottom").tickValues([2,4]),
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
        console.log(_gBars);
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
            .attr("width", function(d) {
              console.log(toPercentage(d.value));
              return x(toPercentage(d.value)); })
            .attr("height", function(d) { return barHeight; });
      }

      function _skeleton() {
        // set scales range
        x.range([0 , _gWidth]);
        y.range([0, _gHeight]);

        x.domain(getXExtent());


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

        if(hasBrush) {
          _gBrush = g.append("g").attr("class", "brush").call(brush);
          _gBrush.selectAll("rect").attr("width", _gWidth);

          brush.on("brush", function() {
            _listeners.filtering(_getDataBrushed(brush));
          });

          brush.on("brushend", function() {
            _listeners.filtered(brush);
          });
        }
      }

      function toPercentage(val, round) {
        return Math.round((val/relativeTo)*100);
      }

      function getXExtent() {
        return [0, d3.max(data.map(function(d) { return toPercentage(d.value)}))];
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
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
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

      data = _transformData(data);

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
              // return x(d.values.length); })
              // return x(d.count); })
              return x(d.relative); })
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

        d3.selectAll("#households-children .y.axis text")
          .data(["1","2","3","4","5","6","7+"])
          .text(function(d) { return d; })

        _gBrush = g.append("g").attr("class", "brush").call(brush);
        _gBrush.selectAll("rect").attr("width", _gWidth);

        brush.on("brush", function() {
          _listeners.filtering(_getDataBrushed(brush));
        });

        brush.on("brushend", function() {
          _listeners.filtered(brush);
        });
      }

      function _transformData(data) {
        // var sumOver7 = d3.sum(
        //   data.filter(function(d) { return d.key >= 7; })
        //   .map(function(d) { return d.values.length; })
        // )
        // data = data
        //   .filter(function(d) { return d.key < 7; })
        //   .map(function(d) { return {key: d.key, count: d.values.length}; });
        // data.push({key: 7, count: sumOver7});
        var sumOver7 = d3.sum(
          data.filter(function(d) { return d.key >= 7; })
          .map(function(d) { return d.relative; })
        )
        data = data
          .filter(function(d) { return d.key < 7; })
          .map(function(d) { return {key: d.key, relative: d.relative}; });
        data.push({key: 7, relative: sumOver7});
        return data;
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
              // return x(d.value.householdCount); })
              return x(d.relative); })
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
      _wasElapsed = null,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _listeners = d3.dispatch("browsing");

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
        // EXIT - ENTER - UPDATE PATTERN - CIRCLES
        var circles =  _gCircles.selectAll("circle")
          .data(data);
        circles.exit().remove();
        circles.enter().append("circle");
        circles
            .classed("hidden", function(d) {
              return (d.hidden) ? true:false;
            })
            .classed("elapsed", function(d) {
              var page = elapsed.page,
                  chapter = elapsed.chapter;
              return (+(d.page + d.chapter) <= (10 * page + chapter)) ?
                true : false;
            })
            .attr("cx", function(d) {
              return x(d.time); })
            .attr("cy", 0)
            .attr("r", function(d) { return (d.isMain) ? 6:3; })
            .on("mouseover", function(d) {
                var _wasElapsed = d3.select(this).classed("elapsed"),
                    radius = (d.isMain) ? 8 : 5;
                d3.select(this)
                .transition(100)
                .attr("r", radius);
            })
            .on("mouseout", function(d) {
                var _isElapsed = d3.select(this).classed("elapsed"),
                    radius = (d.isMain) ? 6 : 3;

                d3.select(this)
                .classed("elapsed", _wasElapsed || _isElapsed)
                .transition(100)
                .attr("r", radius);
            })
            .on("click", function(d) {
              d3.select(this).classed("elapsed", true)
              _listeners.browsing({page: +d.page, chapter: +d.chapter});
            });

        // EXIT - ENTER - UPDATE PATTERN - Ticks
        var lines =  _gTicks.selectAll("line")
          .data(data.filter(function(d) { return d.isMain === true; }));
        lines.exit().remove();
        lines.enter().append("line");
        lines
            .attr("x1", function(d) { return x(d.time); })
            .attr("y1", function(d,i) {
              return (i%2 == 0) ? 14 : -14;
            })
            .attr("x2", function(d) { return x(d.time); })
            .attr("y2", function(d,i) {
              return (i%2 == 0) ? 10 : -10;
            });


        // EXIT - ENTER - UPDATE PATTERN - Labels
        var labels =  _gLabels.selectAll("text")
          .data(data.filter(function(d) { return d.isMain === true; }));
        labels.exit().remove();
        labels.enter().append("text");
        labels
            .text(function(d) { return d.title})
            .attr("text-anchor", "middle")
            .attr("x", function(d) { return x(d.time); })
            .attr("y", function(d,i) {
              return (i%2 == 0) ? 24 : -18;
            })
            .classed("elapsed", function(d) {
              var page = elapsed.page,
                  chapter = elapsed.chapter;
              // return (+(d.page + d.chapter) <= (10 * page + chapter)) ?
              return (d.page == page) ?
                true : false;
            })

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

        _gTicks = g.append("g")
            .attr("class", "ticks");

        _gLabels = g.append("g")
            .attr("class", "labels");

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
/* CREATE MULTI SERIES TIME LINE CHART INSTANCE*/
d3.multiSeriesTimeLine = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      relativeTo = null,
      lookUp = null,
      color = null,
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      elasticY = false,
      xDomain = null,
      xAxis = d3.svg.axis().orient("bottom"),
      // yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      yAxis = d3.svg.axis().orient("left").ticks(5),
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
      highlighted = [];

  var _gWidth = 400,
      _gHeight = 100,
      _hasLegend = false,
      _handlesWidth = 9,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _gLegend,
      _gItems,
      _line,
      _previousData,
      _voronoi = null,
      _gVoronoi = null,
      _listeners = d3.dispatch("highlighted");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;

    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      data.forEach(function(d) {
        d.valueId = d.value.map(function(v) {
          return v.count; }).join("-"); });


      x.domain(getXDomain());
      y.domain([0, _getMaxY(data)]);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      _gYAxis.transition().call(yAxis);


      d3.selectAll(".time-line .x.axis text")
        .data(["June", "August", "November"])
        .text(function(d) { return d; });

      if (!isDataEmpty()) _render();

      function _render() {
        // container
        var item = _gItems.selectAll(".item")
            .data(data, function(d) {
              return d.key;
            });
        item.enter()
            .append("g")
            .attr("class", "item");
        item.exit().remove();

        // lines
        var line = item.selectAll(".line")
          .data(function(d) { return [d];}, function(d) { return d.valueId; });

        line.enter().append("path").attr("class", "line");

        line.exit().remove();

        line
          .style("stroke", function(d) {
            return color(d.key); })
          .classed("highlighted", function(d) {
            // console.log(highlighted);
            if (highlighted.length == 0) {
              _clearFigures();
              return false;
            }

            if (highlighted.indexOf(d.key) !== -1) {
              _setFigures(d);
              this.parentNode.parentNode.appendChild(this.parentNode);
              return true;
            } else {
              // _clearFigures();
              return false;
            }
          })
          .classed("not-highlighted", function(d) {
            if (highlighted.length == 0) return false;
            return (highlighted.indexOf(d.key) === -1) ?
              true : false;
          })
          .transition()
          .attr("d", function(d) {
            return _line(d.value);
          });

        // circles
        var circles = item.selectAll(".points")
          .data(function(d){ return d.value});

        circles.enter().append("circle").attr("class", "points");

        circles.exit().remove();

        circles
          .classed("highlighted", function(d) {
            var key = d3.select(this).node().parentNode.__data__.key;
            if (highlighted.length > 0 && highlighted.indexOf(key) !== -1) {
              this.parentNode.parentNode.appendChild(this.parentNode);
              return true;
            } else {
              return false;
            }
          })
          .classed("not-highlighted", function() {
            var key = d3.select(this).node().parentNode.__data__.key;
            return (highlighted.length > 0 && highlighted.indexOf(key) === -1) ?
              true : false;
          })
          .style("fill", function(d) {
            var parent = d3.select(this).node().parentNode.__data__;
            return color(parent.key); })
          .attr("r", function(d) {
            return 3})
            .attr("cx", function(d) {
              return x(d.round); })
          .transition()
          .attr("cy", function(d) {
            return y(toPercentage(d.count)); });


        var legend = _gLegend.selectAll(".legend")
          .data(getSortedKeys(), function(d) { return d.key; });

        legend.enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
          .on("mouseover", function(d) {
            if (highlighted && highlighted[0] !== d.key) {
              _listeners.highlighted([d.key]);
            }
          })
          .on("mouseout", function(d) {
            _listeners.highlighted([]);
          });

        legend.exit().remove();

        legend
          .classed("highlighted", function(d) {
            if (highlighted.length == 0) return false;
            return (highlighted.indexOf(d.key) !== -1) ? true : false;
          })
          .classed("not-highlighted", function(d) {
            return (highlighted.length > 0 && highlighted.indexOf(d.key) === -1) ?
              true : false;
          })
          .transition()
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        if (!_hasLegend) {
          legend.append("text")
              .attr("x", _gWidth + 50 + 30)
              .attr("y", 0)
              .attr("dy", "0.3em")
              .style("text-anchor", "start")
              .text(function(d) { return lookUp[d.key] ; });

          legend.append("line")
              .attr("x1", _gWidth + 50)
              .attr("x2", _gWidth + 75)
              .attr("y1", 0)
              .attr("y2", 0)
              .style("stroke", function(d) { return color(d.key); });

          legend.append("circle")
              .attr("cx", _gWidth + 63)
              .attr("cy", 0)
              .attr("r", 3)
              .style("fill", function(d) { return color(d.key); });

          _hasLegend = true;
        }


        // voronois
        var _dataVoronoi = [];
        data.forEach(function(d) {
          d.value.forEach(function(v) {
            _dataVoronoi.push({key: d.key, count: v.count, round: v.round}); });
        });

        if(_hasDataChanged()) {
          _gVoronoi.selectAll("path").remove();

        _gVoronoi.selectAll("path")
            .data(_voronoi(_dataVoronoi))
          .enter().append("path")
            .attr("d", function(d) {
              if (typeof(d) !== "undefined") {
                return "M" + d.join("L") + "Z";
              }
            })
            .datum(function(d) {
              if (typeof(d) !== "undefined") {
                return d.point;
              }
            })
            .on("mouseover", function(d) {
              _listeners.highlighted([d.key]);
            })
            .on("mouseout", function(d) {
              _listeners.highlighted([]);
            });
        }

        _previousData = data
          .sort(function(a,b) { return a.key - b.key; })
          .map(function(d) { return d.valueId; }).slice();
      }

      function _setFigures(feature) {
        feature.value.forEach(function(d) {
          _gFigures.append("text")
            .attr("x", function() { return x(d.round); } )
            .attr("y", function() { return y(toPercentage(d.count)); } )
            .attr("dy", -8)
            .attr("text-anchor", "middle")
            .text(toPercentage(d.count) + "%")
        })
      }

      function _clearFigures() {
        _gFigures.selectAll("text").remove();
      }

      function _getMaxY() {
        return d3.max(
          _.flatten(data.map(function(d) { return d.valueId.split("-"); })),
          function(d) { return toPercentage(+d); });
      }

      function _isHighlighted() {
        return (highlighted.length === 0) ? false : true;
      }

      function _hasDataChanged() {
        if (!_previousData) return true;
        // var previous = _previousData
        //   .sort(function(a,b) { return a.key - b.key; })
        //   .map(function(d) { return d.valueId; })

        var current = data
          .sort(function(a,b) { return a.key - b.key; })
          .map(function(d) { return d.valueId; });

        var diff = _.difference(_previousData, current);

        return (diff.length == 0) ? false : true;
      }

      function _skeleton() {
        // set scales range
        x.rangePoints([0 , _gWidth], 0.3);
        y.range([_gHeight, 0]);

        // set axis
        xAxis.scale(x);
        yAxis.scale(y).tickFormat(function(d) { return d + "%"; });

        _line = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { return x(d.round); })
          .y(function(d) { return y(toPercentage(d.count)); });

        // create chart container
        g = div.append("svg")
            .classed("time-line", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gItems = g.append("g").attr("class", "items");

        _gFigures = g.append("g").attr("class", "figures");

        // Voronoi polygons for tooltips
        _voronoi = d3.geom.voronoi()
          .x(function(d) { return x(d.round); })
          .y(function(d) { return y(toPercentage(d.count)); })
          // .clipExtent(null);
          .clipExtent([[0, 0], [_gWidth, _gHeight]]);

        _gVoronoi = g.append("g").attr("class", "voronoi");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _gHeight + ")")
            .call(xAxis);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var deltaX = d3.selectAll(".time-line .x.axis path.domain")
          .attr("d").split("H")[1].split("V")[0];

        g.append("text")
          .attr("class", "x title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", _gHeight + 40)
          .text(xTitle);

        g.append("text")
          .attr("class", "main title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", -30)
          .text(title);

        _gLegend = g.append("g").attr("class", "legends");

      }

      function getSortedKeys() { // based on count at round 3
        var keyCount = data.map(function(d) {
          return {
            key: d.key,
            count: d.value.filter(function(v) { return v.round == 3; })[0].count
          };
        });

        return keyCount.sort(function(a,b) { return b.count - a.count;});
      }

      function isDataEmpty() {
        var length = data.filter(function(d) {return d.valueId != "0-0-0"}).length;
        return (length == 0) ? true : false;
      }

      function getXDomain() {
         return data[0].value.map(function(d) { return d.round; });
      }

      function getYExtent() {
        var values = [];
        data.forEach(function(d) {
          values = values.concat(d.value.map(function(v) {
            return v.count; })) });
        return d3.extent(values.map(function(d) { return toPercentage(d); }));
      }

      function toPercentage(val) {
        return Math.round((val/relativeTo)*100);
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
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
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
  chart.lookUp = function(_) {
    if (!arguments.length) return lookUp;
    lookUp = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

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
  chart.highlighted = function(_) {
    if (!arguments.length) return highlighted;
    highlighted = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
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
/* CREATE MULTI SERIES TIME LINE CHART INSTANCE*/
d3.multiSeriesTimeLineAlt = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      relativeTo = null,
      lookUp = null,
      color = null,
      x = d3.scale.linear(),
      y = d3.scale.ordinal(),
      elasticY = false,
      yDomain = [],
      xDomain = null,
      xAxis = d3.svg.axis().orient("bottom").ticks(5),
      // yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      yAxis = d3.svg.axis().orient("left"),
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
      highlighted = [];

  var _gWidth = 400,
      _gHeight = 100,
      _hasLegend = false,
      _handlesWidth = 9,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _gLegend,
      _gItems,
      _line,
      _previousData,
      _voronoi = null,
      _gVoronoi = null,
      _listeners = d3.dispatch("highlighted");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;

    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      data.forEach(function(d) {
        d.valueId = d.value.map(function(v) {
          return v.count; }).join("-"); });


      // x.domain(getXDomain());
      x.domain([0, _getMaxX(data)]);
      // y.domain([0, _getMaxY(data)]);
      // y.domain(getYDomain());
      // y.domain([1,2,4,3,9,10,7,5,6,8,11,13,12,97]);
      y.domain(yDomain);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      _gYAxis.transition().call(yAxis);

      if (!isDataEmpty()) _render();
      
      d3.selectAll(".time-line .legends text")
      .data(["June", "August", "November"])
      .text(function(d) { return d; });

      d3.selectAll(".time-line .y.axis text")
      .data(y.domain().map(function(d) { return lookUp[d]; }))
      .text(function(d) { return d; });


      function _render() {
        // container
        var item = _gItems.selectAll(".item")
            .data(data, function(d) {
              return d.key;
            });
        item.enter()
            .append("g")
            .attr("class", "item");
        item.exit().remove();

        // lines
        var line = item.selectAll(".line")
          .data(function(d) { return [d];}, function(d) { return d.valueId; });

        line.enter().append("path").attr("class", "line");

        line.exit().remove();

        line
          .style("stroke", function(d) {
            return color(d.key); })
          .classed("highlighted", function(d) {
            // console.log(highlighted);
            if (highlighted.length == 0) {
              _clearFigures();
              return false;
            }

            if (highlighted.indexOf(d.key) !== -1) {
              _setFigures(d);
              this.parentNode.parentNode.appendChild(this.parentNode);
              return true;
            } else {
              // _clearFigures();
              return false;
            }
          })
          .classed("not-highlighted", function(d) {
            if (highlighted.length == 0) return false;
            return (highlighted.indexOf(d.key) === -1) ?
              true : false;
          })
          .transition()
          .attr("d", function(d) {
            var reordered = [];
            y.domain().forEach(function(v) {
              reordered.push(  d.value.filter(function(f) { return f.category === v})[0])
            })
            // return _line(d.value);
            return _line(reordered);
          });

        // circles
        var circles = item.selectAll(".points")
          .data(function(d){ return d.value});

        circles.enter().append("circle").attr("class", "points");

        circles.exit().remove();

        circles
          .classed("highlighted", function(d) {
            var key = d3.select(this).node().parentNode.__data__.key;
            if (highlighted.length > 0 && highlighted.indexOf(key) !== -1) {
              this.parentNode.parentNode.appendChild(this.parentNode);
              return true;
            } else {
              return false;
            }
          })
          .classed("not-highlighted", function() {
            var key = d3.select(this).node().parentNode.__data__.key;
            return (highlighted.length > 0 && highlighted.indexOf(key) === -1) ?
              true : false;
          })
          .style("fill", function(d) {
            var parent = d3.select(this).node().parentNode.__data__;
            return color(parent.key); })
          .attr("r", function(d) {
            return 2.5})
          .transition()
          .attr("cx", function(d) {
            // return x(d.round); })
            return x(toPercentage(d.count)); })
          .attr("cy", function(d) {
            // return y(toPercentage(d.count)); });
            return y(d.category); });


        var legend = _gLegend.selectAll(".legend")
          // .data(getSortedKeys(), function(d) { return d.key; });
          // .data(getSortedKeys(), function(d) { return d.key; });
          .data(color.domain());

        legend.enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
          .on("mouseover", function(d) {
            // if (highlighted && highlighted[0] !== d.key) {
              _listeners.highlighted([d.key]);
            if (highlighted && highlighted[0] !== d) {
              _listeners.highlighted([d]);
            }
          })
          .on("mouseout", function(d) {
            _listeners.highlighted([]);
          });

        legend.exit().remove();

        legend
          .classed("highlighted", function(d) {
            if (highlighted.length == 0) return false;
            // return (highlighted.indexOf(d.key) !== -1) ? true : false;
            return (highlighted.indexOf(d) !== -1) ? true : false;
          })
          .classed("not-highlighted", function(d) {
            // return (highlighted.length > 0 && highlighted.indexOf(d.key) === -1) ?
            return (highlighted.length > 0 && highlighted.indexOf(d) === -1) ?
              true : false;
          })
          .transition()
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        if (!_hasLegend) {
          legend.append("text")
              .attr("x", _gWidth + 50 + 30)
              .attr("y", 0)
              .attr("dy", "0.3em")
              .style("text-anchor", "start")
              // .text(function(d) { return lookUp[d.key] ; });
              .text(function(d) { return d ; });

          legend.append("line")
              .attr("x1", _gWidth + 50)
              .attr("x2", _gWidth + 75)
              .attr("y1", 0)
              .attr("y2", 0)
              .style("stroke", function(d) { return color(d); });
              // .style("stroke", function(d) { return color(d.key); });

          legend.append("circle")
              .attr("cx", _gWidth + 63)
              .attr("cy", 0)
              .attr("r", 2.5)
              // .style("fill", function(d) { return color(d.key); });
              .style("fill", function(d) { return color(d); });

          _hasLegend = true;
        }


        // voronois
        var _dataVoronoi = [];
        data.forEach(function(d) {
          d.value.forEach(function(v) {
            // _dataVoronoi.push({key: d.key, count: v.count, round: v.round}); });
            _dataVoronoi.push({key: d.key, count: v.count, category: v.category}); });
        });

        if(_hasDataChanged()) {
          _gVoronoi.selectAll("path").remove();

        _gVoronoi.selectAll("path")
            .data(_voronoi(_dataVoronoi))
          .enter().append("path")
            .attr("d", function(d) {
              if (typeof(d) !== "undefined") {
                return "M" + d.join("L") + "Z";
              }
            })
            .datum(function(d) {
              if (typeof(d) !== "undefined") {
                return d.point;
              }
            })
            .on("mouseover", function(d) {
              _listeners.highlighted([d.key]);
            })
            .on("mouseout", function(d) {
              _listeners.highlighted([]);
            });
        }

        _previousData = data
          .sort(function(a,b) { return a.key - b.key; })
          .map(function(d) { return d.valueId; }).slice();
      }

      function _setFigures(feature) {
        feature.value.forEach(function(d) {
          _gFigures.append("text")
            // .attr("x", function() { return x(d.round); } )
            // .attr("y", function() { return y(toPercentage(d.count)); } )
            .attr("x", function() { return x(toPercentage(d.count)); } )
            .attr("y", function() { return y(d.category); } )
            // .attr("dy", -8)
            .attr("dy", 4)
            .attr("dx", 25)
            .attr("text-anchor", "middle")
            .text(toPercentage(d.count) + "%")
        })
      }

      function _clearFigures() {
        _gFigures.selectAll("text").remove();
      }

      // function _getMaxY() {
      //   return d3.max(
      //     _.flatten(data.map(function(d) { return d.valueId.split("-"); })),
      //     function(d) { return toPercentage(+d); });
      // }

      function _getMaxX() {
        return d3.max(
          _.flatten(data.map(function(d) { return d.valueId.split("-"); })),
          function(d) { return toPercentage(+d); });
      }

      function _isHighlighted() {
        return (highlighted.length === 0) ? false : true;
      }

      function _hasDataChanged() {
        if (!_previousData) return true;
        // var previous = _previousData
        //   .sort(function(a,b) { return a.key - b.key; })
        //   .map(function(d) { return d.valueId; })

        var current = data
          .sort(function(a,b) { return a.key - b.key; })
          .map(function(d) { return d.valueId; });

        var diff = _.difference(_previousData, current);

        return (diff.length == 0) ? false : true;
      }

      function _skeleton() {
        // set scales range
        // x.rangePoints([0 , _gWidth], 0.3);
        // y.range([_gHeight, 0]);
        x.range([0, _gWidth]);
        y.rangePoints([0 , _gHeight], 0.3);

        // set axis
        // xAxis.scale(x);
        // yAxis.scale(y).tickFormat(function(d) { return d + "%"; });
        xAxis.scale(x).tickFormat(function(d) { return d + "%"; });
        yAxis.scale(y);

        _line = d3.svg.line()
          // .interpolate("linear")
          .interpolate("cardinal")
          // .x(function(d) { return x(d.round); })
          .x(function(d) { return x(toPercentage(d.count)); })
          .y(function(d) { return y(d.category); });

        // create chart container
        g = div.append("svg")
            .classed("time-line", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gItems = g.append("g").attr("class", "items");

        _gFigures = g.append("g").attr("class", "figures");

        // Voronoi polygons for tooltips
        _voronoi = d3.geom.voronoi()
          // .x(function(d) { return x(d.round); })
          // .y(function(d) { return y(toPercentage(d.count)); })
          .y(function(d) { return y(d.category); })
          .x(function(d) { return x(toPercentage(d.count)); })
          // .clipExtent(null);
          .clipExtent([[0, 0], [_gWidth, _gHeight]]);

        _gVoronoi = g.append("g").attr("class", "voronoi");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _gHeight + ")")
            .call(xAxis);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var deltaX = d3.selectAll(".time-line .x.axis path.domain")
          .attr("d").split("H")[1].split("V")[0];

        g.append("text")
          .attr("class", "x title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", _gHeight + 40)
          .text(xTitle);

        g.append("text")
          .attr("class", "main title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", -30)
          .text(title);

        _gLegend = g.append("g").attr("class", "legends");

      }

      function getSortedKeys() { // based on count at round 3
        var keyCount = data.map(function(d) {
          return {
            key: d.key,
            count: d.value.filter(function(v) { return v.round == 3; })[0].count
          };
        });

        return keyCount.sort(function(a,b) { return b.count - a.count;});
      }

      function isDataEmpty() {
        // var length = data.filter(function(d) {return d.valueId != "0-0-0"}).length;
        // to be refactored asap please !

        var allSum = d3.sum(
          _.flatten(data.map(function(d) { return d.valueId.split("-"); }))
          .map(function(d) { return +d; }));

        // var length = data.filter(function(d) {return d.valueId != "0-0-0-0-0-0-0-0-0-0-0-0-0-0"}).length;
        // return (length == 0) ? true : false;

        return (allSum == 0) ? true : false;
      }

      // function getXDomain() {
      //    return data[0].value.map(function(d) { return d.round; });
      // }

      function getYDomain() {
        // return data[0].value.map(function(d) {
        //   return d.category; }).sort(function(a,b) { return a-b; });

        return data[0].value.map(function(d) { return d.category; });
        //  return data[0].value.map(function(d) { return d.round; });
      }

      function getYExtent() {
        var values = [];
        data.forEach(function(d) {
          values = values.concat(d.value.map(function(v) {
            return v.count; })) });
        return d3.extent(values.map(function(d) { return toPercentage(d); }));
      }

      function toPercentage(val) {
        return Math.round((val/relativeTo)*100);
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
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
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
  chart.yDomain = function(_) {
    if (!arguments.length) return yDomain;
    yDomain = _;
    return chart;
  };

  chart.hasYAxis = function(_) {
    if (!arguments.length) return hasYAxis;
    hasYAxis = _;
    return chart;
  };
  chart.lookUp = function(_) {
    if (!arguments.length) return lookUp;
    lookUp = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

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
  chart.highlighted = function(_) {
    if (!arguments.length) return highlighted;
    highlighted = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
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
/* CREATE BAR CHART MULTI STACKED INSTANCE*/
d3.barChartMultiStacked = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      color,
      relativeTo = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      lookUp = null,
      barHeight = 7,
      barWidth = 11,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      // yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
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

      d3.selectAll(".bar-chart-multi-stacked .x.axis text")
        .data(["June", "August", "November"])
        .text(function(d) { return d; });

      if (!isDataEmpty()) _render();

      function _render() {

        // container
        var round = g.selectAll(".round")
            .data(data, function(d) { return d.joinId; });

        round.enter()
            .append("g")
            .attr("class", "round")
            .attr("transform", function(d) { return "translate(" + x(d.key) + ",0)"; });

        round.exit().remove();

        // rect
        var rect = round.selectAll("rect")
            .data(function(d) { return d.stacked; });

        rect.enter().append("rect");

        rect.exit().remove();

        rect
          .attr("width", x.rangeBand())
          .style("fill", function(d) {
            return color(d.name);
          })
          .transition()
          .attr("height", function(d) {
              return y(toPercentage(d.y0, d.key)) - y(toPercentage(d.y1, d.key)); })
          .attr("y", function(d) {
            return y(toPercentage(d.y1, d.key)); });

      }

      function _transformData(data) {
        data.forEach(function(d) {
            var y0 = 0;
            d.stacked = color.domain().map(function(name) {
              var bar = d.value.filter(function(v) { return v.category == name; })[0];
              return {key: d.key, name: bar.category, y0: y0, y1: y0 += bar.count}; });
            d.total = d.stacked[d.stacked.length - 1].y1;
          });

        data.forEach(function(d) {
          d.joinId = d.value.map(function(v) {
            return v.category + "-" + v.count; }).join("--"); });

        return data;
      }

      function _skeleton() {

        // set scales range and domains
        x.domain([1,2,3]);
        // x.rangePoints([0 , _gWidth]);

        // x.rangeRoundBands([0, _gWidth], .1);
        x.rangeRoundBands([0, _gWidth], .25);
        y.domain([0, 100]);
        y.range([_gHeight, 0]);

        yAxis.tickValues([25, 50, 75, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);
        xAxis.scale(x);

        // create chart container
        g = div.append("svg")
            .classed("bar-chart-multi-stacked", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (_gHeight + 3) + ")")
            .call(xAxis);

        // legend
        _gLegend = g.append("g").attr("class", "legends");

        var legend = _gLegend.selectAll(".legend")
            .data(color.domain().slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", _gWidth + 10)
            .attr("y", _gHeight / 5)
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", color);

        legend.append("text")
            .attr("x", _gWidth + 10 + 20)
            .attr("y", _gHeight / 5)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .text(function(d) { return lookUp[d] ; });

        var deltaX = d3.selectAll(".bar-chart-multi-stacked .x.axis path.domain")
          .attr("d").split("H")[1].split("V")[0];

        g.append("text")
          .attr("class", "x title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", _gHeight + 40)
          .text(xTitle);

        g.append("text")
          .attr("class", "main title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
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

      function isDataEmpty() {
        var countAll = 0;
        data.forEach( function(d) {
          countAll += d3.sum(d.joinId.split("--").map(function(v) { return +v.split("-")[1]; }));
        })
        return (countAll) ? false : true;
      }

      function toPercentage(val, round) {
        var denominator = (typeof(relativeTo) === "object") ?
          relativeTo[round] : relativeTo;
        return Math.round((val/denominator)*100);
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
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
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
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
    return chart;
  };
  chart.lookUp = function(_) {
    if (!arguments.length) return lookUp;
    lookUp = _;
    return chart;
  };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE BAR CHART MULTI STACKED INSTANCE*/
d3.heatmap = function() {
  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.scale.ordinal(),
      y = d3.scale.ordinal(),
      color,
      id = null,
      relativeTo = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      lookUp = null,
      hasNames = true,
      barHeight = 7,
      barWidth = 11,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      // yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      select = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _yCategories = null,
      _gCells,
      _gNames,
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
          // g = div.select(".heatmap #id-" + id + " g");
          g = div.select("g");

      id = "#" + d3.select(this).attr("id");

      data = _transformData(data);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      // if (select) {
      //   var selection = select;
      //   select = null;
      //   _listeners.filtered(selection);
      // }

      // d3.select(this).attr("id")

      d3.selectAll(id + " .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });

      if (!isDataEmpty()) _render();

      function _render() {
        // join
        var cells = _gCells.selectAll(".cell")
              .data(data, function(d) {
                return d.joinId; });

        // enter
        cells
          .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("width", x.rangeBand())
            .attr("height", y.rangeBand());

        // exit
        cells.exit().remove();

        // update
        cells
          .attr("x", function(d) {
            return x(d.round); })
          .attr("y", function(d) {
            return y(d.key); })
          .attr("fill", function(d) { return color(toPercentage(d.count)); });
      }

      function _transformData(data) {
        var flatData = [];

        if(!_yCategories) _yCategories = _.without(data.map(function(d) {
          return d.key; }).sort(function(a, b) { return a - b; }), 97);

        data.filter(function(d) { return d!== 97; }).forEach(function(d) {
          d.value.forEach(function(v) { return v.key = d.key });
          flatData.push(d.value);
        });

        flatData = _.flatten(flatData);
        flatData.forEach(function(d) { return d.joinId = _.values(d).join("-");});

        return flatData;
      }

      function _skeleton() {
        // set scales range and domains
        x.domain([1,2,3]);
        x.rangeBands([0, _gWidth]);

        y.domain(_yCategories);
        y.rangeBands([_gHeight, 0]);

        // yAxis.tickValues([25, 50, 75, 100]).tickFormat(function(d) { return d + " %"; });
        // yAxis.scale(y);
        xAxis.scale(x);

        // create chart container
        g = div
            .append("div").classed("heatmap", true)
            .append("svg")
            // .attr("id", "id-" + id)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        // g = div.append("svg")
        //     .classed("heatmap", true)
        //     .attr("id", "id-" + id)
        //     .attr("width", width)
        //     .attr("height", height)
        //   .append("g")
        //     .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gCells = g.append("g")
            .attr("class", "cells");

        // _gYAxis = g.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis);

        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (_gHeight + 3) + ")")
            .call(xAxis);

        // names
        if (hasNames) {
          _gNames = g.append("g")
              .attr("class", "names");

          _gNames.selectAll("name")
                .data(_yCategories)
              .enter()
                .append("text")
                .attr("x", _gWidth + 10)
                .attr("y", function(d) { return y(d); })
                .attr("dy", "1.1em")
                .style("text-anchor", "start")
                .text(function(d) { return lookUp[d] ; });
        }

        // legend
        // _gLegend = g.append("g").attr("class", "legends");

        // var legend = _gLegend.selectAll(".legend")
        //     .data(color.domain().slice().reverse())
        //   .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        //
        // legend.append("rect")
        //     .attr("x", _gWidth + 50)
        //     .attr("y", _gHeight / 5)
        //     .attr("width", 14)
        //     .attr("height", 14)
        //     .style("fill", color);
        //
        // legend.append("text")
        //     .attr("x", _gWidth + 50 + 20)
        //     .attr("y", _gHeight / 5)
        //     .attr("dy", "1em")
        //     .style("text-anchor", "start")
        //     .text(function(d) { return lookUp[d] ; });

        var deltaX = d3.select(id + " .x.axis path.domain")
          .attr("d").split("H")[1].split("V")[0];

        g.append("text")
          .attr("class", "x title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", _gHeight + 40)
          .text(xTitle);

        g.append("text")
          .attr("class", "main title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", -15)
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

      function isDataEmpty() {
        return (d3.sum(data.map(function(d) { return d.count; }))) ? false : true;
      }

      function toPercentage(val) {
        return Math.round((val/relativeTo)*100);
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
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
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
  chart.hasNames = function(_) {
    if (!arguments.length) return hasNames;
    hasNames = _;
    return chart;
  };
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
    return chart;
  };
  chart.id = function(_) {
    if (!arguments.length) return id;
    id = _;
    return chart;
  };
  chart.lookUp = function(_) {
    if (!arguments.length) return lookUp;
    lookUp = _;
    return chart;
  };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE BAR CHART MULTI STACKED INSTANCE*/
d3.heatmapLegend = function() {
  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      color,
      id = null,
      relativeTo = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      lookUp = null,
      hasNames = true,
      barHeight = 7,
      barWidth = 11,
      xAxis = d3.svg.axis().orient("bottom"),
      // yAxis = d3.svg.axis().orient("right").tickValues([0, 25, 50, 75, 100]),
      yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      // yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      select = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _yCategories = null,
      _gCells,
      _gNames,
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

      id = "#" + d3.select(this).attr("id");

      // data = _transformData(data);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      // if (select) {
      //   var selection = select;
      //   select = null;
      //   _listeners.filtered(selection);
      // }

      // d3.select(this).attr("id")

      d3.selectAll(id + " .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });

      // if (!isDataEmpty()) _render();
      _render();

      function _render() {
        var cellHeight = y(0) - y(10);
        _gCells.selectAll(".hot")
            .data(data.hot)
            .enter()
          .append("rect")
            .attr("class", "hot")
            .attr("width", x.rangeBand())
            .attr("height", cellHeight)
            .attr("x", function(d) {
                return x(1); })
            .attr("y", function(d, i) {
                return y(i*10) - cellHeight; })
            .attr("fill", function(d) { return d});

        _gCells.selectAll(".cold")
            .data(data.cold)
            .enter()
          .append("rect")
            .attr("class", "cold")
            .attr("width", x.rangeBand())
            .attr("height", cellHeight)
            .attr("x", function(d) {
                return x(2); })
            .attr("y", function(d, i) {
                return y(i*10) - cellHeight; })
            .attr("fill", function(d) { return d});
        // // join
        // var cells = _gCells.selectAll(".cell")
        //       .data(data);
        //
        // // enter
        // cells
        //   .enter()
        //     .append("rect")
        //     .attr("class", "cell");
        //     // .attr("width", x.rangeBand())
        //     // .attr("height", y.rangeBand());
        //
        // // exit
        // cells.exit().remove();
        //
        // // update
        // cells
        //   .attr("x", function(d) {
        //     return x(d.round); })
        //   .attr("y", function(d) {
        //     return y(d.key); })
        //   .attr("fill", function(d) { return color(toPercentage(d.count)); });
      }

      // function _transformData(data) {
      //   var flatData = [];
      //
      //   if(!_yCategories) _yCategories = _.without(data.map(function(d) {
      //     return d.key; }).sort(function(a, b) { return a - b; }), 97);
      //
      //   data.filter(function(d) { return d!== 97; }).forEach(function(d) {
      //     d.value.forEach(function(v) { return v.key = d.key });
      //     flatData.push(d.value);
      //   });
      //
      //   flatData = _.flatten(flatData);
      //   flatData.forEach(function(d) { return d.joinId = _.values(d).join("-");});
      //
      //   return flatData;
      // }

      function _skeleton() {
        // set scales range and domains
        x.domain([1,2]);
        x.rangeBands([0, _gWidth], 0.15);

        y.domain([0, 100]);
        y.range([_gHeight, 0]);

        yAxis.tickValues([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);
        // xAxis.scale(x);

        // create chart container
        g = div
            .append("div").classed("heatmap", true)
            .append("svg")
            // .attr("id", "id-" + id)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        // g = div.append("svg")
        //     .classed("heatmap", true)
        //     .attr("id", "id-" + id)
        //     .attr("width", width)
        //     .attr("height", height)
        //   .append("g")
        //     .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gCells = g.append("g")
            .attr("class", "cells");

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            // .attr("transform", "translate(63,0)")
            .attr("transform", "translate(0,0)")
            .call(yAxis);

        g.append("text")
          .attr("class", "main title")
          .attr("text-anchor", "middle")
          .attr("x", 5)
          .attr("y", -15)
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

      function isDataEmpty() {
        return (d3.sum(data.map(function(d) { return d.count; }))) ? false : true;
      }

      function toPercentage(val) {
        return Math.round((val/relativeTo)*100);
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
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
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
  chart.hasNames = function(_) {
    if (!arguments.length) return hasNames;
    hasNames = _;
    return chart;
  };
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
    return chart;
  };
  chart.id = function(_) {
    if (!arguments.length) return id;
    id = _;
    return chart;
  };
  chart.lookUp = function(_) {
    if (!arguments.length) return lookUp;
    lookUp = _;
    return chart;
  };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
/* CREATE BAR CHART INSTANCE*/
d3.barChartEducation = function() {
  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      elasticY = false,
      xDomain = null,
      title = "",
      xTitle = "",
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
      _gFigures,
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

      data = _transformData(data);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      d3.selectAll("#main-chart .x.axis text")
        .data(["June", "August", "November"])
        .text(function(d) { return d; });

      if (!isDataEmpty()) _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN - BARS
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.joinId; });
        rects.exit().remove();
        rects.enter().append("rect");
        rects
            // .transition()
            .attr("x", function(d) {
              return x(d.key) })
            .attr("width", x.rangeBand())
            .transition()
            .attr("y", function(d) {
              return y(d.rate)  })
            .attr("height", function(d) {
              return _gHeight - y(d.rate); });

        // EXIT - ENTER - UPDATE PATTERN - FIGURES
        var figures =  _gFigures.selectAll("text")
          .data(data, function(d) { return d.joinId; });
        figures.exit().remove();
        figures.enter().append("text");
        figures
            .attr("text-anchor", "middle")
            .text(function(d) {
              return d.rate + "%"})
            .attr("x", function(d) {
              return x(d.key) + x.rangeBand() / 2 })
            .transition()
            .attr("y", function(d) {
              return y(d.rate) - 10  });
      }

      function _transformData(data) {
        data.forEach(function(d) {
          var attended = d.value.filter(function(v) {
            return v.category == 1; })[0].count;

          var notAttended = d.value.filter(function(v) {
            return v.category == 2; })[0].count;
          d.rate = Math.ceil((attended/(attended+notAttended))*100);
        });
        data.forEach(function(d) { d.joinId = [d.key, d.rate].join("-"); });
        return data;
      }

      function isDataEmpty() {
        var countAll = [];
        data.forEach(function(d) {
          countAll.push(d3.sum(d.value.map(function(v) { return v.count; }))) });
        countAll = d3.sum(countAll);
        return (countAll) ? false : true;
      }

      function _skeleton() {
        x.domain([1,2,3]);
        x.rangeRoundBands([0, _gWidth], .4);
        y.domain([0, 100]);
        y.range([_gHeight, 0]);

        yAxis.tickValues([25, 50, 75, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);
        xAxis.scale(x);

        // create chart container
        g = div.append("svg")
            .classed("bar-chart-education", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        _gFigures = g.append("g")
            .attr("class", "figures");

        // _gYAxis = g.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis);

        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (_gHeight + 3) + ")")
            .call(xAxis);

        var deltaX = d3.selectAll(".bar-chart-education .x.axis path.domain")
          .attr("d").split("H")[1].split("V")[0];

        g.append("text")
          .attr("class", "x title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", _gHeight + 40)
          .text(xTitle);

        g.append("text")
          .attr("class", "main title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", -30)
          .text(title);
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
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
    return chart;
  };
  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
// Underscore Templates
Vis.Templates["main-text"] =[
  "<p>On average, 55,000 children from 15000 families were given 20 JD <br> (28 USD) per child per month to <strong>cover the basic needs of children</strong>.</p>",
  "<p>In June, August, and November 2015, <strong>an independent third party monitoring</strong> used surveys and focus groups to <strong>ask 500 families</strong> benefitting from the programme how they were managing the crisis they find themselves in. These families represented ...</p>",
  "<p>Given that Syrian refugees are not allowed to work, they report a <strong>heavy dependence on cash assistance and food vouchers provided by UNICEF, UNHCR, and WFP</strong>. Even when assistance is cut back—as was the case when WFP cut its food vouchers in August 2015, it represents a significant part of refugee resources.</p>",
  "<p>Over the course of the survey, <strong>men as an economic contributors to the family plummeted</strong>.  For the most part, this is not made up for by any other member of the family, but refugees did report a slight increase in children under 16 working.</p>",
  "<p>While some expenditures varied seasonally, <strong>over the course of the ten months the main expenditure items remained consistent</strong>. Refugees were unable to decrease the costs of their highest expenses: rent,utilities, food, communications and education.  Although we know that 66% of refugees have debt, we see that over time refugees are less able to pay down their debt, and less able to save.</p>",
  "<p><strong>Transportation to school and education expenses are the two biggest expenses related to children</strong>, followed by children’s clothes and shoes; and children’s medicine. For families with four children or more, more money is spent on education, fresh foods and medicine.  This indicates that bigger families are able to more effectively share resources among their children, cutting costs in areas like clothes and shoes.</p>",
  "<p>For the most part, <strong>families report that the amount of the grant was not able to change their reliance on most negative coping mechanisms</strong>.</p>",
  "<p>Despite this, families reported that they were <strong>able to increase spending on basic needs for children and increase their wellbeing and living conditions</strong>. This, in turn, positively impacted their psychological wellbeing.</p>",
  "<p>Children also <strong>entered school in progressively higher numbers</strong> over the course of the ten months.</p>",
  "<p>Families also told us that <strong>children felt empowered</strong> because they knew the grant was for their needs.</p>",
  "<p><strong>UNICEF’s Child Cash Grant</strong> contributed towards increased levels of family expenditure on child-specific needs and therefore, <strong>toward meeting the basic needs of their children</strong>. <br><br>  UNICEF is proud to continue to provide refugees with the cash assistance they need to support their children through 2016.</p>",
  "<p><strong>Over 630,000 Syrian are officially registered as refugees in Jordan.</strong></p>",
  "<p><strong>Many of these families have lost everything they own</strong>, have depleted their savings, and, often, their ability to borrow money.</p>",
  "<p><strong>In such scenarios, it is often children who suffer most</strong>.<br> Years of education lost, malnutrition or health problems in the early years. These can have life-long negative repercussions.</p>",
  "<p><strong>To help cover basic needs of children</strong>, starting in February 2015, <strong>UNICEF has transferred a monthly child cash grant</strong> to the most vulnerable Syrian families living in host communities in Jordan.</p>",
  "<p>Families consistently reported being <strong>able to cover expenses for children that were not a priority before</strong> received the UNICEF child cash grant and this increased over time.</p>"
];

Vis.Templates["sub-text"] =[
  "<p>The assistance was intended to increase spending on child-specific needs and prevent families from adopting negative coping strategies that have a detrimental impact on child wellbeing, such as drastically reducing food consumption, reducing expenditure on essential healthcare and education, withdrawing children from school, and resorting to child labour.</p>",
  "<p>Enrolment levels have increased 4 percentage points over the three waves of data collection, ending at the highest level of 83% of school-aged children enrolled in education of some form.</p>",
  "<p>The data shows continued reduction int the reporting of income through paid labour over the life time of the project, standing at only 8% of families at the final point of data collection.</p>",
  "<p>[placeholder] Secondary text to be filled ... </p>",
  "<p>All negative coping strategies examined by this survey showed an increase in adoption over time, with the exceptions of depleting savings, borrowing money and selling WFP vouchers.</p>",
  "<p>The most commonly reported ways in which families feel this improvement have remained consistent throughout: increased ability to pay the rent, give small allowances to children for school, and to buy children essential clothing and shoes.</p>",
  "<p>Children in this dataset have shown consistently high knowledge regarding the CCG and high levels of participation with caregivers in determining needs and allocating funds. In FGDs caregivers have reported feelings of increased empowerment in their children, as well as themselves due to their ability to meet some of their children’s needs.</p>",
  "<p>[placeholder] sample characteristics relate secondary text if any required - not sure</p>",
  "<p>[placeholder] Variation on education: several intersecting factors influencing the results ...</p>"
];

Vis.Templates["quote"] =[
  "",
  "<p><i class='fa fa-quote-left fa-4'></i>Even if my husband wants to work, he is so scared to do so as he will get deported <i class='fa fa-quote-right fa-4'></p>"
];

Vis.Templates["quote-ref"] =[
  "Focus Group Discussion 1, P8",
  "Focus Group Discussion 5, P1",
  "Focus Group Discussion 6, P5",
  "Focus Group Discussion 6, P5",
  "Focus Group Discussion 6, P5",
  "Focus Group Discussion 6, P5",
  "Focus Group Discussion 6, P5",
  "[placeholder]"
];

Vis.Templates["living-conditions"] =
  "<div id='living-conditions' class='row'>" +
  "  <div id='basic-needs' class='col-md-6'></div>" +
  "  <div id='improvement' class='col-md-6'></div>" +
  " </div>";

Vis.Templates["background-sample"] =
  "<div id='background-sample' class='row'>" +
  "  <div id='age' class='col-md-4'></div>" +
  "  <div id='gender' class='col-md-4'></div>" +
  "  <div id='poverty' class='col-md-4'></div>" +
  " </div>";

Vis.Templates["coping-mechanisms"] =
  "<div id='coping-mechanisms' class='row'>" +
  "  <div id='heatmap-legends' class='col-md-2'></div>" +
  "  <div id='current' class='col-md-4'></div>" +
  "  <div id='stopped' class='col-md-6'></div>" +
  " </div>";
