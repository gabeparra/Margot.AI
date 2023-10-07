import React, { useState } from "react";
import "./LearningPage.css";

function LearningPage() {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <h2>What did Margot say?</h2>
      <p>Enter your response here!</p>
      <input
        className="input-box"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
      />
    </div>
  );
}

export default LearningPage;
