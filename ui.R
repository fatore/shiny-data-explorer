library(shiny)

shinyUI(
  navbarPage(
    "Shiny Data Explorer", id='navPage',

    # Dataset panel
    tabPanel(
      "Dataset",
      sidebarLayout(
        sidebarPanel(
          width = 2,
          selectInput(inputId = "dataset", "Dataset:", choices = c("Flowers", "Cars", "Movies"))
        ),
        mainPanel(h3(textOutput("datasetName")), tableOutput("filetable")))

    ),

    # Scatterplot panel
    tabPanel(
      "Scatterplot",
      sidebarLayout(
        sidebarPanel(
          width = 2,
          htmlOutput("spVars")
        ),
        mainPanel(width = 5, scatterplotOutput("scatterplot",  600))
      )
    ),

    # Biplot panel
    tabPanel(
      "Biplot",
      sidebarLayout(
        sidebarPanel(width = 2, htmlOutput("biplotView")),
        sidebarLayout(
          mainPanel(width = 5, biplotOutput("biplot",  h=600)),
          sidebarPanel(width = 2, htmlOutput("biplotVars"))
        )
      )
    ),
    # could not find a solution for the problem with the slider labels
    div(style="display: none", sliderInput(inputId = "workaround", "", min=0, max=1,value=1))
  )
)
