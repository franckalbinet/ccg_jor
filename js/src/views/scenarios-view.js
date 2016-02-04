// Scenarios
Vis.Views.Scenarios = Backbone.View.extend({
    el: '#scenarios',

    events: {
    },

    initialize: function () {
      this.model.on("change:ready change:scenario", function() {
        // ensure that data is ready and scenario available
        if (this.model.get("ready") && this.model.get("scenario")) this.render();
        },this);
    },

    render: function() {
      console.log(this.model.get("scenario"));

      // default scenario (nothing filtered);
      this.model.filterByAge(null);
      // this.model.filterByHousehold(null);
      this.model.filterByChildren(null);

      this.model.filterByGender(null);
      this.model.filterByHead(null);
      this.model.filterByPoverty(null);
      this.model.filterByDisability(null);
      this.model.filterByEducation(null);
      this.model.filterByWork(null);
    }
  });
