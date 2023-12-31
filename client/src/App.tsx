import { useEffect, useState } from "react";
import babyImage from "./assets/baby.png";
import starImage from "./assets/star.png";
import girlPointing from "./assets/girl-pointing.png";
import girlMegaphone from "./assets/girl-megaphone.png";
import girlSitting from "./assets/girl-sitting.png";
import { BrowserRouter as Router } from "react-router-dom";
import "./AboutMe.css";
import "./LearningPage.css";
import "./App.css";

interface Word {
  english: string;
  spanish: string;
}
function App() {
  // let starCountNum = 0;
  // const [showLearningPage, setShowLearningPage] = useState(false);\
  const [words, setWords] = useState<Word[]>([]);
  const [activeTab, setActiveTab] = useState("AboutMargot");
  const [inputValue, setInputValue] = useState(""); // State for input value
  const [responseMessage, setResponseMessage] = useState<JSX.Element>(
    <div></div>
  ); // State for server response message
  const [currentWord, setCurrentWord] = useState<Word>();
  const [shownWords, setShownWords] = useState<Word[]>([]);
  const [resetMode, setResetMode] = useState(false);
  const [audioSrc, setAudioSrc] = useState<string | null>(null); // State to store the audio blob URL
  const [audioKey, setAudioKey] = useState(0);
  const [starCountNum, setStarCountNum] = useState(0);


  const [startOverText, setStartOverText] = useState("Start!");
  const [startOverTextSpanish, setStartOverTextSpanish] =
    useState("¡Comenzar!");
  const handleStartOverClick = () => {
    setStartOverText("Start Over!");
    // Add any other logic you need to reset the app state
  };
  const handleStartClick = () => {
    setStartOverText("Start!");
  };
  const handleStartOverClickSpanish = () => {
    setStartOverTextSpanish("¡Empezar de nuevo!");
  };
  const handleStartClickSpanish = () => {
    setStartOverTextSpanish("¡Comenzar!");
  };
  const [language, setLanguage] = useState("English");

  const incrementStarCountNum = () => {
    setStarCountNum(starCountNum + 1);
  };

  const handleSubmit = async (
    wordEnglish: any,
    inputText: string,
    wordSpanish: any
  ) => {
    //Check if the inputValue matches currentWord.spanish
    if ((!currentWord || inputValue.toLowerCase() !== currentWord.spanish.toLowerCase()) && language === "English") {
      setResponseMessage(
        <div className="incorrect-response">
          Incorrect word. Please try again.
        </div>
      );
      return; // Exit the function early if the word is incorrect
    }
    if ((!currentWord || inputValue.toLowerCase() !== currentWord.english.toLowerCase()) && language === "Spanish") {
      setResponseMessage(
        <div className="incorrect-response">
          Respuesta incorrecta. Intenta nuevamente.
        </div>
      );
      return; // Exit the function early if the word is incorrect
    }
    try {
      let response: { ok: any; blob: () => any; } = { ok: false, blob: () => null };
      if (language === "English") {
        response = await fetch("http://127.0.0.1:5000/generate_audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputText,
            wordEnglish: wordEnglish,
            wordSpanish: wordSpanish,
          }),
        });
      } else {
        response = await fetch("http://127.0.0.1:5000/generar_audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: inputText,
            wordEnglish: wordEnglish,
            wordSpanish: wordSpanish,
          }),
        });
      }


      if (response.ok) {
        incrementStarCountNum();
        // Revoke the previous blob URL
        if (audioSrc) {
          URL.revokeObjectURL(audioSrc);
        }
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        setAudioSrc(audioUrl);
        setAudioKey((prevKey) => prevKey + 1); // Increment the audio key
        // starCountNum++;
        setResponseMessage(
          <div className="correct-response">Correct word!</div>
        );
      } else {
        //setResponseMessage(data.message || "Error generating audio.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      //setResponseMessage("Error generating audio.");
    }
  };

  const handleLanguageChange = () => {
    setLanguage(language === "English" ? "Spanish" : "English");
  };

  const loadInitialAudio = async () => {
    try {
      // Filter out words that have already been shown
      let unshownWords = words.filter((word) => !shownWords.includes(word));
      // If all words have been shown, reset the shownWords list
      if (unshownWords.length === 0) {
        setShownWords([]);
        unshownWords = [...words];
      }

      // Pick a random word from the unshownWords array
      const randomWord =
        unshownWords[Math.floor(Math.random() * unshownWords.length)];
      let response: {
        [x: string]: any; ok: any; blob: () => any;
      } = { ok: false, blob: () => null };
      if (language === "English") {
        response = await fetch("http://localhost:5000/load_audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wordEnglish: randomWord.english,
            wordSpanish: randomWord.spanish,
          }),
        });
      } else {
        response = await fetch("http://localhost:5000/cargar_audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wordEnglish: randomWord.english,
            wordSpanish: randomWord.spanish,
          }),
        });
      }
      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        setAudioSrc(audioUrl);
        setAudioKey((prevKey) => prevKey + 1);
        setCurrentWord(randomWord);
        setInputValue(""); // Clear the input value
        setShownWords((prevWords) => [...prevWords, randomWord]);
      } else {
        const data = await response.json();
        setResponseMessage(data.message || "Error loading audio.");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setResponseMessage(<div>Error loading audio.</div>);
    }
  };
  useEffect(() => {
    fetch("http://localhost:5000/words")
      .then((response) => response.json())
      .then((data) => setWords(data))
      .catch((error) => console.error("Error fetching words:", error));
  }, []);
  useEffect(() => {
    pickRandomWord();
  }, []);
  const pickRandomWord = () => {
    // If in reset mode, just return
    if (resetMode) return;
    // Filter out words that have already been shown
    const unshownWords = words.filter((word) => !shownWords.includes(word));
    // If all words have been shown, enable reset mode
    if (unshownWords.length === 0) {
      setResetMode(true);
      return;
    }
    // Pick a random word from the unshownWords array
    const randomWord =
      unshownWords[Math.floor(Math.random() * unshownWords.length)];
    // Update the current word and the list of shown words
    setCurrentWord(randomWord);
    setShownWords((prevWords) => [...prevWords, randomWord]);
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
          <button className="change-language" onClick={handleLanguageChange}>
            {language === "Spanish" ? "switch to ENGLISH" : "cambiar a ESPAÑOL"}
          </button>
          <div className="info-buttons">
            <button
              onClick={() => setActiveTab("AboutMargot")}
              className="about-button"
            >
              {language === "English" ? "About Margot" : "Acerca de Margot"}
            </button>
            <button
              onClick={() => setActiveTab("Instructions")}
              className="instructions-button"
            >
              {language === "English" ? "Instructions" : "Instrucciones"}
            </button>
            <button
              onClick={() => {
                setActiveTab("LearningPage");
                handleStartClick();
                handleStartClickSpanish();
              }}
              className="learn-button"
            >
              {language === "English"
                ? "Start Learning!"
                : "¡Comenzar a Aprender!"}
            </button>
          </div>
        </div>
        <div className="info">
          {activeTab === "LearningPage" && (
            <div>
              <h2 id="margot-question">
                {language === "Spanish"
                  ? "¿Qué dijo Margot?"
                  : "What did Margot say?"}
              </h2>
              <div>
                <button
                  id="startover-button"
                  onClick={() => {
                    loadInitialAudio();
                    handleStartOverClick();
                    handleStartOverClickSpanish();
                  }}
                >
                  {language === "Spanish"
                    ? startOverTextSpanish
                    : startOverText}
                </button>
              </div>
              <div className="subtext">
                <input
                  className="input-box"
                  type="text"
                  placeholder={
                    language === "Spanish"
                      ? "Ingrese el texto para la conversión de audio"
                      : "Enter text for audio conversion"
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <button
                  className="submit-button"
                  onClick={() =>
                    handleSubmit(
                      currentWord?.english,
                      inputValue,
                      currentWord?.spanish
                    )
                  }
                >
                  {language === "Spanish" ? "Enviar" : "Submit"}
                </button>
                {audioSrc && (
                  <div>
                    <audio controls key={audioKey} className="audiobar">
                      <source src={audioSrc} type="audio/mpeg" />
                      {language === "Spanish"
                        ? "Su navegador no admite el elemento de audio."
                        : "Your browser does not support the audio element."}
                    </audio>
                  </div>
                )}
                {responseMessage && <p>{responseMessage}</p>}
              </div>
              <div className="learning-images">
                <img src={starImage} className="starCount" alt="Star" />
                <p className="starCountNum">{starCountNum}</p>
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
              {/* <h1 className="how-works">How Margot.AI works: </h1> */}
              <ul id="instruction-list">
                <li className="how-works">
                  {language === "Spanish"
                    ? "Cómo funciona Margot.AI:"
                    : "How Margot.AI works:"}
                </li>
                <li className="star">
                  {" "}
                  {language === "Spanish"
                    ? "Escucha a Margot decir una palabra en español."
                    : "Listen for Margot to say a Spanish word."}
                </li>
                <li className="star">
                  {language === "Spanish"
                    ? "Escribe la palabra."
                    : "Type the word."}
                </li>
                <li className="star">
                  {language === "Spanish" ? "¡Gana estrellas!" : "Earn stars!"}
                </li>
              </ul>
              <img src={starImage} className="star3" alt="Star" />
              <img src={starImage} className="star4" alt="Star" />
              <img src={starImage} className="star5" alt="Star" />
              <img src={starImage} className="star6" alt="Star" />
              <img src={starImage} className="star7" alt="Star" />
            </div>
          )}
          {activeTab === "AboutMargot" && (
            <div className="description">
              <p className="description-english-line1">
                Helping your kids have fun
              </p>
              <p className="description-english-line2">
                kids have fun while learning Spanish!
              </p>
              <p className="description-spanish-line1">
                ¡Ayudando a tus niños a
              </p>
              <p className="description-spanish-line2">
                divertirse mientras aprenden inglés!
              </p>
              <img
                src={girlPointing}
                className="girl-pointing"
                alt="girl pointing at text"
              />
              <img src={starImage} className="star1" alt="Star" />
              <img src={starImage} className="star2" alt="Star" />
              <img src={starImage} className="star2-1" alt="Star" />
              <img src={starImage} className="star2-2" alt="Star" />
              <img src={starImage} className="star2-3" alt="Star" />
            </div>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;