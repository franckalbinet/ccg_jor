/* CREATE MULTI SERIES TIME LINE CHART INSTANCE*/
d3.multiSeriesTimeLineAlt = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      relativeTo = null,
      lookUp = null,
      color = null,
      x = d3.scale.linear(),
      y = d3.scale.ordinal(),
      elasticY = false,
      xDomain = null,
      xAxis = d3.svg.axis().orient("bottom").ticks(5),
      // yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      yAxis = d3.svg.axis().orient("left"),
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
      highlighted = [];

  var _gWidth = 400,
      _gHeight = 100,
      _hasLegend = false,
      _handlesWidth = 9,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _gLegend,
      _gItems,
      _line,
      _previousData,
      _voronoi = null,
      _gVoronoi = null,
      _listeners = d3.dispatch("highlighted");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;

    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      data.forEach(function(d) {
        d.valueId = d.value.map(function(v) {
          return v.count; }).join("-"); });


      // x.domain(getXDomain());
      x.domain([0, _getMaxX(data)]);
      // y.domain([0, _getMaxY(data)]);
      // y.domain(getYDomain());
      y.domain([1,2,4,3,9,10,7,5,6,8,11,13,12,97]);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      _gYAxis.transition().call(yAxis);

      if (!isDataEmpty()) _render();

      d3.selectAll(".time-line .legends text")
        .data(["June", "August", "November"])
        .text(function(d) { return d; });

      d3.selectAll(".time-line .y.axis text")
        .data([1,2,4,3,9,10,7,5,6,8,11,13,12,97].map(function(d) { return lookUp[d]; }))
        .text(function(d) { return d; });

      function _render() {
        // container
        var item = _gItems.selectAll(".item")
            .data(data, function(d) {
              return d.key;
            });
        item.enter()
            .append("g")
            .attr("class", "item");
        item.exit().remove();

        // lines
        var line = item.selectAll(".line")
          .data(function(d) { return [d];}, function(d) { return d.valueId; });

        line.enter().append("path").attr("class", "line");

        line.exit().remove();

        line
          .style("stroke", function(d) {
            return color(d.key); })
          .classed("highlighted", function(d) {
            // console.log(highlighted);
            if (highlighted.length == 0) {
              _clearFigures();
              return false;
            }

            if (highlighted.indexOf(d.key) !== -1) {
              _setFigures(d);
              this.parentNode.parentNode.appendChild(this.parentNode);
              return true;
            } else {
              // _clearFigures();
              return false;
            }
          })
          .classed("not-highlighted", function(d) {
            if (highlighted.length == 0) return false;
            return (highlighted.indexOf(d.key) === -1) ?
              true : false;
          })
          .transition()
          .attr("d", function(d) {
            var reordered = [];
            y.domain().forEach(function(v) {
              reordered.push(  d.value.filter(function(f) { return f.category === v})[0])
            })
            // return _line(d.value);
            return _line(reordered);
          });

        // circles
        var circles = item.selectAll(".points")
          .data(function(d){ return d.value});

        circles.enter().append("circle").attr("class", "points");

        circles.exit().remove();

        circles
          .classed("highlighted", function(d) {
            var key = d3.select(this).node().parentNode.__data__.key;
            if (highlighted.length > 0 && highlighted.indexOf(key) !== -1) {
              this.parentNode.parentNode.appendChild(this.parentNode);
              return true;
            } else {
              return false;
            }
          })
          .classed("not-highlighted", function() {
            var key = d3.select(this).node().parentNode.__data__.key;
            return (highlighted.length > 0 && highlighted.indexOf(key) === -1) ?
              true : false;
          })
          .style("fill", function(d) {
            var parent = d3.select(this).node().parentNode.__data__;
            return color(parent.key); })
          .attr("r", function(d) {
            return 2.5})
          .transition()
          .attr("cx", function(d) {
            // return x(d.round); })
            return x(toPercentage(d.count)); })
          .attr("cy", function(d) {
            // return y(toPercentage(d.count)); });
            return y(d.category); });


        var legend = _gLegend.selectAll(".legend")
          // .data(getSortedKeys(), function(d) { return d.key; });
          // .data(getSortedKeys(), function(d) { return d.key; });
          .data(color.domain());

        legend.enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
          .on("mouseover", function(d) {
            // if (highlighted && highlighted[0] !== d.key) {
              _listeners.highlighted([d.key]);
            if (highlighted && highlighted[0] !== d) {
              _listeners.highlighted([d]);
            }
          })
          .on("mouseout", function(d) {
            _listeners.highlighted([]);
          });

        legend.exit().remove();

        legend
          .classed("highlighted", function(d) {
            if (highlighted.length == 0) return false;
            // return (highlighted.indexOf(d.key) !== -1) ? true : false;
            return (highlighted.indexOf(d) !== -1) ? true : false;
          })
          .classed("not-highlighted", function(d) {
            // return (highlighted.length > 0 && highlighted.indexOf(d.key) === -1) ?
            return (highlighted.length > 0 && highlighted.indexOf(d) === -1) ?
              true : false;
          })
          .transition()
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        if (!_hasLegend) {
          legend.append("text")
              .attr("x", _gWidth + 50 + 30)
              .attr("y", 0)
              .attr("dy", "0.3em")
              .style("text-anchor", "start")
              // .text(function(d) { return lookUp[d.key] ; });
              .text(function(d) { return d ; });

          legend.append("line")
              .attr("x1", _gWidth + 50)
              .attr("x2", _gWidth + 75)
              .attr("y1", 0)
              .attr("y2", 0)
              .style("stroke", function(d) { return color(d); });
              // .style("stroke", function(d) { return color(d.key); });

          legend.append("circle")
              .attr("cx", _gWidth + 63)
              .attr("cy", 0)
              .attr("r", 2.5)
              // .style("fill", function(d) { return color(d.key); });
              .style("fill", function(d) { return color(d); });

          _hasLegend = true;
        }


        // voronois
        var _dataVoronoi = [];
        data.forEach(function(d) {
          d.value.forEach(function(v) {
            // _dataVoronoi.push({key: d.key, count: v.count, round: v.round}); });
            _dataVoronoi.push({key: d.key, count: v.count, category: v.category}); });
        });

        if(_hasDataChanged()) {
          _gVoronoi.selectAll("path").remove();

        _gVoronoi.selectAll("path")
            .data(_voronoi(_dataVoronoi))
          .enter().append("path")
            .attr("d", function(d) {
              if (typeof(d) !== "undefined") {
                return "M" + d.join("L") + "Z";
              }
            })
            .datum(function(d) {
              if (typeof(d) !== "undefined") {
                return d.point;
              }
            })
            .on("mouseover", function(d) {
              _listeners.highlighted([d.key]);
            })
            .on("mouseout", function(d) {
              _listeners.highlighted([]);
            });
        }

        _previousData = data
          .sort(function(a,b) { return a.key - b.key; })
          .map(function(d) { return d.valueId; }).slice();
      }

      function _setFigures(feature) {
        feature.value.forEach(function(d) {
          _gFigures.append("text")
            // .attr("x", function() { return x(d.round); } )
            // .attr("y", function() { return y(toPercentage(d.count)); } )
            .attr("x", function() { return x(toPercentage(d.count)); } )
            .attr("y", function() { return y(d.category); } )
            // .attr("dy", -8)
            .attr("dy", 4)
            .attr("dx", 25)
            .attr("text-anchor", "middle")
            .text(toPercentage(d.count) + "%")
        })
      }

      function _clearFigures() {
        _gFigures.selectAll("text").remove();
      }

      // function _getMaxY() {
      //   return d3.max(
      //     _.flatten(data.map(function(d) { return d.valueId.split("-"); })),
      //     function(d) { return toPercentage(+d); });
      // }

      function _getMaxX() {
        return d3.max(
          _.flatten(data.map(function(d) { return d.valueId.split("-"); })),
          function(d) { return toPercentage(+d); });
      }

      function _isHighlighted() {
        return (highlighted.length === 0) ? false : true;
      }

      function _hasDataChanged() {
        if (!_previousData) return true;
        // var previous = _previousData
        //   .sort(function(a,b) { return a.key - b.key; })
        //   .map(function(d) { return d.valueId; })

        var current = data
          .sort(function(a,b) { return a.key - b.key; })
          .map(function(d) { return d.valueId; });

        var diff = _.difference(_previousData, current);

        return (diff.length == 0) ? false : true;
      }

      function _skeleton() {
        // set scales range
        // x.rangePoints([0 , _gWidth], 0.3);
        // y.range([_gHeight, 0]);
        x.range([0, _gWidth]);
        y.rangePoints([0 , _gHeight], 0.3);

        // set axis
        // xAxis.scale(x);
        // yAxis.scale(y).tickFormat(function(d) { return d + "%"; });
        xAxis.scale(x).tickFormat(function(d) { return d + "%"; });
        yAxis.scale(y);

        _line = d3.svg.line()
          // .interpolate("linear")
          .interpolate("cardinal")
          // .x(function(d) { return x(d.round); })
          .x(function(d) { return x(toPercentage(d.count)); })
          .y(function(d) { return y(d.category); });

        // create chart container
        g = div.append("svg")
            .classed("time-line", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gItems = g.append("g").attr("class", "items");

        _gFigures = g.append("g").attr("class", "figures");

        // Voronoi polygons for tooltips
        _voronoi = d3.geom.voronoi()
          // .x(function(d) { return x(d.round); })
          // .y(function(d) { return y(toPercentage(d.count)); })
          .y(function(d) { return y(d.category); })
          .x(function(d) { return x(toPercentage(d.count)); })
          // .clipExtent(null);
          .clipExtent([[0, 0], [_gWidth, _gHeight]]);

        _gVoronoi = g.append("g").attr("class", "voronoi");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _gHeight + ")")
            .call(xAxis);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var deltaX = d3.selectAll(".time-line .x.axis path.domain")
          .attr("d").split("H")[1].split("V")[0];

        g.append("text")
          .attr("class", "x title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", _gHeight + 40)
          .text(xTitle);

        g.append("text")
          .attr("class", "main title")
          .attr("text-anchor", "middle")
          .attr("x", +deltaX / 2)
          .attr("y", -30)
          .text(title);

        _gLegend = g.append("g").attr("class", "legends");

      }

      function getSortedKeys() { // based on count at round 3
        var keyCount = data.map(function(d) {
          return {
            key: d.key,
            count: d.value.filter(function(v) { return v.round == 3; })[0].count
          };
        });

        return keyCount.sort(function(a,b) { return b.count - a.count;});
      }

      function isDataEmpty() {
        // var length = data.filter(function(d) {return d.valueId != "0-0-0"}).length;
        // to be refactored asap please !
        var length = data.filter(function(d) {return d.valueId != "0-0-0-0-0-0-0-0-0-0-0-0-0-0"}).length;
        return (length == 0) ? true : false;
      }

      // function getXDomain() {
      //    return data[0].value.map(function(d) { return d.round; });
      // }

      function getYDomain() {
        // return data[0].value.map(function(d) {
        //   return d.category; }).sort(function(a,b) { return a-b; });

        return data[0].value.map(function(d) { return d.category; });
        //  return data[0].value.map(function(d) { return d.round; });
      }

      function getYExtent() {
        var values = [];
        data.forEach(function(d) {
          values = values.concat(d.value.map(function(v) {
            return v.count; })) });
        return d3.extent(values.map(function(d) { return toPercentage(d); }));
      }

      function toPercentage(val) {
        return Math.round((val/relativeTo)*100);
      }

      function _getDataBrushed(brush) {
        var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
        return data
          .map(function(d) { return d.key; })
          .filter(function(d) {
            return d >= extent[0] && d <= extent[1];
          });
      }
    });
  }

  // Getters and Setters
  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.margins = function(_) {
    if (!arguments.length) return margins;
    margins = _;
    return chart;
  };
  chart.data = function(_) {
    if (!arguments.length) return data;
    data = _;
    return chart;
  };
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
    return chart;
  };
  chart.elasticY = function(_) {
    if (!arguments.length) return elasticY;
    elasticY = _;
    return chart;
  };
  chart.x = function(_) {
    if (!arguments.length) return x;
    x = _;
    return chart;
  };
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.xAxis = function(_) {
    if (!arguments.length) return xAxis;
    xAxis = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };
  chart.hasYAxis = function(_) {
    if (!arguments.length) return hasYAxis;
    hasYAxis = _;
    return chart;
  };
  chart.lookUp = function(_) {
    if (!arguments.length) return lookUp;
    lookUp = _;
    return chart;
  };

  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };

  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
    return chart;
  };
  // chart.hasBrushLabel = function(_) {
  //   if (!arguments.length) return hasBrushLabel;
  //   hasBrushLabel = _;
  //   return chart;
  // };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.highlighted = function(_) {
    if (!arguments.length) return highlighted;
    highlighted = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
    return chart;
  };
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
    return chart;
  };
  // chart.brushExtentToMax = function(_) {
  //   if (!arguments.length) return brushExtentToMax;
  //   brushExtentToMax = _;
  //   return chart;
  // };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
