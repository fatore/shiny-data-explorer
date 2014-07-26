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

  if (!data) {
    return;
  }

  var $el = $(el);

  var state = $el.data("state");

  var elems = data.elems;

  var padding = 30;

  if (!state) {
    // get sizes from client
    var w = h = Math.min(el.clientWidth, el.clientHeight) - 50;

    d3.select(el).select("svg").remove();

    var svg = d3.select(el)
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    //Define clipping path
    svg.append("clipPath") //Make a new clipPath
      .attr("id", "chart-area") //Assign an ID
      .append("rect") //Within the clipPath, create a new rect
      .attr("x", padding) //Set rect's position and size…
      .attr("y", padding)
      .attr("width", w - padding * 2)
      .attr("height", h - padding * 2);

      // Scales
    var xScale = d3.scale.linear()
      .range([padding * 2, w - padding * 2]);

    var yScale = d3.scale.linear()
      .range([h - padding * 2, padding * 2]);

    var rScale = d3.scale.linear()
      .domain([100, 10000])
      .range([5, 2])
      .clamp(true);

    var colorScale = d3.scale.category10()
      .domain(data.classDomain);

    // Elements
    var circles = svg.append("g")
		  .attr("id", "circles")
		  .attr("clip-path", "url(#chart-area)")
		  .selectAll("circle")
      .data(elems)
      .enter()
      .append("circle");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (h - padding) + ")");

    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + padding + ", 0)");

    $el.data("state", {
      circles: circles,
      svg: svg,
      xScale: xScale,
      yScale: yScale,
      rScale: rScale,
      colorScale: colorScale
    });

    state = $el.data("state")
  }

  // Now, the code that'll run every time a value is rendered...
  var minX = d3.min(elems, function(d) { return d.value[0]; });
  var maxX = d3.max(elems, function(d) { return d.value[0]; });

  var minY = d3.min(elems, function(d) { return d.value[1]; });
  var maxY = d3.max(elems, function(d) { return d.value[1]; });

  var xScale = state.xScale
    .domain([minX, maxX]);

  var yScale = state.yScale
    .domain([minY, maxY]);

  var rScale = state.rScale;

  var r = rScale(elems.length);

  var colorScale = state.colorScale;

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

  state.circles
    .data(elems)
    .transition(1000)
    .attr("cx", function(d) {
      return xScale(d.value[0]);
    })
    .attr("cy", function(d) {
      return yScale(d.value[1]);
    })
    .attr("fill", function(d) {
      return colorScale(d.classValue);
    })
    .attr("r", r);

    //Update X axis
    state.svg.select(".x.axis")
      .transition(1000)
      .call(xAxis);

    //Update Y axis
    state.svg.select(".y.axis")
      .transition(1000)
      .call(yAxis);

};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding);

})();
