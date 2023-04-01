class CompositeObject {
    constructor() {
        this.objects = [];
    }
    add(object) {
        this.objects.push(object);
    }
    draw() {
        this.objects.forEach((object) => {
            object.draw();
        })
    }
}
export { CompositeObject }