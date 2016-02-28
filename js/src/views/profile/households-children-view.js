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
          data = this.getData();

      this.chart = d3.barChartChildren()
        .width(150).height(155)
        .margins({top: 40, right: 20, bottom: 0, left: 45})
        .data(data)
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.relative; })]))
        .y(d3.scale.linear().domain([0,10]))
        // .xAxis(d3.svg.axis().orient("top").tickValues([, 100]))
        .xAxis(d3.svg.axis().orient("top").ticks(3).tickFormat(function(d) { return d + "%"; }))
        // .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,10)))
        .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,8)))
        .title("By # of children")
        .hasBrush(true);

      this.chart.on("filtering", function (selected) {
        that.model.filterByChildren(selected);
      });

      this.chart.on("filtered", function (brush) {
        if (brush.empty()) that.model.filterByChildren(null, null);
      });
      this.render();
    },

    render: function() {
      this.chart
        .data(this.getData())
        .selected(this.model.get("children"));
      d3.select(this.el).call(this.chart);

      this.fixPositioning();
    },

    brush: function(extent) {
      this.chart.brushExtent(extent);
      this.render();
    },

    getData: function() {
      var data = this.model.getHouseholdsByChildren();
      data = data.filter(function(d) { return d.key !== 0; });

      var total = d3.sum(data.map(function(d) { return d.values.length; }));

      data.forEach(function(d) {
        return d.relative = Math.round(d.values.length * 100 / total); });

      return data;
    },

    fixPositioning: function() {
      d3.selectAll("#households-children .x.axis text").attr("y", 0);
    }

});
