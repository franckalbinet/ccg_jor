// Households by nb. children chart
Vis.Views.HouseholdsChildren = Backbone.View.extend({
    el: '#households-children',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("brush:householdsChildren", function(d) { this.brush(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.model.getHouseholdsByChildren();

      this.chart = d3.barChartChildren()
        .width(120).height(158)
        .margins({top: 40, right: 20, bottom: 10, left: 30})
        .data(data)
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.values.length; })]))
        .y(d3.scale.linear().domain([0,10]))
        .xAxis(d3.svg.axis().orient("top").ticks(2))
        .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,10)))
        .title("By nb. of children")
        .hasBrush(true);

      this.chart.on("filtering", function (selected) {
        that.model.filterByChildren(selected);
      });

      this.chart.on("filtered", function (brush) {
        // console.log("in filtered");
        if (brush.empty()) that.model.filterByChildren(null);
      });

      this.render();
    },

    render: function() {
      // console.log(this.model.childrenByHousehold.top(Infinity));
      // console.log(this.model.getHouseholdsByChildren());
      this.chart
        .data(this.model.getHouseholdsByChildren())
        .selected(this.model.get("children"));
      d3.select("#households-children").call(this.chart);
    },

    brush: function(extent) {
      this.chart.brushExtent(extent);
      this.render();
    }
});
