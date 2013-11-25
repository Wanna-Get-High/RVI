//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//									MAIN  											//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// launch the function main when the page is openning
window.addEventListener('load', main , false);

// a gloabal variable that will contain the webgl context
var gl; 
var angle;
var projection;
var modelView;
var mouseDown;
var lastMouseX = null;
var lastMouseY = null;
var angleY = 0;
var angleX = 0;

/* ∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗∗ 
 * 	The main function called
 */
function main() {
	// initialise the gl context from the canvas
	initGL();

	projection = new Mat4();
	modelView = new Mat4();

	// initialize the projection matrix
	projection.setFrustum(-0.1, 0.1, -0.1, 0.1, 0.1, 1000);
	angle = 0;

	modelView.setIdentity();

	// initialize the data for the triangle
	initDataTriangle();
	modelView.rotateX(Math.PI);

	// initialize the data for the sphere
	initDataSphere(20, 20);

	// then loop : draw, get events, update
	loop();
}

/** *******************************************
 * 	Initialize the gl context from the canvas 
 * 		+ basic default gl settings 
 */
function initGL () {

	canvas = document.getElementById("webglCanvas");

	canvas.addEventListener('mousedown', handleMouseDown, false);
	document.addEventListener('mousemove', handleMouseMove, false);
	document.addEventListener('mouseup', handleMouseUp, false);

	gl = canvas.getContext("webgl");

	if (!gl) {
		alert("cant initialize webgl context");
	} else {
		console.log(gl.getParameter(gl.VERSION) + " | " + 
					gl.getParameter(gl.VENDOR) + " | " + 
					gl.getParameter(gl.RENDERER) + " | " +
					gl.getParameter(gl.SHADING_LANGUAGE_VERSION));
	} 

	gl.clearColor(0 ,0 ,0 ,1); 
	gl.clearDepth(1.0);
	gl.enable(gl.DEPTH_TEST);

	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
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
	// clear the display
	gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);


	// draw the triangle
	//drawTriangleWithColor();
	//drawTriangleWithTexture();

	drawSphereWithTexture();
}



/** *******************************************
 *	Update the data
 */
function updateData() {
	updateSphereTexture();

	modelView.rotateY(angleY);
	modelView.rotateX(angleX);
	
}


/** *******************************************
 *	create the program shader (vertex+fragment).
 * 		the code is read from html elements
 */
 function createProgram(id) {
 	var programShader = gl.createProgram();

  	var vert = getShader(id+"-vs");
  	var frag = getShader(id+"-fs");

  	gl.attachShader(programShader,vert);
  	gl.attachShader(programShader,frag);
  	gl.linkProgram(programShader);
  
  	if (!gl.getProgramParameter(programShader,gl.LINK_STATUS)) {
    	alert(gl.getProgramInfoLog(programShader));
    	return null;
  	}

  	console.log("compilation shader ok");
  	return programShader;
}

/** *******************************************
 *  Read shaders (read from html elements) and compile
 */
function getShader(id) {

	//console.log(id);
	var shaderScript = document.getElementById(id);
	//console.log(shaderScript);

	var k = shaderScript.firstChild;
	var str = k.textContent;
	var shader;

	if (shaderScript.type == "x-shader/x-fragment") {
    	shader = gl.createShader(gl.FRAGMENT_SHADER);
  	} else if (shaderScript.type == "x-shader/x-vertex") {
    	shader = gl.createShader(gl.VERTEX_SHADER);
  	}

  	gl.shaderSource(shader, str);
  	gl.compileShader(shader);

  	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    alert(gl.getShaderInfoLog(shader));
    	return null;
  	}

  	return shader;
 }

/** *******************************************
 *	Initialise the texture from an HTML id
 */
function initTexture(id) {

	var imageData = document.getElementById(id);

	textureId = gl.createTexture();

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textureId);

	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imageData);

	return textureId;
}


function handleMouseDown(event) {

	lastMouseX = (event.layerX - canvas.offsetLeft);
	lastMouseY = (canvas.height - 1.0) - (event.layerY - canvas.offsetTop);

	mouseDown = true;
}

function handleMouseMove(event) {
	if (!mouseDown) {
      return;
    }

	var newX = (event.layerX - canvas.offsetLeft);
    var newY = (canvas.height - 1.0) - (event.layerY - canvas.offsetTop);

    var deltaX = newX - lastMouseX;
    var deltaY = newY - lastMouseY;

	angleY = degToRad(deltaX/10);
	angleX = degToRad(deltaY/10);

	lastMouseX = newX
    lastMouseY = newY;
}

function handleMouseUp(event) {
	mouseDown = false;

	angleX = 0;
	angleY = 0;
}

function degToRad(degrees) {
        return degrees * Math.PI / 180;
}


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//									SPHERE  										//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

var sphereProgramShader;

// buffers
var sphereVertexBuffer;
var sphereTexCoordBuffer;

// texture
var sphereTexure;

// pointers
var sphereVertexLocation;
var sphereTexCoordLocation;
var sphereTextureLocation;
var sphereTriangleCoordBuffer;

// projection and model view matrix
var sphereModelViewLocation;
var sphereProjectionLocation;

var nbLongitudeBands;	// meridiens
var nbLatitudeBands;	// parallèles

var nbElem;

function initDataSphere(nbLongBands, nbLatBands) {
	
	nbLongitudeBands = nbLongBands;
	nbLatitudeBands = nbLatBands;

	sphereProgramShader 		= createProgram("sphere");

	// initialize the buffer containing the data
	sphereVertexBuffer 			= initSphereVertice();
	sphereTexCoordBuffer 		= initSphereTextureCoord();
	sphereTriangleCoordBuffer 	= initTriangleSphere();
	sphereTexure 				= initTexture("repas");

	// get the location of the buffers
	sphereVertexLocation 		= gl.getAttribLocation(sphereProgramShader, 'vertex');
	sphereTexCoordLocation 		= gl.getAttribLocation(sphereProgramShader, 'texCoord');

	// get the location of the texture
	sphereTextureLocation 		= gl.getUniformLocation(sphereProgramShader, 'texture0' );

	// get the location of the matrices
	sphereModelViewLocation		= gl.getUniformLocation(sphereProgramShader, 'modelView');
	sphereProjectionLocation	= gl.getUniformLocation(sphereProgramShader, 'projection');
}


function initSphereVertice() {

	var radius = 1;
 	var vertex = new Array();	

	for (var j = 0; j <= nbLatitudeBands; j++) {
 		var theta = j * Math.PI / nbLatitudeBands;
    	var sinTheta = Math.sin(theta);
      	var cosTheta = Math.cos(theta);

 	for (var i = 0; i <= nbLongitudeBands; i++) {
	 		var phi = i * 2 * Math.PI / nbLongitudeBands;

	 		var sinPhi = Math.sin(phi);
        	var cosPhi = Math.cos(phi);

        	var x = cosPhi * sinTheta;
        	var y = cosTheta;
        	var z = sinPhi * sinTheta;
 		
        	vertex.push(x);
        	vertex.push(y);
        	vertex.push(z);
 		}
 	}

	// create a buffer then bind it (create memory in the webgl context)
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// then fill the buffer with the vertex array
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	// return the created buffer
	return vertexBuffer;
}


function initTriangleSphere() {

	var indexData = new Array();

	nbElem = 0;

    for (var latNumber = 0; latNumber < nbLatitudeBands; latNumber++) {
      for (var longNumber = 0; longNumber < nbLongitudeBands; longNumber++) {
        
        var first = (latNumber * (nbLongitudeBands + 1)) + longNumber;
        var second = first + nbLongitudeBands + 1;

        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);

      }
    }

    nbElem = indexData.length;

    // create a buffer then bind it (create memory in the webgl context)
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexBuffer);

	// then fill the buffer with the vertex array
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STATIC_DRAW);

	// return the created buffer
	return vertexBuffer;
}

/** *******************************************
 *	Initialize the colors for the triangles
 */
function initSphereTextureCoord() {

 	var vertex = new Array();

	for (var j = 0; j <= nbLatitudeBands; j++) {
 		for (var i = 0; i <= nbLongitudeBands; i++) {
 			vertex.push(1 - (i / nbLongitudeBands));
 			vertex.push(1 - (j / nbLatitudeBands));
 		}
 	}

	// create a buffer then bind it (create memory in the webgl context)
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// then fill the buffer with the vertex array
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	// return the created buffer
	return vertexBuffer;
}

/** *******************************************
 *	Update the texture
 */
function updateSphereTexture() {
	var imageData = document.getElementById("repas");

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, sphereTexure);
	
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, imageData);
}


function drawSphereWithTexture() {

	// enable shader + get vertex location
	gl.useProgram(sphereProgramShader);

	/////////////////////////////////
	// the texture of the sphere   //
	/////////////////////////////////
	gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, sphereTexure);
	gl.uniform1i(sphereTextureLocation, 0);

	// the projection matrix and the model view matrix
	gl.uniformMatrix4fv(sphereModelViewLocation, gl.FALSE, modelView.fv);
	gl.uniformMatrix4fv(sphereProjectionLocation, gl.FALSE, projection.fv);

	gl.enableVertexAttribArray(sphereVertexLocation);
	gl.enableVertexAttribArray(sphereTexCoordLocation);

	/////////////////////////////////////////////
	// the texture coordinates of the sphere   //
	/////////////////////////////////////////////
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereTexCoordBuffer);
	gl.vertexAttribPointer(sphereTexCoordLocation, 2, gl.FLOAT, gl.FALSE, 0, 0);

	////////////////////////////////////////////////
	// the location of the points of the sphere   //
	////////////////////////////////////////////////
	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVertexBuffer);
    gl.vertexAttribPointer(sphereVertexLocation, 3, gl.FLOAT, false, 0, 0);

   	/////////////////////////////////////////////////////
	// the triangles bounding the points of the sphere //
	/////////////////////////////////////////////////////
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereTriangleCoordBuffer);


	gl.drawElements(gl.TRIANGLES, nbElem, gl.UNSIGNED_SHORT, 0);

	// disable all
	gl.disableVertexAttribArray(sphereVertexLocation);
	gl.disableVertexAttribArray(sphereTexCoordLocation);
	gl.useProgram(null);
}


//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
//									TRIANGLE 										//
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

var triangleProgramShader;

// buffers
var triangleVertexBuffer;
var triangleColorBuffer;
var triangleTexCoordBuffer;

// texture
var triangleTexure;

// pointers
var triangleVertexLocation;
var triangleTexCoordLocation;
var triangleTextureLocation;
var triangleColorVertexLocation;

// the triangle modelview and projection matrices
var triangleModelViewLocation;
var triangleProjectionLocation;

/** *******************************************
 *	Initialize the data for the triangle
 */
function initDataTriangle() {

	triangleProgramShader 		= createProgram("triangle");

	// initialize the buffer containing the data
	triangleVertexBuffer 		= initTriangleVertice();
	triangleColorBuffer 		= initTriangleColor();
	triangleTexCoordBuffer 		= initTriangleTextureCoord();
	triangleTexure 				= initTexture("earthDay");


	// get the location of the buffers
	triangleVertexLocation 		= gl.getAttribLocation(triangleProgramShader, 'vertex');
	triangleColorVertexLocation	= gl.getAttribLocation(triangleProgramShader, 'aVertexColor');
	triangleTexCoordLocation 	= gl.getAttribLocation(triangleProgramShader, 'texCoord');

	// get the location of the texture
	triangleTextureLocation 	= gl.getUniformLocation(triangleProgramShader, 'texture0' );

	// get the location of the matrices
	triangleModelViewLocation	= gl.getUniformLocation(triangleProgramShader, 'modelView');
	triangleProjectionLocation	= gl.getUniformLocation(triangleProgramShader, 'projection');
}


/** *******************************************
 *	Initialise the triangle vertices.
 * 		Initialize the buffer and bind it.
 */
function initTriangleVertice() {

	// the 3 points of the triangle
	var vertex = [-0.5, 0.5, 0.0, 0.5, 0.5, 0.0, 0.0, -0.5, 0.0];

	// create a buffer then bind it (create memory in the webgl context)
	var vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

	// then fill the buffer with the vertex array
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex), gl.STATIC_DRAW);

	// return the created buffer
	return vertexBuffer;
}

/** *******************************************
 *	Initialize the colors for the triangles
 */
function initTriangleColor() {
    // the 3 colors for each point
    //                    r    g    b   alpha
    var vertexColors =	[1.0, 0.0, 0.0, 1.0,
                         0.0, 1.0, 0.0, 1.0,
                         0.0, 0.0, 1.0, 1.0 ];

    // create a buffer then bind it (create memory in the webgl context)
    var colorBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // then fill the buffer with the vertexColors array
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // return the created buffer
    return colorBuffer;
}

/** *******************************************
 *	Initialize the colors for the triangles
 */
function initTriangleTextureCoord() {

	//					  u    v
    var vertexTexture = [0.0, 0.0,
                         1.0, 0.0,
                         0.0, 1.0 ];

    // create a buffer then bind it (create memory in the webgl context)
    var textureBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);

    // then fill the buffer with the vertexColors array
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexTexture), gl.STATIC_DRAW);

    // return the created buffer
    return textureBuffer;
}


function drawTriangleWithTexture() {
	gl.useProgram(triangleProgramShader);

	gl.uniform1i(triangleTextureLocation, 0);

	gl.uniformMatrix4fv(triangleModelViewLocation, gl.FALSE, modelView.fv);
	gl.uniformMatrix4fv(triangleProjectionLocation, gl.FALSE, projection.fv);

	gl.enableVertexAttribArray(triangleVertexLocation);
	gl.enableVertexAttribArray(triangleTexCoordLocation);

	//////////////////////////////////
	// the position of the triangle //
	//////////////////////////////////
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
	gl.vertexAttribPointer(triangleVertexLocation, 3, gl.FLOAT, gl.FALSE, 0, 0);

	/////////////////////////////////
	// the texture of the triangle //
	/////////////////////////////////
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleTexCoordBuffer);
	gl.vertexAttribPointer(triangleTexCoordLocation, 2, gl.FLOAT, gl.FALSE, 0, 0);

	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, triangleTexure);

	// draw the triangle
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	// disable all
	gl.disableVertexAttribArray(triangleVertexLocation);
	gl.disableVertexAttribArray(triangleTexCoordLocation);
	gl.useProgram(null);
}

/** *******************************************
 *	draw the colored triangle
 */
function drawTriangleWithColor() {

	// enable shader + get vertex location
	gl.useProgram( triangleProgramShader );

	// the projection matrix and the model view matrix
	gl.uniformMatrix4fv(triangleModelViewLocation, gl.FALSE, modelView.fv);
	gl.uniformMatrix4fv(triangleProjectionLocation, gl.FALSE, projection.fv);

	gl.enableVertexAttribArray(triangleColorVertexLocation);
    gl.enableVertexAttribArray(triangleVertexLocation);
    
	///////////////////////////////
	// the color of the triangle //
	///////////////////////////////
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
	gl.vertexAttribPointer(triangleColorVertexLocation, 4, gl.FLOAT, gl.FALSE, 0, 0);

	//////////////////////////////////
	// the position of the triangle //
	//////////////////////////////////
	gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
	gl.vertexAttribPointer(triangleVertexLocation, 3, gl.FLOAT, gl.FALSE, 0, 0);

	// draw the triangle
	gl.drawArrays(gl.TRIANGLES, 0, 3);

	// disable all
	gl.disableVertexAttribArray(triangleVertexLocation);
	gl.disableVertexAttribArray(triangleColorVertexLocation);
	gl.useProgram(null);
}
