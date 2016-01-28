// Template Horizontal BarChart view
Vis.Views.BarChartHorizontal = Backbone.View.extend({
    events: {
    },

    initialize: function (options) {
      _.extend(this, _.pick(options, "grp", "attr", "filter", "accessor",
        "yTitle", "xTitle"));

      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model[this.grp].top(Infinity)
            .map(this.accessor);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#" + this.el.id + " .chart", 480, 150);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(45, 10, 400, 90);
        var x = this.myChart.addCategoryAxis("x", "key");
        x.title = this.xTitle;
        var y = this.myChart.addMeasureAxis("y", "value");
        y.title = this.yTitle;
        y.ticks = 4;
        x.hidden = false;
        y.showGridlines = false;
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.update(e);});
      } else {
        this.myChart.data = data;
      }
      this.setAesthetics();
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      var that = this;
      d3.selectAll("#" + this.el.id + " .chart rect").classed("selected", false);
      this.model.get(this.attr).forEach(function(d) {
        d3.select("#" + that.el.id + " .chart rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })
    },

    update: function(e) {
      var filter = this.model.get(this.attr),
          selected = e.xValue;

      if (filter.indexOf(selected) === -1) { filter.push(selected); }
      else { filter = _.without(filter, selected);}
      this.model[this.filter](filter);
    },
});
