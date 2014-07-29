(function() {

var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  return $(scope).find(".d3-scatterplot");
};

binding.renderValue = function(el, data) {
  if (!data) {
    return;
  }

  // set svg internal margin
  var margin = {top: 40, right: 20, bottom: 30, left: 40};

  // save space for the legend
  var legendBoxWidth = 100;

  // svg dimensions
  var width = el.clientWidth - margin.left - margin.right;
  var height = el.clientHeight - 10 - margin.top - margin.bottom;

  // svg internal padding
  var padding = 15;

  // setup x
  var xValue = function(d) { return d.value[0];}, // data -> value
    xScale = d3.scale.linear().range([padding, width - padding - legendBoxWidth]), // value -> display
    xMap = function(d) { return xScale(xValue(d));}, // data -> display
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  // setup y
  var yValue = function(d) { return d.value[1];}, // data -> value
    yScale = d3.scale.linear().range([height - padding, padding]), // value -> display
    yMap = function(d) { return yScale(yValue(d));}, // data -> display
    yAxis = d3.svg.axis().scale(yScale).orient("left");

  // setup radius scale
  var rScale = d3.scale.linear()
    .domain([100, 10000])
    .range([6, 2])
    .clamp(true);

  // setup fill color
  var cValue = function(d) { return d.classValue;},
    color = d3.scale.ordinal()
    .range(d3.scale.category10().range().slice(0, data.classDomain.length))
    .domain(data.classDomain);

  // Get element state
  var $el = $(el);
  var state = $el.data("state");

  // Init element
  if (!state) {
    var svg = d3.select(el).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    d3.select(el).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    // x-axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
      .append("text")
        .attr("class", "label")
        .attr("x", width - legendBoxWidth)
        .attr("y", -6)
        .style("text-anchor", "end");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");


    svg.append("g")
      .attr("class", "legend-box")

    $el.data("state", {
      svg: svg
    });

    state = $el.data("state")
  }

  // get the svg selection
  var svg = state.svg;

  var elems = data.elems;

  // don't want circles overlapping axis, so add in buffer to data domain
  xScale.domain([d3.min(elems, xValue), d3.max(elems, xValue)]);
  yScale.domain([d3.min(elems, yValue), d3.max(elems, yValue)]);

  var r = rScale(elems.length);

  // get the tooltip selection
  var tooltip = d3.select(el).select(".tooltip");

  // Bind the data
  var circles = svg.selectAll("circle")
    .data(elems, function(d) {
      return data.dsName + "-" + d.label;
    });

  // Remove old elements
  circles.exit().remove();

  // Add new elements
  circles.enter().append("circle")
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
    .attr("cx", xMap)
    .attr("cy", yMap)
    .attr("fill", function(d) {
      return color(cValue(d));
    })
    .attr("r", r);

  svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis)
    .select("text")
      .text(data.xVar);

  svg.select(".y.axis")
      .transition()
      .duration(1000)
      .call(yAxis)
    .select("text")
      .text(data.yVar);

  // draw legend
  drawLegend(data.classDomain);

  function mouseOver(d) {
    // change opacity
    tooltip.transition()
       .duration(200)
       .style("opacity", .9);
    // change text
    tooltip.html("<b>" + d.label + "</b><br/>" + data.xVar + ": " + xValue(d) +
      "<br/>" + data.yVar + ": " + yValue(d))
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
        .attr("x", width - 18)
        .style("fill", color);

    // draw legend text
    legendUpdate.select("text")
        .attr("x", width - 24)
        .text(function(d) { return d;})
  }

};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding);

})();
