library(shiny)

shinyServer(function(input, output) {

  data <- reactive({
    data <- as.matrix(iris[,1:2])
    colnames(data) <- c('x','y')
    data
  })

  output$scatterplot <- reactive({
    data()
  })
})

