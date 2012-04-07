var Terrain = (function() {
	return {
		terrain : null,
		desert : "/resources/textures/terrain/desert.png",
		dirtLight : "/resources/textures/terrain/dirt-lighter.png",
		dirt : "/resources/textures/terrain/dirt.png",
		grassLight : "/resources/textures/terrain/grass-lighter.png",
		grass : "/resources/textures/terrain/grass.png",
		rock : "/resources/textures/terrain/rock.png",
		sand : "/resources/textures/terrain/sand.png",
		swamp : "/resources/textures/terrain/swamp.png",
		water : "/resources/textures/terrain/water.png",

		init : function() {
			var grassTexture = THREE.ImageUtils.loadTexture(this.grass);
			var rockTexture = THREE.ImageUtils.loadTexture(this.rock);
			var waterTexture = THREE.ImageUtils.loadTexture(this.water);

			waterTexture.wrapS = rockTexture.wrapS = grassTexture.wrapS = THREE.RepeatWrapping;
			waterTexture.wrapT = rockTexture.wrapT = grassTexture.wrapT = THREE.RepeatWrapping;
			waterTexture.repeat.x = rockTexture.repeat.x = grassTexture.repeat.x = 10;
			waterTexture.repeat.y = rockTexture.repeat.y = grassTexture.repeat.y = 10;
			waterTexture.doubleSided = rockTexture.doubleSided = grassTexture.doubleSided = true;

			var waterGeometry = new THREE.PlaneGeometry(100000, 100000, 10, 10);
			var water = new THREE.Mesh(waterGeometry, new THREE.MeshLambertMaterial({
				map: waterTexture
			}));
			water.rotation.x = -90  * MathHelpers.DEG_TO_RAD;
			global.app.scene.add(water);

			var geometry = new THREE.PlaneGeometry(100000, 100000, 100, 100);
			geometry.dynamic = true;
			for (var i = geometry.vertices.length - 1; i >= 0; i--) {
				geometry.vertices[i].position.z = Math.random() * 10 - 5;
			};


			this.terrain = new THREE.Mesh(
			    geometry,
			    new THREE.ShaderMaterial({
			        uniforms: {
			            texture_grass: { type: "t", value: 0, texture: grassTexture },
			            texture_rock: { type: "t", value: 1, texture: rockTexture },
			        },
			        vertexShader: document.getElementById( 'groundVertexShader' ).textContent,
			        fragmentShader: document.getElementById( 'groundFragmentShader' ).textContent
			    })
			);
			this.terrain.rotation.x = -90  * MathHelpers.DEG_TO_RAD;
			global.app.scene.add(this.terrain);
		}
	};
});