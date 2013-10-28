using UnityEngine;
using System.Collections;

public class InteractionSouris : MonoBehaviour {
	
	RaycastHit hit;
	
	Ray clickPosition;
	
	Vector3 oldPosition;
	
	
	// Use this for initialization
	void Start () {
		
	}
	
	
	void OnGUI () {
		if (Input.GetMouseButton(0) ){
			
			Ray clickPosition = this.camera.ScreenPointToRay(Input.mousePosition);
			RaycastHit hit;

			// if the ray hit an object	
			if (Physics.Raycast(clickPosition, out hit)) {
				string text = hit.transform.name + "\n"
								+"[ x = " + hit.transform.position.x 
								+ ", y = " + hit.transform.position.y 
								+ ", z = " + hit.transform.position.z + " ]";
				
				GUI.Label(new Rect(Input.mousePosition.x,Screen.height-Input.mousePosition.y,200,100),text);
			}
		}
	}
	
	// Update is called once per frame
	void Update () {
		
		if (Input.GetMouseButtonDown(0) ){
			clickPosition = this.camera.ScreenPointToRay(Input.mousePosition);	
			// if the ray hit an object	store data in the 
			
			Physics.Raycast(clickPosition, out hit);
			oldPosition = Input.mousePosition;
		}
		
		
		if (Input.GetMouseButton(0) && !hit.Equals(null) ){

			// if the ray hit an object	store data in the 
			Vector3 delta = Input.mousePosition - oldPosition;
			oldPosition = Input.mousePosition;
			
			hit.transform.Translate(delta.x/20,delta.y/20,0,Space.World);
		}
	}
}
