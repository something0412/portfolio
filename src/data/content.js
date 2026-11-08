import java from "../assets/icons/java.png";
import python from "../assets/icons/python.png";
import typescript from "../assets/icons/typescript.png";
import cplus from "../assets/icons/cplus.png";
import csharp from "../assets/icons/csharp.png";
import html from "../assets/icons/html.png";
import css from "../assets/icons/css.png";
import sql from "../assets/icons/sql.png";
import react from "../assets/icons/react.png";
import nodejs from "../assets/icons/node.png";
import git from "../assets/icons/git.png";
import flask from "../assets/icons/flask.png";
import aws from "../assets/icons/aws.png";
import docker from "../assets/icons/docker.png";
import linux from "../assets/icons/linux.png";
import bash from "../assets/icons/bash.png";
import postgresql from "../assets/icons/postgresql.png";
import opencv from "../assets/icons/opencv.png";
import websocket from "../assets/icons/websocket.png";

import github from "../assets/icons/github.png";
import linkedin from "../assets/icons/linkedin.png";
import envelope from "../assets/icons/envelope.png";

import portfolioThumb from "../assets/images/portfolio_tn.png";
import todoThumb from "../assets/images/todo_tn.png";
import liveChatThumb from "../assets/images/live_chat_tn.png";
import voiceVaultThumb from "../assets/images/voicevault_tn.png";
import spaceTeleThumb from "../assets/images/space_tele_tn.png";
import lambdaMedClinic from "../assets/images/lambda_med_clinic_tn.webp";
import gestureLabs from "../assets/images/gesture_labs_tn.webp";

import bcLogo from "../assets/images/bc.jpeg";
import uhLogo from "../assets/images/uh.jpg";
import energyAiSolutionsLogo from "../assets/images/energyaisolutions_logo.jpeg";
import codeCoogsLogo from "../assets/images/coco_coogs.png";

export const profile = {
  name: "Phuoc Le",
  preferredName: "Bill",
  pronunciation: "foo-uke",
  role: "Computer Science Student, Aspiring Software Engineer",
  location: "Houston, TX",
  status: "Looking for Summer 2027 Internships",
  gpa: "3.7 / 4.0",
  expectedGraduation: "Jun 2028",
};

export const links = {
  email: "mailto:bill2682004@gmail.com",
  emailDisplay: "bill2682004@gmail.com",
  github: "https://github.com/something0412",
  linkedin: "https://linkedin.com/in/phuocvinhle",
};

export const resumeUrl = "/resume.pdf";
export const resumeFileName = "Phuoc_Le_Resume.pdf";

export const socials = [
  { name: "GitHub", icon: github, url: links.github },
  { name: "LinkedIn", icon: linkedin, url: links.linkedin },
  { name: "Email", icon: envelope, url: links.email },
];

export const skills = [
  {
    category: "Cloud & DevOps",
    items: [
      { name: "AWS", icon: aws },
      { name: "Docker", icon: docker },
      { name: "Linux", icon: linux },
      { name: "Bash", icon: bash },
    ],
  },
  {
    category: "Languages",
    items: [
      { name: "Python", icon: python },
      { name: "Java", icon: java },
      { name: "C++", icon: cplus },
      { name: "TypeScript", icon: typescript },
      { name: "C#", icon: csharp },
      { name: "SQL", icon: sql },
      { name: "HTML/CSS", icon: [html, css] },
    ],
  },
  {
    category: "Frameworks & Tools",
    items: [
      { name: "React", icon: react },
      { name: "Node.js", icon: nodejs },
      { name: "Git", icon: git },
      { name: "Flask", icon: flask },
      { name: "WebSocket", icon: websocket },
      { name: "PostgreSQL", icon: postgresql },
      { name: "OpenCV", icon: opencv },
    ],
  },
];

export const education = [
  {
    name: "University of Houston",
    href: "https://www.uh.edu",
    logo: uhLogo,
    positions: [
      {
        title: "B.S. in Computer Science",
        start: "Aug 2025",
        end: "Jun 2028, expected",
        description: [],
      },
    ],
  },
  {
    name: "Bellevue College",
    href: "https://www.bellevuecollege.edu",
    logo: bcLogo,
    positions: [
      {
        title: "A.S. in Computer Science",
        start: "Sep 2022",
        end: "Jun 2024",
        description: [],
      },
    ],
  },
];

export const career = [
  {
    name: "Energy AI Solutions",
    href: null,
    logo: energyAiSolutionsLogo,
    positions: [
      {
        title: "Full-Stack Software Development Intern",
        start: "Jun 2026",
        end: "Nov 2026",
        description: [
          "Built and shipped two AI-scored interview-practice features end-to-end (Python/Flask, React, Azure AI Foundry): text-to-speech prompts, audio storage in Azure Blob Storage, speech-to-text, and LLM scoring against admin-configurable rubrics", 
          "Stopped speech-to-text from hallucinating transcripts of silent or noisy recordings by adding pre-transcription checks for volume, minimum length, and long silences, so only real answers reach LLM scoring",
          "Diagnosed a production-only outage that broke audio in both AI features: with no cloud log access, built a database-backed error log, traced failures to firewall-blocked token requests, and moved to key-based auth stored in server-side environment variables",
          "Cut job-listing load time from ~42s to ~800ms on a 30K+ listing production database by replacing an ~80-clause NOT LIKE filter with a regex country classifier in the nightly scrape job and an indexed country column", 
          "Normalized the scraper's schema into a unique-listings table with a one-to-many locations table, eliminating ~25% redundant rows, and added a 14-day retention cleanup to the nightly job to bound table growth",
        ],
      },
    ],
  },
  {
    name: "Code [Coogs], University of Houston Organization",
    href: null,
    logo: codeCoogsLogo,
    logoScale: 1.95,
    logoBg: "dark",
    positions: [
      {
        title: "Software Development Officer",
        start: "Jun 2026",
        end: null,
        description: [
          "Optimized page load and data-fetching performance on the club's public website (Next.js), reducing load time by approximately 20%",
          "Fixed UI bugs and restructured the Supabase database for the members' web app, added missing foreign keys, and backfilled missing data, improving reliability for 60+ active members",
        ],
      },
    ],
  },
  {
    name: "Bellevue College",
    href: "https://www.bellevuecollege.edu",
    logo: bcLogo,
    positions: [
      {
        title: "Finance Lead, Tech Club",
        start: "2023",
        end: "2024",
        description: [
          "Led financial operations for a 50+ member tech club",
          "Built a budget management system and secured funding for 3+ major events",
        ],
      },
      {
        title: "Student Engagement Front Desk Assistant",
        start: "2023",
        end: "2024",
        description: [
          "Assisted 30+ students daily and managed the student ID database",
        ],
      },
    ],
  },
];

export const projects = [
  {
    name: "Lambda Medical Clinic",
    thumbnail: lambdaMedClinic,
    description:
      "A full-stack management system for a multi-office clinic, covering the patient journey from online booking to payment through 6 role-based portals, backed by a PostgreSQL database of 46 tables with 16 triggers. As technical lead of a 5-person team, I set up the initial codebase, reviewed teammates' PRs before merging, and deployed the full app on Vercel. My responsibilities included designing the database schema, building session-based authentication with role-based access control (RBAC) for all 6 roles, developing most of the React/TypeScript frontend, and creating a Jest-tested mock billing system that calculates invoice totals automatically, guarded by an audit-trail trigger that rejects unattributed edits.",
    github: "https://github.com/something0412/cosc3380-team9-medical-clinic-backend",
    live: "https://cosc3380-team9-lambda.vercel.app/",
    techs: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind", "Jest"],
    type: "Team Lead",
  },
  {
    name: "Spacecraft Telemetry Pipeline",
    thumbnail: spaceTeleThumb,
    description:
      "A full-stack telemetry pipeline that simulates spacecraft sensor drift with a random walk algorithm and injected out-of-bounds spikes, ingests readings through a FastAPI + Pydantic REST server with a full SQLite audit trail, and visualizes them on a live TypeScript/Chart.js dashboard that flags anomalies in real time.",
    github: "https://github.com/something0412/spacecraft_telemetry_pipeline",
    live: null,
    techs: ["Python", "FastAPI", "SQLite", "TypeScript", "Chart.js"],
    type: "Personal",
  },
  {
    name: "Voice-Vault",
    thumbnail: voiceVaultThumb,
    description:
      "A serverless web app that converts text files into audio, with a React frontend on S3/CloudFront and a Lambda + API Gateway backend using pre-signed S3 URLs for secure uploads and downloads.",
    github: "https://github.com/something0412/voice-vault",
    live: "https://d4qejj20t2b30.cloudfront.net/",
    techs: ["AWS", "React", "JavaScript", "CSS"],
    type: "Personal",
  },
  {
    name: "Live Chat",
    thumbnail: liveChatThumb,
    description:
      "A real-time chat app that lets users create rooms and talk instantly, powered by a React frontend and a Flask + Socket.io backend.",
    github: "https://github.com/something0412/live_chat",
    live: "",
    techs: ["React", "TypeScript", "Python", "Flask", "Socket.io", "MongoDB"],
    type: "Personal",
  },
  {
    name: "To-Do Mobile App",
    thumbnail: todoThumb,
    description:
      "A fast, minimal task manager built with React Native and Expo, using AsyncStorage for reliable local storage.",
    github: "https://github.com/something0412/To-do-App",
    live: "",
    techs: ["React", "TypeScript", "Expo", "Tailwind"],
    type: "Personal",
  },
  {
    name: "Portfolio v1",
    thumbnail: portfolioThumb,
    description:
      "An earlier version of this portfolio, built from scratch with React.",
    github: "https://github.com/something0412/Portfolio_Website",
    live: "",
    techs: ["AWS", "React", "TypeScript", "CSS"],
    type: "Personal",
  },
];

export const upcomingProjects = [
  {
    name: "Rhabit",
    thumbnail: null,
    description:
      "A daily self-discipline training app",
    github: "",
    live: "",
    techs: [],
    type: "Coming Soon",
  },
  {
    name: "MajorMag",
    thumbnail: null,
    description:
      "An interactive 3D web app that helps students understand different careers and industries before choosing a major.",
    github: "",
    live: "",
    techs: [],
    type: "Coming Soon",
  },
];

export const hackathons = [{
    name: "Gesture Labs",
    thumbnail: gestureLabs,
    description:
      "GestureLabs was curated to assist the creatives who want to make music learn the intuition behind audio effects using a guided AI-Assisted Visual experience. The app uses real-time hand tracking directly in the browser, mapping multiple hand gestures to sound effect parameters so users can control and modify audio entirely through hand movements, without needing physical controls.",
    github: "",
    live: "https://gesturelabs.us/",
    techs: ["Next.js", "TypeScript", "MediaPipe", "Gemini API", "Tiger Data", "CLAUDE"],
    type: "CodeRED",
  },
];
