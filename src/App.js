
import { useState } from 'react';
import Container from './Container';
import Header from './Header';

function App() {
  const [utensil, setUtensil] = useState({
    tool: "brush",
    weight: "normal",
    color: "black"
  })
  const handleUtensil = (updateItem, holder) => {
    const newUtensil = { ...utensil }
    if (updateItem === "eraser") {
      newUtensil["color"] = "white"
      newUtensil["tool"] = "brush"
    }
    else
      newUtensil[holder] = updateItem.toLowerCase();
    setUtensil(newUtensil)
  }
  return (
    <>
      <Header handleUtensil={handleUtensil} />
      <Container utensil={utensil} />
    </>
  );
}

export default App;
