import React from 'react';

const Brush = ({ handleUtensil }) => {
    return (
        <div>
            <select onChange={(e) => handleUtensil(e.target.name, "weight")} id="brush-detail">
                <option>Thin</option>
                <option>Normal</option>
                <option>Thick</option>
            </select>
        </div>
    );
};

export default Brush;