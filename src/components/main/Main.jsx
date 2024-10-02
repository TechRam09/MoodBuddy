import { useEffect, useContext, useState } from "react";
import { assets } from "../../assets/assets";
import "./main.css";
import { Context } from "../../context/Context";

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResults,
    loading,
    resultData,
    setInput,
    input,
    suggestionPrompts, // Access suggestion prompts from context
  } = useContext(Context);

  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize the SpeechRecognition API
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false; // Set to true for continuous results
      recognitionInstance.interimResults = false; // Set to true for interim results

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript); // Set the input with the recognized speech
        onSent(transcript); // Optionally, send the input immediately
      };

      recognitionInstance.onend = () => {
        setIsListening(false); // Stop listening
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceInput = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  const handleCardClick = (promptText) => {
    setInput(promptText);
  };

  return (
    <div className="main">
      <div className="nav">
        <p>MoodBuddy</p>
        <img src={assets.user} alt="" />
      </div>
      <div className="main-container">
        {!showResults ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Buddy</span>
              </p>
              <p>How Can I Help You Today?</p>
            </div>
            <div className="cards">
              {suggestionPrompts.map((prompt, index) => (
                <div
                  key={index}
                  className="card"
                  onClick={() => handleCardClick(prompt)}
                >
                  <p>{prompt}</p>
                  <img src={assets.health_icon} alt="" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img src={assets.user} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
              {loading ? (
                <div className="loader">
                  <hr />
                  <hr />
                  <hr />
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => {
                setInput(e.target.value);
              }}
              value={input}
              type="text"
              placeholder="Ask Your Buddy...."
            />
            <div>
              <img src={assets.mic_icon} alt="" onClick={handleVoiceInput} />
              <img
                src={assets.send_icon}
                alt=""
                onClick={() => {
                  onSent();
                }}
              />
            </div>
          </div>
          <div className="bottom-info">
            <p>
              MoodBuddy may display inaccurate info, including about people, so
              double-check its responses. Your privacy & MoodBuddy Apps
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
