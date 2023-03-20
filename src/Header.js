import React, { useState } from 'react';
import Size from './Size';
import ColorContainer from './ColorContainer';
import Tools from './Tools';
import styles from './Header.css'
function Header({ curTool, setCurTool, curSize, setCurSize, handleUtensil, curColor, setCurColor }) {
    const onSelect = (e) => {
        handleUtensil(e.target.value, "tool")
        setCurTool(e.target.value)
    }
    return (
        <div id="header">
            <Tools curSize={curSize} setCurSize={setCurSize} curTool={curTool} setCurTool={setCurTool} handleUtensil={handleUtensil} setCurColor={setCurColor} />
            <Size curSize={curSize} setCurSize={setCurSize} handleUtensil={handleUtensil} />
            <select onChange={(e) => onSelect(e)} value={curTool}>
                <option >brush</option>
                <option >vector</option>
                <option>elipse</option>
                <option>circle</option>
                <option>Rectangle</option>
                <option>eraser</option>
                <option>bucket</option>
            </select>
            <ColorContainer curTool={curTool} curColor={curColor} setCurColor={setCurColor} handleUtensil={handleUtensil} />
        </div>
    );
}

export default Header;  