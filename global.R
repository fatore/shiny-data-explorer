# Any code in this file is guaranteed to be called before either
# ui.R or server.R

# TODO: remove this check from here and add to Depends in package declaration
list.of.packages <- c("plotrix", "tsne", "mp")
new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)

source("charts.R")
