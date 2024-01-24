import { Area } from "./Area.js";
export class TheMap {
  constructor(canvasId, width, height) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = width;
    this.canvas.height = height;
      this.areas = [];

      this.isAnimatedId = null;
      this.setupClickListener();
      //this.startAnimation();
      this.redrawAreas()
  }

  addAreas(pathsData) {
    pathsData.forEach((path) => {
      const area = new Area(this.ctx, path, this);
      this.areas.push(area);
    });
  }

    redrawAreas() {

        this.areas.forEach(area => {

        area.renderPath();
        // console.log(area.fillStyle);
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

    animate() {
        const {width, height} = this.ctx.canvas
        this.ctx.clearRect(0, 0,width, height);
        // Perform any animations or updates here

console.log('animating')
        this.redrawAreas();
        this.animationId = requestAnimationFrame(() => this.animate());
    }



  setupClickListener() {
    this.canvas.addEventListener("click", (event) => {
      const mouseX = event.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = event.clientY - this.canvas.getBoundingClientRect().top;


      //this.mapInstance.areas.forEach((area) => area.renderPath());
      // the logic
      // Check if the click is inside any of the areas
      this.areas.forEach((area, index) => {
        if (this.isPointInsideArea(mouseX, mouseY, area)) {
            this.clickHandler(index, area);
            console.log(index)

        }
      });
    });
  }

  isPointInsideArea(x, y, area) {
      this.ctx.beginPath();

    area.renderPath(); // Define the path in the context
    return this.ctx.isPointInPath(x, y);
  }

  clickHandler(index, area) {
    area.isClicked = true;
    console.log(`Clicked inside area ${index + 1}: ${area.id}`);
  }
}
