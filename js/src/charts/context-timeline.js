/* CREATE CONTEXT TIME LINE INSTANCE*/
d3.contextTimeline = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      x = d3.time.scale(),
      xAxisTop = d3.svg.axis().orient("top"),
      xAxisBottom = d3.svg.axis().orient("bottom"),
      xAxis = d3.svg.axis().orient("bottom"),
      yAxis = d3.svg.axis().orient("left");

  var _gWidth = 400,
      _gHeight = 100,
      _gXAxisTop,
      _gXAxisBottom,
      _gDateLabelTop,
      _gDateLabelBottom,
      _gCommentTop,
      _gCommentBottom,
      _gLineTop,
      _gLineBottom,
      _listeners = d3.dispatch("filtered", "filtering");

  function chart(div) {
    _gWidth = width - margins.left - margins.right;
    _gHeight = height - margins.top - margins.bottom;
    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");


      // create the skeleton chart.
      if (g.empty()) _skeleton();

      _render();

      function _render() {
      }

      function _skeleton() {
        // set scales range
        x.range([0, _gWidth]).domain([new Date(2015,01,15), new Date(2016,00,01)]);

        // set axis
        xAxisTop.scale(x).tickValues(data.filter(function(d) { return d.position == "top"; }).map(function(d) { return d.date; }));
        xAxisBottom.scale(x);
        xAxisBottom.scale(x).tickValues(data.filter(function(d) { return d.position == "bottom"; }).map(function(d) { return d.date; }));
        xAxisBottom.scale(x);

        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        // set x top Axis
        _gXAxisTop = g.append("g")
            .attr("class", "x axis top")
            .attr("transform", "translate(0," + _gHeight + ")")
            .call(xAxisTop);

        // set x bottom Axis
        _gXAxisBottom = g.append("g")
            .attr("class", "x axis bottom")
            .attr("transform", "translate(0," + _gHeight + ")")
            .call(xAxisBottom);

        _gDateLabelTop = g.append("g")
            .attr("class", "labels-top")
            .attr("transform", "translate(0," + (_gHeight - 10) + ")");

        _gDateLabelBottom = g.append("g")
            .attr("class", "labels-bottom")
            .attr("transform", "translate(0," + (_gHeight + 20) + ")");

        // text positioning
        // top
        _gCommentTop = g.append("g")
            .attr("class", "comments-top");

        _gDateLabelTop.selectAll("label-top")
            .data(data.filter(function(d) { return d.position == "top"; }))
          .enter().append("text")
            .attr("id", function(d) { return "id-" + d.id; })
            .attr("x", function(d) { return x(d.date); })
            .text(function(d) { return d["date-label"]; });

        _gCommentTop.selectAll("comment-top")
            .data(data.filter(function(d) { return d.position == "top" && d.comment != ""; }))
          .enter().append("g")
            .attr("class", "comment-top")
            .attr("id", function(d) { return "id-" + d.id; })
            .attr("transform", function(d) { return "translate(" + x(d.date)+ ",0)"; })
          .append("text")
            .attr("dy", 0)
            .attr("y", _gHeight - 70)
            .attr("x", 0)
            .text(function(d) { return d["comment"]; });

        _gCommentTop.selectAll(".comment-top text")
          .call(wrap, 140);


        d3.selectAll(".comment-top#id-9 tspan ")
          .attr("y", 30);

        d3.selectAll(".comment-top#id-11 tspan ")
          .attr("y", 30);

        // d3.selectAll(".comment-top#id-15 tspan ")
        //   .attr("y", -15);

        // bottom
        _gCommentBottom = g.append("g")
            .attr("class", "comments-bottom");

        _gDateLabelBottom.selectAll("label-bottom")
            .data(data.filter(function(d) { return d.position == "bottom"; }))
          .enter().append("text")
            .attr("id", function(d) { return "id-" + d.id; })
            .attr("x", function(d) { return x(d.date); })
            .text(function(d) { return d["date-label"]; });

        _gDateLabelBottom.selectAll("label-bottom")
            .data(data.filter(function(d) { return d.position == "bottom"; }))
          .enter().append("text")
            .attr("x", function(d) { return x(d.date); })
            .text(function(d) { return d["date-label"]; });

        _gCommentBottom.selectAll("comment-bottom")
            .data(data.filter(function(d) { return d.position == "bottom" && d.comment != ""; }))
          .enter().append("g")
            .attr("class", "comment-bottom")
            .attr("id", function(d) { return "id-" + d.id; })
            .attr("transform", function(d) { return "translate(" + x(d.date)+ ",0)"; })
          .append("text")
            .attr("dy", 0)
            .attr("y", _gHeight + 30)
            .attr("x", 0)
            .text(function(d) { return d["comment"]; });

          _gCommentBottom.selectAll(".comment-bottom text")
            .call(wrap, 140);

          d3.selectAll(".comment-bottom#id-16 tspan ")
            .attr("y", _gHeight + 65);

          d3.selectAll(".comment-bottom#id-15 tspan ")
            .attr("y", _gHeight + 105);

          // lines
          // top
          _gLineTop = g.append("g")
              .attr("class", "lines-top");

          g.selectAll(".comment-top text").each(function(d) {
            var last = d3.select(_.last(d3.select(this).selectAll("tspan")[0])),
                dy = +last.attr("dy"),
                y = dy + (+last.attr("y")) + 5;
                _gLineTop.append("path")
                  .attr("id", "id-" + d.id)
                  .attr("d", "M" + x(d.date) + "," + y + "L" + x(d.date) + ",110");
          })

          d3.select("path#id-11").remove();

          // bottom
          _gLineBottom = g.append("g")
              .attr("class", "lines-bottom");

          g.selectAll(".comment-bottom text").each(function(d) {
            var first = d3.select(this).select("tspan"),
                y = +first.attr("y") - 10;
                _gLineBottom.append("path")
                  .attr("id", "id-" + d.id)
                  .attr("d", "M" + x(d.date) + "," + y + "L" + x(d.date) + ",145");
          })

          // finetune styling
          g.select(".comments-top #id-7 text").classed("critical", true);
          g.select(".comments-top #id-9 text").classed("critical", true);

          g.select(".comments-bottom #id-15 text").classed("critical", true);
          g.select(".comments-bottom #id-5 text").classed("highlight", true);
          g.select(".comments-bottom #id-8 text").classed("highlight", true);
          g.select(".comments-bottom #id-13 text").classed("highlight", true);

          g.select(".lines-top #id-7").classed("critical", true);
          g.select(".lines-top #id-9").classed("critical", true);
          g.select(".lines-bottom #id-15").classed("critical", true);

          // add manual text
          // g.append("text")
          //   .attr("x", -30)
          //   .attr("y", 155)
          //   .style("font-weight", "bold")
          //   .style("font-size", "10px")
          //   .style("font-size", "10px")
          //   .style("fill", "#555")
          //   .text("CCG payment: ");

          // g.append("text")
          //   .attr("x", 0)
          //   .attr("y", 250)
          //   .style("font-weight", "bold")
          //   .style("font-size", "12px")
          //   .style("fill", "#555")
          //   .text("* Bi-monthly monitoring conducted");
      }

      function wrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 12, // px
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy);
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy ).text(word);
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

  chart.on = function (event, listener) {
    _listeners.on(event, listener);
    return chart;
  };

  return chart;
};
