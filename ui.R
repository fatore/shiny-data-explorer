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
            width = 3,
            selectInput(
              "dataset", "Select a dataset:",
              choices = c("Iris", "Cars")
            ),
            fileInput(
              'file1', 'Upload a dataset (CSV):',
              accept=c('text/csv', 'text/comma-separated-values,text/plain', '.csv')
            )
          ),
          mainPanel(
            h3(textOutput("datasetName")),
            tableOutput("filetable")
          )
        )
      ),

      # Barplot panel
      tabPanel(
        "Barplot",
        sidebarLayout(
          sidebarPanel(
            width = 3,
          htmlOutput("varChoices")
          ),
          mainPanel(
            includeCSS("barplot/stylesheet.css"),
            includeScript("barplot/script.js"),
            includeHTML("barplot/index.html")
          )
        )
      ),
      # Scatterplot panel
      tabPanel(
        "Scatterplot",
        mainPanel()
      ),
      # Biplot panel
      tabPanel(
        "Biplot",
        mainPanel()
      )
    )
  )
)
