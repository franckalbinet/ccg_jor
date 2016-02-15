// Coping mechanisms view
Vis.Views.CopingMechanisms = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.dispatch(this.model.get("scenario"));
      this.model.on("change:scenario", function() {
        this.dispatch(this.model.get("scenario"));
        },this);
      Backbone.on("filtered", function(d) { this.render();}, this);
    },

    dispatch: function(scenario) {
      var scenario = this.model.get("scenario"),
          that = this;

      if (scenario.page === 5) {
        $(".profile").show();
        // set text content
        ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
          that.setTextContent(d);
        });

        $("#pending").show();
        $("#time-line").hide();

        switch(scenario.chapter) {
          case 1:
              // this.initChart();
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
    },

    initChart: function() {
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
    }
});
