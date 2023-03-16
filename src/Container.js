import React, { useEffect, useRef, useState } from 'react';

const Container = ({ utensil }) => {
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState();
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = 800;
        canvas.height = window.innerHeight * 0.4;
        const context = canvas.getContext("2d");
        context.strokeStyle = "black";
        context.lineWidth = 2.5;
        contextRef.current = context;
        setCtx(contextRef.current);

    }, [])
    const startDrawing = () => {
        setIsDrawing(true)
    }
    const endDrawing = () => {
        setIsDrawing(false)
    }
    const drawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent
        if (ctx) {
            if (!isDrawing) {
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY)
            }
            else {
                ctx.lineTo(offsetX, offsetY)
                ctx.stroke();
            }
        }
    }
    return (
        <div>
            <canvas ref={canvasRef} onMouseDown={startDrawing} onMouseUp={endDrawing} onMouseMove={drawing} onMouseLeave={endDrawing} style={{ border: "solid" }}></canvas>
        </div>
    );
};

export default Container;