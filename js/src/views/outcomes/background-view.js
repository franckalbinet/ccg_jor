// Expenditures children view
Vis.Views.Background = Backbone.View.extend({
    el: '.container',

    initialize: function () {
      var that = this,
          viewId = Vis.DEFAULTS.VIEW_PAGE_LOOKUP["background"];

      this.chart = new Array(3);

      if (that.model.get("scenario").page === viewId) this.render();

      this.model.on("change:scenario", function() {
        if (that.model.get("scenario").page === viewId) this.render();
        },this);
    },

    render: function() {
      var that = this,
          scenario = this.model.get("scenario"),
          chapter = scenario.chapter;

      this.renderTemplate(chapter);
      this.renderChart(chapter);

      Backbone.trigger("view:rendered");
    },

    renderTemplate: function(chapter) {
      var templateNarration =  _.template(Vis.Templates["narration"]),
          templateMainText = this.model.getTemplateMainText();

      Vis.utils.reset();

      switch(chapter) {
          case 1:
            var templateCharts =  _.template(Vis.Templates["background-population-map"]);
            break;
          case 2:
            var templateCharts =  _.template(Vis.Templates["background-population"]);
            break;
          case 3:
            var templateCharts =  _.template(Vis.Templates["background-sample"]);
            break;
          default:
            console.log("no matching case.");
      }

      var wasMapTemplate = $("#background-population-map").length;
      $("#content").html(templateNarration() + templateCharts());
      $("#main-text").html(templateMainText());
      if (chapter != 2 || wasMapTemplate == 0) {
        $("#narration").animate({ opacity: 0 }, 0);
        $("#narration").animate({ opacity: 1 }, 1500);
        $("#background-population").animate({ opacity: 0 }, 0);
        Vis.utils.chartDelay = setTimeout(function() {
          $("#background-population").animate({ opacity: 1 }, 1000);
        }, 2000);
      }
      $("#background-sample").animate({ opacity: 0 }, 0);
      $("#background-population-map").animate({ opacity: 0 }, 0);
      Vis.utils.chartDelay = setTimeout(function() {
        $("#background-sample").animate({ opacity: 1 }, 1000);
        $("#background-population-map").animate({ opacity: 1 }, 1000);
      }, 2000);
    },

    renderChart: function(chapter) {
      var that = this;

      switch(chapter) {
          case 1:
            var data = this.getData(chapter);
            this.chart = d3.mapBeneficiaries()
              .width(930).height(355)
              .margins({top: 55, right: 40, bottom: 40, left: 40})
              .data(data)
              .title("# of children by Jordan's governorates");

            // render
            d3.select("#background-population-map #map").call(this.chart);
            break;
          case 2:
            // chart rendering -- population of beneficiaries
            // by age
            this.chart[0] = c3.generate({
              bindto: d3.select("#background-population #age"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 0),
                type : 'donut',
                order: null
              },
              donut: {
                  title: "Age of children",
                  label: {
                    format: function (value, ratio, id) {
                      return d3.format('f')(value) + "%";
                    }
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6', '#609078', '#B45B49']
              }
            });
            // by gender
            this.chart[1] = c3.generate({
              bindto: d3.select("#background-population #gender"),
              size: {
                width: 250,
                height: 250,
              },
              data: {
                columns: that.getData(chapter, 1),
                type : 'donut'
              },
              donut: {
                  title: "Gender of children",
                  label: {
                    format: function (value, ratio, id) {
                      return d3.format('f')(value) + "%";
                    }
                  }
              },
              color: {
                pattern: ['#003950', '#E59138']
              }
            });
            // by povery
            this.chart[2] = c3.generate({
              bindto: d3.select("#background-population #poverty"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 2),
                type : 'donut'
              },
              donut: {
                  title: "Vulnerability level",
                  label: {
                    threshold: 0.1,
                    format: function (value, ratio, id) {
                      return d3.format('f')(value) + "%";
                    }
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6']
              }
            });
            break;
          case 3:
            // chart rendering - sample
            // by age
            this.chart[0] = c3.generate({
              bindto: d3.select("#background-sample #age"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 0),
                type : 'donut',
                order: null
              },
              donut: {
                  title: "Age of children",
                  label: {
                    format: function (value, ratio, id) {
                      return d3.format('f')(value) + "%";
                    }
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6', '#609078', '#B45B49']
              }
            });
            // by gender
            this.chart[1] = c3.generate({
              bindto: d3.select("#background-sample #gender"),
              size: {
                width: 250,
                height: 250,
              },
              data: {
                columns: that.getData(chapter, 1),
                type : 'donut'
              },
              donut: {
                  title: "Gender of children",
                  label: {
                    format: function (value, ratio, id) {
                      return d3.format('f')(value) + "%";
                    }
                  }
              },
              color: {
                pattern: ['#003950', '#E59138']
              }
            });
            // by poverty
            this.chart[2] = c3.generate({
              bindto: d3.select("#background-sample #poverty"),
              size: {
                width: 270,
                height: 270,
              },
              data: {
                columns: that.getData(chapter, 2),
                type : 'donut'
              },
              donut: {
                  title: "Vulnerability level",
                  label: {
                    threshold: 0.1,
                    format: function (value, ratio, id) {
                      return d3.format('f')(value) + "%";
                    }
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6']
              }
            });
            break;
          default:
            console.log("no matching case.")
      }

    },

    getData: function(chapter, index) {
      switch(chapter) {
          case 1:
            return {polygons: this.model.data.gov, centroids: this.model.data.govCentroids};
            break;
          case 2:
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
          case 3:
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
                    return [Vis.DEFAULTS.LOOKUP_CODES.GENDER[d.key]].concat(d3.range(1, Math.round((d.value / total)*100) + 1).map(function(d) { return 1; }));
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
    }
});
