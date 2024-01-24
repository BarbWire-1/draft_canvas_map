import { TheMap } from "./map/Map.js";
import { paths } from "./map/convertedPaths.js";

import { downloadJSON } from "./preparedPathData/extractPathData.js"; // go to this file an run downloadJson when appended a new Ara to the pathsStringArray

const map = new TheMap("canvas", 1800, 1800);
map.addAreas(paths);

const firstMap = map.areas[7];
firstMap.fillStyle = "blue";
firstMap.globalAlpha = 0.1;
map.areas[0].strokeStyle = "limegreen";
map.areas[0].lineWidth = 2;
