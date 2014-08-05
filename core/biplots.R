library(plotrix)
library(tsne)
library(mp)

regressionBiplot = function(df, method="PCA") {
  print("called biplot")

  df = scale(df)

  points = switch(method,
                  "PCA" = prcomp(df, retx=T)$x[,1:2],
                  "Force Scheme" = forceScheme(dist(df)),
                  "tSNE" = tsne(df, whiten=F))

  rownames(points) = rownames(df)
  colnames(points) = c('x', 'y')

  axis = c()
  for (i in 1:ncol(df)) {
    axis = rbind(axis, lm(df[,i] ~ points[,1] * points[,2])$coef[2:3] *
                   c(sd(points[,1]), sd(points[,2])) / sd(df[,i]))
  }
  rownames(axis) = colnames(df)
  colnames(axis) = c('x', 'y')

  list(points = points, axis = axis)
}
