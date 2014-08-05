library(shiny)

shinyUI(
  navbarPage("Shiny Data Explorer", id='navPage',

             # Dataset panel
             tabPanel("Dataset",
                      sidebarLayout(
                        sidebarPanel(width = 2, selectInput(
                          inputId = "dataset", "Dataset:",
                          choices = c("Flowers", "Cars", "Movies"))),
                        mainPanel(h3(textOutput("datasetName")), tableOutput("filetable")))
             ),

             # Scatterplot panel
             tabPanel("Scatterplot",
                      sidebarLayout(
                        sidebarPanel(width = 2, htmlOutput("spVars")),
                        mainPanel(scatterplotOutput("scatterplot",  800,  650))
                      )
             ),

             # Biplot panel
             tabPanel("Biplot",
                      sidebarLayout(sidebarPanel(width = 2, htmlOutput("biplotVars")),
                                    mainPanel(biplotOutput("biplot",  800,  650))
                      )
             )
  )
)
