import React, { useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Github } from "lucide-react";
import { projectCatalog, type ShowcaseProject } from "../data/projectCatalog";
import { useFineMotion, useQuietMotion } from "./TechnologyMotion";
import { ProjectCinema } from "./StudioExperience";

const spring = {
  type: "spring",
  stiffness: 190,
  damping: 27,
  mass: 0.8,
} as const;
const filters = [
  "All projects",
  "Business tools",
  "Digital experiences",
  "Data & intelligence",
] as const;

function ProjectCard({
  project,
  index,
}: {
  project: ShowcaseProject;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const bounds = useRef<DOMRect | null>(null);
  const quiet = useQuietMotion();
  const fine = useFineMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(y, { stiffness: 160, damping: 24, mass: 0.7 });
  const rotateY = useSpring(x, { stiffness: 160, damping: 24, mass: 0.7 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [14, -14]);
  const imageScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [1.035, 1, 1.025],
  );
  const enabled = fine && !quiet;
  return (
    <m.article
      ref={ref}
      className="project-card"
      initial={quiet ? false : { opacity: 0, y: 100, rotateX: 12, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        y: { ...spring, delay: (index % 2) * 0.065 },
        opacity: { duration: 0.4 },
      }}
    >
      <m.div
        className="project-plane"
        style={{
          rotateX: enabled ? rotateX : 0,
          rotateY: enabled ? rotateY : 0,
        }}
        onPointerEnter={(event) => {
          bounds.current = event.currentTarget.getBoundingClientRect();
        }}
        onPointerMove={(event) => {
          if (!enabled || event.pointerType !== "mouse" || !bounds.current)
            return;
          const box = bounds.current;
          x.set(
            Math.max(
              -0.5,
              Math.min(0.5, (event.clientX - box.left) / box.width - 0.5),
            ) * 5,
          );
          y.set(
            -Math.max(
              -0.5,
              Math.min(0.5, (event.clientY - box.top) / box.height - 0.5),
            ) * 5,
          );
        }}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
          bounds.current = null;
        }}
      >
        <a
          className="project-preview"
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${project.title} demo (new tab)`}
          style={{ background: project.surface }}
        >
          <m.div
            className="project-image-reveal"
            initial={
              quiet ? false : { clipPath: "inset(0 0 18% 0)", opacity: 0.6 }
            }
            whileInView={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <m.img
              src={project.image}
              alt={`${project.title} — ${project.imageType.toLowerCase()}`}
              width={project.imageWidth}
              height={project.imageHeight}
              loading="lazy"
              decoding="async"
              style={{
                y: enabled ? imageY : 0,
                scale: enabled ? imageScale : 1,
              }}
            />
          </m.div>
          <span className="project-preview-cue" aria-hidden="true">
            <ArrowUpRight size={22} />
          </span>
        </a>
      </m.div>
      <div className="project-caption">
        <div className="project-meta">
          <span>{project.category}</span>
          <span>{project.imageType}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <ul className="project-tags" aria-label={`${project.title} features`}>
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <div className="project-destinations">
          <m.a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="project-demo"
            whileHover={quiet ? {} : { x: 3 }}
            whileTap={quiet ? {} : { scale: 0.98 }}
            transition={spring}
            aria-label={`Explore ${project.title} live demo (new tab)`}
          >
            Explore demo <ArrowUpRight size={16} />
          </m.a>
          <a
            href={project.repository}
            target="_blank"
            rel="noopener noreferrer"
            className="project-source"
            aria-label={`${project.title} source on GitHub (new tab)`}
          >
            <Github size={15} />
            Source
          </a>
        </div>
        <span className="project-access">{project.access}</span>
      </div>
    </m.article>
  );
}

export function ProjectShowcase({ featured = false }: { featured?: boolean }) {
  const [filter, setFilter] =
    useState<(typeof filters)[number]>("All projects");
  const quiet = useQuietMotion();
  const projects = projectCatalog.filter((project) =>
    featured
      ? project.featured
      : filter === "All projects" || project.category === filter,
  );
  return (
    <div className="project-showcase" id="projects">
      <div className="project-collection-meta">
        <span>Project collection / uncannystranger</span>
        <span role="status" aria-live="polite">
          {String(projects.length).padStart(2, "0")}{" "}
          {featured
            ? "selected projects"
            : projects.length === 1
              ? "project"
              : "projects"}
        </span>
      </div>
      {!featured && (
        <div
          className="project-filters"
          role="group"
          aria-label="Filter projects"
        >
          {filters.map((item) => (
            <m.button
              key={item}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
              whileTap={quiet ? {} : { scale: 0.97 }}
              transition={spring}
            >
              {item}
              <span aria-hidden="true" />
            </m.button>
          ))}
        </div>
      )}
      {featured ? (
        <ProjectCinema projects={projects} />
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={filter}
            className="project-grid"
            initial={quiet ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: quiet ? 0 : -8 }}
            transition={{ duration: quiet ? 0 : 0.22 }}
          >
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </m.div>
        </AnimatePresence>
      )}
    </div>
  );
}
