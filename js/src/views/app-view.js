// main application view
Vis.Views.App = Backbone.View.extend({
    el: '#container',
    isViewsCreated: false,
    currentPage: null,

    initialize: function () {
      this.model.on("change:initialized change:scenario", function() {
        // ensure that data is ready and scenario available
        if (this.model.get("initialized") && this.model.get("scenario")) {
          if(!this.isViewsCreated) {
            new Vis.Views.TimeLineNavigation({model: Vis.Models.app});
            this.initOutcomeViews();
            this.isViewsCreated = true;
          }
        }
      }, this);
    },

    initOutcomeViews: function() {
      var scenario = this.model.get("scenario"),
          page = +scenario.page,
          chapter = +scenario.chapter;

      new Vis.Views.Context({model: Vis.Models.app});
      new Vis.Views.Background({model: Vis.Models.app});
      new Vis.Views.Education({model: Vis.Models.app});
      new Vis.Views.Incomes({model: Vis.Models.app});
      new Vis.Views.Expenditures({model: Vis.Models.app});
      new Vis.Views.CopingMechanisms({model: Vis.Models.app});
      new Vis.Views.ResultsChildren({model: Vis.Models.app});
      new Vis.Views.CaseStudies({model: Vis.Models.app});
      new Vis.Views.FurtherResources({model: Vis.Models.app});
      new Vis.Views.FamilyConditions({model: Vis.Models.app});
    }
  });
