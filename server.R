library(shiny)

shinyServer(function(input, output) {

  datasetInput <- reactive({
    dataset = list()
    df = switch(input$dataset,
                "Flowers" = iris,
                "Cars" = mtcars)

    numericVars = names(df)[(lapply(df, class) == "numeric")]
    factorVars = c(names(df)[(lapply(df, class) == "factor")], "None")

    list(df = df, numericVars = numericVars, factorVars = factorVars)

  })

  output$datasetName <- renderText({
    input$dataset
  })

  output$barplotVar <- renderUI({
    ds = datasetInput()
    verticalLayout(
      selectInput(inputId = "bpVar", "Select the variable of interest:", choices = ds$numericVars),
      selectInput(inputId = "bpClass", "Select the class variable:", choices = ds$factorVars)
    )
  })

  output$spVars <- renderUI({
    ds = datasetInput()

    verticalLayout(
      selectInput(inputId = "spVarX", "Select the x variable:",
                  choices = ds$numericVars, selected = ds$numericVars[1]),
      selectInput(inputId = "spVarY", "Select the y variable:",
                  choices = ds$numericVars, selected = ds$numericVars[2]),
      selectInput(inputId = "spClass", "Select the class variable:", choices = ds$factorVars)
    )
  })

  output$filetable <- renderTable({
    df <- datasetInput()$df
    rbind(head(df, 6), tail(df, 6))
  })

  output$barplot <- reactive({
    df = datasetInput()$df

    labels = rownames(df)
    values = df[, names(df) == input$bpVar]
    classValues = df[, names(df) == input$bpClass]
    if (length(classValues) < 1) {
      classValues = as.factor(rep("None", nrow(df)))
    }

    tryCatch({
      elems = mapply(function(label, value, classValue) {
        list(label = label, value = value, classValue = classValue)
      }, labels, values, classValues, SIMPLIFY = F, USE.NAMES = F)
      list(dsName = input$dataset, elems = elems, varname = input$bpVar, classDomain = levels(classValues))
    }, error = function(e) {return(NULL)})

  })

  output$scatterplot <- reactive({
    if (is.null(input$spVarX) || is.null(input$spVarY) || is.null(input$spClass)) {
      return(NULL)
    }

    ds <- datasetInput()
    df = ds$df

    ids = rownames(df)
    values = cbind(df[, names(df) == input$spVarX], df[, names(df) == input$spVarY])
    classValues = df[, names(df) == input$spClass]

    elems = mapply(function(id, x, y, classValue) {
      list(id = id, value = list(x, y), classValue = classValue)
    }, ids, values[,1], values[,2], classValues, SIMPLIFY = F, USE.NAMES = F)

    list(elems = elems, classDomain = levels(classValues))
  })
})
