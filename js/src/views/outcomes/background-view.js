// Expenditures children view
Vis.Views.Background = Backbone.View.extend({
    el: '.container',

    highlighted: [],

    initialize: function () {
      var that = this;

      this.chart = new Array(3);

      if (that.model.get("scenario").page === 2) this.preRender(this.model.get("scenario").chapter);

      this.model.on("change:scenario", function() {
        if (that.model.get("scenario").page === 2) this.preRender(that.model.get("scenario").chapter);
        },this);

      Backbone.on("filtered", function(d) {
        if (that.model.get("scenario").page === 2) this.render(that.model.get("scenario").chapter);
        }, this);
    },

    preRender: function(chapter) {
      var that = this,
          templateSample = _.template(Vis.Templates["background-sample"]);

      $("#households-children").show();
      $("#children-gender").hide();

      Vis.utils.clearCharts();

      $(".outcomes").removeClass("col-md-8").addClass("col-md-12");
      $("#main-chart").html(templateSample());

      $(".profile").hide();

      ["main-text", "quote"].forEach(function(d) {
        Vis.utils.setTextContent.call(that, d);
      });

      $("#pending").hide();
      $("#main-chart").show();

      $(".charts").animate({ opacity: 0 }, 0);
      Vis.utils.chartDelay = setTimeout(function() {
        that.initChart(chapter);
        $(".charts").animate({ opacity: 1 }, 1500);
      }, 4000);
    },

    initChart: function(chapter) {
      var that = this,
          data = this.getData(chapter),
          total = this.getTotal(chapter);

      switch(chapter) {
          case 1:
            break;
          case 2:
            break;
          case 4:
            break;
          default:
            console.log("no matching case.")
        }
      this.render(chapter);
    },

    render: function(chapter) {
      var that = this;
      switch(chapter) {
          case 1:
            this.chart[0] = c3.generate({
              bindto: d3.select("#background-sample #age"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 0),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Age of children"
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6', '#609078', '#B45B49']
              }
            });

            this.chart[1] = c3.generate({
              bindto: d3.select("#background-sample #gender"),
              size: {
                width: 250,
                height: 250,
              },
              data: {
                columns: that.getData(chapter, 1),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Gender of children"
              },
              color: {
                pattern: ['#003950', '#E59138']
              }
            });

            this.chart[2] = c3.generate({
              bindto: d3.select("#background-sample #poverty"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 2),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Vulnerability level",
                  label: {
                    threshold: 0.1
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6']
              }
            });
            break;
          case 2:
            this.chart[0] = c3.generate({
              bindto: d3.select("#background-sample #age"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 0),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Age of children"
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6', '#609078', '#B45B49']
              }
            });

            this.chart[1] = c3.generate({
              bindto: d3.select("#background-sample #gender"),
              size: {
                width: 250,
                height: 250,
              },
              data: {
                columns: that.getData(chapter, 1),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Gender of children"
              },
              color: {
                pattern: ['#003950', '#E59138']
              }
            });

            this.chart[2] = c3.generate({
              bindto: d3.select("#background-sample #poverty"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 2),
                type : 'donut',
                onclick: function (d, i) { console.log("onclick", d, i); },
                onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                onmouseout: function (d, i) { console.log("onmouseout", d, i); }
              },
              donut: {
                  title: "Vulnerability level",
                  label: {
                    threshold: 0.1
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6']
              }
            });
            break;
          case 2:
            break;
          case 4:
            break;
          default:
            console.log("no matching case.")
        }
    },

    getData: function(chapter, index) {
      switch(chapter) {
          case 1:
            switch(index) {
              case 0:
                return [
                  ["0-1 year"].concat(d3.range(1,8).map(function(d) { return 1; })),
                  ["2-4 years"].concat(d3.range(1,18).map(function(d) { return 1; })),
                  ["5-11 years"].concat(d3.range(1,47).map(function(d) { return 1; })),
                  ["12-15 years"].concat(d3.range(1,23).map(function(d) { return 1; })),
                  ["16-17 years"].concat(d3.range(1,9).map(function(d) { return 1; }))
                ];
                break;
              case 1:
              return [
                ["Male"].concat(d3.range(1,52).map(function(d) { return 1; })),
                ["Female"].concat(d3.range(1,50).map(function(d) { return 1; })),
              ];
                break;
              case 2:
                return [
                  ["Highly Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; })),
                  ["Severely Vulnerable"].concat(d3.range(1,59).map(function(d) { return 1; })),
                  ["Children with specific needs"].concat(d3.range(1,3).map(function(d) { return 1; })),
                ];
                break;
              default:
                console.log("no matching case.")
            }
            break;
          case 2:
            switch(index) {
              case 0:
                return [
                  ["0-1 year"].concat(d3.range(1,7).map(function(d) { return 1; })),
                  ["2-4 years"].concat(d3.range(1,18).map(function(d) { return 1; })),
                  ["5-11 years"].concat(d3.range(1,46).map(function(d) { return 1; })),
                  ["12-15 years"].concat(d3.range(1,25).map(function(d) { return 1; })),
                  ["16-17 years"].concat(d3.range(1,9).map(function(d) { return 1; }))
                ];
                break;
              case 1:
                var total = d3.sum(this.model.childrenByGender.top(Infinity), function(d) { return d.value; });
                return this.model.childrenByGender.top(Infinity).map(function(d) {
                  return [d.name].concat(d3.range(1, Math.round((d.value / total)*100) + 1).map(function(d) { return 1; }));
                });
                break;
              case 2:
                var high = ["Highly Vulnerable"].concat(d3.range(1,59).map(function(d) { return 1; })),
                    resilient = ["Resilient"].concat(d3.range(1,3).map(function(d) { return 1; })),
                    severe = ["Severely Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; }));
                return [high, resilient, severe];
                break;
              default:
                console.log("no matching case.")
            }
            break;
          default:
            console.log("no matching case.")
        }
    },

    getTotal: function(chapter) {
      switch(chapter) {
        case 1:
          break;
        case 2:

          break;
        case 2:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        default:
          console.log("no matching case.")
      }
    },

    fixPositionning: function() {
      d3.selectAll("#main-chart .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });
    }
});
