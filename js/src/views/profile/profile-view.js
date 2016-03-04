// Profile view
Vis.Views.Profile = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.render();
    },

    render: function() {
      new Vis.Views.HouseholdsChildren({model: Vis.Models.app});
      new Vis.Views.HouseholdsLocation({model: Vis.Models.app});
      new Vis.Views.HouseholdsPoverty({model: Vis.Models.app});
      new Vis.Views.HouseholdsHead({model: Vis.Models.app});
      new Vis.Views.ChildrenGender({model: Vis.Models.app});
    }
});
