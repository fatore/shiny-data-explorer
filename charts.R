library(shiny)

barplotOutput <- function(inputId) {

  tagList(
    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$link(rel="stylesheet", type="text/css", href="barplot.css"),
      tags$script(src="barplot.js")
    )),
    div(id=inputId, class="d3-barplot", tag("svg", list(tag("g", list())))),
    div(id="tooltip", class="hidden", tag("p", list(tag("span", list(id="value")))))
  )
}
