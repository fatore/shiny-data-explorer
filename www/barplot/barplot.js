(function() {

// First create a generic output binding instance, then overwrite
// specific methods whose behavior we want to change.
var binding = new Shiny.OutputBinding();

binding.find = function(scope) {
  // For the given scope, return the set of elements that belong to this binding.
  return $(scope).find(".custom-d3-barplot");
};

binding.renderValue = function(el, data) {
  // This function will be called every time we receive new output from Shiny.
  // The "el" argument is the  div for this particular chart.

  console.log(data);

  if (!data) {
    return;
  }

  var elems = data.elems;

  var $el = $(el);

  var state = $el.data("state");

  if (!state) {
    // get the SVG element
    d3.select(el).select("svg").remove();
    var svg = d3.select(el).append("svg");

    // get sizes from client
    var w = h = Math.min(el.clientWidth, el.clientHeight) - 50;

    // set SVG size
    svg.attr("width", w).attr("height", h);

    // set x scale based on dataset length
    var xScale = d3.scale.ordinal()
      .rangeRoundBands([0, w], 0.05);

    var yScale = d3.scale.linear()
      .range([20, h]);

    var colorScale = d3.scale.category10()
      .domain(data.classDomain);

    // add the visual elements
    var rects = svg.selectAll("rect")
      .data(elems)
      .enter()
      .append("rect");

    $el.data("state", {
      xScale: xScale,
      yScale: yScale,
      colorScale: colorScale,
      rects: rects
    });

    state = $el.data("state")
  }

  var xScale = state.xScale
    .domain(d3.range(elems.length));

  // Now, the code that'll run every time a value is rendered...
  var min = d3.min(elems, function(d) { return d.value; });
  var max = d3.max(elems, function(d) { return d.value; });

  var yScale = state.yScale
    .domain([min, max]);

  var colorScale = state.colorScale;

  state.rects
    .data(elems)
    .transition(1000)
    .delay(function(d, i) {
      return i / elems.length * 500;
    })
    .attr("y", function(d) {
      return h - yScale(d.value);
    })
    .attr("height", function(d) {
      return yScale(d.value);
    })
    .attr("fill", function(d) {
      return colorScale(d.classValue);
    })
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("width", xScale.rangeBand());
};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding);

})();
