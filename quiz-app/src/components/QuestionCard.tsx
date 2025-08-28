interface QuestionCardProps {
  question: string;
  answers: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  onAnswerClick: (answer: string) => void;
  onNextQuestion: () => void;
  onRestartQuestion: () => void;
  isLastQuestion: boolean;
  score: number;
  total: number;
}

const getAnswerClass = (
  answer: string,
  correct: string,
  selected: string | null
) => {
  if (!selected) return "";
  if (answer !== selected) return "";
  return answer === correct ? "correct" : "incorrect";
};

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  correctAnswer,
  selectedAnswer,
  onAnswerClick,
  onNextQuestion,
  onRestartQuestion,
  isLastQuestion,
  score,
  total,
}) => (
  <div className="quiz-container">
    <p className="score">
      Score: {score} / {total}
    </p>
    <h2 className="quiz-question">{question}</h2>
    <div className="quiz-answers">
      {answers.map((answer, i) => (
        <button
          key={i}
          onClick={() => onAnswerClick(answer)}
          disabled={!!selectedAnswer}
          className={`quiz-button ${getAnswerClass(
            answer,
            correctAnswer,
            selectedAnswer
          )}`}
        >
          {answer}
        </button>
      ))}
    </div>

    {selectedAnswer && (
      <>
        <div className="feedback">
          <p>
            {selectedAnswer === correctAnswer
              ? "✅ Correct!"
              : `❌ Incorrect. Correct answer: ${correctAnswer}`}
          </p>
        </div>

        <button onClick={onRestartQuestion}>Restart Quiz</button>

        <button onClick={onNextQuestion}>
          {isLastQuestion ? "Finish Quiz" : "Next Question →"}
        </button>
      </>
    )}
  </div>
);

export default QuestionCard;
