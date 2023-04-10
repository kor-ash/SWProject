class CompositeObject {
    constructor() {
        this.objects = [];
    }
    add(object) {
        this.objects.push(object);
    }
    draw() {
        this.objects = this.objects.sort((a, b) => a.props.zIndex - b.props.zIndex);
        this.objects.forEach((object) => {
            object.draw();
        })
    }
    getHighestZIndex() {
        let highestZIndex = 0;
        this.objects.forEach((object) => {
            if (object.props.zIndex > highestZIndex) {
                highestZIndex = object.props.zIndex;
            }
        });
        return highestZIndex;
    }
    getLowestZIndex() {
        let lowestZIndex = Infinity;
        this.objects.forEach((object) => {
            if (object.props.zIndex < lowestZIndex) {
                lowestZIndex = object.props.zIndex;
            }
        });
        return lowestZIndex;
    }
}
export { CompositeObject }