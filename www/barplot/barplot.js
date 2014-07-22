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

  d3.select(el).select("svg").remove();
  var svg = d3.select(el).append("svg")

  var w = 500;
  var h = 100;
  var barPadding = 1;

  svg.attr("width", w)
    .attr("height", h);

  console.log(data);

  var dataset = data.values;

  if (dataset.length < 1) {
    return;
  }

  var rects = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect");

  rects.attr("x", function(d, i) {
      return i * (w / dataset.length); //Bar width of 20 plus 1 for padding
    })
    .attr("y", function(d) {return h - d * 4;})
    .attr("width", w / dataset.length - barPadding)
    .attr("height", function(d) {return d * 4;})
    .attr("fill", function(d) {return "rgb(0, 0, " + (d * 10) + ")"});

};

// Tell Shiny about our new output binding
Shiny.outputBindings.register(binding, "fatore.d3-barplot");

})();
