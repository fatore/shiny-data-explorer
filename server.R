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

  output$spVars <- renderUI({
    dataset = datasetInput()
    verticalLayout(
      selectInput(inputId = "spVarX", "Select the x variable:",
                  choices = names(dataset), selected = names(dataset)[1]),
      selectInput(inputId = "spVarY", "Select the y variable:",
                  choices = names(dataset), selected = names(dataset)[2])
    )
  })

  output$filetable <- renderTable({
    dataset <- datasetInput()
    rbind(head(dataset, 6), tail(dataset, 6))
  })

  output$barplot <- reactive({
    dataset <- datasetInput()
    dataset = dataset[, names(dataset) == input$barplotVar]
    list(values = as.array(as.numeric(dataset)), varname = input$barplotVar)
  })

  output$scatterplot <- reactive({
    dataset <- datasetInput()
    dataset = cbind(dataset[, names(dataset) == input$spVarX],
                    dataset[, names(dataset) == input$spVarY])
    list(values = dataset)
  })
})
