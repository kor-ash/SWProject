import { React, useState } from 'react';
import brushCursor from './images/brush-cursor.png';
import bucketCursor from './images/bucket-cursor.png';
import eraserCursor from './images/eraser-cursor.png';
import styles from './Tool.css';

const Tools = ({ handleUtensil }) => {
    const [tool, setTool] = useState("brush");

    const onClick = (e) => {
        e.preventDefault();
        setTool(e.target.name);
        handleUtensil(e.target.name, "tool");
    }

    let cursor;
    switch (tool) {
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
            <button id="btn-brush-click" name="brush" onClick={(e) => onClick(e)}>✏️</button>
            <button id="btn-bucket" name="bucket" onClick={(e) => onClick(e)}>🥣</button>
            <button id="btn-eraser" name="eraser" onClick={(e) => onClick(e)}>❌</button>
        </div>
    );
};

export default Tools;