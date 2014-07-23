(function() {

// First create a generic output binding instance, then overwrite
// specific methods whose behavior we want to change.
var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  // For the given scope, return the set of elements that belong to this binding.
  return $(scope).find(".custom-d3-scatterplot");
};

// This function will be called every time we receive new output from Shiny.
// The "el" argument is the  div for this particular chart.
binding.renderValue = function(el, data) {

  // Check data
  console.log(data);

  var dataset = data.values;

  if (dataset.length < 1) {
    return;
  }

  // Get SVG reference
  d3.select(el).select("svg").remove();
  var svg = d3.select(el).append("svg");

  // Set sizes
  var w = h = Math.min(el.clientWidth, el.clientHeight) - 50;
  svg.attr("width", w).attr("height", h);

  var padding = 50;

  // Scales
  var xScale = d3.scale.linear()
    .domain([d3.min(dataset, function(d) { return d[0]; }),
      d3.max(dataset, function(d) { return d[0]; })])
    .range([padding, w - padding]);

  var yScale = d3.scale.linear()
    .domain([d3.min(dataset, function(d) { return d[1]; }),
      d3.max(dataset, function(d) { return d[1]; })])
    .range([h - padding, padding]);

  var rScale = d3.scale.linear()
    .domain([100, 10000])
    .range([5, 2])
    .clamp(true);

  // Axis
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5)
    .tickFormat(d3.format(".2"));

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5)
    .tickFormat(d3.format(".2"));

  // Elements
  var circles = svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) {
      return xScale(d[0]);
    })
    .attr("cy", function(d) {
      return yScale(d[1]);
    })
    .attr("r", function(d) {
      return rScale(d[1]);
    });

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding / 2) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + (padding / 2) + ", 0)")
    .call(yAxis);
};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding);

})();
