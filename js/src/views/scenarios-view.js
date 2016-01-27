// Scenarios
Vis.Views.Scenarios = Backbone.View.extend({
    el: '#scenarios',

    events: {
    },

    initialize: function () {
      Backbone.on("play", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      // default scenario (nothing filtered);
      this.model.filterByAge(null);
      this.model.filterByGender(null);
      this.model.filterByHead(null);
      this.model.filterByPoverty(null);
    }
  });
