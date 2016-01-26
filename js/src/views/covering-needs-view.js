// Covering Basic Needs View
Vis.Views.CoveringNeeds = Backbone.View.extend({
    el: '#covering-needs',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.outcomesHead.top(Infinity);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-covering-needs", 400, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(20, 5, 350, 120);
        this.myChart.addPctAxis("x", "hh");
        this.myChart.addCategoryAxis("y", "round");
        this.mySeries = this.myChart.addSeries("needs", dimple.plot.bar);
        // myChart.addLegend(60, 10, 510, 20, "right");
        this.mySeries.addEventHandler("click", function (e) {
          // that.updateSelection(e);
        });
      } else {
        this.myChart.data = data;
      }
      // this.setAesthetics();
      this.myChart.draw(500);
    },

    // setAesthetics: function() {
    //   d3.selectAll("#chart-households-by-head rect").classed("selected", false);
    //   this.model.get("heads").forEach(function(d) {
    //     d3.select("#households-by-head #chart-households-by-head rect#dimple-all--" + d + "--")
    //       .classed("selected", true);
    //   })
    //
    // },
    //
    // updateSelection: function(e) {
    //     var filter = this.model.get("heads"),
    //         selected = e.yValue;
    //
    //     if (filter.indexOf(selected) === -1) { filter.push(selected); }
    //     else { filter = _.without(filter, selected);}
    //     this.model.filterByHead(filter);
    // }
});
