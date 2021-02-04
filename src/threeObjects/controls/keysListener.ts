import {wallsLimitsSetMode} from "../../unitedStates/configState";

export const onKeydown =  (event: { keyCode: any; }, payload: any, hangOff: any,deletePaint:any,escComeBack:any) => {
	 
	switch ( event.keyCode ) {

	case 38: // up
	case 87: // w
		// dof.moveForward = true;
		break;

	case 37: // left
	case 65: // a
		// dof.moveLeft = true;
		break;

	case 40: // down 
	case 83: // s
		// dof.moveBackward = true;
		break;

	case 39: // right
	case 68: // d
		// dof.moveRight = true;
		break;

	case 32: // space
	if(wallsLimitsSetMode){
		console.log("payload {x: " + Math.trunc(payload.x) 
		+ ", z: " + Math.trunc(payload.z) + "},");
	}
		break;

	case 13: // Enter
		hangOff();
	break;
	case 46: // Delete
	case 8: // Backspace
		deletePaint();
	break;
	case 27: // Esc
		escComeBack()
	break;
	}
	return event.keyCode + ' down';

};

export const onKeyup = (event: { keyCode: any; }, str: any) => {
	
	switch ( event.keyCode ) {

	case 38: // up
	case 87: // w
		// dof.moveForward = false;
		break;

	case 37: // left
	case 65: // a
		// dof.moveLeft = false;
		break;

	
	case 40: // down
	case 83: // s
		// dof.moveBackward = false;
		break;

	case 39: // right
	case 68: // d
		// dof.moveRight = false;
		break;

	}
	
	return event.keyCode + ' up';
};