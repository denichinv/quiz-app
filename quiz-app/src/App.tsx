import React, { useEffect, useState } from "react";
import { fetchQuizQuestions } from "./utils/fetchQuiz";
import { QuizQuestionWithAnswers } from "./types/Quiz";

function App() {
  const [questions, setQuestions] = useState<QuizQuestionWithAnswers[]>([]);
  const [selectAnswer, setSelectAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [limit, setLimit] = useState(5);

  const currentQuestion = questions[currentQuestionIndex];
  const categories = [
    "Linux",
    "Bash",
    "Docker",
    "Kubernetes",
    "SQL",
    "DevOps",
    "CMS",
    "PHP",
    "HTML",
    "WordPress",
  ];

  const escapeHTMLTags = (str: string) => {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };

  useEffect(() => {
    if (!gameStarted) return;

    const fetchData = async () => {
      const fetchedQuestions = await fetchQuizQuestions(
        category,
        difficulty,
        limit
      );
      setQuestions(fetchedQuestions);
    };

    fetchData();
  }, [gameStarted, category, difficulty, limit]);

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

  const handleRestart = () => {
    setSelectAnswer(null);
    setCurrentQuestionIndex(0);
    setScore(0);
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
      {!gameStarted ? (
        <div>
          <h1>Quiz Setup</h1>

          <label>Category:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Any</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <label>Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Any</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <label>Number of Questions:</label>
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>

          <button onClick={() => setGameStarted(true)}>Start Quiz</button>
        </div>
      ) : (
        <>
          <h1>Quiz App</h1>
          <p>
            Score: {score} / {questions.length}
          </p>
          <button onClick={handleRestart}>🔄 Restart Quiz</button>
          {currentQuestion && (
            <div>
              <h2
                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
              />
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
                    <button onClick={handleNextQuestion}>
                      Next Question →
                    </button>
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
      )}
    </>
  );
}

export default App;
