"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { EASE_OUT, LaunchButton, Wordmark } from "./primitives";

export default function Nav() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setSolid(y > 24);
    // Tuck away when reading down the page, return on any upward scroll.
    setHidden(y > 640 && y > prev + 2 ? true : y < prev - 2 ? false : hidden);
  });

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: hidden ? "-110%" : 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE_OUT, delay: hidden ? 0 : 0.05 }}
    >
      <div
        className={`transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid
            ? "border-b border-white/[0.06] bg-[#050606]/80 md:bg-[#050606]/60 md:backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[92px] lg:px-14">
          <Link href="/" aria-label="AIKOLs home" className="rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-k-lime">
            <Wordmark size={36} intro delay={0.1} />
          </Link>

          <motion.div
            className="flex items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <a href="#agents" className="k-link hidden text-[15px] font-medium text-white/70 hover:text-white md:inline">
              Agents
            </a>
            <a href="#how" className="k-link hidden text-[15px] font-medium text-white/70 hover:text-white md:inline">
              How it works
            </a>
            <LaunchButton size="sm" />
          </motion.div>
        </nav>
      </div>
    </motion.header>
  );
}
