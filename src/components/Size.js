import React, { useEffect, useState } from 'react';

const Size = ({ curSize, setCurSize, handleUtensil }) => {
    const onChange = (val) => {
        setCurSize(val)
    }
    useEffect(() => {
        handleUtensil(curSize, "weight");
    }, [curSize])
    /*
            <select onChange={(e) => handleUtensil(e.target.name, "weight")} id="brush-detail">
                <option>Thin</option>
                <option>Normal</option>
                <option>Thick</option>
            </select>
    */
    return (
        <div style={{ display: 'flex' }}>
            {curSize}
            <input onChange={(e) => onChange(e.target.value)} type="range" min="1" max="50" value={curSize} />
        </div>
    );
};

export default Size;