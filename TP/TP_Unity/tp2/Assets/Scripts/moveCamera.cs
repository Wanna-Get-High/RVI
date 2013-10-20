using UnityEngine;
using System.Collections;

public class moveCamera : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	 	float xAxisValue = Input.GetAxis("Horizontal");
    	float zAxisValue = Input.GetAxis("Vertical");
		float mouseXPosition = Input.GetAxis("Mouse X");
    	float mouseYPosition = Input.GetAxis("Mouse Y");
		
		if(Camera.current != null) {
        	Camera.current.transform.Translate(new Vector3(xAxisValue*0.75f, 0.0f, zAxisValue*0.75f));
			Camera.current.transform.Rotate(new Vector3(-mouseYPosition*2f ,mouseXPosition*2f,0));
    	}
		
	}
}
