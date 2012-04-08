
Game.Views.TerrainObjects.Tree = (function() {
	
	var material = new THREE.MeshBasicMaterial({color: 0xffffff});
	
	var flower_texture = THREE.ImageUtils.loadTexture( "/resources/textures/terrain/grass.png");
	
	//Contains all meshes (as this is a collection of meshes)
	var meshes = [];
	
	var createTree = function(start, branches) {
		var geometry = new THREE.Geometry();
		var particle = new THREE.Particle(material);
		particle.position.x = start.x;
		particle.position.y = start.y;
		particle.position.z = start.z;
		geometry.vertices.push( new THREE.Vertex( particle.position ) );

		var newx = start.x + branches.x;
		var newy = start.y + branches.y;
		var newz = start.z + branches.z;

		//Create the second point
		particle = new THREE.Particle(material);
		particle.position.x = newx;
		particle.position.y = newy;
		particle.position.z = newz;
		
		//Add the particle position into the geometry object
		geometry.vertices.push( new THREE.Vertex( particle.position ) );

		
		//Create the line between points
		var trunkMaterial = new THREE.LineBasicMaterial({color: 0x663208, opacity: 1, linewidth: branches.w})
		var line = new THREE.Line( geometry, trunkMaterial);
		meshes.push(line);
		global.app.scene.add(line);

		if(branches.c) {
			for (var i = branches.c.length - 1; i >= 0; i--) {
				var branch = branches.c[i];
				createTree({x : newx, y : newy, z : newz}, branch);
			};
		}	
		else if(branches.f && branches.f != null) {
			// material
			var material = new THREE.MeshLambertMaterial({
				map: flower_texture
			});
			// cube
			var flowerMesh = new THREE.Mesh(
				new THREE.SphereGeometry(
					branches.f, 
					10, 
					10), material);
			flowerMesh.position.x = newx;
			flowerMesh.position.y = newy;
			flowerMesh.position.z = newz;
			meshes.push(flowerMesh);
			global.app.scene.add(flowerMesh);
		}
	};

	return {
		intersectMesh : null,
		intersectText : "TREE",
		init : function(start, data) {
			createTree(start, data);
			
			var material = new THREE.MeshBasicMaterial({
				transparent : true,
				opacity : 0
			});
			// cube
			this.intersectMesh = new THREE.Mesh(new THREE.CubeGeometry(50, 300, 50), material);
			global.app.scene.add(this.intersectMesh);
			this.intersectMesh.pointer = this;
			this.intersectMesh.position.x = start.x;
			this.intersectMesh.position.y = start.y;
			this.intersectMesh.position.z = start.z;
		},

		getIntersectMesh : function() {
			return this.intersectMesh;
		},

		destroy : function() {
			for (var i = meshes.length - 1; i >= 0; i--) {
				global.app.scene.remove(meshes[i]);
			};
		}
	};
});