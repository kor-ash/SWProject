import React, { useEffect, useRef, useState } from 'react';
import { update } from 'react-spring';

const Vector = ({ x, y, dx, dy, ctx }) => {

    // Draw vector
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
    ctx.closePath();
}
const Circle = ({ sx, sy, rad, ctx }) => {
    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, 2 * Math.PI)
    ctx.stroke();
    ctx.closePath();

}
const Container = ({ curTool, handleUtensil, utensil }) => {
    const canvasRef = useRef(null);
    const dupRef = useRef(null);
    const dupContextRef = useRef(null);
    const contextRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState();
    const [dupCtx, setDupCtx] = useState();
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
    const [rad, setRad] = useState(0)
    const [selectedVector, setSelectedVector] = useState(null);
    const [vectors, setVectors] = useState([])
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerHeight;
        canvas.height = 800
        const context = canvas.getContext("2d");
        context.strokeStyle = "black";
        context.lineWidth = 15;
        contextRef.current = context;
        setCtx(contextRef.current);

        //to duplicate code

        const dupCanvas = dupRef.current;

        dupCanvas.width = window.innerHeight;
        dupCanvas.height = window.innerHeight;
        const dupContext = dupCanvas.getContext("2d");
        dupContextRef.current = dupContext;
        setDupCtx(dupContextRef.current);

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
            else if (utensil["tool"] === "vector" || utensil["tool"] === "circle") {
                setStartPoint({ x: offsetX, y: offsetY })
            }
        }
    };
    const updateVector = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const dx = offsetX - startPoint.x;
        const dy = offsetY - startPoint.y;
        Vector({ x: startPoint.x, y: startPoint.y, dx, dy, ctx });
    };
    const endDrawing = ({ nativeEvent }) => {
        //마우스에서 손 뗌, 이때 최종적으로 남아야함

        const dupCanvas = dupRef.current;
        const dupContext = dupCanvas.getContext("2d");
        const canvas = canvasRef.current;

        const { offsetX, offsetY } = nativeEvent;
        const dx = offsetX - startPoint.x;
        const dy = offsetY - startPoint.y;
        setIsDrawing(false);
        if (curTool === "vector") {
            const tmpvector = [...vectors, { sx: startPoint.x, sy: startPoint.y, ex: offsetX, ey: offsetY }]
            setVectors(tmpvector)
            updateVector({ nativeEvent })
        }
        dupContext.drawImage(canvas, 0, 0);
        ctx.drawImage(dupCanvas, 0, 0);
        ctx.closePath();
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
                    const newDx = offsetX - startPoint.x;
                    const newDy = offsetY - startPoint.y;
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(dupRef.current, 0, 0);
                    Vector({ x: startPoint.x, y: startPoint.y, dx: newDx, dy: newDy, ctx });
                }
            }
            else if (utensil["tool"] === "circle") {
                if (isDrawing) {
                    const rad = Math.sqrt((offsetX - startPoint.x) ** 2 + (offsetY - startPoint.y) ** 2);
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(dupRef.current, 0, 0);
                    Circle({ sx: offsetX, sy: offsetY, rad: rad, ctx: ctx });
                }
            }
        }
    };
    return (
        <div style={{ display: "flex" }}>
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseUp={endDrawing}
                onMouseMove={drawing}
                style={{ border: "solid", backgroundColor: "white" }}
            ></canvas>
            <canvas id="c2" ref={dupRef} style={{ border: "solid", display: "none" }}></canvas>
        </div>
    );
};

export default Container;