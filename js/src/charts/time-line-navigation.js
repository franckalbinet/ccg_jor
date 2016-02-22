/* CREATE TIME LINE NAVIGATION INSTANCE*/
d3.timeLineNavigation = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = null,
      y = null,
      elapsed = null,
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
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _wasElapsed = null,
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _listeners = d3.dispatch("browsing");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      // if (brushExtent) {
      //   brush.extent([brushExtent[0] - 0.5, brushExtent[1] - 0.5]);
      //   _gBrush.call(brush);
      //   brushExtent = null;
      //   _listeners.filtering(_getDataBrushed(brush));
      // }
      _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN - CIRCLES
        var circles =  _gCircles.selectAll("circle")
          .data(data);
        circles.exit().remove();
        circles.enter().append("circle");
        circles
            .classed("elapsed", function(d) {
              var page = elapsed.page,
                  chapter = elapsed.chapter;
              return (+(d.page + d.chapter) <= (10 * page + chapter)) ?
                true : false;
            })
            .attr("cx", function(d) {
              return x(d.time); })
            .attr("cy", 0)
            .attr("r", function(d) { return (d.isMain) ? 6:3; })
            .on("mouseover", function(d) {
                var _wasElapsed = d3.select(this).classed("elapsed"),
                    radius = (d.isMain) ? 8 : 5;
                d3.select(this)
                .transition(100)
                .attr("r", radius);
            })
            .on("mouseout", function(d) {
                var _isElapsed = d3.select(this).classed("elapsed"),
                    radius = (d.isMain) ? 6 : 3;

                d3.select(this)
                .classed("elapsed", _wasElapsed || _isElapsed)
                .transition(100)
                .attr("r", radius);
            })
            .on("click", function(d) {
              d3.select(this).classed("elapsed", true)
              _listeners.browsing({page: +d.page, chapter: +d.chapter});
            });

        // EXIT - ENTER - UPDATE PATTERN - Ticks
        var lines =  _gTicks.selectAll("line")
          .data(data.filter(function(d) { return d.isMain === true; }));
        lines.exit().remove();
        lines.enter().append("line");
        lines
            .attr("x1", function(d) { return x(d.time); })
            .attr("y1", function(d,i) {
              return (i%2 == 0) ? 14 : -14;
            })
            .attr("x2", function(d) { return x(d.time); })
            .attr("y2", function(d,i) {
              return (i%2 == 0) ? 10 : -10;
            });


        // EXIT - ENTER - UPDATE PATTERN - Labels
        var labels =  _gLabels.selectAll("text")
          .data(data.filter(function(d) { return d.isMain === true; }));
        labels.exit().remove();
        labels.enter().append("text");
        labels
            .text(function(d) { return d.title})
            .attr("text-anchor", "middle")
            .attr("x", function(d) { return x(d.time); })
            .attr("y", function(d,i) {
              return (i%2 == 0) ? 24 : -18;
            })
            .classed("elapsed", function(d) {
              var page = elapsed.page,
                  chapter = elapsed.chapter;
              // return (+(d.page + d.chapter) <= (10 * page + chapter)) ?
              return (d.page == page) ?
                true : false;
            })

      }

      function _skeleton() {
        // set scales range
        x.range([0 , _gWidth]);
        // y.range([0, _gHeight]);

        // set brush
        // if (hasBrush) brush.y(y);

        // xAxis
        //   .innerTickSize(-_gHeight)
        //   .tickPadding(5);

        // set axis
        // xAxis.scale(x);
        // yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gCircles = g.append("g")
            .attr("class", "circles");

        _gTicks = g.append("g")
            .attr("class", "ticks");

        _gLabels = g.append("g")
            .attr("class", "labels");

        // set x Axis
        // _gXAxis = g.append("g")
        //     .attr("class", "x axis")
        //     .call(xAxis);
        //
        // _gYAxis = g.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis);

        // g.append("text")
        //   .attr("class", "x label")
        //   .attr("text-anchor", "start")
        //   .attr("x", -15)
        //   .attr("y", -25)
        //   .text(title);

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

      // function _getDataBrushed(brush) {
      //   var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
      //   return data
      //     .map(function(d) { return d.key; })
      //     .filter(function(d) {
      //       return d >= extent[0] && d <= extent[1];
      //     });
      // }
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
  chart.brushExtent = function(_) {
    if (!arguments.length) return brushExtent;
    brushExtent = _;
    return chart;
  };
  chart.elapsed = function(_) {
    if (!arguments.length) return elapsed;
    elapsed = _;
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
