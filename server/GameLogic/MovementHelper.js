var PF = require('pathfinding');

module.exports = MovementHelper = {
	//TODO:
	/*
		- Räkna ut path från start till slut.
		- Lägg till varje "ruta" i path till en lista
		- När spelarens nya position skall beräknas:
			- 1, ta nästa ruta i listan som "goal",
			- 2. Rör spelare mot positionen för nästa ruta
			- 3. När spelaren är "framme" vid rutan, ta bort den ur lista. Repetera från 1.
		- Sista item i listan är slutpositionen.
		- När spelaren är framme vid slutposition, returnera null (för att indikera till cb att spelaren inte rör sig.)
	*/

	
	getNewPosition : function(speed, position, goalVector, proximityRange, map) {
		var goal = new Vector3(goalVector.x, goalVector.y, goalVector.z);
		var direction = goal.subtract(position).normalize();
		var dx = speed * direction.x;
		var dz = speed * direction.z;
		var diffx = goalVector.x - position.x;
		var diffz = goalVector.z - position.z;
		
		if( Math.abs(diffx) > proximityRange || Math.abs(diffz) > proximityRange){
			return {
				x : dx,
				z : dz
			}
		}
		//We are within the proximity-range of the target, no new position is required.
		return null;
	}
};