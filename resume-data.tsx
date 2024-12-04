export const RESUME_DATA = {
  name: "Victor A.",
  initials: "VA",
  avatarUrl: "https://avatars.githubusercontent.com/u/25129263?v=4",
  summary: "Pursuing a Master's degree in Data Science & hacking on ideas.",
  personalWebsiteUrl: "https://vic.so",
  education: [
    {
      school: "University of the Cumberlands",
      degree: "Master of Science in Data Science",
      start: "August 2023",
      end: "present",
    },
    {
      school: "Concord University",
      degree: "Bachelor of Science in Computer Science, minor in Psychology",
      start: "2018",
      end: "2022",
    },
  ],
  work: [
    {
      company: "FactSet Research Systems Inc.",
      link: "https://www.factset.com/",
      badges: [],
      title: "Software Engineer",
      logo: undefined,
      start: "2022",
      end: "July 2023",
      bulletPoints: [
        "Built FactSet’s onboarding API to help automate and streamline the process of customizing and personalizing the company’s primary services for new users",
        "Created reusable GitHub Action workflows resulting in significant cost savings by enabling efficient and faster migration from Jenkins across multiple engineering teams",
        "Implemented shell scripts, upgraded critical dependencies, and integrated remote caching using turborepo and AWS to simplify developer workflows and address technical debt, leading to a 95% increase in engineering productivity and a 15-minute reduction in development time per build",
      ],
      description:
        "Developed onboarding API, automated CI/CD processes with GitHub Actions, enhanced engineering productivity with scripts and remote caching.",
    },
    {
      company: "Concord University",
      link: "https://github.com/concord-epma/concord-sparrow",
      badges: [],
      title: "Full Stack Software Developer",
      logo: undefined,
      bulletPoints: [
        "Built and redesigned an optimized version of the Microanalytical laboratory's website using React (Nextjs) Vercel and Tailwind CSS resulting in over 120% faster page loads and website performance improvements",
        "Prototyped a solution for migrating existing spreadsheet-based systems to a new centralized PostgreSQL database-linked system to speed up data processing workflows of rock samples",
        "Reduced future developer onboarding by over 30 days by helping document and debug a critical backend software installation bottleneck",
      ],
      start: "2021",
      end: "May 2022",
      description:
        "Redesigned Microanalytical lab's website, prototyped database migration, addressed backend installation bottlenecks.",
    },
    {
      company: "Twilio",
      link: "https://twilio.com/blog/solutions-engineering-intern",
      badges: ["Intern"],
      title: "Solutions Engineer",
      logo: undefined,
      bulletPoints: [
        "Created demos for SMS, Voice, and Video use cases that leveraged Twilio's APIs then exemplified to customers the 50% increase in user engagement achievable by integrating the Twilio solutions",
        "Led a technical discovery, presented compelling solutions to customers",
      ],
      start: "2021",
      end: "August 2021",
      description:
        "Created demos using Twilio's APIs for SMS, Voice, and Video, leading to increased user engagement for customers.",
    },
  ],
  skills: [
    "JavaScript/TypeScript",
    "Node.js",
    "React/Next.js",
    "CSS (Tailwind )",
    "Python",
    "Rust",
    "Go (Golang)",
    "SQL",
    "NoSQL",
    "Git",
    "GitHub",
    "Vercel",
    "Docker",
    "AWS",
    "Unix/Linux",
  ],
  projects: [
    {
      title: "AI WebRTC conversation",
      techStack: ["Rust", "React", "Next.js", "TailwindCSS", "Python", "GLSL"],
      description:
        "Real-time AI conversational interface with Vulkan-based graphics renderer",
      logo: undefined,
      video:
        "https://github.com/cs50victor/kitt2/assets/52110451/ef2f8b61-6870-4e44-8718-0f92ef90cefc",
      link: {
        label: "github.com",
        href: "https://github.com/cs50victor/kitt2",
      },
    },
  ],
} as const
