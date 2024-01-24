import { TheMap } from "./map/Map.js";
import { paths } from "./map/convertedPaths.js";

import { downloadJSON } from "./preparedPathData/extractPathData.js"; // go to this file an run downloadJson when appended a new Ara to the pathsStringArray

const map = new TheMap("canvas", 1800, 1800);
map.addAreas(paths);

const firstMap = map.areas[0];
firstMap.fillStyle = "blue";
firstMap.globalAlpha = 0.3;
map.areas[0].strokeStyle = "limegreen";
map.areas[0].lineWidth = 5;

console.log("Script loaded successfully");

// JUST FOR NOE TO CHECK ANIMATION AS NOTHING REALLY MOVES
// Global functions to start and stop animation
function startAnimation() {
  console.log("startAnimation called");
  map.startAnimation();
}

function stopAnimation() {
  console.log("stopAnimation called");
  map.stopAnimation();
}

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  const stopButton = document.getElementById("stopButton");

  startButton.addEventListener("click", startAnimation);
  stopButton.addEventListener("click", stopAnimation);
});

//map.stopAnimation();

/*
Hi Stefan have a look at preparedPathData/extractPathData.js
at the bottom I wrote a short description. Hope this helps. Greets. Barb.
In general I changed some stuff, I removed eg common properties from the data-object. They still can be changed dynamically later. Some changes might only apply on redraw, which would happen in the animation (requestAnimationFrame) I added. You will need it later anyways for your game.
*/
