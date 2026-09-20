---
version: alpha
name: DevQuiz
description: Developer practice quizzes with readable cards over a topographic background.
colors:
  primary: '#007bff'
  accent: '#0066ff'
  text: '#333333'
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

Setup uses the existing 500px maximum; questions and results use 800px. Results have phone gutters and natural document scrolling. Answer review is an ordered list matching quiz order, with actions above it.

## Elevation & Depth

Reuse card shadows and light backgrounds from the shared card mixin. Review entries use quiet backgrounds and a semantic left border.

## Shapes

Reuse small radii for review entries and medium radii for the result card. No new shape system.

## Components

QuizComplete owns results and answer review; QuestionCard owns active questions. App owns answer history and retry state. Retry missed questions starts a fresh score using only missed questions from the latest round, without network requests. Restart Quiz returns to setup. Native buttons retain shared hover, disabled, and focus styles. QuizSetup owns native selects; platform popup behavior is accepted. Results focus the completion heading on entry. All review rows render because quizzes are bounded by setup counts.

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
