/* CREATE BAR CHART INSTANCE*/
d3.barChartEducation = function() {
  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      elasticY = false,
      xDomain = null,
      title = "",
      xTitle = "",
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
      _gBars,
      _gFigures,
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

      d3.selectAll("#main-chart .x.axis text")
        .data(["June", "August", "November"])
        .text(function(d) { return d; });

      if (!isDataEmpty()) _render();

      function _render() {
        // EXIT - ENTER - UPDATE PATTERN - BARS
        var rects =  _gBars.selectAll("rect")
          .data(data, function(d) { return d.joinId; });
        rects.exit().remove();
        rects.enter().append("rect");
        rects
            // .transition()
            .attr("x", function(d) {
              return x(d.key) })
            .attr("width", x.rangeBand())
            .transition()
            .attr("y", function(d) {
              return y(d.rate)  })
            .attr("height", function(d) {
              return _gHeight - y(d.rate); });

        // EXIT - ENTER - UPDATE PATTERN - FIGURES
        var figures =  _gFigures.selectAll("text")
          .data(data, function(d) { return d.joinId; });
        figures.exit().remove();
        figures.enter().append("text");
        figures
            .attr("text-anchor", "middle")
            .text(function(d) {
              return d.rate + "%"})
            .attr("x", function(d) {
              return x(d.key) + x.rangeBand() / 2 })
            .transition()
            .attr("y", function(d) {
              return y(d.rate) - 10  });
      }

      function _transformData(data) {
        data.forEach(function(d) {
          var attended = d.value.filter(function(v) {
            return v.category == 1; })[0].count;

          var notAttended = d.value.filter(function(v) {
            return v.category == 2; })[0].count;
          d.rate = Math.ceil((attended/(attended+notAttended))*100);
        });
        data.forEach(function(d) { d.joinId = [d.key, d.rate].join("-"); });
        return data;
      }

      function isDataEmpty() {
        var countAll = [];
        data.forEach(function(d) {
          countAll.push(d3.sum(d.value.map(function(v) { return v.count; }))) });
        countAll = d3.sum(countAll);
        return (countAll) ? false : true;
      }

      function _skeleton() {
        x.domain([1,2,3]);
        x.rangeRoundBands([0, _gWidth], .4);
        y.domain([0, 100]);
        y.range([_gHeight, 0]);

        yAxis.tickValues([25, 50, 75, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);
        xAxis.scale(x);

        // create chart container
        g = div.append("svg")
            .classed("bar-chart-education", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gBars = g.append("g")
            .attr("class", "bars");

        _gFigures = g.append("g")
            .attr("class", "figures");

        // _gYAxis = g.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis);

        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (_gHeight + 3) + ")")
            .call(xAxis);

        var deltaX = d3.selectAll(".bar-chart-education .x.axis path.domain")
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
          .attr("y", -25)
          .text(title);
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
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
    return chart;
  };
  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
