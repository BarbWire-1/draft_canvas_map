// This shall NOT run when running the app but is only meant to prepare the pathData from string to dataObject!!!!

import { pathsStringArray } from './pathsStringArray.js';

// changed to convert single template-string
// so map over array now!!
// for creating single paths the downloadJSON needs to be called with string as arg
function extractPathData(stringArray) {
let pathsArray = [];
    //console.log(Array.isArray(code))// no, currently string as ITEM
    for (const pathCommands of stringArray) {
        const pathData = {
            id: '',
            name: '',
            fillStyle: '',
            start: { x: 0, y: 0 }, // separate moveTo point
            path: [],
        };

        // Use regular expressions to extract relevant data
        const pathIdRegex = /\/\/\s*#(\w+)/;
        const nameRegex = /"name":\s*"(.*?)"/;
        const fillStyleRegex = /ctx\.fillStyle\s*=\s*'(.*?)'/;

        // Extract pathId
        const pathIdMatch = pathCommands.match(pathIdRegex);
        pathData.id = pathIdMatch ? `#${pathIdMatch[ 1 ]}` : '';

        // Extract name
        const nameMatch = pathCommands.match(nameRegex);
        pathData.name = nameMatch ? nameMatch[ 1 ] : '';

        // Extract fillStyle
        const fillStyleMatch = pathCommands.match(fillStyleRegex);
        pathData.fillStyle = fillStyleMatch ? fillStyleMatch[ 1 ] : '';

        // Use regular expressions to extract moveTo, lineTo, and bezierCurveTo points
        const regex = /ctx\.(moveTo|lineTo|bezierCurveTo)\((.*?)\);/g;
        let match;

        while ((match = regex.exec(pathCommands)) !== null) {
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
    }
    return {pathsArray}

};



//let isDownloaded = false;

function downloadJSON(data, filename = 'convertedPaths.json') {
    // if (isDownloaded) {
    //     console.log("already downloaded this file");
    //     return; // Do not download again
    // }

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const link = document.createElement('a');

    link.href = URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);

    //isDownloaded = true; // Set to true after the download
}

const dataWithComment = {
    "_COMMENT": "For now copy the array into map/convertedPaths.js to use the hardcoded values. Only generate when changing or adding paths",
    "pathsData": extractPathData(pathsStringArray)
};

export function createNewJSON() {
    downloadJSON(dataWithComment);
}
