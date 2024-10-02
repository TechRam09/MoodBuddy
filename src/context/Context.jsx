import { createContext, useState, useEffect } from "react";
import runChat from "../config/Gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [suggestionPrompts, setSuggestionPrompts] = useState([]);

  // List of mental health prompts
  const mentalHealthPrompts = [
    "What are some effective daily habits for improving mental well-being?",
    "Can you suggest mindfulness exercises to reduce stress?",
    "What are some techniques for managing anxiety in everyday situations?",
    "How can I cope with anxiety during stressful times?",
    "What are some self-care activities I can do when I'm feeling overwhelmed?",
    "How can I create a self-care routine that fits my lifestyle?",
    "What are some strategies to help someone feeling down or depressed?",
    "How can I support a friend who is struggling with their mental health?",
    "Can you suggest a simple meditation practice for beginners?",
    "What are the benefits of mindfulness, and how can I incorporate it into my life?",
  ];

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 10 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResults(false);
  };

  // Function to fetch random suggestion prompts
  const fetchRandomSuggestions = () => {
    const shuffledPrompts = [...mentalHealthPrompts].sort(
      () => Math.random() - 0.5
    );
    setSuggestionPrompts(shuffledPrompts.slice(0, 4)); // Select the first 4 shuffled prompts
  };

  // Call fetchRandomSuggestions on initial render
  useEffect(() => {
    fetchRandomSuggestions();
  }, []);

  const onSent = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResults(true);
    let response;

    if (prompt !== undefined) {
      response = await runChat(prompt);
      setRecentPrompt(prompt);
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      response = await runChat(input);
    }

    try {
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      let newResponse2 = newResponse.split("*").join("<br/>");
      let newResponseArray = newResponse2.split("");
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + "");
      }
    } catch (error) {
      console.error("Error while running chat:", error);
      // Handle error appropriately
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    input,
    setInput,
    showResults,
    loading,
    resultData,
    newChat,
    suggestionPrompts, // Expose suggestion prompts
    fetchRandomSuggestions, // Expose method to fetch new suggestions
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
