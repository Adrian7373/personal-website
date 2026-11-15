import type { Metadata } from "next";
import { DM_Mono, Fraunces, Instrument_Sans } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

/** Decides before first paint whether the build animation plays (see Build.tsx). */
const buildGate = `(function(){try{var d=document.documentElement;if(matchMedia("(prefers-reduced-motion: reduce)").matches||location.hash||sessionStorage.getItem("built"))return;d.dataset.build="pending";setTimeout(function(){if(d.dataset.build==="pending")delete d.dataset.build},4000)}catch(e){}})()`;

/** Sets the theme before first paint: the saved choice, or the system setting (see ThemeToggle.tsx). */
const themeGate = `(function(){var t;try{t=localStorage.getItem("theme")}catch(e){}if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t})()`;

export const metadata: Metadata = {
  title: site.meta.title,
  description: site.meta.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${instrumentSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeGate }} />
        <script dangerouslySetInnerHTML={{ __html: buildGate }} />
      </head>
      <body className="flex min-h-full flex-col font-sans text-[17px] leading-[1.65] lg:text-lg">
        {children}
      </body>
    </html>
  );
}
