import React, { useEffect, useRef } from 'react';

const Vector = ({ x, y, dx, dy, color, width }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + dx, y + dy);
        ctx.stroke();
    }, [x, y, dx, dy, color, width]);

    return <canvas ref={canvasRef} width={Math.abs(dx)} height={Math.abs(dy)} />;
};

export default Vector;