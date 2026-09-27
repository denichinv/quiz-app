import { QUIZ_DIFFICULTIES, QUIZ_LIMITS } from "../constants/quizOptions";

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
  <main className="setup-workspace">
    <header className="setup-brand"><span aria-hidden="true">{ "</>" }</span> DevQuiz</header>
    <div className="setup-layout">
      <section className="setup-intro" aria-labelledby="intro-heading">
        <p className="setup-eyebrow">A little practice. A sharper mind.</p>
        <h1 id="intro-heading">Keep your<br />developer edge.</h1>
        <p>Choose a topic, test what you know, and turn missed answers into your next breakthrough.</p>
        <div className="practice-loop" aria-label="Practice process">
          <span>Choose</span><span aria-hidden="true">→</span><span>Practice</span><span aria-hidden="true">→</span><span>Review</span>
        </div>
        <p className="setup-note">Instant feedback. Answer review. Another shot at the questions you missed.</p>
      </section>
      <section className="setup-container setup-panel" aria-labelledby="setup-heading">
        <p className="setup-eyebrow">Your next practice session</p>
        <h2 id="setup-heading">Quiz Setup</h2>
        <p className="setup-description">Make it your kind of challenge.</p>

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
            {QUIZ_DIFFICULTIES.map((level) => (
              <option key={level} value={level}>
                {level[0].toUpperCase() + level.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="setup-field">
          <label htmlFor="limit-select">Number of Questions:</label>
          <select
            id="limit-select"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
          >
            {QUIZ_LIMITS.map((count) => (
              <option key={count} value={count}>{count}</option>
            ))}
          </select>
        </div>

        <p className="setup-summary" aria-live="polite">
          {limit} questions · {difficulty ? `${difficulty[0].toUpperCase()}${difficulty.slice(1)}` : "Any difficulty"} · {category || "All topics"}
        </p>
        <button onClick={onStart} className="setup-button">
          Start Quiz
        </button>
      </section>
    </div>
    <footer className="setup-footer">Built for curious developers.</footer>
  </main>
);

export default QuizSetup;
