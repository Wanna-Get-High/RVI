using UnityEngine;
using System.Collections;

public class CameraMove : MonoBehaviour {
	
	// the associated object on which the camera will turn around
	public GameObject sphere;
	
	// Use this for initialization
	void Start () {
		
	
	}
	
	// Update is called once per frame
	void Update () {
		// we turn around the sphere
		// at a speed of 2 degree / seconds
		// on the Y axis
		transform.RotateAround(sphere.transform.position,Vector3.up,Time.deltaTime*2);
		
		// we always look at the sphere
		transform.LookAt(sphere.transform.position);
	}
}
