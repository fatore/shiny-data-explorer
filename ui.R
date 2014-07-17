library(shiny)

reactiveSvg <- function (outputId) {
  HTML(paste("<div id=\"", outputId, "\" class=\"shiny-network-output\"><svg /></div>", sep=""))
}

shinyUI(pageWithSidebar(
  headerPanel(title=HTML("Shiny Biplots")),

  sidebarPanel("Description text.",
               helpText(HTML("<br>Help text</br>"))
  ),

  mainPanel(
    includeCSS("stylesheet.css"),
    includeHTML("index.html"),
    includeScript("plot.js"),
    reactiveSvg(outputId = "scatterplot")
  )
))

