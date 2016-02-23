// Coping mechanisms view
Vis.Views.CopingMechanisms = Backbone.View.extend({
  el: '.container',

  initialize: function () {
    var that = this;

    this.chart = new Array(2);

    if (that.model.get("scenario").page === 4) this.preRender(this.model.get("scenario").chapter);

    this.model.on("change:scenario", function() {
      if (that.model.get("scenario").page === 4) this.preRender(that.model.get("scenario").chapter);
      },this);

    Backbone.on("filtered", function(d) {
      if (that.model.get("scenario").page === 4) this.render(that.model.get("scenario").chapter);
      }, this);
  },

  preRender: function(chapter) {
    var that = this;

    $("#households-children").show();
    $("#children-gender").hide();

    this.clearCharts();

    $(".profile").show();

    // set text content
    ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
      that.setTextContent(d);
    });

    $("#pending").hide();

    $("#main-chart").show();

    this.initChart(chapter);
  },

  initChart: function(chapter) {
    var that = this;
        // data = this.getData(chapter),
        // total = this.getTotalHouseholds(chapter);

    switch(chapter) {
        case 1:
          this.chart[0] = d3.heatmap()
            .id(0)
            .width(100).height(330)
            .margins({top: 30, right: 0, bottom: 40, left: 5})
            .data(this.getData(chapter, 0))
            .color(d3.scale.threshold()
              .domain([10,20,30,40,50,60,70,80,90,100.1])
               .range(['#f6eae9','#eed2cc','#e4b9b1','#daa295','#ce8a7c','#c27362','#b45b49','#9a4d3e','#7e4033','#643228']))
            .relativeTo(this.getTotalHouseholds(chapter, 0))
            .title("Currently used")
            // .titleDeltaY(-15)
            .xTitle("Wave")
            // .xTitleDeltaX()
            .hasNames(false)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COPING_MECHANISMS);

          this.chart[1] = d3.heatmap()
            .id(1)
            .width(440).height(380)
            .margins({top: 30, right: 340, bottom: 40, left: 5})
            .data(this.getData(chapter, 1))
            .color(d3.scale.threshold()
              // .domain([1,5,10,40,50,60,70,80,90,100.1])
              .domain([10,20,30,40,50,60,70,80,90,100.1])
              .range(['#dae6e9','#c2d1d6','#abbdc5','#94a8b3','#7d94a2','#668190','#506e80','#395c6f','#224a5f','#003950']))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
            .title("Stopped")
            // .titleDeltaY(-15)
            // .xTitleDeltaX()
            .xTitle("")
            .hasNames(true)
            .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COPING_MECHANISMS);
          break;
        case 2:
          break;
        case 4:
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
          d3.select("#main-chart").call(this.chart[0]);

          this.chart[1]
            .data(this.getData(chapter, 1))
            .relativeTo(this.getTotalHouseholds(chapter, 1))
          d3.select("#main-chart").call(this.chart[1]);
          break;
        case 2:
          break;
        case 4:
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
          // return (index == 0) ?
          //   this.model.currentCopingByType.top(Infinity):
          //   this.model.stoppedCopingByType.top(Infinity);
          break;
        case 2:
          break;
        case 4:
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
      case 2:
        // return _.unique(this.model.outcomesHousehold.top(Infinity)
        //         .map(function(d) { return d.hh })).length;
        break;
      case 4:
        // return _.unique(this.model.outcomesHousehold.top(Infinity)
        //         .map(function(d) { return d.hh })).length;
        break;
      default:
        console.log("no matching case.")
    }
  },

  setTextContent: function(attr) {
    var scenario = this.model.get("scenario")
        id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
        template = _.template(Vis.Templates[attr][id]);

    $("#" + attr).html(template());

  },

  clearCharts: function() {
    // if (this.chart) this.chart = null;
    if (this.chart) this.chart = new Array(2);
    if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
  }
});
