import { useEffect, useRef } from "react";

interface QuestionCardProps {
  question: string;
  answers: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  onAnswerClick: (answer: string) => void;
  onNextQuestion: () => void;
  onBackToSetup: () => void;
  isLastQuestion: boolean;
  currentQuestionIndex: number;
  score: number;
  total: number;
}

const getAnswerClass = (
  answer: string,
  correct: string,
  selected: string | null,
) => {
  if (selected === null) return "";
  if (answer === correct) return "correct";
  return answer === selected ? "incorrect" : "";
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  correctAnswer,
  selectedAnswer,
  onAnswerClick,
  onNextQuestion,
  onBackToSetup,
  isLastQuestion,
  currentQuestionIndex,
  score,
  total,
}) => {
  const questionHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    questionHeading.current?.focus();
  }, [currentQuestionIndex]);

  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / total) * 100,
  );

  return (
    <div className="quiz-container">
      <p className="score">
        Score: {score} / {total}
      </p>
      <div
        className="question-progress-wrapper"
        aria-label="Quiz progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progressPercent}
      >
        <div className="question-progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>
      <p className="question-progress" aria-live="polite">
        Question {currentQuestionIndex + 1} of {total}
      </p>
      <h2 ref={questionHeading} tabIndex={-1} className="quiz-question" data-testid="quiz-question">
        {question}
      </h2>
      <div className="quiz-answers">
        {answers.map((answer, i) => (
          <button
            key={i}
            data-testid={`answer-${i}`}
            onClick={() => onAnswerClick(answer)}
            disabled={selectedAnswer !== null}
            className={`quiz-button ${getAnswerClass(
              answer,
              correctAnswer,
              selectedAnswer,
            )}`}
          >
            {answer}
            {selectedAnswer !== null && answer === correctAnswer && (
              <span className="answer-label">Correct answer</span>
            )}
            {selectedAnswer === answer && answer !== correctAnswer && (
              <span className="answer-label">Your answer · Incorrect</span>
            )}
          </button>
        ))}
      </div>

      <p className="answer-feedback" role="status">
        {selectedAnswer !== null && (selectedAnswer === correctAnswer
          ? "✅ Correct!"
          : `❌ Incorrect. Correct answer: ${correctAnswer}`)}
      </p>
      <div className="quiz-navigation">
        <button onClick={onBackToSetup}>Back to setup</button>
        {selectedAnswer !== null && (
          <button onClick={onNextQuestion}>
            {isLastQuestion ? "Finish Quiz" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionCard;
