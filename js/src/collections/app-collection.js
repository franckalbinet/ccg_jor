/* Loading "tidy" data */
Vis.Collections.App = Backbone.Collection.extend({

  url: (Vis.DEFAULTS.FAKED_DATASET) ? "data/test/" : "data/",

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
        that.url + Vis.DEFAULTS.DATASETS.CHILDREN)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.HOUSEHOLDS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.OUTCOMES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.TEMPLATES)
      .await(_ready);

    // on success
    function _ready(error, children, households, outcomes, templates) {
      // coerce data
      Backbone.trigger("data:loaded", {
        children: children,
        households: households,
        outcomes: outcomes,
        templates: templates
      });
    }
  }
});
