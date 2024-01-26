// This shall NOT run when running the app but is only meant to prepare the pathData from string to dataObject!!!!

import { pathsStringArray } from './pathsStringArray.js';

let pathsArray = [];

const extractPathData = (code) => {
	//let pathsArray = []
    console.log(Array.isArray(code))// WHAAAAAT????

        const pathData = {
            id: '',
            name: '',

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
// but I cannot pass the array itself but need to map over it
	console.log('Creating a new pathData-array.');
	pathsArray.push(pathData);
         // each is COMPLETE!!!!

	console.log({ pathsArray }); // WHAT I WANT!!!!
    //return { pathData}


};

let isDownloaded = false;
// TODO OOOOR directly write the array to pathData dynamically, but that would not be hardcoded!
    function downloadJSON(data, filename = 'convertedPaths.json') {
        if (isDownloaded) return;
	const jsonString = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const link = document.createElement('a');

	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);

	link.click();

    document.body.removeChild(link);
    isDownloaded = true;
}

// Call extractPathData for each code snippet
let data = (extractPathData(pathsStringArray[0]));

// Check if pathsArray is not empty and download has not occurred
if (pathsArray.length > 0 && !isDownloaded) {
    downloadJSON({ pathsArray });
}


//
// // Your array of code items
// const codeArray = [
//     `//#path616
//     ctx.fillStyle = 'rgb(0, 128, 128)';
//     ctx.lineWidth = 0.800000;
//     ctx.globalAlpha = 1.0;
//     ctx.strokeStyle = 'rgb(0, 0, 0)';
//     ctx.moveTo(345.115420, 87.938063);`,
//     `ctx.fillStyle = 'blue';\nctx.fillRect(70, 10, 50, 50);`,
//     // ... more code items ...
// ];
//
// // Process each code item and create an array of pathData objects
// const pathDataArray = codeArray.map(extractPathData);
//
// console.log(pathDataArray);