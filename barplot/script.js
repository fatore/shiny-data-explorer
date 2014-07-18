// Execute function body when the HTML document is ready
$(document).ready(function() {

var networkOutputBinding = new Shiny.OutputBinding();

$.extend(networkOutputBinding, {
    find: function(scope) {
      return $(scope).find('.shiny-output');
    },
    renderValue: function(el, data) {

    var svg = d3.select(el).select("svg");
    svg.remove();

    var dataset = []; //Initialize empty array
    for (var i = 0; i < 25; i++) { //Loop 25 times
      var newNumber = Math.random() * 30; //New random number (0-30)
      dataset.push(newNumber); //Add new number to array
    }

    d3.select("#barplot").selectAll("div")
      .data(dataset)
      .enter()
      .append("div")
      .attr("class", "bar")
      .style("height", function(d) {
        var barHeight = d * 10;
        return barHeight + "px";
      });


    } // render value end
  }); // extent end

  Shiny.outputBindings.register(networkOutputBinding, 'fatore.networkbinding');
}); // document context end
