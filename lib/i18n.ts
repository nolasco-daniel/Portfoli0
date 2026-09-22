export type Lang = "es" | "en";

export const LANGUAGES: Lang[] = ["es", "en"];
export const DEFAULT_LANG: Lang = "en";

type Leaf = Record<Lang, string>;
type Node = Leaf | { [key: string]: Node };

function isLeaf(node: Node): node is Leaf {
  return typeof (node as Leaf).es === "string";
}

export const DICT = {
  picker: {
    season: { es: "Season", en: "Season" },
    language: { es: "Language", en: "Language" },
  },
  seasons: {
    spring: { es: "Spring", en: "Spring" },
    summer: { es: "Summer", en: "Summer" },
    autumn: { es: "Autumn", en: "Autumn" },
    winter: { es: "Winter", en: "Winter" },
  },
  nav: {
    aria: { es: "Sections", en: "Sections" },
    home: { es: "Home", en: "Home" },
    stack: { es: "Stack", en: "Stack" },
    experience: { es: "Experience", en: "Experience" },
    project: { es: "Project", en: "Project" },
    contact: { es: "Contact", en: "Contact" },
  },
  header: {
    availability: { es: "Open to Work", en: "Open to Work" },
  },
  hero: {
    greeting: { es: "Hi, I am", en: "Hi, I am" },
    roleLine: { es: "Jr. Software Developer.", en: "Jr. Software Developer." },
    tagline: {
      es: "Building practical systems for real business and operational problems.",
      en: "Building practical systems for real business and operational problems.",
    },
    cv: { es: "Download CV", en: "Download CV" },
    hire: { es: "Contact me", en: "Contact me" },
    scroll: { es: "Scroll to explore", en: "Scroll to explore" },
    keysHint: { es: "hover over the keys", en: "hover over the keys" },
  },
  stack: {
    title: { es: "Tech Stack", en: "Tech Stack" },
    hint: { es: "(hint: hover over a key)", en: "(hint: hover over a key)" },
    hintMobile: { es: "The tools I build with.", en: "The tools I build with." },
  },
  experience: {
    title: { es: "Experience", en: "Experience" },
    subtitle: { es: "Internship, education, and project work.", en: "Internship, education, and project work." },
  },
  projects: {
    kicker: { es: "project", en: "project" },
    viewMore: { es: "View more", en: "View more" },
    openSite: { es: "Visit site", en: "Visit site" },
    viewCode: { es: "View code", en: "View code" },
    close: { es: "Close", en: "Close" },
    stackLabel: { es: "Stack", en: "Stack" },
    overview: { es: "Overview", en: "Overview" },
  },
  contact: {
    kicker: { es: "contact", en: "contact" },
    title: { es: "Let's talk?", en: "Let's talk?" },
    body: {
      es: "I am open to opportunities where I can build useful systems and keep learning with a strong team.",
      en: "I am open to opportunities where I can build useful systems and keep learning with a strong team.",
    },
    copyEmail: { es: "Copy email", en: "Copy email" },
    openMail: { es: "Open mailto", en: "Open mailto" },
    github: { es: "GitHub", en: "GitHub" },
    linkedin: { es: "LinkedIn", en: "LinkedIn" },
    emailToast: { es: "Email copied", en: "Email copied" },
    footer: {
      es: "(c) 2026 Daniel Nolasco. All rights reserved.",
      en: "(c) 2026 Daniel Nolasco. All rights reserved.",
    },
  },
  keyboard: {
    taglines: {
      mysql: { es: "Database design, queries, and relational workflows.", en: "Database design, queries, and relational workflows." },
      php: { es: "Backend development for database-driven systems.", en: "Backend development for database-driven systems." },
      javascript: { es: "Frontend logic and dynamic browser experiences.", en: "Frontend logic and dynamic browser experiences." },
      rest: { es: "API integration and client-server communication.", en: "API integration and client-server communication." },
      python: { es: "Desktop apps, automation, and backend logic.", en: "Desktop apps, automation, and backend logic." },
      html5: { es: "Semantic structure for responsive web pages.", en: "Semantic structure for responsive web pages." },
      css: { es: "Clean layouts, responsive styling, and UI polish.", en: "Clean layouts, responsive styling, and UI polish." },
      nodedotjs: { es: "APIs and backend-connected JavaScript tools.", en: "APIs and backend-connected JavaScript tools." },
      docker: { es: "Containerized environments for consistent setup.", en: "Containerized environments for consistent setup." },
      googlecloud: { es: "Cloud platforms explored for app deployment.", en: "Cloud platforms explored for app deployment." },
      godotengine: { es: "Game scenes, nodes, and gameplay systems.", en: "Game scenes, nodes, and gameplay systems." },
      cplusplus: { es: "Core programming fundamentals and performance-minded logic.", en: "Core programming fundamentals and performance-minded logic." },
      gdscript: { es: "Gameplay scripts for Godot projects.", en: "Gameplay scripts for Godot projects." },
      figma: { es: "Interface planning and UI/UX design work.", en: "Interface planning and UI/UX design work." },
      git: { es: "Version control with Git and GitHub.", en: "Version control with Git and GitHub." },
      react: { es: "Component-driven web interfaces.", en: "Component-driven web interfaces." },
      tailwindcss: { es: "Fast utility styling for modern dashboards.", en: "Fast utility styling for modern dashboards." },
      sqlite: { es: "Lightweight local database storage for apps and games.", en: "Lightweight local database storage for apps and games." },
    },
  },
} as const satisfies Record<string, Node>;

export function translate(path: string, lang: Lang): string {
  const parts = path.split(".");
  let ref: Node = DICT as unknown as Node;
  for (const p of parts) {
    if (isLeaf(ref)) return path;
    ref = (ref as { [key: string]: Node })[p];
    if (ref === undefined) return path;
  }
  if (isLeaf(ref)) return ref[lang] ?? ref.es ?? path;
  return path;
}

