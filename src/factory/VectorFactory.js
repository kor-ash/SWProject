import { Vector } from "../object/Vector"

const VectorFactory = function () { }
VectorFactory.prototype.createObject = (ctx, props) => {
    return new Vector(ctx, props);
}

export { VectorFactory }