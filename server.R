library(shiny)
source('core/biplots.R')

createDS = function(df) {
  list(df = df, usedVars = names(df)[(lapply(df, class) != "factor")])
}

# Init datasets
irisDS = createDS(iris)
carsDS = createDS(mtcars[,c(1,4,3,5,6,7,2,8,9,10,11)])
moviesDS = {load("data/movies2010.Rda"); movies2010}
moviesDS = createDS(moviesDS[complete.cases(moviesDS),])

shinyServer(function(input, output) {

  datasetInput <- reactive({
    ds = switch(input$dataset,
                "Flowers" = irisDS,
                "Cars" = carsDS,
                "Movies" = moviesDS)

    df = ds$df

    numericVars = names(df)[(lapply(df, class) != "factor")]
    factorVars = c(names(df)[(lapply(df, class) == "factor")], "None")
    usedVars = ds$usedVars

    list(df = df, numericVars = numericVars, factorVars = factorVars, usedVars = usedVars)
  })

  output$datasetName <- renderText({
    input$dataset
  })

  output$barplotVar <- renderUI({
    ds = datasetInput()
    verticalLayout(
      selectInput(inputId = "bpVar", "Variable of interest:", choices = ds$numericVars),
      selectInput(inputId = "bpClass", "Class variable:", choices = ds$factorVars)
    )
  })

  output$spVars <- renderUI({
    ds = datasetInput()

    verticalLayout(
      selectInput(inputId = "spVarX", "X variable:",
                  choices = ds$numericVars, selected = ds$numericVars[1]),
      selectInput(inputId = "spVarY", "Y variable:",
                  choices = ds$numericVars, selected = ds$numericVars[2]),
      selectInput(inputId = "spClass", "Class variable:", choices = ds$factorVars)
    )
  })

  output$biplotVars <- renderUI({
    if (is.null(input$dataset)) {
      return()
    }

    ds = datasetInput()

    verticalLayout(
      selectInput(inputId = "biplotMethod", "Reduction method:", choices = c("PCA", "tSNE")),
      selectInput(inputId = "biplotClass", "Class variable:", choices = ds$factorVars),
      checkboxGroupInput("biplotVars", "Used variables:",
                         choices = ds$numericVars, selected = ds$usedVars)
    )
  })

  output$filetable <- renderTable({
    df <- datasetInput()$df
    rbind(head(df, 6), tail(df, 6))
  })

  output$barplot <- reactive({
    if (is.null(input$bpVar) || is.null(input$bpClass)) {
      return()
    }

    df = datasetInput()$df

    labels = rownames(df)
    values = df[, names(df) == input$bpVar]
    classValues = df[, names(df) == input$bpClass]
    if (length(classValues) < 1) {
      classValues = as.factor(rep("", nrow(df)))
    }

    tryCatch({
      elems = mapply(function(label, value, classValue) {
        list(label = label, value = value, classValue = classValue)
      }, labels, values, classValues, SIMPLIFY = F, USE.NAMES = F)
      list(dsName = input$dataset, elems = elems, varName = input$bpVar, classDomain = levels(classValues))
    }, error = function(e) {return()})
  })

  output$scatterplot <- reactive({
    if (is.null(input$spVarX) || is.null(input$spVarY) || is.null(input$spClass)) {
      return()
    }

    df <- datasetInput()$df

    tryCatch({

      labels = rownames(df)
      values = cbind(df[, names(df) == input$spVarX], df[, names(df) == input$spVarY])
      classValues = df[, names(df) == input$spClass]
      if (length(classValues) < 1) {
        classValues = as.factor(rep("", nrow(df)))
      }

      elems = mapply(function(label, x, y, classValue) {
        list(label = label, value = list(x, y), classValue = classValue)
      }, labels, values[,1], values[,2], classValues, SIMPLIFY = F, USE.NAMES = F)
      list(dsName = input$dataset, elems = elems, classDomain = levels(classValues),
           xVar = input$spVarX, yVar = input$spVarY)
    }, error = function(e) {return()})
  })

  output$biplot <- reactive({
    if (is.null(input$biplotVars) || is.null(input$biplotMethod)) {
      return()
    }

    ds = datasetInput()
    df <- ds$df

    tryCatch({

      biplot = regressionBiplot(df[, input$biplotVars], input$biplotMethod)

      bpPoints = biplot$points
      bpAxis = biplot$axis

      pointsClasses = df[, names(df) == input$biplotClass]
      if (length(pointsClasses) < 1) {
        pointsClasses = as.factor(rep("", nrow(bpPoints)))
      }
      axisClasses = as.factor(rep("", nrow(bpAxis)))

      points = mapply(function(label, x, y, classValue) {
        list(x = x, y = y, label = label, classValue = classValue)
      }, rownames(df), bpPoints[,1], bpPoints[,2], pointsClasses, SIMPLIFY = F, USE.NAMES = F)

      axis = mapply(function(label, x, y, classValue) {
        list(x = x, y = y, label = label, classValue = classValue)
      }, names(df[, input$biplotVars]), bpAxis[,1], bpAxis[,2], axisClasses, SIMPLIFY = F, USE.NAMES = F)

      list(dsName = input$dataset, points = points, axis = axis,
           pointsClassDomain = levels(pointsClasses))
    }, error = function(e) {return()})
  })
})
