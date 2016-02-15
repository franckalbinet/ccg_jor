/* CREATE MULTI SERIES TIME LINE CHART INSTANCE*/
d3.multiSeriesTimeLine = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      relativeTo = null,
      lookUp = null,
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
      brushClickReset = false,
      brush = d3.svg.brush(),
      brushExtent = null,
      selected = null;

  var _gWidth = 400,
      _gHeight = 100,
      _handlesWidth = 9,
      _gBrush,
      _gXAxis,
      _gYAxis,
      _line,
      _listeners = d3.dispatch("filtered", "filtering");

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
        var item = g.selectAll(".item")
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
          .transition()
          .attr("d", function(d) {
            return _line(d.value);
          });

        // circles
        var circles = item.selectAll(".points")
          // .data(function(d){ return d.value}, function(d) { return d.valueId; });
          .data(function(d){ return d.value});

        circles.enter().append("circle").attr("class", "points");

        circles.exit().remove();

        circles
          .attr("r", function(d) {
            return 3})
            .attr("cx", function(d) {
              return x(d.round); })
          .transition()
          .attr("cy", function(d) {
            return y(toPercentage(d.count)); });

        // text
        // var texts = item.selectAll("")
        var texts = item.selectAll("text")
          .data(function(d) {
            return [{name: d.key, value: d.value[d.value.length - 1]}]});

        texts.enter().append("text")
          .text(function(d) {
            return lookUp[d.name]; });

        texts.exit().remove();

        texts
          .transition()
          .attr("transform", function(d) {
            return "translate(" + x(d.value.round) + "," + y(toPercentage(d.value.count)) + ")"; })
          .attr("x", 5)
          .attr("dy", ".35em");
      }

      function _skeleton() {
        // set scales range
        x.rangePoints([0 , _gWidth]);
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
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        // set x Axis
        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _gHeight + ")")
            .call(xAxis);

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

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
