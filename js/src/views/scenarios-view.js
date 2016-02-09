// Scenarios
Vis.Views.Scenarios = Backbone.View.extend({
    el: '#scenarios',
    hasProfileViews: false,
    currentPage: null,

    initialize: function () {
      this.model.on("change:initialized change:scenario", function() {
        // ensure that data is ready and scenario available
        if (this.model.get("initialized") && this.model.get("scenario")) this.render();
        },this);
    },

    render: function() {
      var scenario = this.model.get("scenario"),
          page = +scenario.page,
          chapter = +scenario.chapter;

      // create profile charts first time only
      if(!this.hasProfilesViews) {
        new Vis.Views.HouseholdsChildren({model: Vis.Models.app});
        new Vis.Views.ChildrenAge({model: Vis.Models.app});
        new Vis.Views.HouseholdsLocation({model: Vis.Models.app});
        new Vis.Views.HouseholdsPoverty({model: Vis.Models.app});
        new Vis.Views.HouseholdsHead({model: Vis.Models.app});
        new Vis.Views.ChildrenGender({model: Vis.Models.app});
        this.hasProfilesViews = true;
      }

      // switch(page) {
      //   case 1:
      //     // if not exist
      //     new Vis.Views.BackgroundView({model: Vis.Models.app, chapter: chapter});
      //     break;
      //   case 2:
      //     // new Vis.Views.LifeImprovementView({model: Vis.Models.app, chapter: chapter});
      //     break;
      //   case 3:
      //     // new Vis.Views.ChildExpendituresView({model: Vis.Models.app, chapter: chapter});
      //     break;
      //   case 4:
      //     // new Vis.Views.CopingMechanismsView({model: Vis.Models.app, chapter: chapter});
      //     break;
      // }

      // Backbone.trigger("brush:childrenAge", [5,11]);
      // Backbone.trigger("brush:householdsChildren", [2,5]);
      // Backbone.trigger("select:householdsLocation", [1]);
      // Backbone.trigger("select:householdsPoverty", [1]);
    }
  });
