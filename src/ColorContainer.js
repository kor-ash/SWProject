import React, { useState } from 'react';
import ColorCard from './ColorCard';

const colorList = ["red", "blue", "green", "yellow", "pink", "black", "white", "brown", "purple", "grey", "orange"]

const ColorContainer = ({ curTool, curColor, setCurColor, handleUtensil }) => {
    const onColorClick = (c) => {
        setCurColor(c)
        handleUtensil(c, "color");
    };

    const colorGrid = colorList.map((color) => {
        return (
            <ColorCard
                key={color}
                curTool={curTool}
                color={color}
                curColor={curColor}
                onColorClick={() => onColorClick(color)}
                setCurColor={setCurColor}
            />
        );
    });

    return (
        <div>
            <div id="color-grid">{colorGrid}</div>
        </div>
    );
};

export default ColorContainer;