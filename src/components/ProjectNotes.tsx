import type { CSSProperties, ReactNode } from "react";

/**
 * The paper notes drawn around each project title.
 * Every stage is drawn at a fixed size in px and scaled down to the width it is given,
 * so one drawing serves desktop and phone. They are decoration: hidden from screen readers.
 */

export type StageDef = { w: number; h: number; node: ReactNode };

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
      data-thread-stop
      data-build="place"
      className={`relative z-[1] [container-type:inline-size] ${className}`}
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
  x,
  y,
  w,
  h,
  r = 0,
  fill = "bg-surface",
  className = "",
  children,
}: {
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
    <div className={`${paper} ${fill} ${className}`} style={style}>
      {children}
    </div>
  );
}

/** Android screens sit in an ink phone outline and are never rotated. */
function Phone({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <div
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
const chip = "rounded-[2px] border-[1.25px] border-ink px-3 py-1.5";

function Clip({ x, y, r, text, tone }: { x: number; y: number; r: number; text: string; tone: string }) {
  return (
    <Note x={x} y={y} w={110} h={196} r={r} fill="bg-sage">
      <span className={`absolute inset-x-2 top-24 py-[3px] text-center ${tone}`}>{text}</span>
    </Note>
  );
}

const scrollMaestro: StageDef = {
  w: 640,
  h: 600,
  node: (
    <>
      <Note x={10} y={10} w={620} h={84} r={-2} className="flex flex-col gap-1.5 px-2.5 py-2">
        <div className={k}>Long video, cut into clips</div>
        <div className="flex grow gap-[3px]">
          {[3, 2, 4, 2, 5, 2, 3].map((flex, i) => (
            <span key={i} className={i % 2 ? "bg-pen" : "bg-sage"} style={{ flex }} />
          ))}
        </div>
      </Note>
      <Clip x={270} y={136} r={-3} text="make it work" tone="bg-ink text-surface" />
      <Clip x={400} y={162} r={2} text="then" tone="bg-pen text-surface" />
      <Clip x={530} y={140} r={4} text="make it right" tone="border border-ink bg-surface" />
      <div className="absolute flex gap-2 font-mono text-[13px]" style={{ left: 20, top: 396, rotate: "-2deg" }}>
        <span className={`${chip} bg-pen text-surface`}>Karaoke</span>
        <span className={`${chip} bg-surface`}>Neon</span>
        <span className={`${chip} bg-surface`}>Marker</span>
      </div>
      <Note x={400} y={400} w={230} h={190} r={2} className="flex flex-col gap-2 p-3">
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
        className="absolute flex flex-col items-start gap-2 font-mono text-[13px]"
        style={{ left: 70, top: 474, rotate: "-1deg" }}
      >
        <span className={`${chip} bg-surface`}>TikTok, connected</span>
        <span className={`${chip} bg-surface`}>YouTube Shorts, connected</span>
      </div>
    </>
  ),
};

const kaeAndJae: StageDef = {
  w: 640,
  h: 600,
  node: (
    <>
      <Note x={0} y={110} w={400} h={320} r={-2} className="overflow-hidden">
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
        <span className="absolute bottom-2.5 right-3">2.4 km · ₱49 delivery</span>
      </Note>
      <Note x={410} y={20} w={220} h={260} r={3} className="flex flex-col gap-2 p-3">
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
      <Note x={330} y={450} w={300} h={120} r={-1.5} className="flex flex-col gap-2.5 p-3.5">
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
      <Note x={40} y={480} w={220} h={64} r={2} className="flex items-center justify-between px-4">
        <span className={v}>Store is open</span>
        <span className="relative h-6 w-11 rounded-full bg-pen">
          <span className="absolute right-[3px] top-[3px] size-[18px] rounded-full bg-surface" />
        </span>
      </Note>
    </>
  ),
};

const quizWarp: StageDef[] = [
  {
    w: 300,
    h: 520,
    node: (
      <>
        <Note x={8} y={30} w={280} h={270} r={-3} className="flex flex-col gap-2 p-3.5">
          <div className={k}>Question 4 of 10</div>
          <div className={`${v} leading-tight`}>Which planet has the most moons?</div>
          <div className="mt-auto flex flex-col gap-1.5">
            <span className={`${chip} bg-surface`}>Jupiter</span>
            <span className={`${chip} bg-pen text-surface`}>Saturn</span>
            <span className={`${chip} bg-surface`}>Neptune</span>
          </div>
        </Note>
        <Note x={40} y={350} w={220} h={120} r={2} className="flex flex-col gap-1 p-3.5">
          <div className={k}>Join code</div>
          <div className="font-display text-[34px] font-semibold leading-tight">482 913</div>
          <div className="text-ink-2">Live session</div>
        </Note>
      </>
    ),
  },
  {
    w: 300,
    h: 520,
    node: (
      <>
        <Note x={60} y={30} w={210} h={130} r={3} className="flex flex-col gap-1 p-3.5">
          <div className={k}>Streak</div>
          <div className="font-display text-[34px] font-semibold italic leading-tight text-pen">7 in a row</div>
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
        <Note x={8} y={220} w={284} h={250} r={-2} className="flex flex-col gap-3 p-3.5">
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
];

const kronoKeep: StageDef = {
  w: 640,
  h: 600,
  node: (
    <>
      <Note x={10} y={50} w={180} h={230} r={-4} className="flex flex-col gap-2.5 p-3.5">
        <div className={k}>Receipt</div>
        {["100%", "70%", "85%", "55%"].map((width) => (
          <span key={width} className="h-[1.5px] bg-line" style={{ width }} />
        ))}
        <div className={`${v} mt-auto text-[17px] text-pen`}>Warranty, 2 years</div>
      </Note>
      <Phone x={200} y={20}>
        <div className="flex flex-col gap-2 rounded-[2px] border-[1.25px] border-ink p-3.5">
          <svg width="96" height="40" viewBox="0 0 96 40" fill="none" className="stroke-ink" strokeWidth="1.5">
            <path d="M4 28V20l10-2 10-12h34l14 12 16 3v7H80M30 28h36M24 6v12h48" />
            <circle cx="22" cy="29" r="7" />
            <circle cx="73" cy="29" r="7" />
          </svg>
          <div className={k}>Vehicle, odometer</div>
          <div className="font-display text-[34px] font-semibold leading-tight">48,210 km</div>
        </div>
        <div className="flex flex-col gap-1.5 rounded-[2px] border-[1.25px] border-pen p-3.5">
          <div className={`${k} !text-pen`}>Maintenance due</div>
          <div className="font-display text-[34px] font-semibold italic leading-tight text-pen">in 12 days</div>
          <div className="h-[3px] bg-line">
            <div className="h-[3px] w-4/5 bg-pen" />
          </div>
          <div className="text-ink-2">Oil change, predicted from use</div>
        </div>
      </Phone>
      <Note x={488} y={310} w={150} h={200} r={3} className="flex flex-col items-start gap-2.5 p-3.5">
        <div className={`${k} !text-pen`}>Verified PDF</div>
        <svg width="72" height="72" viewBox="0 0 9 9" className="fill-ink">
          <path d="M0 0h3v3H0zM6 0h3v3H6zM0 6h3v3H0zM4 0h1v2H4zM4 3h2v1H4zM3 4h1v2H3zM5 5h1v1H5zM7 4h2v1H7zM6 6h1v1H6zM8 6h1v3H8zM4 7h3v1H4zM6 8h1v1H6z" />
        </svg>
        <span className="text-ink-2">Service history</span>
      </Note>
    </>
  ),
};

const craveWise: StageDef = {
  w: 640,
  h: 600,
  node: (
    <>
      <Note x={0} y={70} w={210} h={180} r={-3} className="flex flex-col gap-2 p-3.5">
        <div className={k}>Help me decide</div>
        <div className={`${v} leading-tight`}>Something quick tonight?</div>
        <div className="mt-auto flex gap-2">
          <span className={`${chip} bg-pen text-surface`}>Yes</span>
          <span className={`${chip} bg-surface`}>No</span>
        </div>
      </Note>
      <Phone x={190} y={20}>
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
      <Note x={452} y={330} w={186} h={170} r={3} className="flex flex-col gap-1 p-3.5">
        <div className={k}>Cook mode, 3 of 6</div>
        <div className="font-display text-[40px] font-semibold italic leading-tight text-pen">04:32</div>
        <div className="mt-auto text-ink-2">Simmer, covered</div>
      </Note>
    </>
  ),
};

/** Keyed by project title in src/content/site.ts. A project without an entry shows no notes. */
export const projectNotes: Record<string, StageDef[]> = {
  "Scroll Maestro": [scrollMaestro],
  "Kae & Jae Cafe": [kaeAndJae],
  QuizWarp: quizWarp,
  KronoKeep: [kronoKeep],
  CraveWise: [craveWise],
};
