export const steps = [
  {
    id: 1,
    inProgress: "Analysing the topic...",
    completed: "Analysed the topic",
    summary: "Broke down the core subject to understand what it's really about and how deep we need to go."
  },
  {
    id: 2,
    inProgress: "Understanding the context...",
    completed: "Understood the context",
    summary: "The audience, situation, and intent were interpreted to determine how the message should be framed, which assumptions are safe, and what needs to be made explicit. This helps ensure the presentation resonates with viewers and addresses their actual needs."
  },
  {
    id: 3,
    inProgress: "Forming search queries...",
    completed: "Formed search queries",
    summary: [
      "What problem does [topic] solve?",
      "How [topic] is used in practice",
      "Common frameworks or models for [topic]",
      "Examples of effective [topic] presentations",
      "Metrics and benchmarks related to [topic]"
    ],
    summaryType: "searchQueries"
  },
  {
    id: 4,
    inProgress: "Researching relevant background...",
    completed: "Researched relevant background",
    summary: "Pulled in baseline knowledge, known facts, and comparable examples to ground the presentation."
  },
  {
    id: 5,
    inProgress: "Consolidating information...",
    completed: "Consolidated information",
    summary: "All gathered inputs were organised into a coherent internal view. Overlaps were resolved, noise was removed, contradictions were flagged, and a single narrative direction was established to guide the rest of the process."
  },
  {
    id: 6,
    inProgress: "Planning the presentation outline...",
    completed: "Planned the presentation outline",
    summary: "Defined a slide-by-slide structure with logical flow from context to insight to conclusion."
  },
  {
    id: 7,
    inProgress: "Identifying gaps and missing data...",
    completed: "Identified gaps and missing data",
    summary: "Flagged areas where information is incomplete or assumptions need validation."
  },
  {
    id: 8,
    inProgress: "Forming key takeaways...",
    completed: "Formed key takeaways",
    summary: "Distilled the most important conclusions—what the audience should understand, remember, and act on after viewing. These takeaways will anchor the narrative and ensure every slide serves a clear purpose."
  },
  {
    id: 9,
    inProgress: "Preparing content for generation...",
    completed: "Prepared content for generation",
    summary: "Finalised structure and constraints. Ready to generate."
  }
];
