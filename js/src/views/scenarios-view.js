// Scenarios
Vis.Views.Scenarios = Backbone.View.extend({
    el: '#scenarios',
    hasProfileViews: false,

    initialize: function () {
      this.model.on("change:initialized change:scenario", function() {
        // ensure that data is ready and scenario available
        if (this.model.get("initialized") && this.model.get("scenario")) this.render();
        },this);
    },

    render: function() {
      // console.log(this.model.get("scenario"));
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

      // Backbone.trigger("brush:childrenAge", [5,11]);
      // Backbone.trigger("brush:householdsChildren", [2,5]);
      // Backbone.trigger("select:householdsLocation", [1]);
      // Backbone.trigger("select:householdsPoverty", [1]);
    }
  });
