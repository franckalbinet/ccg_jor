// Children by age chart
Vis.Views.ChildrenAge = Backbone.View.extend({
    el: '#children-age',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("brush:childrenAge", function(d) { this.brush(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.model.childrenByAge.top(Infinity);

      this.chart = d3.barChartAge()
        .width(120).height(250)
        .margins({top: 40, right: 20, bottom: 10, left: 30})
        .data(data)
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.value; })]))
        .y(d3.scale.linear().domain([0,18]))
        .xAxis(d3.svg.axis().orient("top").ticks(2))
        .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,18)))
        .title("By age")
        .hasBrush(true);

      this.chart.on("filtering", function (selected) {
        that.model.filterByAge(selected);
      });

      this.chart.on("filtered", function (brush) {
        // console.log("in filtered");
        if (brush.empty()) that.model.filterByAge(null);
      });

      this.render();
    },

    render: function() {
      console.log(this.model.childrenByHousehold.top(Infinity));
      this.chart.selected(this.model.get("ages"));
      d3.select("#children-age").call(this.chart);
    },

    brush: function(extent) {
      this.chart.brushExtent(extent);
      this.render();
    }
});
