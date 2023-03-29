import { is } from '@react-spring/shared';
import React, { useEffect, useRef, useState } from 'react';
import CanvasContext from './CanvasContext';
import { CompositeObject } from './CompositeObject';
import { ObjectsFactory } from './factory/ObjectsFactory';
const Vector = ({ x, y, dx, dy, ctx, isClicked, size, color }) => {
    if (isClicked)
        ctx.strokeStyle = "red";
    else
        ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
    ctx.closePath();
}
const Circle = ({ sx, sy, rad, ctx, color, size, isClicked }) => {
    if (isClicked)
        ctx.strokeStyle = "red";
    else
        ctx.strokeStyle = color;

    ctx.lineWidth = size;
    ctx.beginPath();
    ctx.arc(sx, sy, rad, 0, 2 * Math.PI)
    ctx.stroke();
    ctx.closePath();

}
const dis = ({ sx, sy, ex, ey, tx, ty }) => {
    let m = 0;
    let b = 0;
    if (ex !== sx)
        m = (ey - sy) / (ex - sx)
    else
        m = 0;
    b = sy - m * sx;
    let dis = Math.abs(((m * tx) - ty + b)) / (Math.sqrt(m ** 2 + 1))
    return dis;
}
const init = (canvasAarray) => {
    canvasAarray.forEach((canvas) => {
        canvas.width = window.innerHeight * 1.1;
        canvas.height = window.innerHeight;
    })
}
const findClickedVector = (vectors, clickedX, clickedY) => {
    let res = false
    vectors.forEach((vector) => {
        const { sx, sy, ex, ey } = vector.props;
        const dist = dis({ sx: sx, sy: sy, ex: ex, ey: ey, tx: clickedX, ty: clickedY })
        if (dist < 10) {
            res = true
            vector.isClicked = true
        }
    });
    return res
}
const findClickedCircle = (circles, clickedX, clickedY) => {
    let res = false
    circles.forEach((circle) => {
        const { sx, sy, rad } = circle.props;
        const dist = Math.sqrt((clickedX - sx) ** 2 + (clickedY - sy) ** 2)
        if (Math.abs(dist - rad) < 10) {
            res = true
            circle.isClicked = true;
        }
    })
    return res
}
const objectFactory = ObjectsFactory;
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
    const [rad, setRad] = useState(0)
    const [selectedVector, setSelectedVector] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState([]);
    const [selectedObject, setSelecObject] = useState([])
    const [vectors, setVectors] = useState([])
    const [circles, setCircles] = useState([])
    const [cx, setCx] = useState(0)
    const [cy, setCy] = useState(0)
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
        compositeObject.draw()
    }, [selectedVector, selectedCircle])

    const updateVector = () => {
        vectors.map((vector) => {
            return Vector({
                x: vector.sx, y: vector.sy, dx: vector.ex - vector.sx, dy: vector.ey - vector.sy, ctx: ctx, isClicked: vector.isClicked,
                color: vector.color, size: vector.size
            })
        });
    };
    const updateCircle = () => {
        circles.map((circle) => {
            return Circle({
                sx: circle.sx, sy: circle.sy, rad: circle.rad, ctx: ctx, isClicked: circle.isClicked, color: circle.color,
                size: circle.size
            }
            )
        }
        )
    }
    //startDrawing
    const onMouseDown = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        const isClickedVector = findClickedVector(compositeObject.objects.filter(object => {
            return (object !== undefined && object.props.type === 'vector')
        }), offsetX, offsetY);
        const isClickedCircle = findClickedCircle(compositeObject.objects.filter(object => { return (object !== undefined && object.props.type === 'circle') }), offsetX, offsetY);
        if (!isClickedVector && !isClickedCircle) {
            if (selectedVector || selectedCircle) { //선택한 건 없지만, 선택한 벡터들이 있을때 풀어줘야함
                compositeObject.objects.forEach((object) => {
                    object.isClicked = false;
                })
                setSelectedVector([])
                setSelectedCircle([])
            }
            setIsDrawing(true);
            setStartPoint({ x: offsetX, y: offsetY });
            if (curTool === "brush") {
                ctx.beginPath();
                ctx.moveTo(offsetX, offsetY);
                const lineDupCanvas = lineDupRef.current;
                const lineDupContext = lineDupCanvas.getContext("2d");
                lineDupContext.beginPath()
                lineDupContext.moveTo(offsetX, offsetY)
                return;
            }
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
            setIsMove(true)
            setSelectedVector(compositeObject.objects.filter(object => object.props.type === 'vector' && object.props.isClicked));
        } else if (isClickedCircle) {
            setIsMove(true)
            setSelectedVector(compositeObject.objects.filter(object => object.props.type === 'circle' && object.props.isClicked));
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
                setRad(Math.abs(offsetX - startPoint.x));
                object.props.rad = Math.abs(offsetX - startPoint.x);
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
            if (selectedVector.length) {
                const object = selectedVector[0];
                const dx = offsetX - object.props.sx;
                const dy = offsetY - object.props.sy;
                object.props.sx += dx;
                object.props.sy += dy;
                object.props.ex += dx;
                object.props.ey += dy;
                ctx.clearRect(0, 0, ctx.current.width, ctx.current.height);
                compositeObject.draw();
            }
        }
    }
    const onMouseUp = ({ nativeEvent }) => {
        if (isDrawing) {
            setIsDrawing(false)

            const { offsetX, offsetY } = nativeEvent;
            /*
            const object = compositeObject.objects[compositeObject.objects.length - 1];
            if (curTool === "circle") {
                object.props.rad = rad;
                setRad(0);
            }
            */
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
            setIsMove(false)
            setSelectedVector([])
            setSelectedCircle([])
        }
    }
    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        setIsDrawing(true);
        if (utensil["tool"] === "brush" || utensil["tool"] === "eraser") {
            const lineDupCanvas = lineDupRef.current;
            const lineDupContext = lineDupCanvas.getContext("2d");
            lineDupContext.beginPath()
            lineDupContext.moveTo(offsetX, offsetY)
            canvasContext.beginPath();
            canvasContext.moveTo(offsetX, offsetY);
        }
        else if (utensil["tool"] === "vector" || utensil["tool"] === "circle") {
            setStartPoint({ x: offsetX, y: offsetY })
        }
        else if (utensil["tool"] === "grab") {
            setStartPoint({ x: offsetX, y: offsetY })
            const res1 = findClickedVector(vectors, offsetX, offsetY)
            const res2 = findClickedCircle(circles, offsetX, offsetY)
            if (!res1 && !res2) {
                //빈 땅  클릭 -> grab 풀어야함
                let tmpVector = [...vectors]
                tmpVector.forEach((t) => {
                    t.isClicked = false;
                })
                let tmpCircle = [...circles]
                tmpCircle.forEach((t) => {
                    t.isClicked = false;
                })
                setCircles(tmpCircle)
                setVectors(tmpVector)
                setSelectedCircle([])
                setSelectedVector([])
            }
            const tmpSelectedVector = vectors.filter((vector) => {
                return vector.isClicked;
            })
            const tmpSelectedCircle = circles.filter((circle) => {
                return circle.isClicked;
            })
            setSelectedVector(tmpSelectedVector)
            setSelectedCircle(tmpSelectedCircle)
        }
    };
    const drawing = ({ nativeEvent }) => {
        if (!isDrawing)
            return;
        const { offsetX, offsetY } = nativeEvent;
        if (utensil["tool"] === "brush" || utensil["tool"] === "eraser") {
            ctx.lineTo(offsetX, offsetY);
            ctx.stroke();
            const lineDupCanvas = lineDupRef.current;
            const lineDupContext = lineDupCanvas.getContext("2d");
            lineDupContext.lineTo(offsetX, offsetY)
            lineDupContext.stroke()
        } else if (utensil["tool"] === "vector") {
            const newDx = offsetX - startPoint.x;
            const newDy = offsetY - startPoint.y;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(dupRef.current, 0, 0);
            Vector({
                x: startPoint.x, y: startPoint.y, dx: newDx, dy: newDy, ctx: ctx, color: utensil["color"],
                size: utensil["weight"]
            });

            ctx.drawImage(lineDupRef.current, 0, 0);
        }
        else if (utensil["tool"] === "circle") {
            const rad = Math.sqrt((offsetX - startPoint.x) ** 2 + (offsetY - startPoint.y) ** 2);
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(dupRef.current, 0, 0);

            ctx.drawImage(lineDupRef.current, 0, 0);
            Circle({ sx: offsetX, sy: offsetY, rad: rad, ctx: ctx, color: utensil["color"], size: utensil["weight"] });
            setRad(rad)
            setCx(offsetX)
            setCy(offsetY)

            ctx.drawImage(lineDupRef.current, 0, 0);
        }
        else if (utensil["tool"] === "grab") {
            const newDx = (offsetX - startPoint.x) / 5;
            const newDy = (offsetY - startPoint.y) / 5;
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(dupRef.current, 0, 0);
            //processing vector

            const tmpVector = [...selectedVector];
            const ans = []
            for (let i = 0; i < vectors.length; i++) {
                let clk = false
                for (let j = 0; j < selectedVector.length; j++) {
                    if (vectors[i].sx === selectedVector[j].sx && vectors[i].sy === selectedVector[j].sy && vectors[i].ex === selectedVector[j].ex && vectors[i].ey === selectedVector[j].ey) {
                        clk = true;
                        break;
                    }
                }
                if (!clk)
                    ans.push(vectors[i])
            }
            for (let i = 0; i < tmpVector.length; i++) {
                tmpVector[i].sx += newDx;
                tmpVector[i].sy += newDy;
                tmpVector[i].ex += newDx;
                tmpVector[i].ey += newDy;
            }
            for (let i = 0; i < tmpVector.length; i++)
                ans.push(tmpVector[i])
            setVectors(ans)
            setSelectedVector(tmpVector)
            //processing circle
            const tmpCircle = [...selectedCircle];
            const circleans = []
            for (let i = 0; i < circles.length; i++) {
                let clk = false
                for (let j = 0; j < selectedCircle.length; j++) {
                    if (circles[i].sx === selectedCircle[j].sx && circles[i].sy === selectedCircle[j].sy && circles[i].rad === selectedCircle[j].rad) {
                        clk = true;
                        break;
                    }
                }
                if (!clk)
                    circleans.push(circles[i])
            }
            for (let i = 0; i < tmpCircle.length; i++) {
                tmpCircle[i].sx += newDx;
                tmpCircle[i].sy += newDy;
            }
            for (let i = 0; i < tmpCircle.length; i++)
                circleans.push(tmpCircle[i])
            setCircles(circleans)
            setSelectedCircle(tmpCircle)
            //process circle end
            ctx.drawImage(lineDupRef.current, 0, 0);
        }
    };
    const endDrawing = ({ nativeEvent }) => {
        setIsDrawing(false);
        const { offsetX, offsetY } = nativeEvent;
        const dupCanvas = dupRef.current;
        const dupContext = dupCanvas.getContext("2d");
        const canvas = canvasRef.current;
        if (curTool === "vector") {
            setVectors([...vectors, { sx: startPoint.x, sy: startPoint.y, ex: offsetX, ey: offsetY, isClicked: false, size: utensil["weight"], color: utensil["color"] }])
            updateVector()
        }
        else if (curTool === "circle") {
            setCircles([...circles, { sx: cx, sy: cy, rad: rad, isClicked: false, size: utensil["weight"], color: utensil["color"] }])
            updateCircle()
            ctx.drawImage(lineDupRef.current, 0, 0);
        }
        else if (curTool === "grab") {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            updateVector()
            updateCircle()
            dupContext.clearRect(0, 0, dupRef.current.width, dupRef.current.height)
            dupContext.drawImage(canvas, 0, 0);
            ctx.drawImage(lineDupRef.current, 0, 0);
            return;
        }
        dupContext.drawImage(canvas, 0, 0);
        ctx.drawImage(dupCanvas, 0, 0);
        ctx.closePath();
    };

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
// 드래그 구현 완료