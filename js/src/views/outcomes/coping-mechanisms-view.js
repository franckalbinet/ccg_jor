// Coping mechanisms view
Vis.Views.CopingMechanisms = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    this.chart = new Array(3);

    if (that.model.get("scenario").page === 5) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 5) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 5) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;
        template = _.template(Vis.Templates["coping-mechanisms"]);

    $("#households-children").show();
    $("#children-gender").hide();

    Vis.utils.clearCharts();

    $("#main-chart").html(template());
    $(".profile").show();

    // set text content
    ["main-text", "quote"].forEach(function(d) {
      Vis.utils.setTextContent.call(that, d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this;

    switch(chapter) {
        case 1:
          this.chart[0] = d3.heatmap()
            .width(115).height(325)
            .margins({top: 40, right: 20, bottom: 30, left: 10})
            .data(this.getData(chapter, 0))
            .color(d3.scale.threshold()
              .domain([10,20,30,40,50,60,70,80,90,100.1])
               .range(['#f6eae9','#eed2cc','#e4b9b1','#daa295','#ce8a7c','#c27362','#b45b49','#9a4d3e','#7e4033','#643228']))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
            .title("Currently used")
            .xTitle("")
            .hasNames(false)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COPING_MECHANISMS);

          this.chart[1] = d3.heatmap()
            .width(390).height(365)
            .margins({top: 30, right: 300, bottom: 30, left: 5})
            .data(this.getData(chapter, 1))
            .color(d3.scale.threshold()
              // .domain([1,5,10,40,50,60,70,80,90,100.1])
              .domain([10,20,30,40,50,60,70,80,90,100.1])
              .range(['#dae6e9','#c2d1d6','#abbdc5','#94a8b3','#7d94a2','#668190','#506e80','#395c6f','#224a5f','#003950']))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
            .title("Stopped coping mechanisms")
            .xTitle("")
            .hasNames(true)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COPING_MECHANISMS);

          this.chart[2] = d3.heatmapLegend()
            .width(100).height(310)
            .margins({top: 100, right: 10, bottom: 10, left: 40})
            .data({
              cold: ['#dae6e9','#c2d1d6','#abbdc5','#94a8b3','#7d94a2','#668190','#506e80','#395c6f','#224a5f','#003950'],
              hot: ['#f6eae9','#eed2cc','#e4b9b1','#daa295','#ce8a7c','#c27362','#b45b49','#9a4d3e','#7e4033','#643228']}
            )
            .title("% of answers")
            .xTitle("");
          break;
        default:
          console.log("no matching case.")
      }
    this.render(chapter);
  },

  render: function(chapter) {
    switch(chapter) {
        case 1:
          this.chart[0]
            .data(this.getData(chapter, 0))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
          d3.select("#current").call(this.chart[0]);

          this.chart[1]
            .data(this.getData(chapter, 1))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
          d3.select("#stopped").call(this.chart[1]);

          if (d3.select("#heatmap-legends svg").empty()) d3.select("#heatmap-legends").call(this.chart[2]);

          this.fixPositionning();
          break;
        default:
          console.log("no matching case.")
      }
  },

  getData: function(chapter, index) {
    switch(chapter) {
        case 1:
          if(index == 0) {
            return this.model.currentCopingByType.top(Infinity);
          } else {
            return this.model.stoppedCopingByType.top(Infinity);
          }
          break;
        default:
          console.log("no matching case.")
      }
  },

  getTotalHouseholds: function(chapter, index) {
    switch(chapter) {
      case 1:
        if (index == 0) {
          return _.unique(this.model.currentCopingHousehold.top(Infinity)
            .map(function(d) { return d.hh })).length;
        } else {
          return _.unique(this.model.stoppedCopingHousehold.top(Infinity)
            .map(function(d) { return d.hh })).length;
        }
        break;
      default:
        console.log("no matching case.")
    }
  },

  fixPositionning: function() {
    d3.select("#stopped .main.title").attr("x", 82);
  }
});
