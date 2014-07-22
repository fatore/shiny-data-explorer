library(shiny)

shinyUI(
  fluidPage(

    titlePanel("Shiny Data Explorer"),

    tabsetPanel(
      id='mainTabSet', selected='Barplot', type="pill",

      # Dataset panel
      tabPanel(
        "Dataset",
        sidebarLayout(
          sidebarPanel(
            width = 2,
            selectInput(inputId = "dataset", "Select a dataset:",
                        choices = c("Flowers", "Cars"))),
          mainPanel(h3(textOutput("datasetName")), tableOutput("filetable")))
      ),

      # Barplot panel
      tabPanel(
        "Barplot",
        sidebarLayout(
          sidebarPanel(width = 3, htmlOutput("barplotVar")),
          d3PlotOutput("barplot"))
      )

      # Scatterplot panel
#       tabPanel("Scatterplot", d3PlotOutput("scatterplot")), # TODO

      # Biplot panel
#       tabPanel("Biplot", mainPanel())
    )
  )
)
