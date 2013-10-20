using UnityEngine;
using System.Collections;

public class moveSoldier : MonoBehaviour {
	
	public static Camera mainCamera;
	
	// Use this for initialization
	void Start () {
		//Camera.main.enabled = true;
		moveSoldier.mainCamera = Camera.main.camera;
		//print(camera);
		
		this.animation.Play("soldierIdleRelaxed");
		
		
	}
	
	// Update is called once per frame
	void Update () {
		//moveSoldier.mainCamera = Camera.main.camera;
		
		if (Input.GetKey(KeyCode.Escape)) {
			Application.LoadLevel("sceneExtra");
		}
		
		float xAxisValue = Input.GetAxis("Horizontal");
    	float zAxisValue = Input.GetAxis("Vertical") * 0.1f;
		
		// the movement speed depending if the user is using the shift key
		float sprintMultiplier = 1;
		
		if(Input.GetKey(KeyCode.LeftShift)) {
			sprintMultiplier = 2;
		}
		
		// the controller attached to the soldier
		CharacterController controller = GetComponent<CharacterController>();

		// the rotation applied to the soldier
		Vector3 rotation = new Vector3(0f,xAxisValue*3f,0f);
		
		// the direction (front or back)
		Vector3 moveDirection = transform.TransformDirection(new Vector3(0, 0, zAxisValue*sprintMultiplier));
		
		// applie to the soldier
		controller.transform.Rotate(rotation);
		controller.Move(moveDirection);
		
		// the animations trigger
		
		// if he foes frontward
		if(Input.GetKey("w")) {
			// if shift is entered then sprint
			if (Input.GetKey(KeyCode.LeftShift)) {
				this.animation["soldierSprint"].speed = 1;
				this.animation.CrossFade("soldierSprint");
			} else {
				this.animation["soldierWalk"].speed = 1;
				this.animation.CrossFade("soldierWalk");
			}
		// if he goes backward
		} else if (Input.GetKey("s")) {
			if (Input.GetKey(KeyCode.LeftShift)) {
				this.animation["soldierSprint"].speed = -1;
				this.animation.CrossFade("soldierSprint");
			} else {
				this.animation["soldierWalk"].speed = -1;
				this.animation.CrossFade("soldierWalk");
			}
		
		// the other way
		} else {
			
			// spin right 
			if (Input.GetKey("d")) this.animation.CrossFade("soldierSpinRight");
			// spin left
 			if (Input.GetKey("a")) this.animation.CrossFade("soldierSpinLeft");
			
			// idle
			if (Input.GetKeyUp("w") || Input.GetKeyUp("d") || Input.GetKeyUp("a") || Input.GetKeyUp("s")) this.animation.CrossFade("soldierIdleRelaxed");
		}
		
		
	}
}
