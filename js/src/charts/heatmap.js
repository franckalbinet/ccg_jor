/* CREATE BAR CHART MULTI STACKED INSTANCE*/
d3.heatmap = function() {
  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.scale.ordinal(),
      y = d3.scale.ordinal(),
      color,
      id = null,
      relativeTo = null,
      elasticY = false,
      xData = null,
      xDomain = null,
      lookUp = null,
      hasNames = true,
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
      _yCategories = null,
      _gCells,
      _gNames,
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
          // g = div.select(".heatmap #id-" + id + " g");
          g = div.select("g");

      id = "#" + d3.select(this).attr("id");

      data = _transformData(data);

      // create the skeleton chart.
      if (g.empty()) _skeleton();

      // if (select) {
      //   var selection = select;
      //   select = null;
      //   _listeners.filtered(selection);
      // }

      // d3.select(this).attr("id")

      d3.selectAll(id + " .x.axis text")
        .data(["Jun.", "Aug.", "Nov."])
        .text(function(d) { return d; });

      if (!isDataEmpty()) _render();

      function _render() {
        // join
        var cells = _gCells.selectAll(".cell")
              .data(data, function(d) {
                return d.joinId; });

        // enter
        cells
          .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("width", x.rangeBand())
            .attr("height", y.rangeBand());

        // exit
        cells.exit().remove();

        // update
        cells
          .attr("x", function(d) {
            return x(d.round); })
          .attr("y", function(d) {
            return y(d.key); })
          .attr("fill", function(d) { return color(toPercentage(d.count)); });
      }

      function _transformData(data) {
        var flatData = [];

        if(!_yCategories) _yCategories = _.without(data.map(function(d) {
          return d.key; }).sort(function(a, b) { return a - b; }), 97);

        data.filter(function(d) { return d!== 97; }).forEach(function(d) {
          d.value.forEach(function(v) { return v.key = d.key });
          flatData.push(d.value);
        });

        flatData = _.flatten(flatData);
        flatData.forEach(function(d) { return d.joinId = _.values(d).join("-");});

        return flatData;
      }

      function _skeleton() {
        // set scales range and domains
        x.domain([1,2,3]);
        x.rangeBands([0, _gWidth]);

        y.domain(_yCategories);
        y.rangeBands([_gHeight, 0]);

        // yAxis.tickValues([25, 50, 75, 100]).tickFormat(function(d) { return d + " %"; });
        // yAxis.scale(y);
        xAxis.scale(x);

        // create chart container
        g = div
            .append("div").classed("heatmap", true)
            .append("svg")
            // .attr("id", "id-" + id)
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        // g = div.append("svg")
        //     .classed("heatmap", true)
        //     .attr("id", "id-" + id)
        //     .attr("width", width)
        //     .attr("height", height)
        //   .append("g")
        //     .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _gCells = g.append("g")
            .attr("class", "cells");

        // _gYAxis = g.append("g")
        //     .attr("class", "y axis")
        //     .call(yAxis);

        _gXAxis = g.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + (_gHeight + 3) + ")")
            .call(xAxis);

        // names
        if (hasNames) {
          _gNames = g.append("g")
              .attr("class", "names");

          _gNames.selectAll("name")
                .data(_yCategories)
              .enter()
                .append("text")
                .attr("x", _gWidth + 10)
                .attr("y", function(d) { return y(d); })
                .attr("dy", "1.1em")
                .style("text-anchor", "start")
                .text(function(d) { return lookUp[d] ; });
        }

        // legend
        // _gLegend = g.append("g").attr("class", "legends");

        // var legend = _gLegend.selectAll(".legend")
        //     .data(color.domain().slice().reverse())
        //   .enter().append("g")
        //     .attr("class", "legend")
        //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        //
        // legend.append("rect")
        //     .attr("x", _gWidth + 50)
        //     .attr("y", _gHeight / 5)
        //     .attr("width", 14)
        //     .attr("height", 14)
        //     .style("fill", color);
        //
        // legend.append("text")
        //     .attr("x", _gWidth + 50 + 20)
        //     .attr("y", _gHeight / 5)
        //     .attr("dy", "1em")
        //     .style("text-anchor", "start")
        //     .text(function(d) { return lookUp[d] ; });

        var deltaX = d3.select(id + " .x.axis path.domain")
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
          .attr("y", -15)
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
        return (d3.sum(data.map(function(d) { return d.count; }))) ? false : true;
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
  chart.hasNames = function(_) {
    if (!arguments.length) return hasNames;
    hasNames = _;
    return chart;
  };
  chart.xTitle = function(_) {
    if (!arguments.length) return xTitle;
    xTitle = _;
    return chart;
  };
  chart.id = function(_) {
    if (!arguments.length) return id;
    id = _;
    return chart;
  };
  chart.lookUp = function(_) {
    if (!arguments.length) return lookUp;
    lookUp = _;
    return chart;
  };

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
