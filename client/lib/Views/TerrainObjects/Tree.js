Game.Views.TerrainObjects.Tree = (function() {
	var texture =THREE.ImageUtils.loadTexture( "/resources/textures/terrain/grass.png");
	var branch = function(x, y, z, length, angle) {
		
		var material = new THREE.MeshBasicMaterial({color: 0xffffff});
		var geometry = new THREE.Geometry();

		//Define the start point
		var particle = new THREE.Particle(material);
		particle.position.x = x;
		particle.position.y = y;
		particle.position.z = z;

		global.app.scene.add(particle);


		//Add the particle position into the geometry object
		geometry.vertices.push( new THREE.Vertex( particle.position ) );

		//Create the second points where the branches end
		var newx = x + Math.cos(angle) * length;
		var newy = y + Math.sin(angle) * length;
		var newz = z - Math.sin(angle) * MathHelpers.random(-50, 50);

		//Create the second point
		particle = new THREE.Particle(material);
		particle.position.x = newx;
		particle.position.y = newy;
		particle.position.z = newz;
		
		//Add the new particle to the scene
		global.app.scene.add(particle);

		//Add the particle position into the geometry object
		geometry.vertices.push( new THREE.Vertex( particle.position ) );

		var lineWidth = length * 0.3;
		
		//Create the line between points
		var trunkMaterial = new THREE.LineBasicMaterial({color: 0x663208, opacity: 1, linewidth: lineWidth})
		var line = new THREE.Line( geometry, trunkMaterial);
		global.app.scene.add(line);

		//Create multiple branches, if still long branches add a new set
		if(length > 20){
			//First: branch calls itself, positioned at the end of older brance, random angle between these values
			branch(newx, newy, newz, length * (MathHelpers.random(0.3, 0.80)), angle - (MathHelpers.random(17, 12) * MathHelpers.DEG_TO_RAD));
			
			
			if((Math.random() * 10) > 5){
				//Second: branch calls itself, positioned at the end of older brance, random angle between these values
				branch(newx, newy, newz, length * (MathHelpers.random(0.3, 0.80)), angle + (MathHelpers.random(17, 12) * MathHelpers.DEG_TO_RAD));
			}
			if((Math.random() * 10) > 5){
				//Second: branch calls itself, positioned at the end of older brance, random angle between these values
				branch(newx, newy, newz, length * (MathHelpers.random(0.3, 0.80)), angle + (MathHelpers.random(17, 12) * MathHelpers.DEG_TO_RAD));
			}
			if((Math.random() * 10) > 5){
				//Second: branch calls itself, positioned at the end of older brance, random angle between these values
				branch(newx, newy, newz, length * (MathHelpers.random(0.3, 0.80)), angle + (MathHelpers.random(17, 12) * MathHelpers.DEG_TO_RAD));
			}
			
		} else {
			// material
			var material = new THREE.MeshLambertMaterial({
				map: texture
			});
			// cube
			var flowerMesh = new THREE.Mesh(
				new THREE.SphereGeometry(
					MathHelpers.random(10, 40), 
					MathHelpers.random(10, 40), 
					MathHelpers.random(10, 40)), material);
			flowerMesh.position.y = newy;
			flowerMesh.position.x = newx;
			flowerMesh.position.z = newz;
			global.app.scene.add(flowerMesh);
		}
	};

	return {
		init : function(model) {
			var x = model.x,
				y = model.y,
				z = model.z,
				height = model.height,
				angle = MathHelpers.DEG_TO_RAD * 90;
			branch(x, y, z, height, angle);
		}
	}	
});