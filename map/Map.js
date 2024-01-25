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

        //console.log(this.areas)
		//this.startAnimation();
		//this.redrawAreas();
	}

	addAreas(pathsData) {
		pathsData.forEach((path) => {
			const area = new Area(this.ctx, path, this);
			this.areas.push(area);
		});
	}

    redrawAreas() {

        let count = 0;
        this.areas.forEach((area) => {
            count++;
            area.renderPath();
        });
        //console.log(count)
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
		this.redrawAreas();
    }
    
    // Perform any animations or updates here - could rather be in another class controlling the entire game later
	animate() {

        this.updateMap()
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
				if (this.isPointInsideArea(mouseX, mouseY, area)) {
					this.clickHandler(index, area);

				}
			});
		});
	}

    isPointInsideArea(x, y, area) {
    // Use the stored pathCommands
    return this.ctx.isPointInPath(area.pathCommands, x, y);
}


	clickHandler(index, area) {
		area.isClicked = true;
		console.log(`Clicked inside area ${index + 1}: ${area.id}`);
	}
}
