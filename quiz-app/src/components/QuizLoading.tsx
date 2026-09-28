const QuizLoading = () => {
  return (
    <div className="loading-screen" role="status">
      <span className="loading-spinner" aria-hidden="true" />
      <p className="loading-title">Loading questions...</p>
      <p className="loading-description">Preparing your practice session.</p>
    </div>
  );
};

export default QuizLoading;
