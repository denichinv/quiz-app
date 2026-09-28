---
version: alpha
name: DevQuiz
description: Developer practice quizzes with readable cards over a topographic background.
colors:
  primary: '#2457d6'
  accent: '#2457d6'
  text: '#182c46'
  success: '#4caf50'
  error: '#f44336'
typography:
  sans:
    fontFamily: 'system-ui, -apple-system, sans-serif'
rounded:
  sm: '4px'
  md: '8px'
spacing:
  small: '0.5rem'
  medium: '1rem'
  large: '2rem'
components:
  button: {}
  card: {}
---

# DevQuiz design context

## Overview

A product interface for developers practicing technical questions, based on the repository README and existing setup/question screens. English UI; no specific geographic market is established. Retain the topographic background, translucent cards, and blue actions. Prioritize reading technical answers over decorative additions.

Runtime ownership: `quiz-app/src/styles/_variables.scss` is the canonical token source. This document mirrors its values; `_mixins.scss` consumes them and component SCSS supplies layout. No generated theme or separate UI library exists.

## Colors

Blue identifies actions and focus. Green and red identify correctness alongside explicit text labels, never alone. Existing translucent light surfaces separate content from the background. No dark theme is currently implemented.

## Typography

Use the existing system font, 1rem body size, and 1.5 line height from `_base.scss`. Preserve answer whitespace and wrap long technical strings in results.

## Layout

Setup uses a 1160px workspace with introduction and settings columns, stacked below 700px; questions and results use 800px. Results have phone gutters and natural document scrolling. Answer review is an ordered list matching quiz order, with actions above it.

## Elevation & Depth

Reuse card shadows and light backgrounds from the shared card mixin. Review entries use quiet backgrounds and a semantic left border.

## Shapes

Reuse small radii for review entries and medium radii for the result card. No new shape system.

## Components

QuizComplete owns results and answer review; QuestionCard owns active questions. App owns answer history and retry state. Retry missed questions starts a fresh score using only missed questions from the latest round, without network requests. Back to setup is always available on questions. Change settings returns from results to setup. Play again fetches a fresh quiz with the original settings, including the original question count after a missed-question round. Native buttons retain shared hover, disabled, and focus styles. QuizSetup owns native selects; platform popup behavior is accepted. Results focus the completion heading on entry; each question focuses its heading on entry. Answer feedback appears as correct/incorrect text labels on revealed options; there is no separate feedback paragraph or live status region for answers. All review rows render because quizzes are bounded by setup counts.

## Do's and Don'ts

- Preserve existing visual identity and canonical Sass tokens.
- Pair correctness colors with readable labels.
- Keep long answers readable on phones.
- Do not imply explanations are available; the API data currently contains answers only.
- Do not fetch new questions for a missed-question retry.

### Canonical UI Map

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Select/Listbox | QuizSetup native select | Existing QuizSetup and this document | native | QuizSetup tests and home E2E |

## September redesign: developer practice workspace

The user requested an explained redesign. Preserve the topographic signature beneath a pale blue wash; opaque light cards make technical content readable. Setup uses an oversized Avenir Next/Segoe UI headline, system body typography, and SFMono-Regular/Consolas utility labels. The Choose → Practice → Review sequence describes the real quiz journey. No added dependencies or remote font requests.

Canonical Sass roles: primary/accent #2457d6, text #182c46, secondary #52647a, page #edf3fa, border #d5dfed. `_variables.scss` owns values, `_base.scss` and component styles consume them, and this document mirrors intent. Global scrollbar colors use thumb #8394ab, hover #52647a, active #2457d6, and page-colored track, with system forced-colors fallback. Reduced motion disables animation and transitions globally. Native selects retain platform-owned popup behavior. Setup summary is derived from existing props, with a polite live announcement. Quiz logic and retry semantics remain unchanged.

| Capability | Canonical owner | Source of truth | Allowed variants | Verification |
|---|---|---|---|---|
| Scrollbar | `_base.scss` | Sass roles in `_variables.scss` | global, forced-colors | browser computed styles |
