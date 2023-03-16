import React from 'react';
import ColorCard from './ColorCard';
const colorList = ["red", "blue", "green", "yellow", "pink", "black", "white",
    "brown", "purple", "grey", "orange"]

const ColorContainer = ({ handleUtensil }) => {
    const colorGrid = colorList.map((color) => {
        return (
            <ColorCard key={color} color={color} handleUtensil={handleUtensil} />
        )
    })
    return (
        <div>
            <div id="color-grid">
                {colorGrid}
            </div>
        </div>
    );
};

export default ColorContainer;