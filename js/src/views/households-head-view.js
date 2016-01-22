// Households By Head of family View
Vis.Views.HouseholdsHead = Backbone.View.extend({
    el: '#households-by-head',

    events: {
      "keyup input": "parseFilter"
    },

    initialize: function () {
      Backbone.on("filter:synced", function(d) { this.render(); }, this);
    },

    render: function() {
      this.$el.find("#result")
        .text(JSON.stringify(this.model.householdsByHead.top(Infinity)));
    },

    parseFilter: function(e) {
      if (e.keyCode == 13) {
        var filter = (e.currentTarget.value !== "") ?
          JSON.parse(e.currentTarget.value) : null;
        this.model.filterByHead(filter);
      }
    }
  });
