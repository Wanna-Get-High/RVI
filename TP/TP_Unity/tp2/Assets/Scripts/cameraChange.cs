using UnityEngine;
using System.Collections;

public class cameraChange : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	void OnTriggerEnter(Collider other) {
		
		print("entered");
		
		moveSoldier.mainCamera.enabled = false;
		moveSoldier.mainCamera = this.camera;
		moveSoldier.mainCamera.enabled = true;
		
	}
	
	// Update is called once per frame
	void Update () {
		
	}
}
