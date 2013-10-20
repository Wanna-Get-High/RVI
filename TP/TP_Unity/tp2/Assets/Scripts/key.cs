using UnityEngine;
using System.Collections;

public class key: MonoBehaviour {
	
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		
		transform.Rotate(new Vector3(0,0,1));
		
		
		if (Input.GetMouseButtonDown(0)){
			
			//Camera cam = this.GetComponent<moveSoldier>().mainCamera;
			
			Ray clickPosition = moveSoldier.mainCamera.ScreenPointToRay(Input.mousePosition);
			
			RaycastHit hit;
			
			// if we click on the key			
			if (Physics.Raycast(clickPosition,out hit)) {
				//print("plop");
				if (this.transform.gameObject == hit.transform.gameObject)
				
				Destroy(this.transform.gameObject);
				//DestroyImmediate(this.transform.gameObject);
			}
		}
	}
}
