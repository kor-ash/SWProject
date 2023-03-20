import React from 'react';

const ColorCard = ({ curTool, color, curColor, onColorClick, setCurColor }) => {
    const onClick = () => {
        if (curTool !== "eraser")
            onColorClick(color);
    };

    return (
        <div
            onClick={onClick}
            className="color-icon"
            style={{
                backgroundColor: color,
                boxShadow: curColor === color ? '0 0 10px 3px rgba(0, 0, 0, 0.2)' : 'none',
                border: curColor === color ? '2px solid black' : 'none',
            }}
        />
    );
};

export default ColorCard;