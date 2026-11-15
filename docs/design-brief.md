# Design brief: personal website

## What I need from you

Propose **three distinct design directions** for my personal website so I can pick one.
Each direction is a small design system plus mockups that show it applied.
Do not blend them or recommend a hybrid; I want three clear, different options to compare.

The site structure and content model already exist in code (Next.js, Tailwind v4).
The page is currently unstyled on purpose. You are choosing the look, not the structure.

## About the site

- **Type:** one-page personal portfolio.
- **Owner:** Adrian Gabriel Ablaza, a full-stack software developer and graduating student in Cabanatuan City, Nueva Ecija, focused on AI-driven programming and agentic workflows. No work experience yet; looking for an internship.
- **Audience:** two groups at once.
  - Recruiters and employers, who skim quickly and want skills, projects and a resume.
  - Freelance clients, who want to see services, proof of work and an easy way to get in touch.
- **Goal:** look credible and memorable, and get the visitor to the projects, the resume download or the contact form.

## Page sections, in order

1. **Nav:** name on the left, anchor links (About, Skills, Projects, Services, Contact).
2. **Hero:** availability line, name, role, one-line pitch, three buttons (View projects, Download resume, Contact me).
3. **About:** portrait photo, two short paragraphs, location.
4. **Skills and tech stack:** five groups (Frontend, Backend, Mobile, DevOps and cloud, Developer tools), each a set of skill tags. Group sizes are uneven: Backend has 11 tags, Mobile has 2.
5. **Projects:** five projects, each shown as its own large showcase panel joined by a travelling thread. See "The projects section" below; this is not a card grid.
6. **Services:** short intro, then three service cards (title and description).
7. **Contact:** form (name, email, message, send button) beside email, social links and resume download.
8. **Footer:** one line.

Two more sections exist but are hidden at launch: **Experience and education** (a timeline) and **Testimonials** (quote cards).
Include a style for each so they match when switched on later.

All content is real, including the five projects; take it from the attached `site.ts` content file. Do not invent employers, clients or testimonials.

## The signature idea: agents building the page

This is the one thing that must make the site not look generic, and every direction has to be designed around it.

As the visitor scrolls, each section appears to be **built live by a small team of AI agents**:

1. A few colored agent cursors move into the empty section.
2. They draw placeholder boxes where content will go. Each box has a selection outline with corner handles and a small size label such as `348 × 62`.
3. Text types itself in, character by character, with a text caret.
4. Placeholder boxes resolve into the finished content, the cursors leave, and the section stays finished.

Each section builds **once**, when it scrolls into view. There is a small **Skip** control that finishes the whole page instantly.

### Keep
- Colored agent cursors (small arrow pointers, a handful of colors).
- Selection boxes with corner handles and size labels.
- Text typing itself in.

### Explicitly excluded
- Rulers along the top or left edge.
- Dashed guide lines, alignment lines or crosshairs running across the page.
- A floating status bar with agent or layer counts.

### Tone of the effect
It must feel **calm and orderly**, not frantic. Visitors should never feel dizzy.
Think a small, tidy team (roughly 3 to 6 cursors visible at once), not a swarm.
On phones the effect is lighter: fewer cursors, shorter builds.

## The projects section: showcase panels and the thread

This section has its own concept, and it is the second thing that must make the site memorable.
It should feel like an **adventure**: the visitor follows a thread from one project to the next and discovers each one.

Reference for the concept: https://dakshgajjar.com/ (the projects part of the page). Take the idea, not the styling; see Constraints.

### Showcase panels
Each project gets one large panel, roughly a full screen tall, instead of a card. A panel contains:

- **A huge, bold project title.** The name is the hero of the panel, set as large as the width allows, in heavy uppercase or similarly forceful type.
- **Project-specific components around the title.** Objects and interface fragments that belong to that project and hint at what it does, overlapping and layered around the title. For an invoicing tool that could be stacked invoices and an extracted-value chip; for a chat app, message bubbles and a typing indicator; for a dashboard, a stat tile and a small chart.
- **A small numbered label and category**, for example `02 / WEB APP`.
- **One or two lines of description.**
- **Tech tags**, kept small so they do not compete with the title.
- **Links:** "Explore project" (live site) and source code.

Panels should vary so five in a row do not feel repetitive: alternate background tone, title position and component arrangement. State the rule you use so the pattern can be continued for future projects.

### The thread
A single continuous line that travels through the projects section and connects every panel.

- It is drawn progressively as the visitor scrolls, so it appears to lead the way.
- It wanders: it curves, loops, passes behind titles and in front of components, and arrives at each panel's key object before moving on.
- There is exactly one thread, in one color, with a hand-drawn or organic character. It is the opposite of a grid line.
- Decide where it starts and ends. It may begin before the projects section (for example from the hero) and finish at the Contact section, if that serves the direction.

**This does not contradict the excluded guide lines above.** Those were many straight, mechanical ruler and alignment lines across the whole page. The thread is one organic line with a narrative job.

### How the thread and the agents work together
Both ideas are on the same page, so each direction must show how they coexist without becoming busy. Propose one clear relationship. Possibilities:

- the agents build each panel's components, and the thread is what leads them to the next project;
- the thread is drawn by one lead agent cursor, with the others following it;
- the agent build is quieter inside the projects section so the thread is the main event there.

Whatever you choose, the calm rule still applies: a visitor should always know where to look.

### Practical limits for this section
- **Five full-screen panels is still a long scroll.** Show how the section stays comfortable, and how a sixth project could be added later without redesign.
- **Use the real projects.** They are listed under "The five projects" below. Design all five panels; if time is limited, design Scroll Maestro, Kae & Jae Cafe and KronoKeep in full and show the title treatment for the other two.
- **Two are Android apps.** Their components can sit inside or beside a simple phone outline so they read as mobile, distinct from the three web projects.
- **Components must be buildable in code.** Use interface fragments and simple line drawings that can be made with HTML, CSS and SVG, optionally around a real screenshot. No commissioned illustration, 3D or photography.
- **Phones:** titles still dominate but must not overflow; components reduce to one or two per panel; the thread simplifies to a gentler path down the page.
- **Reduced motion:** the thread appears fully drawn and static.

### The five projects

In display order. The component ideas come from each project's real features; use them as the objects around the title, and adapt or replace them if something else reads better.

| # | Title | Label | What it does | Component ideas |
|---|---|---|---|---|
| 01 | SCROLL MAESTRO | AI video automation | Turns a long video into short captioned clips and schedules them to TikTok and YouTube Shorts. | A long video timeline cut into vertical clips; caption style chips (Karaoke, Neon, Marker); a scheduling calendar with clips dropped onto days; connected account chips. |
| 02 | KAE & JAE CAFE | Ordering and store management | Online ordering for a real cafe: live menu, map-based delivery fees, online payment, real-time order tracking, staff dashboard. | A menu item card with add-to-cart; a map with a delivery radius circle and a pin; an order tracker (Pending, Preparing, Out for delivery); a store Open/Closed switch. |
| 03 | QUIZWARP | AI learning platform | Generates quizzes from text, files or images, then runs them as live games, homework or practice, with reports. | A multiple-choice question card; a live session join code; a streak counter with confetti; a team leaderboard. |
| 04 | KRONOKEEP | Android app | A vault for owned assets, receipts and warranties that predicts when maintenance is due and exports a verified service history. | A vehicle asset card with an odometer; a maintenance-due countdown; a receipt or warranty document; a verified PDF with a QR code. |
| 05 | CRAVEWISE | Android app | Helps people decide what to cook from the ingredients they have, with a decision quiz and a cook mode. | Pantry ingredient chips; recipe cards sorted into Cook now and Almost there; a decision quiz question; a cook mode step with a timer. |

Title lengths vary from 8 characters (QUIZWARP) to 14 with spaces (KAE & JAE CAFE, SCROLL MAESTRO). The title style must handle both, including on a 375px phone where the long ones will need to wrap onto two lines.

## What each direction must define

### Foundations
- **Color:** background, surface, border, primary text, secondary text, one accent, and states (hover, focus, disabled). State whether the direction is dark, light, or both; if both, give both sets.
- **Typography:** a heading font and a body font, both available on Google Fonts, plus a monospace font for size labels and code-like details. Give a type scale for desktop and phone.
- **Spacing and layout:** max content width, section spacing, grid, corner radius, border and shadow treatment.

### Components
Nav, buttons (primary and secondary), skill tag, service card, form fields, links, footer, timeline item, testimonial card.

### Build-animation kit
These are static styles only; motion is implemented later in code.
- **Agent cursors:** shape and the set of cursor colors (4 to 6), chosen to sit well on the palette.
- **Selection box:** outline color and weight, corner handle style.
- **Size label:** background, text color, font, shape.
- **Wireframe placeholder:** the fill used for a box before its content arrives.
- **Text caret:** color and shape.
- **Skip control:** appearance and position.

Show at least one mockup of a section **mid-build** (some boxes still placeholders, cursors present, one line half typed), next to the same section finished.

### Projects kit
- **Panel:** background tones, the alternation rule, padding and height.
- **Project title:** font, weight, size range from phone to desktop, and how it overlaps components.
- **Project components:** the drawing style for objects and interface fragments (line weight, fill, corner treatment, shadow), so new ones can be made to match.
- **Label, description, tags and links:** styles within a panel.
- **Thread:** color, weight, line character, how it passes behind and in front of things, and its start and end points.

## Mockups to deliver per direction

- **Desktop (about 1440px wide):** Hero and Contact, finished state.
- **Desktop projects:** at least three consecutive showcase panels (Scroll Maestro, Kae & Jae Cafe, KronoKeep) with the thread running through them, finished state.
- **Phone (375px wide):** Hero and two consecutive project panels with the thread, finished state.
- **Mid-build frame:** the Hero, as described above.
- **Projects in motion:** one project panel partway through, with the thread only partly drawn and the agents present, to show how the two ideas coexist.
- A one-paragraph rationale: the idea behind the direction and who it suits best.
- A short name for the direction so I can refer to it.

## How the three should differ

Make them differ in **personality**, not just in accent color. For example, they could vary in:
- mood (technical and precise, warm and editorial, bold and playful),
- light versus dark,
- type character (geometric sans, serif headings, monospace-led),
- density (airy versus compact),
- how prominent the agent cursors and selection boxes are against the page,
- the character of the thread and the style of the project components.

These are examples, not a required set. Choose three that are each a strong answer for this audience.

## Constraints

- **Original look.** Two outside sites inspired concepts here: a recording of another company's site (agents building the page) and https://dakshgajjar.com/ (showcase panels and the thread). Take only the concepts. Do not reproduce either site's colors, typography, layout, illustrations or branding. In particular, do not default to the second site's cream, black and orange-red palette.
- **Readable first.** Finished sections must be easy to scan; the effect decorates the content and never competes with it.
- **Accessible.** Text contrast of at least 4.5:1 (3:1 for large text), visible keyboard focus, touch targets of at least 44px, nothing conveyed by color alone.
- **Responsive.** Must work from 375px up with no horizontal scrolling.
- **Implementable.** Styles will be built as Tailwind v4 theme tokens (CSS variables) with fonts loaded from Google Fonts. Avoid anything that needs commissioned illustration, 3D, video or paid fonts; simple SVG line drawings and interface fragments are fine.
- **Reduced motion.** Visitors who ask their device for reduced motion see the finished page with no build effect, so the finished state must stand on its own.

## Out of scope

- Changing the section list or order.
- Writing final copy.
- Animation timing and code.
- Logo design.
