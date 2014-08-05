library(shiny)

scatterplotOutput <- function(inputId,  width="100%", height="600px") {
  style <- sprintf("width: %s; height: %s;", validateCssUnit(width), validateCssUnit(height))

  tagList(
    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$link(rel="stylesheet", type="text/css", href="scatterplot.css"),
      tags$script(src="scatterplot.js")
    )),
    div(id=inputId, class="d3-scatterplot", style=style)
  )
}

biplotOutput <- function(inputId,  width="100%", height="600px") {
  style <- sprintf("width: %s; height: %s;", validateCssUnit(width), validateCssUnit(height))

  tagList(
    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$link(rel="stylesheet", type="text/css", href="biplot.css"),
      tags$script(src="biplot.js")
    )),
    div(id=inputId, class="d3-biplot", style=style)
  )
}
