import React, { useState } from 'react';
import Size from './Size';
import ColorContainer from './ColorContainer';
import Tools from './Tools';
import styles from './Header.css'
function Header({ handleUtensil }) {
    return (
        <div id="header">
            <Tools handleUtensil={handleUtensil} />
            <Size handleUtensil={handleUtensil} />
            <ColorContainer handleUtensil={handleUtensil} />
        </div>
    );
}

export default Header;  