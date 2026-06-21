import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroScene } from "@/components/HeroScene";
import { NavBar } from "@/components/NavBar";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Trần Trung Thành — AI / WEB3 / UI / 3D / MOTION / VIDEO" },
      {
        name: "description",
        content: "Portfolio of Trần Trung Thành — designer & developer working across AI, Web3, UI, 3D, motion and video.",
      },
      { property: "og:title", content: "Trần Trung Thành — Portfolio" },
      { property: "og:description", content: "Just chill. The future is rendering." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@700;800&display=swap",
      },
    ],
  }),
  component: Index,
});

const navItems = [
  { label: "Home", to: "/" },
  { label: "Skills", to: "/skills" },
  { label: "Information", to: "/information" },
  { label: "Project", to: "/project" },
  { label: "Contact", to: "/contact" },
];

const tags = ["AI", "WEB3", "UI", "3D", "MOTION", "VIDEO"];

function Index() {
  const [mounted, setMounted] = useState(false);
  const [line1, setLine1] = useState("Just chill. The future is rendering...");
  const [line2, setLine2] = useState("Trần Trung Thành");
  const [tagsList, setTagsList] = useState(["AI", "WEB3", "UI", "3D", "MOTION", "VIDEO"]);

  useEffect(() => {
    setMounted(true);
    const stored1 = localStorage.getItem("home_line_1");
    const stored2 = localStorage.getItem("home_line_2");
    const stored3 = localStorage.getItem("home_line_3");
    if (stored1) setLine1(stored1);
    if (stored2) setLine2(stored2);
    if (stored3) setTagsList(stored3.split(",").map(t => t.trim()).filter(Boolean));
  }, []);

  return (
    <main className="relative w-full overflow-x-hidden bg-black text-white">
      {/* Hero — full viewport */}
      <div className="relative min-h-screen w-full overflow-hidden">

      {/* R3F 3D background */}
      <div className="absolute inset-0 z-0 h-screen w-full">
        <HeroScene />
        {/* Gradient bottom fade cho text */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
        {/* Vignette sương mù mép — tạo cảm giác grid kéo dài vô tận */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 62% 68% at 50% 46%, transparent 30%, rgba(0,0,0,0.50) 52%, rgba(0,0,0,0.78) 68%, rgba(0,0,0,0.92) 82%, rgba(0,0,0,0.97) 96%)",
          }}
        />
      </div>

      {/* Content — chỉ render trên client để framer-motion chạy đúng */}
      {mounted && (
        <>
          <NavBar />


          <section className="pointer-events-none relative z-10 flex min-h-screen flex-col justify-end px-8 pb-12">
            <div className="max-w-5xl">
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 font-mono text-lg text-zinc-400"
              >
                {line1}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="font-extrabold leading-tight tracking-wide text-white"
                style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: "clamp(1rem, 6.5vw, 7rem)",
                  whiteSpace: "nowrap",
                  textShadow: "0 0 40px rgba(255,255,255,0.35), 0 0 90px rgba(255,255,255,0.15)",
                }}
              >
                {line2}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-wrap items-center gap-3 text-sm tracking-widest text-zinc-500"
              >
                {tagsList.map((t, i) => (
                  <span key={t} className="flex items-center gap-3">
                    <span>{t}</span>
                    {i < tagsList.length - 1 && <span className="text-zinc-700">\\</span>}
                  </span>
                ))}
              </motion.div>
            </div>
          </section>
        </>
      )}
      </div>
    </main>
  );
}
