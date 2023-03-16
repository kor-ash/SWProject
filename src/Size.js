import React, { useEffect, useState } from 'react';

const Brush = ({ handleUtensil }) => {
    const [brush, setBrush] = useState(10);
    const onChange = (val) => {
        setBrush(val)
    }
    useEffect(() => {
        handleUtensil(brush, "weight");
    }, [brush])
    /*
            <select onChange={(e) => handleUtensil(e.target.name, "weight")} id="brush-detail">
                <option>Thin</option>
                <option>Normal</option>
                <option>Thick</option>
            </select>
    */
    return (
        <div style={{ display: 'flex' }}>
            {brush}
            <input onChange={(e) => onChange(e.target.value)} type="range" min="1" max="50" value={brush} />
        </div>
    );
};

export default Brush;