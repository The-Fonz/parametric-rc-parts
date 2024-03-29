// This file contains the CADview class, which, in turn, contains everything
// needed to set up a CAD view of a JSON object.

// Some constants
var MIN_AR = 1.5; // Minimum aspect ratio for camera and renderer (width/height)

// # Constructor
function CADview ( target ) {

	this.scene = new THREE.Scene();

	// ## Init camera

	function ar() {
		// Calculates aspect ratio
		// .clientWidth is vanilla javascript
		return target.clientWidth / target.clientHeight;
	}

	// First make sure that height is not supersmall
	if ( ar() > MIN_AR ) {
		// Assume that width is correct
		// Use CSS for setting height property
		target.style.height = String(target.clientWidth / MIN_AR) + 'px';
	}

	this.camera = new THREE.PerspectiveCamera(75, ar(), 0.1, 1000);

	// ## Init renderer
	if (window.WebGLRenderingContext) {
		// Use WebGL only if available...
		this.renderer = new THREE.WebGLRenderer({antialias: true});
	} else {
		this.renderer = new THREE.CanvasRenderer();
	}

	// Set renderer size
	this.renderer.setSize( target.clientWidth, target.clientHeight );

	/* Make render element resize on window resize
	Note: doesn't work, aspect ratio doesn't get set properly
	window.addEventListener("resize", function (e) {

		this.renderer.setSize( target.clientWidth, target.clientHeight );

		// Don't forget to set aspect ratio as well!
		this.camera.aspect = ar();
		console.log(this.camera);
	}.bind(this),
	true);*/

	// Set background color
	this.renderer.setClearColor(0xffffff, 1);

	// Empty container div
	target.innerHTML = '';
	// Put renderer in target div
	target.appendChild(this.renderer.domElement);

	// ## Init lights
	// White directional light at half intensity shining from the top.
	this.directionalLight = new THREE.DirectionalLight( 0xdddddd, 0.5 );
	this.directionalLight.position.set( 0, 1, 0 );
	this.scene.add( this.directionalLight );
	// Add ambient light
	this.ambientLight = new THREE.AmbientLight( 0x999999 );
	this.scene.add( this.ambientLight );

	// ## Use the GREAT OrbitControls.js
	// Don't forget to specify target! Otherwise it's document
	controls = new THREE.OrbitControls( this.camera, target );
	controls.rotateSpeed = 2; // Default 1
	controls.zoomSpeed = 2; // Default 1
	controls.target.set( 0, 0, 0 );
	controls.addEventListener( 'change', this.render.bind(this) );

}

CADview.prototype.render = function () {
	//requestAnimationFrame(render);
	this.directionalLight.position = this.camera.position;
	//console.log("RENDER");
	this.renderer.render( this.scene, this.camera );
}

CADview.prototype.addModelToScene = function ( geom, materials ) {

	// Let listeners know that we've received the JSON model
	//$(this).trigger()

	var material = new THREE.MeshLambertMaterial( {color: 0x999999} );
	//material.wireframe = true;
	var mesh = new THREE.Mesh( geom, material );
	//mesh.scale.set(.002,.002,.002);

	// First clear scene
	this.clearScene();
	// Now add mesh
	this.scene.add( mesh );

	// ## Set camera position based on bounding sphere
	bS = mesh.geometry.boundingSphere.radius;
	if (bS) {
		//console.log(camera);
		// Position camera orthogonally
		this.camera.position = new THREE.Vector3(-bS,bS,bS);
		// Look at zero
		this.camera.lookAt( new THREE.Vector3() );
	}
	this.render();
}

CADview.prototype.load = function ( url, progressCb ) {
	// Initiate loading
	var loader = new THREE.JSONLoader();
	loader.load( url, this.addModelToScene.bind(this) );

	/* This is a tryout to try and indicate progress. Kinda works but tries to
	   load 'undefined' which gives an error. Have to look into it to get it to work. */
	if ( progressCb === undefined ) {
		progressCb = function (obj) {
			console.log( "Loading progress! Total: " + obj.total + ", loaded: " + obj.loaded );
		}
	}
	//loadAjaxJSON = function ( context, url, callback, texturePath, callbackProgress )
	// loader.extractUrlBase(url) is needed, see THREE.JSONLoader.load
	loader.loadAjaxJSON( loader, url, this.addModelToScene.bind(this), loader.extractUrlBase(url), progressCb )
}

CADview.prototype.clearScene = function () {
// Clear the entire scene except for plane and camera
	for ( var i = this.scene.children.length - 1; i >= 0 ; i -- ) {
		var obj = this.scene.children[ i ];
		// Add any object that shouldn't be deleted in this if statement
		if ( obj !== this.camera &&
			obj !== this.directionalLight &&
			obj !== this.ambientLight ) {
			this.scene.remove(obj);
		}
	}
}