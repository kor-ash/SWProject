import React, { useEffect, useRef, useState } from 'react';

const Vector = ({ x, y, dx, dy, ctx }) => {

    // Draw vector
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
}
const Container = ({ curTool, handleUtensil, utensil }) => {
    console.log(curTool, utensil['tool'])
    const canvasRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState();

    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerHeight * 0.65;
        canvas.height = window.innerHeight * 0.4;
        const context = canvas.getContext("2d");
        context.strokeStyle = "black";
        context.lineWidth = 15;
        contextRef.current = context;
        setCtx(contextRef.current);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.strokeStyle = utensil["color"];
        context.lineWidth = utensil["weight"];
        contextRef.current = context;
        setCtx(contextRef.current);
    }, [utensil]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        if (ctx) {
            setIsDrawing(true);
            if (utensil["tool"] === "brush" || utensil["tool"] === "eraser") {
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
            }
        }
    };

    const endDrawing = () => {
        setIsDrawing(false);
    };

    const drawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        if (ctx) {
            if (utensil["tool"] === "brush" || utensil["tool"] === "eraser") {
                if (isDrawing) {
                    ctx.lineTo(offsetX, offsetY);
                    ctx.stroke();
                }
            } else if (utensil["tool"] === "vector") {
                if (isDrawing) {
                    const { offsetX: startX, offsetY: startY } = nativeEvent;
                    const dx = offsetX - startX;
                    const dy = offsetY - startY;
                    //ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    Vector({ x: startX, y: startY, dx, dy, ctx });
                }
            }
        }
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={drawing}
                onMouseLeave={endDrawing}
                style={{ border: "solid" }}
            ></canvas>
        </div>
    );
};

export default Container;