import React, { useEffect, useState } from "react";
import { fetchQuizQuestions } from "./utils/fetchQuiz";
import { QuizQuestion, QuizQuestionWithAnswers } from "./types/Quiz";

function App() {
  const [questions, setQuestions] = useState<QuizQuestionWithAnswers[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const questions = await fetchQuizQuestions();
      setQuestions(questions);
      console.log(questions);
    };
    fetchData();
  }, []);

  return (
    <>
      <h1>Quiz App</h1>

      {questions.map((q, index) => (
        <div key={index}>
          <h2 dangerouslySetInnerHTML={{ __html: q.question }} />
          {q.answers.map((answer, i) => (
            <button
              key={i}
              dangerouslySetInnerHTML={{ __html: answer }}
            ></button>
          ))}
        </div>
      ))}
    </>
  );
}

export default App;
