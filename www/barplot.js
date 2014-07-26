(function() {

var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  return $(scope).find(".d3-barplot");
};

binding.renderValue = function(el, data) {

  if (!data) {
    return;
  }

  var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  // get the SVG element
  var svg = d3.select(el).select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  svg.select("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var elems = data.elems;

  // Update the intervals
  var min = d3.min(elems, function(d) { return d.value; });
  var max = d3.max(elems, function(d) { return d.value; });

  // set the x scale
  var xScale = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.05)
    .domain(d3.range(elems.length));

  // set the y scale
  var yScale = d3.scale.linear()
    .range([20, height])
    .domain([min, max]);

  // Update the color scale
  var colorScale = d3.scale.ordinal()
    .range(d3.scale.category10().range().slice(0, data.classDomain.length))
    .domain(data.classDomain);

  // Bind the  data
  var bars = svg.selectAll("rect")
    .data(elems, function(d) {
      return data.dsName + "-" + d.label;
    });

  // Remove elements
  bars.exit().remove();

  // Add elements
  bars.enter()
    .append("rect")
    .attr("x", 0)
    .on("click", function(d) {
      console.log(d);
    })
    .on("mouseover", hoverIn)
    .on("mouseout", hoverOut)
    .append("title")
    .text(function(d) {
      return d.label;
    })

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
      return height - yScale(d.value);
    })
    .attr("height", function(d) {
      return yScale(d.value)
    })
    .attr("width", xScale.rangeBand())

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
