type Work = {
  name: string
  description: string
  link: string
  video: string
}

type WorkExperience = {
  company: string
  img_src: string
  title: string
  start: string
  end: string
  link: string
  achievement_summary?: string
}

type SocialLink = {
  label: string
  link: string
}

export const WEBSITE_URL = 'https://vic.so'
export const NAME = 'Victor A.';
export const PROFESSION = 'Software Engineer';
export const ABOUT = `I'm a software engineer based in <cursor:washington>Washington</cursor>.

Currently at <cursor:openinterpreter>Open Interpreter</cursor>, building more intuitive and accessible ways to interact with computers through AI. Also pursuing a Master's in Data Science.`;

export const CURSOR_IMAGES = {
  washington: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Seattle_from_Space_Needle.jpg/1920px-Seattle_from_Space_Needle.jpg",
    alt: "Seattle skyline from Space Needle"
  },
  openinterpreter: {
    src: "https://i.pinimg.com/550x/6c/ba/42/6cba42235e16f44245ce5f6c94ac5b10.jpg",
    alt: "Open Interpreter logo"
  },
  factset: {
    src: "https://www.nasdaq.com/sites/acquia.prod/files/styles/1370x700/public/kwhen/FDS-f93ac4cb-a80d-4cc8-b734-0de6900bff07.png",
    alt: "Factset Research Systems"
  },
  concorduniversity: {
    src: "https://static.wixstatic.com/media/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg",
    alt: "Concord University"
  },
  twilio: {
    src: "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/B4ZHB2UORBO3REYBCQZX6TQ6PQ.jpg",
    alt: "Twilio"
  }
};

export const WORKS: Work[] = [
  {
    name: 'jamie',
    description: 'Live AI research companion that listens to conversations and provides real-time web searches. Built with LiveKit for real-time communication and features an interactive timeline UI for exploring search results.',
    link: '/work/jamie',
    video: '/jamie.png',
  },
  {
    name: 'kitt2',
    description: 'Real-time multimodal AI communication system using LiveKit. Renders 3D models into live video streams, enabling interactive AI avatars. Built with TypeScript and Python for the backend streaming capabilities.',
    link: 'https://github.com/cs50victor/kitt2',
    video: 'https://github.com/cs50victor/kitt2/assets/52110451/ef2f8b61-6870-4e44-8718-0f92ef90cefc',
  },
  {
    name: 'buildspace ai',
    description: 'AI-powered discovery platform for buildspace community. Uses Rust for high-performance video transcription, indexes 300+ builder profiles. Features real-time conversational UI via LiveKit for community-backed AI responses.',
    link: 'https://github.com/cs50victor/buildspace',
    video: 'https://github.com/cs50victor/buildspace/assets/52110451/2a0e0750-e21e-4aa9-b856-0a7f7fb9c3b8',
  },
]

export const WORK_EXPERIENCE: WorkExperience[] = [
  {
    company: "Open Interpreter",
    img_src: "https://i.pinimg.com/550x/6c/ba/42/6cba42235e16f44245ce5f6c94ac5b10.jpg",
    title: "Software Engineer",
    start: "2024",
    end: "Now",
    link: "https://www.openinterpreter.com/",
  },
  {
    company: "University of the Cumberlands",
    img_src: "https://cdn.shopify.com/s/files/1/0023/7787/5568/collections/1084.jpg",
    title: "Master of Science in Data Science",
    start: "2023",
    end: "Now",
    link: "/",
  },
  {
    company: "FactSet Research Systems Inc.",
    img_src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIv8a4rXpRc6wJrzl7DRmfBK6hfp4NI4J0hg&s",
    title: "Software Engineer",
    achievement_summary: "Engineering Department Trailblazer award nominee.",
    start: "2022",
    end: "2023",
    link: "https://www.factset.com/",
  },
  {
    company: "Concord University (Department of Physical and Environmental Sciences)",
    img_src: "https://static.wixstatic.com/media/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg",
    title: "Full Stack Software Engineer",
    start: "2021",
    end: "2022",
    link: "https://github.com/concord-epma/concord-sparrow",
  },
  {
    company: "Twilio",
    img_src: "https://cloudfront-us-east-2.images.arcpublishing.com/reuters/B4ZHB2UORBO3REYBCQZX6TQ6PQ.jpg",
    title: "Solutions Engineer",
    achievement_summary: "Founding solutions engineering intern class.",
    start: "2021",
    end: "2021",
    link: "https://twilio.com/blog/solutions-engineering-intern",
  },
  {
    company: "Concord University",
    img_src: "https://static.wixstatic.com/media/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg",
    title: "BS in Computer Science + minor in psychology",
    achievement_summary: "Honors / Cum Laude.",
    start: "2018",
    end: "2022",
    link: "https://www.concord.edu/",
  },
  {
    company: "Bonner Foundation",
    img_src: "https://static.wixstatic.com/media/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg/v1/fill/w_1000,h_750,al_c,q_85,usm_0.66_1.00_0.01/669cfa_af84ca57b7834090805611e9f0f6d77d~mv2.jpg",
    title: "Bonner Scholar",
    achievement_summary: "Over 1,500 hours served in the Athens community through gardening, tutoring, and assisting with managing the Athens bike trail program.",
    start: "2019",
    end: "2022",
    link: "https://www.bonner.org/",
  }
]

export const EMAIL = 'vic8orr@gmail.com'

export const SOCIAL_LINKS: SocialLink[] = [
  {
    label: 'Email',
    link: `mailto:${EMAIL}`,
  },
  {
    label: 'Github',
    link: 'https://github.com/cs50victor',
  },
  {
    label: 'Twitter',
    link: 'https://twitter.com/vicdotso',
  },
  // {
  //   label: 'LinkedIn',
  //   link: 'https://www.linkedin.com/in/vicdotso',
  // },
  {
    label: 'Substack',
    link: 'https://vicdotso.substack.com/',
  },
  {
    label: 'Cal',
    link: 'https://cal.com/vic-tor/15min',
  },
]

