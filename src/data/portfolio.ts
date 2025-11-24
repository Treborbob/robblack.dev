// Type definitions for the portfolio data structure

export interface Competency {
    category: string;
    skills: string[];
}

export interface Experience {
    company: string;
    role: string;
    period: string;
    description: string;
    highlights?: string[];
}

export interface Portfolio {
    name: string;
    title: string;
    email: string;
    github: string;
    linkedin: string;
    summary: string;
    competencies: Competency[];
    experience: Experience[];
    idealRoles: string[];
}

export const portfolio: Portfolio = {
    name: 'Rob Black',
    title: 'Senior Developer | Technical Mentor | DevEx & AI Strategy',
    email: 'rob@robblack.co.uk',
    github: 'https://github.com/treborbob',
    linkedin: 'https://www.linkedin.com/in/rob-black-developer/',

    summary: `Highly experienced software developer with nearly three decades in the industry, spanning web, application, and game development. Currently a Senior Developer at Switch Studios, serving as the studio's go-to technical authority — bridging leadership, development, and QA. My strengths lie not in churning out tickets but in enabling others to work smarter, improving workflows, tools, and processes to elevate overall team capability.

Recent focus has been on developer experience, internal tooling, and AI strategy, helping align technical initiatives with business goals. I mentor developers, streamline SDLC processes, and lead technical R&D efforts that future-proof studio operations.`,

    competencies: [
        {
            category: 'Developer Experience & Enablement',
            skills: ['Tooling Architecture', 'Workflow Automation', 'Developer Productivity', 'VSCode Extensions', 'Feedback Loops']
        },
        {
            category: 'CI/CD & Automation',
            skills: ['Pipeline Design', 'Semantic Versioning', 'Build & Deployment Automation', 'SonarQube Integration', 'Quality Gates']
        },
        {
            category: 'Mentorship & Leadership',
            skills: ['Code Review Coaching', 'Knowledge Sharing', 'Technical Guidance', 'Problem Solving', 'Team Empowerment']
        },
        {
            category: 'AI & Innovation',
            skills: ['AI-Augmented Development', 'Prompt Engineering', 'Copilot Optimization', 'R&D Strategy', 'Emerging Tech Evaluation']
        },
        {
            category: 'Technical Strategy & Systems Thinking',
            skills: ['Technology Adoption', 'Future-Proof Architecture', 'Dev Process Optimization', 'Business Alignment']
        },
        {
            category: 'Software Engineering',
            skills: ['TypeScript', 'C#', '.NET', 'Node.js', 'PixiJS', 'GSAP', 'SQL', 'Web Performance Optimization']
        },
        {
            category: 'Observability & Quality',
            skills: ['Static Analysis', 'Performance Profiling', 'Automated Testing', 'Continuous Feedback']
        }
    ],

    experience: [
        {
            company: 'Switch Studios',
            role: 'Senior Developer',
            period: 'Mar 2022 – Present',
            description: "Promoted after internal restructuring; now acts as the studio's senior technical advisor.",
            highlights: [
                'Supports developers and QA through mentoring, code reviews, workflow improvements, and introducing new tools and standards',
                'Implements automation, static analysis, and coding standards to improve product quality and developer experience',
                "Leads the studio's AI strategy, evaluating and integrating emerging tools",
                'Represents the studio at management meetings and conferences, helping align technical direction with business objectives',
                'Runs weekly developer sessions and promotes collaboration and innovation across the team'
            ]
        },
        {
            company: 'Switch Studios',
            role: 'Client Developer L2',
            period: 'Jul 2018 – Mar 2022',
            description: 'Developed TypeScript-based iGaming titles optimized for performance on constrained mobile hardware.',
            highlights: [
                'Conducted code reviews and collaborated closely with QA to ensure high quality and regulatory compliance',
                'Contributed to agile processes (daily stand-ups, retros, demos) and translated stakeholder feedback into actionable requirements',
                'Supported the QA team by integrating automated testing and ensuring lean, efficient codebases'
            ]
        },
        {
            company: 'FLOvate Solutions',
            role: 'Lead Web Developer',
            period: 'May 2018 – Jul 2018',
            description: 'Short-term leadership role overseeing web development projects and technical delivery.'
        },
        {
            company: 'Wheatley',
            role: 'Developer',
            period: 'Sep 2016 – May 2018',
            description: 'Worked on software supporting energy industry operations — smart meter management, workforce tools, and backend systems.',
            highlights: ['Focused on robust .NET development and system integrations']
        }
    ],

    idealRoles: [
        'Developer Experience Engineer / DevEx Lead',
        'Technical Mentor or R&D Developer',
        'AI Tools Integration Specialist',
        'Principal Engineer (Tooling / Productivity)',
        'Technical Strategist or Developer Advocate'
    ]
};
