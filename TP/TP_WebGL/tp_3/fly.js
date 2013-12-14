

function Fly(cam) {
	this.camera = cam;

	this.goForward = false;
	this.goBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
	this.turnLeft = false;
	this.turnRight = false;
	this.lookUp = false;
	this.lookDown = false;
}

Fly.prototype.update = function() {
	if (this.goForward) {
		this.moveFrontBackward(-0.1);
	} 

	if (this.goBackward) {
		this.moveFrontBackward(0.1);
	}

	if (this.moveLeft) {
		this.moveLeftRight(-0.1);
	} 

	if (this.moveRight) {
		this.moveLeftRight(0.1);
	}

	if (this.turnLeft) {
		this.updateTurnRotation(0.03);
	}

	if (this.turnRight) {
		this.updateTurnRotation(-0.03);
	} 

	if (this.lookUp) {
		this.updateLookRotation(0.03);
	} 

	if (this.lookDown) {
		this.updateLookRotation(-0.03);
	}
};

Fly.prototype.moveFrontBackward = function(val) {
	this.camera.translateOnAxis(new THREE.Vector3(0,0,1), val);
};

Fly.prototype.moveLeftRight = function(val) {
	this.camera.translateOnAxis(new THREE.Vector3(1, 0, 0), val);
};

Fly.prototype.updateTurnRotation = function(val) {
	this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), val);
};

Fly.prototype.updateLookRotation = function(val) {
	this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), val);
};