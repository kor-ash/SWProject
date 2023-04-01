const CanvasContext = (function () {
    let instance;

    function createInstance() {
        const canvas = document.createElement('canvas');
        canvas.width = window.innerHeight * 1.1;
        canvas.height = window.innerHeight;
        document.body.appendChild(canvas);
        const context = canvas.getContext('2d');
        return { canvas, context };
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },
    };
})();

export default CanvasContext