using UnityEngine;
using System.Collections;

public class start : MonoBehaviour {
	
	public Texture guiTextureOver;
	public Texture guiTextureNormal;
	
	public GameObject level;
	
	private bool played;
	
	// Use this for initialization
	void Start () {
		this.played = false;
	}
	
	// Update is called once per frame
	void Update () {
		if (Input.GetKeyDown(KeyCode.Escape)){
			Application.LoadLevel("scene5");
		}
	}
	
	 void OnMouseOver() {
       this.guiTexture.texture = guiTextureOver;
		if (!this.audio.isPlaying && !this.played) 
			this.audio.Play();
		
		this.played = true;
		
		if (Input.GetMouseButtonDown(0)){
			Application.LoadLevel("scene5");
		}
    }
	
	void OnMouseExit() {
		this.played = false;
		this.guiTexture.texture = guiTextureNormal;
	}
}
