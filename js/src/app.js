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
