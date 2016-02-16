// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      var that = this;
      this.dispatch(this.model.get("scenario"));
      this.model.on("change:scenario", function() {
        this.dispatch(this.model.get("scenario"));
        },this);
      Backbone.on("filtered", function(d) {
        if (that.model.get("scenario").page === 3) this.render();
        }, this);
    },

    dispatch: function(scenario) {
      var scenario = this.model.get("scenario"),
          that = this;


      if (scenario.page === 3) {
        this.clearCharts();
        $(".profile").show();
        // set text content
        ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
          that.setTextContent(d);
        });
        $("#pending").hide();
        $("#main-chart").show();
        switch(scenario.chapter) {
          case 1:
              // if (this.chart) this.chart = null;
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
      this.chart
        .data(this.getData())
        .relativeTo(this.getTotalHouseholds())
      d3.select("#main-chart").call(this.chart);
    },

    initChart: function() {
      var that = this,
          data = this.getData(),
          total = this.getTotalHouseholds();

      this.chart = d3.multiSeriesTimeLine()
        .width(600).height(350)
        .margins({top: 40, right: 120, bottom: 40, left: 45})
        .color(d3.scale.ordinal().range(["#5e5e66", "#e59138", "#6d8378", "#b45b49"]).domain([1, 2, 5, 99]))
        .data(data)
        .relativeTo(total)
        .title("Main sources of income")
        .xTitle("Wave")
        .lookUp(Vis.DEFAULTS.LOOKUP_CODES.INCOME);

      this.render();
    },

    getData: function() {
      return this.model.incomesByType.top(Infinity);
    },

    getTotalHouseholds: function() {
      return _.unique(this.model.incomesHousehold.top(Infinity).map(function(d) {
         return d.hh })).length;
    },

    setTextContent: function(attr) {
      var scenario = this.model.get("scenario")
      id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
      template = _.template(Vis.Templates[attr][id]);

      $("#" + attr).html(template());
    },

    clearCharts: function() {
      if (this.chart) this.chart = null;
      if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
    }
});
