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

    if (this.get("scenario").page === 7) { // if children education page
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
