import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { NameTransition } from "./name";
import { writings } from "./_w";
import { Link } from "next-view-transitions";

// update later to have a picture / gif / video along with a description
const projects = [
  {
    title: "kitt2",
    url: "https://github.com/cs50victor/kitt2",
    media: "https://github.com/cs50victor/kitt2/assets/52110451/ef2f8b61-6870-4e44-8718-0f92ef90cefc",
    type: "video",
    description:
      "Real-time multimodal AI communication system using LiveKit. Renders 3D models into live video streams, enabling interactive AI avatars. Built with TypeScript and Python for the backend streaming capabilities.",
  },
  {
    title: "buildspace ai",
    url: "https://github.com/cs50victor/buildspace",
    media: "https://github.com/cs50victor/buildspace/assets/52110451/2a0e0750-e21e-4aa9-b856-0a7f7fb9c3b8",
    type: "video",
    description:
      "An AI-powered discovery platform for buildspace community members. Built using Rust for high-performance video transcription, it indexes over 300 builder profiles and their YouTube content. Features real-time conversational UI powered by LiveKit to help users find relevant connections and get AI-assisted responses backed by community data.",
  },
  {
    title: "newmedia",
    url: "https://github.com/cs50victor/newmedia",
    media: "https://images.unsplash.com/photo-1645526407847-52de201945f2?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "High-performance graphics engine built with Rust and Bevy for ML-powered image and video generation. Implements gaussian splatting for real-time rendering and streams frames via WebSocket. Focuses on realistic camera features and real-time audio lip-sync capabilities.",
  },
  {
    title: "pr_dedupe",
    url: "https://github.com/cs50victor/pr_dedupe",
    media: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=2088&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "GitHub Action that uses on-device code embedding to detect duplicate/similar pull requests. Helps open source maintainers automatically identify and manage redundant contributions by analyzing PR diffs using ML embeddings, all running directly on GitHub CI runners.",
  },
];

const WritingList=()=> {
  const heroPost = writings.find(w => w.hero);
  const otherPosts = writings.filter(w => !w.hero);

  return (
    <div className="mt-4">
      {heroPost && (
        <Link href={heroPost.slug} className="group">
          <div className="border-b border-gray-200 py-4 px-1 hover:bg-gray-50 hover:rounded-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium group-hover:text-zinc-600">
                {heroPost.title}
              </h4>
              <span className="text-sm text-gray-500">{heroPost.date}</span>
            </div>
            {heroPost.description && (
              <p className="text-gray-600 text-sm mt-1">{heroPost.description}</p>
            )}
          </div>
        </Link>
      )}
      
      <ul className="list-disc pl-4 mt-4 space-y-2">
        {otherPosts.map((writing, idx) => (
          <li key={idx}>
            <Link href={writing.slug} className="group">
              <div className="flex justify-between items-center px-1">
                <span className="flex-grow text-gray-600 group-hover:text-zinc-600 truncate pr-4">
                  {writing.title}
                </span>
                <span className="text-sm text-gray-500 group-hover:text-gray-600 flex-shrink-0">
                  {writing.date}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <div className="flex justify-between">
        <NameTransition />
        <div className="space-x-3">
          <a 
            href="#projects"
            className="text-zinc-700 hover:text-zinc-900 transition-colors duration-200 hover:underline underline-offset-5"
          >
            projects
          </a>
          <Link 
            href="/experience"
            className="text-zinc-700 hover:text-zinc-900 transition-colors duration-200 hover:underline underline-offset-5"
          >
            experience
          </Link>
        </div>
      </div>
      <p>
        I'm a software engineer working at {" "}
        <a
          href="https://www.linkedin.com/in/vicdotso"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-700 hover:text-zinc-900 transition-colors duration-200 underline underline-offset-5"
        >
          Open Interpreter
        </a>
        , building more intuitive / accessible ways to interact with computers by leveraging AI.
        Also pursuing a Masters in Data Science.
      </p>
      <div className="mb-20">
        <h2 className="font-medium">Writing</h2>
        <WritingList />
      </div>
      <div id="projects">
        <h3 className="font-medium">Some Cool Projects</h3>
        <ul className="divide-y divide-gray-200 my-2 list-disc">
          {projects.map((project, index) => (
            <li key={index} className="py-6 flex space-x-3">
              <div className="w-40 h-30 flex-shrink-0 overflow-hidden rounded-md">
                {(project.media.endsWith(".mp4") || project?.type === "video") ? (
                  <video
                    src={project.media}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                  />
                ) : (
                  <img
                    src={project.media}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <a
                  href={project.url}
                  className="font-medium text-zinc-700 hover:text-zinc-900"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {project.title}
                </a>
                <p className="text-gray-600 text-sm">
                  {project.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
        <a
          href="https://github.com/cs50victor"
          className="lowercase flex items-center text-gray-600 hover:text-gray-800"
          // className="text-sm text-gray-600 hover:text-gray-800 mt-4 inline-block"
        >
          See more on GitHub <ArrowUpRightIcon className="h-4 w-4 ml-1" />
        </a>
      </div>
    </>
  );
}
