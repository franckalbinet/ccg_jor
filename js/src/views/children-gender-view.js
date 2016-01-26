// Children By Gender View
Vis.Views.ChildrenGender = Backbone.View.extend({
    el: '#children-by-gender',

    events: {
    },

    initialize: function () {
      Backbone.on("filtered", function(d) {
        this.render();
      }, this);
    },

    render: function() {
      var that = this,
          data = this.model.childrenByGender.top(Infinity);

      if (!this.myChart) {
        this.svg = dimple.newSvg("#chart-children-by-gender", 400, 200);
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
      d3.selectAll("#chart-children-by-gender rect").classed("selected", false);
      this.model.get("genders").forEach(function(d) {
        d3.select("#children-by-gender #chart-children-by-gender rect#dimple-all-" + d + "---")
          .classed("selected", true);
      })

    },

    updateSelection: function(e) {
        var filter = this.model.get("genders"),
            selected = e.xValue;

        if (filter.indexOf(selected) === -1) { filter.push(selected); }
        else { filter = _.without(filter, selected);}
        this.model.filterByGender(filter);
    }
  });
