// Nb. households by nb. of children
Vis.Views.HouseholdsChildren = Backbone.View.extend({
    el: '#households-by-children',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.getHouseholdsByChildren()
          .map(function(d) {
            return { key: +d.key, value: d.values.length};
          })
          .filter(function(d) {
            return d.key !== 0;
          });

      if (!this.myChart) {
        this.svg = dimple.newSvg("#" + this.el.id + " .chart", 480, 150);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(50, 10, 400, 90);
        var x = this.myChart.addCategoryAxis("x", "key");
        x.title = "Children by household";
        var y = this.myChart.addMeasureAxis("y", "value");
        y.ticks = 4;
        y.title = "Nb. of households";
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
      this.model.get("households").forEach(function(d) {
        d3.select("#" + that.el.id + " .chart rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })
    },

    update: function(e) {
        var filter = this.model.get("ages"),
            clicked = e.xValue;

        var filter = this.model.get("ages"),
            selected = e.xValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByAge(filter);
    },
});
