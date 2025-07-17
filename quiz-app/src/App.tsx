import React, { useEffect } from "react";
import { fetchQuizQuestions } from "./utils/fetchQuiz";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const questions = await fetchQuizQuestions();
      console.log(questions);
    };
    fetchData();
  }, []);
  return (
    <>
      <h1>Quiz App</h1>
    </>
  );
}

export default App;
