"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { EASE_OUT, Eyebrow, MaskLines } from "./primitives";
import analyst from "@/assets/aikols/agent-analyst.png";
import active from "@/assets/aikols/agent-active.png";
import floating from "@/assets/aikols/agent-floating.png";

type Agent = {
  name: string;
  role: string;
  body: string;
  accent: string;
  img: StaticImageData;
  h: string;
};

const CREW: Agent[] = [
  {
    name: "Analyst",
    role: "Reads the tape",
    body: "Turns raw price action into setups worth acting on, and explains why.",
    accent: "#20E5EA",
    img: analyst,
    h: "h-[250px] lg:h-[290px]",
  },
  {
    name: "Operator",
    role: "Runs the plan",
    body: "Sizes, enters and exits with discipline. No hesitation, no second-guessing.",
    accent: "#FFD638",
    img: active,
    h: "h-[200px] lg:h-[230px]",
  },
  {
    name: "Scout",
    role: "Covers ground",
    body: "Ranges across markets around the clock and reports back what is moving.",
    accent: "#FF35D2",
    img: floating,
    h: "h-[240px] lg:h-[280px]",
  },
];

function AgentCard({ a, i }: { a: Agent; i: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 18 });
  const sy = useSpring(my, { stiffness: 150, damping: 18 });
  const rotateY = useTransform(sx, (v) => v * 7);
  const rotateX = useTransform(sy, (v) => v * -7);
  const imgX = useTransform(sx, (v) => v * 14);
  const imgY = useTransform(sy, (v) => v * 10);

  return (
    <motion.article
      ref={ref}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 70 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay: i * 0.12 }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
        my.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      className="group relative flex min-h-[500px] flex-col overflow-hidden rounded-[30px] border border-white/[0.07] bg-k-panel p-7 transition-colors duration-500 hover:border-white/[0.14] lg:min-h-[560px] lg:p-9"
    >
      {/* accent bloom */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[40%] h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-[70px] transition-opacity duration-700 group-hover:opacity-[0.34]"
        style={{ background: a.accent }}
      />

      <header className="relative flex items-center justify-between">
        <span className="font-mono text-[12px] tracking-[0.2em] text-k-dim">0{i + 1}</span>
        <span className="flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-white/70">
          <span className="h-1.5 w-4 rounded-full" style={{ background: a.accent, boxShadow: `0 0 10px ${a.accent}` }} />
          {a.role}
        </span>
      </header>

      <div className="relative grid flex-1 place-items-center py-8">
        <motion.div style={{ x: imgX, y: imgY }}>
          <Image
            src={a.img}
            alt={`The ${a.name} agent`}
            sizes="300px"
            className={`${a.h} w-auto select-none transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-3 group-hover:-rotate-2 group-hover:scale-[1.04]`}
            draggable={false}
          />
        </motion.div>
        {/* contact shadow */}
        <span
          aria-hidden
          className="absolute bottom-6 h-5 w-[46%] rounded-[50%] bg-black/70 blur-md transition-all duration-700 group-hover:w-[38%] group-hover:opacity-60"
        />
      </div>

      <div className="relative">
        <h3 className="font-grotesk text-[36px] font-extrabold leading-none tracking-[-0.045em] text-white lg:text-[42px]">
          {a.name}
        </h3>
        <p className="mt-3 max-w-[30ch] text-[16px] leading-[1.5] text-k-mute">{a.body}</p>
      </div>

      <span
        aria-hidden
        className="absolute bottom-0 left-7 h-[3px] w-12 rounded-full transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-[calc(100%-56px)] lg:left-9 lg:group-hover:w-[calc(100%-72px)]"
        style={{ background: a.accent, boxShadow: `0 0 16px ${a.accent}` }}
      />
    </motion.article>
  );
}

export default function Crew() {
  return (
    <section id="agents" className="relative mx-auto max-w-[1440px] scroll-mt-24 px-5 py-28 sm:px-8 lg:px-14 lg:py-44">
      <Eyebrow>The crew</Eyebrow>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <MaskLines
          inView
          className="font-grotesk text-[clamp(48px,7vw,112px)] font-extrabold leading-[0.9] tracking-[-0.055em] text-white"
          lines={["Meet the", <span key="a" className="text-k-lime">agents.</span>]}
        />
        <motion.p
          className="max-w-[34ch] text-[17px] leading-[1.5] text-k-mute lg:pb-3 lg:text-[19px]"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 1, ease: EASE_OUT, delay: 0.25 }}
        >
          Each one has a job. Together they run the desk while you get on with
          your day.
        </motion.p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3 lg:mt-20 lg:gap-5">
        {CREW.map((a, i) => (
          <AgentCard key={a.name} a={a} i={i} />
        ))}
      </div>
    </section>
  );
}
