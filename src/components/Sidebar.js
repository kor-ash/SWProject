import React, { useEffect, useState } from 'react';
import styles from '../assets/styles/Sidebar.css'
import { useSelector } from 'react-redux';

const SideBarBox = ({ title, content }) => {
    const id = "sideBar" + title + "Box"
    console.log(id)
    return (
        <div id={id}>
            <div id="sideBarBoxHeader">{title}</div>
            <div style={{ paddingTop: "15px" }}>{content}</div>
        </div>
    )
}
const Sidebar = () => {
    const { savedVector, savedCircle } = useSelector(state => state.canvas)
    const [type, setType] = useState("Brush")

    useEffect(() => {
        if (savedVector.length) {
            setType("Vector")
        }
        else if (savedCircle.length) {
            setType("Circle")
        }
        else {
            setType("Brush")
        }
    }, [savedVector, savedCircle])

    return (
        <div id="sideBar">
            <SideBarBox title={"Type"} content={type} />
            <div style={{ display: "flex" }}>
                <SideBarBox id="contentWidth" title={"Width"} content={""} />
                <SideBarBox id="contentHeight" title={"Height"} content={""} />
            </div>
            <div style={{ marginTop: "15px", display: "flex" }}>
                <SideBarBox id="contentColor" title={"Color"} content={""} />
                <SideBarBox id="contentSize" title={"Size"} content={""} />
            </div>
        </div>
    );
};

export default Sidebar;