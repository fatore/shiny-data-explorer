(function() {

var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  return $(scope).find(".d3-biplot");
};

binding.renderValue = function(el, data) {
  console.log(data);

  if (!data) {
    return;
  }

  // set svg internal margin
  var margin = {top: 40, right: 20, bottom: 30, left: 40};

  // save space for the legend
  var legendBoxWidth = 100;

  // svg dimensions
  var width = el.clientWidth - margin.left - margin.right - legendBoxWidth;
  var height = el.clientHeight - 10 - margin.top - margin.bottom;

  // svg internal padding
  var padding = 15;

  // Get element state
  var $el = $(el);
  var state = $el.data("state");

  // Init element
  if (!state) {
    var svg = d3.select(el).append("svg")
        .attr("width", width + margin.left + margin.right + legendBoxWidth)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    d3.select(el).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // x-axis
    svg.append("g")
        .attr("class", "x grid")
        .attr("transform", "translate(0," + height + ")");

    // y-axis
    svg.append("g")
        .attr("class", "y grid");

    svg.append("g")
      .attr("class", "legend-box");

    // define marker
    svg.append("svg:defs").selectAll("marker")
        .data(["arrow"])
      .enter().append("svg:marker")
        .attr("id", String)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", 2)
        .attr("refY", 5)
        .attr("markerWidth", 7)
        .attr("markerHeight", 7)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z");

    $el.data("state", {
      svg: svg
    });

    state = $el.data("state")
  }

  var points = data.points;
  var axis = data.axis;

  var xValue = function(d) { return d.x;};
  var yValue = function(d) { return d.y;};

  var xPointsScale = d3.scale.linear()
      .range([padding, width - padding])
      .domain([d3.min(points, xValue), d3.max(points, xValue)]);

  var yPointsScale = d3.scale.linear()
      .range([height - padding, padding])
      .domain([d3.min(points, yValue), d3.max(points, yValue)]);

  var xAxisScale = d3.scale.linear()
      .range([padding, width - padding])
      .domain([d3.min(axis, xValue), d3.max(axis, xValue)]);

  var yAxisScale = d3.scale.linear()
      .range([height - padding, padding])
      .domain([d3.min(axis, yValue), d3.max(axis, yValue)]);

  // setup radius scale
  var rScale = d3.scale.linear()
    .domain([100, 10000])
    .range([6, 2])
    .clamp(true);

  var r = rScale(points.length);

  // setup fill color
  var cValue = function(d) { return d.classValue;};
  var color = d3.scale.ordinal()
      .range(d3.scale.category10().range().slice(0, data.pointsClassDomain.length))
      .domain(data.pointsClassDomain);

  // get the svg selection
  var svg = state.svg;

  // get the tooltip selection
  var tooltip = d3.select(el).select(".tooltip");

  // Bind the data
  var circles = svg.selectAll("circle.point")
    .data(points, function(d) {
      return data.dsName + "-" + d.label;
    });

  // Remove old elements
  circles.exit().remove();

  // Add new elements
  circles.enter().append("circle")
    .attr("class", "point")
    .attr("cx", 0)
    .attr("cy", 0)
    .on("click", function(d) {
      console.log(d);
    })
    .on("mouseout", mouseOut);

  circles
    .on("mouseover", mouseOver)
    .transition()
    .duration(1000)
    .attr("cx", function(d) {return xPointsScale(xValue(d));})
    .attr("cy", function(d) {return yPointsScale(yValue(d));})
    .attr("fill", function(d) {
      return color(cValue(d));
    })
    .attr("r", r);

  // add invisible circles for interaction
  var tipCircles = svg.selectAll("circle.tip")
    .data(axis, function(d) {
      return data.dsName + "-" + d.label;
    });

  // Remove old elements
  tipCircles.exit().remove();

  // Add newtip elements
  tipCircles.enter().append("circle")
    .attr("class", "tip")
    .style("opacity", 0)
    .attr("r", 7)
    .attr()
    .on("click", function(d) {
      d.selected = true;
      console.log(d);
    })
    .on("mouseout", mouseOut);

  tipCircles
    .on("mouseover", mouseOver)
    .attr("cx", function(d) {return xAxisScale(xValue(d));})
    .attr("cy", function(d) {return yAxisScale(yValue(d));})
    .style("visibility", data.hideArrows ? "hidden" : "visible");

  // Bind the data
  var lines = svg.selectAll("line")
    .data(axis, function(d) {
      return data.dsName + "-" + d.label;
    });

  // Remove old elements
  lines.exit()
    .transition()
    .duration(1000)
    .attr("x2", width / 2)
    .attr("y2", height / 2)
    .remove();

  // Add new line elements
  lines.enter().append("line")
    .attr("x1", width / 2)
    .attr("y1", height / 2)
    .attr("x2", width / 2)
    .attr("y2", height / 2)
    .attr("fill", "black")
    .on("click", function(d) {
      console.log(d);
      d.selected = true;
    })
    .on("mouseout", mouseOut);

  lines
    .classed("selected", function(d) {return d.selected;})
    .on("mouseover", mouseOver)
    .transition()
    .duration(2000)
    .attr("x2", function(d) {return xAxisScale(xValue(d));})
    .attr("y2", function(d) {return yAxisScale(yValue(d));})
    .attr("class", "link arrow")
    .attr("marker-end", "url(#arrow)")
    .style("visibility", data.hideArrows ? "hidden" : "visible");


  redraw();
  drawLegend(data.pointsClassDomain);

  function redraw() {
    // Create grid
    var xGrid = d3.svg.axis()
        .scale(xPointsScale)
        .orient("bottom")
        .tickFormat("")
        .tickSize(-height, 0, 0);

    // setup y
    var yGrid = d3.svg.axis()
        .scale(yPointsScale)
        .orient("left")
        .tickFormat("")
        .tickSize(- width, 0, 0);

    // Draw grid
    svg.select(".x.grid")
        .transition()
        .duration(1000)
        .call(xGrid);

    svg.select(".y.grid")
        .transition()
        .duration(1000)
        .call(yGrid);
  }

  function mouseOver(d) {
    // change opacity
    tooltip.transition()
       .duration(200)
       .style("opacity", .9);
    // change text
    tooltip.html("<b>" + d.label + "</b>")
       .style("left", (d3.event.pageX + 15) + "px")
       .style("top", (d3.event.pageY - 28) + "px");
  }

  function mouseOut() {
    // change opacity
    tooltip.transition()
       .duration(200)
       .style("opacity", 0);
  }

  function drawLegend(legendDomain) {
    var legendUpdate = svg.select(".legend-box")
        .selectAll(".legend")
        .data(legendDomain);

    legendUpdate.exit().remove();

    var legends = legendUpdate.enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legends.append("rect")
        .attr("width", 18)
        .attr("height", 18);

    legends.append("text")
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")

    // draw legend colored rectangles
    legendUpdate.select("rect")
        .attr("x", width + legendBoxWidth - 18)
        .style("fill", color);

    // draw legend text
    legendUpdate.select("text")
        .attr("x", width + legendBoxWidth - 24)
        .text(function(d) { return d;})
  }

};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding);

})();
