Francois Lepan

Tout est fait.

J'ai eu des problèmes pour charger les images de la vidéo car j'ai eu l'erreur suivante :

Error: WebGL: It is forbidden to load a WebGL texture 
from a cross-domain element that has not been validated with CORS. 
See https://developer.mozilla.org/en/WebGL/Cross-Domain_Textures


La solution rajouter ceci dans la balise vidéo : 
	
	crossorigin="anonymous"

J'ai trouvé la solution sur ce site :

	https://hacks.mozilla.org/2011/11/using-cors-to-load-webgl-textures-from-cross-domain-images/