"use client";

import Navbar from "./components/Navbar";
import OctahedronLogo from "./components/OctahedronLogo";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col bg-white dark:bg-neutral-950">
      <Navbar />
      <div className="flex flex-1 items-center justify-center">
        <OctahedronLogo />
      </div>
    </main>
  );
}
