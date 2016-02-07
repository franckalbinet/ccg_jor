/* CREATE BAR CHART STACKEDINSTANCE*/
d3.barChartStackedSingle = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      y = d3.scale.linear(),
      color,
      elasticY = false,
      xData = null,
      xDomain = null,
      barHeight = 7,
      barWidth = 11,
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
      _gBars,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _gLabel,
      _gLegend,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      data = _transformData(data);

      // if(_isDataEmpty(data)) g.remove();

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
        // EXIT - ENTER - UPDATE PATTERN
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.key; });
        rects.exit().remove();
        rects.enter().append("rect");
        rects
            .classed("not-selected", function(d) {
              // if (hasBrush) return (selected.indexOf(d.key) === -1) ? true : false;
              // return false;
            })
            .attr("x", function(d) { return 0; })
            .attr("width", function(d) {
              return barWidth; })
            .transition(50)
            .attr("y", function(d) {
              return y(d.y1); })
            .attr("height", function(d) {
              return y(d.y0) - y(d.y1); })
            .style("fill", function(d) { return color(d.name); });

          _gLabel
            .transition(50)
            .attr("transform", "translate(" + 0 + "," + y(data[0].y1) + ")");
          _gLabel.select("text").text(data[0].y1 + "%");



      }

      function _transformData(data) {
        var y0 = y1 = 0;

        data.sort(function(a, b) { return b.key - a.key; });

        data.forEach(function(d) {
          y0 = y1;
          d.y0 = y0;
          d.y1 = y1 += d.value.householdCount;
        })

        data.forEach(function(d) {
          d.y0 = Math.round((d.y0 / data[data.length-1].y1) * 100);
          d.y1 = Math.round((d.y1 / data[data.length-1].y1) * 100);
        })

        return data;
      }

      function _skeleton() {
        // set scales range
        y.rangeRound([_gHeight, 0]);
        y.domain([0, 100]);

        yAxis.tickValues([50, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // label showing intermediate percentage
        _gLabel = g.append("g").attr("class", "label");
        _gLabel.append("line")
          .attr("x1", barWidth).attr("y1", 0)
          .attr("x2", barWidth + 8).attr("y2", 0)
        _gLabel.append("text")
          .attr("x", barWidth + 12).attr("y", 0)
          .attr("dy", +3);

        // legend
        _gLegend = g.append("g").attr("class", "legends");

        var legend = _gLegend.selectAll(".legend")
            .data(color.domain().slice().reverse())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            // .attr("x", width - 18)
            .attr("x", -60)
            .attr("y", 25)
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", color);

        legend.append("text")
            .attr("x", -42)
            .attr("y", 32)
            .attr("dy", ".35em")
            .style("text-anchor", "start")
            .text(function(d) { return d; });

        g.append("text")
          .attr("class", "x label")
          .attr("text-anchor", "start")
          .attr("x", -60)
          .attr("y", -25)
          .text(title);
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
  chart.y = function(_) {
    if (!arguments.length) return y;
    y = _;
    return chart;
  };
  chart.color = function(_) {
    if (!arguments.length) return color;
    color = _;
    return chart;
  };
  chart.yAxis = function(_) {
    if (!arguments.length) return yAxis;
    yAxis = _;
    return chart;
  };

  chart.hasBrush = function(_) {
    if (!arguments.length) return hasBrush;
    hasBrush = _;
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

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
