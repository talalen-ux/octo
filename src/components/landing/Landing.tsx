"use client";

import Nav from "./Nav";
import Hero from "./Hero";
import Ticker from "./Ticker";
import Crew from "./Crew";
import Story from "./Story";
import { Finale, Footer } from "./Finale";

export default function Landing({ fontClass }: { fontClass: string }) {
  return (
    <main className={`aikol ${fontClass}`}>
      <Nav />
      <Hero />
      <Ticker />
      <Crew />
      <Story />
      <Finale />
      <Footer />
    </main>
  );
}
