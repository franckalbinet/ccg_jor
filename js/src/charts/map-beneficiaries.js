/* MAP BENEFICIARIES INSTANCE*/
d3.mapBeneficiaries = function() {

  var width = 400,
      height = 100,
      margins = {top: 10, right: 25, bottom: 30, left: 20},
      data = null,
      title = "My title";

  var _gWidth = 400,
      _gHeight = 100,
      _projection = null,
      _gLabels = null,
      _gLines = null,
      _figureFormat = d3.format(",");
      _circleScale = d3.scale.sqrt(),
      _leftLabelAxis = null,
      _rightLabelAxis = null,
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

        // _gAdmin.append("path")
        // .datum(topojson.mesh(data.polygons, data.polygons.objects.gov, function(a, b) { return a == b; }))
        // .attr("class", "admin-background")
        // .attr("d", _path);

        _gAdmin.selectAll("path")
            // .data(data.polygons)
            .data(topojson.feature(data.polygons, data.polygons.objects.gov).features)
            // .data(topojson.mesh(data.polygons, data.polygons.objects.gov, function(a, b) { return a !== b; }).features)
          .enter().append("path")
            .attr("class", "admin-boundaries")
            .attr("d", _path);


        _gPop.selectAll(".centroid")
            .data(data.centroids.features.sort(function(a,b) {
              return b.properties.count - a.properties.count; }))
          .enter().append("circle")
            .attr("class", "centroid")
            .attr("data-id", function(d) { return d.properties.adm1_code; })
            .classed("empty", function(d) {
              return (d.properties.adm1_code == 1705 || d.properties.adm1_code == 1707);
            })
            .attr("transform", function(d) {
              return "translate(" + _projection(d.geometry.coordinates) + ")"; })
            .attr("r", function(d) {
              return _circleScale(d.properties.count);
            });

        // refactoring required
        // left labels
        var _dataLeft = data.centroids.features
            .filter(function(d) {
              return d.properties.lon < 36.4 && [1705,1707].indexOf(d.properties.adm1_code) == -1 ; })
            .sort(function(a,b) {
              return b.properties.lat - a.properties.lat; });

        _leftLabelAxis.domain(d3.range(0, _dataLeft.length));

        var _leftLabel = _gLabels.selectAll("label-left")
            .data(_dataLeft)
          .enter().append("g")
            .attr("class", "label label-left")
            .attr("data-id", function(d) { return d.properties.adm1_code; })
            .attr("transform", function(d, i) {
              return "translate(200," + _leftLabelAxis(i) + ")"; });

        _leftLabel.append("text")
          .attr("class", "admin-name")
          .text(function(d) {
            return Vis.DEFAULTS.LOOKUP_CODES.GOVERNORATES_MAP[d.properties.adm1_code]; })
          .attr("dy", -15);

        _leftLabel.append("text")
          .attr("class", "admin-count")
          .text(function(d) { return _figureFormat(d.properties.count); });

        // right labels
        var _dataRight = data.centroids.features
            .filter(function(d) {
              return d.properties.lon > 36.4 && [1705,1707].indexOf(d.properties.adm1_code) == -1 ; })
            .sort(function(a,b) {
              return b.properties.lat - a.properties.lat; });

        _rightLabelAxis.domain(d3.range(0, _dataRight.length));

        var _rightLabel = _gLabels.selectAll("label-right")
            .data(_dataRight)
          .enter().append("g")
            .attr("class", "label label-right")
            .attr("data-id", function(d) { return d.properties.adm1_code; })
            .attr("transform", function(d, i) {
              return "translate(600," + _rightLabelAxis(i) + ")"; });

        _rightLabel.append("text")
          .attr("class", "admin-name")
          .text(function(d) {
            return Vis.DEFAULTS.LOOKUP_CODES.GOVERNORATES_MAP[d.properties.adm1_code]; })
          .attr("dy", -15);

        _rightLabel.append("text")
          .attr("class", "admin-count")
          .text(function(d) { return _figureFormat(d.properties.count); });

        // center labels
        var _dataCenter = data.centroids.features
            .filter(function(d) { return [1705,1707].indexOf(d.properties.adm1_code) != -1 ; });

        var _centerLabel = _gLabels.selectAll("label-center")
            .data(_dataCenter)
          .enter().append("g")
            .attr("class", "label label-center")
            .attr("data-id", function(d) { return d.properties.adm1_code; })
            .attr("transform", function(d, i) {
              var _pos = _path.centroid(d);
              _pos[0] += -18;
              _pos[1] += 10;
              return "translate(" + _pos + ")"; })

        _centerLabel.append("text")
          .attr("class", "admin-name")
          .text(function(d) {
            return Vis.DEFAULTS.LOOKUP_CODES.GOVERNORATES_MAP[d.properties.adm1_code]; })
          .attr("dy", -15);

        _centerLabel.append("text")
          .attr("class", "admin-count")
          .text(function(d) { return _figureFormat(d.properties.count); });

        // lines
        _gLabels.selectAll(".label-left")[0].forEach(function(d,i) {
          _gLines.append("path")
            .attr("class", "label-line")
            .attr("d", function(v) {
              var _centroidCoord = _projection(d.__data__.geometry.coordinates);
              _centroidCoord[0] += -_circleScale(d.__data__.properties.count) - 3;
              return "M260," + (_leftLabelAxis(i)-15) + "h20L" + _centroidCoord[0] + "," + _centroidCoord[1];
            })
        })

        _gLabels.selectAll(".label-right")[0].forEach(function(d,i) {
          _gLines.append("path")
            .attr("class", "label-line")
            .attr("d", function(v) {
              var _centroidCoord = _projection(d.__data__.geometry.coordinates);
              _centroidCoord[0] += _circleScale(d.__data__.properties.count) + 3;
              return "M580," + (_rightLabelAxis(i)-15) + "h-20L" + _centroidCoord[0] + "," + _centroidCoord[1];
            })
        })


      }

      function _skeleton() {
        // create chart container
        g = div.append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

        _circleScale
          .domain(d3.extent(data.centroids.features, function(d) { return d.properties.count; }))
          .range([2, 40]);

        _gAdmin = g.append("g")
            .attr("class", "admin-boundaries");

        _gPop = g.append("g")
            .attr("class", "population");

        _gLabels = g.append("g")
            .attr("class", "labels");

        _gLines = g.append("g")
            .attr("class", "lines");

        _projection = d3.geo.mercator()
          .center([32, 36])
          .scale(4000)
          .translate([70, -260]);

        _path = d3.geo.path()
          .projection(_projection);


        _leftLabelAxis = d3.scale.ordinal()
          .rangeRoundPoints([30, _gHeight]);

        _rightLabelAxis = d3.scale.ordinal()
          .rangeRoundPoints([30, _gHeight]);

        g.append("text")
            .attr("class", "title")
            .attr("x", _gWidth/2.2)
            .attr("y", -50)
            .attr("dy", ".35em")
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
