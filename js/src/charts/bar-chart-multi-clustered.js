/* CREATE BAR CHART MULTI STACKED INSTANCE*/
d3.barChartMultiClustered = function() {
  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.scale.ordinal(),
      y = d3.scale.linear(),
      color,
      relativeTo = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      lookUpColors = null,
      lookUpX = null,
      barHeight = 7,
      barWidth = 11,
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left").tickValues([0, 25, 50, 75, 100]),
      // yAxis = d3.svg.axis().orient("left"),
      hasBrush = false,
      hasYAxis = true,
      title = "My title",
      xTitle = "My title",
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
      _gLabel,
      _gLegend,
      _dx,
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

      if (select) {
        var selection = select;
        select = null;
        _listeners.filtered(selection);
      }

      // d3.selectAll(".bar-chart-multi-stacked .x.axis text")
      //   .data(["June", "August", "November"])
      //   .text(function(d) { return d; });

      if (!isDataEmpty()) _render();

      function _render() {

        // container
        var cat = g.selectAll(".cat")
            .data(data, function(d) { return d.joinId; });

        cat.enter()
            .append("g")
            .attr("class", "cat")
            .attr("transform", function(d) {
              return "translate(" + (x(d.key)+x.rangeBand()/2) + ",0)"; });

        cat.exit().remove();

        // rect
        var rect = cat.selectAll("rect")
            .data(function(d) {
              return d.value; });

        rect.enter().append("rect");

        rect.exit().remove();

        rect
          .attr("width", function(d) {
            return _dx.rangeBand();
          })
          .style("fill", function(d) {
            return color(d.round);
          })
          .attr("transform", function(d) {
            return "translate(" + _dx(d.round) + ",0)"; })
          .transition()
          .attr("height", function(d) {
            return _gHeight - y(toPercentage(d.count)); })
          .attr("y", function(d) {
            return y(toPercentage(d.count)); });


      }

      function _transformData(data) {
        data.forEach(function(d) {
          d.joinId = d.value.map(function(v) {
            return v.round + "-" + v.count; }).join("--"); });

        return data;
      }

      function _skeleton() {

        // set scales range and domains
        x.domain([1,2,5,99]);
        x.rangeRoundBands([0, _gWidth], .3);
        y.domain([0, 100]);
        y.range([_gHeight, 0]);

        _dx = d3.scale.ordinal()
          .domain(color.domain())
          .rangeRoundBands([-x.rangeBand()/2, +x.rangeBand()/2], .1);

        yAxis.tickValues([25, 50, 75, 100]).tickFormat(function(d) { return d + " %"; });
        yAxis.scale(y);
        xAxis.scale(x);

        // create chart container
        g = div.append("svg")
            .classed("bar-chart-multi-clustered", true)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gYAxis = g.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (_gHeight + 3) + ")")
            .call(xAxis);

        _gXAxis.selectAll("text")
          .data(x.domain().map(function(d) { return lookUpX[d]; }))
          .text(function(d) { return d; });

        _gXAxis.selectAll("text").call(wrap, 1.3*x.rangeBand());

        // legend
        _gLegend = g.append("g").attr("class", "legends");

        var legend = _gLegend.selectAll(".legend")
            .data(color.domain().slice())
          .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", _gWidth + 10)
            .attr("y", _gHeight / 5)
            .attr("width", 14)
            .attr("height", 14)
            .style("fill", color);

        legend.append("text")
            .attr("x", _gWidth + 10 + 20)
            .attr("y", _gHeight / 5)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .text(function(d) { return lookUpColors[d] ; });

        var deltaX = d3.selectAll(".bar-chart-multi-clustered .x.axis path.domain")
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
      }

      function clickHandler(d) {
        if (selected.length > 1) {
          _listeners.filtered([d.key]);
        } else {
          if (selected[0] == d.key) {
            _listeners.filtered(null);
          } else {
            _listeners.filtered([d.key]);
          }
        }
      }

      function isDataEmpty() {
        var countAll = 0;
        data.forEach( function(d) {
          countAll += d3.sum(d.joinId.split("--").map(function(v) { return +v.split("-")[1]; }));
        })
        return (countAll) ? false : true;
      }

      function toPercentage(val, round) {
        var denominator = (typeof(relativeTo) === "object") ?
          relativeTo[round] : relativeTo;
        return Math.round((val/denominator)*100);
      }

      function _getDataBrushed(brush) {
        var extent = brush.extent().map(function(d) { return Math.floor(d) + 0.5;});
        return data
          .map(function(d) { return d.key; })
          .filter(function(d) {
            return d >= extent[0] && d <= extent[1];
          });
      }

      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
      }
    }
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
  chart.relativeTo = function(_) {
    if (!arguments.length) return relativeTo;
    relativeTo = _;
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
  chart.select = function(_) {
    if (!arguments.length) return select;
    select = _;
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
  chart.lookUpColors = function(_) {
    if (!arguments.length) return lookUpColors;
    lookUpColors = _;
    return chart;
  };
  chart.lookUpX = function(_) {
    if (!arguments.length) return lookUpX;
    lookUpX = _;
    return chart;
  };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
