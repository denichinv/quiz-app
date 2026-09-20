import { useEffect, useState } from "react";
import { fetchQuizQuestions } from "./utils/fetchQuiz";
import { QuizQuestionWithAnswers } from "./types/Quiz";
import QuizSetup from "./components/QuizSetup";
import QuestionCard from "./components/QuestionCard";
import QuizLoading from "./components/QuizLoading";
import QuizComplete from "./components/QuizComplete";

function App() {
  const [questions, setQuestions] = useState<QuizQuestionWithAnswers[]>([]);
  const [selectAnswer, setSelectAnswer] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answerHistory, setAnswerHistory] = useState<string[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [limit, setLimit] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [requestAttempt, setRequestAttempt] = useState(0);

  const currentQuestion = questions[currentQuestionIndex];

  const categories = [
    "JavaScript",
    "TypeScript",
    "React",
    "CSS/HTML",
    "SQL",
    "Database",
    "Git",
    "GitHub Actions",
    "Docker",
    "Kubernetes",
    "AWS",
    "DevOps",
    "Cybersecurity",
    "Web Security",
    "Algorithms",
    "Regular Expressions",
    "Python",
  ];

  useEffect(() => {
    if (!gameStarted) return;
    let isCancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectAnswer(null);

      setQuestions([]);
      setAnswerHistory([]);
      try {
        const fetchedQuestions = await fetchQuizQuestions(category, difficulty, limit);
        if (isCancelled) return;
        setQuestions(fetchedQuestions);
        if (fetchedQuestions.length === 0) {
          setError("No questions found for this selection. Try another category or choose Any.");
        }
      } catch (requestError) {
        if (isCancelled) return;
        setError(requestError instanceof Error
          ? requestError.message
          : "Could not load questions. Please try again.");
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isCancelled = true;
    };
  }, [gameStarted, category, difficulty, limit, requestAttempt]);

  const handleAnswerClick = (answer: string) => {
    if (selectAnswer !== null || !currentQuestion) return;
    setAnswerHistory((previous) => [...previous, answer]);
    setSelectAnswer(answer);

    if (answer === currentQuestion.correct_answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectAnswer(null);
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleBackToSetup = () => {
    setSelectAnswer(null);
    setCurrentQuestionIndex(0);
    setScore(0);
    setQuestions([]);
    setError(null);
    setAnswerHistory([]);
    setGameStarted(false);
  };

  const handleRetryMissed = () => {
    const missed = questions.filter((question, index) =>
      answerHistory[index] !== question.correct_answer);
    if (missed.length === 0) return;
    setQuestions(missed);
    setAnswerHistory([]);
    setSelectAnswer(null);
    setCurrentQuestionIndex(0);
    setScore(0);
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
      ) : loading ? (
        <QuizLoading />
      ) : error ? (
        <div className="setup-container">
          <h1>Could not load quiz</h1>
          <p role="alert">{error}</p>
          <button onClick={() => setRequestAttempt((attempt) => attempt + 1)} className="setup-button">
            Retry
          </button>
          <button onClick={handleBackToSetup} className="setup-button">
            Back to setup
          </button>
        </div>
      ) : currentQuestionIndex < questions.length ? (
        <QuestionCard
          question={currentQuestion.question}
          answers={currentQuestion.answers}
          correctAnswer={currentQuestion.correct_answer}
          selectedAnswer={selectAnswer}
          onAnswerClick={handleAnswerClick}
          onNextQuestion={handleNextQuestion}
          onBackToSetup={handleBackToSetup}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          currentQuestionIndex={currentQuestionIndex}
          score={score}
          total={questions.length}
        />
      ) : (
        <QuizComplete
          correct={score}
          questionsCount={questions.length}
          review={questions.map((question, index) => ({
            question: question.question,
            correctAnswer: question.correct_answer,
            selectedAnswer: answerHistory[index],
          }))}
          onRetryMissed={handleRetryMissed}
          onChangeSettings={handleBackToSetup}
          onPlayAgain={() => setRequestAttempt((attempt) => attempt + 1)}
        />
      )}
    </>
  );
}

export default App;
