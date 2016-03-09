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
        that.url + Vis.DEFAULTS.DATASETS.MILESTONES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.INCOMES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.EXPENDITURES)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.CURRENT_COPING_MECHANISMS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.STOPPED_COPING_MECHANISMS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.EDUCATION)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.ECO_CONTRIBUTORS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.EXPENDITURES_CHILDREN)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.GOV_CENTROIDS)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.GOV)
      .defer(
        function(url, callback) {
          d3.json(url, function(error, result) {
            callback(error, result);
          })
        },
        that.url + Vis.DEFAULTS.DATASETS.CONTEXT_TIMELINE)
      .await(_ready);

    // on success
    function _ready(error, children, households, outcomes, milestones, incomes, expenditures, currentCoping, stoppedCoping, education, ecoContributors, expendituresChild, govCentroids, gov, contextTimeline) {
      var that = this;

      // coerce data
      var timeFormatter = d3.time.format("%L");
      var id = 0, time = 0;
      milestones.forEach(function(d, i) {
        d.id = id++;
        time = (i == 0) ? 0 : (time += milestones[i-1].duration);
        d.time = timeFormatter.parse(time.toString()),
        d.page = d.page.toString(),
        d.chapter = d.chapter.toString()
      });

      // coerce data
      timeFormatter = d3.time.format("%d-%m-%Y");
      id = 0;
      contextTimeline.forEach(function(d, i) {
        d.id = id++;
        d.date = timeFormatter.parse(d.date)
      });

      Backbone.trigger("data:loaded", {
        children: children,
        households: households,
        outcomes: outcomes,
        incomes: incomes,
        expenditures: expenditures,
        currentCoping: currentCoping,
        stoppedCoping: stoppedCoping,
        education: education,
        ecoContributors: ecoContributors,
        expendituresChild: expendituresChild,
        milestones: milestones,
        gov: gov,
        govCentroids: govCentroids,
        contextTimeline: contextTimeline
      });
    }
  }
});
