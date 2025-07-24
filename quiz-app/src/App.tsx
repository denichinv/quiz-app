import React, { useEffect, useState } from "react";
import { fetchQuizQuestions } from "./utils/fetchQuiz";
import { QuizQuestion, QuizQuestionWithAnswers } from "./types/Quiz";

function App() {
  const [questions, setQuestions] = useState<QuizQuestionWithAnswers[]>([]);
  const [selectAnswer, setSelectAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const fetchData = async () => {
      const questions = await fetchQuizQuestions();
      setQuestions(questions);
      console.log(questions);
    };
    fetchData();
  }, []);

  const handleAnswerClick = (answer: string) => {
    setSelectAnswer(answer);
  };

  const getAnswerClass = (
    answer: string,
    correct: string,
    selected: string | null
  ) => {
    if (!selected) return "";
    if (answer !== selected) return "";
    return answer === correct ? "correct" : "incorrect";
  };

  return (
    <>
      <h1>Quiz App</h1>

      {currentQuestion && (
        <div>
          <h2 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
          {currentQuestion.answers.map((answer, i) => (
            <button
              key={i}
              onClick={() => handleAnswerClick(answer)}
              disabled={!!selectAnswer}
              className={getAnswerClass(
                answer,
                currentQuestion.correct_answer,
                selectAnswer
              )}
              dangerouslySetInnerHTML={{ __html: answer }}
            />
          ))}

          {selectAnswer && (
            <p>
              {selectAnswer === currentQuestion.correct_answer
                ? "✅ Correct!"
                : `❌ Incorrect. Correct answer: ${currentQuestion.correct_answer}`}
            </p>
          )}
        </div>
      )}
    </>
  );
}

export default App;
