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
    verticalLayout(
      selectInput(inputId = "bpVar", "Select the variable of interest:",
                  choices = names(dataset)[(lapply(dataset, class) == "numeric")]),
      selectInput(inputId = "bpClass", "Select the class variable:",
                  choices = names(dataset)[(lapply(dataset, class) == "factor")])
    )
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
    if (is.null(input$bpVar) || is.null(input$bpClass)) {
      return(NULL)
    }

    d <- datasetInput()

    ids = 1:nrow(d)
    values = as.numeric(d[, names(d) == input$bpVar])
    classValues = d[, names(d) == input$bpClass]

    elems = mapply(function(id, value, classValue) {
      list(id = id, value = value, classValue = classValue)
    }, ids, values, classValues, SIMPLIFY = F, USE.NAMES = F)

    list(elems = elems, varname = input$bpVar, classDomain = levels(classValues))
  })

  output$scatterplot <- reactive({
    dataset <- datasetInput()
    dataset = cbind(dataset[, names(dataset) == input$spVarX],
                    dataset[, names(dataset) == input$spVarY])
    list(values = dataset)
  })
})
