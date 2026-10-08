"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT, LaunchButton, MaskLines, Wordmark } from "./primitives";
import emblems from "@/assets/aikols/token-emblems.png";
import platform from "@/assets/aikols/platform.png";

export function Finale() {
  const reduce = useReducedMotion();
  return (
    <section className="relative isolate overflow-hidden px-5 pb-28 pt-32 text-center sm:px-8 lg:pb-40 lg:pt-48">
      {/* Horizon glow + floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[80%]"
        style={{ background: "radial-gradient(60% 70% at 50% 100%, rgba(200,255,79,0.16), rgba(200,255,79,0.04) 45%, transparent 75%)" }}
      />
      <div aria-hidden className="k-grain pointer-events-none absolute inset-0 -z-10 opacity-20" />

      {/* Pedestal: emblems hover over the plinth, both at native resolution */}
      <div aria-hidden className="relative mx-auto w-[min(84vw,398px)]">
        <motion.div
          className="relative z-10 mx-auto w-[66%]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, scale: 0.85, rotate: -10 }}
          whileInView={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ type: "spring", stiffness: 60, damping: 14 }}
        >
          <motion.div
            animate={reduce ? undefined : { y: [0, -16, 0], rotate: [-3, 2, -3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src={emblems} alt="" sizes="270px" className="h-auto w-full drop-shadow-[0_30px_60px_rgba(200,255,79,0.25)]" draggable={false} />
          </motion.div>
        </motion.div>
        <motion.div
          className="relative -mt-[10%]"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.15 }}
        >
          <motion.span
            className="absolute left-1/2 top-[14%] h-[34%] w-[56%] -translate-x-1/2 rounded-[50%] bg-k-lime blur-2xl"
            animate={reduce ? { opacity: 0.18 } : { opacity: [0.24, 0.12, 0.24] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <Image src={platform} alt="" sizes="398px" className="relative h-auto w-full" draggable={false} />
        </motion.div>
      </div>

      <MaskLines
        inView
        className="mx-auto mt-14 font-grotesk text-[clamp(52px,10vw,168px)] font-extrabold leading-[0.88] tracking-[-0.06em] text-white"
        lines={["Put an agent", <span key="w" className="text-k-lime">to work.</span>]}
      />

      <motion.p
        className="mx-auto mt-8 max-w-[38ch] text-[17px] leading-[1.5] text-k-mute lg:text-[19px]"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 }}
      >
        Spin one up in the console and watch it go. It runs as a live
        simulation: no wallet, no sign-up.
      </motion.p>

      <motion.div
        className="mt-11 flex justify-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.45 }}
      >
        <LaunchButton label="Open the console" />
      </motion.div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-5 py-14 sm:px-8 lg:flex-row lg:items-start lg:justify-between lg:px-14">
        <div>
          <Wordmark size={32} />
          <p className="mt-5 max-w-[30ch] text-[15px] leading-[1.5] text-k-mute">
            Trading agents, for everyone.
          </p>
        </div>
        <nav aria-label="Footer" className="flex gap-16 text-[15px]">
          <ul className="space-y-3">
            <li className="font-mono text-[11px] uppercase tracking-[0.2em] text-k-dim">Product</li>
            <li><Link href="/app" className="k-link text-white/75 hover:text-white">Console</Link></li>
            <li><a href="#agents" className="k-link text-white/75 hover:text-white">Agents</a></li>
            <li><a href="#how" className="k-link text-white/75 hover:text-white">How it works</a></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto flex max-w-[1440px] flex-col gap-2 border-t border-white/[0.06] px-5 py-6 font-mono text-[11px] uppercase tracking-[0.16em] text-k-dim sm:flex-row sm:justify-between sm:px-8 lg:px-14">
        <span suppressHydrationWarning>© {new Date().getFullYear()} AIKOLs</span>
        <span>Simulated environment · not financial advice</span>
      </div>
    </footer>
  );
}
