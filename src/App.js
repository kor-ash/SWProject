
import { useState } from 'react';
import Container from './Container';
import Header from './Header';

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
    <>
      <div style={{ display: "flex" }}>
        <div>
          <Header curTool={curTool} setCurTool={setCurTool} curSize={curSize} setCurSize={setCurSize} handleUtensil={handleUtensil} curColor={curColor} setCurColor={setCurColor} />
          <Container curTool={curTool} setCurTool={setCurTool} utensil={utensil} handleUtensil={handleUtensil} />
        </div>
      </div>
    </>
  );
}

export default App;
