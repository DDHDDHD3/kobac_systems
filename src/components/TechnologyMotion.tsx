import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  m,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";

export const MotionPreference = createContext(false);
export function useQuietMotion() {
  const paused = useContext(MotionPreference);
  const reduced = useReducedMotion();
  return paused || !!reduced;
}

export function useFineMotion() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (min-width: 768px)",
    );
    const update = () => setFine(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return fine;
}

export const tactileSpring = {
  type: "spring",
  stiffness: 300,
  damping: 24,
  mass: 0.55,
} as const;

export function MotionButton({
  className = "",
  ...props
}: React.ComponentProps<typeof m.button>) {
  const quiet = useQuietMotion();
  return (
    <m.button
      className={`motion-control ${className}`}
      whileHover={quiet ? undefined : { y: -2 }}
      whileTap={quiet ? undefined : { y: 1, scale: 0.98 }}
      transition={tactileSpring}
      {...props}
    />
  );
}

function LitWord({
  word,
  index,
  count,
}: {
  word: string;
  index: number;
  count: number;
}) {
  const quiet = useQuietMotion();
  return (
    <>
      <span className="kinetic-word-mask">
        <m.span
          variants={{
            hidden: { opacity: 0.25, y: "105%", rotateX: -65 },
            visible: { opacity: 1, y: "0%", rotateX: 0 },
          }}
          transition={{
            duration: quiet ? 0 : 0.7,
            delay: quiet ? 0 : index * 0.075,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
        </m.span>
      </span>
      {index < count - 1 ? " " : ""}
    </>
  );
}
export function ScrollWords({ text }: { text: string }) {
  const quiet = useQuietMotion();
  const words = text.split(" ");
  return (
    <m.span
      className="scroll-words"
      initial={quiet ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, index) => (
          <LitWord
            key={`${index}-${word}`}
            word={word}
            index={index}
            count={words.length}
          />
        ))}
      </span>
    </m.span>
  );
}

/** Native scroll drives motion values directly, without React updates per frame. */
export function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 32,
    mass: 0.45,
  });
  const quiet = useQuietMotion();
  return (
    <m.div
      className="reading-progress"
      aria-hidden="true"
      style={{ scaleX: quiet ? 0 : progress }}
    />
  );
}

/** An original SVG system diagram built around KOBAC's three-leaf mark. */
export function SystemCore({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const quiet = useQuietMotion();
  const inView = useInView(ref, { margin: "80px" });
  const id = useId().replace(/:/g, "");
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const tiltX = useSpring(y, { stiffness: 90, damping: 24 });
  const tiltY = useSpring(x, { stiffness: 90, damping: 24 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const drift = useTransform(scrollYProgress, [0, 1], [18, -18]);
  return (
    <div
      ref={ref}
      className={`system-core ${compact ? "system-core--compact" : ""} ${inView && !quiet ? "is-running" : ""}`}
      onPointerMove={(event) => {
        if (quiet || event.pointerType !== "mouse") return;
        const box = event.currentTarget.getBoundingClientRect();
        x.set(((event.clientX - box.left) / box.width - 0.5) * 12);
        y.set(-((event.clientY - box.top) / box.height - 0.5) * 12);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="core-grid" data-depth="0" aria-hidden="true" />
      <div className="core-topline" aria-hidden="true">
        <span>K / SYSTEM ARCHITECTURE</span>
        <span>01—03</span>
      </div>
      <m.div
        className="core-field"
        data-depth="2"
        aria-hidden="true"
        style={{ y: quiet ? 0 : drift }}
        initial={quiet ? false : { opacity: 0, scale: 0.45, rotate: -35 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
      >
        <m.svg
          viewBox="0 0 600 600"
          fill="none"
          style={{ rotateX: quiet ? 0 : tiltX, rotateY: quiet ? 0 : tiltY }}
        >
          <defs>
            <radialGradient id={`${id}-halo`}>
              <stop stopColor="#2b7955" stopOpacity=".38" />
              <stop offset="1" stopColor="#0b3b2c" stopOpacity="0" />
            </radialGradient>
            <linearGradient
              id={`${id}-leaf`}
              x1="260"
              y1="180"
              x2="330"
              y2="310"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#9dc5a4" />
              <stop offset=".42" stopColor="#397e57" />
              <stop offset="1" stopColor="#0b3b2c" />
            </linearGradient>
            <linearGradient
              id={`${id}-orbit`}
              x1="50"
              y1="120"
              x2="550"
              y2="440"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#a8c7af" stopOpacity=".65" />
              <stop offset=".5" stopColor="#71a987" stopOpacity=".08" />
              <stop offset="1" stopColor="#f5a623" stopOpacity=".7" />
            </linearGradient>
          </defs>
          <circle cx="300" cy="300" r="266" fill={`url(#${id}-halo)`} />
          <circle
            cx="300"
            cy="300"
            r="230"
            stroke="#82ad90"
            strokeOpacity=".14"
            strokeDasharray="2 8"
          />
          <circle
            cx="300"
            cy="300"
            r="186"
            stroke="#82ad90"
            strokeOpacity=".16"
          />
          <g className="core-orbits" stroke={`url(#${id}-orbit)`}>
            {[0, 30, 60, 90, 120, 150].map((angle) => (
              <ellipse
                key={angle}
                cx="300"
                cy="300"
                rx="225"
                ry="84"
                transform={`rotate(${angle} 300 300)`}
              />
            ))}
          </g>
          <g className="core-tracer">
            <ellipse
              cx="300"
              cy="300"
              rx="247"
              ry="117"
              transform="rotate(-32 300 300)"
              stroke="#f5a623"
              strokeOpacity=".8"
              strokeDasharray="90 1050"
            />
            <circle cx="510" cy="190" r="4" fill="#f5a623" />
          </g>
          <g className="core-emblem" data-depth="3">
            {[0, 120, 240].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 300 300)`}>
                <path
                  d="M300 283C251 243 263 193 300 168C337 193 349 243 300 283Z"
                  fill={`url(#${id}-leaf)`}
                  stroke="#9fc5a6"
                  strokeOpacity=".3"
                />
                <path d="M300 275V193" stroke="#c1dcc4" strokeOpacity=".35" />
              </g>
            ))}
            <circle cx="300" cy="300" r="11" fill="#f5a623" />
            <circle
              className="core-pulse"
              cx="300"
              cy="300"
              r="26"
              stroke="#f5a623"
              strokeOpacity=".5"
            />
          </g>
          <g stroke="#9fc5a6" strokeOpacity=".24">
            <path d="M300 38V82M300 518V562M38 300H82M518 300H562" />
            <path d="M70 74H90M80 64V84M510 526H530M520 516V536" />
          </g>
        </m.svg>
      </m.div>
      <div className="core-node core-node--one" data-depth="4">
        <span className="node-mark">01</span>
        <span>People</span>
        <span className="node-signal" aria-hidden="true" />
      </div>
      <div className="core-node core-node--two" data-depth="4">
        <span className="node-mark">02</span>
        <span>Process</span>
        <span className="node-signal" aria-hidden="true" />
      </div>
      <div className="core-node core-node--three" data-depth="4">
        <span className="node-mark">03</span>
        <span>Technology</span>
        <span className="node-signal" aria-hidden="true" />
      </div>
      <div className="core-bottomline">
        <span>
          Separate parts.
          <br />
          <strong>One connected system.</strong>
        </span>
        <span className="core-symbol" aria-hidden="true">
          ↗
        </span>
      </div>
    </div>
  );
}

const stages = [
  [
    "Discover",
    "Problem identification & requirements analysis",
    "We start with your needs, your workflows, and the challenges that hold your business back.",
  ],
  [
    "Design & build",
    "Solution design & implementation",
    "We translate real business requirements into practical software and connected operations.",
  ],
  [
    "Test & refine",
    "Testing, deployment & continuous improvement",
    "We test the solution, support deployment, and keep improving how it works for your team.",
  ],
  [
    "Keep moving",
    "Ongoing technical support & maintenance",
    "We provide the technical support and maintenance your systems need as your business evolves.",
  ],
];

function ProcessChapter({ stage, index }: { stage: string[]; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start .85", "start .35"],
  });
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const x = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [65, 0]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  return (
    <m.article
      ref={ref}
      className="process-chapter"
      style={{
        x: quiet ? 0 : x,
        y: quiet ? 0 : y,
        rotateX: quiet ? 0 : rotateX,
      }}
    >
      <span className="chapter-ghost" aria-hidden="true">
        0{index + 1}
      </span>
      <m.div
        className="chapter-line"
        aria-hidden="true"
        style={{ scaleX: quiet ? 1 : scaleX }}
      />
      <div className="chapter-meta">
        <span>
          0{index + 1} / {stage[0]}
        </span>
        <span aria-hidden="true">↘</span>
      </div>
      <h3>{stage[1]}</h3>
      <p>{stage[2]}</p>
    </m.article>
  );
}

function BrandLetter({
  letter,
  index,
  progress,
}: {
  letter: string;
  index: number;
  progress: MotionValue<number>;
}) {
  const quiet = useQuietMotion();
  const y = useTransform(
    progress,
    [index * 0.09, 0.6 + index * 0.09],
    ["110%", "0%"],
  );
  const rotateX = useTransform(
    progress,
    [index * 0.09, 0.6 + index * 0.09],
    [-85, 0],
  );
  const rotate = useTransform(
    progress,
    [index * 0.09, 0.6 + index * 0.09],
    [(index - 2) * 8, 0],
  );
  return (
    <m.span
      className="footer-letter"
      style={{
        y: quiet ? 0 : y,
        rotateX: quiet ? 0 : rotateX,
        rotate: quiet ? 0 : rotate,
      }}
    >
      {letter}
    </m.span>
  );
}

export function FooterBrand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end .94"],
  });
  return (
    <div ref={ref} className="footer-brand-statement" aria-hidden="true">
      <span className="footer-brand-word">
        {"KOBAC".split("").map((letter, index) => (
          <BrandLetter
            key={index}
            letter={letter}
            index={index}
            progress={scrollYProgress}
          />
        ))}
      </span>
      <span>SYSTEMS / THINKING FORWARD ↗</span>
    </div>
  );
}

export function ProcessJourney({ onExplore }: { onExplore: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const quiet = useQuietMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start .6", "end .8"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 140]);
  return (
    <section
      className="process-journey section"
      aria-labelledby="approach-title"
      ref={ref}
    >
      <div className="journey-sticky">
        <p className="eyebrow">
          <span className="tiny-cross" aria-hidden="true">
            +
          </span>
          The way we work<span className="eyebrow-index">/02</span>
        </p>
        <h2 id="approach-title">
          Good systems
          <br />
          begin with
          <br />
          <em>understanding.</em>
        </h2>
        <p>
          Every project begins with your needs. We identify the problem, plan
          the right solution, and build around real business requirements.
        </p>
        <div className="journey-diagram" aria-hidden="true" data-depth="2">
          <m.svg
            viewBox="0 0 300 220"
            fill="none"
            style={{ rotate: quiet ? 0 : rotate }}
          >
            <circle
              cx="150"
              cy="110"
              r="84"
              stroke="#658f75"
              strokeOpacity=".5"
            />
            <rect
              x="92"
              y="52"
              width="116"
              height="116"
              rx="14"
              stroke="#658f75"
              strokeOpacity=".6"
              transform="rotate(45 150 110)"
            />
            <path
              d="M150 18V202M58 110H242"
              stroke="#658f75"
              strokeOpacity=".22"
            />
            <circle cx="150" cy="26" r="7" fill="#f5a623" />
            <circle cx="150" cy="110" r="16" fill="#0b3b2c" stroke="#9fbba6" />
          </m.svg>
          <span>
            From understanding
            <br />
            to implementation.
          </span>
        </div>
        <button className="text-link" onClick={onExplore}>
          Explore our approach <ArrowUpRight size={17} />
        </button>
      </div>
      <div className="journey-chapters">
        {stages.map((stage, index) => (
          <ProcessChapter key={stage[0]} stage={stage} index={index} />
        ))}
      </div>
    </section>
  );
}
