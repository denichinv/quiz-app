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

- 🎮 Custom quizzes: select category, difficulty & number of questions  
- ✅ Instant feedback on answer selection  
- 🧾 Score tracking & summary at the end  
- 🎨 Modular SCSS styling using SASS  

---

## 📦 Tech Stack

- ⚛️ React + TypeScript  
- ⚡ Vite  
- 🎨 SASS (SCSS Modules)  
- 🔌 [QuizAPI.io](https://quizapi.io/)  
- ☁️ Netlify for deployment  
- 🧪 Vitest + React Testing Library

---

## 🚧 Getting Started
```bash
# 1. Install dependencies
npm install

# 2. Create a .env file with your API key
touch .env
```
```env
VITE_REACT_APP_QUIZ_API_KEY=your_api_key_here
```
```bash
# 3. Start development server
npm run dev
```

---

## 🧪 Testing

This project includes comprehensive tests with **90%+ code coverage**.
```bash
# Run all tests
npm run test

# Run tests with coverage report
npm run test -- --coverage

# Run tests in watch mode
npm run test -- --watch
```

### Test Coverage
- ✅ **Components**: 100% coverage (QuizSetup, QuestionCard, QuizComplete, QuizLoading)
- ✅ **Utilities**: 100% coverage (fetchQuiz, shuffleArray)
- ✅ **Integration**: App.tsx with state management and user flows
- 📊 **Overall**: 90.12% statements, 87.5% branches

---

## 🔐 Environment Variables

| Key                           | Description                     |
|------------------------------|---------------------------------|
| `VITE_REACT_APP_QUIZ_API_KEY` | Your QuizAPI.io API key         |

---

## 📁 Folder Structure
```
src/
├── components/       # Reusable UI components
│   ├── *.test.tsx    # Component tests
├── styles/           # SCSS partials and main.scss
├── types/            # TypeScript types
├── utils/            # Helper functions
│   ├── *.test.ts     # Utility tests
├── App.tsx           # Root component
├── App.test.tsx      # Integration tests
└── main.tsx          # Entry point
```

---

## 👨‍💻 Author

Made with 💻 by **Vilizar Denichin**  
[🔗 Portfolio](https://vilizardenichin.netlify.app) | [GitHub](https://github.com/denichinv) | [LinkedIn](https://linkedin.com/in/vilizar-denichin)
