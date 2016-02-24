// Households by location (governorate)
Vis.Views.HouseholdsLocation = Backbone.View.extend({
    el: '#households-location',

    initialize: function () {
      this.initChart();
      Backbone.on("filtered", function(d) { this.render();}, this);
      Backbone.on("select:householdsLocation", function(d) { this.select(d);}, this);
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.barChartLocation()
        .width(150).height(135)
        .margins({top: 40, right: 20, bottom: 10, left: 45})
        .data(data)
        // .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.value.householdCount; })]))
        .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.relative; })]))
        .y(d3.scale.ordinal().domain(["Amman", "Irbid", "Mafraq", "Zarqa", "Madaba", "Jarash", "Ajloun", "Others"]))
        .xAxis(d3.svg.axis().orient("top").ticks(3).tickFormat(function(d) { return d + "%"; }))
        // .xAxis(d3.svg.axis().orient("top").tickValues([50, 100]))
        .yAxis(d3.svg.axis().orient("left"))
        .title("By governorate")
        .hasBrush(false);

      this.chart.on("filtered", function (selected) {
        that.model.filterByLocation(selected);
      });
      this.render();
    },

    render: function() {
      this.chart
        .data(this.getData())
        .selected(this.model.get("locations"));
      d3.select(this.el).call(this.chart);
      this.fixPositioning();
    },

    getData: function() {
      var data = this.model.householdsByLocation.top(Infinity);
      var total = d3.sum(data.map(function(d) { return d.value.householdCount; }));

      data.forEach(function(d) {
        return d.relative = Math.round(d.value.householdCount * 100 / total); });

      data.forEach(function(d) {
        d.name = Vis.DEFAULTS.LOOKUP_CODES.GOVERNORATES[d.key] });
      return data;
    },

    select: function(selection) {
      this.chart.select(selection);
      this.render();
    },

    fixPositioning: function() {
      d3.selectAll("#households-location .x.axis text").attr("y", -10);
    }
});
