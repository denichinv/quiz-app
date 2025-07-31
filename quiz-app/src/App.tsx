import React, { useEffect, useState } from "react";
import { fetchQuizQuestions } from "./utils/fetchQuiz";
import { QuizQuestionWithAnswers } from "./types/Quiz";

function App() {
  const [questions, setQuestions] = useState<QuizQuestionWithAnswers[]>([]);
  const [selectAnswer, setSelectAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const fetchData = async () => {
      const fetchedQuestions = await fetchQuizQuestions();
      setQuestions(fetchedQuestions);
      console.log(fetchedQuestions);
    };
    fetchData();
  }, []);

  const handleAnswerClick = (answer: string) => {
    setSelectAnswer(answer);

    if (answer === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
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
      <p>
        Score: {score} / {questions.length}
      </p>

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
            <div>
              <p>
                {selectAnswer === currentQuestion.correct_answer
                  ? "✅ Correct!"
                  : `❌ Incorrect. Correct answer: ${currentQuestion.correct_answer}`}
              </p>

              {currentQuestionIndex < questions.length - 1 && (
                <button onClick={handleNextQuestion}>Next Question →</button>
              )}

              {currentQuestionIndex === questions.length - 1 && (
                <p>
                  🎉 You have completed the quiz! <br />
                  Final Score: {score} / {questions.length}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default App;
