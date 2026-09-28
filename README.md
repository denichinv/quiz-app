# DevQuiz 🎯

A developer-focused quiz app built with **React**, **TypeScript**, **Vite**, and **SASS**.  
Choose a developer-focused category, set the difficulty, and test your knowledge with random multiple-choice questions powered by [QuizAPI.io](https://quizapi.io/).

🔗 **Live Demo**: [dev-quiz-v.netlify.app](https://dev-quiz-v.netlify.app)

![Tests](https://img.shields.io/badge/tests-passing-brightgreen?logo=vitest)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![React](https://img.shields.io/badge/React-19-blue?logo=react)

---

## 🧠 Features

- 🎮 Custom quizzes by category, difficulty, and question count
- ✅ Correct and incorrect answers identified directly on the answer options
- 🧾 Score tracking, answer review, and a link back to results after reviewing
- 🔁 Retry missed questions without fetching again, or play a fresh quiz
- ⏳ Loading card with a spinner and reduced-motion support
- ⚠️ Empty-state handling when no questions are returned
- 🔐 Server-side QuizAPI proxy using Netlify Functions
- 🎨 Modular styling with SCSS/SASS

---

## 📦 Tech Stack

- ⚛️ React + TypeScript
- ⚡ Vite
- 🎨 SASS / SCSS
- 🔌 QuizAPI.io
- ☁️ Netlify + Netlify Functions
- 🧪 Vitest + React Testing Library
- 🎭 Playwright for end-to-end testing

---

## 🚀 Getting Started

This repository uses a nested app structure:

```txt
repo-root/
├── netlify.toml
└── quiz-app/
    ├── src/
    ├── netlify/functions/
    └── package.json
```

Install dependencies from the app directory:

```bash
cd quiz-app
npm install
```

Create a local environment file:

```bash
touch .env
```

Add your QuizAPI key:

```env
QUIZ_API_KEY=your_api_key_here
```

The API key is used only by the Netlify Function. It is not exposed to the browser.

For normal frontend development:

```bash
npm run dev
```

For local development with the Netlify Function proxy, run Netlify Dev from the repository root:

```bash
cd ..
npx netlify dev
```

---

## 🔐 API Proxy

The frontend does not call QuizAPI directly.

Instead, the app calls:

```txt
/.netlify/functions/questions
```

The Netlify Function then:

- reads `QUIZ_API_KEY` from the server environment
- calls QuizAPI securely
- normalizes the QuizAPI response
- returns a stable question format to the React app

This keeps the API key server-side and prevents exposing it in browser requests.

---

## 🧪 Testing

This project includes both **unit/integration tests** and **end-to-end tests**.

### Unit & Integration Tests

Written using **Vitest** and **React Testing Library**.

```bash
npm run test
```

Run with coverage:

```bash
npm run test -- --coverage
```

Run once without watch mode:

```bash
npm run test -- --run
```

Run the coverage command above to generate current coverage results.

---

### End-to-End Tests

E2E tests are written with **Playwright**.

The tests run against a local Vite dev server and mock the Netlify Function response. This keeps the tests fast, stable, and independent from third-party API limits.

They validate the main user journeys:

- App loads successfully
- Quiz can be started
- Questions and answers render
- Answer options display correctness labels
- Quiz can be completed
- Results screen is displayed

```bash
npx playwright install chromium
npx playwright test
```

Open the Playwright HTML report:

```bash
npx playwright show-report
```

---

## 🔐 Environment Variables

| Key            | Used by          | Description                    |
| -------------- | ---------------- | ------------------------------ |
| `QUIZ_API_KEY` | Netlify Function | Server-side QuizAPI.io API key |

Do not prefix this key with `VITE_`.

`VITE_` environment variables are exposed to the browser by Vite, so they are not appropriate for private API secrets.

---

## 📁 Folder Structure

```txt
quiz-app/
├── e2e/
│   ├── mocks/
│   ├── quiz-app-home.spec.ts
│   ├── quiz-app-quiz.spec.ts
│   └── quiz-app-results.spec.ts
├── netlify/
│   └── functions/
│       └── questions.ts
├── src/
│   ├── components/
│   │   ├── *.test.tsx
│   ├── styles/
│   ├── types/
│   ├── utils/
│   │   ├── *.test.ts
│   ├── App.tsx
│   ├── App.test.tsx
│   └── main.tsx
```

---

## 👨‍💻 Author

**Vilizar Denichin**  
Frontend Developer (React & TypeScript)

🔗 Portfolio: https://vilizar.dev
🔗 GitHub: https://github.com/denichinv  
🔗 LinkedIn: https://linkedin.com/in/vilizar-denichin
