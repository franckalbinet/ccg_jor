/* Loading "tidy" data */
Vis.Collections.App = Backbone.Collection.extend({
  initialize: function(options) {
    Backbone.on("data:loading", function(params) { this.load(); }, this);
  },

  load: function() {
    var that = this;

    queue()
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        Vis.DEFAULTS.DATASETS_URL.CHILDREN)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        Vis.DEFAULTS.DATASETS_URL.HOUSEHOLDS)
      .await(_ready);

    // on success
    function _ready(error, children, households) {
      // coerce data
      Backbone.trigger("data:loaded", {
        children: children,
        households: households
      });
    }
  }
});
