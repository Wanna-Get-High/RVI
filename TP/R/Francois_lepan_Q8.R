library("gplots")

######################################
# la fonction permettant de connaitre le temps moyen pour une technique donné
#
meanTimeTechnic = function(data, technique) {
	currentTechnic = subset(data , Technique == technique)$Time
	
	mean(currentTechnic)
}

######################################
# la fonction permettant de connaitre l'indice de confiance pour une technique donné
#
confidenceIndexTechnic = function(data, technique) {
	
	currentTechnic = subset(data , Technique == technique)$Time
	standardDeviation = sd(currentTechnic)
	sqrtSample = sqrt(length(currentTechnic))
	
	1.96 * (standardDeviation / sqrtSample)
}

# on charge les données
data = read.table("data.txt", header=TRUE, sep=",")

# on récupère les techniques
techniques = unique(data$Technique)

# on calcule le temps moyen des techniques
meanTimeTechnics = sapply(techniques, meanTimeTechnic, data=subset(data, Err==0))

# on calcule l'indice de confiance des 3 technique
confidenceIndexTechnics = sapply(techniques, confidenceIndexTechnic, data=subset(data, Err==0))

# on affiche les données
barplot2(meanTimeTechnics, 									# les données à afficher
		plot.ci=TRUE, 										# on active les indices de confiances
		col = c(techniques)+1,								# les couleurs (+1 pour évité la couleur noire)
		ci.l= meanTimeTechnics - confidenceIndexTechnics, 	# indice de confiance min
		ci.u= meanTimeTechnics + confidenceIndexTechnics,	# indice de confiance max
		ylim = c(0,4), 										# on augmente l'ordonné
		xlab="Techniques", 									# la legende pour l'axe x
		ylab="Temps moyen")									# la legende pour l'axe y