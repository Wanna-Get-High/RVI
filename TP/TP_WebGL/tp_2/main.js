//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//									MAIN  											//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// launch the function main when the page is openning
window.addEventListener('load', main , false);

// addd the events for the keyboard and mouse 
window.addEventListener("keyup",handleKeyUp,false);
window.addEventListener("keydown",handleKeyDown,false);
window.addEventListener("click",handleClick,false);

var angleX=0.0;
var fly;
var selectedCube;

/* ∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗ 
 * 	The main function called
 */
function main() {
	// initialise the gl context from the canvas
	initGLRenderer();

	// then loop : draw, get events, update
	loop();
}


/** *******************************************
 * main loop : draw, capture event, update scene, and loop again.
 */
function loop() {
	drawScene();
  	updateData();
  	window.requestAnimationFrame(loop);
}

/** *******************************************
 *	Draw the scene
 */
function drawScene() {
	renderer.render(scene,camera);
}

/** *******************************************
 *	Update the data
 */
function updateData() {
  	fly.update();

  	if (selectedCube)
  		selectedCube.rotation.z += 0.05;
}

/** *******************************************
 *	Initialise the web gl context
 */
function initGLRenderer() {
	// récupère la balise canvas de votre page html
	canvasDom = document.getElementById("webglCanvas");

	// créé le renderer pour votre canvas
	renderer = new THREE.WebGLRenderer({canvas : canvasDom});

	// couleur en héxa; alpha = opacité = 1.0
	renderer.setClearColor(new THREE.Color(0xeeeeee),1.0); 

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera(45,1.0,0.1,1000);
	//camera.position.x = -1;
	camera.position.z = 20;
	//camera.position.z = -1;
	
	fly = new Fly(camera);

	//cube.translateOnAxis(new THREE.Vector3(1,0,0),0.5); // par exemple
	
	initCubes();

 	var pointLight = new THREE.PointLight(0xFFFFFF); // couleur d'éclairement
  	pointLight.position.z = 10; // pour la positionner

  	scene.add(pointLight); // il faut l'ajouter à la scène (les light dérivent de Object3D).

 	//renderer.render(scene,camera);
}

function initCubes() {

	for (var i = 0; i< 100; i++) {
		cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1, 10, 10, 10),
			new THREE.MeshLambertMaterial( { color : Math.random()*0xFFFFFF}));

		cube.position.x = 10 * Math.random()-5;
		cube.position.y = 10 * Math.random()-5;
		cube.position.z = 10 * Math.random()-5;
			
		scene.add(cube);
	}
}




function handleKeyUp(event) {
	switch (event.keyCode) {
		// translation
		case 87 /* w */: fly.goForward=false;break;
    	case 83 /* s */: fly.goBackward=false;break;
    	case 65 /* a */: fly.moveLeft=false;break;
    	case 68 /* d */: fly.moveRight=false;break;

    	// rotation
    	case 74 /* j */: fly.turnLeft=false;break;
    	case 76 /* l */: fly.turnRight=false;break;
    	case 73 /* i */: fly.lookDown=false;break;
    	case 75 /* k */: fly.lookUp=false;break;
  	}
}

function handleKeyDown(event) {
//	console.log("keydown : "+event.keyCode);

	switch (event.keyCode) {
		// translation
		case 87 /* z */: fly.goForward=true;break;
    	case 83 /* s */: fly.goBackward=true;break;
    	case 65 /* q */: fly.moveLeft=true;break;
    	case 68 /* d */: fly.moveRight=true;break;

    	// rotation
    	case 74 /* j */: fly.turnLeft=true;break;
    	case 76 /* l */: fly.turnRight=true;break;
    	case 73 /* i */: fly.lookDown=true;break;
    	case 75 /* k */: fly.lookUp=true;break;
  	}
}

function handleClick(event) {

	var x = ((event.layerX - canvasDom.offsetLeft) / canvasDom.width - 0.5)*2;
	var y = (((canvasDom.height - 1.0) - (event.layerY - canvasDom.offsetTop)) / canvasDom.height - 0.5) *2;

	var projector = new THREE.Projector();
  	var ray = projector.pickingRay(new THREE.Vector3(x,y,0) , camera);

	var arrayIntersect = ray.intersectObjects(scene.children);

	if (arrayIntersect.length > 0) {
		var first = arrayIntersect[0];
    	selectedCube = first.object;
  	}
}

