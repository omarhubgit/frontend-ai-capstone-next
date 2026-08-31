# AI Reflection

## Overview

AI was used throughout the development of this capstone as a development assistant. I used it to understand implementation options, troubleshoot errors, improve accessibility, design the AI interaction, and review the application.

I remained responsible for implementing, testing, and verifying the final application.

## How I Used AI

### Project Architecture

AI helped me understand how the different parts of the application work together, including the Next.js App Router, React components, API routes, and the AI SDK.

This helped me understand the separation between the client-side chat interface and the server-side AI functionality.

### AI Chat

I used AI assistance to develop the chat interface and understand concepts such as:

* Streaming AI responses.
* Chat message state.
* Loading and submitted states.
* Stopping an active response.
* Error handling.
* Retry functionality.
* Example questions.
* Automatic scrolling.

I then tested these behaviors in the application.

### Tool Calling

One of the most important parts of the project was implementing the `get_project_details` server-side tool.

AI helped me understand how to define a tool with a Zod input schema and an execute function.

The tool accepts a project name and returns structured project information containing:

* Name.
* Description.
* Technologies.
* Features.

The frontend then renders this structured result as a project card.

This helped me understand the difference between simply displaying AI text and building a UI that can render structured tool results.

### Accessibility

AI helped identify accessibility improvements in the chat interface.

I added accessible labels, semantic buttons, focus states, and appropriate status/error messaging.

I also fixed an ESLint accessibility-related issue involving an unescaped apostrophe.

### Testing

I used AI assistance to understand and improve automated tests.

The final Vitest test suite contains 11 passing tests covering important chat behaviors.

I also verified the application with a Playwright end-to-end test, which passed successfully.

## Verification

I did not rely on AI suggestions without testing them.

The final application was verified using:

* `npm run lint`
* `npm run test:run`
* `npx playwright test`
* `npm run build`
* Lighthouse on the production build

Final automated results:

* ESLint: Passed.
* Vitest: 11/11 tests passed.
* Playwright: 1/1 test passed.
* Next.js production build: Passed.

The production Lighthouse Desktop results were:

* Performance: 95
* Accessibility: 95
* Best Practices: 100
* SEO: 60

The SEO score was affected by an `x-robots-tag: noindex` response header from the deployed environment. The application source code did not contain a `noindex` directive.

## What I Learned

The project helped me understand several concepts that were new or became clearer through implementation:

1. How a Next.js application separates client and server responsibilities.
2. How an AI chat interface communicates with a server-side AI route.
3. How streaming responses affect UI state.
4. How server-side tools can return structured data.
5. How Zod can define and validate tool input.
6. How tool lifecycle states can be represented in a frontend UI.
7. How automated tests can verify interactive React components.
8. How Playwright can verify the application from a user's perspective.
9. How Lighthouse can be used to evaluate frontend quality.
10. How accessibility should be considered during development rather than only after the application is finished.

## Challenges

One challenge was making the chat interface work correctly with the tool lifecycle states. The UI needed to distinguish between the tool preparing its input, receiving input, returning structured output, and encountering an error.

Another challenge was keeping the application accessible while maintaining a clean visual design.

I also encountered a test failure where the stop button had an accessible name of `Stop AI response` while the test expected `Stop`. I corrected the implementation/test mismatch and verified that all tests passed afterward.

## Final Reflection

The biggest lesson from this project was that building an AI-enhanced frontend is more than connecting a chat interface to an AI model.

The frontend needs to handle asynchronous states, structured tool results, errors, accessibility, testing, and performance.

Using AI as a development assistant helped me work through these problems, but testing and understanding the final implementation were essential parts of the process.
