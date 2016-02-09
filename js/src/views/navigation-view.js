// Navigation view
Vis.Views.Navigation = Backbone.View.extend({
    el: '.container',

    events: {
      "click #nav": "updatePage",
      "click #sub-nav": "updateChapter",
    },

    initialize: function () {
      this.model.on("change:scenario", function() {
        this.render();
        },this);
    },

    render: function() {
      var scenario = this.model.get("scenario"),
          page = scenario.page,
          chapter = scenario.chapter;

      this.updatePageBtn(page);
      this.updateChapterList(chapter, page);
    },

    updatePage: function(e) {
        e.preventDefault();
        var page = $(e.target).attr("id").split("-")[1];
        Vis.Routers.app.navigate("#page/" + page +"/chapter/1", {trigger: true});
    },

    updateChapter: function(e) {
      e.preventDefault();
      var chapter = $(e.target).attr("id").split("-")[1],
          currentPage = this.model.get("scenario").page;

      Vis.Routers.app.navigate("#page/" + currentPage +"/chapter/" + chapter, {trigger: true});
    },

    updatePageBtn: function(page) {
      $("#nav .btn").removeClass("active");
      $("#nav #page-" + page).addClass("active");
    },

    updateChapterList: function(chapter, page) {
      $("#sub-nav li").removeClass("active");
      $("#sub-nav #chapter-" + chapter).addClass("active");

      $("#sub-nav li").show();

      switch(+page) {
        case 1:
          $("#sub-nav li").hide();
          break;
        case 2:
          this.hideList([3,4]);
          break;
        case 3:
          this.hideList([4]);
          break;
        case 4:
          this.hideList([2,3,4]);
          break;
      }
    },

    hideList(hiddenArray) {
      hiddenArray.forEach(function(d) { $("#sub-nav li#chapter-" + d).hide();});
    }
});
