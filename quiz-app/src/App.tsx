import React, { useEffect, useState } from "react";
import { fetchQuizQuestions } from "./utils/fetchQuiz";
import { QuizQuestionWithAnswers } from "./types/Quiz";
import QuizSetup from "./components/QuizSetup";
import QuestionCard from "./components/QuestionCard";

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
    setQuestions([]);
    setGameStarted(false);
  };

  return (
    <>
      {!gameStarted ? (
        <QuizSetup
          category={category}
          setCategory={setCategory}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          limit={limit}
          setLimit={setLimit}
          categories={categories}
          onStart={() => setGameStarted(true)}
        />
      ) : currentQuestionIndex < questions.length ? (
        <QuestionCard
          question={currentQuestion.question}
          answers={currentQuestion.answers}
          correctAnswer={currentQuestion.correct_answer}
          selectedAnswer={selectAnswer}
          onAnswerClick={handleAnswerClick}
          onNextQuestion={handleNextQuestion}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          score={score}
          total={questions.length}
        />
      ) : (
        // Final Results Screen
        <div>
          <h2>🎉 Quiz Complete!</h2>
          <p>
            Final Score: {score} / {questions.length}
          </p>
          <button onClick={handleRestart}>🔄 Restart Quiz</button>
        </div>
      )}
    </>
  );
}

export default App;
