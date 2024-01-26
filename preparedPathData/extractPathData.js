// This shall NOT run when running the app but is only meant to prepare the pathData from string to dataObject!!!!

import { pathsStringArray } from './pathsStringArray.js';

let pathsArray = [];


// changed to convert single template-string
// so map over array now!!
const extractPathData = (code) => {

    //console.log(Array.isArray(code))// no, currently string as ITEM

        const pathData = {
            id: '',
            name: '',
            fillStyle: '',
            start: { x: 0, y: 0 }, // Initialize start point
            path: [],
        };

        // Use regular expressions to extract relevant information
        const pathIdRegex = /\/\/\s*#(\w+)/;
        const nameRegex = /"name":\s*"(.*?)"/;
        const fillStyleRegex = /ctx\.fillStyle\s*=\s*'(.*?)'/;

        // Extract pathId
        const pathIdMatch = code.match(pathIdRegex);
        pathData.id = pathIdMatch ? `#${pathIdMatch[ 1 ]}` : '';

        // Extract name
        const nameMatch = code.match(nameRegex);
        pathData.name = nameMatch ? nameMatch[ 1 ] : '';

        // Extract fillStyle
        const fillStyleMatch = code.match(fillStyleRegex);
        pathData.fillStyle = fillStyleMatch ? fillStyleMatch[ 1 ] : '';

        // Use regular expressions to extract moveTo, lineTo, and bezierCurveTo commands
        const regex = /ctx\.(moveTo|lineTo|bezierCurveTo)\((.*?)\);/g;
        let match;

        while ((match = regex.exec(code)) !== null) {
            const [ _, command, args ] = match;

            switch (command) {
                case 'moveTo':
                    // Extract x and y coordinates from the arguments
                    const [ moveToX, moveToY ] = args.split(',').map(Number);
                    pathData.start = { x: moveToX, y: moveToY };
                    break;

                case 'lineTo':
                    // Extract x and y coordinates from the arguments
                    const [ lineToX, lineToY ] = args.split(',').map(Number);
                    pathData.path.push({ x: lineToX, y: lineToY });
                    break;

                case 'bezierCurveTo':
                    // Extract bezier curve control points and end point
                    const bezierPoints = args.split(',').map(Number);
                    const controlPoints = [];

                    for (let i = 0; i < bezierPoints.length; i += 2) {
                        const [ cpX, cpY ] = bezierPoints.slice(i, i + 2);
                        controlPoints.push({ x: cpX, y: cpY });
                    }

                    pathData.path.push({ type: 'bezier', controlPoints });
                    break;

                default:
                    console.warn(
                        `The command ${command} has not been defined yet in extractPathData.js.`
                    );
                    break;
            }

        }
    pathsArray.push(pathData);
     console.log(`Pushing path ${pathsArray.length} to pathData-array.`);

};

let isDownloaded = false;
// TODO OOOOR directly write the array to pathData dynamically, but that would not be hardcoded!
    function downloadJSON(data, filename = 'convertedPaths.json') {

	const jsonString = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const link = document.createElement('a');

	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);

	link.click();

    document.body.removeChild(link);
    //isDownloaded = true;
}

// Call extractPathData for each code snippet
pathsStringArray.map((extractPathData));

//console.log(pathsArray.length)
//console.log(pathsStringArray.length)
// Check if pathsArray is not empty and download has not occurred
if (!isDownloaded) {
    isDownloaded = true;
    downloadJSON({ pathsArray });
}
