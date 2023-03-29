import React, { useEffect, useRef, useState } from 'react';
const Vector = ({ x, y, dx, dy, ctx, isClicked, canvasRef }) => {
    // Draw vector
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (isClicked)
        context.strokeStyle = "red";
    else
        context.strokeStyle = "black";
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
    const [selectedVector, setSelectedVector] = useState([]);
    const [vectors, setVectors] = useState([])
    const [circles, setCircles] = useState([])
    useEffect(() => {
        const canvas = canvasRef.current;
        canvas.width = window.innerHeight * 1.1;
        canvas.height = 800
        const context = canvas.getContext("2d");
        context.strokeStyle = "black";
        context.lineWidth = 15;
        contextRef.current = context;
        setCtx(contextRef.current);
        const dupCanvas = dupRef.current;

        dupCanvas.width = window.innerWidth * 1.1;
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
            else if (utensil["tool"] === "grab") {
                setStartPoint({ x: offsetX, y: offsetY })
                const hit = vectors.find((vector) => {
                    const { sx, sy, ex, ey } = vector;
                    const dist = dis({ sx: sx, sy: sy, ex: ex, ey: ey, tx: offsetX, ty: offsetY })
                    if (dist < 10) {
                        vector.isClicked = true
                        return true;
                    }
                    else
                        return false;
                });
                let tmpHit;
                if (hit === undefined)
                    return;
                if (hit.isClicked) {
                    tmpHit = [...selectedVector, hit]
                    setSelectedVector(tmpHit)
                }
                else {
                    tmpHit = selectedVector.filter((vector) => {
                        return vector.isClicked;
                    })
                    setSelectedVector(tmpHit)
                }
            }
        }
    };

    useEffect(() => {
        updateVector()

    }, [selectedVector])

    const updateVector = () => {
        vectors.map((vector) => {
            return Vector({ x: vector.sx, y: vector.sy, dx: vector.ex - vector.sx, dy: vector.ey - vector.sy, ctx: ctx, isClicked: vector.isClicked, canvasRef: canvasRef })
        });
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
            const tmpvector = [...vectors, { sx: startPoint.x, sy: startPoint.y, ex: offsetX, ey: offsetY, isClicked: false, canvasRef: canvasRef }]
            setVectors(tmpvector)
            updateVector()

        }
        else if (curTool === "grab") {
            updateVector()
            console.log("hi")
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
                    //늘렸다 줄였다 복원 위함

                    Vector({ x: startPoint.x, y: startPoint.y, dx: newDx, dy: newDy, ctx, canvasRef: canvasRef });
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
            else if (utensil["tool"] === "grab") {
                if (isDrawing) {
                    const newDx = (offsetX - startPoint.x);
                    const newDy = (offsetY - startPoint.y);

                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                    ctx.drawImage(dupRef.current, 0, 0);
                    const tmpVector = [...selectedVector];
                    //{ sx: startPoint.x, sy: startPoint.y, ex: offsetX, ey: offsetY, isClicked: false, canvasRef: canvasRef }
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
                    //ans에는 select 안된 벡터만 있음
                    console.log("움직이기 전 tmpVector:", tmpVector)
                    for (let i = 0; i < tmpVector.length; i++) {
                        tmpVector[i].sx += newDx;
                        tmpVector[i].sy += newDy;
                        tmpVector[i].ex += newDx;
                        tmpVector[i].ey += newDy;
                        Vector({ x: tmpVector[i].sx, y: tmpVector[i].sy, dx: tmpVector[i].ex - tmpVector[i].sx, dy: tmpVector[i].ey - tmpVector[i].sy, ctx, canvasRef: canvasRef });
                    }
                    /*
                    tmpVector.map((vector) => {
                        vector.sx += newDx;
                        vector.sy += newDy;
                        vector.ex += newDx;
                        vector.ey += newDy;
                        Vector({ x: vector.sx, y: vector.sy, dx: vector.ex - vector.sx, dy: vector.ey - vector.sy, ctx, canvasRef: canvasRef });
                        return vector;
                    })
                    */
                    //tmpVector는 다 이동함
                    for (let i = 0; i < tmpVector.length; i++)
                        ans.push(tmpVector[i])
                    setVectors(ans)
                    setSelectedVector(tmpVector)
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