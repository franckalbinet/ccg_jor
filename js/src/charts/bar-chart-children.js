/* CREATE BAR CHART INSTANCE*/
d3.barChartChildren = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = null,
      y = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      yData = null,
      barHeight = 7,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      select = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      data = _transformData(data);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      // if (brushExtent) {
      //   brush.extent([brushExtent[0] - 0.5, brushExtent[1] - 0.5]);
      //   _gBrush.call(brush);
      //   brushExtent = null;
      //   _listeners.filtering(_getDataBrushed(brush));
      // }
      if (select) {
        var selection = select;
        select = null;
        _listeners.filtered(selection);
      }
      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.key; });
        rects.exit().remove();
        rects.enter().append("rect")
          .on("click", clickHandler)
          .on("mouseover", function(d) {
            d3.select(this)
              .attr("height", barHeight + 2)
              .attr("y", function(d) {
                return y(d.key) - barHeight/2 - 1 });
            d3.select(this).classed("hovered", true);
          })
          .on("mouseout", function(d) {
            d3.select(this)
              .attr("height", barHeight)
              .attr("y", function(d) {
                return y(d.key) - barHeight/2 })
            d3.select(this).classed("hovered", false);
          })

        rects
            .classed("not-selected", function(d) {
              return (selected.indexOf(d.key) === -1) ? true : false;
            })
            // .transition()
            .attr("x", function(d) { return 0; })
            .attr("y", function(d) {
              // return y(d.name) - barHeight/2  })
              return y(d.key) - barHeight/2  })
            .attr("width", function(d) {
              // return x(d.value.householdCount); })
              return x(d.relative); })
            .attr("height", function(d) { return barHeight; });

        // EXIT - ENTER - UPDATE PATTERN
        // var rects =  _gBars.selectAll("rect")
        //   .data(data, function(d) { return d.key; });
        // rects.exit().remove();
        // rects.enter().append("rect");
        // rects
        //     .classed("not-selected", function(d) {
        //       if (hasBrush) return (selected.indexOf(d.key) === -1) ? true : false;
        //       return false;
        //     })
        //     // .transition()
        //     .attr("x", function(d) { return 0; })
        //     .attr("y", function(d) {
        //       return y(d.key) - barHeight/2  })
        //     .attr("width", function(d) {
        //       // return x(d.values.length); })
        //       // return x(d.count); })
        //       return x(d.relative); })
        //     .attr("height", function(d) { return barHeight; });


      }

      function _skeleton() {
        // set scales range
        x.range([0 , _gWidth]);
        y.range([0, _gHeight]);

        // set brush
        // if (hasBrush) brush.y(y);

        xAxis
          .innerTickSize(-_gHeight)
          .tickPadding(5);

        // set axis
        xAxis.scale(x);
        yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        g.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "start")
          .attr("x", -15)
          .attr("y", -25)
          .text(title);

        d3.selectAll("#households-children .y.axis text")
          .data(["1","2","3","4","5","6","7+"])
          .text(function(d) { return d; })

        // _gBrush = g.append("g").attr("class", "brush").call(brush);
        // _gBrush.selectAll("rect").attr("width", _gWidth);
        //
        // brush.on("brush", function() {
        //   _listeners.filtering(_getDataBrushed(brush));
        // });
        //
        // brush.on("brushend", function() {
        //   _listeners.filtered(brush);
        // });
      }

      function clickHandler(d) {
        // if clicked rect is already selected
        if (selected.indexOf(d.key) != -1) {
          if (selected.length > 1) {
            _listeners.filtered(_.without(selected, d.key));
          }
        } else {
          selected.push(d.key);
          _listeners.filtered(selected);
        }
      }

      function _transformData(data) {
        // var sumOver7 = d3.sum(
        //   data.filter(function(d) { return d.key >= 7; })
        //   .map(function(d) { return d.values.length; })
        // )
        // data = data
        //   .filter(function(d) { return d.key < 7; })
        //   .map(function(d) { return {key: d.key, count: d.values.length}; });
        // data.push({key: 7, count: sumOver7});
        var sumOver7 = d3.sum(
          data.filter(function(d) { return d.key >= 7; })
          .map(function(d) { return d.relative; })
        )
        data = data
          .filter(function(d) { return d.key < 7; })
          .map(function(d) { return {key: d.key, relative: d.relative}; });
        data.push({key: 7, relative: sumOver7});
        return data;
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
  chart.xData = function(_) {
    if (!arguments.length) return xData;
    xData = _;
    return chart;
  };
  chart.yData = function(_) {
    if (!arguments.length) return yData;
    yData = _;
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
  // chart.brushClickReset = function(_) {
  //   if (!arguments.length) return brushClickReset;
  //   brushClickReset = _;
  //   return chart;
  // };
  // chart.clearBrush = function(_) {
  //   if (!arguments.length) {
  //     _gBrush.call(brush.clear());
  //     brush.event(_gBrush);
  //   }
  //   return chart;
  // };
  // chart.roundXDomain = function(_) {
  //   if (!arguments.length) return roundXDomain;
  //   roundXDomain = _;
  //   return chart;
  // };
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
  chart.select = function(_) {
    if (!arguments.length) return select;
    select = _;
    return chart;
  };
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.selected = function(_) {
    if (!arguments.length) return selected;
    selected = _;
    return chart;
  };
  chart.title = function(_) {
    if (!arguments.length) return title;
    title = _;
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
