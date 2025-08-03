interface QuestionCardProps {
  question: string;
  answers: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  onAnswerClick: (answer: string) => void;
  onNextQuestion: () => void;
  isLastQuestion: boolean;
  score: number;
  total: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answers,
  correctAnswer,
  selectedAnswer,
  onAnswerClick,
  onNextQuestion,
  isLastQuestion,
  score,
  total,
}) => (
  <div>
    <p>
      Score: {score} / {total}
    </p>
    <h2>{question}</h2>

    {answers.map((answer, i) => (
      <button
        key={i}
        onClick={() => onAnswerClick(answer)}
        disabled={!!selectedAnswer}
      >
        {answer}
      </button>
    ))}

    {selectedAnswer && (
      <>
        <p>
          {selectedAnswer === correctAnswer
            ? "✅ Correct!"
            : `❌ Incorrect. Correct answer: ${correctAnswer}`}
        </p>

        <button onClick={onNextQuestion}>
          {isLastQuestion ? "Finish Quiz" : "Next Question →"}
        </button>
      </>
    )}
  </div>
);

export default QuestionCard;
