# DevQuiz

A developer-focused quiz app built with React, TypeScript, Vite, and Sass. Choose a topic and difficulty, practice with multiple-choice questions, and review the answers you missed.

[Live demo](https://dev-quiz-v.netlify.app)

## Features

- Choose a developer topic, difficulty, and 5, 10, 15, or 20 questions.
- Follow your score and question position with a progress bar.
- Get immediate feedback, with labels and colors identifying correct and incorrect answers.
- Review each question and your answer after finishing.
- Retry missed questions from the latest round without another API request.
- Play again with the original settings or return to setup to change them.
- Recover from connection errors, service failures, and timeouts using Retry.
- Use a responsive practice workspace with keyboard focus management, live answer feedback, and reduced-motion support.

The quiz supports single-answer questions. Unsupported or ambiguous questions are filtered out, so a round may contain fewer questions than requested. Progress indicates the current question position; it reaches 100% when the final question appears.

## Tech stack

- React 19 and TypeScript 5.8
- Vite 7
- Sass with shared variables, mixins, and global SCSS partials
- QuizAPI through a server-side Netlify Function
- Vitest and React Testing Library
- Playwright for browser tests

See [package.json](quiz-app/package.json) and [package-lock.json](quiz-app/package-lock.json) for dependency versions.

## Local development

Install dependencies from the app directory:

```bash
cd quiz-app
npm ci
```

For frontend-only development:

```bash
npm run dev
```

Vite alone does not serve the Netlify Function. To load real questions, run Netlify Dev from the repository root with `QUIZ_API_KEY` set in the same terminal environment:

```bash
# From the quiz-app directory, return to the repository root:
cd ..
export QUIZ_API_KEY=your_api_key_here
npx netlify dev
```

Open the local URL printed by Netlify Dev. This runs the app locally; it does not deploy it. Loading real questions makes requests to QuizAPI.

For hosting, configure `QUIZ_API_KEY` in the Netlify site's environment. Keep the key server-side, do not commit it, and do not give it a `VITE_` prefix. Vite-prefixed variables are exposed to the browser.

## Quiz actions

| Action | Behavior |
| --- | --- |
| Back to setup | Leaves the active round and keeps the selected settings. |
| Retry | Retries a failed request using the same settings. |
| Retry missed questions | Starts a fresh score using only questions missed in the latest round. No new questions are fetched. |
| Play again | Fetches a fresh quiz using the original category, difficulty, and requested count. |
| Change settings | Returns from results to setup. |

Quiz progress and answer history are held in memory; refreshing the page resets the session.

## API proxy

The frontend requests `GET /.netlify/functions/questions`. The function:

1. Validates the category, difficulty, and question count against the options shared with the setup screen.
2. Reads `QUIZ_API_KEY` from the server environment and calls QuizAPI.
3. Checks the response structure and normalizes it for the frontend.
4. Returns controlled errors without exposing upstream error details.

The server aborts upstream requests after 10 seconds. The browser has a separate 15-second request deadline, covering response-body reading, and cancels requests that are no longer needed. Timeout errors offer Retry.

The frontend validates each normalized question, requiring at least two distinct, nonempty answers and exactly one correct answer. Empty results, unsupported questions, connection failures, rate limits, and invalid responses have separate messages.

## Testing and checks

Run these commands from `quiz-app/`:

```bash
# Unit, component, integration, and server-function tests
npm run test -- --run

# Generate current coverage figures
npm run test -- --run --coverage

# Static analysis
npm run lint

# TypeScript checks and production build
npm run build
```

Vitest includes tests under `src/` and `netlify/tests/`. Server tests mock QuizAPI and cover input validation, response normalization, malformed data, failures, and timeouts. They do not require an API key or make real QuizAPI calls.

To run browser tests:

```bash
# Install Chromium once after dependency installation
npx playwright install chromium
npx playwright test

# Open the HTML report
npx playwright show-report
```

Playwright starts a local Vite server and mocks the function response. Tests cover setup, answers, completion, review, missed-question retries, replay, keyboard navigation, phone/desktop layouts, and timeout recovery. Browser tests do not make real QuizAPI calls.

Coverage is generated from the current checkout rather than represented by a fixed percentage badge.

## Project structure

```text
.
├── README.md
├── netlify.toml
├── .github/workflows/          # Test and browser-test workflows
└── quiz-app/
    ├── package.json
    ├── e2e/                   # Playwright tests and mock questions
    ├── netlify/
    │   ├── functions/         # QuizAPI proxy
    │   └── tests/             # Server-function tests
    ├── public/
    └── src/
        ├── assets/
        ├── components/        # Setup, question, loading, and results screens
        ├── constants/         # Shared categories, difficulties, and counts
        ├── styles/            # Global SCSS partials
        ├── types/
        ├── utils/             # Fetching, question validation, and shuffling
        ├── App.tsx            # Quiz state and transitions
        └── main.tsx
```

## Netlify configuration

The root `netlify.toml` defines:

- Base directory: `quiz-app`
- Build command: `npm run build`
- Publish directory: `dist`, relative to the base directory
- Functions directory: `netlify/functions`, relative to the base directory
- A fallback rewrite to `index.html`

## Author

**Vilizar Denichin** — Frontend Developer (React & TypeScript)

[Portfolio](https://vilizar.dev) · [GitHub](https://github.com/denichinv) · [LinkedIn](https://linkedin.com/in/vilizar-denichin)
