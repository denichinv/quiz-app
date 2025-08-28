interface QuizCompleteProps {
  correct: number;
  questionsCount: number;
  onRestart: () => void;
}

const QuizComplete: React.FC<QuizCompleteProps> = ({
  correct,
  questionsCount,
  onRestart,
}) => {
  return (
    <div className="quiz-complete">
      <h2>🎉 Quiz Complete!</h2>
      <p>
        Final Score: {correct} / {questionsCount}
      </p>
      <button onClick={onRestart}>🔄 Restart Quiz</button>
    </div>
  );
};

export default QuizComplete;
