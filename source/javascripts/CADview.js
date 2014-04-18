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
	light = new THREE.AmbientLight( 0x999999 );
	this.scene.add( light );

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

	var material = new THREE.MeshLambertMaterial( {color: 0x999999} );
	//material.wireframe = true;
	var mesh = new THREE.Mesh( geom, material );
	//mesh.scale.set(.002,.002,.002);

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

CADview.prototype.load = function ( url ) {
	// Initiate loading
	var loader = new THREE.JSONLoader();
	loader.load( url, this.addModelToScene.bind(this) );
}