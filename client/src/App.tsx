import { useEffect, useState } from "react";
import babyImage from "./assets/baby.png";
import starImage from "./assets/star.png";
import girlPointing from "./assets/girl-pointing.png";
import girlMegaphone from "./assets/girl-megaphone.png";
import girlSitting from "./assets/girl-sitting.png";
import { BrowserRouter as Router } from "react-router-dom";
import "./LearningPage.css";
import "./App.css";

function App() {
  // const [showLearningPage, setShowLearningPage] = useState(false);\
  const [words, setWords] = useState([]);
  const [activeTab, setActiveTab] = useState("AboutMargot");
  const [inputValue, setInputValue] = useState(""); // State for input value
  const [responseMessage, setResponseMessage] = useState(""); // State for server response message
  const [currentWord, setCurrentWord] = useState(null);
  const [shownWords, setShownWords] = useState([]);
  const [resetMode, setResetMode] = useState(false);
  const [audioSrc, setAudioSrc] = useState(null); // State to store the audio blob URL
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate_audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputValue }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        setAudioSrc(audioUrl);
        setResponseMessage("Audio generated successfully!");
      } else {
        const data = await response.json();
        setResponseMessage(data.message || "Error generating audio.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setResponseMessage("Error generating audio.");
    }
  };
  useEffect(() => {
    fetch('http://localhost:5000/words')
      .then(response => response.json())
      .then(data => setWords(data))
      .catch(error => console.error('Error fetching words:', error));
  }, []);
  useEffect(() => {
    pickRandomWord();
  }, []);
  const pickRandomWord = () => {
    // If in reset mode, just return
    if (resetMode) return;

    // Filter out words that have already been shown
    const unshownWords = words.filter(word => !shownWords.includes(word));

    // If all words have been shown, enable reset mode
    if (unshownWords.length === 0) {
      setResetMode(true);
      return;
    }

    // Pick a random word from the unshownWords array
    const randomWord = unshownWords[Math.floor(Math.random() * unshownWords.length)];

    // Update the current word and the list of shown words
    setCurrentWord(randomWord);
    setShownWords(prevWords => [...prevWords, randomWord]);
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
          <div className="info-buttons">
            <button
              onClick={() => setActiveTab("AboutMargot")}
              className="about-button"
            >
              About Margot
            </button>
            <button
              onClick={() => setActiveTab("Instructions")}
              className="instructions-button"
            >
              Instructions
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
              <div>
                <h2>Word</h2>
                {currentWord && (
                  <div>
                    English: {currentWord.english}, Spanish: {currentWord.spanish}
                  </div>
                )}
                <button onClick={() => {
                  if (resetMode) {
                    setShownWords([]);
                    setResetMode(false);
                    pickRandomWord();
                  } else {
                    pickRandomWord();
                  }
                }}>
                  {resetMode ? "Start Over" : "Pick Random Word"}
                </button>
              </div>
              <div className="subtext">
                <input
                  className="input-box"
                  type="text"
                  placeholder="Enter text for audio conversion"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit</button>
                {audioSrc && (
                  <div>
                    <audio controls>
                      <source src={audioSrc} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                {responseMessage && <p>{responseMessage}</p>}
              </div>
              <div className="learning-images">
                <img
                  src={girlSitting}
                  className="girl-sitting"
                  alt="girl pointing at text"
                />
              </div>
              <img src={starImage} className="lstar1" alt="Star" />
              <img src={starImage} className="lstar2" alt="Star" />
              <img src={starImage} className="lstar3" alt="Star" />
            </div>
          )}
          {activeTab === "Instructions" && (
            <div className="introduction">
              <img
                src={girlMegaphone}
                className="girl-megaphone"
                alt="Girl holding megaphone"
              />
              <h1 className="how-works">How Margot.AI works: </h1>
              <ul id="instruction-list">
                <li className="star">
                  Listen for Margot to say a Spanish word.
                </li>
                <li className="star">Type the word.</li>
                <li className="star">Earn stars!</li>
              </ul>
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
      </div>
    </Router>
  );
}

export default App;
