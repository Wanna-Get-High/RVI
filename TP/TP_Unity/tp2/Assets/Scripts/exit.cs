using UnityEngine;
using System.Collections;

public class exit : MonoBehaviour {
	
	public Texture guiTextureOver;
	public Texture guiTextureNormal;
	
	//public GameObject scene;
	
	private bool played;
	
	// Use this for initialization
	void Start () {
		this.played = false;
	}
	
	
	
	// Update is called once per frame
	void Update () {
	}
	
	 void OnMouseOver() {
       this.guiTexture.texture = guiTextureOver;
		if (!this.audio.isPlaying && !this.played) 
			this.audio.Play();
		
		this.played = true;
		
		if (Input.GetMouseButtonDown(0)){
			Application.Quit();
		}
    }
	
	void OnMouseExit() {
		this.played = false;
		this.guiTexture.texture = guiTextureNormal;
	}
}
