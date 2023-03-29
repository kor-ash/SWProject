import { Circle } from "../object/Circle";
const CircleFactory = function () { };
CircleFactory.prototype.createObject = (ctx, props) => {
    return new Circle(ctx, props);
}

export { CircleFactory };