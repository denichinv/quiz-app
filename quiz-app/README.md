# DevQuiz 🎯

A developer-focused quiz app built with **React**, **TypeScript**, **Vite**, and **SASS**.  
Choose your category, set the difficulty, and test your knowledge with random multiple-choice questions powered by the [QuizAPI.io](https://quizapi.io/).

🔗 **Live Demo**: [dev-quiz-v.netlify.app](https://dev-quiz-v.netlify.app)

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

---

## 🚧 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Create a .env file with your API key
touch .env
```

```
VITE_REACT_APP_QUIZ_API_KEY=your_api_key_here
```

```bash
# 3. Start development server
npm run dev
```

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
├── styles/           # SCSS partials and main.scss
├── types/            # TypeScript types
├── utils/            # Helper functions (e.g., fetchQuiz)
├── App.tsx           # Root component
└── main.tsx          # Entry point
```

---

## 👨‍💻 Author

Made with 💻 by **Vilizar Denichin**  
[🔗 Portfolio](https://vilizardenichin.netlify.app) | [GitHub](https://github.com/denichinv) | [LinkedIn](https://linkedin.com/in/vilizar-denichin)
