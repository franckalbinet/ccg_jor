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

      // this.clearCharts();
      Vis.utils.clearCharts();

      $(".outcomes").removeClass("col-md-8").addClass("col-md-12");
      $("#main-chart").html(templateSample());

      $(".profile").hide();

      // set text content
      ["main-text", "sub-text", "quote", "quote-ref"].forEach(function(d) {
        that.setTextContent(d);
      });

      $("#pending").hide();

      $("#main-chart").show();

      this.initChart(chapter);
    },

    initChart: function(chapter) {
      var that = this,
          data = this.getData(chapter),
          total = this.getTotal(chapter);

      switch(chapter) {
          case 1:
            // this.chart = d3.barChartMultiStacked()
            //   .width(600).height(350)
            //   .margins({top: 40, right: 250, bottom: 40, left: 200})
            //   .data(data)
            //   .color(d3.scale.ordinal().range(["#80A6B1", "#b45b49"]).domain([1, 2]))
            //   .relativeTo(total)
            //   .title("Were you able to cover expenses for your children that were not a priority before ?")
            //   .xTitle("")
            //   .lookUp(Vis.DEFAULTS.LOOKUP_CODES.COV_CHILD_EXP);
            break;
          case 2:
            /* barchart
            this.chart = d3.barChartAge()
              .width(200).height(400)
              .margins({top: 40, right: 20, bottom: 10, left: 45})
              .data(data)
              .relativeTo(total)
              // .x(d3.scale.linear().domain([0, d3.max(data, function(d) { return d.value; })]))
              .x(d3.scale.linear())
              .y(d3.scale.linear().domain([0,18]))
              .xAxis(d3.svg.axis().orient("top").tickValues([50, 100]))
              .yAxis(d3.svg.axis().orient("left").tickValues(d3.range(1,18)))
              .title("By age")
              .hasBrush(false);
            */

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
                  title: "Children age"
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
                  title: "Children gender"
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
                  title: "Poverty level",
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
                  title: "Children age"
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
                  title: "Children gender"
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
                  title: "Poverty level",
                  label: {
                    threshold: 0.1
                  }
              },
              color: {
                pattern: ['#003950', '#E59138', '#88A3B6']
              }
            });

            /* barchart
            this.chart
              .selected(this.model.get("ages"))
              .data(this.getData(chapter))
            d3.select("#main-chart").call(this.chart);
            */
            break;
          case 2:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            //   .highlighted(this.highlighted)
            // d3.select("#main-chart").call(this.chart);
            break;
          case 4:
            // this.chart
            //   .data(this.getData(chapter))
            //   .relativeTo(this.getTotalHouseholds(chapter))
            // d3.select("#main-chart").call(this.chart);
            // d3.selectAll(".bar-chart-multi-stacked rect").style("opacity", 0.7);
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
                // var  = ["0-1 year"].concat(d3.range(1,7).map(function(d) { return 1; })),
                //     resilient = ["Resilient"].concat(d3.range(1,3).map(function(d) { return 1; })),
                //     severe = ["Severely Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; }));
                // return [high, resilient, severe];
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

                // var total = d3.sum(this.model.householdsByPoverty.top(Infinity), function(d) { return d.value.householdCount; });
                // return this.model.householdsByPoverty.top(Infinity).map(function(d) {
                //   console.log(Math.round((d.value.householdCount / total)*100));
                //   return [Vis.DEFAULTS.LOOKUP_CODES.POVERTY[d.key]]
                //           .concat(d3.range(1, Math.round((d.value.householdCount / total)*100)+1).map());
                // });
                break;
              default:
                console.log("no matching case.")
            }
            // return this.model.covChildExpByRound.top(Infinity);
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
                // var  = ["0-1 year"].concat(d3.range(1,7).map(function(d) { return 1; })),
                //     resilient = ["Resilient"].concat(d3.range(1,3).map(function(d) { return 1; })),
                //     severe = ["Severely Vulnerable"].concat(d3.range(1,41).map(function(d) { return 1; }));
                // return [high, resilient, severe];
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

                // var total = d3.sum(this.model.householdsByPoverty.top(Infinity), function(d) { return d.value.householdCount; });
                // return this.model.householdsByPoverty.top(Infinity).map(function(d) {
                //   console.log(Math.round((d.value.householdCount / total)*100));
                //   return [Vis.DEFAULTS.LOOKUP_CODES.POVERTY[d.key]]
                //           .concat(d3.range(1, Math.round((d.value.householdCount / total)*100)+1).map());
                // });
                break;
              default:
                console.log("no matching case.")
            }
            break;
          // case 4:
          //   return this.model.basicNeedsByRound.top(Infinity);
          //   break;
          default:
            console.log("no matching case.")
        }
    },

    // test: _.throttle(function (highlighted) {
    //   this.highlighted = highlighted;
    //   this.render(this.model.get("scenario").chapter);
    //   console.log("test");
    // }, 300),

    getTotal: function(chapter) {
      switch(chapter) {
        case 1:
          // return _.unique(this.model.expendituresHousehold.top(Infinity)
          //         .map(function(d) { return d.hh })).length;
          // return _.unique(this.model.outcomesHousehold.top(Infinity)
          // .map(function(d) { return d.hh })).length;
          break;
        case 2:

          break;
        case 2:
          return _.unique(this.model.expendituresChildHousehold.top(Infinity)
                  .map(function(d) { return d.hh })).length;
          break;
        // case 4:
        //   return _.unique(this.model.outcomesHousehold.top(Infinity)
        //           .map(function(d) { return d.hh })).length;
        //   break;
        default:
          console.log("no matching case.")
      }
    },

    setTextContent: function(attr) {
      var scenario = this.model.get("scenario")
          id = this.model.getTemplateId(scenario.page, scenario.chapter, attr),
          template = _.template(Vis.Templates[attr][id]);

      $("#" + attr).html(template());

    },

    clearCharts: function() {
      if (this.chart) this.chart = null;
      // if(!d3.select("#main-chart svg").empty()) d3.select("#main-chart svg").remove();
      if(!d3.select("#main-chart svg").empty()) d3.selectAll("#main-chart svg").remove();
    },

    fixPositionning: function() {
      d3.selectAll("#main-chart .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });
    }
});
