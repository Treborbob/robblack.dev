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
  /** Side ventures sit on a branch in the commit graph. */
  branch?: boolean;
}

/** Who a build was for. Work is the day job; personal is evenings and weekends. */
export type ProjectOrigin = "work" | "personal";

export interface Project {
  name: string;
  label: string;
  description: string;
  stack: string[];
  origin: ProjectOrigin;
  /** Public source, where there is any. Work builds are private. */
  repo?: string;
  /** App icon under public/, for builds that have one. */
  icon?: string;
}

export interface FocusArea {
  title: string;
  description: string;
}

export interface DependencyGroup {
  name: string;
  packages: string[];
  /** Retired packages, shown struck through. Still fond of them. */
  deprecated?: boolean;
}

export const person = {
  name: "Rob Black",
  role: "Senior Developer",
  location: "Ipswich, Suffolk, UK",
  email: "rob@robblack.co.uk",
  github: "https://github.com/treborbob",
  githubLabel: "github.com/treborbob",
  linkedin: "https://www.linkedin.com/in/rob-black-developer/",
  linkedinLabel: "linkedin.com/in/rob-black-developer",
  currentOrg: "Paramount Visas",
  currentRole: "Business Systems Engineer",
};

export const intro = {
  headline: ["Shipping since 1999.", "Still on the latest version."],
  body: [
    "I'm a senior developer who spends most of his time making delivery smoother for other people: the tooling, pipelines and workflows that sit around the code, as much as the code itself.",
    "The thread through everything is enablement. Tight feedback loops, fewer manual steps, and environments where a team can do good work without ceremony.",
    "These days I work AI-first: several models, each briefed with the context, constraints and taste you get from {years} years of shipping. I design the systems, set the standards and read every line. Most of the typing is delegated now. The judgement is not.",
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
      "An AI-first workflow: multiple models, tailored context and constraints, and rigorous review, so the output is what I would have written, sooner and with fewer surprises.",
  },
];

export const releases: Release[] = [
  {
    version: versionFor(2026, 1),
    date: "January 2026",
    dateTime: "2026-01",
    org: "Paramount Visas",
    role: "Business Systems Engineer",
    changes: [
      {
        kind: "changed",
        text: "Moved from studio development into business systems engineering, in a regulated environment where reliability and traceability matter more than novelty.",
      },
      {
        kind: "changed",
        text: "How the code gets written. Models draft against a written brief, hard constraints and a design system they cannot drift from. CI and I review. What they cannot manage, I write.",
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
        kind: "added",
        text: "Shared CI, a versioned design system and a few MCP servers, so both apps ship the same way and the AI tooling has something safe to talk to.",
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
        text: "GitHub Copilot rolled out across the studio, with integration guides and working practices most of the team still use.",
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
    role: "Client Developer",
    changes: [
      {
        kind: "added",
        text: "HTML5 casino table games for Microgaming, in TypeScript and PixiJS: roulette, blackjack, baccarat, sic bo and their many variants, tuned for constrained mobile hardware.",
      },
      {
        kind: "changed",
        text: "Core engine architecture, planned with the technical architect and carried across the development and QA teams.",
      },
      {
        kind: "added",
        text: "Mentoring L1 developers, with code review as a standing responsibility rather than a favour.",
      },
      {
        kind: "changed",
        text: "Progress, complications and timeline changes taken to stakeholders in plain English, before they became surprises.",
      },
      {
        kind: "note",
        text: "Regulatory compliance reviews on every release.",
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
        text: ".NET systems for gas, electricity and water utilities: smart meter management, workforce tools and backend integrations.",
      },
      {
        kind: "added",
        text: "Continuous integration and delivery with unit and automated UI tests, inside an ISO 27001-certified company. First proper taste of a tightly regulated industry.",
      },
      {
        kind: "fixed",
        text: "Reported bugs reproduced and isolated with the support team before a work item was raised.",
      },
    ],
  },
  {
    version: versionFor(2014, 7),
    date: "July 2014",
    dateTime: "2014-07",
    org: "2DEVS",
    branch: true,
    role: "Co-founder, evenings and weekends",
    changes: [
      {
        kind: "added",
        text: "A two-person freelance studio with a friend on design and frontend and me on everything behind it, run around the day job.",
      },
      {
        kind: "added",
        text: "Bespoke sites and systems for a dozen small businesses, an Umbraco build, a nopCommerce shop, and the 2015 Student Gems rebuild, maintained into 2018.",
      },
      {
        kind: "added",
        text: "A prototype intranet and CRM for a visa consultancy. The owner passed on it. Ten years later, see v26.01.0.",
      },
      {
        kind: "removed",
        text: "2DEVS itself, dissolved in June 2025 after eleven years. Side hustles have lifecycles too.",
      },
    ],
  },
  {
    version: versionFor(2013, 1),
    date: "January 2013",
    dateTime: "2013-01",
    org: "kwiboo",
    role: "Developer",
    changes: [
      {
        kind: "added",
        text: "Distributed systems for a large online pharmacy, plus work for Sony, Mitsubishi Electric, Sega and Xchanging. Eighty percent development, twenty percent keeping it all running.",
      },
      {
        kind: "added",
        text: "Zero-downtime deploys to live systems with immediate rollback on failure. Standard practice ever since.",
      },
      {
        kind: "added",
        text: "KnockoutJS and MVVM, SignalR, Windows services, message queues, AngularJS, Web API, single-page apps, PhoneGap, Sass and LESS. Roughly everything, roughly at once.",
      },
      {
        kind: "changed",
        text: "Client specifications broken down into costs and timelines, then delivered on them. Self-managed from the first sprint.",
      },
      {
        kind: "deprecated",
        text: "jQuery, in favour of Knockout and then Angular. Still fond of it.",
      },
      {
        kind: "note",
        text: "Microsoft Certified Solutions Developer, Web Applications, 2014. Renewed twice, then quietly retired along with the acronym.",
      },
    ],
  },
  {
    version: versionFor(2010, 10),
    date: "October 2010",
    dateTime: "2010-10",
    org: "Rade Digital",
    role: "Senior Web Developer",
    changes: [
      {
        kind: "changed",
        text: "Rolled back to Rade, in a more senior role.",
      },
      {
        kind: "added",
        text: "HTML5, CSS3 and responsive design, championed across client e-commerce sites while IE7 was still on the support list.",
      },
      {
        kind: "added",
        text: "QA testing, source control and bug tracking as standard practice. The first process I ever introduced to a team.",
      },
      {
        kind: "added",
        text: "Git. Just started using it, according to my 2012 CV.",
      },
      {
        kind: "fixed",
        text: "A locked-down core platform, by reshaping its pages with jQuery and AJAX after they had rendered. Not proud. Very effective.",
      },
      {
        kind: "fixed",
        text: "Christmas peak load for e-commerce clients, with load testing and a lot of profiling.",
      },
      {
        kind: "removed",
        text: "Internet Explorer 6 support.",
      },
    ],
  },
  {
    version: versionFor(2009, 10),
    date: "October 2009",
    dateTime: "2009-10",
    org: "Student Gems",
    role: "Technical Manager",
    changes: [
      {
        kind: "changed",
        text: "From their long-time freelancer to head of everything technical, after the company took angel investment.",
      },
      {
        kind: "added",
        text: "Servers, email, firewall, hosting, contractors and all new development. One person, a lot of hats.",
      },
      {
        kind: "added",
        text: "A content-managed bulk email system on HTML and plain-text templates with a dynamic SQL merge. A mail merge, in 2009, by hand.",
      },
      {
        kind: "changed",
        text: "Classic ASP forms rebuilt as jQuery and AJAX wizards with remote geocoding. Most of the rest rewritten in valid XHTML and CSS. Tables were for data again.",
      },
    ],
  },
  {
    version: versionFor(2006, 9),
    date: "September 2006",
    dateTime: "2006-09",
    org: "Rade New Media",
    role: "Web Developer",
    changes: [
      {
        kind: "added",
        text: "E-commerce sites on the RadeTrade platform for Multiyork, Rapid Electronics, Hawkin's Bazaar and the World Land Trust, among others. PSD in, working shop out.",
      },
      {
        kind: "added",
        text: "Payment gateways: SagePay, PayPal, WorldPay and Protx. Fulfilment and CRM integrations with Maginus and Khaos Control.",
      },
      {
        kind: "changed",
        text: "More ASP.NET, co-writing an intranet for the largest e-commerce customer.",
      },
      {
        kind: "note",
        text: "Two Arcaysis customers followed me out of the door as freelance clients. A good sign, I decided.",
      },
    ],
  },
  {
    version: versionFor(2004, 4),
    date: "April 2004",
    dateTime: "2004-04",
    org: "Arcaysis",
    role: "Developer",
    changes: [
      {
        kind: "added",
        text: "Core work on a content management and e-commerce engine that was mostly SQL: stored procedures, triggers, transactions and metadata, running shops doing thousands of orders a day.",
      },
      {
        kind: "changed",
        text: "Learned relational design and database performance properly, in T-SQL, the way you only learn it when the orders are real.",
      },
      {
        kind: "note",
        text: "Contracted out to Rade New Media in 2006 to teach their team the system. Ended up staying.",
      },
      {
        kind: "note",
        text: "Also trading on the side as RB Web Developments: around thirty small sites, forum setups, online stores and, according to the services page, vinyl-to-CD transfers.",
      },
    ],
  },
  {
    version: versionFor(2003, 10),
    date: "October 2003",
    dateTime: "2003-10",
    org: "2Cs",
    role: "Web Developer",
    changes: [
      {
        kind: "added",
        text: "Dozens of dynamic sites in Classic ASP, SQL and early ASP.NET, in a team of three developers and six designers. Accessibility guidelines on most of them.",
      },
    ],
  },
  {
    version: versionFor(2003, 7),
    date: "July 2003",
    dateTime: "2003-07",
    org: "DKNI",
    role: "Software Developer",
    changes: [
      {
        kind: "added",
        text: "Access front-ends on SQL Server, and VBA that imported spreadsheets, converted them to CSV and FTP'd them elsewhere. Linked servers and distributed transactions included.",
      },
      {
        kind: "note",
        text: "Short stint. The company was acquired the following year.",
      },
    ],
  },
  {
    version: versionFor(2002, 2),
    date: "February 2002",
    dateTime: "2002-02",
    org: "AfterTwelve.com",
    branch: true,
    role: "Between jobs, on my own network",
    changes: [
      {
        kind: "changed",
        text: "A year and a half back on the Sale Computer Systems sites full time (see v99.08.0), with AfterTwelve getting most of the attention.",
      },
      {
        kind: "added",
        text: "A dating site built from scratch: bespoke CMS, membership system and card payments through a real merchant account.",
      },
      {
        kind: "note",
        text: "It got real traction. Closed in 2004. Not a code issue.",
      },
    ],
  },
  {
    version: versionFor(2001, 10),
    date: "October 2001",
    dateTime: "2001-10",
    org: "NHS Direct",
    role: "Web Developer",
    changes: [
      {
        kind: "changed",
        text: "A static HTML site converted to dynamic ASP with SQL Server behind it.",
      },
      {
        kind: "added",
        text: "W3C accessibility standards, followed at all times. The NHS insisted, and it stuck.",
      },
    ],
  },
  {
    version: versionFor(2000, 10),
    date: "October 2000",
    dateTime: "2000-10",
    org: "Mirago",
    role: "Web Developer",
    changes: [
      {
        kind: "added",
        text: "The only full-time web developer on a very busy UK search engine.",
      },
      {
        kind: "changed",
        text: "Junior web developer to web developer in week three.",
      },
      {
        kind: "changed",
        text: "The entire site, from PerlScript to VBScript. It was 2000. It made sense at the time.",
      },
      {
        kind: "added",
        text: "Hardware and software rollouts alongside the sysadmins when the site needed it. Everyone did everything.",
      },
      {
        kind: "note",
        text: "First job title with the words web developer in it.",
      },
    ],
  },
  {
    version: versionFor(1999, 8),
    date: "August 1999",
    dateTime: "1999-08",
    org: "Sale Computer Systems",
    branch: true,
    role: "Co-founder and developer",
    changes: [
      {
        kind: "added",
        text: "An early e-commerce site for computer peripherals and a PC build service, through a company I set up with family. Taking card payments online meant persuading a bank, not adding a script tag.",
      },
      {
        kind: "changed",
        text: "Andover TownCentral, commercialised. Same forum, now with adverts.",
      },
      {
        kind: "added",
        text: "A small content network: TeenScene for teenagers, NappyRash for new parents, AfterTwelve for dating, with our own banner ad platform running across all of them.",
      },
      {
        kind: "added",
        text: "TastyTones: ringtones, polyphonics and logos for the Nokia 3310 generation. It made money. The syndication partner made more.",
      },
      {
        kind: "note",
        text: "Dissolved in 2003. All of it Classic ASP on one Windows box. I still have the IIS logs.",
      },
    ],
  },
  {
    version: "98.x.0-alpha",
    date: "1998",
    dateTime: "1998",
    org: "Andover TownCentral",
    role: "Pre-release",
    changes: [
      {
        kind: "added",
        text: "A community site for my home town, built while working through Sams Teach Yourself ASP in 21 Days, then Active Server Pages Unleashed. ASP 2 and Access 97.",
      },
      {
        kind: "added",
        text: "Forum, chat, classifieds, local news, restaurants, churches, pet rescue, recipes, and a high-score table for Pac-Man, Space Invaders and Snake.",
      },
      {
        kind: "note",
        text: "Initial commit. No tests. We were young.",
      },
    ],
  },
];

export const projectOrigins: Record<ProjectOrigin, string> = {
  work: person.currentOrg,
  personal: "Side project",
};

export const projects: Project[] = [
  {
    name: "Waypoint",
    label: "Internal work-management platform",
    origin: "work",
    description:
      "The system of record for the business: leads, enquiries, jobs and clients, with kanban boards, reminders and reporting. Case-management logic shaped around how the team actually works. Replaced Trello. Integrates with Vault so a job and its documents stay in step. Preview environments, release discipline and documentation to match.",
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
    label: "Applicant and document operations",
    origin: "work",
    description:
      "Applicant records and their documents, organised properly: staff review queues, OCR-assisted processing of identity documents, an intake system that tracks what each application still needs, magic-link uploads so applicants never need an account, saved data views for staff, and appointment pack generation. GDPR built in: consent tracking, retention review and audited purge.",
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
    origin: "work",
    description:
      "Public-facing rebuild with in-repo content authoring, modern frontend tooling and a deployment pipeline the business can keep updating. Product delivery across content, UX and environments, not just page implementation.",
    stack: ["Next.js 16", "TypeScript", "Tailwind 4", "Resend", "Vercel"],
  },
  {
    name: "Platform and tooling",
    label: "Shared CI, design system, MCP servers",
    origin: "work",
    description:
      "The plumbing under Waypoint and Vault: reusable GitHub Actions workflows with per-PR preview environments on anonymised database branches, nightly end-to-end runs, semantic releases with AI-drafted and sanitised notes, and a versioned design token package with drift checks in CI. Plus a handful of small MCP servers that give AI assistants safe, read-only access to the tools the business already runs on.",
    stack: [
      "GitHub Actions",
      "Playwright",
      "Neon branches",
      "semantic-release",
      "Tailwind 4 tokens",
      "MCP",
    ],
  },
  {
    name: "Rota",
    label: "Household chore planner",
    origin: "personal",
    repo: "https://github.com/Treborbob/rota",
    icon: "/builds/rota.png",
    description:
      "A calm, private chore rota for two people and one house. Work is balanced by estimated minutes rather than job counts, the planner is deterministic so the same inputs always give the same week, and every placement carries a reason. Recurrence runs from when a job was actually done, so finishing late never builds a backlog. The planning logic is a pure domain layer with no database or React in it, and the rules are written up properly. No points, no streaks, no leaderboard.",
    stack: [
      "Next.js 16",
      "TypeScript",
      "Prisma 7",
      "Neon",
      "Better Auth",
      "PWA",
    ],
  },
  {
    name: "Gainsayer",
    label: "macOS menu bar volume control",
    origin: "personal",
    repo: "https://github.com/Treborbob/gainsayer",
    icon: "/builds/gainsayer.png",
    description:
      "A slider, the keyboard keys and a mute for the outputs macOS greys out: HDMI, optical, anything that reports no hardware level. Built on Core Audio process taps and a private aggregate device, so there is no driver, no virtual device and nothing to uninstall. It engages only when the default output has no volume control and stands aside when it does. If it crashes, the tap is torn down and the device plays at its normal level. Built for one desk. It will never grow into an audio suite.",
    stack: ["Swift 6", "SwiftUI", "AppKit", "Core Audio", "Swift Testing"],
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
    name: "quality",
    packages: [
      "static-analysis",
      "performance-profiling",
      "automated-testing",
      "continuous-feedback",
    ],
  },
  {
    name: "deprecated",
    packages: [
      "classic-asp",
      "vbscript",
      "access-97",
      "snitz-forums-2000",
      "cdonts",
      "jquery",
      "knockoutjs",
      "ie6",
    ],
    deprecated: true,
  },
];

export const contributing = [
  {
    title: "How I add value",
    points: [
      "Take the repetitive admin off people who have better things to do",
      "Make the numbers and the paperwork trustworthy",
      "Translate between what the business wants and what will still run in three years",
    ],
  },
  {
    title: "How I approach change",
    points: [
      "Start from yes, then work out how, then say what it will cost",
      "Incremental, low-risk improvements over disruptive rewrites",
      "Reliable systems that are simple to run and easy to understand",
    ],
  },
  {
    title: "How I use AI",
    points: [
      "I know what good looks like, so I can tell when the output is not it",
      "I brief the model; I own the architecture, the review and the result",
      "I keep up with what is possible, which is how I know what to ask for",
      "If it cannot be done with AI, it gets done without it",
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
