export type ProjectCategory =
  | "Business tools"
  | "Digital experiences"
  | "Data & intelligence";
export type ShowcaseProject = {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  demo: string;
  repository: string;
  image: string;
  imageType: "Repository artwork" | "Repository screenshot";
  imageWidth: number;
  imageHeight: number;
  surface: string;
  access: string;
  tags: string[];
  featured?: boolean;
};

// User-supplied projects. Descriptions and assets come from the linked repositories.
// Demo destinations were checked on 2026-10-19. This is public presentation content,
// separate from KOBAC's existing database-backed portfolio and case-study editor.
export const projectCatalog: ShowcaseProject[] = [
  {
    id: "uncannystranger",
    title: "Uncanny Stranger",
    category: "Digital experiences",
    description:
      "A cinematic photography portfolio bringing visual stories, galleries, and an editorial browsing experience together.",
    demo: "https://uncannystranger.com",
    repository: "https://github.com/uncannystranger/uncannystranger",
    image: "/projects/uncannystranger.webp",
    imageType: "Repository screenshot",
    imageWidth: 1280,
    imageHeight: 800,
    surface: "#111b16",
    access: "Public website",
    tags: ["Photography", "Editorial", "Digital identity"],
    featured: true,
  },
  {
    id: "digital-invoice",
    title: "Digital Invoice",
    category: "Business tools",
    description:
      "Somali-first invoicing with live invoice previews, customer management, payment tracking, and browser-based PDF export.",
    demo: "https://digital-invoice-inky.vercel.app",
    repository: "https://github.com/uncannystranger/digital_invoice",
    image: "/projects/digital-invoice.webp",
    imageType: "Repository artwork",
    imageWidth: 1200,
    imageHeight: 280,
    surface: "#f7f8f4",
    access: "Frontend demo · Sign-in",
    tags: ["Invoicing", "Somali-first", "React"],
    featured: true,
  },
  {
    id: "xaadir",
    title: "Xaadir",
    category: "Business tools",
    description:
      "A school attendance prototype with admin and teacher workspaces, familiar classroom registers, and reporting interfaces.",
    demo: "https://xaadir.vercel.app",
    repository: "https://github.com/uncannystranger/xaadir",
    image: "/projects/xaadir.webp",
    imageType: "Repository artwork",
    imageWidth: 1280,
    imageHeight: 448,
    surface: "#f7faf8",
    access: "Prototype · Sign-in",
    tags: ["Education", "Attendance", "Next.js"],
  },
  {
    id: "sahafi",
    title: "Sahafi Rent Book",
    category: "Business tools",
    description:
      "A bilingual restaurant credit ledger for recording meals, partial payments, outstanding balances, and customer accounts.",
    demo: "https://sahafi-restuarant.vercel.app",
    repository: "https://github.com/uncannystranger/sahafi-restuarant",
    image: "/projects/sahafi.webp",
    imageType: "Repository artwork",
    imageWidth: 1280,
    imageHeight: 420,
    surface: "#efe7d6",
    access: "Browser application",
    tags: ["Hospitality", "Credit ledger", "Bilingual"],
  },
  {
    id: "diiwaan",
    title: "Diiwaan",
    category: "Business tools",
    description:
      "QR-based queue management for Somali businesses, connecting a public customer view with a dedicated staff workspace.",
    demo: "https://diiwaan-so.vercel.app",
    repository: "https://github.com/uncannystranger/diiwaan.so",
    image: "/projects/diiwaan.webp",
    imageType: "Repository artwork",
    imageWidth: 1200,
    imageHeight: 320,
    surface: "#11232e",
    access: "Public website",
    tags: ["Queue management", "QR", "Soomaali"],
    featured: true,
  },
  {
    id: "gurey-group",
    title: "Gurey Group",
    category: "Business tools",
    description:
      "A retail operations platform bringing point of sale, inventory, branches, and reporting into one workspace.",
    demo: "https://gureygroup.vercel.app",
    repository: "https://github.com/uncannystranger/gureygroup",
    image: "/projects/gureygroup.webp",
    imageType: "Repository screenshot",
    imageWidth: 1280,
    imageHeight: 597,
    surface: "#0c111c",
    access: "Workspace · Sign-in",
    tags: ["Commerce", "Inventory", "Retail operations"],
  },
  {
    id: "sentinel",
    title: "Sentinel",
    category: "Data & intelligence",
    description:
      "A cyber intelligence dashboard pairing a 3D globe with public CISA vulnerability data and illustrative traffic routes.",
    demo: "https://uncannystranger.github.io/Cyber-Threat-Live-Dashboard/",
    repository:
      "https://github.com/uncannystranger/Cyber-Threat-Live-Dashboard",
    image: "/projects/sentinel.webp",
    imageType: "Repository artwork",
    imageWidth: 1200,
    imageHeight: 320,
    surface: "#080d16",
    access: "Public dashboard",
    tags: ["Cybersecurity", "Data visualization", "Three.js"],
    featured: true,
  },
];
