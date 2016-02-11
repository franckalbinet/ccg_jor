// Background view -- 1
Vis.Views.TimeLineNavigation = Backbone.View.extend({
    el: '#time-line-navigation',

    timer: null,
    paused: false,

    events: {
      "click button": "toggleBtn",
      // if clicked pause pause timer
      // if clicked play reinstantiate a new timer or resume
      // if new scenario reinstantiate a new timer
    },
    initialize: function () {
      this.initChart();
      this.model.on("change:scenario", function() {
        this.render();
        },this);
      // this.render();
    },

    initChart: function() {
      var that = this,
          data = this.getData();

      this.chart = d3.timeLineNavigation()
        .width(500).height(80)
        .margins({top: 20, right: 20, bottom: 20, left: 20})
        .data(data)
        .x(d3.time.scale().domain(d3.extent(data, function(d) { return d.time; })))

      this.render();
      // this.play();
    },

    render: function() {
      this.chart
        .data(this.getData())
        .elapsed(this.model.get("scenario"));
      d3.select(this.el).select(".chart").call(this.chart);
    },

    getData: function() {
      return this.model.getMilestones();
    },

    play: function() {
      if (!this.paused) {
        // get scenario timing
        this.timer = new Vis.utils.Timer(function() {
          // and navigate to next when elapsed
          alert("Done!");
        }, 1000);
      } else {
        this.timer.resume();
      }
      this.paused = false;
    },

    pause: function() {
      this.timer.pause();
      this.paused = true;
    },

    toggleBtn: function(e) {
      e.preventDefault();
      var btn = $(e.currentTarget);
      btn.blur();

      if(btn.hasClass("play")) {
        // debugger;
        btn.removeClass("play").addClass("pause");
        btn.find("span").html("Play");
        btn.find("i").removeClass("fa-pause").addClass("fa-play");
      } else {
        btn.removeClass("pause").addClass("play");
        btn.find("span").html("Pause");
        btn.find("i").removeClass("fa-play").addClass("fa-pause");
      }
    }


});
