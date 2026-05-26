// Type definitions for the portfolio data structure

export interface Competency {
    category: string;
    skills: string[];
}

export interface FocusArea {
    title: string;
    description: string;
}

export interface WorkingStyle {
    title: string;
    points: string[];
}

export interface CareerMoment {
    period: string;
    title: string;
    description: string;
}

export interface Experience {
    company: string;
    role: string;
    period: string;
    description: string;
    highlights?: string[];
}

export interface Project {
    name: string;
    label: string;
    description: string;
    impact: string;
    stack: string[];
}

export interface Portfolio {
    name: string;
    title: string;
    email: string;
    github: string;
    linkedin: string;
    summary: string;
    location: string;
    currentRole: string;
    currentCompany: string;
    yearsExperienceLabel: string;
    focusAreas: FocusArea[];
    workingStyle: WorkingStyle[];
    careerJourney: CareerMoment[];
    competencies: Competency[];
    experience: Experience[];
    projects: Project[];
    idealRoles: string[];
}

export const portfolio: Portfolio = {
    name: 'Rob Black',
    title: 'Senior Developer | DevEx & Tooling Specialist | CI/CD Automation | AI-Driven Developer Productivity',
    email: 'rob@robblack.co.uk',
    github: 'https://github.com/treborbob',
    linkedin: 'https://www.linkedin.com/in/rob-black-developer/',
    location: 'Ipswich, England, United Kingdom',
    currentRole: 'Business Systems Engineer',
    currentCompany: 'Paramount Visas Ltd',
    yearsExperienceLabel: 'Shipping software and improving delivery since 1999',

    summary: `I'm a senior developer who has been building for the web since 1999, starting in the early commercial internet days at Mirago and evolving through web, application, game, and internal platform work. These days I spend most of my time making delivery smoother for other people - improving the systems, tooling, and workflows that sit around the code as much as the code itself.

The thread running through my career is enablement. I've built CI/CD pipelines, release workflows, static analysis tooling, quality gates, and internal platforms that help teams get fast feedback and ship with less friction. I enjoy the practical side of engineering: removing repetition, tightening feedback loops, and turning messy processes into something dependable.

I'm also at my best when I can combine hands-on development with mentoring and technical guidance. I like being the person who can debug the awkward problem, improve the workflow, and help a team make better decisions without adding unnecessary ceremony.

At Paramount Visas that means business systems engineering, automation, and day-to-day technical support. In other roles it has meant frontend development, platform work, mentoring, delivery tooling, and technical R&D. The shape changes, but the goal is consistent: build environments where people can do good work more easily.`,

    focusAreas: [
        {
            title: 'Developer experience and feedback loops',
            description: 'I design workflows, linting, release pipelines, and quality gates that help teams move faster with less friction and more confidence.'
        },
        {
            title: 'Business systems and practical automation',
            description: 'I improve day-to-day operations by connecting systems, reducing manual work, and introducing low-risk changes that are easy to adopt.'
        },
        {
            title: 'Mentoring and technical enablement',
            description: 'I help developers debug hard problems, raise standards, and make better decisions by turning experience into practical guidance.'
        },
        {
            title: 'AI-assisted delivery',
            description:
                'I explore how prompt assets, AI feedback, and workflow integration can make teams more effective without adding noise or process theatre.'
        }
    ],

    workingStyle: [
        {
            title: 'How I add value',
            points: [
                'Reduce administrative burden and free up time for higher-value work',
                'Improve accuracy, traceability, and consistency across day-to-day operations',
                'Act as a technical bridge between business needs and maintainable system solutions'
            ]
        },
        {
            title: 'How I approach change',
            points: [
                'Prefer incremental, low-risk improvements over disruptive rewrites',
                'Focus on reliable systems that are simple to run and easy to understand',
                'Support sustainable growth by reducing friction, risk, and avoidable complexity'
            ]
        }
    ],

    careerJourney: [
        {
            period: '1999',
            title: 'Started in the early web at Mirago',
            description:
                'Cut my teeth in commercial web development when the industry was still finding its shape, building the kind of foundational experience that still informs how I think about delivery and product value.'
        },
        {
            period: '2000s to mid 2010s',
            title: 'Broadened across web, applications, and interactive products',
            description:
                'Worked across different stacks, teams, and commercial contexts, building the breadth that now lets me move comfortably between product work, platform concerns, and operational systems.'
        },
        {
            period: '2016 onwards',
            title: 'Moved deeper into systems, reliability, and enablement',
            description:
                'Roles at Wheatley, FLOvate, Switch Studios, and now Paramount Visas progressively pulled me toward tooling, mentoring, automation, and the engineering systems that make teams more effective.'
        }
    ],

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
            company: 'Paramount Visas Ltd',
            role: 'Business Systems Engineer',
            period: 'Jan 2026 – Present',
            description:
                'Designs practical systems, automation, and technical support processes that make day-to-day business operations smoother, more reliable, and easier to scale in a regulated environment.',
            highlights: [
                'Analyses existing processes and workflows to identify inefficiencies, duplication, and operational risk',
                'Designs and implements simple, reliable systems and automations that reduce manual work and errors',
                'Improves consistency and reliability across internal tools, data, and documentation',
                'Supports and integrates third-party platforms including CRM, document management, task tracking, and communication tools',
                'Provides day-to-day internal IT support, standardises devices, and acts as the primary technical point of contact'
            ]
        },
        {
            company: 'Switch Studios',
            role: 'Senior Developer',
            period: 'Mar 2022 – Dec 2025',
            description:
                "Served as the studio's senior technical advisor, bridging leadership, development, and QA while improving tooling, workflows, and team capability.",
            highlights: [
                'Drove AI tool adoption across 90% of the development team, creating integration guides and best practices',
                'Implemented automation, static analysis, and quality gates to improve product quality and developer experience',
                'Mentors developers through code reviews, workflow improvements, and introduction of new tools and standards',
                'Represents technical perspective at management meetings and conferences, aligning tech direction with business objectives',
                'Runs weekly developer sessions promoting collaboration and innovation across the team'
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

    projects: [
        {
            name: 'Waypoint',
            label: 'Private business platform',
            description:
                'Internal business management platform for Paramount Visas, supporting structured workflows, operational visibility, and consistent delivery across the team.',
            impact: 'Built with a strong emphasis on documentation, release discipline, environment management, and a dependable day-to-day developer workflow.',
            stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Prisma', 'PostgreSQL', 'Vercel']
        },
        {
            name: 'Vault',
            label: 'Private secure document system',
            description:
                'Secure document management system handling applicant files, structured review workflows, magic-link uploads, and Waypoint integration in a GDPR-conscious environment.',
            impact: 'Combines practical business needs with document processing, storage controls, auditability, and operational safety for sensitive data.',
            stack: ['Next.js 16', 'TypeScript', 'Prisma', 'PostgreSQL', 'Vercel Blob', 'Microsoft Entra ID']
        },
        {
            name: 'paramountvisas.com',
            label: 'Public website rebuild',
            description:
                'Public-facing website rebuild for Paramount Visas with in-repo content authoring, modern frontend tooling, and a deployment pipeline suitable for ongoing business updates.',
            impact: 'Demonstrates product delivery across content, UX, environment setup, and maintainable deployment rather than just page implementation.',
            stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Resend', 'Vercel']
        }
    ],

    idealRoles: [
        'Developer experience and tooling leadership',
        'Technical mentoring and enablement',
        'AI-assisted developer workflows',
        'Internal platforms and productivity systems',
        'Technical strategy and delivery improvement'
    ]
};
