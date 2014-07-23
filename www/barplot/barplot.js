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

  var dataset = data.values;

  if (dataset.length < 1) {
    return;
  }

  var $el = $(el);

  var state = $el.data("state");

  if (!state || state.numElems != dataset.length) {
    // get the SVG element
    d3.select(el).select("svg").remove();
    var svg = d3.select(el).append("svg");

    // get sizes from client
    var w = h = Math.min(el.clientWidth, el.clientHeight) - 50;

    // set SVG size
    svg.attr("width", w).attr("height", h);

    // set x scale based on dataset length
    var xScale = d3.scale.ordinal()
      .domain(d3.range(dataset.length))
      .rangeRoundBands([0, w], 0.05);

    var yScale = d3.scale.linear()
      .range([20, h]);

    var colorScale = d3.scale.linear()
      .rangeRound([0, 255]);

    // add the visual elements
    var rects = svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return xScale(i);
      })
      .attr("width", xScale.rangeBand());

    $el.data("state", {
      numElems: dataset.length,
      yScale: yScale,
      colorScale: colorScale,
      rects: rects
    });

    state = $el.data("state")
  }

  // Now, the code that'll run every time a value is rendered...
  var min = d3.min(dataset, function(d) { return d; });
  var max = d3.max(dataset, function(d) { return d; });

  var yScale = state.yScale
    .domain([min, max]);

  var colorScale = state.colorScale
    .domain([min, max]);

  state.rects
    .data(dataset)
    .transition(1000)
    .delay(function(d, i) {
      return i / dataset.length * 500;
    })
    .attr("y", function(d) {
      return h - yScale(d);
    })
    .attr("height", function(d) {
      return yScale(d);
    })
    .attr("fill", function(d) {
      return "rgb(0, 0, " + colorScale(d) + ")"
    });
};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding, "fatore.d3-barplot");

})();
