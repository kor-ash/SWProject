import { Objects } from "./Objects";

class Vector extends Objects {
    constructor(ctx, props) {
        super(ctx, props);
    }

    draw() {
        const { sx, sy, ex, ey, color, size, isClicked } = this.props;
        //const isClicked = this.isClicked
        if (isClicked === true) {
            this.ctx.strokeStyle = "red";
        }
        else {
            this.ctx.strokeStyle = color;
        }
        this.ctx.lineWidth = size;
        this.ctx.beginPath();
        this.ctx.moveTo(sx, sy);
        this.ctx.lineTo(ex, ey);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}

export { Vector };