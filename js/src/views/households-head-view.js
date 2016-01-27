// Households By Head of family View
Vis.Views.HouseholdsHead = Backbone.View.extend({
    el: '#households-by-head',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.householdsByHead.top(Infinity)
            .map(function(d) {
              return { key: d.key, value: d.value.householdCount };
            });

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-households-by-head", 400, 150);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(20, 5, 350, 80);
        this.myChart.addMeasureAxis("x", "value");
        this.myChart.addCategoryAxis("y", "key");
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
      d3.selectAll("#chart-households-by-head rect").classed("selected", false);
      this.model.get("heads").forEach(function(d) {
        d3.select("#households-by-head #chart-households-by-head rect#dimple-all--" + d + "--")
          .classed("selected", true);
      })

    },

    update: function(e) {
        var filter = this.model.get("heads"),
            selected = e.yValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByHead(filter);
    }
});
