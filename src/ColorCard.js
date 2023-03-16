import React from 'react';

const ColorCard = ({ color, handleUtensil }) => {
    return (
        <div onClick={() => handleUtensil(color, "color")} className="color-icon" style={{ backgroundColor: `${color}` }}>
        </div>
    );
};

export default ColorCard;