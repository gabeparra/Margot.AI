import { useState } from "react";
import babyImage from "./assets/baby.png";
import starImage from "./assets/star.png";
import girlPointing from "./assets/girl-pointing.png";
import "./App.css";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <div className="header">
        <h1 className="title">Margot.AI</h1>
        <a>
          <img
            src={babyImage}
            className="baby-image"
            alt="Image of a baby's face"
          />
        </a>
        <button className="change-language">SITE LANGUAGE: English</button>
      </div>
      {/* <div className="images"> */}
      <img src={starImage} className="star-image" alt="Star"/>
      <img
        src={girlPointing}
        className="girlPointing-image"
        alt="girl pointing at text"
      />
      {/* </div> */}
      <div className="instructions">
        <p className="instructions-english-line1">
          Helping your kids learn and understand
        </p>
        <p className="instructions-english-line2">Spanish easier!</p>
        <p className="instructions-spanish-line1">
          Ayudando a tus niños a entender y
        </p>
        <p className="instructions-spanish-line2">
          aprender Ingles facilmente!
        </p>
      </div>
      <img src={starImage} className="star-image2" alt="Star"/>
    </>
  );
}

export default App;
