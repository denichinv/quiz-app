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
  <div className="setup-container">
    <h1>Quiz Setup</h1>

    <div className="setup-field">
      <label htmlFor="category-select">Category:</label>
      <select
        id="category-select"
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
    </div>

    <div className="setup-field">
      <label htmlFor="difficulty-select">Difficulty:</label>
      <select
        id="difficulty-select"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">Any</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
    </div>

    <div className="setup-field">
      <label htmlFor="limit-select">Number of Questions:</label>
      <select
        id="limit-select"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
      </select>
    </div>

    <button onClick={onStart} className="setup-button">
      Start Quiz
    </button>
  </div>
);

export default QuizSetup;
