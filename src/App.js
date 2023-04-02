
import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import styles from './assets/styles/App.css';
import SidebarHeader from './components/SidebarHeader';
import Container from './components/Container';
import store from './store';
import { Provider, useSelector } from 'react-redux';
function App() {
  const [curTool, setCurTool] = useState("brush")
  const [curSize, setCurSize] = useState(10);
  const [curColor, setCurColor] = useState("black");
  const [utensil, setUtensil] = useState({
    tool: curTool,
    weight: curSize,
    color: curColor
  })
  const handleUtensil = (updateItem, holder) => {
    const newUtensil = { ...utensil }
    if (updateItem === 'eraser') {
      newUtensil["color"] = "white"
      newUtensil["tool"] = "eraser"
      newUtensil["weight"] = 40
    }
    else {
      if (holder !== "weight")
        newUtensil[holder] = updateItem.toLowerCase();
      else
        newUtensil[holder] = updateItem;
    }
    setUtensil(newUtensil)
  }
  return (
    <Provider store={store}>
      <div style={{ display: "flex" }}>
        <div style={{ marginTop: "2%", marginLeft: "10%" }}>
          <Header curTool={curTool} setCurTool={setCurTool} curSize={curSize} setCurSize={setCurSize} handleUtensil={handleUtensil} curColor={curColor} setCurColor={setCurColor} />
          <Container curTool={curTool} setCurTool={setCurTool} utensil={utensil} handleUtensil={handleUtensil} />
        </div>
        <div>
          <SidebarHeader></SidebarHeader>
          <Sidebar />
        </div>
      </div>
    </Provider>
  );
}

export default App;
