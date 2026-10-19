import React, { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  m,
  MotionConfig,
  useReducedMotion,
} from "motion/react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  Code2,
  Layers3,
  Menu,
  Network,
  X,
} from "lucide-react";
import {
  MotionPreference,
  useQuietMotion,
  SystemCore as SystemsArtwork,
  ReadingProgress,
  ProcessJourney,
  MotionButton,
  ScrollWords,
  FooterBrand,
} from "./TechnologyMotion";
import { ProjectShowcase } from "./ProjectShowcase";
import { StudioHero, ConnectedGallery } from "./StudioExperience";
import type { CompanySettings, PortfolioItem, User } from "../App";

export type PublicPage =
  | "home"
  | "services"
  | "portfolio"
  | "about"
  | "contact"
  | "wizard";
type Props = {
  portfolio: PortfolioItem[];
  companySettings: CompanySettings | null;
  users: User[];
  dataStatus: "loading" | "ready" | "unavailable";
  setActivePortal: (portal: "public" | "portal") => void;
  renderWizard: (navigate: (page: PublicPage) => void) => React.ReactNode;
};
const ease = [0.22, 1, 0.36, 1] as const;
const navigation: [PublicPage, string][] = [
  ["home", "Home"],
  ["services", "Services"],
  ["portfolio", "Our work"],
  ["about", "About"],
  ["wizard", "AI Project Scoper"],
  ["contact", "Contact"],
];
const capabilities = [
  {
    icon: Network,
    title: "Enterprise CRM & client operations",
    description:
      "Centralize client communications, negotiations, contract lifecycle management, and secure document vaults.",
    tag: "Connected operations",
  },
  {
    icon: Code2,
    title: "Custom software & cloud infrastructure",
    description:
      "Full-stack web and mobile application engineering, cloud migration, and automated CI/CD security pipelines.",
    tag: "Built around your business",
  },
  {
    icon: Layers3,
    title: "Governance & board management",
    description:
      "Secure document sharing, board member governance tracking, meeting minutes, and compliance audit logging.",
    tag: "Clarity at every level",
  },
];
const process = [
  "Problem identification & requirements analysis",
  "Solution design & implementation",
  "Testing, deployment & continuous improvement",
  "Ongoing technical support & maintenance",
];

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useQuietMotion();
  return (
    <m.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        y: { type: "spring", stiffness: 155, damping: 25, mass: 0.8, delay },
        opacity: { duration: 0.45, delay },
      }}
    >
      {children}
    </m.div>
  );
}
function Arrow({ diagonal = true }: { diagonal?: boolean }) {
  return diagonal ? (
    <ArrowUpRight size={18} aria-hidden="true" />
  ) : (
    <ArrowRight size={18} aria-hidden="true" />
  );
}
function Eyebrow({
  children,
  number,
}: {
  children: React.ReactNode;
  number?: string;
}) {
  return (
    <p className="eyebrow">
      <span className="tiny-cross" aria-hidden="true">
        +
      </span>
      {children}
      {number && <span className="eyebrow-index">/{number}</span>}
    </p>
  );
}
function Brand({
  dark = false,
  custom,
  name,
}: {
  dark?: boolean;
  custom?: string | null;
  name?: string;
}) {
  return (
    <img
      className="brand-wordmark"
      src={custom || (dark ? "/kobac-logo.png" : "/kobac-logo-dark.png")}
      width="722"
      height="231"
      alt={name || "KOBAC SYSTEMS"}
      onError={(event) => {
        const fallback = dark ? "/kobac-logo.png" : "/kobac-logo-dark.png";
        if (!event.currentTarget.src.endsWith(fallback))
          event.currentTarget.src = fallback;
      }}
    />
  );
}

function CaseList({
  portfolio,
  limit,
  emptyState,
  onSelect,
}: {
  portfolio: PortfolioItem[];
  limit?: number;
  emptyState: React.ReactNode;
  onSelect: (item: PortfolioItem) => void;
}) {
  return portfolio.length ? (
    <div className="work-list">
      {portfolio.slice(0, limit).map((item, index) => (
        <Reveal key={item.id} delay={index * 0.06}>
          <button className="work-item" onClick={() => onSelect(item)}>
            <span className="work-number">0{index + 1}</span>
            <div>
              <span className="work-category">
                {item.category} / {item.industry}
              </span>
              <h3>{item.title}</h3>
              <p>{item.summary || item.project_title || item.description}</p>
              <span className="work-client">{item.client}</span>
            </div>
            <span className="work-open">
              <Arrow />
            </span>
          </button>
        </Reveal>
      ))}
    </div>
  ) : (
    emptyState
  );
}

export function PublicWebsite({
  portfolio,
  companySettings,
  users,
  dataStatus,
  setActivePortal,
  renderWizard,
}: Props) {
  const [subPage, setSubPage] = useState<PublicPage>("home");
  const [selectedCaseStudy, setSelectedCaseStudy] =
    useState<PortfolioItem | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("kobac:motion-preference", { detail: motionPaused }));
  }, [motionPaused]);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("kobac:menu", { detail: mobileMenuOpen }));
    return () => { window.dispatchEvent(new CustomEvent("kobac:menu", { detail: false })); };
  }, [mobileMenuOpen]);
  const navigate = (page: PublicPage) => {
    setSubPage(page);
    setSelectedCaseStudy(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      mainRef.current?.focus({ preventScroll: true }),
    );
  };
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuToggle.current?.focus();
      }
      if (event.key !== "Tab") return;
      const controls = Array.from(
        menuRef.current?.querySelectorAll<HTMLButtonElement>("button") ?? [],
      );
      const first = controls[0],
        last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKey);
    };
  }, [mobileMenuOpen]);
  const title = companySettings?.company_name || "KOBAC SYSTEMS";
  const phones = companySettings?.phones?.length
    ? companySettings.phones
    : ["+252 61 5283292", "+252 61 7747801", "+252 61 4163362"];
  const emails = companySettings?.emails?.length
    ? companySettings.emails
    : ["contactkobacsystems@gmail.com"];
  const emptyState = (
    <div className="content-empty" role="status">
      <span className="empty-orbit" aria-hidden="true">
        ↗
      </span>
      <div>
        <h3>
          {dataStatus === "loading"
            ? "Gathering the details."
            : dataStatus === "unavailable"
              ? "A little more to come."
              : "More work, coming into view."}
        </h3>
        <p>
          {dataStatus === "loading"
            ? "Loading published company information."
            : dataStatus === "unavailable"
              ? "Published company information is temporarily unavailable. You can still explore our services or contact the team."
              : "Published case studies and team updates will appear here when available."}
        </p>
      </div>
    </div>
  );
  const selectCase = (item: PortfolioItem) => {
    setSelectedCaseStudy(item);
    setSubPage("portfolio");
    window.scrollTo({ top: 0, behavior: "instant" });
    requestAnimationFrame(() =>
      mainRef.current?.focus({ preventScroll: true }),
    );
  };
  return (
    <MotionPreference.Provider value={motionPaused}>
      <MotionConfig reducedMotion={motionPaused ? "always" : "user"}>
        <div
          className={`public-site technology-site ${motionPaused ? "motion-paused" : ""}`}
        >
          <ReadingProgress />
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <header className="site-header">
            <button
              className="brand-home"
              onClick={() => navigate("home")}
              aria-label="KOBAC SYSTEMS home"
            >
              <Brand dark custom={companySettings?.logo_url} name={title} />
            </button>
            <nav className="desktop-navigation" aria-label="Main navigation">
              {navigation
                .filter(([page]) => page !== "wizard")
                .map(([page, label]) => (
                  <button
                    key={page}
                    className={`nav-link ${subPage === page ? "is-active" : ""}`}
                    aria-current={subPage === page ? "page" : undefined}
                    onClick={() => navigate(page)}
                  >
                    {label}
                  </button>
                ))}
            </nav>
            <div className="header-actions">
              <button
                className="portal-link"
                onClick={() => setActivePortal("portal")}
              >
                Staff portal <Arrow />
              </button>
              <button
                ref={menuToggle}
                className="menu-toggle"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                aria-label="Open navigation menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu size={23} />
              </button>
            </div>
          </header>
          <AnimatePresence>
            {mobileMenuOpen && (
              <m.div
                id="mobile-navigation"
                className="mobile-navigation"
                ref={menuRef}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation"
                initial={
                  reduced || motionPaused
                    ? false
                    : { opacity: 1, clipPath: "inset(0 0 100% 0)" }
                }
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={{
                  opacity: 0,
                  clipPath:
                    reduced || motionPaused
                      ? "inset(0 0 0% 0)"
                      : "inset(0 0 100% 0)",
                }}
                transition={{
                  duration: reduced || motionPaused ? 0 : 0.55,
                  ease,
                }}
              >
                <div className="mobile-nav-top">
                  <Brand dark />
                  <button
                    aria-label="Close navigation menu"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      menuToggle.current?.focus();
                    }}
                  >
                    <X />
                  </button>
                </div>
                <nav aria-label="Mobile navigation">
                  {navigation.map(([page, label], i) => (
                    <m.button
                      key={page}
                      onClick={() => navigate(page)}
                      initial={
                        reduced || motionPaused ? false : { opacity: 0, x: 60 }
                      }
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: reduced || motionPaused ? 0 : 0.065 * i,
                        ease,
                      }}
                    >
                      <span>0{i + 1}</span>
                      {label}
                      <Arrow />
                    </m.button>
                  ))}
                </nav>
                <MotionButton
                  className="button button--green"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActivePortal("portal");
                  }}
                >
                  Operations portal <Arrow />
                </MotionButton>
                <p className="micro-copy">
                  Mogadishu, Somalia · Built around your business
                </p>
              </m.div>
            )}
          </AnimatePresence>
          <main
            inert={mobileMenuOpen}
            id="main-content"
            ref={mainRef}
            tabIndex={-1}
          >
            <AnimatePresence mode="wait" initial={false}>
              <m.div
                key={`${subPage}-${selectedCaseStudy?.id ?? ""}`}
                initial={{ opacity: 0, y: reduced || motionPaused ? 0 : 44 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced || motionPaused ? 0 : -8 }}
                transition={{
                  duration: reduced || motionPaused ? 0 : 0.24,
                  ease,
                }}
              >
                {subPage === "home" && (
                  <>
                    <StudioHero navigate={navigate} />
                    <ConnectedGallery />
                    <section
                      id="capabilities"
                      className="section capabilities-section"
                      aria-labelledby="capabilities-title"
                    >
                      <Reveal>
                        <div className="section-intro">
                          <Eyebrow number="01">What we do</Eyebrow>
                          <h2 id="capabilities-title">
                            <ScrollWords text="Complex challenges." />
                            <br />
                            <span className="muted-heading">
                              <ScrollWords text="Clearer possibilities." />
                            </span>
                          </h2>
                          <p>
                            We help businesses and institutions across Somalia
                            streamline operations, organize their data, and
                            deliver better services.
                          </p>
                        </div>
                      </Reveal>
                      <div className="capability-list">
                        {capabilities.map((item, i) => (
                          <Reveal key={item.title} delay={i * 0.05}>
                            <MotionButton
                              className="capability-row"
                              onClick={() => navigate("services")}
                            >
                              <span className="row-index">0{i + 1}</span>
                              <span className="capability-icon">
                                <item.icon strokeWidth={1.3} size={28} />
                              </span>
                              <div>
                                <span className="micro-copy">{item.tag}</span>
                                <h3>{item.title}</h3>
                              </div>
                              <p>{item.description}</p>
                              <span className="round-arrow">
                                <Arrow />
                              </span>
                            </MotionButton>
                          </Reveal>
                        ))}
                      </div>
                    </section>
                    <ProcessJourney onExplore={() => navigate("services")} />
                    <section
                      className="section work-section"
                      aria-labelledby="work-title"
                    >
                      <Reveal>
                        <div className="section-intro section-intro--work">
                          <Eyebrow number="03">Selected work</Eyebrow>
                          <h2 id="work-title">
                            <ScrollWords text="Real challenges." />
                            <br />
                            <span className="muted-heading">
                              <ScrollWords text="Purposeful solutions." />
                            </span>
                          </h2>
                          <MotionButton
                            className="text-link"
                            onClick={() => navigate("portfolio")}
                          >
                            All projects <Arrow />
                          </MotionButton>
                        </div>
                      </Reveal>
                      <ProjectShowcase featured />
                      {portfolio.length > 0 && (
                        <div className="published-case-studies">
                          <Eyebrow>Company case studies</Eyebrow>
                          <CaseList
                            portfolio={portfolio}
                            limit={2}
                            emptyState={emptyState}
                            onSelect={selectCase}
                          />
                        </div>
                      )}
                    </section>
                  </>
                )}
                {subPage === "services" && (
                  <>
                    <PageIntro
                      eyebrow="Our capabilities"
                      title={
                        <>
                          Turning business
                          <br />
                          challenges into
                          <br />
                          <em>real solutions.</em>
                        </>
                      }
                      description="We help businesses and institutions identify operational challenges, improve the way they work, and turn ideas into practical digital solutions."
                    />
                    <section className="section services-detail">
                      <Reveal>
                        <article className="service-feature">
                          <span className="service-number">01 / STRATEGY</span>
                          <div>
                            <h2>
                              Digital transformation
                              <br />& business solutions
                            </h2>
                            <p>
                              We analyze business challenges and design
                              practical solutions that improve efficiency,
                              simplify operations, and support sustainable
                              growth.
                            </p>
                            <ul>
                              {[
                                "Business Process Improvement & Automation",
                                "Digital Transformation & Operational Efficiency",
                                "Business Analysis & Solution Planning",
                              ].map((item) => (
                                <li key={item}>
                                  <Check size={16} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Network
                            size={68}
                            strokeWidth={0.7}
                            aria-hidden="true"
                          />
                        </article>
                      </Reveal>
                      <Reveal>
                        <article className="service-feature">
                          <span className="service-number">
                            02 / ENGINEERING
                          </span>
                          <div>
                            <h2>
                              Custom business systems
                              <br />& applications
                            </h2>
                            <p>
                              Tailored digital systems that solve real-world
                              problems, organize business operations, and help
                              organizations manage their daily activities more
                              effectively.
                            </p>
                            <ul>
                              {[
                                "Business Management Systems",
                                "School & Educational Management Systems",
                                "Customer, Sales & Inventory Management Solutions",
                                "Document & Records Management Systems",
                                "Custom Web Applications & Digital Platforms",
                              ].map((item) => (
                                <li key={item}>
                                  <Check size={16} />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Code2
                            size={68}
                            strokeWidth={0.7}
                            aria-hidden="true"
                          />
                        </article>
                      </Reveal>
                    </section>
                    <section className="section service-process">
                      <Eyebrow>From ideas to real solutions</Eyebrow>
                      <h2>
                        Thought through.
                        <br />
                        Built to keep moving.
                      </h2>
                      <div>
                        {process.map((step, i) => (
                          <Reveal key={step} delay={i * 0.05}>
                            <span className="row-index">0{i + 1}</span>
                            <h3>{step}</h3>
                          </Reveal>
                        ))}
                      </div>
                    </section>
                  </>
                )}
                {subPage === "portfolio" && !selectedCaseStudy && (
                  <>
                    <PageIntro
                      eyebrow="Portfolio & case studies"
                      title={
                        <>
                          Real-world challenges.
                          <br />
                          <em>Work with purpose.</em>
                        </>
                      }
                      description="Explore selected software and digital experiences. Open the live demos and discover the source behind each project."
                    />
                    <section className="section">
                      <ProjectShowcase />
                      {portfolio.length > 0 && (
                        <div className="published-case-studies">
                          <Eyebrow>Company case studies</Eyebrow>
                          <CaseList
                            portfolio={portfolio}
                            emptyState={emptyState}
                            onSelect={selectCase}
                          />
                        </div>
                      )}
                    </section>
                  </>
                )}
                {subPage === "portfolio" && selectedCaseStudy && (
                  <article className="case-detail section">
                    <MotionButton
                      className="text-link"
                      onClick={() => {
                        setSelectedCaseStudy(null);
                        window.scrollTo({ top: 0, behavior: "instant" });
                      }}
                    >
                      <ChevronLeft size={18} />
                      Back to case studies
                    </MotionButton>
                    <Reveal>
                      <Eyebrow>{selectedCaseStudy.category}</Eyebrow>
                      <h1>{selectedCaseStudy.title}</h1>
                      <p className="case-subtitle">
                        {selectedCaseStudy.project_title ||
                          selectedCaseStudy.summary}
                      </p>
                      <dl className="case-metadata">
                        <div>
                          <dt>Client</dt>
                          <dd>{selectedCaseStudy.client}</dd>
                        </div>
                        <div>
                          <dt>Industry</dt>
                          <dd>{selectedCaseStudy.industry}</dd>
                        </div>
                        <div>
                          <dt>Completed</dt>
                          <dd>{selectedCaseStudy.completion_date}</dd>
                        </div>
                      </dl>
                    </Reveal>
                    <div className="case-narrative">
                      {[
                        [
                          "The business challenge",
                          selectedCaseStudy.problem ||
                            selectedCaseStudy.description,
                        ],
                        ["The solution", selectedCaseStudy.solution],
                        [
                          "Business impact",
                          selectedCaseStudy.business_impact ||
                            selectedCaseStudy.result,
                        ],
                      ].map(
                        ([heading, text], i) =>
                          text && (
                            <Reveal key={heading}>
                              <section>
                                <span className="row-index">0{i + 1}</span>
                                <div>
                                  <h2>{heading}</h2>
                                  <p>{text}</p>
                                  {i === 1 &&
                                    !!selectedCaseStudy.key_improvements
                                      ?.length && (
                                      <ul>
                                        {selectedCaseStudy.key_improvements.map(
                                          (item) => (
                                            <li key={item}>
                                              <Check size={16} />
                                              {item}
                                            </li>
                                          ),
                                        )}
                                      </ul>
                                    )}
                                </div>
                              </section>
                            </Reveal>
                          ),
                      )}
                    </div>
                    <MotionButton
                      className="button button--green"
                      onClick={() => navigate("contact")}
                    >
                      Discuss a similar project <Arrow />
                    </MotionButton>
                  </article>
                )}
                {subPage === "about" && (
                  <>
                    <PageIntro
                      eyebrow="About KOBAC SYSTEMS"
                      title={
                        <>
                          Local understanding.
                          <br />
                          <em>Forward thinking.</em>
                        </>
                      }
                      description="Engineering the digital backbone for businesses, educational institutions, and government agencies across Somalia."
                    />
                    <section className="section about-story">
                      <Reveal>
                        <SystemsArtwork compact />
                      </Reveal>
                      <Reveal>
                        <Eyebrow>Our mission & vision</Eyebrow>
                        <h2>
                          Technology built
                          <br />
                          around people.
                        </h2>
                        <p>
                          Founded with a mission to bridge the technology gap in
                          emerging markets, KOBAC SYSTEMS brings software
                          engineering, rigorous project management, and secure
                          technology solutions to our clients.
                        </p>
                        <p>
                          Our multidisciplinary team works hand-in-hand with
                          organizational leaders to deliver transparent,
                          scalable, and impactful solutions tailored to local
                          needs.
                        </p>
                      </Reveal>
                    </section>
                    <section className="section team-section">
                      <Eyebrow>The people behind the systems</Eyebrow>
                      <h2>Meet the team.</h2>
                      {users.length ? (
                        <div className="team-grid">
                          {users.map((member, i) => (
                            <Reveal key={member.id} delay={i * 0.06}>
                              <article className="team-member">
                                {member.avatar ? (
                                  <img
                                    src={member.avatar}
                                    alt={member.name}
                                    loading="lazy"
                                    width="320"
                                    height="320"
                                  />
                                ) : (
                                  <div
                                    className="team-initial"
                                    aria-hidden="true"
                                  >
                                    {member.name.charAt(0)}
                                  </div>
                                )}
                                <h3>{member.name}</h3>
                                <p className="team-title">{member.title}</p>
                                <p className="micro-copy">
                                  {member.department} / {member.role}
                                </p>
                                <p>{member.responsibilities}</p>
                                <a href={`mailto:${member.email}`}>
                                  {member.email}
                                  <Arrow />
                                </a>
                                {member.phone && (
                                  <a
                                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                                  >
                                    {member.phone}
                                  </a>
                                )}
                                <span className="team-access">
                                  {member.active ? "Active access" : "Inactive"}
                                </span>
                              </article>
                            </Reveal>
                          ))}
                        </div>
                      ) : (
                        emptyState
                      )}
                    </section>
                  </>
                )}
                {subPage === "contact" && (
                  <section className="section contact-page">
                    <Reveal>
                      <Eyebrow>Get in touch</Eyebrow>
                      <h1>
                        Something
                        <br />
                        on your <em>mind?</em>
                      </h1>
                      <p className="contact-lead">
                        Have a project in mind or need enterprise consulting?
                        Contact us directly or send a message.
                      </p>
                      <div className="contact-address">
                        <span className="micro-copy">Write to us</span>
                        {emails.map((email) => (
                          <a key={email} href={`mailto:${email}`}>
                            {email}
                            <Arrow />
                          </a>
                        ))}
                        <span className="micro-copy">Let's talk</span>
                        {phones.map((phone) => (
                          <a
                            key={phone}
                            href={`tel:${phone.replace(/\s/g, "")}`}
                          >
                            {phone}
                          </a>
                        ))}
                        <span className="micro-copy">Find us</span>
                        <p>
                          {companySettings?.location || "Mogadishu, Somalia"}
                        </p>
                      </div>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <ContactForm />
                    </Reveal>
                  </section>
                )}
                {subPage === "wizard" && (
                  <div className="wizard-shell">{renderWizard(navigate)}</div>
                )}
              </m.div>
            </AnimatePresence>
          </main>
          <footer inert={mobileMenuOpen} className="site-footer">
            <div className="footer-invite">
              <Reveal>
                <Eyebrow>What's next?</Eyebrow>
                <h2>
                  Your next chapter.
                  <br />
                  <span>Let's build it.</span>
                </h2>
              </Reveal>
              <MotionButton
                className="footer-cta"
                onClick={() => navigate("wizard")}
                aria-label="Start a project with the AI Project Scoper"
              >
                <ArrowUpRight size={42} strokeWidth={1.2} />
              </MotionButton>
            </div>
            <div className="footer-grid">
              <div>
                <button
                  className="brand-home"
                  onClick={() => navigate("home")}
                  aria-label="KOBAC SYSTEMS home"
                >
                  <Brand dark custom={companySettings?.logo_url} name={title} />
                </button>
                <p>
                  {companySettings?.tagline ||
                    "Enterprise IT & Digital Transformation Solutions"}
                </p>
                <p>{companySettings?.location || "Mogadishu, Somalia"}</p>
              </div>
              <nav aria-label="Footer navigation">
                <span className="micro-copy">Explore</span>
                {navigation.map(([page, label]) => (
                  <button key={page} onClick={() => navigate(page)}>
                    {label}
                  </button>
                ))}
              </nav>
              <div className="footer-contact">
                <span className="micro-copy">Say hello</span>
                {emails.map((email) => (
                  <a key={email} href={`mailto:${email}`}>
                    {email}
                  </a>
                ))}
                {phones.map((phone) => (
                  <a key={phone} href={`tel:${phone.replace(/\s/g, "")}`}>
                    {phone}
                  </a>
                ))}
              </div>
              <div>
                <span className="micro-copy">For the team</span>
                <p>
                  Clients, projects, contracts.
                  <br />
                  Your operations, connected.
                </p>
                <button
                  className="text-link text-link--light"
                  onClick={() => setActivePortal("portal")}
                >
                  Operations portal <Arrow />
                </button>
              </div>
            </div>
            <FooterBrand />
            <div className="footer-bottom">
              <span>
                © {new Date().getFullYear()} {title}
              </span>
              <span>Built around your business.</span>
              <button
                aria-pressed={motionPaused}
                onClick={() => setMotionPaused((value) => !value)}
              >
                {motionPaused ? "Enable" : "Reduce"} motion{" "}
                <span aria-hidden="true">{motionPaused ? "○" : "◉"}</span>
              </button>
              <a href="#main-content">Back to top ↑</a>
            </div>
          </footer>
        </div>
      </MotionConfig>
    </MotionPreference.Provider>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
}) {
  return (
    <section className="section page-intro">
      <Reveal>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
      </Reveal>
      <span className="page-intro-mark" aria-hidden="true">
        ↘
      </span>
    </section>
  );
}
function ContactForm() {
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [contactError, setContactError] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const handleContactSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setContactSubmitting(true);
    setContactError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      if (response.ok) {
        setSubmitted(true);
        setContactForm({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        throw new Error(
          data.error || "Unable to send your message. Please try again.",
        );
      }
    } catch (error) {
      setContactError(
        error instanceof Error && !error.message.includes("JSON")
          ? error.message
          : "We could not send your message right now. Please try again or contact the team directly.",
      );
    } finally {
      setContactSubmitting(false);
    }
  };
  if (submitted)
    return (
      <div className="contact-success" role="status">
        <Check size={34} />
        <h2>Message received.</h2>
        <p>
          Thank you for reaching out. Our team will review your inquiry and get
          back to you.
        </p>
        <MotionButton className="text-link" onClick={() => setSubmitted(false)}>
          Send another message <Arrow />
        </MotionButton>
      </div>
    );
  return (
    <form className="contact-form" onSubmit={handleContactSubmit}>
      <span className="micro-copy">Tell us a little about your project</span>
      <div className="form-two">
        <label htmlFor="contact-name">
          Your name
          <input
            id="contact-name"
            autoComplete="name"
            required
            value={contactForm.name}
            onChange={(e) =>
              setContactForm({ ...contactForm, name: e.target.value })
            }
            placeholder="Full name"
          />
        </label>
        <label htmlFor="contact-email">
          Email address
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            required
            value={contactForm.email}
            onChange={(e) =>
              setContactForm({ ...contactForm, email: e.target.value })
            }
            placeholder="you@company.com"
          />
        </label>
      </div>
      <label htmlFor="contact-subject">
        What are you thinking about?
        <input
          id="contact-subject"
          required
          value={contactForm.subject}
          onChange={(e) =>
            setContactForm({ ...contactForm, subject: e.target.value })
          }
          placeholder="A project, an idea, a challenge…"
        />
      </label>
      <label htmlFor="contact-message">
        Your message
        <textarea
          id="contact-message"
          rows={5}
          required
          value={contactForm.message}
          onChange={(e) =>
            setContactForm({ ...contactForm, message: e.target.value })
          }
          placeholder="Tell us what you have in mind."
        />
      </label>
      {contactError && (
        <p role="alert" className="form-error">
          {contactError}
        </p>
      )}
      <button
        type="submit"
        className="button button--green"
        disabled={contactSubmitting}
      >
        {contactSubmitting ? "Sending your message…" : "Send inquiry"}
        <Arrow />
      </button>
    </form>
  );
}
