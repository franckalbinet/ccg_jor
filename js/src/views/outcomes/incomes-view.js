// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      // this.setTitle(this.model.get("scenario").page);
      this.dispatch(this.model.get("scenario"));
      this.model.on("change:scenario", function() {
        this.dispatch(this.model.get("scenario"));
        },this);
      Backbone.on("filtered", function(d) { this.render();}, this);
    },

    dispatch: function(scenario) {
      var scenario = this.model.get("scenario");
      if (scenario.page === 3) {
        switch(scenario.chapter) {
          case 1:
              this.initChart();
              break;
          case 2:
              // code block
              break;
          default:
              // default code block
        }
      }
    },

    render: function() {
      // this.setTitle(this.model.get("scenario").page);
      // console.log(this.getData()[0].value.map(function(d) {return d.count; }));
      this.chart
        .data(this.getData())
        .relativeTo(this.getTotalHouseholds())
      d3.select("#time-line").call(this.chart);
    },

    initChart: function() {
      var that = this,
          data = this.getData(),
          total = this.getTotalHouseholds();

      this.chart = d3.multiSeriesTimeLine()
        .width(600).height(350)
        .margins({top: 40, right: 120, bottom: 40, left: 45})
        .data(data)
        .relativeTo(total);

      this.render();
    },

    getData: function() {
      return this.model.incomesByType.top(Infinity);
      // return this.model.getIncomes();
    },

    getTotalHouseholds: function() {
      return _.unique(this.model.incomesHousehold.top(Infinity).map(function(d) {
         return d.hh })).length;
    },

    setTitle: function(page) {
      // if (page === 3) $("#page-title").text("Income & expenditure patterns");
    }
});
