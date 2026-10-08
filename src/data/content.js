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
  status: "Looking for internships",
  gpa: "3.7",
  expectedGraduation: "Jun 2028",
};

export const links = {
  email: "mailto:bill2682004@gmail.com",
  emailDisplay: "bill2682004@gmail.com",
  github: "https://github.com/something0412",
  linkedin: "https://linkedin.com/in/phuocvinhle",
};

export const resumeUrl = "/resume.pdf";

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
        end: null,
        description: [
          "Debugged and maintained a full-stack job-scraping pipeline (Python + React), resolving broken queries and duplicate/malformed records across 5,000+ listings, cutting stale/incorrect data by 50%+",
          "Built a regex-based location classifier to tag 30,000+ scraped job listings by country at scrape time, replacing an unindexed 80-condition filter with a sargable lookup, improving load latency by about 98%",
          "Shipped 2 full-stack AI-scored practice features (Mock Interview, Elevator Pitch) with admin-configurable rubrics, implementing a rolling 30-day usage window to track and auto-reset free-tier attempt limits with no scheduled job required",
          "Diagnosed and fixed a production-only outage that silently blocked the audio playback/generation across both AI features, by replacing a blocked token-based Azure auth pattern with direct key-based access",
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
    name: "Spacecraft Telemetry Pipeline",
    thumbnail: spaceTeleThumb,
    description:
      "A full-stack telemetry pipeline that simulates spacecraft sensor drift with a random walk algorithm and injected out-of-bounds spikes, ingests readings through a FastAPI + Pydantic REST server with a full SQLite audit trail, and visualizes them on a live TypeScript/Chart.js dashboard that flags anomalies in real time.",
    github: "https://github.com/something0412/spacecraft_telemetry_pipeline",
    live: null,
    techs: ["Python", "FastAPI", "SQLite", "TypeScript", "Chart.js"],
  },
  {
    name: "Voice-Vault",
    thumbnail: voiceVaultThumb,
    description:
      "A serverless web app that converts text files into audio, with a React frontend on S3/CloudFront and a Lambda + API Gateway backend using pre-signed S3 URLs for secure uploads and downloads.",
    github: "https://github.com/something0412/voice-vault",
    live: "https://d4qejj20t2b30.cloudfront.net/",
    techs: ["AWS", "React", "JavaScript", "CSS"],
  },
  {
    name: "Live Chat",
    thumbnail: liveChatThumb,
    description:
      "A real-time chat app that lets users create rooms and talk instantly, powered by a React frontend and a Flask + Socket.io backend.",
    github: "https://github.com/something0412/live_chat",
    live: "",
    techs: ["React", "TypeScript", "Python", "Flask", "Socket.io", "MongoDB"],
  },
  {
    name: "To-Do Mobile App",
    thumbnail: todoThumb,
    description:
      "A fast, minimal task manager built with React Native and Expo, using AsyncStorage for reliable local storage.",
    github: "https://github.com/something0412/To-do-App",
    live: "",
    techs: ["React", "TypeScript", "Expo", "Tailwind"],
  },
  {
    name: "Portfolio v1",
    thumbnail: portfolioThumb,
    description:
      "An earlier version of this portfolio, built from scratch with React.",
    github: "https://github.com/something0412/Portfolio_Website",
    live: "",
    techs: ["AWS", "React", "TypeScript", "CSS"],
  },
];
