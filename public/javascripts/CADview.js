// This file contains the CADview class, which, in turn, contains everything
// needed to set up a CAD view of a JSON object.

// Must be refactored really bad!

function CADview ( target ) {
	self = this;

	self.target = target;

	var scene = new THREE.Scene();
	var ar = target.innerWidth()/target.innerHeight();
	var camera = new THREE.PerspectiveCamera(75, ar, 0.1, 1000);

	// Use WebGL only if available...
	if (window.WebGLRenderingContext)
		renderer = new THREE.WebGLRenderer({antialias: true});
	else
		renderer = new THREE.CanvasRenderer();
	renderer.setSize( target.innerWidth(), target.innerHeight() );
	renderer.setClearColor(0xffffff, 1);

	// LIGHTS
	// White directional light at half intensity shining from the top.
	var directionalLight = new THREE.DirectionalLight( 0xdddddd, 0.5 );
	directionalLight.position.set( 0, 1, 0 );
	scene.add( directionalLight );
	light = new THREE.AmbientLight( 0x999999 );
	scene.add( light );

	// Put renderer in target
	target.html(renderer.domElement)

	self.render = function () {
		//requestAnimationFrame(render);

		//cube.rotation.x += 0.1;
		//cube.rotation.y += 0.1;
		directionalLight.position = camera.position;
		console.log("RENDER");
		renderer.render(scene, camera);
	}

	// Use the GREAT OrbitControls.js
	controls = new THREE.OrbitControls( camera );
	console.log(controls)
	controls.rotateSpeed = 2; // Default 1
	controls.zoomSpeed = 2; // Default 1
	controls.target.set( 0, 0, 0 );
	controls.addEventListener( 'change', self.render );
	// Make it pan on shift+mousedown (controls.pan(dX,dY))?
	console.log(controls.object._quaternion);
	console.log(directionalLight);

	self.addModelToScene = function ( geom, materials ) {
		// Do something with it
		console.log("Part has been loaded");
		//console.log(geometry)
		var material = new THREE.MeshLambertMaterial( {color: 0x999999} );
		//material.wireframe = true;
		var mesh = new THREE.Mesh( geom, material );
		//mesh.scale.set(.002,.002,.002);
		//console.log(mesh)
		scene.add( mesh );
		//renderer.render(scene, camera);
		bS = mesh.geometry.boundingSphere.radius;
		if (bS) {
			console.log(camera);
			// Position camera orthogonally
			camera.position = new THREE.Vector3(-bS,bS,bS);
			// Look at zero
			camera.lookAt( new THREE.Vector3() );
		}
		self.render();
	}
	self.load = function ( url ) {
		// Initiate loading
		var loader = new THREE.JSONLoader();
		loader.load( url, self.addModelToScene );
	}
}