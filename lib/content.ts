import { versionFor } from "./version";

export type ChangeKind =
  | "added"
  | "changed"
  | "deprecated"
  | "removed"
  | "fixed"
  | "note";

export interface Change {
  kind: ChangeKind;
  text: string;
}

export interface Release {
  version: string;
  /** Human-readable date, e.g. "January 2026" or "2000 to 2016". */
  date: string;
  org: string;
  role: string;
  /** Machine-readable start for the <time> element. */
  dateTime: string;
  changes: Change[];
  /** Shown when the entry spans a range of versions. */
  rangeLabel?: string;
}

export interface Project {
  name: string;
  label: string;
  description: string;
  stack: string[];
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface DependencyGroup {
  name: string;
  packages: string[];
}

export const person = {
  name: "Rob Black",
  role: "Senior developer",
  location: "Ipswich, UK",
  email: "rob@robblack.co.uk",
  github: "https://github.com/treborbob",
  githubLabel: "github.com/treborbob",
  linkedin: "https://www.linkedin.com/in/rob-black-developer/",
  linkedinLabel: "linkedin.com/in/rob-black-developer",
  currentOrg: "Paramount Visas Ltd",
  currentRole: "Business Systems Engineer",
};

export const intro = {
  headline: ["Shipping since 1999.", "Still on the latest version."],
  body: [
    "I'm a senior developer who spends most of his time making delivery smoother for other people: the tooling, pipelines and workflows that sit around the code, as much as the code itself.",
    "The thread through everything is enablement. Tight feedback loops, fewer manual steps, and environments where a team can do good work without ceremony. Lately that includes getting AI tools to earn their place in real workflows rather than adding noise.",
  ],
};

export const focusAreas: FocusArea[] = [
  {
    title: "Developer experience and feedback loops",
    description:
      "Workflows, linting, release pipelines and quality gates that let teams move faster with less friction and more confidence.",
  },
  {
    title: "Business systems and practical automation",
    description:
      "Connecting systems, removing repetition, and shipping low-risk changes that are easy for non-developers to adopt.",
  },
  {
    title: "Mentoring and technical enablement",
    description:
      "Helping developers debug the awkward problem, raise standards, and make better calls by turning experience into practical guidance.",
  },
  {
    title: "AI-assisted delivery",
    description:
      "Prompt assets, AI feedback and workflow integration that make a team measurably more effective, without process theatre.",
  },
];

export const releases: Release[] = [
  {
    version: versionFor(2026, 1),
    date: "January 2026",
    dateTime: "2026-01",
    org: "Paramount Visas Ltd",
    role: "Business Systems Engineer",
    changes: [
      {
        kind: "changed",
        text: "Moved from studio development into business systems engineering, in a regulated environment where reliability and traceability matter more than novelty.",
      },
      {
        kind: "added",
        text: "Waypoint, Vault and a rebuilt paramountvisas.com. See recent builds below.",
      },
      {
        kind: "added",
        text: "Automations that take manual work, duplication and operational risk off the team.",
      },
      {
        kind: "fixed",
        text: "Inconsistent data, tooling and documentation across CRM, document management, task tracking and comms platforms.",
      },
      {
        kind: "note",
        text: "Also the primary technical point of contact and day-to-day internal IT. Someone has to standardise the laptops.",
      },
    ],
  },
  {
    version: versionFor(2022, 3),
    date: "March 2022",
    dateTime: "2022-03",
    org: "Switch Studios",
    role: "Senior Developer",
    changes: [
      {
        kind: "added",
        text: "AI tooling adopted by 90% of the development team, with integration guides and working practices that stuck.",
      },
      {
        kind: "added",
        text: "Static analysis, automation and quality gates across the studio's pipelines.",
      },
      {
        kind: "changed",
        text: "Became the studio's senior technical advisor, bridging leadership, development and QA, and representing the technical view at management meetings and conferences.",
      },
      {
        kind: "added",
        text: "Weekly developer sessions, plus mentoring through code review, workflow improvements and new standards.",
      },
    ],
  },
  {
    version: versionFor(2018, 7),
    date: "July 2018",
    dateTime: "2018-07",
    org: "Switch Studios",
    role: "Client Developer L2",
    changes: [
      {
        kind: "added",
        text: "TypeScript iGaming titles tuned for constrained mobile hardware, built on PixiJS and GSAP.",
      },
      {
        kind: "fixed",
        text: "QA feedback loops, through automated testing and keeping codebases lean enough to reason about.",
      },
      {
        kind: "note",
        text: "Regulatory compliance reviews on every release. Every pixel audited.",
      },
    ],
  },
  {
    version: versionFor(2018, 5),
    date: "May 2018",
    dateTime: "2018-05",
    org: "FLOvate Solutions",
    role: "Lead Web Developer",
    changes: [
      {
        kind: "changed",
        text: "A short leadership role over web projects and technical delivery. Think of it as a hotfix branch.",
      },
    ],
  },
  {
    version: versionFor(2016, 9),
    date: "September 2016",
    dateTime: "2016-09",
    org: "Wheatley",
    role: "Developer",
    changes: [
      {
        kind: "added",
        text: ".NET systems for the energy industry: smart meter management, workforce tools and backend integrations.",
      },
      {
        kind: "added",
        text: "A small neural network in Python, written by hand to understand how the thing actually worked. Flagged experimental. Flag never removed.",
      },
    ],
  },
  {
    version: `${versionFor(2000, 1)} to ${versionFor(2016, 8)}`,
    rangeLabel: "2.x to 17.x",
    date: "2000 to 2016",
    dateTime: "2000",
    org: "Various",
    role: "Web, applications and interactive products",
    changes: [
      {
        kind: "added",
        text: "Breadth. Different stacks, teams and commercial contexts, which is why moving between product work, platform concerns and operational systems now feels normal.",
      },
      {
        kind: "changed",
        text: "Table layouts to CSS. Full page reloads to AJAX. XML to JSON. LESS to SCSS. Then React and Angular arrived and changed the question entirely.",
      },
      {
        kind: "deprecated",
        text: "jQuery. Still fond of it.",
      },
      {
        kind: "removed",
        text: "Internet Explorer 6 support. Eventually.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "1999",
    dateTime: "1999",
    org: "Mirago",
    role: "Initial release",
    changes: [
      {
        kind: "added",
        text: "Commercial web development, while the industry was still finding its shape. Everything since has been an upgrade.",
      },
      {
        kind: "note",
        text: "Initial commit. No tests. We were young.",
      },
    ],
  },
];

export const projects: Project[] = [
  {
    name: "Waypoint",
    label: "Private business platform",
    description:
      "Internal business management platform for Paramount Visas: structured workflows, operational visibility and consistent delivery across the team. Built with a strong emphasis on documentation, release discipline and a dependable day-to-day developer workflow.",
    stack: [
      "Next.js 16",
      "TypeScript",
      "Tailwind 4",
      "Prisma",
      "PostgreSQL",
      "Vercel",
    ],
  },
  {
    name: "Vault",
    label: "Private secure document system",
    description:
      "Secure document management for applicant files: structured review workflows, magic-link uploads and Waypoint integration in a GDPR-conscious environment. Storage controls, auditability and operational safety for sensitive data.",
    stack: [
      "Next.js 16",
      "TypeScript",
      "Prisma",
      "PostgreSQL",
      "Vercel Blob",
      "Microsoft Entra ID",
    ],
  },
  {
    name: "paramountvisas.com",
    label: "Public website rebuild",
    description:
      "Public-facing rebuild with in-repo content authoring, modern frontend tooling and a deployment pipeline the business can keep updating. Product delivery across content, UX and environments, not just page implementation.",
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "Resend", "Vercel"],
  },
];

export const dependencies: DependencyGroup[] = [
  {
    name: "developer-experience",
    packages: [
      "tooling-architecture",
      "workflow-automation",
      "vscode-extensions",
      "feedback-loops",
    ],
  },
  {
    name: "ci-cd",
    packages: [
      "pipeline-design",
      "semantic-versioning",
      "build-and-deploy",
      "sonarqube",
      "quality-gates",
    ],
  },
  {
    name: "engineering",
    packages: [
      "typescript",
      "csharp",
      "dotnet",
      "node",
      "pixijs",
      "gsap",
      "sql",
      "web-performance",
    ],
  },
  {
    name: "ai",
    packages: [
      "ai-augmented-development",
      "prompt-engineering",
      "copilot-optimisation",
      "emerging-tech-evaluation",
    ],
  },
  {
    name: "leadership",
    packages: [
      "code-review-coaching",
      "knowledge-sharing",
      "technical-guidance",
      "team-empowerment",
    ],
  },
  {
    name: "quality",
    packages: [
      "static-analysis",
      "performance-profiling",
      "automated-testing",
      "continuous-feedback",
    ],
  },
];

export const contributing = [
  {
    title: "How I add value",
    points: [
      "Reduce administrative burden so people can spend time on higher-value work",
      "Improve accuracy, traceability and consistency in day-to-day operations",
      "Act as the technical bridge between what the business needs and what is maintainable",
    ],
  },
  {
    title: "How I approach change",
    points: [
      "Incremental, low-risk improvements over disruptive rewrites",
      "Reliable systems that are simple to run and easy to understand",
      "Reduce friction, risk and avoidable complexity so growth is sustainable",
    ],
  },
];

export const openTo = [
  "Developer experience and tooling leadership",
  "Technical mentoring and enablement",
  "AI-assisted developer workflows",
  "Internal platforms and productivity systems",
  "Technical strategy and delivery improvement",
];
