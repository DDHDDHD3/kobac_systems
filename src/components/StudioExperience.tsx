import React, { useEffect, useRef, useState } from "react";
import {
  m,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  type MotionValue,
} from "motion/react";
import { ArrowDown, ArrowUpRight, Github } from "lucide-react";
import { projectCatalog, type ShowcaseProject } from "../data/projectCatalog";
import {
  useFineMotion,
  useQuietMotion,
  MotionButton,
} from "./TechnologyMotion";
import type { PublicPage } from "./PublicWebsite";

const leaf = "M300 283C251 243 263 193 300 168C337 193 349 243 300 283Z";
function LeafSculpture() {
  const quiet = useQuietMotion();
  const fine = useFineMotion();
  const ref = useRef<HTMLDivElement>(null);
  const pointer = useMotionValue(0);
  const yaw = useSpring(pointer, { stiffness: 110, damping: 22 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const pitch = useTransform(scrollYProgress, [0, 1], [30, 70]);
  return (
    <div
      className={`studio-art ${quiet ? "studio-art--quiet" : ""}`}
      ref={ref}
      onPointerMove={(event) => {
        if (fine && !quiet) {
          const rect = event.currentTarget.getBoundingClientRect();
          pointer.set(((event.clientX - rect.left) / rect.width - 0.5) * 40);
        }
      }}
      onPointerLeave={() => pointer.set(0)}
    >
      <div className="studio-art-label">
        <span>K / SYSTEMS IN MOTION</span>
        <span>↗</span>
      </div>
      <div className="sculpture-platform" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <m.div
        className="sculpture-float"
        aria-hidden="true"
        initial={quiet ? false : { y: 100, opacity: 0, rotate: -30 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <m.svg
          viewBox="85 85 430 430"
          className="leaf-sculpture"
          style={{
            rotateX: quiet ? 25 : pitch,
            rotateY: quiet || !fine ? -12 : yaw,
          }}
        >
          <defs>
            <linearGradient
              id="sculpture-face"
              x1="150"
              y1="130"
              x2="420"
              y2="440"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#fffce8" />
              <stop offset=".45" stopColor="#e6ebcf" />
              <stop offset="1" stopColor="#9cac7b" />
            </linearGradient>
          </defs>
          {Array.from({ length: 14 }, (_, i) => (
            <g
              key={i}
              transform={`translate(${(14 - i) * 1.1} ${(14 - i) * 2.3})`}
              fill={i < 10 ? "#244431" : "#52704a"}
            >
              {[0, 120, 240].map((angle) => (
                <path
                  key={angle}
                  transform={`rotate(${angle} 300 300)`}
                  d={leaf}
                />
              ))}
            </g>
          ))}
          <g fill="url(#sculpture-face)" stroke="#f7fbe0" strokeWidth="1.6">
            {[0, 120, 240].map((angle) => (
              <path
                key={angle}
                transform={`rotate(${angle} 300 300)`}
                d={leaf}
              />
            ))}
          </g>
          <circle cx="307" cy="315" r="17" fill="#8c611d" />
          <circle
            cx="300"
            cy="300"
            r="17"
            fill="#f5a623"
            stroke="#fff0aa"
            strokeWidth="2"
          />
        </m.svg>
      </m.div>
      <div className="studio-art-caption">
        <span>
          People.
          <br />
          Process.
          <br />
          Technology.
        </span>
        <span>
          Separate parts.
          <br />
          <strong>One connected system.</strong>
        </span>
      </div>
    </div>
  );
}

export function StudioHero({
  navigate,
}: {
  navigate: (page: PublicPage) => void;
}) {
  const quiet = useQuietMotion();
  return (
    <section className="studio-hero" aria-labelledby="hero-title">
      <div className="studio-hero-top">
        <span>DIGITAL SOLUTIONS BUILT FOR SOMALIA</span>
        <span>MOGADISHU ↗</span>
      </div>
      <div className="studio-hero-grid">
        <div className="studio-hero-copy">
          <h1 id="hero-title" aria-label="Technology that moves you forward.">
            {["Technology", "that moves", "you forward."].map((line, index) => (
              <span className="studio-line" aria-hidden="true" key={line}>
                <m.span
                  initial={quiet ? false : { y: "115%", rotate: 5 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{
                    duration: 0.95,
                    delay: index * 0.11,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {line}
                </m.span>
              </span>
            ))}
          </h1>
          <div className="studio-hero-copy-bottom">
            <p>
              Practical software. Connected operations.
              <br />
              Digital solutions that move your business forward — built around
              the way you work.
            </p>
            <MotionButton
              className="studio-start"
              onClick={() => navigate("wizard")}
            >
              <span>
                Let's build
                <br /> what's next.
              </span>
              <ArrowUpRight size={26} />
            </MotionButton>
          </div>
        </div>
        <LeafSculpture />
      </div>
      <div className="studio-hero-foot">
        <a href="#connected-work">
          Scroll. See things connect. <ArrowDown size={15} />
        </a>
        <MotionButton onClick={() => navigate("portfolio")}>
          Explore our work <ArrowUpRight size={17} />
        </MotionButton>
        <span>SOFTWARE / OPERATIONS / TRANSFORMATION</span>
      </div>
    </section>
  );
}

type Box = { left: number; top: number; width: number };
type Layout = { start: Box; end: Box };

/** Adapted from Codrops' MIT ScrollBasedLayoutAnimations triggerFlipOnScroll:
 * capture the expanded layout, restore the original, then scrub toward the captured state.
 * Uses existing Motion values and native sticky instead of adding GSAP/Lenis.
 * Original source and full license: public/licenses/codrops-scroll-layout.txt.
 */
function useCapturedLayout(
  ref: React.RefObject<HTMLDivElement | null>,
  quiet: boolean,
) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  useEffect(() => {
    const gallery = ref.current;
    if (!gallery) return;
    if (quiet) {
      setLayouts([]);
      return;
    }
    const measure = () => {
      const items = Array.from(
        gallery.querySelectorAll<HTMLElement>(".layout-item"),
      );
      const read = (item: HTMLElement): Box => ({
        left: item.offsetLeft,
        top: item.offsetTop,
        width: item.offsetWidth,
      });
      const start = items.map(read);
      gallery.classList.add("layout--expanded");
      const end = items.map(read);
      gallery.classList.remove("layout--expanded");
      setLayouts(start.map((box, index) => ({ start: box, end: end[index] })));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(gallery);
    return () => observer.disconnect();
  }, [quiet]);
  return layouts;
}

function LayoutItem({
  project,
  layout,
  progress,
}: {
  project: ShowcaseProject;
  layout?: Layout;
  progress: MotionValue<number>;
}) {
  const quiet = useQuietMotion();
  const x = useTransform(
    progress,
    [0, 1],
    [0, layout ? layout.end.left - layout.start.left : 0],
  );
  const y = useTransform(
    progress,
    [0, 1],
    [0, layout ? layout.end.top - layout.start.top : 0],
  );
  const scale = useTransform(
    progress,
    [0, 1],
    [1, layout ? layout.end.width / Math.max(1, layout.start.width) : 1],
  );
  const imageScale = useTransform(progress, [0, 1], [1.5, 1]);
  return (
    <m.div
      className="layout-item"
      style={{
        x: quiet ? 0 : x,
        y: quiet ? 0 : y,
        scale: quiet ? 1 : scale,
        background: project.surface,
      }}
    >
      <m.img
        src={project.image}
        alt=""
        width={project.imageWidth}
        height={project.imageHeight}
        loading="lazy"
        decoding="async"
        style={{ scale: quiet ? 1 : imageScale }}
      />
      <span>{project.title}</span>
    </m.div>
  );
}

export function ConnectedGallery() {
  const scene = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: scene,
    offset: ["start start", "end end"],
  });
  const progress = useTransform(scrollYProgress, [0.05, 0.85], [0, 1]);
  const smooth = useSpring(progress, {
    stiffness: 180,
    damping: 32,
    mass: 0.45,
  });
  const layouts = useCapturedLayout(gallery, quiet);
  const symbolScale = useTransform(smooth, [0, 0.8], [1, 0.2]);
  const symbolOpacity = useTransform(smooth, [0, 0.55], [1, 0]);
  const projects = projectCatalog.filter((project) => project.featured);
  return (
    <section
      className={`connected-scene ${quiet ? "connected-scene--quiet" : ""}`}
      ref={scene}
      id="connected-work"
      aria-labelledby="connected-title"
    >
      <div className="connected-sticky">
        <div className="connected-heading">
          <p>01 / CONNECTED BY DESIGN</p>
          <h2 id="connected-title">
            Separate parts.
            <br />
            <span>One connected system.</span>
          </h2>
        </div>
        <div className="layout-canvas" ref={gallery} aria-hidden="true">
          <m.div
            className="layout-symbol"
            style={{
              scale: quiet ? 1 : symbolScale,
              opacity: quiet ? 0 : symbolOpacity,
            }}
          >
            <span>
              +<br />
              KOBAC
            </span>
          </m.div>
          {projects.map((project, index) => (
            <LayoutItem
              project={project}
              key={project.id}
              layout={layouts[index]}
              progress={smooth}
            />
          ))}
        </div>
        <span className="connected-caption">
          A collection of real projects. Explore the experiences below.{" "}
          <ArrowDown size={14} />
        </span>
      </div>
    </section>
  );
}

function WorkScene({
  project,
  index,
}: {
  project: ShowcaseProject;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(
    scrollYProgress,
    [0, 0.42, 0.7, 1],
    [0.62, 1, 1, 0.9],
  );
  const y = useTransform(scrollYProgress, [0, 0.5, 1], [120, 0, -100]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.3, 1, 1.1]);
  return (
    <article
      className="cinema-scene"
      ref={ref}
      aria-labelledby={`cinema-${project.id}`}
    >
      <div className="cinema-stage">
        <m.div
          className="cinema-backdrop"
          aria-hidden="true"
          style={{
            scale: quiet ? 1 : backgroundScale,
            backgroundImage: `url(${project.image})`,
            backgroundColor: project.surface,
          }}
        />
        <div className="cinema-shade" aria-hidden="true" />
        <div className="cinema-topline">
          <span>0{index + 1} / SELECTED WORK</span>
          <span>
            {project.category}
            <br />
            {project.imageType}
          </span>
        </div>
        <m.a
          className="cinema-preview"
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} demo (new tab)`}
          style={{
            scale: quiet ? 1 : scale,
            y: quiet ? 0 : y,
            background: project.surface,
          }}
        >
          <m.img
            src={project.image}
            alt={`${project.title} — ${project.imageType.toLowerCase()}`}
            width={project.imageWidth}
            height={project.imageHeight}
            loading="lazy"
            decoding="async"
            style={{ scale: quiet ? 1 : imageScale }}
          />
          <span className="cinema-visit">
            Open experience <ArrowUpRight size={18} />
          </span>
        </m.a>
        <div className="cinema-caption">
          <div>
            <h3 id={`cinema-${project.id}`}>{project.title}</h3>
            <p>{project.description}</p>
          </div>
          <div className="cinema-links">
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              Explore demo <ArrowUpRight size={17} />
            </a>
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} source on GitHub (new tab)`}
            >
              <Github size={14} /> Source
            </a>
            <span>{project.access}</span>
          </div>
        </div>
        <div className="cinema-cross cinema-cross--one" aria-hidden="true">
          +
        </div>
        <div className="cinema-cross cinema-cross--two" aria-hidden="true">
          +
        </div>
      </div>
    </article>
  );
}
export function ProjectCinema({ projects }: { projects: ShowcaseProject[] }) {
  return (
    <div className="work-cinema">
      {projects.map((project, index) => (
        <WorkScene key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
