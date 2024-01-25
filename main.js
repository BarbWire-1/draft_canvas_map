import { TheMap } from './map/Map.js';
import { paths } from './map/convertedPaths.js';

/*❗️❗️ Run this function to dynamically create and downlowd a new JSON from the paths string array.
It dynamically imports the file and immediately executes the function for generating, stringifying and downloading.
Then copy the json-content into the paths array in ./map/convertedPaths.js
*/
async function createNewJSON() {
    let test = await import('./preparedPathData/extractPathData.js')
}
//createNewJSON();



const map = new TheMap('canvas', 1800, 1800);
map.addAreas(paths);

const firstMap = map.areas[0];
firstMap.fillStyle = 'blue';
firstMap.globalAlpha = 0.3;
map.areas[0].strokeStyle = 'limegreen';
map.areas[0].lineWidth = 5;

console.log('Script loaded successfully');

// JUST FOR NOW TO CHECK ANIMATION AS NOTHING REALLY MOVES
// Global functions to start and stop animation
function startAnimation() {
	console.log('startAnimation called');
	map.startAnimation();
}

function stopAnimation() {
	console.log('stopAnimation called');
	map.stopAnimation();
}

document.addEventListener('click', (e) => {
	const buttons = document.getElementsByTagName('button');

	switch (e.target) {
		case buttons[0]:
			startAnimation();
			break;
		case buttons[1]:
			stopAnimation();
			break;
		default:
			break;
	}
});

/*
Hi Stefan have a look at preparedPathData/extractPathData.js
at the bottom I wrote a short description. Hope this helps. Greets. Barb.
In general I changed some stuff, I removed eg common properties from the data-object. They still can be changed dynamically later. Some changes might only apply on redraw, which would happen in the animation (requestAnimationFrame) I added. You will need it later anyways for your game.
*/
