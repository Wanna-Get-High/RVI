//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//									MAIN  											//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// launch the function main when the page is openning
window.addEventListener('load', main , false);

	// add the events for the keyboard and mouse 
	window.addEventListener("keyup", handleKeyUp, false);
	window.addEventListener("keydown", handleKeyDown, false);

// the class that handle the movementof the camera in the scene
var fly;

// the selected cube by thee user in the scene
var selectedCube;

// the scene
var scene;

// the webGL canvas 
var canvasDom;

// the button to set the type of manipulation to indirect
var bIndirecte;

// the button to set the type of manipulation to direct
var bDirecte;

// the boolean to know if the selection is direct or indirect
var isDirect;

// the camera
var camera;

// the renderer that display the cubes in the scene.
var renderer;

// the old position of the selected item.
var oldX;
var oldY;

/* ∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗ 
 * 	The main function called
 */
function main() {
	// initialize the gl context from the canvas
	initGLRenderer();

	// then loop : draw, get events, update
	loop();
}


/** *******************************************
 * Main loop : draw, capture event, update scene, and loop again.
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
	renderer.render(scene, camera);
}


/** *******************************************
 *	Update the data
 */
function updateData() {
	// update the position and orientation of the camera
	// depending on the users 
  	fly.update();

}


/** *******************************************
 *	Initialise the web gl context
 */
function initGLRenderer() {
	// récupère la balise canvas de votre page html
	canvasDom = document.getElementById("webglCanvas");


	bIndirecte = document.getElementById("indirecte");
	bIndirecte.addEventListener("click",handleIndirect,false);

	bDirecte = document.getElementById("directe");
	bDirecte.addEventListener("click",handleDirect,false);

	canvasDom.addEventListener("mousedown",handleMouseDown,false); // sélection
	canvasDom.addEventListener("mouseup",handleMouseUp,false);
	canvasDom.addEventListener("mousemove", handleMouseMove, false);

	isDirect = false;

	// créé le renderer pour votre canvas
	renderer = new THREE.WebGLRenderer({canvas : canvasDom});

	// couleur en héxa; alpha = opacité = 1.0
	renderer.setClearColor(new THREE.Color(0xeeeeee),1.0); 

	// initialise the scene
	scene = new THREE.Scene();

	// set the position of the camera
	camera = new THREE.PerspectiveCamera(45,1.0,0.1,1000);
	camera.position.z = 20;

	// initialize the class that handle the movement in the scene of the camera
	fly = new Fly(camera);

	// add cubes to the scene
	initCubes();

	// add a light to the scene 
 	var pointLight = new THREE.PointLight(0xFFFFFF); // couleur d'éclairement
  	pointLight.position.z = 10; // pour la positionner

  	scene.add(pointLight); // il faut l'ajouter à la scène (les light dérivent de Object3D).
}


/** *******************************************
 *	Initialize the cubes in the environment.
 *		Set the size and position then add the cube to the scene.
 */
function initCubes() {

	for (var i = 0; i< 100; i++) {
		cube = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1),
			new THREE.MeshLambertMaterial( { color : Math.random()*0xFFFFFF}));

		cube.position.x = 20 * Math.random()-10;
		cube.position.y = 20 * Math.random()-10;
		cube.position.z = 20 * Math.random()-10;
			
		scene.add(cube);
	}
}

/** *******************************************
 *	Update the boolean values in the fly class
 *	depending on the key pressed.
 *		The boolean are use to update the position of the camera (see update).
 */
function handleKeyUp(event) {
	switch (event.keyCode) {
		// translation
		case 87 /* w */: fly.goForward 	= false; break;
    	case 83 /* s */: fly.goBackward	= false; break;
    	case 65 /* a */: fly.moveLeft 	= false; break;
    	case 68 /* d */: fly.moveRight 	= false; break;

    	// rotation
    	case 74 /* j */: fly.turnLeft	= false; break;
    	case 76 /* l */: fly.turnRight	= false; break;
    	case 73 /* i */: fly.lookDown	= false; break;
    	case 75 /* k */: fly.lookUp		= false; break;
  	}
}


function handleKeyDown(event) {

	switch (event.keyCode) {
		// translation
		case 87 /* w */: fly.goForward	= true;	break;
    	case 83 /* s */: fly.goBackward	= true;	break;
    	case 65 /* a */: fly.moveLeft	= true;	break;
    	case 68 /* d */: fly.moveRight	= true;	break;

    	// rotation
    	case 74 /* j */: fly.turnLeft	= true; break;
    	case 76 /* l */: fly.turnRight	= true; break;
    	case 73 /* i */: fly.lookDown	= true; break;
    	case 75 /* k */: fly.lookUp		= true; break;
  	}
}

function getNormalizedX(event) {
	return ((event.layerX - canvasDom.offsetLeft) / canvasDom.width - 0.5)*2;
}

function getNormalizedY(event) {
	return (((canvasDom.height - 1.0) - (event.layerY - canvasDom.offsetTop)) / canvasDom.height - 0.5) *2;
}

/** *******************************************
 *	Handle the click of the user on objects.
 */
function handleMouseDown(event) {

	// retrieve the position of the click on the canvas
	var x = getNormalizedX(event);
	var y =	getNormalizedY(event);

	// create a ray from the camera to the postition clicked by the user
	var projector = new THREE.Projector();
  	var ray = projector.pickingRay(new THREE.Vector3(x,y,0) , camera);

  	// retrieve the elements touched by the ray.
	var arrayIntersect = ray.intersectObjects(scene.children);

	// if the ray hit objects in the scene
	if (arrayIntersect.length > 0) {

    	selectedCube = arrayIntersect[0];//.object;// .object;
    	//selectedCube = first.object;
    	// we set the old position of the selected item
    	oldX = x;
    	oldY = y;
  	}

  	//console.log("oldX: "+oldX +" _ oldY:"+ oldY)
}

/** *******************************************
 *	Handle the movement of the selected object 
 */
function handleMouseMove(event) {
	if (selectedCube) {

		// retrieve the new position of the mouse
		var x = getNormalizedX(event);
		var y = getNormalizedY(event);

		// compute the movement
		var dx = (x-oldX);
		var dy = (y-oldY);

		if (isDirect) {
			console.log("not done");
		} else {
			// we get the world coordinate of the selected item
			var transformedCube = selectedCube.object.localToWorld(selectedCube.object.position);
			// then we transform the world coordinate of the selected item to the 
			// local coordinate of the camera
			transformedCube = camera.worldToLocal(transformedCube);

			// we apply the translation
			transformedCube.x +=  dx;
			transformedCube.y +=  dy;

			// then we go on the way back
			// local camera coordinate -> world coordinate
			transformedCube = camera.localToWorld(transformedCube);

			// world coordinate -> local selected item coordinate
			// and apply to the item
			selectedCube.object.position = selectedCube.object.worldToLocal(transformedCube);
		}

		// save the old position
		oldX = x;
		oldY = y;	
	}
}

function handleMouseUp(event) {
	selectedCube = null;
}

function handleIndirect(event) {
	isDirect = false;
}

function handleDirect(event) {
	isDirect = true;
}

