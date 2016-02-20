/* CREATE MULTI SERIES TIME LINE CHART INSTANCE*/
d3.multiSeriesTimeLine = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      relativeTo = null,
      lookUp = null,
      color = null,
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      elasticY = false,
      xDomain = null,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      // yAxis = d3.svg.axis().orient("left").ticks(4),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
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
      _listeners = d3.dispatch("highlighted");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;

    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      x.domain(getXDomain());
      y.domain([0, 100]);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      _gYAxis.call(yAxis);

      data.forEach(function(d) {
        d.valueId = d.value.map(function(v) {
          return v.count; }).join("-"); });

      if (!isDataEmpty()) _render();

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
            return _line(d.value);
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
            return 3})
            .attr("cx", function(d) {
              return x(d.round); })
          .transition()
          .attr("cy", function(d) {
            return y(toPercentage(d.count)); });


        var legend = _gLegend.selectAll(".legend")
          .data(getSortedKeys(), function(d) { return d.key; });

        legend.enter()
          .append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })
          .on("mouseover", function(d) {
            if (highlighted && highlighted[0] !== d.key) {
              _listeners.highlighted([d.key]);
              // console.log("mouseover");
            }
          })
          .on("mouseout", function(d) {
            // console.log("mouseout");
            _listeners.highlighted([]);
          });

        legend.exit().remove();

        legend
          .classed("highlighted", function(d) {
            if (highlighted.length == 0) return false;
            return (highlighted.indexOf(d.key) !== -1) ? true : false;
          })
          .transition()
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        if (!_hasLegend) {
          legend.append("text")
              .attr("x", _gWidth + 50 + 30)
              .attr("y", 0)
              .attr("dy", "0.3em")
              .style("text-anchor", "start")
              .text(function(d) { return lookUp[d.key] ; });

          legend.append("line")
              .attr("x1", _gWidth + 50)
              .attr("x2", _gWidth + 75)
              .attr("y1", 0)
              .attr("y2", 0)
              .style("stroke", function(d) { return color(d.key); });

          legend.append("circle")
              .attr("cx", _gWidth + 63)
              .attr("cy", 0)
              .attr("r", 3)
              .style("fill", function(d) { return color(d.key); });

          _hasLegend = true;
        }
      }

      function _setFigures(feature) {
        feature.value.forEach(function(d) {
          _gFigures.append("text")
            .attr("x", function() { return x(d.round); } )
            .attr("y", function() { return y(toPercentage(d.count)); } )
            .attr("dy", -8)
            .attr("text-anchor", "middle")
            .text(toPercentage(d.count) + "%")
        })

      }

      function _clearFigures() {
        _gFigures.selectAll("text").remove();
      }

      function _skeleton() {
        // set scales range
        x.rangePoints([0 , _gWidth], 0.3);
        y.range([_gHeight, 0]);

        // set axis
        xAxis.scale(x);
        yAxis.scale(y).tickFormat(function(d) { return d + "%"; });

        _line = d3.svg.line()
          .interpolate("linear")
          .x(function(d) { return x(d.round); })
          .y(function(d) { return y(toPercentage(d.count)); });

        // create chart container
        g = div.append("svg")
            .classed("time-line", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gItems = g.append("g").attr("class", "items");

        _gFigures = g.append("g").attr("class", "figures");

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
        var length = data.filter(function(d) {return d.valueId != "0-0-0"}).length;
        return (length == 0) ? true : false;
      }

      function getXDomain() {
         return data[0].value.map(function(d) { return d.round; });
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
