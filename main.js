import { TheMap } from "./map/Map.js";
import { paths } from "./map/convertedPaths.js";


/* Run these both commands to create a new JSON form pathsStringsArray. do NOT download into the projectFolder to NOT trigger a reload. Then comment out again.
*/

//import { createNewJSON } from './preparedPathData/extractPathData.js';
//createNewJSON();



const map = new TheMap("canvas", 1800, 1800);
map.addAreas(paths);

const firstMap = map.areas[0];
firstMap.fillStyle = "violet";
firstMap.globalAlpha = 0.1;
map.areas[ 0 ].strokeStyle = "limegreen";

map.areas[0].lineWidth = 5;

console.log("Script loaded successfully");

// JUST FOR NOW TO CHECK ANIMATION AS NOTHING REALLY MOVES
// Global functions to start and stop animation
function startAnimation() {
  console.log("startAnimation called");
  map.startAnimation();
}

function stopAnimation() {
  console.log("stopAnimation called");
  map.stopAnimation();
}

document.addEventListener("click", (e) => {


  switch (e.target.id) {
    case "startButton":
      startAnimation();
      break;
    case "stopButton":
      stopAnimation();
      break;
    default:
      break;
  }
});
