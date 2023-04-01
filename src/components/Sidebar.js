import React from 'react';
import styles from '../assets/styles/Sidebar.css'
const Sidebar = () => {
    return (
        <div id="sideBar">
            <div id="contentType">
                Type
            </div>
            <div style={{ display: "flex" }}>
                <div id="contentWidth">Width</div>
                <div id="contentHeight">Height</div>
            </div>
            <div style={{ marginTop: "15px", display: "flex" }}>
                <div id="contentColor">Color</div>
                <div id="contentSize">Size</div>
            </div>
        </div>
    );
};

export default Sidebar;