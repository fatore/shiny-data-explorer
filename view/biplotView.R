biplotMainView <- function(ds) {
  verticalLayout(
    div(class="titled-box",
        div(id="title", "Tools:"),
        div(id="content",
            checkboxInput("hideArrows", "Hide arrows", value = FALSE)
            #checkboxInput("hidePoints", "Hide circles", value = FALSE)
        )
    ),
    div(class="titled-box",
        div(id="title", "Advanced:"),
        div(id="content",
            selectInput(inputId = "biplotMethod", "Reduction method:", choices = c("PCA", "Force Scheme", "tSNE"))
            #sliderInput(inputId = "bpSampleSize", "Sample size:", min=0.05, max=1,value=1, format="0%"),
            #selectInput(inputId = "bpAproxMethod", "Approximation method:", choices = c("Lamp", "Loch"))
        )
    )
  )
}

biplotVarsView <- function(ds) {
  if (length(ds$numericVars) > 5) {
    boxId = "two-col-content"
  } else {
    boxId = "content"
  }

  verticalLayout(
    selectInput(inputId = "biplotClass", "Class variable:", choices = ds$factorVars),
    div(class="titled-box",
        div(id="title", "Used variables:"),
        div(id=boxId, checkboxGroupInput("biplotVars", label = "", choices = ds$numericVars, selected = ds$usedVars)
        )
    )
  )
}

