// Income & expenditure view
Vis.Views.IncomeExpenditure = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      this.setTitle(this.model.get("scenario").page);
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
        this.setTitle(this.model.get("scenario").page);
    },

    setTitle: function(page) {
      if (page === 3) $("#page-title").text("Income & expenditure patterns");
    }
});
