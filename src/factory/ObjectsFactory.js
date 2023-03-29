import { CircleFactory } from "./CircleFactory";
import { VectorFactory } from "./VectorFactory";

const ObjectsFactory = {
  vector: new VectorFactory(),
  circle: new CircleFactory(),
};
/*
const ShapeFactory = function () {};

ShapeFactory.prototype.createShape = function (type, ctx, props) {
  if (type === 'vector') {
    return new Vector(ctx, props);
  } else if (type === 'circle') {
    return new Circle(ctx, props);
  } else {
    throw new Error('Invalid shape type.');
  }
};

*/
export { ObjectsFactory };