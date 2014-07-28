(function() {

var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  return $(scope).find(".d3-barplot");
};

binding.renderValue = function(el, data) {

  if (!data) {
    return;
  }

  var margin = {top: 40, right: 20, bottom: 30, left: 40};
  var width = el.clientWidth - margin.left - margin.right;
  var height = el.clientHeight - 10 - margin.top - margin.bottom;

  // Get element state
  var $el = $(el);
  var state = $el.data("state");

  // Init element
  if (!state) {
    var svg = d3.select(el).select("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // y-axis
    svg.append("g")
        .attr("class", "y axis")
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");

    $el.data("state", {
      svg: svg
    });

    state = $el.data("state")
  }

  var svg = state.svg;

  var elems = data.elems;

  // Update the intervals
  var min = d3.min(elems, function(d) { return d.value; });
  var max = d3.max(elems, function(d) { return d.value; });

  // set the x scale
  var xScale = d3.scale.ordinal()
    .domain(d3.range(elems.length))
    .rangeRoundBands([0, width], 0.1);

  // set the y scale
  var yScale = d3.scale.linear()
    .domain([min*0.9, max*1.1])
    .range([height, 0]);

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(10);

  // Update the color scale
  var colorScale = d3.scale.ordinal()
    .domain(data.classDomain)
    .range(d3.scale.category10().range().slice(0, data.classDomain.length));

  // Bind the  data
  var bars = svg.selectAll("rect")
    .data(elems, function(d) {
      return data.dsName + "-" + d.label;
    });

  // Remove old elements
  bars.exit().remove();

  // Add new elements
  bars.enter()
    .append("rect")
    .attr("x", 0)
    .on("click", function(d) {
      console.log(d);
    })
    .on("mouseover", hoverIn)
    .on("mouseout", hoverOut)

  // Update elements
  bars
    .attr("fill", function(d) {
      return colorScale(d.classValue)
    })
    .transition()
    .duration(250)
    .delay(function(d, i) {
      return i / elems.length * 250;
    })
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d) {
      return yScale(d.value);
    })
    .attr("height", function(d) {
      return height - yScale(d.value)
    })
    .attr("width", xScale.rangeBand());

  svg.select(".y.axis")
      .transition(1000)
      .call(yAxis)
    .select("text")
      .text(data.varName);

  function hoverIn(d) {
    d3.select(this).attr("fill", "orange");

    //Update the tooltip position and value
    d3.select("#tooltip")
      .style("left", (event.pageX + 20) + "px")
      .style("top", (event.pageY - 20) + "px")
      .select("#value").text(d.label);

    //Show the tooltip
    d3.select("#tooltip").classed("hidden", false);
  }

  function hoverOut(d) {
    d3.select(this)
      .attr("fill", function(d) {
        return colorScale(d.classValue);
      })

    //Hide the tooltip
    d3.select("#tooltip").classed("hidden", true);
  }
};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding, "fatore.barplotOutputBinding");

})();
