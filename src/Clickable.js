/*
const Clickable = function (object) {
    this.object = object;
};

Clickable.prototype.draw = function () {
    this.object.draw();
    if (this.object.props.isClicked) {
        this.object.ctx.strokeStyle = 'red';
        this.object.ctx.stroke();
    }
};
*/


class Clickable {
    constructor(object) {
        this.object = object;
    }
    draw() {
        if (this.object.props.isClicked) {
            this.object.ctx.strokeStyle = 'red';
        }
        this.object.draw();
    }
}

export { Clickable };