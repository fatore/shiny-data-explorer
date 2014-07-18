library(shiny)

shinyServer(function(input, output) {

  datasetInput <- reactive({
    switch(input$dataset,
           "Iris" = iris,
           "Cars" = mtcars
    )
    #     read.csv(input$files$datapath, header=T, stringsAsFactors=T)
  })

  output$barplot <- reactive({
    datasetInput()
  })

  output$filetable <- renderTable({
    dataset <- datasetInput()
    rbind(head(dataset,6), tail(dataset,6))
  })

  output$datasetName <- renderText({
    input$dataset
  })

  output$varChoices <- renderUI({
    dataset <- datasetInput()
    selectInput(
      "var1", "Select a variable:",
      choices = names(dataset)
    )
  })

})
