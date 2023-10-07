import { useState } from "react";
import babyImage from "./assets/baby.png";
import starImage from "./assets/star.png";
import girlPointing from "./assets/girl-pointing.png";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
        <button className="instructions-button">Instructions</button>
      </div>
      <img src={starImage} className="star-image" alt="Image of a star" />
      <img
        src={girlPointing}
        className="girlPointing-image"
        alt="girl pointing at text"
      />
      <div className="description">
        <p className="description-english-line1">Helping your kids learn and</p>
        <p className="description-english-line2">understand Spanish easier!</p>
        <p className="description-spanish-line1">Ayudando a tus niños a</p>
        <p className="description-spanish-line2">
          entender y aprender Ingles facilmente!
        </p>
      </div>
    </>
  );
}

export default App;
