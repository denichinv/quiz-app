interface QuizSetupProps {
  category: string;
  setCategory: (value: string) => void;
  difficulty: string;
  setDifficulty: (value: string) => void;
  limit: number;
  setLimit: (value: number) => void;
  categories: string[];
  onStart: () => void;
}

const QuizSetup: React.FC<QuizSetupProps> = ({
  category,
  setCategory,
  difficulty,
  setDifficulty,
  limit,
  setLimit,
  categories,
  onStart,
}) => (
  <div>
    <h1>Quiz Setup</h1>

    <label>Category:</label>
    <select value={category} onChange={(e) => setCategory(e.target.value)}>
      <option value="">Any</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>

    <label>Difficulty:</label>
    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
      <option value="">Any</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>

    <label>Number of Questions:</label>
    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={15}>15</option>
      <option value={20}>20</option>
    </select>

    <button onClick={onStart}>Start Quiz</button>
  </div>
);

export default QuizSetup;
