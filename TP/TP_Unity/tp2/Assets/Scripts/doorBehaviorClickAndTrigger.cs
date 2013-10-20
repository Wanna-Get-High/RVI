using UnityEngine;
using System.Collections;

public class doorBehaviorClickAndTrigger : MonoBehaviour {
	
	public GameObject mainCamera;
	
	private bool isOpenned = false;
	private bool isAnim = false;
	
	// Use this for initialization
	void Start () {
	
	}
	
	 void OnTriggerEnter(Collider other) {
		this.audio.Play();
		this.animation.CrossFade("open-door");
	}
	
	 void OnTriggerExit(Collider other) {
		this.audio.Play();
		this.animation.CrossFade("close-door");
	}
	
	 void OnTriggerstay(Collider other) {
	}
	
	
	// set the value of isOpenned to true
	// set the value of isAnim to false
	void setOpenned() {
		this.isOpenned = true;
		this.isAnim = false;
	}
	
	
	// set the value of isOpenned to false
	// set the value of isAnim to false
	void setClosed() {
		this.isOpenned = false;
		this.isAnim = false;
	}
	
	void isAnimating() {
		this.isAnim = true;
	}
	
	// Update is called once per frame
	void Update () {
		
		// at the beginning of the animation set this value to true
		// at the end of the animation (open or closed) set this value to false
		// so it will go in only if the animation is over
		if (!this.isAnim) {
		
			if (Input.GetMouseButtonDown(0)){
			
				Ray clickPosition = mainCamera.camera.ScreenPointToRay(Input.mousePosition);
				RaycastHit hit;

				// if the ray hit an object	
				if (Physics.Raycast(clickPosition, out hit)) {
	
					// if the object is the door
					if (this.transform.gameObject == hit.transform.gameObject) {
						
						// play the associated audio
						this.audio.Play();
					
						// do an animation based on the previous one.
						if (isOpenned) {
							this.animation.Play("close-door");
						} else {
							this.animation.Play("open-door");
						}
					}
				}
			}
		}
	}
	
}