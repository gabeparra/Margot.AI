import React, { useState } from "react";
import babyImage from "./assets/baby.png";
import starImage from "./assets/star.png";
import girlPointing from "./assets/girl-pointing.png";
import girlMegaphone from "./assets/girl-megaphone.png";
import girlSitting from "./assets/girl-sitting.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./LearningPage.css";
import "./App.css";

function App() {
  // const [showLearningPage, setShowLearningPage] = useState(false);
  const [activeTab, setActiveTab] = useState("AboutMargot");

  const [inputValue, setInputValue] = useState(""); // State for input value
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
  return (
    <Router>
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
          <div className="info-buttons">
            <button
              onClick={() => setActiveTab("AboutMargot")}
              className="about-button"
            >
              About Margot
            </button>
            <button
              onClick={() => setActiveTab("LearningPage")}
              className="learn-button"
            >
              Start Learning!
            </button>
          </div>
        </div>

        <div className="info">
          {activeTab === "LearningPage" && (
            <div>
              <h2>What did Margot say?</h2>
              <div className="subtext">
                <input
                  className="input-box"
                  type="text"
                  placeholder="Enter your response here!"
                />
              </div>
              <div className="learning-images">
                <img
                  src={girlSitting}
                  className="girl-sitting"
                  alt="girl pointing at text"
                />
              </div>
            </div>
          )}
          {activeTab === "AboutMargot" && (
            <div className="description">
              <p className="description-english-line1">
                Helping your kids learn and
              </p>
              <p className="description-english-line2">
                understand Spanish easier!
              </p>
              <p className="description-spanish-line1">
                Ayudando a tus niños a
              </p>
              <p className="description-spanish-line2">
                entender y aprender Ingles facilmente!
              </p>
              <img
                src={girlPointing}
                className="girl-pointing"
                alt="girl pointing at text"
              />
              <img src={starImage} className="star1" alt="Star" />
              <img src={starImage} className="star2" alt="Star" />
            </div>
          )}
        </div>
        <button className="change-language">SITE LANGUAGE: English</button>
        <button className="instructions-button">Instructions</button>
      </div>
      <img src={starImage} className="star2" alt="Star" />
      <div className="introduction">
        <img
          src={girlMegaphone}
          className="girl-megaphone"
          alt="Girl holding megaphone"
        />
        <h1 className="how-works">How Margot.AI works: </h1>
        <ul id="instruction-list">
          <li className="star">Listen for Margot to say a Spanish word.</li>
          <li className="star">Type the word.</li>
          <li className="star">Earn stars!</li>
        </ul>
      </div>
    </Router>
  );
}

export default App;
