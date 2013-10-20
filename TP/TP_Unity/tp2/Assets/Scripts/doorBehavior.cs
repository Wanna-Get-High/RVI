using UnityEngine;
using System.Collections;

public class doorBehavior : MonoBehaviour {
	
	private bool isOpenned = false;
	
	// Use this for initialization
	void Start () {
	
	}
	
	void setOpenned() {
		this.isOpenned = true;
	}
	
	void setClosed() {
		this.isOpenned = false;
	}
	
	void isAnimating() {
	}
	
	// Update is called once per frame
	void Update () {

		if (GameObject.FindGameObjectsWithTag("Object").Length == 0) {
			if (!isOpenned && !this.animation.isPlaying) {
				
				this.animation.Play("open-door");
				this.audio.Play();
				
			}
		}

	}
	
}