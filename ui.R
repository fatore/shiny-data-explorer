library(shiny)

shinyUI(navbarPage("Shiny Data Explorer", id='navPage',

      # Dataset panel
      tabPanel("Dataset",
        sidebarLayout(
          sidebarPanel(width = 3, selectInput(
            inputId = "dataset", "Select a dataset:",  choices = c("Flowers", "Cars"))),
          mainPanel(h3(textOutput("datasetName")), tableOutput("filetable")))
      ),

      # Barplot panel
      tabPanel("Barplot",
        sidebarLayout(
          sidebarPanel(width = 3, htmlOutput("barplotVar")),
          mainPanel(barplotOutput("barplot"))
        )
      ),

      # Scatterplot panel
      tabPanel("Scatterplot",
        sidebarLayout(
          sidebarPanel(width = 3, htmlOutput("spVars")),
          mainPanel()#d3PlotOutput("scatterplot"))
        )
      )

      # Biplot panel
#       tabPanel("Biplot", mainPanel())
    )
#   )
)
