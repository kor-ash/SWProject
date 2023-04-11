import React, { useEffect, useRef, useState } from 'react';
import CanvasContext from '../features/canvas/CanvasContext';
import { CompositeObject } from '../components/CompositeObject';
import { ObjectsFactory } from '../factory/ObjectsFactory';
import { findClickedCircle, findClickedVector } from '../Util';
import { useDispatch, useSelector } from 'react-redux';
import { updateSelectedVector, updateSelectedCircle } from '../features/canvas/CanvasSlice';
import 'react-contexify/ReactContexify.css';
import {
    Menu,
    Item,
    useContextMenu,
    RightSlot,
    Separator,
} from 'react-contexify';

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

    //=======
    const redrawCanvas = (clk) => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        let sortedObjects;
        // Sort the objects based on their z-index values in ascending order
        if (clk)
            sortedObjects = compositeObject.objects.sort((a, b) => a.props.zIndex - b.props.zIndex);
        else
            sortedObjects = compositeObject.objects.sort((a, b) => -(a.props.zIndex - b.props.zIndex));
        // Draw the objects in the sorted order
        sortedObjects.forEach(object => {
            object.draw()
        });
        ctx.drawImage(lineDupRef.current, 0, 0);

    }
    const { show } = useContextMenu({ id: 'demo' });
    const onClickMenu = ({ id }) => {
        if (id === "delete") {
            //삭제 로직
            const newObjects = compositeObject.objects.filter(object => !object.props.isClicked);
            compositeObject.objects = newObjects;
            setSelectedVector([]);
            setSelectedCircle([]);
            dispatch(updateSelectedVector([]));
            dispatch(updateSelectedCircle([]));
        }
        else if (id === "front") {
            const clickedVector = compositeObject.objects.find(object => object.props.isClicked);
            if (clickedVector) {
                setRender(true)
                // Update the z-index of the clicked vector to a higher value
                clickedVector.props.zIndex = compositeObject.getHighestZIndex() + 1;
                // Redraw the canvas based on the updated z-index values
                redrawCanvas(true);
            }
        }
        else if (id === "back") {
            const clickedVector = compositeObject.objects.find(object => object.props.isClicked);
            if (clickedVector) {
                setRender(false)
                // Update the z-index of the clicked vector to a higher value
                clickedVector.props.zIndex = compositeObject.getLowestZIndex() - 1;
                // Redraw the canvas based on the updated z-index values
                redrawCanvas(false);
            }
        }
        else {

            const clickedVector = compositeObject.objects.find(object => object.props.isClicked);
            if (clickedVector) {
                // Update the z-index of the clicked vector to a higher value
                clickedVector.props.color = utensil['color']
                // Redraw the canvas based on the updated z-index values
                redrawCanvas(true);
            }
        }
    }
    const [isRender, setRender] = useState(false)
    //======
    const canvasRef = useRef(null);
    const dupRef = useRef(null);
    const lineDupRef = useRef(null); //line만 땀
    const [isDrawing, setIsDrawing] = useState(false);
    const [ctx, setCtx] = useState();
    const [startPoint, setStartPoint] = useState({ x: 0, y: 0 })
    const [selectedVector, setSelectedVector] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState([]);
    const [isMove, setIsMove] = useState(true)
    const { savedVector, savedCircle } = useSelector(state => state.canvas)
    const dispatch = useDispatch()
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
        if (ctx) {
            //dup에서 지우고 다시그리자
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            compositeObject.draw();
            const dupCanvas = dupRef.current;
            const dupContext = dupCanvas.getContext("2d");
            dupContext.clearRect(0, 0, dupRef.current.width, dupRef.current.height)
            dupContext.drawImage(canvasRef.current, 0, 0);
            ctx.drawImage(lineDupRef.current, 0, 0);
        }
    }, [selectedVector, selectedCircle])
    //startDrawing
    const onMouseDown = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setStartPoint({ x: offsetX, y: offsetY });
        const isLeftClick = nativeEvent.button === 0 ? true : false;
        if (curTool === "brush") {
            if (!isLeftClick)
                return;
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
                dispatch(updateSelectedVector([]))
                dispatch(updateSelectedCircle([]))
            }
            if (!isLeftClick)
                return;
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
                    zIndex: 0
                });
                compositeObject.add(object);
            }
        }
        else if (isClickedVector) {
            setIsDrawing(false)
            setIsMove(true)
            const selVector = compositeObject.objects.filter(object => object.props.type === 'vector' && object.props.isClicked)
            setSelectedVector(selVector);
            const saveVector = selVector.map((object) => {
                return {
                    sx: object.props.sx,
                    sy: object.props.sy,
                    ex: object.props.ex,
                    ey: object.props.ey,
                    color: object.props.color,
                    size: object.props.size,
                    isClicked: object.isClicked,
                    zIndex: 0
                }
            })
            dispatch(updateSelectedVector(saveVector))
            dispatch(updateSelectedCircle([]))
            compositeObject.objects.forEach((object) => {
                if (object.props.type !== "vector")
                    object.props.isClicked = false;
            })
            setSelectedCircle([])
        } else if (isClickedCircle) {
            setIsMove(true)
            setIsDrawing(false);
            const selCircle = compositeObject.objects.filter(object => object.props.type === 'circle' && object.props.isClicked)
            const saveCircle = selCircle.map((object) => {
                return {
                    sx: object.props.sx,
                    sy: object.props.sy,
                    rad: object.props.rad,
                    color: object.props.color,
                    size: object.props.size,
                    isClicked: object.isClicked,
                    zIndex: 0
                }
            })
            compositeObject.objects.forEach((object) => {
                if (object.props.type !== "circle")
                    object.props.isClicked = false;
            })
            setSelectedVector([])
            setSelectedCircle(selCircle);

            dispatch(updateSelectedCircle(saveCircle))
            dispatch(updateSelectedVector([]))
        }
    }
    const onMouseMove = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const isLeftClick = nativeEvent.button === 0 ? true : false;
        if (isDrawing && isLeftClick) {

            //기존에는, 그냥 뒤에 넣어주니까 맨 뒤에 있는거의 ex,ey를 셋팅하면 됐음
            //그러나, 앞으로, 뒤로 배치 기능이 생기고 부터는 배열이 정렬이 되기때문에 idx로 접근을 해야함
            let idx=0;
            for(let i=0;i<compositeObject.objects.length;i++)
            {
                if(compositeObject.objects[i].props.ex===undefined)
                {
                    idx=i;
                    break;
                }
            }
            const object = compositeObject.objects[idx];
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

        const isLeftClick = nativeEvent.button === 0 ? true : false;
        if (isDrawing && isLeftClick) {
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
                zIndex: 0
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
        <div >
            <div style={{ display: "flex" }}>
                <canvas
                    onContextMenu={(e) => show({ event: e })}
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    onMouseUp={onMouseUp}
                    onMouseMove={onMouseMove}
                    style={{ border: "solid", backgroundColor: "white" }}
                ></canvas>
                <Menu id="demo">
                    <Item id="delete" onClick={onClickMenu}>삭제</Item>
                    <Separator />
                    <Item id="front" onClick={onClickMenu}>앞으로 보내기</Item>
                    <Item id="back" onClick={onClickMenu}>뒤로 보내기</Item>
                    <Item id="changeColor" onClick={onClickMenu}>색깔 바꾸기</Item>
                </Menu>
                <canvas id="c2" ref={dupRef} style={{ border: "solid", display: "none" }}></canvas>
                <canvas id="c3" ref={lineDupRef} style={{ border: "solid", display: "none" }}></canvas>
            </div>
        </div>
    );
};
export default Container;