import React, { useState } from 'react';
import Brush from './Brush';
import ColorContainer from './ColorContainer';
import Tools from './Tools';
import styles from './Header.css'
function Header({ handleUtensil }) {
    return (
        <div id="header">
            <Tools handleUtensil={handleUtensil} />
            <Brush handleUtensil={handleUtensil} />
            <ColorContainer handleUtensil={handleUtensil} />
        </div>
    );
}

export default Header;  