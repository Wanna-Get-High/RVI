library("gplots")

######################################
# la fonction permettant de connaitre le temps moyen pour une technique donné
#
meanTimeTechnic = function(data, technique) {
	currentTechnic = subset(data , Technique == technique)$Time
	
	mean(currentTechnic)
}

######################################
# la fonction permettant de connaitre le temps moyen pour chaque densité
#
meanTimeDensity = function(data, techniques, dens) {
	sapply(techniques, meanTimeTechnic, data=subset(data, Err==0 & density == dens))
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

######################################
# la fonction permettant de connaitre l'indice de confiance pour chaque densité
#
confidenceIndexDensity = function(data, techniques, dens) {
	sapply(techniques, confidenceIndexTechnic, data=subset(data, Err==0 & density == dens))
}

# on charge les données
data = read.table("data.txt", header=TRUE, sep=",")

########################################################################################################
# on enlève sempoint (decommenter la ligne)
#
####################################################
#
# 	data = subset(data, Technique != "SemPoint")
#
########################################################################################################

# on récupère les densité et les techniques
techniques 	= unique(data$Technique)
densities	= unique(data$density)

# on tri les techniques pour les avoir dans l'ordre
techniques = sort(techniques)

# on calcule le temps moyen des 3 technique pour chaque densité
meanTimesDensities = sapply(densities, meanTimeDensity, data=subset(data, Err==0), techniques = sort(techniques))

# on calcule l'indice de confiance des 3 technique pour chaque densité
confidenceIndexDensities = sapply(densities, confidenceIndexDensity, data=subset(data, Err==0), techniques=sort(techniques))

# permet de séparé les trois techniques par densité
split <- matrix(meanTimesDensities, 						# les données
				nrow = length(techniques), 					# le nombre de techniques par densité
				dimnames = list(techniques, densities) )	# les valeurs des densité

# on choisie les couleurs pour les bars (+1 pour évité la couleur noire)
colors = c(techniques)+1

barplot2(split, 									# les données à afficher
		col=colors, 								# les couleurs 
		plot.ci = TRUE, 							# on active les indices de confiances
		ci.l = split - confidenceIndexDensities, 	# indice de confiance min
		ci.u = split + confidenceIndexDensities,  	# indice de confiance max
		ylim = c(0,5), 								# on augmente l'ordonné
		beside = TRUE,								# permet de mettre les colonne les unes à coté des autres sinon elle s'empile
		xlab="Densite", 							# la legende pour l'axe x
		names.arg = colnames(split),				# les valeurs pour les densité
		ylab="Temps moyen")							# la legende pour l'axe y
		

legend("top", fill = colors, legend = techniques) # la legende des colonnes


