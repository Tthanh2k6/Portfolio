import { createFileRoute, Link } from "@tanstack/react-router";
import { pageSeo } from "@/lib/site";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroScene } from "@/components/HeroScene";
import { NavBar } from "@/components/NavBar";
import { useLang } from "@/lib/i18n";


const SEO = pageSeo("/");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Trung Thanh Tran (Trần Trung Thành) — Full-stack Developer — Supabase/Postgres security, React Native apps, Python automation",
      },
      {
        name: "description",
        content:
          "Portfolio of Trung Thanh Tran (Trần Trung Thành) — Full-stack Developer: Supabase/Postgres security, React Native apps (App Store & Google Play), Cloudflare Workers + D1, and Python automation.",
      },
      {
        property: "og:title",
        content:
          "Trung Thanh Tran — Full-stack Developer — Supabase/Postgres security, React Native apps, Python automation",
      },
      {
        property: "og:description",
        content:
          "Supabase/Postgres RLS security (supabase-rls-check) • React Native loyalty app on the App Store & Google Play • Cloudflare Workers + D1 • Python automation & 5 public Apify Actors.",
      },
      SEO.ogUrl,
    ],
    links: [
      SEO.canonical,
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

const DEFAULT_HERO_TAGS = [
  "SUPABASE / POSTGRES SECURITY",
  "REACT NATIVE (IOS & ANDROID)",
  "PYTHON AUTOMATION",
  "CLOUDFLARE WORKERS & D1",
  "AI AGENTS & MCP",
];

function Index() {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
  const [customLine1, setCustomLine1] = useState<string | null>(null);
  const [customLine2, setCustomLine2] = useState<string | null>(null);
  const [tagsList, setTagsList] = useState(DEFAULT_HERO_TAGS);

  useEffect(() => {
    setMounted(true);
    const stored1 = localStorage.getItem("home_line_1");
    const stored2 = localStorage.getItem("home_line_2");
    const stored3 = localStorage.getItem("home_line_3");
    if (stored1) setCustomLine1(stored1);
    if (stored2) setCustomLine2(stored2);
    if (stored3) setTagsList(stored3.split(",").map(t => t.trim()).filter(Boolean));
  }, []);

  const line1 =
    customLine1 ||
    (lang === "en"
      ? "Full-stack Developer — Supabase/Postgres security, React Native apps, Python automation."
      : "Lập trình viên full-stack — bảo mật Supabase/Postgres, app React Native, tự động hoá Python.");
  const line2 = customLine2 || (lang === "en" ? "Trung Thanh Tran" : "Trần Trung Thành");

  return (
    <main className="relative w-full overflow-x-hidden bg-black text-white">
      {/* Hero — toàn màn hình */}
      <div className="relative min-h-screen w-full overflow-hidden">

      {/* Nền 3D R3F */}
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
