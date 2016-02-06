// Scenarios
Vis.Views.Scenarios = Backbone.View.extend({
    el: '#scenarios',
    hasProfileViews: false,

    events: {
    },

    initialize: function () {
      this.model.on("change:initialized change:scenario", function() {
        // ensure that data is ready and scenario available
        if (this.model.get("initialized") && this.model.get("scenario")) this.render();
        },this);
    },

    render: function() {

      // create profile charts first time only
      if(!this.hasProfilesViews) {
        new Vis.Views.HouseholdsChildren({model: Vis.Models.app});
        new Vis.Views.ChildrenAge({model: Vis.Models.app});
        this.hasProfilesViews = true;
      }

      // Backbone.trigger("brush:childrenAge", [5,11]);
      // Backbone.trigger("brush:householdsChildren", [2,5]);

      // default scenario (nothing filtered);

      // debugger;
      // instead of setting filter - setting brush and select -mimic UI
      // this.model.filterByAge(null);
      // this.model.filterByHousehold(null);
      // this.model.filterByChildren(null);
      //
      // this.model.filterByGender(null);
      // this.model.filterByHead(null);
      // this.model.filterByPoverty(null);
      // this.model.filterByDisability(null);
      // this.model.filterByEducation(null);
      // this.model.filterByWork(null);
    }
  });
