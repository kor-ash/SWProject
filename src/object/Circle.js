import { Objects } from "./Objects"

class Circle extends Objects {
    constructor(ctx, props) {
        super(ctx, props)
    }
    draw() {
        const { sx, sy, rad, color, size, isClicked } = this.props;
        // const isClicked = this.isClicked;
        if (isClicked === true) {
            this.ctx.strokeStyle = "red";
        }
        else
            this.ctx.strokeStyle = color;
        this.ctx.lineWidth = size;
        this.ctx.beginPath();
        this.ctx.arc(sx, sy, rad, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}
export { Circle }