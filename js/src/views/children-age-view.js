// Children By Age View
Vis.Views.ChildrenAge = Backbone.View.extend({
    el: '#children-by-age',

    events: {
      "keyup input": "parseFilter"
    },

    initialize: function () {
      // Backbone.on("children:synced", function(d) { this.render(); }, this);
      Backbone.on("filtered", function(d) {
        if (d !== "childrenAge") this.render();
      }, this);
    },

    render: function() {
      this.$el.find("#result")
        .text(JSON.stringify(this.model.childrenByAge.top(Infinity)));
    },

    parseFilter: function(e) {
      if (e.keyCode == 13) {
        var filter = (e.currentTarget.value !== "") ?
          JSON.parse(e.currentTarget.value) : null;
        this.model.filterByAge(filter);
      }
    }
  });
