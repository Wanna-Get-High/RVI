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

// the plane used to make a direct manipulation of the cube
var plane;

// the raycaster used for the translation on Z axis and
// used to know which object is selected.
var raycaster;

// the =rotaion button
var bRotating;

// the boolean to know if the selection is for the rotation of the object
var isRotating;

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

	// we add the event listenners for the buttons.
	bIndirecte = document.getElementById("indirecte");
	bIndirecte.addEventListener("click",handleIndirect,false);

	bDirecte = document.getElementById("directe");
	bDirecte.addEventListener("click",handleDirect,false);

	bRotating = document.getElementById("rotating");
	bRotating.addEventListener("click", handleRotation, false);


	// we add the events listenners for the mouse
	canvasDom.addEventListener("mousedown",handleMouseDown,false); // sélection
	canvasDom.addEventListener("mouseup",handleMouseUp,false);
	canvasDom.addEventListener("mousemove", handleMouseMove, false);

	canvasDom.addEventListener("mousewheel",handleMouseWheelOther,false);
	canvasDom.addEventListener("DOMMouseScroll",handleMouseWheelFireFox,false);

	// we set the default values of the booleans
	isDirect = false;
	isRotating = false;

	// créé le renderer pour votre canvas
	renderer = new THREE.WebGLRenderer({canvas : canvasDom});

	// couleur en héxa; alpha = opacité = 1.0
	renderer.setClearColor(new THREE.Color(0xeeeeee),1.0); 

	// initialize the scene
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

/** *******************************************
 *	Normalize the value of the x position received 
 *	in the canvas to be between -1 and 1.
 */
function getNormalizedX(event) {
	return ((event.layerX - canvasDom.offsetLeft) / canvasDom.width - 0.5)*2;
}

/** *******************************************
 *	Normalize the value of the y position received 
 *	in the canvas to be between -1 and 1.
 */
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
  	raycaster = projector.pickingRay(new THREE.Vector3(x,y,0) , camera);

  	// retrieve the elements touched by the ray.
	var arrayIntersect = raycaster.intersectObjects(scene.children);

	// if the ray hit objects in the scene
	if (arrayIntersect.length > 0) {

    	selectedCube = arrayIntersect[0].object;// .object;
    	//selectedCube = first.object;
    	// we set the old position of the selected item

		plane = new THREE.Plane(new THREE.Vector3(0,0,1), -selectedCube.position.z);

    	oldX = x;
    	oldY = y;
  	}

}

/** *******************************************
 *	Handle the movement of the selected object 
 */
function handleMouseMove(event) {
	if (selectedCube) {

		// retrieve the new position of the mouse
		var x = getNormalizedX(event);
		var y = getNormalizedY(event);

		// if the user haven't clicked on rotation
		if (!isRotating) {

			// if he clicked on the "direct" button
			if (isDirect) {

				// we create a projector
				var projector = new THREE.Projector();

				// we update the raycaster 
				// (in order to have a good translation on Z see handleMouseWheel)
				raycaster = projector.pickingRay(new THREE.Vector3(x,y,0) , camera);

				// then we set the normal to be always looking to the camera
				// in the selected item local coordinate.
				// So that the plane is always parallel to the camera
				var transformedNormal = camera.localToWorld(new THREE.Vector3(0, 0, 1));
				transformedNormal = selectedCube.worldToLocal(transformedNormal);

				// we update the position of the plane
				plane.setFromNormalAndCoplanarPoint(transformedNormal, selectedCube.position);

				// we caste a ray on this plane
				var newPosition = raycaster.ray.intersectPlane(plane);

				// if the position is correct
				// we update the position of the selected cube.
				if (newPosition) {
					selectedCube.position = newPosition;
				}

			} else {

				// we get the world coordinate of the position of the selected item
				var transformedCube = selectedCube.localToWorld(selectedCube.position);
				// then we transform the world coordinate of the selected item 
				// to the local coordinate of the camera
				transformedCube = camera.worldToLocal(transformedCube);

				var dx = (x-oldX);
				var dy = (y-oldY);

				// we apply the translation
				transformedCube.x +=  dx;
				transformedCube.y +=  dy;

				// then we go on the way back
				// local camera coordinate -> world coordinate
				transformedCube = camera.localToWorld(transformedCube);

				// world coordinate -> local selected item coordinate
				// and apply the new position to the selected item
				selectedCube.position = selectedCube.worldToLocal(transformedCube);
			}
		} 
		// if the user wants to do a rotation
		else {

			// here the solution is simple :
			// since we can only pass a point in the methods localToWorld and worldToLocal
			// we create three points for 2 vectors (x axis vector and y axis vector).
			// 
			//	   	   vecY
			//	  		^
			//	  		|
			//	  		|
			//	  		|
			//    Orig   -----> vecX

			// in order to retrive the axis in the end is to substract vecY by Orig (Y axis)
			// and vecX by Orig (X axis)

			// we transform a vector from the camera local coordinates 
			// to the world one.
			var vecX = camera.localToWorld(new THREE.Vector3(1,0,0));
			var vecY = camera.localToWorld(new THREE.Vector3(0,1,0));
			var orig = camera.localToWorld(new THREE.Vector3(0,0,0));

			// then we transform theses positions to the local 
			// coordinate of the selected item
			vecX = selectedCube.worldToLocal(vecX);
			vecY = selectedCube.worldToLocal(vecY);
			orig = selectedCube.worldToLocal(orig);

			// we compute the angle
			var dx = (x-oldX);
			var dy = (y-oldY);

			// then we apply the rotation on the right axis.
			selectedCube.rotateOnAxis(vecX.sub(orig), -dy*2);
			selectedCube.rotateOnAxis(vecY.sub(orig), dx*2);
		}

		// save the old position
		oldX = x;
		oldY = y;	
	}
}

function handleMouseWheelOther(event) {
	handleMouseWheel(event.wheelDelta);
	event.preventDefault();
}

function handleMouseWheelFireFox(event) {
	handleMouseWheel(event.detail);
	event.preventDefault();
}

function handleMouseWheel(value) {

	// if an object is selected
	if (raycaster && selectedCube) {

		// we get the direction of the raycast
		var normalizedDirection = raycaster.ray.direction;
		normalizedDirection.normalize();

		// we apply the translation on this direction
		selectedCube.translateOnAxis(normalizedDirection, value/50);
	}
}


function handleMouseUp(event) {
	selectedCube = null;
}

function handleIndirect(event) {
	isDirect = false;
	isRotating = false;
}

function handleDirect(event) {
	isDirect = true;
	isRotating = false;
}

function handleRotation(event) {
	isRotating = true;
}

