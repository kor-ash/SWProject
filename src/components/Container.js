import { is } from '@react-spring/shared';
import React, { useEffect, useRef, useState } from 'react';
import CanvasContext from '../features/canvas/CanvasContext';
import { CompositeObject } from '../components/CompositeObject';
import { ObjectsFactory } from '../factory/ObjectsFactory';
import { findClickedCircle, findClickedVector } from '../Util';
const init = (canvasAarray) => {
    canvasAarray.forEach((canvas) => {
        canvas.width = window.innerHeight * 1.1;
        canvas.height = window.innerHeight;
    })
}
const compositeObject = new CompositeObject();
const canvasContext = CanvasContext.getInstance().context;
const canvas = CanvasContext.getInstance().canvas;
const Container = ({ curTool, handleUtensil, utensil }) => {
    const canvasRef = useRef(null);
    const dupRef = useRef(null);
    const lineDupRef = useRef(null); //line만 땀
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState();
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
    const [selectedVector, setSelectedVector] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState([]);
    const [isMove, setIsMove] = useState(true)
    useEffect(() => {
        const t = [canvasRef.current, dupRef.current, lineDupRef.current]
        init(t)
        const context = canvasRef.current.getContext("2d");
        context.strokeStyle = "black";
        context.lineWidth = 15;
        setCtx(context);
    }, []);

    useEffect(() => {
        if (ctx) {
            ctx.strokeStyle = utensil["color"];
            ctx.lineWidth = utensil["weight"];
        }
        const lineDup = lineDupRef.current;
        const lineDupContext = lineDup.getContext("2d")
        lineDupContext.strokeStyle = utensil["color"]
        lineDupContext.lineWidth = utensil["weight"]

    }, [utensil]);

    useEffect(() => {
        compositeObject.draw();
    }, [selectedVector, selectedCircle])
    //startDrawing
    const onMouseDown = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setStartPoint({ x: offsetX, y: offsetY });
        if (curTool === "brush") {
            setIsDrawing(true);
            ctx.beginPath();
            ctx.moveTo(offsetX, offsetY);
            const lineDupCanvas = lineDupRef.current;
            const lineDupContext = lineDupCanvas.getContext("2d");
            lineDupContext.beginPath()
            lineDupContext.moveTo(offsetX, offsetY)
            return;
        }
        const isClickedVector = findClickedVector(compositeObject.objects.filter(object => {
            return (object !== undefined && object.props.type === 'vector')
        }), offsetX, offsetY);
        const isClickedCircle = findClickedCircle(compositeObject.objects.filter(object => { return (object !== undefined && object.props.type === 'circle') }), offsetX, offsetY);
        if (!isClickedVector && !isClickedCircle) {
            if (selectedVector || selectedCircle) { //선택한 건 없지만, 선택한 벡터들이 있을때 풀어줘야함
                compositeObject.objects.forEach((object) => {
                    object.props.isClicked = false;
                })
                setSelectedVector([])
                setSelectedCircle([])
            }
            setIsMove(false)
            setIsDrawing(true);

            const objectType = (curTool === "vector") ? "vector" : (curTool === "circle" ? "circle" : "brush")
            if (objectType === "vector" || objectType === "circle") {
                const factory = ObjectsFactory[objectType]
                const object = factory.createObject(ctx, {
                    type: objectType,
                    sx: offsetX,
                    sy: offsetY,
                    rad: curTool === "circle" ? 0 : null,
                    color: utensil.color,
                    size: utensil.weight,
                    isClicked: false,
                });
                compositeObject.add(object);
            }
        }
        else if (isClickedVector) {
            setIsDrawing(false)
            setIsMove(true)
            console.log(compositeObject.objects)
            console.log("선택", compositeObject.objects.filter(object => object.props.type === 'vector' && object.props.isClicked))
            setSelectedVector(compositeObject.objects.filter(object => object.props.type === 'vector' && object.props.isClicked));
            compositeObject.objects.forEach((object) => {
                if (object.props.type !== "vector")
                    object.props.isClicked = false;
            })
            setSelectedCircle([])
        } else if (isClickedCircle) {
            setIsMove(true)
            setIsDrawing(false);
            compositeObject.objects.forEach((object) => {
                if (object.props.type !== "circle")
                    object.props.isClicked = false;
            })
            setSelectedVector([])
            setSelectedCircle(compositeObject.objects.filter(object => object.props.type === 'circle' && object.props.isClicked));
        }
    }
    const onMouseMove = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        if (isDrawing) {
            const object = compositeObject.objects[compositeObject.objects.length - 1];
            if (curTool === "vector") {
                object.props.ex = offsetX
                object.props.ey = offsetY;
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(dupRef.current, 0, 0);
                ctx.drawImage(lineDupRef.current, 0, 0);
            } else if (curTool === "circle") {
                object.props.rad = Math.abs(offsetX - startPoint.x);
                ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                ctx.drawImage(dupRef.current, 0, 0);
                ctx.drawImage(lineDupRef.current, 0, 0);
            }
            else if (curTool === "brush") {
                ctx.lineTo(offsetX, offsetY);
                ctx.stroke();
                const lineDupCanvas = lineDupRef.current;
                const lineDupContext = lineDupCanvas.getContext("2d");
                lineDupContext.lineTo(offsetX, offsetY)
                lineDupContext.stroke()
                return;
            }
            compositeObject.draw();
            object.draw();
        }
        else if (isMove) {

            const dx = (offsetX - startPoint.x) / 10;
            const dy = (offsetY - startPoint.y) / 10;
            if (selectedVector.length) {
                selectedVector.forEach((object) => {
                    object.props.sx += dx;
                    object.props.sy += dy;
                    object.props.ex += dx;
                    object.props.ey += dy;
                })
            }
            else if (selectedCircle.length) {
                selectedCircle.forEach((object) => {
                    object.props.sx += dx;
                    object.props.sy += dy;
                })
            }

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            ctx.drawImage(lineDupRef.current, 0, 0);
            compositeObject.draw();
        }
    }
    const onMouseUp = ({ nativeEvent }) => {
        if (isDrawing) {
            setIsDrawing(false)
            const { offsetX, offsetY } = nativeEvent;
            const objectType = (curTool === "vector") ? "vector" : (curTool === "circle" ? "circle" : "brush")
            if (objectType === "brush") {
                return;
            }
            const factory = ObjectsFactory[objectType]
            const object = factory.createObject(ctx, {
                type: objectType,
                sx: startPoint.x,
                sy: startPoint.y,
                ex: curTool === "vector" ? offsetX : null,
                ey: curTool === "vector" ? offsetY : null,
                rad: curTool === "circle" ? 0 : null,
                color: utensil.color,
                size: utensil.weight,
                isClicked: false,
            });
            const dupCanvas = dupRef.current;
            const dupContext = dupCanvas.getContext("2d");
            dupContext.clearRect(0, 0, dupRef.current.width, dupRef.current.height)
            dupContext.drawImage(canvasRef.current, 0, 0);
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            object.draw()
            ctx.drawImage(dupRef.current, 0, 0);
            ctx.drawImage(lineDupRef.current, 0, 0);

        } else if (isMove) {
            const dupCanvas = dupRef.current;
            const dupContext = dupCanvas.getContext("2d");
            dupContext.clearRect(0, 0, dupRef.current.width, dupRef.current.height)
            dupContext.drawImage(canvasRef.current, 0, 0);

            ctx.drawImage(lineDupRef.current, 0, 0);
            setIsMove(false)
            setSelectedVector([])
            setSelectedCircle([])

        }
    }


    return (
        <div style={{ display: "flex" }}>
            <canvas
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                style={{ border: "solid", backgroundColor: "white" }}
            ></canvas>
            <canvas id="c2" ref={dupRef} style={{ border: "solid", display: "none" }}></canvas>
            <canvas id="c3" ref={lineDupRef} style={{ border: "solid", display: "none" }}></canvas>
        </div>
    );
};
export default Container;