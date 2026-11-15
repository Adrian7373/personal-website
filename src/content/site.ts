/**
 * All site content lives in this file.
 * Edit text, links, projects and services here; no component code needs to change.
 *
 * Anything wrapped in [square brackets] is a PLACEHOLDER waiting for real content.
 * Search this file for "[" to find everything still to fill in.
 */

export type SocialLink = { label: string; href: string };

export type Fact = { label: string; value: string };

export type SkillGroup = { title: string; items: string[] };

export type Project = {
  title: string;
  /** The title as it is stacked in its panel: two lines, broken at a word or at the name's inner capital. */
  titleLines?: string[];
  /** Short label shown beside the project number, e.g. "AI video automation". */
  category: string;
  summary: string;
  /** Recognizable things from the project. These become the components around the title in its showcase panel. */
  components: string[];
  /** Path under /public, e.g. "/projects/my-app.png". Leave "" if there is no screenshot yet. */
  image: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
};

export type Service = { title: string; description: string };

export type ExperienceItem = {
  role: string;
  organization: string;
  period: string;
  description: string;
};

export type Testimonial = { quote: string; name: string; title: string };

export const site = {
  meta: {
    title: "Adrian Gabriel Ablaza | Full-Stack Software Developer",
    description:
      "Full-stack software developer from Cabanatuan City, Nueva Ecija, building web apps with AI-driven, agentic workflows.",
  },

  person: {
    name: "Adrian Gabriel Ablaza",
    role: "Full-Stack Software Developer",
    tagline: "I make it work. Then make it right.",
    location: "Cabanatuan City, Nueva Ecija",
    email: "ablazaadrian3@gmail.com",
    /** Path under /public. Leave "" to show a placeholder box. */
    photo: "",
    /** Put the PDF in /public and point to it here, e.g. "/resume.pdf". Leave "" to hide the resume buttons. */
    resumeUrl: "",
    availability: "Open to internship opportunities and freelance projects",
  },

  about: {
    heading: "About",
    paragraphs: [
      "I'm a graduating student at NEUST, based in Cabanatuan City. I care about building software that is useful, reliable and easy to keep improving.",
      "My focus is AI-driven programming and agentic workflows, and I'm currently learning how to develop effectively with AI. I'm looking for an internship where I can put that to work on real products.",
    ],
    /** Short notes pinned beside the text. The last one is drawn in pen. */
    facts: [
      { label: "School", value: "NEUST, graduating" },
      { label: "Based in", value: "Cabanatuan City, Nueva Ecija" },
      { label: "Focus", value: "AI-driven programming and agentic workflows" },
      { label: "Looking for", value: "An internship on real products" },
    ] as Fact[],
  },

  skills: {
    heading: "Skills and tech stack",
    groups: [
      {
        title: "Frontend",
        items: ["Next.js", "React", "JavaScript", "TypeScript", "Tailwind CSS", "Vite", "Claude Design"],
      },
      {
        title: "Backend",
        items: [
          "Node.js",
          "Express.js",
          "Python",
          "Flask",
          "PostgreSQL",
          "MongoDB",
          "Prisma",
          "Supabase",
          "OAuth",
          "JWT",
          "REST",
        ],
      },
      { title: "Mobile", items: ["Kotlin", "Android"] },
      { title: "DevOps and cloud", items: ["AWS S3", "Docker", "Vercel", "Render"] },
      { title: "Developer tools", items: ["Git", "GitHub", "VS Code", "Figma"] },
    ] as SkillGroup[],
  },

  /** Drafted from each repository's README. Correct anything that is off. */
  projects: {
    heading: "Projects",
    items: [
      {
        title: "Scroll Maestro",
        titleLines: ["Scroll", "Maestro"],
        category: "AI video automation",
        summary:
          "Turns a long video into short, captioned clips and schedules them to TikTok and YouTube Shorts. It transcribes the video, picks the strongest moments, and renders vertical clips with burned-in captions.",
        components: [
          "A long video timeline being cut into vertical clips",
          "Caption style chips such as Karaoke, Neon and Marker",
          "A scheduling calendar with clips dropped onto days",
          "Connected TikTok and YouTube Shorts account chips",
        ],
        image: "",
        tags: ["Next.js", "TypeScript", "BullMQ", "FFmpeg", "Gemini", "Groq Whisper", "PostgreSQL", "Prisma", "AWS S3"],
        liveUrl: "https://scrollmaestro.vercel.app",
        repoUrl: "https://github.com/Adrian7373/video-processing-and-content-automation-platform",
      },
      {
        title: "Kae & Jae Cafe",
        titleLines: ["Kae & Jae", "Cafe"],
        category: "Ordering and store management",
        summary:
          "Online ordering for a cafe in Cabanatuan City. Customers browse a live menu, pin their address on a map for distance-based delivery fees, pay through PayMongo and track the order in real time, while staff run the menu and orders from a dashboard.",
        components: [
          "A menu item card with an add-to-cart button",
          "A map with a delivery radius circle and a dropped pin",
          "An order tracker moving from Pending to Preparing to Out for delivery",
          "The store Open/Closed switch from the admin dashboard",
        ],
        image: "",
        tags: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "Leaflet", "PayMongo"],
        liveUrl: "https://kaeandjaecafe.vercel.app",
        repoUrl: "https://github.com/Adrian7373/KaeAndJaeCafe",
      },
      {
        title: "QuizWarp",
        titleLines: ["Quiz", "Warp"],
        category: "AI learning platform",
        summary:
          "Generates quizzes from text, files or images in seconds, then makes them a game. Teachers host live sessions with join codes and team play, assign homework, and get reports with AI insights on where the class is struggling.",
        components: [
          "A multiple-choice question card with one answer selected",
          "A live session join code",
          "A streak counter with a confetti reward",
          "A team leaderboard",
        ],
        image: "",
        tags: ["Next.js", "TypeScript", "Flask", "Gemini", "Prisma", "PostgreSQL", "Supabase"],
        liveUrl: "https://quizify-ai-driven-quiz-generation-a-zeta.vercel.app",
        repoUrl: "https://github.com/Adrian7373/QuizWarp",
      },
      {
        title: "KronoKeep",
        titleLines: ["Krono", "Keep"],
        category: "Android app",
        summary:
          "A vault for the things you own. Log vehicles, appliances and electronics with their receipts and warranties, and the app predicts when maintenance is due from how much you actually use them, then exports a verified service history when you sell.",
        components: [
          "An asset card for a vehicle with its odometer reading",
          "A maintenance-due prediction with a countdown",
          "A stored receipt or warranty document",
          "A verified maintenance PDF with a QR code",
        ],
        image: "",
        tags: ["Kotlin", "Android", "Room", "Supabase"],
        liveUrl: "",
        repoUrl: "https://github.com/Adrian7373/KronoKeep",
      },
      {
        title: "CraveWise",
        titleLines: ["Crave", "Wise"],
        category: "Android app",
        summary:
          "Helps you decide what to cook. Enter the ingredients you have and see what you can make now, take a quick quiz when you can't choose, and follow recipes in a cook mode with timers. Allergies and disliked ingredients are filtered out everywhere.",
        components: [
          "Pantry ingredient chips",
          "Recipe cards sorted into Cook now and Almost there",
          "A Help me decide quiz question",
          "A cook mode step with a running timer",
        ],
        image: "",
        tags: ["Kotlin", "Android", "Room", "DataStore"],
        liveUrl: "",
        repoUrl: "https://github.com/Adrian7373/CraveWise",
      },
    ] as Project[],
  },

  /** Draft services. Adjust to what you actually want to offer. */
  services: {
    heading: "Services",
    intro: "I take on small freelance projects, from a single page to a complete web app.",
    items: [
      {
        title: "Full-stack web apps",
        description:
          "A working web application built end to end: interface, API, database and sign-in, deployed and ready to use.",
      },
      {
        title: "Landing pages and portfolios",
        description:
          "A fast, responsive site for a business, product or person that looks right on phones and desktops.",
      },
      {
        title: "APIs and databases",
        description:
          "A REST backend with a clean data model and secure authentication that your app or front end can build on.",
      },
    ] as Service[],
  },

  /** Hidden until after the internship. Set enabled to true and add items to show it. */
  experience: {
    enabled: false,
    heading: "Experience and education",
    items: [] as ExperienceItem[],
  },

  /** Hidden until there are real quotes. Set enabled to true and add items to show it. */
  testimonials: {
    enabled: false,
    heading: "Testimonials",
    items: [] as Testimonial[],
  },

  contact: {
    heading: "Contact",
    intro: "Hiring an intern or have a project in mind? Send a message and I'll get back to you.",
    socials: [
      { label: "GitHub", href: "https://github.com/Adrian7373" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/adrian-ablaza-78a474389/" },
      { label: "Facebook", href: "https://www.facebook.com/adrian.ablaza.71/" },
    ] as SocialLink[],
  },
};

export type Site = typeof site;
