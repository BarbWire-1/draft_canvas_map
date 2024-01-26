import { Area } from './Area.js';
export class TheMap {
	constructor(canvasId, width, height) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.canvas.width = width;
		this.canvas.height = height;
		this.areas = [];

		this.isAnimatedId = null;
		this.setupClickListener();
	}

	addAreas(pathsData) {
		pathsData.forEach((path) => {
			const area = new Area(this.ctx, path, this);
			this.areas.push(area);
		});
	}

	redrawMap() {
		this.areas.forEach((area) => {
			area.renderPath();
		});
	}

	//ANIMATION
	startAnimation() {
		if (!this.animationId) {
			this.animationId = requestAnimationFrame(() => this.animate());
		}
	}

	stopAnimation() {
		if (this.animationId) {
			cancelAnimationFrame(this.animationId);
			this.animationId = null;
		}
	}

	updateMap() {
		const { width, height } = this.ctx.canvas;
		this.ctx.clearRect(0, 0, width, height);
		//console.log('animating');
		this.redrawMap();
	}

	// Perform any animations or updates here - could rather be in another class controlling the entire game later
	animate() {
		this.updateMap();
		this.animationId = requestAnimationFrame(() => this.animate());
	}

	// LISTENER AND HANDLER
	setupClickListener() {
		this.canvas.addEventListener('click', (event) => {
			const mouseX =
				event.clientX - this.canvas.getBoundingClientRect().left;
			const mouseY =
				event.clientY - this.canvas.getBoundingClientRect().top;

			// Check if the click is inside any of the areas
			this.areas.forEach((area, index) => {
				if (area.isPointInsideArea(mouseX, mouseY, area)) {
					this.clickHandler(index, area);
				}
			});
		});
	}

	clickHandler(index, area) {
        area.isClicked = true;
        // do whatever with the area
		console.log(`Clicked inside area ${index + 1}: ${area.id}`);
	}
}
