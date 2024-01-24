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

		const reactiveKeys = [
			'fillStyle',
			'strokeStyle',
			'lineWidth',
			'name',
			'id',
		];

		for (const key of reactiveKeys) {
			if (pathData.hasOwnProperty(key)) {
				let value = pathData[key];

				Object.defineProperty(this, key, {
					get() {
						return value;
					},

					set(newValue) {
						value = newValue;
						this.renderPath();
					},
					enumerable: true,
					configurable: true,
				});
			}
		}

		Object.freeze(this.path);

		// other props
        this._globalAlpha = 1;
		this.strokeStyle = '#000000';
		this.lineWidth = 0.8;
		this.isClicked = false; // for whatever this could be useful...
		this.renderPath();
	}
//     // need to clear the rect totally when alpha changes for one area
//     // so I call the renderPath on all areas in map
    set globalAlpha(newValue) {
        this._globalAlpha = newValue;

	}



	renderPath() {
		this.ctx.beginPath();
		this.ctx.fillStyle = this.fillStyle;
		this.ctx.strokeStyle = this.strokeStyle;
		this.ctx.lineWidth = this.lineWidth;
		this.ctx.globalAlpha= this._globalAlpha;
		this.ctx.moveTo(this.start.x, this.start.y);



		if (this.pathType === 'bezier') {
			// Handling bezier curves
			for (let i = 0; i < this.path.length; i += 3) {
				const [cp1, cp2] = this.path.slice(i, i + 2);
				this.ctx.bezierCurveTo(
					cp1.x,
					cp1.y,
					cp2.x,
					cp2.y,
					this.path[i + 2].x,
					this.path[i + 2].y
				);
			}
        } else {
            this.path.forEach((point) => this.ctx.lineTo(point.x, point.y));
        }

        this.ctx.closePath();

        this.ctx.fill();
        this.ctx.stroke();

	}
}
