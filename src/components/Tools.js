import { React, useState } from 'react';
import brushCursor from '../assets/images/brush-cursor.png';
import bucketCursor from '../assets/images/bucket-cursor.png';
import eraserCursor from '../assets/images/eraser-cursor.png';
import styles from '../assets/styles/Tool.css';

const Tools = ({ curSize, setCurSize, curTool, setCurTool, handleUtensil, setCurColor }) => {


    const onClick = (e) => {
        e.preventDefault();
        setCurTool(e.target.name)
        if (e.target.name === 'eraser') {
            setCurSize(50);
            setCurColor("white")
        }
        handleUtensil(e.target.name, "tool");
    }

    let cursor;
    switch (curTool) {
        case 'brush':
            cursor = `url(${brushCursor}), auto`;
            break;
        case 'bucket':
            cursor = `url(${bucketCursor}), auto`;
            break;
        case 'eraser':
            cursor = `url(${eraserCursor}), auto`;
            break;
        default:
            cursor = 'default';
    }

    return (
        <div style={{
            display: 'flex',
            backgroundColor: 'lightgrey',
            padding: '5px',
            width: '120px',
            textAlign: "center",
            cursor: cursor
        }} onMouseMove={() => {
            document.body.style.cursor = cursor;
        }}>
            <button style={{
                boxShadow: curTool === "brush" ? '0 0 10px 3px rgba(0, 0, 0, 0.2)' : 'none',
                border: curTool === "brush" ? '1.5px solid black' : 'none',
            }} id="btn-brush-click" name="brush" onClick={(e) => onClick(e)}>✏️</button>
            <button style={{
                boxShadow: curTool === "bucket" ? '0 0 10px 3px rgba(0, 0, 0, 0.2)' : 'none',
                border: curTool === "bucket" ? '1.5px solid black' : 'none',
            }} id="btn-bucket" name="bucket" onClick={(e) => onClick(e)}>🥣</button>
            <button style={{
                boxShadow: curTool === "eraser" ? '0 0 10px 3px rgba(0, 0, 0, 0.2)' : 'none',
                border: curTool === "eraser" ? '1.5px solid black' : 'none',
            }} id="btn-eraser" name="eraser" onClick={(e) => onClick(e)}>❌</button>
            <button style={{
                boxShadow: curTool === "grab" ? '0 0 10px 3px rgba(0, 0, 0, 0.2)' : 'none',
                border: curTool === "grab" ? '1.5px solid black' : 'none',
            }} id="btn-grab" name="grab" onClick={(e) => onClick(e)}>✋</button>
        </div>
    );
};

export default Tools;