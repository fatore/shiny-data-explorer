library(shiny)

shinyServer(function(input, output) {

  datasetInput <- reactive({
    switch(input$dataset,
           "Flowers" = iris,
           "Cars" = mtcars)
  })

  output$datasetName <- renderText({
    input$dataset
  })

  output$barplotVar <- renderUI({
    dataset = datasetInput()
    selectInput(inputId = "barplotVar", "Select a variable:", choices = names(dataset))
  })

  output$filetable <- renderTable({
    dataset <- datasetInput()
    rbind(head(dataset,6), tail(dataset,6))
  })

  output$barplot <- reactive({
    d <- head(datasetInput())
    var = input$barplotVar
    d = d[,names(d) == var]
    # pass variable values and name
    list(values = as.array(as.numeric(d)), varname = var)
  })

})
