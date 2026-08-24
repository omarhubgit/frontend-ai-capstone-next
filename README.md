This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## FE-07 — Server Tool Contract

### Tool: `get_project_details`

The AI Career Assistant uses a server-side tool called `get_project_details` to retrieve structured information about portfolio projects.

### Input schema

The tool accepts one input field:

- `projectName` — a string containing the name of the project to look up.

The input is validated with Zod.

```ts
z.object({
  projectName: z
    .string()
    .describe(
      "The name of the project to look up, such as Movie Search & Favorites."
    ),
})
Return shape

When a project is found, the tool returns:
{
  name: string;
  description: string;
  technologies: string[];
  features: string[];
}
Example:
{
  name: "Movie Search & Favorites",
  description: "A React application for searching movies and saving favorite movies.",
  technologies: [
    "React",
    "Vite",
    "JavaScript",
    "TMDB API",
    "LocalStorage"
  ],
  features: [
    "Movie search",
    "Movie results display",
    "Favorites",
    "LocalStorage persistence"
  ]
}
Tool lifecycle UI

The client renders the tool lifecycle using typed tool parts:

input-streaming — shows that the project lookup is being prepared.
input-available — shows which project is being looked up.
output-available — renders the returned project as a structured project card.
output-error — renders a designed error state when the tool fails.

Press:

**Ctrl + S**

---

# STEP 56 — Final FE-07 test checklist

We are **not moving to FE-08**.

We only need to verify FE-07.

Your checklist should now be:

| Requirement | Result |
|---|---|
| Server-side tool | ✅ |
| Zod schema | ✅ |
| Execute function | ✅ |
| `input-streaming` UI | ✅ |
| `input-available` UI | ✅ |
| `output-available` UI | ✅ |
| `output-error` UI | ✅ |
| Real component result | ✅ Project Card |
| Failed execution doesn't crash | ✅ Tested |
| README contract | ✅ |
| Preview/demo | ⏳ |

The only thing remaining is **commit + push + deployment/preview**.

⏱️ **Time left: ~10 minutes**

Before we do that, save `README.md`, then tell me:

**README done**

and we'll do the final Git + deployment steps and then I'll give you **exactly what to submit for FE-07** — and we stop there.