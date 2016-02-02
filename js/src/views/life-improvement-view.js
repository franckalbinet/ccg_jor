// Life improvement View
Vis.Views.LifeImprovement = Backbone.View.extend({
    el: '#life-improvement',

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
        this.svg = dimple.newSvg("#chart-life-improvement", 480, 200);
        this.myChart = new dimple.chart(this.svg, data);
        this.myChart.setBounds(30, 20, 400, 120);
        this.myChart.addPctAxis("x", "hh");
        this.myChart.addCategoryAxis("y", "round");
        this.mySeries = this.myChart.addSeries("imp", dimple.plot.bar);
        // myChart.addLegend(60, 10, 510, 20, "right");
        this.mySeries.addEventHandler("click", function (e) {
          that.updateSelection(e);
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
    updateSelection: function(e) {
      var pattern = /\d+/g,
          id = e.selectedShape.attr("id"),
          match = id.match(pattern),
          round = +match[1],
          imp = +match[0];

      // console.log("round: " + round);
      // console.log("imp: " + imp);
      //
      // debugger;

      // console.log("xValue: " + e.xValue);
      // console.log("yValue: " + e.yValue);
      // console.log("zValue: " + e.zValue);
      // console.log("colorValue: " + e.colorValue);
      // console.log("shape id: " + e.selectedShape.attr("id"));

      var households = this.model.outcomesHead.top(Infinity)
        .filter(function(d) { return (d.imp === imp && d.round === round); })
        .map(function(d) { return d.hh; });

        // var filter = this.model.get("heads"),
        //     selected = e.yValue;
        //
        // if (filter.indexOf(selected) === -1) { filter.push(selected); }
        // else { filter = _.without(filter, selected);}
        // this.model.filterByHead(filter);
    }
});
