// Households By Head of family View
Vis.Views.HouseholdsHead = Backbone.View.extend({
    el: '#households-by-head',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        // if (d !== "householdsHead") this.render();
        this.render();
        // if (this.myChart) this.setAesthetics();
        // this.setAesthetics();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.householdsByHead.top(Infinity);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-households-by-head", 400, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(60, 5, 350, 120);
        var x = this.myChart.addCategoryAxis("x", "key");
        this.myChart.addMeasureAxis("y", "value");
        this.mySeries = this.myChart.addSeries(null, dimple.plot.bar);
        this.mySeries.addEventHandler("click", function (e) {
          that.updateSelection(e);});
      }
      this.setAesthetics();
      this.myChart.draw(500);
    },

    setAesthetics: function() {
      d3.selectAll("#chart-households-by-head rect").classed("selected", false);
      this.model.get("heads").forEach(function(d) {
        d3.select("#households-by-head #chart-households-by-head rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })

    },

    updateSelection: function(e) {
        var filter = this.model.get("heads"),
            selected = e.xValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByHead(filter);
    }
});
