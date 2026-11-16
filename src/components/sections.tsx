import Image from "next/image";
import { Suspense } from "react";
import { site, type Project } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import { projectNotes, Stage, type StageDef } from "./ProjectNotes";
import { h2, label, Section, wrap } from "./Section";
import { ThemeToggle } from "./ThemeToggle";
import { Thread } from "./Thread";
import { Year } from "./Year";

const button =
  "inline-flex h-12 items-center justify-center gap-2.5 rounded-full px-[26px] text-base font-semibold transition-colors active:translate-y-px sm:h-13";
const buttonPrimary = `${button} bg-pen text-surface hover:bg-pen-hover`;
const buttonSecondary = `${button} border border-ink text-ink hover:bg-ink hover:text-surface`;
const tag =
  "rounded-full border border-line bg-surface px-3.5 py-1.5 text-[15px] leading-normal transition-colors hover:border-ink";
const h3 = "font-display text-[22px] font-semibold leading-[1.3] lg:text-2xl";
const textLink =
  "inline-flex min-h-11 items-center underline decoration-1 underline-offset-[5px] transition-colors";
/** A sheet of paper, as in the notes around each project. */
const paper =
  "rounded-[2px] border-[1.25px] border-ink bg-surface shadow-[0_10px_24px_rgba(21,35,28,0.08)]";

const navLinks = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Services", "#services"],
  ["Contact", "#contact"],
];

/** "One. Two." becomes ["One.", "Two."], so each sentence can sit on its own line. */
const sentences = (text: string) => text.match(/[^.!?]+[.!?]*/g)?.map((part) => part.trim()) ?? [text];

/** The hand-drawn pen stroke used as an underline. */
function PenStroke({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 12"
      preserveAspectRatio="none"
      fill="none"
      className={`absolute left-0 top-full h-3 w-full overflow-visible ${className}`}
    >
      <path
        d="M0 6C30 3 64 9 100 6"
        className="stroke-pen"
        strokeWidth="2.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

const dotPage = <div aria-hidden="true" className="dot-page absolute inset-0 -z-10" />;

export function Nav() {
  return (
    <header data-build-scope="2" className="sticky top-0 z-10 h-(--nav-h) border-b border-line bg-paper/90 backdrop-blur-md">
      <nav aria-label="Main" className={`${wrap} relative h-full`}>
        <div className="flex h-full items-center justify-between gap-4">
          <a
            href="#top"
            data-build="place"
            className="flex min-h-11 items-center gap-2.5 font-display text-[17px] font-semibold italic md:text-xl"
          >
            <span aria-hidden="true" className="size-2 flex-none rounded-full bg-pen" />
            {site.person.name}
          </a>
          <div className="flex items-center gap-1 md:gap-5 lg:gap-7">
            <NavLinks links={navLinks} />
            <ThemeToggle />
            <MobileMenu links={navLinks} />
          </div>
        </div>
      </nav>
    </header>
  );
}

export function Hero() {
  const { person } = site;
  const words = person.name.split(" ");
  return (
    <Section id="top" backdrop={dotPage}>
      <div className="relative">
        <p data-build="type" className="font-mono text-xs font-medium leading-normal text-ink-2 lg:text-[13px]">
          {person.availability}
        </p>
        {/* From desktop up the name runs the full width, while the role and tagline sit in the
            space the shorter surname line leaves on its right. */}
        <div className="relative mt-5 lg:mt-6">
          {/* One word per line on phones; the surname alone on the second line from desktop up. */}
          <h1
            data-build="type"
            className="font-display text-[clamp(3.5rem,15vw,6rem)] font-semibold leading-[0.95] lg:whitespace-nowrap lg:text-[clamp(6rem,10.6vw,9.75rem)] lg:leading-[0.9]"
          >
            {words.map((word, i) => (
              <span key={i} className={i === words.length - 1 ? "block" : "block lg:inline"}>
                {word}{" "}
              </span>
            ))}
          </h1>
          <div className="mt-6 lg:absolute lg:bottom-[0.3vw] lg:right-0 lg:mt-0 lg:w-[45%]">
            <p data-build="type" className="text-[17px] text-ink-2 lg:text-xl">
              {person.role}
            </p>
            <p
              data-build="type"
              className="mt-3 font-display text-[26px] font-semibold italic leading-[1.2] lg:mt-1.5 lg:text-[clamp(1.625rem,2.35vw,2.125rem)]"
            >
              {sentences(person.tagline).map((line, i) => (
                <span key={i} className="block">
                  {line}{" "}
                </span>
              ))}
            </p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4 lg:mt-14">
          <a href="#projects" data-build="place" className={buttonPrimary}>
            View projects
          </a>
          {person.resumeUrl ? (
            <a href={person.resumeUrl} data-build="place" className={buttonSecondary} download>
              Download resume
            </a>
          ) : null}
          <a href="#contact" data-build="place" className={buttonSecondary}>
            Contact me
          </a>
        </div>
        <div
          data-build="place"
          className="mt-12 flex items-center justify-between gap-6 border-t border-line pt-3 lg:mt-16"
        >
          <p className={label}>{person.location}</p>
          <a
            href="#about"
            className="group flex min-h-11 flex-none items-center gap-2.5 whitespace-nowrap text-[15px] font-medium text-ink-2 transition-colors hover:text-ink"
          >
            Keep reading
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform group-hover:translate-y-0.5"
            >
              <path d="M7 1v11M2.5 8L7 12.5 11.5 8" />
            </svg>
          </a>
        </div>
      </div>
    </Section>
  );
}

const factTilts = ["sm:rotate-[1.5deg]", "sm:-rotate-1", "sm:rotate-1", "sm:-rotate-[1.5deg]"];

export function About() {
  const { about, person } = site;
  const [lead, ...rest] = about.paragraphs;
  const names = person.name.split(" ");
  const initials = `${names[0][0]}${names.length > 1 ? names[names.length - 1][0] : ""}`;
  return (
    <Section id="about" heading={about.heading} tone="bg-sage">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-20">
        <div className="space-y-5">
          <p data-build="type" className="font-display text-[26px] font-medium leading-[1.25] lg:text-[34px]">{lead}</p>
          {rest.map((text, i) => (
            <p key={i} data-build="type" className="max-w-[58ch] text-ink-2">
              {text}
            </p>
          ))}
        </div>
        {/* The portrait and the facts, pinned like the notes around each project. */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <figure data-build="place" className={`${paper} row-span-2 flex flex-col gap-2.5 p-2.5 pb-3 sm:-rotate-2`}>
            <div className="relative min-h-44 flex-1 overflow-hidden bg-sage">
              {person.photo ? (
                <Image
                  src={person.photo}
                  alt={`Portrait of ${person.name}`}
                  fill
                  sizes="(min-width: 1024px) 260px, 45vw"
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 flex items-center justify-center font-display text-6xl font-semibold italic text-ink-2 lg:text-7xl"
                >
                  {initials}
                </span>
              )}
            </div>
            <figcaption className={label}>{person.name}</figcaption>
          </figure>
          {about.facts.map((fact, i) => {
            const pen = i === about.facts.length - 1;
            return (
              <div
                key={fact.label}
                data-build="place"
                className={`${paper} flex flex-col gap-1.5 p-3.5 lg:p-4 ${factTilts[i % factTilts.length]} ${
                  pen ? "border-pen" : ""
                }`}
              >
                <p className={`${label} ${pen ? "text-pen" : ""}`}>{fact.label}</p>
                <p
                  className={`font-display text-lg font-semibold italic leading-[1.25] lg:text-[21px] ${
                    pen ? "text-pen" : ""
                  }`}
                >
                  {fact.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export function Skills() {
  const { skills } = site;
  return (
    <Section id="skills" heading={skills.heading}>
      <dl>
        {skills.groups.map((group) => (
          <div
            key={group.title}
            data-build="place"
            className="grid gap-3 border-t border-line py-5 first:border-t-0 first:pt-0 last:pb-0 md:grid-cols-[240px_1fr] md:gap-14"
          >
            <dt className={h3}>{group.title}</dt>
            <dd>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item, i) => (
                  <li key={i} className={tag}>
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}

/** Panels step through paper, sage and mist, then repeat. */
const panelTones = ["bg-paper", "bg-sage", "bg-mist"];

function ProjectTitle({ project }: { project: Project }) {
  const lines = project.titleLines ?? [project.title];
  return (
    <>
      <span className="sr-only">{project.title}</span>
      <span aria-hidden="true">
        {lines.map((line, i) => (
          // The pen line runs over the first line of the title and behind the rest (Thread.tsx).
          <span key={i} className="block" data-thread-over={i === 0 ? "" : undefined}>
            {line.split("&").map((part, j) => (
              <span key={j}>
                {j > 0 ? <span className="font-semibold italic">&amp;</span> : null}
                {part}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

/**
 * One project. The title and summary sit in the middle of the panel, with two stages of notes
 * above them, one on each side of the summary and two below. The pen line runs across the top,
 * crosses the title (over its first line, behind its second) and then works through the rest.
 * On phones the title and summary come first and the stages follow in the order the line visits them.
 */
function ProjectPanel({ project, index }: { project: Project; index: number }) {
  const notes = projectNotes[project.title];
  const band = "grid w-full gap-10 lg:grid-cols-2 lg:items-center lg:gap-x-[6%]";
  const stage = (def: StageDef, right: boolean, key: number) => (
    <Stage key={key} w={def.w} h={def.h} className={`w-full ${right ? "lg:order-2 lg:justify-self-end" : "lg:order-1"}`}>
      {def.node}
    </Stage>
  );
  return (
    <article
      data-project={index + 1}
      // The route of the pen line through this panel's notes; read by Thread.tsx.
      data-thread={notes ? JSON.stringify(notes.thread) : undefined}
      data-build-scope
      className={`relative ${panelTones[index % 3]}`}
    >
      {/* Where the pen line can part and meet again: the top and bottom middle of the panel. */}
      <span aria-hidden="true" data-node="top" className="absolute left-1/2 top-6 size-0" />
      <span aria-hidden="true" data-node="end" className="absolute bottom-6 left-1/2 size-0" />
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 py-14 sm:px-10 lg:gap-9 lg:px-[min(6.67vw,96px)] lg:py-20">
        {notes ? <div className={`order-3 lg:order-1 ${band}`}>{notes.top.map((def, i) => stage(def, i === 1, i))}</div> : null}

        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:items-center lg:gap-6">
          <p data-build="type" className={label}>
            {String(index + 1).padStart(2, "0")} / {project.category}
          </p>
          <h3
            data-build="place"
            className="relative z-[3] whitespace-nowrap font-display text-[clamp(3.375rem,13.2vw,11.875rem)] font-black uppercase leading-[0.9] lg:text-center lg:leading-[0.86]"
          >
            <ProjectTitle project={project} />
          </h3>
        </div>

        {/* The summary, with a small stage on each side of it from desktop up. */}
        <div className="contents lg:order-3 lg:-mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,560px)_minmax(0,1fr)] lg:items-center lg:gap-x-8">
        <div
          data-build="place"
          data-thread-avoid
          className="relative z-[4] order-2 -mt-6 flex w-full max-w-[560px] flex-col gap-3.5 text-ink-2 lg:mt-0 lg:items-center lg:justify-self-center lg:text-center"
        >
          <p>{project.summary}</p>
          <p className="font-mono text-[13px] leading-[1.6] lg:text-sm">{project.tags.join(" · ")}</p>
          <div className="flex flex-wrap gap-x-7 text-base">
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${textLink} font-semibold text-pen hover:text-pen-hover`}
              >
                Explore project →
              </a>
            ) : null}
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${textLink} ${
                  project.liveUrl ? "font-medium text-ink hover:text-pen" : "font-semibold text-pen hover:text-pen-hover"
                }`}
              >
                {project.liveUrl ? "Source code" : "Source code →"}
              </a>
            ) : null}
          </div>
        </div>
          {notes?.sides.map((def, i) => (
            <Stage
              key={i}
              w={def.w}
              h={def.h}
              className={`order-4 -my-3 w-[52%] lg:my-0 lg:w-full ${i === 0 ? "self-start lg:order-1 lg:justify-self-start" : "self-end lg:order-3 lg:justify-self-end"}`}
            >
              {def.node}
            </Stage>
          ))}
        </div>

        {notes ? (
          <div className={`order-5 lg:order-4 ${band}`}>{notes.bottom.map((def, i) => stage(def, i === 1, i))}</div>
        ) : null}
      </div>
    </article>
  );
}

export function Projects() {
  const { projects } = site;
  return (
    <section
      id="projects"
      data-section="projects"
      data-snap
      className="relative isolate overflow-x-clip"
    >
      {/* Nothing snaps between the panels below; only the section itself settles under the nav bar. */}
      <div data-build-scope="2" className={`${wrap} relative pt-12 lg:pt-14`}>
        <div className="border-t-2 border-ink pb-10 pt-5 lg:pb-14">
          <h2 data-build="type" className={h2}>
            {/* The pen line starts here, as the underline of this heading. */}
            <span data-thread-start>{projects.heading}</span>
          </h2>
        </div>
      </div>
      {projects.items.map((project, i) => (
        <ProjectPanel key={project.title} project={project} index={i} />
      ))}
      <Thread />
    </section>
  );
}

export function Services() {
  const { services } = site;
  return (
    <Section
      id="services"
      heading={services.heading}
      tone="bg-mist"
      aside={<p data-build="type" className="max-w-[40ch] text-ink-2 lg:pb-2 lg:text-right">{services.intro}</p>}
    >
      {/* Each service is one wide row that leads to the contact section. */}
      <ul>
        {services.items.map((service, i) => (
          <li key={i} data-build="place" className="border-t border-ink last:border-b">
            <a
              href="#contact"
              className="group -mx-3 grid items-center gap-x-12 gap-y-2 px-3 py-5 transition-colors hover:bg-surface sm:-mx-4 sm:px-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_auto] lg:py-7"
            >
              <h3 className="font-display text-[28px] font-semibold leading-[1.15] transition-[translate,color] duration-300 group-hover:translate-x-2 group-hover:text-pen motion-reduce:transition-none lg:text-[40px]">
                {service.title}
              </h3>
              <p className="text-base text-ink-2 lg:text-[17px]">{service.description}</p>
              <span
                aria-hidden="true"
                className="hidden size-12 items-center justify-center rounded-full border border-ink transition-colors group-hover:border-pen group-hover:bg-pen group-hover:text-surface lg:flex"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 12L12 2M4.5 2H12v7.5" />
                </svg>
              </span>
              <span className="sr-only">Ask about this service</span>
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Experience() {
  const { experience } = site;
  if (!experience.enabled || experience.items.length === 0) return null;
  return (
    <Section id="experience" heading={experience.heading}>
      <ol>
        {experience.items.map((item, i) => (
          <li key={i} data-build="place" className="flex flex-col gap-2 border-t border-line py-5 first:border-t-0 first:pt-0 sm:flex-row sm:gap-5">
            <p className={`${label} flex-none pt-1.5 sm:w-40`}>{item.period}</p>
            <div>
              <h3 className="font-display text-[22px] font-semibold leading-[1.3]">{item.role}</h3>
              <p className="font-display italic">{item.organization}</p>
              <p className="mt-1 max-w-[62ch] text-ink-2">{item.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

export function Testimonials() {
  const { testimonials } = site;
  if (!testimonials.enabled || testimonials.items.length === 0) return null;
  return (
    <Section id="testimonials" heading={testimonials.heading} tone="bg-sage">
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
        {testimonials.items.map((item, i) => (
          <figure key={i} data-build="place" className="flex flex-col gap-3">
            <blockquote className="font-display text-2xl font-semibold italic leading-[1.35]">
              “{item.quote}”
            </blockquote>
            <figcaption className={label}>
              {item.name}, {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

export function Contact() {
  const { contact, person } = site;
  const field =
    "h-11 w-full border-b border-ink bg-transparent text-lg text-ink focus:border-b-2 focus:border-pen";
  return (
    <Section id="contact" backdrop={dotPage}>
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center xl:grid-cols-[minmax(0,1fr)_minmax(0,460px)] xl:gap-20">
        {/* The email address is the main way in, so it is the biggest thing on the screen. */}
        <div className="flex flex-col items-start gap-5">
          <h2 data-build="type" className={h2}>
            {contact.heading}
          </h2>
          <p data-build="type" className="max-w-[44ch] text-ink-2">
            {contact.intro}
          </p>
          <a
            href={`mailto:${person.email}`}
            data-build="place"
            className="relative mt-3 max-w-full break-all font-display text-[clamp(1.375rem,3vw,2.875rem)] font-semibold italic leading-[1.25] transition-colors hover:text-pen"
          >
            {person.email}
            <PenStroke />
          </a>
          <ul data-build="place" className="mt-8 flex flex-wrap gap-x-8 gap-y-1">
            {contact.socials.map((social) => (
              <li key={social.label}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex min-h-11 items-center gap-2 font-display text-[22px] font-semibold transition-colors hover:text-pen"
                >
                  {social.label}
                  <svg
                    aria-hidden="true"
                    width="12"
                    height="12"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  >
                    <path d="M2 12L12 2M4.5 2H12v7.5" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
          {person.resumeUrl ? (
            <a href={person.resumeUrl} data-build="place" className={`${buttonSecondary} mt-2`} download>
              Download resume
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M7 1v9M3 6.5L7 10l4-3.5M1.5 13h11" />
              </svg>
            </a>
          ) : null}
        </div>

        {/* Sending is wired up in a later step; the form is layout only for now. */}
        <form data-build="place" className={`${paper} flex flex-col gap-5 p-5 sm:p-7`}>
          <label className="flex flex-col">
            <span className={label}>Name</span>
            <input type="text" name="name" autoComplete="name" required className={field} />
          </label>
          <label className="flex flex-col">
            <span className={label}>Email</span>
            <input type="email" name="email" autoComplete="email" required className={field} />
          </label>
          <label className="flex flex-col gap-2">
            <span className={label}>Message</span>
            <textarea
              name="message"
              rows={3}
              required
              className="w-full resize-none rounded-[2px] border border-ink bg-paper px-3 py-2.5 text-lg text-ink focus:border-pen"
            />
          </label>
          <button
            type="submit"
            disabled
            className={`${button} self-start bg-pen px-8 text-surface hover:bg-pen-hover disabled:bg-sage disabled:text-disabled`}
          >
            Send message
          </button>
          <p className="text-[15px] leading-normal text-ink-2">
            The form is not connected yet. Use the email link for now.
          </p>
        </form>
      </div>
    </Section>
  );
}

export function Footer() {
  const { person } = site;
  return (
    <footer data-build-scope="2" className="relative bg-deep text-on-deep [&_:focus-visible]:outline-on-deep">
      <div className={`${wrap} pb-6 pt-12 lg:pt-16`}>
        <p data-build="type" className="font-display text-[clamp(2.25rem,6.2vw,5rem)] font-semibold italic leading-[1.05]">
          {sentences(person.tagline).map((line, i) => (
            <span key={i} className="block">
              {line}{" "}
            </span>
          ))}
        </p>
        <div data-build="place" className="mt-10 flex flex-col gap-x-10 gap-y-3 border-t border-on-deep/20 pt-4 text-[15px] text-on-deep-2 md:flex-row md:items-center lg:mt-14">
          <p className="flex gap-[0.3em] md:mr-auto">
            ©{" "}
            <Suspense fallback={null}>
              <Year />
            </Suspense>{" "}
            {person.name}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            {navLinks.map(([text, href]) => (
              <li key={href}>
                <a href={href} className="flex min-h-11 items-center transition-colors hover:text-on-deep">
                  {text}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#top"
            className="group flex min-h-11 items-center gap-2.5 font-medium text-on-deep transition-colors"
          >
            Back to top
            <svg
              aria-hidden="true"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="transition-transform group-hover:-translate-y-0.5"
            >
              <path d="M7 13V2M2.5 6L7 1.5 11.5 6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
