import { useEffect, useRef } from "react";

interface QuizCompleteProps {
  correct: number;
  questionsCount: number;
  review: { question: string; correctAnswer: string; selectedAnswer: string }[];
  onRetryMissed: () => void;
  onChangeSettings: () => void;
  onPlayAgain: () => void;
}

const QuizComplete: React.FC<QuizCompleteProps> = ({
  correct, questionsCount, review, onRetryMissed, onChangeSettings, onPlayAgain,
}) => {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, []);
  const missedCount = review.filter((item) => item.selectedAnswer !== item.correctAnswer).length;

  return (
    <div className="quiz-complete">
      <h2 ref={heading} tabIndex={-1}>🎉 Quiz Complete!</h2>
      <p>Final Score: {correct} / {questionsCount}</p>
      <div className="results-actions">
        {missedCount > 0 && (
          <button onClick={onRetryMissed}>Retry missed questions ({missedCount})</button>
        )}
        <button onClick={onPlayAgain}>Play again</button>
        <button onClick={onChangeSettings}>Change settings</button>
      </div>
      <section className="answer-review" aria-labelledby="review-heading">
        <h3 id="review-heading">Your answer review</h3>
        <ol>
          {review.map((item, index) => {
            const isCorrect = item.selectedAnswer === item.correctAnswer;
            return (
              <li key={index} className={isCorrect ? "review-correct" : "review-incorrect"}>
                <h4>{index + 1}. {item.question}</h4>
                <p className="review-status">{isCorrect ? "Correct" : "Incorrect"}</p>
                <p><strong>Your answer:</strong> {item.selectedAnswer}</p>
                {!isCorrect && <p><strong>Correct answer:</strong> {item.correctAnswer}</p>}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
};

export default QuizComplete;
