import { tool } from "ai";
import { z } from "zod";

export const getProjectDetails = tool({
  description:
    "Get structured information about one of the projects in the portfolio.",

  inputSchema: z.object({
    projectName: z
      .string()
      .describe(
        "The name of the project to look up, such as Movie Search & Favorites."
      ),
  }),

  execute: async ({ projectName }) => {
    const projects = [
      {
        name: "Movie Search & Favorites",
        description:
          "A React application for searching movies and saving favorite movies.",
        technologies: [
          "React",
          "Vite",
          "JavaScript",
          "TMDB API",
          "LocalStorage",
        ],
        features: [
          "Movie search",
          "Movie results display",
          "Favorites",
          "LocalStorage persistence",
        ],
      },
    ];

    const normalizedProjectName = projectName
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/\s+/g, " ")
      .trim();

    const project = projects.find((item) => {
      const normalizedName = item.name
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/\s+/g, " ")
        .trim();

      return normalizedName === normalizedProjectName;
    });

    if (!project) {
      throw new Error(
        `Project "${projectName}" was not found.`
      );
    }

    return project;
  },
});