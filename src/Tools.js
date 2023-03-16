import React from 'react';

const Tools = ({ handleUtensil }) => {
    return (
        <div style={{
            display: 'flex', backgroundColor: 'lightgrey', padding: '5px',
            width: '120px', textAlign: "center"
        }}>
            <button name="brush" onClick={e => handleUtensil(e.target.name, "tool")}>✏️</button>
            <button name="bucket" onClick={e => handleUtensil(e.target.name, "tool")}>🥣</button>
            <button name="erase" onClick={e => handleUtensil(e.target.name, "tool")}>❌</button>
        </div>
    );
};

export default Tools;