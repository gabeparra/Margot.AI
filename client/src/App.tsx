import { useState } from "react";
import babyImage from "./assets/baby.png";
import starImage from "./assets/star.png";
import girlPointing from "./assets/girl-pointing.png";
// import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
/*import { BrowserRouter as Router, Route, Link } from "react-router-dom";*/
import "./App.css";

function App() {
  /*const [inputValue, setInputValue] = useState(""); // State for input value
  const [responseMessage, setResponseMessage] = useState(""); // State for server response message

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/generate_audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue }),
      });
      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error("Error sending request:", error);
      setResponseMessage("Error generating audio.");
    }
  };
  */
  return (
    <div>
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
        <button className="learn-button">Start Learning!</button>
      </div>
      <div className="images">
        <img src={starImage} className="star1" alt="Star" />
        <img
          src={girlPointing}
          className="girl-pointing"
          alt="girl pointing at text"
        />
      </div>
      <div className="description">
        <p className="description-english-line1">Helping your kids learn and</p>
        <p className="description-english-line2">understand Spanish easier!</p>
        <p className="description-spanish-line1">Ayudando a tus niños a</p>
        <p className="description-spanish-line2">
          entender y aprender Ingles facilmente!
        </p>
      </div>

      {/* <div className="input-section">
        <input
          type="text"
          placeholder="Enter text for audio conversion..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleSubmit}>Submit</button>
        {responseMessage && <p>{responseMessage}</p>}
      </div> */}
      {/* <img src={starImage} className="star-image2" alt="Star" /> */}
      <img src={starImage} className="star2" alt="Star" />
    </div>
  );
}

export default App;
