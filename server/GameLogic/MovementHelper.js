var PF = require('pathfinding');

module.exports = MovementHelper = {
	
	getPathVector : function(originVector, goalVector, map) {
		console.log("Origin");
		console.log(originVector);
		console.log("Goal");
		console.log(goalVector);
		var movementGrid = map.getMovementGrid();
		var w = map.getMovementGridWidth();
		var h = map.getMovementGridHeight();
		var grid = new PF.Grid(w, h, movementGrid);
		var finder = new PF.BiBestFirstFinder();
		var start = map.getGridCellFromPosition(originVector);
		var end = map.getGridCellFromPosition(goalVector);
		var path =  finder.findPath(start.x, start.z, end.x, end.z, grid);
		console.log(path);
		return path;
	},
	
	/*
		X Räkna ut path från start till slut.
		- Lägg till varje "ruta" i path till en lista
		- När spelarens nya position skall beräknas:
			- 1, ta nästa ruta i listan som "goal",
			- 2. Rör spelare mot positionen för nästa ruta
			- 3. När spelaren är "framme" vid rutan, ta bort den ur lista. Repetera från 1.
		- Sista item i listan är slutpositionen.
		- När spelaren är framme vid slutposition, returnera null (för att indikera till cb att spelaren inte rör sig.)
	*/
	getNewPosition : function(speed, position, path, proximityRange, map) {
		if(path == null || path.length == 0)
			return null;
		
		var oldCell = {x : path[0][0], z : path[0][1]};
		var goalVector = map.getPositionFromGridCell(oldCell.x, oldCell.z);
		console.log(goalVector);
		var goal = new Vector3(goalVector.x, goalVector.y, goalVector.z);
		var direction = goal.subtract(position).normalize();
		var dx = speed * direction.x;
		var dz = speed * direction.z;
		var diffx = goalVector.x - position.x;
		var diffz = goalVector.z - position.z;
		if( Math.abs(diffx) == proximityRange || Math.abs(diffz) <= proximityRange){
			//we are within the proximity-range - remove the first item from the path.
			console.log("Shift path");
			path.shift();
		}
		return {
			x : dx,
			z : dz
		};
	}
};