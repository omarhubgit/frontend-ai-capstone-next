# AI Development Prompts

This file documents the main AI-assisted prompts used while developing the Frontend AI Engineering capstone project.

## 1. Project Planning

I asked AI to help plan a portfolio-quality AI-enhanced frontend application using Next.js, React, TypeScript, Tailwind CSS, and the Vercel AI SDK. The goal was to build a professional portfolio application with an AI career assistant.

## 2. AI Chat Interface

I asked AI for guidance on building a chat interface that supports streaming AI responses, loading states, error handling, retry functionality, stopping an active response, and a user-friendly empty state.

## 3. Server-Side Tool

I asked AI how to implement a server-side `get_project_details` tool using the Vercel AI SDK and Zod.

The tool needed to:

* Accept a project name as input.
* Return structured project information.
* Include the project name, description, technologies, and features.
* Be called by the AI through the server-side chat route.

## 4. Generative UI

I asked AI how to render the server-side tool lifecycle in the frontend.

The UI was designed to display:

* Tool input streaming.
* Tool input availability.
* The project lookup.
* The structured project result as a real project card.
* Tool errors.

## 5. Accessibility

I asked AI to review the chat interface for accessibility improvements, including:

* Accessible labels.
* Keyboard interaction.
* Appropriate button semantics.
* Focus states.
* Accessible error messages.
* Screen-reader-friendly content.

## 6. Testing

I asked AI for help creating and improving tests for the chat interface.

The tests covered:

* Empty chat state.
* User and AI messages.
* Thinking state.
* Tool input state.
* Tool output.
* Tool errors.
* Retry behavior.
* User message submission.
* Example questions.
* Stop button behavior.

## 7. Performance

I asked AI to help identify frontend performance improvements and verify the application using Lighthouse.

The final production Lighthouse Desktop results were:

* Performance: 95
* Accessibility: 95
* Best Practices: 100
* SEO: 60

The SEO score was affected by a `noindex` response header on the Vercel production deployment.

## 8. Debugging

I used AI assistance to diagnose development issues, including:

* React/TypeScript issues.
* Accessibility lint errors.
* Test failures.
* Unused backup files.
* Git changes.
* Production build verification.

## Reflection

AI was used as a development assistant rather than as a replacement for understanding the implementation. I reviewed the suggested changes, tested them locally, and verified the application using automated tests, Playwright, the production build, and Lighthouse.
