library(shiny)

# To be called from ui.R
d3PlotOutput <- function(inputId, src=inputId, width="100%", height="400px") {
  style <- sprintf("width: %s; height: %s;",
                   validateCssUnit(width), validateCssUnit(height))

  tagList(
    # Include CSS/JS dependencies. Use "singleton" to make sure that even
    # if multiple plots are used in the same page, we'll still
    # only include these chunks once.
    singleton(tags$head(
      tags$script(src="d3/d3.v3.min.js"),
      tags$link(rel="stylesheet", type="text/css",
                href=paste(src, "/", src, ".css", sep="")),
      tags$script(src=paste(src, "/", src, ".js", sep=""))
    )),
    div(id=inputId, class=paste("custom-d3-", src, sep=""), style=style, tag("svg", list()))
  )
}
