export class Area {
	constructor(ctx, pathData, mapInstance) {
		this.ctx = ctx;
		//console.log(this.ctx.canvas)
		this.mapInstance = mapInstance;

		// Loop over keys in pathData and assign them to this
		for (const key in pathData) {
			if (pathData.hasOwnProperty(key)) {
				this[key] = pathData[key];
			}
        }
        // Initialize the path property by calling generatePath()
        this.pathCommands= this.generatePath();

		// other props
		this.globalAlpha = 1;
		this.strokeStyle = '#000000';
		//console.log(this.strokeStyle)
		this.lineWidth = 0.8;
		this.isClicked = false; // for whatever this could be useful...

		const reactiveKeys = [
			'fillStyle',
			'strokeStyle',
			'lineWidth',
			'globalAlpha',
			'name',
			'id',
		];

		for (const key of reactiveKeys) {
			let value = this[key] || undefined;

			Object.defineProperty(this, key, {
				get() {
					//console.log(`Received ${value} for ${key}`)
					return value;
				},

				set(newValue) {

                    if (this[ key ] === newValue) return;
                    value = newValue;
                    //console.log(`Set ${value} for ${key}`);
                    this.renderPath();
				},
				enumerable: true,
				configurable: true,
			});
		}

		Object.freeze(this.path);

		this.renderPath();
	}
	//     // need to clear the rect totally when alpha changes for one area
	//     // so I call the renderPath on all areas in map

	generatePath() {
        const path = new Path2D();
this.ctx.beginPath();
        path.moveTo(this.start.x, this.start.y);

        if (this.pathType === 'bezier') {
            for (let i = 0; i < this.path.length; i += 3) {
                const [cp1, cp2] = this.path.slice(i, i + 2);
                path.bezierCurveTo(
                    cp1.x,
                    cp1.y,
                    cp2.x,
                    cp2.y,
                    this.path[i + 2].x,
                    this.path[i + 2].y
                );
            }
        } else {
            this.path.forEach((point) => path.lineTo(point.x, point.y));
        }
        //console.log("Generated path "+ this.id)
        path.closePath();
        // Store the generated path in pathCommands property
    this.pathCommands = path;

    return this.pathCommands;  // Return the pathCommands
    }

    renderPath() {
        this.ctx.beginPath();
        this.ctx.globalAlpha = this.globalAlpha;
        this.ctx.fillStyle = this.fillStyle;
        this.ctx.strokeStyle = this.strokeStyle;
        this.ctx.lineWidth = this.lineWidth;

        //console.log("I just rendered for init: " + this.id + "\n" + this.globalAlpha)
        // use the stored pathCommands
        this.ctx.fill(this.pathCommands);
        this.ctx.stroke(this.pathCommands);
    }
}
