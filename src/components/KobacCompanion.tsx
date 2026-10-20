import React, { useEffect, useId, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  m,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { ArrowUp, CirclePause, CirclePlay, Sparkles, X } from "lucide-react";

type Message = { role: string; text: string };
type Props = {
  messages: Message[];
  input: string;
  loading: boolean;
  onInput: (value: string) => void;
  onSend: (event: React.FormEvent) => void;
};
type Mood = "idle" | "walking" | "held" | "happy";

/** Original KOBAC character: a small leaf-eared workshop creature, drawn as layered SVG. */
export function KobiPortrait({
  mood = "idle",
  quiet = false,
  eyesX = 0,
  eyesY = 0,
}: {
  mood?: Mood;
  quiet?: boolean;
  eyesX?: number | MotionValue<number>;
  eyesY?: number | MotionValue<number>;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 160 180"
      fill="none"
      aria-hidden="true"
      className={`kobi-portrait kobi--${mood} ${quiet ? "kobi--quiet" : ""}`}
    >
      <defs>
        <linearGradient
          id={`${id}-body`}
          x1="32"
          y1="38"
          x2="124"
          y2="160"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#b3d5a2" />
          <stop offset=".4" stopColor="#4d8856" />
          <stop offset="1" stopColor="#123f2c" />
        </linearGradient>
        <linearGradient
          id={`${id}-leaf`}
          x1="20"
          y1="0"
          x2="60"
          y2="67"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#dfebbe" />
          <stop offset="1" stopColor="#598d50" />
        </linearGradient>
        <linearGradient
          id={`${id}-face`}
          x1="54"
          y1="76"
          x2="98"
          y2="136"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#fffce3" />
          <stop offset="1" stopColor="#d4dbb0" />
        </linearGradient>
        <radialGradient id={`${id}-shade`}>
          <stop stopColor="#03190b" stopOpacity=".28" />
          <stop offset="1" stopColor="#03190b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse
        className="kobi-shadow"
        cx="80"
        cy="166"
        rx="56"
        ry="10"
        fill={`url(#${id}-shade)`}
      />
      <g className="kobi-tail">
        <path
          d="M119 137C141 123 147 112 142 92C124 100 117 114 119 137Z"
          fill={`url(#${id}-leaf)`}
        />
        <path d="M120 137L140 100" stroke="#b5d7a1" strokeWidth="1.4" />
      </g>
      <g className="kobi-foot kobi-foot--left">
        <path d="M52 146C42 149 38 163 45 165H69L66 149" fill="#c58c3a" />
        <path
          d="M44 163H68"
          stroke="#f4ca76"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <g className="kobi-foot kobi-foot--right">
        <path d="M104 146C116 149 121 163 114 165H91L94 149" fill="#c58c3a" />
        <path
          d="M93 163H116"
          stroke="#f4ca76"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>
      <g className="kobi-body">
        <g className="kobi-ear kobi-ear--left">
          <path
            d="M52 67C25 55 23 32 29 15C53 22 62 42 52 67Z"
            fill={`url(#${id}-leaf)`}
          />
          <path
            d="M49 60L33 24"
            stroke="#ebf4cb"
            strokeOpacity=".6"
            strokeWidth="1.5"
          />
        </g>
        <g className="kobi-ear kobi-ear--right">
          <path
            d="M105 64C99 39 110 20 135 12C139 36 129 56 105 64Z"
            fill={`url(#${id}-leaf)`}
          />
          <path
            d="M109 56L130 22"
            stroke="#ebf4cb"
            strokeOpacity=".6"
            strokeWidth="1.5"
          />
        </g>
        <path d="M79 27C66 38 67 48 80 57C94 46 93 35 79 27Z" fill="#efb652" />
        <path d="M80 51V32" stroke="#ffe4a0" strokeWidth="1.3" />
        <path
          d="M29 103C29 69 47 50 79 50C112 50 133 72 132 108C131 144 109 157 79 157C48 157 28 140 29 103Z"
          fill={`url(#${id}-body)`}
          stroke="#16492f"
          strokeWidth="1.4"
        />
        <path
          d="M37 92C39 69 53 59 74 58"
          stroke="#d2e5b5"
          strokeOpacity=".55"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M34 110C35 89 52 77 79 79C106 76 124 90 125 109C127 131 108 145 80 144C52 145 32 132 34 110Z"
          fill={`url(#${id}-face)`}
        />
        <g className="kobi-arm kobi-arm--left">
          <path
            d="M30 99C17 105 16 122 26 128C32 131 37 125 35 120"
            fill="#3c7548"
            stroke="#16492f"
            strokeWidth="1.4"
          />
        </g>
        <g className="kobi-arm kobi-arm--right">
          <path
            d="M130 100C143 106 144 122 134 128C128 131 123 125 125 120"
            fill="#397146"
            stroke="#16492f"
            strokeWidth="1.4"
          />
        </g>
        <g className="kobi-eyes">
          <ellipse cx="59" cy="105" rx="15" ry="18" fill="#fffef0" />
          <ellipse cx="101" cy="105" rx="15" ry="18" fill="#fffef0" />
          <m.g style={{ x: eyesX, y: eyesY }}>
            <ellipse cx="61" cy="106" rx="7.5" ry="11" fill="#173a2b" />
            <ellipse cx="99" cy="106" rx="7.5" ry="11" fill="#173a2b" />
            <circle cx="63" cy="102" r="2.2" fill="white" />
            <circle cx="101" cy="102" r="2.2" fill="white" />
          </m.g>
        </g>
        <path
          className="kobi-smile"
          d="M74 127Q80 132 86 127"
          stroke="#536b3e"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <ellipse
          cx="43"
          cy="122"
          rx="6"
          ry="3"
          fill="#d7b878"
          fillOpacity=".5"
        />
        <ellipse
          cx="117"
          cy="122"
          rx="6"
          ry="3"
          fill="#d7b878"
          fillOpacity=".5"
        />
      </g>
    </svg>
  );
}

export function KobacCompanion({
  messages,
  input,
  loading,
  onInput,
  onSend,
}: Props) {
  const systemQuiet = useReducedMotion();
  const [manualQuiet, setManualQuiet] = useState(false);
  const [covered, setCovered] = useState(false);
  const quiet = !!systemQuiet || manualQuiet;
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [roam, setRoam] = useState(true);
  const [engaged, setEngaged] = useState(false);
  const [mood, setMood] = useState<Mood>("idle");
  const [viewport, setViewport] = useState({ width: 1280, height: 800 });
  const [playing, setPlaying] = useState(false);
  const petRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    startX: number;
    startY: number;
    moved: boolean;
  } | null>(null);
  const dragged = useRef(false);
  const movement = useRef<ReturnType<typeof animate>[]>([]);
  const actionId = useRef(0);
  const turn = useRef(0);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const eyeTargetX = useMotionValue(0),
    eyeTargetY = useMotionValue(0);
  const eyesX = useSpring(eyeTargetX, { stiffness: 160, damping: 20 });
  const eyesY = useSpring(eyeTargetY, { stiffness: 160, damping: 20 });
  const [ball, setBall] = useState({ x: 90, y: 90 });
  const small = viewport.width < 600;
  const size = small ? 72 : 96;
  const roamingPaused = quiet || open || engaged || !roam || covered;
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(Math.max(min, max), value));
  const stop = () => {
    actionId.current++;
    movement.current.forEach((control) => control.stop());
    movement.current = [];
  };

  useEffect(() => {
    const resize = () => {
      stop();
      const width = window.innerWidth,
        height = window.innerHeight;
      const nextSize = width < 600 ? 72 : 96;
      setViewport({ width, height });
      x.set(clamp(x.get() || width - nextSize - 22, 12, width - nextSize - 12));
      y.set(
        clamp(
          y.get() || height - nextSize * 1.15 - 18,
          88,
          height - nextSize * 1.15 - 12,
        ),
      );
      setReady(true);
    };
    resize();
    const preferences = (event: Event) =>
      setManualQuiet((event as CustomEvent<boolean>).detail);
    const overlay = (event: Event) =>
      setCovered((event as CustomEvent<boolean>).detail);
    window.addEventListener("resize", resize);
    window.addEventListener("kobac:motion-preference", preferences);
    window.addEventListener("kobac:menu", overlay);
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("kobac:motion-preference", preferences);
      window.removeEventListener("kobac:menu", overlay);
      stop();
    };
  }, []);

  function travel(nextX: number, nextY: number, play = false) {
    stop();
    const id = actionId.current;
    setMood(play ? "happy" : "walking");
    const duration = quiet
      ? 0
      : clamp(Math.hypot(nextX - x.get(), nextY - y.get()) / 260, 0.9, 2.6);
    movement.current = [
      animate(x, nextX, { duration, ease: [0.45, 0, 0.18, 1] }),
      animate(y, nextY, { duration, ease: [0.45, 0, 0.18, 1] }),
    ];
    Promise.all(movement.current).then(() => {
      if (id === actionId.current) {
        setMood("idle");
        setPlaying(false);
      }
    });
  }
  function safeSpot(preferred: number[]) {
    const blockers = Array.from(
      document.querySelectorAll<HTMLElement>(
        "a,button,input,textarea,select,h1,h2,h3,p",
      ),
    )
      .filter((element) => !element.closest(".companion-layer"))
      .map((element) => element.getBoundingClientRect())
      .filter(
        (rect) =>
          rect.width > 0 &&
          rect.height > 0 &&
          rect.bottom > 0 &&
          rect.top < viewport.height,
      );
    const bottom = viewport.height - size * 1.15 - 18;
    const right = viewport.width - size - 18;
    const candidates = [
      preferred,
      [right, 110],
      [16, 110],
      [right, viewport.height * 0.5],
      [16, viewport.height * 0.5],
      [right, bottom],
      [16, bottom],
    ].map((point) => [
      clamp(point[0], 12, viewport.width - size - 12),
      clamp(point[1], 88, viewport.height - size * 1.15 - 12),
    ]);
    const overlap = (point: number[]) =>
      blockers.reduce(
        (score, rect) =>
          score +
          Math.max(
            0,
            Math.min(point[0] + size + 8, rect.right) -
              Math.max(point[0] - 8, rect.left),
          ) *
            Math.max(
              0,
              Math.min(point[1] + size * 1.15 + 8, rect.bottom) -
                Math.max(point[1] - 8, rect.top),
            ),
        0,
      );
    let best = candidates[0],
      bestScore = overlap(candidates[0]);
    for (const point of candidates) {
      const score = overlap(point);
      if (score < bestScore) {
        best = point;
        bestScore = score;
      }
      if (bestScore === 0) break;
    }
    return best;
  }
  function wander(play = false) {
    if (quiet || document.hidden || drag.current) return;
    const positions = [
      [16, viewport.height - size * 1.15 - 18],
      [viewport.width * 0.48 - size / 2, viewport.height - size * 1.15 - 18],
      [viewport.width - size - 20, viewport.height - size * 1.15 - 18],
      [viewport.width - size - 18, viewport.height * 0.58],
    ];
    const target = safeSpot(positions[turn.current++ % positions.length]);
    if (play) {
      setBall({ x: target[0] + size * 0.5, y: target[1] + size * 0.95 });
      setPlaying(true);
    }
    travel(target[0], target[1], play);
  }
  useEffect(() => {
    if (roamingPaused) {
      stop();
      setMood("idle");
      return;
    }
    const first = window.setTimeout(() => wander(), 7000);
    const interval = window.setInterval(() => wander(), 18000);
    return () => {
      clearTimeout(first);
      clearInterval(interval);
      stop();
    };
  }, [roamingPaused, quiet, covered, viewport.width, viewport.height]);

  useEffect(() => {
    if (roamingPaused) return;
    let timer = 0;
    const avoidControls = () => {
      clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (drag.current) return;
        const target = safeSpot([x.get(), y.get()]);
        if (Math.hypot(target[0] - x.get(), target[1] - y.get()) > 4)
          travel(target[0], target[1]);
      }, 180);
    };
    window.addEventListener("scroll", avoidControls, { passive: true });
    avoidControls();
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", avoidControls);
    };
  }, [roamingPaused, viewport.width, viewport.height]);

  useEffect(() => {
    if (quiet) {
      eyeTargetX.set(0);
      eyeTargetY.set(0);
      return;
    }
    const look = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      eyeTargetX.set(clamp((event.clientX - x.get() - size / 2) / 100, -4, 4));
      eyeTargetY.set(clamp((event.clientY - y.get() - size / 2) / 140, -3, 3));
    };
    window.addEventListener("pointermove", look, { passive: true });
    return () => window.removeEventListener("pointermove", look);
  }, [quiet, size]);

  useEffect(() => {
    if (!open) return;
    const panelHeight = Math.min(
      570,
      small ? viewport.height * 0.72 : viewport.height - 110,
    );
    const parkX = small
      ? viewport.width - size - 22
      : Math.max(12, viewport.width - 408 - size - 16);
    const parkY = small
      ? Math.max(80, viewport.height - panelHeight - size * 1.15 - 22)
      : viewport.height - size * 1.15 - 30;
    travel(parkX, parkY);
    inputRef.current?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        !document.querySelector("#mobile-navigation")
      ) {
        setOpen(false);
        requestAnimationFrame(() =>
          petRef.current?.focus({ preventScroll: true }),
        );
      }
    };
    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [open, viewport.width, viewport.height]);
  useEffect(() => {
    endRef.current?.scrollIntoView({
      behavior: quiet ? "instant" : "smooth",
      block: "nearest",
    });
  }, [messages, open, quiet]);

  function release(event: React.PointerEvent<HTMLButtonElement>) {
    if (!drag.current) return;
    dragged.current = drag.current.moved;
    drag.current = null;
    setMood(dragged.current ? "happy" : "idle");
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  return (
    <div
      className={`companion-layer ${quiet ? "companion--quiet" : ""}`}
      hidden={covered || !ready}
    >
      <AnimatePresence>
        {playing && !quiet && (
          <m.div
            key="ball"
            className="kobi-ball"
            aria-hidden="true"
            style={{ left: ball.x, top: ball.y }}
            initial={{ y: -160, scale: 0.4, opacity: 0 }}
            animate={{
              y: [-160, 0, -50, 0, -15, 0],
              scale: 1,
              opacity: [0, 1, 1, 1, 1, 0],
            }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          >
            ✦
          </m.div>
        )}
      </AnimatePresence>
      <m.button
        ref={petRef}
        className="kobi-pet"
        style={{ x, y, width: size, height: size * 1.15 }}
        aria-label="Open Kobi, KOBAC AI companion"
        aria-expanded={open}
        aria-controls="kobi-chat"
        aria-describedby="kobi-instructions"
        onPointerEnter={() => setEngaged(true)}
        onPointerLeave={() => {
          if (!drag.current) setEngaged(false);
        }}
        onFocus={() => setEngaged(true)}
        onBlur={() => {
          if (!drag.current) setEngaged(false);
        }}
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          stop();
          dragged.current = false;
          drag.current = {
            x: event.clientX,
            y: event.clientY,
            startX: x.get(),
            startY: y.get(),
            moved: false,
          };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (!drag.current) return;
          const dx = event.clientX - drag.current.x,
            dy = event.clientY - drag.current.y;
          if (!drag.current.moved && Math.hypot(dx, dy) > 6) {
            drag.current.moved = true;
            setMood("held");
          }
          x.set(
            clamp(drag.current.startX + dx, 12, viewport.width - size - 12),
          );
          y.set(
            clamp(
              drag.current.startY + dy,
              88,
              viewport.height - size * 1.15 - 12,
            ),
          );
        }}
        onPointerUp={release}
        onPointerCancel={release}
        onClick={() => {
          if (dragged.current) {
            dragged.current = false;
            return;
          }
          setOpen((value) => !value);
        }}
        onKeyDown={(event) => {
          const directions: Record<string, number[]> = {
            ArrowLeft: [-24, 0],
            ArrowRight: [24, 0],
            ArrowUp: [0, -24],
            ArrowDown: [0, 24],
          };
          const direction = directions[event.key];
          if (direction) {
            event.preventDefault();
            stop();
            x.set(
              clamp(x.get() + direction[0], 12, viewport.width - size - 12),
            );
            y.set(
              clamp(
                y.get() + direction[1],
                88,
                viewport.height - size * 1.15 - 12,
              ),
            );
          }
        }}
      >
        <KobiPortrait
          mood={loading ? "happy" : mood}
          quiet={quiet}
          eyesX={eyesX}
          eyesY={eyesY}
        />
        <span className="kobi-name">
          Kobi<span aria-hidden="true">↗</span>
        </span>
        <span className="kobi-tip">
          A little help?
          <br />
          <small>Drag me. Say hello.</small>
        </span>
      </m.button>
      <span id="kobi-instructions" className="sr-only">
        Drag Kobi around the screen, or use arrow keys while focused. Press
        Enter to open the chat.
      </span>
      <AnimatePresence>
        {open && (
          <m.section
            id="kobi-chat"
            role="dialog"
            aria-labelledby="kobi-chat-title"
            className="kobi-chat"
            initial={
              quiet
                ? false
                : {
                    opacity: 0,
                    y: 28,
                    scale: 0.96,
                    clipPath: "inset(14% 0 0 0 round 22px)",
                  }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0 0 0 round 22px)",
            }}
            exit={{ opacity: 0, y: quiet ? 0 : 16, scale: quiet ? 1 : 0.97 }}
            transition={{ duration: quiet ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <header className="kobi-chat-header">
              <div className="kobi-avatar">
                <KobiPortrait quiet={quiet} />
              </div>
              <div>
                <h2 id="kobi-chat-title">
                  Kobi<span> / KOBAC</span>
                </h2>
                <p>Somali & English. A little closer.</p>
              </div>
              <button
                aria-label="Close Kobi chat"
                onClick={() => {
                  setOpen(false);
                  requestAnimationFrame(() =>
                    petRef.current?.focus({ preventScroll: true }),
                  );
                }}
              >
                <X size={18} />
              </button>
            </header>
            <div
              className="kobi-conversation"
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Conversation with Kobi"
            >
              {messages.map((message, index) => (
                <div
                  className={`kobi-message kobi-message--${message.role}`}
                  key={index}
                >
                  <span>{message.role === "user" ? "YOU" : "KOBI"}</span>
                  <p>
                    {message.role === "assistant" &&
                    /database is not configured|api key|gemini_api_key/i.test(
                      message.text,
                    )
                      ? "I can't connect just now. Please try again later, or reach KOBAC through the Contact page."
                      : message.text}
                  </p>
                </div>
              ))}
              {loading && (
                <div className="kobi-thinking" role="status">
                  <i />
                  <i />
                  <i />
                  <span>Kobi is thinking…</span>
                </div>
              )}
              <div ref={endRef} />
            </div>
            <div className="kobi-playbar">
              <button onClick={() => wander(true)} disabled={quiet}>
                <Sparkles size={13} /> Play fetch
              </button>
              <button
                aria-pressed={!roam}
                onClick={() => setRoam((value) => !value)}
              >
                {roam ? <CirclePause size={13} /> : <CirclePlay size={13} />}
                {roam ? "Stay here" : "Let me wander"}
              </button>
            </div>
            <form className="kobi-composer" onSubmit={onSend}>
              <textarea
                ref={inputRef}
                rows={1}
                value={input}
                maxLength={4000}
                aria-label="Message to KOBAC AI assistant"
                placeholder="What are you thinking about?"
                onChange={(event) => onInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message to Kobi"
              >
                <ArrowUp size={18} />
              </button>
            </form>
            <span className="kobi-chat-footnote">
              CAAWINTA AI<span>Built around your questions.</span>
            </span>
          </m.section>
        )}
      </AnimatePresence>
    </div>
  );
}
