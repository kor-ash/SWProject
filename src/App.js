
import { useState } from 'react';
import Container from './Container';
import Header from './Header';

function App() {
  const [utensil, setUtensil] = useState({
    tool: "brush",
    weight: 50,
    color: "black"
  })
  const handleUtensil = (updateItem, holder) => {
    const newUtensil = { ...utensil }
    if (updateItem === 'eraser') {
      newUtensil["color"] = "white"
      newUtensil["tool"] = "brush"
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
          <Header handleUtensil={handleUtensil} />
          <Container utensil={utensil} />
        </div>
      </div>
    </>
  );
}

export default App;
