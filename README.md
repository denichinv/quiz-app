# DevQuiz 🎯

A developer-focused quiz app built with **React**, **TypeScript**, **Vite**, and **SASS**.  
Choose your category, set the difficulty, and test your knowledge with random multiple-choice questions powered by the [QuizAPI.io](https://quizapi.io/).

🔗 **Live Demo**: [dev-quiz-v.netlify.app](https://dev-quiz-v.netlify.app)

![Coverage](https://img.shields.io/badge/coverage-90.12%25-brightgreen?logo=vitest)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen?logo=vitest)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)
![React](https://img.shields.io/badge/React-18-blue?logo=react)

---

## 🧠 Features

- 🎮 Custom quizzes (category, difficulty, question count)
- ✅ Instant feedback on answer selection
- 🧾 Score tracking and final results screen
- 🔁 Restart quiz functionality
- 🎨 Modular styling with SCSS (SASS)

---

## 📦 Tech Stack

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 SASS (SCSS Modules)
- 🔌 QuizAPI.io (external quiz data)
- ☁️ Netlify (deployment)
- 🧪 Vitest + React Testing Library
- 🧪 Playwright (End-to-End testing)

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Create environment file
touch .env
```

```env
VITE_REACT_APP_QUIZ_API_KEY=your_api_key_here
```

```bash
# Start development server
npm run dev
```

---

## 🧪 Testing

This project includes both **unit/integration tests** and **end-to-end (E2E) tests**.

### Unit & Integration Tests

Written using **Vitest** and **React Testing Library**.

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Watch mode
npm run test -- --watch
```

**Coverage highlights:**

- Components: 100%
- Utilities: 100%
- Integration (App state & user flows)
- Overall coverage: ~90%

---

### End-to-End (E2E) Tests

E2E tests are written with **Playwright** and run against the **deployed Netlify application**.

They validate the main user journeys:

- App loads successfully
- Quiz can be started
- Questions and answers render
- Quiz can be completed
- Results screen is displayed
- Quiz can be restarted

```bash
# Run E2E tests
npx playwright test

# Run with a single worker (recommended to reduce API rate limits)
npx playwright test --workers=1

# Open Playwright HTML report
npx playwright show-report
```

#### ⚠️ Note on API limits

E2E tests rely on a third-party quiz API.  
If tests are run repeatedly, occasional **HTTP 429 (rate limit)** responses may occur.  
In such cases, re-running later or using `--workers=1` is recommended.

---

## 🔐 Environment Variables

| Key                           | Description        |
| ----------------------------- | ------------------ |
| `VITE_REACT_APP_QUIZ_API_KEY` | QuizAPI.io API key |

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── *.test.tsx
├── styles/
├── types/
├── utils/
│   ├── *.test.ts
├── App.tsx
├── App.test.tsx
└── main.tsx
```

```
e2e/
├── quiz-app-home.spec.ts
├── quiz-app-quiz.spec.ts
└── quiz-app-results.spec.ts
```

---

## 👨‍💻 Author

**Vilizar Denichin**  
Frontend Developer (React & TypeScript)

🔗 Portfolio: https://vilizardenichin.netlify.app  
🔗 GitHub: https://github.com/denichinv  
🔗 LinkedIn: https://linkedin.com/in/vilizar-denichin
