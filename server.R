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

  output$filetable <- renderDataTable({
    df = datasetInput()$df
    cbind(Names = rownames(df), df)
  }, options = list(iDisplayLength = 10))

  output$datasetName <- renderText({
    input$dataset
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

  output$biplotVars <- renderUI({
    if (is.null(input$dataset)) return()
    biplotVarsView(datasetInput())
  })

  output$biplotView <- renderUI({
    if (is.null(input$dataset)) return()
    biplotMainView(datasetInput())

  })

  updateBiplot <- reactive({
    if (is.null(input$biplotVars) || is.null(input$biplotMethod)) {
      return()
    }
    df <- datasetInput()$df
    regressionBiplot(df[, input$biplotVars], input$biplotMethod)
  })

  output$biplot <- reactive({

    df <- datasetInput()$df

    tryCatch({

      biplot = updateBiplot()

      if (is.null(biplot)) {
        return()
      }

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
        list(x = x, y = y, label = label, classValue = classValue, selected = FALSE)
      }, names(df[, input$biplotVars]), bpAxis[,1], bpAxis[,2], axisClasses, SIMPLIFY = F, USE.NAMES = F)

      list(dsName = input$dataset, points = points, axis = axis,
           pointsClassDomain = levels(pointsClasses), values = df[, input$biplotVars],
           hideArrows = input$hideArrows)
    }, error = function(e) {return()})
  })
})
