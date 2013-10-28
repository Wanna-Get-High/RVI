using UnityEngine;
using System.Collections;

public class Rotation : MonoBehaviour {
	
	public Vector3 rotation;
	
	// Use this for initialization
	void Start () {
		Debug.Log(gameObject.name);
	}
	
	// Update is called once per frame
	void Update () {
		transform.Rotate(rotation);
	}
}
