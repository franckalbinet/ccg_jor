// Incomes view
Vis.Views.Incomes = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      // this.setTitle(this.model.get("scenario").page);
      this.dispatch(this.model.get("scenario"));
      this.model.on("change:scenario", function() {
        this.dispatch(this.model.get("scenario"));
        },this);
    },

    dispatch: function(scenario) {
      var scenario = this.model.get("scenario");
      if (scenario.page === 3) {
        switch(scenario.chapter) {
          case 1:
              this.render();
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
      // var data = this.model.getIncomes();
      // debugger;
        // this.setTitle(this.model.get("scenario").page);
    },

    setTitle: function(page) {
      // if (page === 3) $("#page-title").text("Income & expenditure patterns");
    }
});
