import React, { useRef, useState, useEffect } from 'react';

function Test() {
    const canvasRef = useRef(null);
    const [lines, setLines] = useState([]);
    const [vectors, setVectors] = useState([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        function drawLines() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (const line of lines) {
                ctx.beginPath();
                ctx.moveTo(line.startX, line.startY);
                ctx.lineTo(line.endX, line.endY);
                ctx.stroke();
            }
        }

        function drawVectors() {
            for (const vector of vectors) {
                ctx.beginPath();
                ctx.moveTo(vector.startX, vector.startY);
                ctx.lineTo(vector.endX, vector.endY);
                ctx.stroke();
            }
        }

        drawLines();
        drawVectors();

        return () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
    }, [lines, vectors]);

    function handleMouseDown(event) {
        const startX = event.offsetX;
        const startY = event.offsetY;

        setVectors(vectors => [...vectors, {
            startX,
            startY,
            endX: startX,
            endY: startY,
        }]);

        function handleMouseUp() {
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseup', handleMouseUp);

            setLines(lines => [...lines, {
                startX,
                startY,
                endX: event.offsetX,
                endY: event.offsetY,
            }]);
        }

        const canvas = canvasRef.current;
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);

        function handleMouseMove(event) {
            const endX = event.offsetX;
            const endY = event.offsetY;

            setVectors(vectors => {
                const lastVector = vectors[vectors.length - 1];
                const newVector = {
                    ...lastVector,
                    endX,
                    endY,
                };
                return [
                    ...vectors.slice(0, vectors.length - 1),
                    newVector,
                ];
            });
        }

        return <canvas ref={canvasRef} />;
    }

    return <canvas style={{ border: "1px black solid" }} onMouseDown={handleMouseDown} ref={canvasRef} />;
}
export default Test;