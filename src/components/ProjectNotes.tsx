import type { CSSProperties, ReactNode } from "react";

/**
 * The paper notes drawn above and below each project title, and the route the pen line takes through them.
 * Every stage is drawn at a fixed size in px and scaled down to the width it is given,
 * so one drawing serves desktop and phone. They are decoration: hidden from screen readers.
 *
 * A note with an `id` is a stop on the pen line (`data-node`, read by Thread.tsx).
 */

export type StageDef = { w: number; h: number; node: ReactNode };

/**
 * The pen line through one project, as ports on its notes: "video.b" is the middle of the bottom
 * edge of the note with id "video", "map.r.60" is 60% of the way down its right edge
 * (sides: t, b, l, r). Two ports of the same note in a row run hidden behind it.
 * "top" and "end" are the points at the top and bottom middle of the panel.
 */
export type ThreadSpec = {
  main: string[];
  /** Side lines. Each leaves when the main line reaches `at`; with `join` it lands as the main line gets there, otherwise it ends in a dot. */
  forks?: { at: string; join?: string; via: string[] }[];
};

export type ProjectNotes = {
  /** The two stages above the title, left then right. */
  top: StageDef[];
  /** One small stage on each side of the summary, left then right. */
  sides: StageDef[];
  /** The two stages below the title, left then right. */
  bottom: StageDef[];
  thread: ThreadSpec;
};

export function Stage({
  w,
  h,
  className = "",
  children,
}: {
  w: number;
  h: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      data-stage={w}
      data-build="place"
      className={`relative z-[2] [container-type:inline-size] ${className}`}
      style={{ aspectRatio: `${w} / ${h}`, maxWidth: w }}
    >
      <div
        className="absolute left-0 top-0 origin-top-left"
        // tan(atan2(a, b)) divides two lengths into a plain number.
        style={{ width: w, height: h, scale: `tan(atan2(100cqw, ${w}px))` }}
      >
        {children}
      </div>
    </div>
  );
}

const paper =
  "absolute rounded-[2px] border-[1.25px] border-ink font-mono text-[13px] leading-normal text-ink shadow-[0_10px_24px_rgba(21,35,28,0.08)]";

function Note({
  id,
  x,
  y,
  w,
  h,
  r = 0,
  fill = "bg-surface",
  className = "",
  children,
}: {
  id?: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  r?: number;
  fill?: string;
  className?: string;
  children?: ReactNode;
}) {
  const style: CSSProperties = { left: x, top: y, width: w, height: h, rotate: `${r}deg` };
  return (
    <div data-node={id} className={`${paper} ${fill} ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Android screens sit in an ink phone outline and are never rotated. */
function Phone({ id, x, y, children }: { id?: string; x: number; y: number; children: ReactNode }) {
  return (
    <div
      data-node={id}
      className="absolute flex h-[560px] w-[280px] flex-col gap-3 rounded-[34px] border-[1.5px] border-ink bg-surface px-4 pb-4 pt-11 font-mono text-[13px] leading-normal text-ink shadow-[0_10px_24px_rgba(21,35,28,0.08)]"
      style={{ left: x, top: y }}
    >
      <span className="absolute left-1/2 top-4 h-1.5 w-14 -translate-x-1/2 rounded-full bg-line" />
      {children}
    </div>
  );
}

const k = "font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-2";
const v = "font-display text-xl font-semibold italic";
const big = "font-display text-[34px] font-semibold leading-tight";
const chip = "rounded-[2px] border-[1.25px] border-ink px-3 py-1.5";

/** A labelled bar: a name, a value and how full it is. The leading row is drawn in pen. */
function Meter({ name, value, width, lead }: { name: string; value: string; width: string; lead?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className={lead ? "font-medium text-pen" : ""}>{name}</span>
        <span>{value}</span>
      </div>
      <div className="h-[3px] bg-line">
        <div className={`h-[3px] ${lead ? "bg-pen" : "bg-ink"}`} style={{ width }} />
      </div>
    </div>
  );
}

/** A small stage with one note, for the sides of the summary. */
function aside(id: string, r: number, label: string, value: string, detail: string, pen = false): StageDef {
  return {
    w: 300,
    h: 230,
    node: (
      <Note id={id} x={20} y={24} w={260} h={176} r={r} className="flex flex-col gap-1.5 p-3.5">
        <div className={`${k} ${pen ? "!text-pen" : ""}`}>{label}</div>
        <div className={`${big} italic ${pen ? "text-pen" : ""}`}>{value}</div>
        <div className="mt-auto text-ink-2">{detail}</div>
      </Note>
    ),
  };
}

/* Scroll Maestro: one long video is transcribed, its best moments become three clips,
   the clips are captioned, rendered, scheduled and posted to two accounts. */

function Clip({ id, x, y, r, text, tone }: { id: string; x: number; y: number; r: number; text: string; tone: string }) {
  return (
    <Note id={id} x={x} y={y} w={150} h={266} r={r} fill="bg-sage">
      <span className={`absolute inset-x-2.5 top-[150px] py-1 text-center ${tone}`}>{text}</span>
    </Note>
  );
}

const scrollMaestro: ProjectNotes = {
  top: [
    {
      w: 600,
      h: 400,
      node: (
        <>
          <Note id="video" x={10} y={30} w={580} h={84} r={-2} className="flex flex-col gap-1.5 px-2.5 py-2">
            <div className={k}>Long video, cut into clips</div>
            <div className="flex grow gap-[3px]">
              {[3, 2, 4, 2, 5, 2, 3].map((flex, i) => (
                <span key={i} className={i % 2 ? "bg-pen" : "bg-sage"} style={{ flex }} />
              ))}
            </div>
          </Note>
          <Note id="audio" x={150} y={170} w={300} h={200} r={2} className="flex flex-col gap-2 p-3.5">
            <div className={k}>Audio</div>
            <svg width="268" height="96" viewBox="0 0 268 96" fill="none" className="stroke-ink" strokeWidth="3" strokeLinecap="round">
              <path d="M4 40v16M16 28v40M28 36v24M40 14v68M52 30v36M64 42v12M76 22v52M88 34v28M100 8v80M112 32v32M124 42v12M136 30v36M148 18v60M160 38v20M172 26v44M184 10v76M196 34v28M208 24v48M220 40v16M232 16v64M244 32v32M256 42v12" />
            </svg>
            <div className="mt-auto text-ink-2">42:10, one speaker</div>
          </Note>
        </>
      ),
    },
    {
      w: 600,
      h: 400,
      node: (
        <>
          <Note id="transcript" x={10} y={30} w={330} h={196} r={-2} className="flex flex-col gap-1.5 p-3.5">
            <div className={k}>Transcript</div>
            {[
              ["00:41", "so the first version was ugly"],
              ["00:44", "make it work, then make it right"],
              ["00:48", "and that changed how I ship"],
            ].map(([time, line], i) => (
              <div key={time} className="flex items-start gap-2.5">
                <span className="text-ink-2">{time}</span>
                <span className={i === 1 ? "bg-pen px-1 text-surface" : ""}>{line}</span>
              </div>
            ))}
          </Note>
          <Note id="moments" x={350} y={214} w={240} h={176} r={2} className="flex flex-col gap-2.5 p-3.5">
            <div className={k}>Strongest moments</div>
            <Meter name="00:44" value="92" width="92%" lead />
            <Meter name="03:10" value="81" width="81%" />
            <Meter name="07:52" value="74" width="74%" />
          </Note>
        </>
      ),
    },
  ],
  sides: [
    aside("pick", 3, "Picked by Gemini", "3 clips", "From 42 minutes", true),
    aside("week", -3, "This week", "12 clips out", "Across 2 accounts"),
  ],
  bottom: [
    {
      w: 600,
      h: 460,
      node: (
        <>
          <Clip id="clip1" x={30} y={40} r={-3} text="make it work" tone="bg-ink text-surface" />
          <Clip id="clip2" x={225} y={70} r={2} text="then" tone="bg-pen text-surface" />
          <Clip id="clip3" x={420} y={40} r={4} text="make it right" tone="border border-ink bg-surface" />
          <div data-node="styles" className="absolute flex gap-2 font-mono text-[13px]" style={{ left: 172, top: 396, rotate: "-2deg" }}>
            <span className={`${chip} bg-pen text-surface`}>Karaoke</span>
            <span className={`${chip} bg-surface`}>Neon</span>
            <span className={`${chip} bg-surface`}>Marker</span>
          </div>
        </>
      ),
    },
    {
      w: 600,
      h: 460,
      node: (
        <>
          <Note id="queue" x={10} y={40} w={290} h={200} r={-1.5} className="flex flex-col gap-3 p-3.5">
            <div className={k}>Render queue</div>
            <Meter name="Clip 1" value="Done" width="100%" />
            <Meter name="Clip 2" value="64%" width="64%" lead />
            <Meter name="Clip 3" value="Queued" width="0%" />
          </Note>
          <Note id="schedule" x={340} y={20} w={230} h={190} r={2} className="flex flex-col gap-2 p-3">
            <div className={k}>Schedule</div>
            <svg width="206" height="138" viewBox="0 0 206 138" fill="none">
              <path
                d="M0 .5h206M0 46h206M0 92h206M0 137.5h206M.5 0v138M41.5 0v138M82.5 0v138M123.5 0v138M164.5 0v138M205.5 0v138"
                className="stroke-line"
              />
              <rect x="52" y="8" width="18" height="30" rx="1" className="fill-pen" />
              <rect x="134" y="54" width="18" height="30" rx="1" className="fill-pen" />
              <rect x="175" y="54" width="18" height="30" rx="1" className="stroke-pen" />
              <rect x="11" y="100" width="18" height="30" rx="1" className="fill-pen" />
            </svg>
          </Note>
          <div
            className="absolute flex flex-col items-start gap-5 font-mono text-[13px]"
            style={{ left: 150, top: 300, rotate: "-1deg" }}
          >
            <span data-node="tiktok" className={`${chip} bg-surface`}>
              TikTok, connected
            </span>
            <span data-node="youtube" className={`${chip} bg-surface`}>
              YouTube Shorts, connected
            </span>
          </div>
        </>
      ),
    },
  ],
  thread: {
    main: [
      "video.t.70", "video.b.50", "audio.t", "audio.r", "transcript.l", "transcript.b.75", "moments.l", "moments.b",
      "pick.t", "pick.b", "clip2.t", "clip2.b", "styles.t", "styles.r", "queue.b.25", "queue.r", "schedule.l", "schedule.b",
    ],
    forks: [
      { at: "pick.b", join: "styles.t", via: ["pick.b", "clip1.t", "clip1.b", "styles.t"] },
      { at: "pick.b", join: "styles.t", via: ["pick.b", "clip3.t", "clip3.b", "styles.t"] },
      { at: "schedule.b", via: ["schedule.b", "tiktok.r"] },
      { at: "schedule.b", via: ["schedule.b", "youtube.r"] },
      { at: "schedule.l", via: ["schedule.t", "week.b"] },
    ],
  },
};

/* Kae & Jae Cafe: a menu item goes to a pinned address and a checkout; the paid order then
   shows on two screens at once, the staff dashboard and the customer's tracker. */

const kaeAndJae: ProjectNotes = {
  top: [
    {
      w: 600,
      h: 400,
      node: (
        <>
          <Note id="menu" x={20} y={40} w={300} h={250} r={-2} className="flex flex-col gap-2.5 p-3.5">
            <div className={k}>Live menu</div>
            {[
              ["Iced latte", "₱120", true],
              ["Matcha latte", "₱140", true],
              ["Americano", "Sold out", false],
            ].map(([name, price, on]) => (
              <div
                key={name as string}
                className={`flex items-baseline justify-between border-t border-line pt-2.5 ${on ? "" : "text-ink-2"}`}
              >
                <span className={`${v} text-lg ${on ? "" : "line-through"}`}>{name}</span>
                <span>{price}</span>
              </div>
            ))}
            <div className="mt-auto text-ink-2">Staff edits show up at once</div>
          </Note>
          <Note id="item" x={350} y={50} w={220} h={260} r={3} className="flex flex-col gap-2 p-3">
            <div className="flex h-[110px] items-end justify-center bg-sage">
              <svg width="52" height="80" viewBox="0 0 56 84" fill="none" className="stroke-ink" strokeWidth="1.5">
                <path d="M8 20h40l-5 60H13zM4 20h48M12 12h32l2 8H10zM28 12V2" />
              </svg>
            </div>
            <div className="mt-auto flex items-baseline justify-between">
              <span className={v}>Iced latte</span>
              <span>₱120</span>
            </div>
            <span className="rounded-full bg-pen py-2 text-center text-surface">Add to cart</span>
          </Note>
        </>
      ),
    },
    {
      w: 640,
      h: 460,
      node: (
        <>
          <Note id="map" x={0} y={30} w={400} h={320} r={-2} className="overflow-hidden">
            <svg width="400" height="320" viewBox="0 0 400 320" fill="none">
              <path
                d="M-10 76C110 92 190 50 410 66M-10 246C130 220 280 270 410 236M84-10C100 100 56 200 92 330M300-10C274 120 326 210 310 330M-10 160h420"
                className="stroke-line"
                strokeWidth="5"
              />
              <circle cx="200" cy="160" r="112" className="fill-pen/[0.07] stroke-pen" strokeWidth="1.5" />
              <path
                d="M200 160c-9-12-14-19-14-27a14 14 0 0128 0c0 8-5 15-14 27z"
                className="fill-surface stroke-ink"
                strokeWidth="1.5"
              />
            </svg>
            <span className={`${k} absolute left-3 top-2.5`}>Delivery radius</span>
            <span className="absolute bottom-2.5 left-3">2.4 km · ₱49 delivery</span>
          </Note>
          <Note id="checkout" x={340} y={290} w={300} h={156} r={1.5} className="flex flex-col gap-1 p-3.5">
            <div className={k}>Checkout</div>
            <div className="flex justify-between">
              <span>Iced latte, 2</span>
              <span>₱240</span>
            </div>
            <div className="flex justify-between text-ink-2">
              <span>Delivery, 2.4 km</span>
              <span>₱49</span>
            </div>
            <div className="mt-auto flex items-center justify-between">
              <span className={v}>₱289</span>
              <span className="rounded-full bg-pen px-4 py-1.5 text-surface">Pay with PayMongo</span>
            </div>
          </Note>
        </>
      ),
    },
  ],
  sides: [
    aside("alert", -3, "Staff, new order", "Order 1042", "Paid, ₱289"),
    aside("paid", 3, "Customer, payment", "Paid ₱289", "Receipt sent", true),
  ],
  bottom: [
    {
      w: 600,
      h: 460,
      node: (
        <>
          <Note id="orders" x={20} y={30} w={360} h={250} r={-2} className="flex flex-col gap-2.5 p-3.5">
            <div className={k}>Staff dashboard, orders</div>
            {[
              ["1042", "Iced latte, 2", "Preparing"],
              ["1041", "Matcha, 1", "Out for delivery"],
              ["1040", "Americano, 3", "Delivered"],
            ].map(([number, items, status], i) => (
              <div key={number} className="flex items-center justify-between gap-3 border-t border-line pt-2.5">
                <div className="flex flex-col">
                  <span className={`${v} text-lg`}>Order {number}</span>
                  <span className="text-ink-2">{items}</span>
                </div>
                <span className={`${chip} py-1 ${i === 0 ? "border-pen bg-pen text-surface" : "bg-surface"}`}>{status}</span>
              </div>
            ))}
          </Note>
          <Note id="store" x={300} y={340} w={240} h={64} r={2} className="flex items-center justify-between px-4">
            <span className={v}>Store is open</span>
            <span className="relative h-6 w-11 rounded-full bg-pen">
              <span className="absolute right-[3px] top-[3px] size-[18px] rounded-full bg-surface" />
            </span>
          </Note>
        </>
      ),
    },
    {
      w: 600,
      h: 460,
      node: (
        <>
          <Note id="tracker" x={60} y={50} w={320} h={120} r={-1.5} className="flex flex-col gap-2.5 p-3.5">
            <div className={k}>Order tracker</div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-pen" />
              <span className="h-[1.5px] flex-1 bg-pen" />
              <span className="size-3.5 rounded-full bg-pen outline-[1.5px] outline-offset-[3px] outline-pen" />
              <span className="h-[1.5px] flex-1 bg-line" />
              <span className="size-2.5 rounded-full border-[1.25px] border-ink" />
            </div>
            <div className="flex justify-between text-xs text-ink-2">
              <span>Pending</span>
              <span className="font-medium text-pen">Preparing</span>
              <span>Out for delivery</span>
            </div>
          </Note>
          <Note id="eta" x={250} y={240} w={300} h={160} r={2} className="flex flex-col gap-1 p-3.5">
            <div className={k}>Order 1042</div>
            <div className={`${big} italic text-pen`}>12 min away</div>
            <div className="mt-auto text-ink-2">Updates live, no refresh</div>
          </Note>
        </>
      ),
    },
  ],
  thread: {
    main: [
      "menu.t", "menu.r", "item.l", "item.r", "map.l", "map.b.40", "checkout.l", "checkout.b", "alert.t", "alert.b",
      "orders.t", "orders.b.70", "store.t", "store.b", "end.l", "end.b",
    ],
    forks: [
      { at: "checkout.b", join: "end.l", via: ["checkout.b", "paid.t", "paid.b", "tracker.t", "tracker.b.70", "eta.t", "eta.b", "end.r"] },
    ],
  },
};

/* QuizWarp: the line parts at the top. One side follows the teacher (question, join code,
   report, insight), the other the students (streak, leaderboard, live session, homework). */

const quizWarp: ProjectNotes = {
  top: [
    {
      w: 600,
      h: 400,
      node: (
        <>
          <Note id="question" x={20} y={30} w={280} h={270} r={-3} className="flex flex-col gap-2 p-3.5">
            <div className={k}>Question 4 of 10</div>
            <div className={`${v} leading-tight`}>Which planet has the most moons?</div>
            <div className="mt-auto flex flex-col gap-1.5">
              <span className={`${chip} bg-surface`}>Jupiter</span>
              <span className={`${chip} bg-pen text-surface`}>Saturn</span>
              <span className={`${chip} bg-surface`}>Neptune</span>
            </div>
          </Note>
          <Note id="code" x={340} y={200} w={220} h={120} r={2} className="flex flex-col gap-1 p-3.5">
            <div className={k}>Join code</div>
            <div className={big}>482 913</div>
            <div className="text-ink-2">Live session</div>
          </Note>
        </>
      ),
    },
    {
      w: 600,
      h: 400,
      node: (
        <>
          <Note id="streak" x={30} y={60} w={210} h={130} r={3} className="flex flex-col gap-1 p-3.5">
            <div className={k}>Streak</div>
            <div className={`${big} italic text-pen`}>7 in a row</div>
            <svg width="150" height="22" viewBox="0 0 150 22" fill="none" className="mt-auto">
              <path
                d="M4 14l6-8M26 6l8 6M52 16l4-10M78 5l7 9M104 15l8-7M132 6l5 10"
                className="stroke-ink"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="18" cy="16" r="2.5" className="fill-pen" />
              <circle cx="66" cy="6" r="2.5" className="fill-pen" />
              <circle cx="120" cy="16" r="2.5" className="fill-pen" />
            </svg>
          </Note>
          <Note id="board" x={290} y={60} w={284} h={250} r={-2} className="flex flex-col gap-3 p-3.5">
            <div className={k}>Team leaderboard</div>
            {[
              ["Team Mango", "2,450", "100%", true],
              ["Team Kiwi", "2,120", "84%", false],
              ["Team Plum", "1,870", "70%", false],
            ].map(([team, score, width, lead]) => (
              <div key={team as string} className="flex flex-col gap-1.5">
                <div className="flex items-baseline justify-between">
                  <span className={`${v} ${lead ? "text-pen" : ""}`}>{team}</span>
                  <span>{score}</span>
                </div>
                <div className="h-[3px] bg-line">
                  <div className={`h-[3px] ${lead ? "bg-pen" : "bg-ink"}`} style={{ width: width as string }} />
                </div>
              </div>
            ))}
          </Note>
        </>
      ),
    },
  ],
  sides: [
    aside("answer", 3, "You answered", "Saturn", "Correct, 120 points", true),
    aside("source", -3, "Made from", "notes.pdf", "10 questions in 6 seconds"),
  ],
  bottom: [
    {
      w: 600,
      h: 460,
      node: (
        <>
          <Note id="live" x={250} y={20} w={320} h={210} r={2} className="flex flex-col gap-2 p-3.5">
            <div className={k}>Live session</div>
            <div className={big}>28 players</div>
            <div className="mt-auto flex flex-wrap gap-1.5">
              {["Mango", "Kiwi", "Plum", "Lime"].map((team, i) => (
                <span key={team} className={`${chip} py-1 ${i === 0 ? "border-pen bg-pen text-surface" : "bg-surface"}`}>
                  {team}
                </span>
              ))}
            </div>
          </Note>
          <Note id="homework" x={30} y={290} w={320} h={140} r={-2} className="flex flex-col gap-1 p-3.5">
            <div className={k}>Homework</div>
            <div className={`${v} leading-tight`}>Moons, round two</div>
            <div className="mt-auto text-ink-2">Due Friday, assigned to 28</div>
          </Note>
        </>
      ),
    },
    {
      w: 600,
      h: 460,
      node: (
        <>
          <Note id="report" x={10} y={20} w={330} h={240} r={-2} className="flex flex-col gap-3 p-3.5">
            <div className={k}>Class report, correct answers</div>
            <Meter name="Moons" value="42%" width="42%" lead />
            <Meter name="Orbits" value="78%" width="78%" />
            <Meter name="Seasons" value="91%" width="91%" />
            <div className="mt-auto text-ink-2">28 students, 10 questions</div>
          </Note>
          <Note id="insight" x={240} y={296} w={340} h={150} r={2} className="flex flex-col gap-1.5 p-3.5">
            <div className={`${k} !text-pen`}>AI insight</div>
            <div className={`${v} leading-tight`}>Most of the class mixes up Jupiter and Saturn.</div>
          </Note>
        </>
      ),
    },
  ],
  thread: {
    main: [
      "top.t", "top.l", "question.t", "question.r.70", "code.l", "code.b", "source.t", "source.b",
      "report.t", "report.b.70", "insight.t", "insight.b", "end.r", "end.b",
    ],
    forks: [
      {
        at: "top.l",
        join: "end.r",
        via: [
          "top.r", "board.t", "board.l.60", "streak.r", "streak.b", "answer.t", "answer.b",
          "live.t", "live.b.30", "homework.t", "homework.b", "end.l",
        ],
      },
    ],
  },
};

/* KronoKeep: a receipt goes into the phone and comes out as a verified PDF; then three kinds
   of things kept in the vault feed one service history, handed to the buyer. */

function Asset({
  id,
  x,
  y,
  r,
  name,
  value,
  children,
}: {
  id: string;
  x: number;
  y: number;
  r: number;
  name: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <Note id={id} x={x} y={y} w={175} h={200} r={r} className="flex flex-col gap-1 p-3.5">
      <svg width="96" height="48" viewBox="0 0 96 48" fill="none" className="stroke-ink" strokeWidth="1.5">
        {children}
      </svg>
      <div className={`${k} mt-auto`}>{name}</div>
      <div className="font-display text-[26px] font-semibold leading-tight">{value}</div>
    </Note>
  );
}

const kronoKeep: ProjectNotes = {
  top: [
    {
      w: 600,
      h: 600,
      node: (
        <>
          <Note id="receipt" x={50} y={60} w={180} h={230} r={-4} className="flex flex-col gap-2.5 p-3.5">
            <div className={k}>Receipt</div>
            {["100%", "70%", "85%", "55%"].map((width) => (
              <span key={width} className="h-[1.5px] bg-line" style={{ width }} />
            ))}
            <div className={`${v} mt-auto text-[17px] text-pen`}>Warranty, 2 years</div>
          </Note>
          <Phone id="phone" x={280} y={20}>
            <div className="flex flex-col gap-2 rounded-[2px] border-[1.25px] border-ink p-3.5">
              <svg width="96" height="40" viewBox="0 0 96 40" fill="none" className="stroke-ink" strokeWidth="1.5">
                <path d="M4 28V20l10-2 10-12h34l14 12 16 3v7H80M30 28h36M24 6v12h48" />
                <circle cx="22" cy="29" r="7" />
                <circle cx="73" cy="29" r="7" />
              </svg>
              <div className={k}>Vehicle, odometer</div>
              <div className={big}>48,210 km</div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-[2px] border-[1.25px] border-pen p-3.5">
              <div className={`${k} !text-pen`}>Maintenance due</div>
              <div className={`${big} italic text-pen`}>in 12 days</div>
              <div className="h-[3px] bg-line">
                <div className="h-[3px] w-4/5 bg-pen" />
              </div>
              <div className="text-ink-2">Oil change, predicted from use</div>
            </div>
          </Phone>
        </>
      ),
    },
    {
      w: 600,
      h: 600,
      node: (
        <>
          <Note id="usage" x={150} y={30} w={300} h={230} r={-2} className="flex flex-col gap-2 p-3.5">
            <div className={k}>Usage, last 8 weeks</div>
            <svg width="272" height="110" viewBox="0 0 272 110" fill="none">
              <path d="M0 109.5h272" className="stroke-line" />
              {[52, 70, 44, 82, 64, 90, 58, 100].map((height, i) => (
                <rect key={i} x={i * 34 + 4} y={108 - height} width="22" height={height} className={i === 7 ? "fill-pen" : "fill-ink"} />
              ))}
            </svg>
            <div className="mt-auto text-ink-2">About 310 km a week</div>
          </Note>
          <Asset id="car" x={10} y={350} r={-3} name="Vehicle" value="48,210 km">
            <path d="M4 34V26l10-2 10-12h34l14 12 16 3v7H80M30 34h36M24 12v12h48" />
            <circle cx="22" cy="35" r="7" />
            <circle cx="73" cy="35" r="7" />
          </Asset>
          <Asset id="aircon" x={212} y={380} r={2} name="Aircon" value="1,240 hours">
            <path d="M6 8h84v24H6zM14 24h68M24 38v6M40 38v8M56 38v8M72 38v6" />
          </Asset>
          <Asset id="laptop" x={414} y={350} r={4} name="Laptop" value="2 years">
            <path d="M20 6h56v30H20zM6 42h84" />
          </Asset>
        </>
      ),
    },
  ],
  sides: [
    aside("predict", 3, "Predicted", "Oil change", "At about 50,000 km", true),
    aside("warranty", -3, "Warranty", "Ends Mar 2027", "Laptop, 2 years"),
  ],
  bottom: [
    {
      w: 600,
      h: 400,
      node: (
        <>
          <Note id="history" x={120} y={50} w={360} h={300} r={1.5} className="flex flex-col gap-2.5 p-3.5">
            <div className={k}>Service history</div>
            {[
              ["12 Mar", "Oil change"],
              ["02 Jun", "Brake pads"],
              ["19 Aug", "Tire rotation"],
            ].map(([date, job]) => (
              <div key={date} className="flex items-baseline gap-3 border-t border-line pt-2.5">
                <span className="w-14 text-ink-2">{date}</span>
                <span className={`${v} text-lg`}>{job}</span>
                <span className="ml-auto text-ink-2">Logged</span>
              </div>
            ))}
            <div className="mt-auto flex items-baseline gap-3 border-t border-pen pt-2.5 text-pen">
              <span className="w-14">Next</span>
              <span className={`${v} text-lg`}>Oil change</span>
              <span className="ml-auto">12 days</span>
            </div>
          </Note>
        </>
      ),
    },
    {
      w: 600,
      h: 400,
      node: (
        <>
          <Note id="pdf" x={330} y={40} w={150} h={200} r={3} className="flex flex-col items-start gap-2.5 p-3.5">
            <div className={`${k} !text-pen`}>Verified PDF</div>
            <svg width="72" height="72" viewBox="0 0 9 9" className="fill-ink">
              <path d="M0 0h3v3H0zM6 0h3v3H6zM0 6h3v3H0zM4 0h1v2H4zM4 3h2v1H4zM3 4h1v2H3zM5 5h1v1H5zM7 4h2v1H7zM6 6h1v1H6zM8 6h1v3H8zM4 7h3v1H4zM6 8h1v1H6z" />
            </svg>
            <span className="text-ink-2">Service history</span>
          </Note>
          <Note id="handover" x={60} y={180} w={220} h={160} r={-3} className="flex flex-col gap-1.5 p-3.5">
            <div className={k}>When you sell</div>
            <div className={`${v} leading-tight`}>The buyer scans the code</div>
            <div className="mt-auto text-ink-2">History checks out</div>
          </Note>
        </>
      ),
    },
  ],
  thread: {
    main: [
      "receipt.t", "receipt.b", "phone.l.72", "phone.r.40", "usage.l", "usage.b", "aircon.t", "aircon.b",
      "predict.t", "predict.b", "history.t", "history.r", "pdf.l", "pdf.b", "handover.r", "handover.b",
    ],
    forks: [
      { at: "usage.b", join: "predict.t", via: ["usage.b", "car.t", "car.b", "predict.t"] },
      { at: "usage.b", join: "predict.t", via: ["usage.b", "laptop.t", "laptop.b", "predict.t"] },
      { at: "pdf.l", via: ["pdf.t", "warranty.b"] },
    ],
  },
};

/* CraveWise: a quick question and the phone; then four things from the pantry come together
   as one recipe, the filter drops what you never eat, and cook mode runs to its timer. */

function Ingredient({ id, x, y, r, name, amount }: { id: string; x: number; y: number; r: number; name: string; amount: string }) {
  return (
    <Note id={id} x={x} y={y} w={128} h={104} r={r} className="flex flex-col p-3">
      <div className={v}>{name}</div>
      <div className="mt-auto text-ink-2">{amount}</div>
    </Note>
  );
}

const craveWise: ProjectNotes = {
  top: [
    {
      w: 600,
      h: 600,
      node: (
        <>
          <Note id="decide" x={70} y={70} w={210} h={180} r={-3} className="flex flex-col gap-2 p-3.5">
            <div className={k}>Help me decide</div>
            <div className={`${v} leading-tight`}>Something quick tonight?</div>
            <div className="mt-auto flex gap-2">
              <span className={`${chip} bg-pen text-surface`}>Yes</span>
              <span className={`${chip} bg-surface`}>No</span>
            </div>
          </Note>
          <Phone id="phone" x={260} y={20}>
            <div className={k}>Pantry</div>
            <div className="flex flex-wrap gap-1.5">
              {["Eggs", "Rice", "Garlic", "Tomato"].map((item) => (
                <span key={item} className="rounded-full border-[1.25px] border-ink px-2.5 py-1">
                  {item}
                </span>
              ))}
            </div>
            <div className={`${k} mt-2 !text-pen`}>Cook now</div>
            <div className="flex flex-col gap-1 rounded-[2px] border-[1.25px] border-pen p-3">
              <div className={`${v} text-pen`}>Garlic fried rice</div>
              <div className="text-ink-2">15 min, 4 of 4 ingredients</div>
            </div>
            <div className={`${k} mt-2`}>Almost there</div>
            <div className="flex flex-col gap-1 rounded-[2px] border-[1.25px] border-ink p-3">
              <div className={v}>Tomato omelette</div>
              <div className="text-ink-2">Missing 1: onion</div>
            </div>
          </Phone>
        </>
      ),
    },
    {
      w: 600,
      h: 560,
      node: (
        <>
          <Ingredient id="eggs" x={8} y={130} r={-3} name="Eggs" amount="6 left" />
          <Ingredient id="rice" x={158} y={154} r={2} name="Rice" amount="2 cups" />
          <Ingredient id="garlic" x={308} y={130} r={-2} name="Garlic" amount="1 head" />
          <Ingredient id="tomato" x={458} y={154} r={3} name="Tomato" amount="3 left" />
          <Note id="recipe" x={130} y={380} w={340} h={160} r={-1.5} className="flex flex-col gap-1 p-3.5">
            <div className={`${k} !text-pen`}>Cook now</div>
            <div className={`${big} italic text-pen`}>Garlic fried rice</div>
            <div className="mt-auto text-ink-2">15 min, 4 of 4 ingredients</div>
          </Note>
        </>
      ),
    },
  ],
  sides: [
    aside("match", 3, "Pantry match", "4 of 4", "Nothing to buy", true),
    aside("tonight", -3, "Tonight", "Dinner at 7", "Ready in 15 minutes"),
  ],
  bottom: [
    {
      w: 600,
      h: 360,
      node: (
        <>
          <Note id="filter" x={40} y={30} w={300} h={150} r={2} className="flex flex-col gap-2 p-3.5">
            <div className={k}>Never shown</div>
            <div className="mt-auto flex flex-wrap gap-1.5 text-ink-2">
              {["Peanuts", "Shrimp", "Cilantro"].map((item) => (
                <span key={item} className={`${chip} border-line py-1 line-through`}>
                  {item}
                </span>
              ))}
            </div>
            <div className="text-ink-2">Allergies and dislikes</div>
          </Note>
          <Note id="servings" x={310} y={200} w={240} h={130} r={-2} className="flex flex-col gap-1 p-3.5">
            <div className={k}>Servings</div>
            <div className={big}>2 people</div>
            <div className="mt-auto text-ink-2">Amounts scale with it</div>
          </Note>
        </>
      ),
    },
    {
      w: 600,
      h: 360,
      node: (
        <>
          <Note id="timer" x={414} y={160} w={186} h={170} r={3} className="flex flex-col gap-1 p-3.5">
            <div className={k}>Cook mode, 3 of 6</div>
            <div className="font-display text-[40px] font-semibold italic leading-tight text-pen">04:32</div>
            <div className="mt-auto text-ink-2">Simmer, covered</div>
          </Note>
          <Note id="steps" x={0} y={40} w={380} h={210} r={-2} className="flex flex-col gap-2 p-3.5">
            <div className={k}>Cook mode</div>
            {[
              ["1", "Rinse the rice", "Done"],
              ["2", "Fry the garlic", "Done"],
              ["3", "Simmer, covered", "04:32"],
              ["4", "Fluff and serve", ""],
            ].map(([step, text, state], i) => (
              <div key={step} className={`flex items-baseline gap-3 ${i === 2 ? "text-pen" : i < 2 ? "text-ink-2" : ""}`}>
                <span>{step}</span>
                <span className={`${v} text-lg`}>{text}</span>
                <span className="ml-auto">{state}</span>
              </div>
            ))}
          </Note>
        </>
      ),
    },
  ],
  thread: {
    main: [
      "decide.t", "decide.b", "phone.l.72", "phone.t", "rice.t", "rice.b", "recipe.t", "recipe.b",
      "match.t", "match.b", "filter.t", "filter.b.70", "servings.t", "servings.r",
      "steps.l", "steps.r.75", "timer.l", "timer.t", "tonight.b",
    ],
    forks: [
      { at: "phone.t", join: "recipe.t", via: ["phone.t", "eggs.t", "eggs.b", "recipe.t"] },
      { at: "phone.t", join: "recipe.t", via: ["phone.t", "garlic.t", "garlic.b", "recipe.t"] },
      { at: "phone.t", join: "recipe.t", via: ["phone.t", "tomato.t", "tomato.b", "recipe.t"] },
    ],
  },
};

/** Keyed by project title in src/content/site.ts. A project without an entry shows no notes. */
export const projectNotes: Record<string, ProjectNotes> = {
  "Scroll Maestro": scrollMaestro,
  "Kae & Jae Cafe": kaeAndJae,
  QuizWarp: quizWarp,
  KronoKeep: kronoKeep,
  CraveWise: craveWise,
};
