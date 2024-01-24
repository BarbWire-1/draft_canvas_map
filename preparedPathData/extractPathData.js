import { pathsArray } from './pathsStringArray.js';


// // REGEX example with string.match(regex)
// const fileMatch = /^eeg_\d{4,4}_\d{2,2}\.edf$/i; // 'i' flag for case-insensitivity
// const fileNames = ["eeg_7108_07.EDF", "eeg_3401_03.EDF", "EEG_3456_00.EDX"];
//
// fileNames.forEach((file) => console.log(file.match(fileMatch)));
//
// // returns null for no match
// // and array with [theMatchingExpression, index: position in string where match starts, input: the checkedData, groups: undefined- no name Capturing.]
//
// fileNames.forEach((file) => {
//   const matchResult = file.match(fileMatch);
//   if (matchResult) {
//     console.log(matchResult[0]); // match is IF at index 0
//   } else {
//     console.log("No match");
//   }
// });


const extractPathData = (code) => {
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
                const bezierPoints = +args.split(',');
                const controlPoints = [];

                for (let i = 0; i < bezierPoints.length; i += 2) {
                    const [ cpX, cpY ] = bezierPoints.slice(i, i + 2);
                    controlPoints.push({ x: cpX, y: cpY });
                }

                pathData.path.push({ type: 'bezier', controlPoints });
                break;



            default:
                console.warn(`The command ${command} has not been defined yet in extractPathData.js.`)
                break;
        }
    }


    return pathData;

}
export function downloadJSON(data, filename = 'convertedPath.json') {
	const jsonString = JSON.stringify(data, null, 2);
	const blob = new Blob([jsonString], { type: 'application/json' });
	const link = document.createElement('a');

	link.href = URL.createObjectURL(blob);
	link.download = filename;
	document.body.appendChild(link);

	link.click();

	document.body.removeChild(link);
}

export const pathData = pathsArray.map(extractPathData);
//downloadJSON(pathData)
