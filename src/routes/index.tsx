import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HeroScene } from "@/components/HeroScene";
import { NavBar } from "@/components/NavBar";
import { useLang } from "@/lib/i18n";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title:
          "Trung Thanh Tran (Trần Trung Thành) — AI Automation, Web Scraping & Full-Stack Engineer",
      },
      {
        name: "description",
        content:
          "Portfolio of Trung Thanh Tran (Trần Trung Thành) — Python & Playwright Web Scraping, n8n / OpenAI Workflow Automation, FastAPI, Full-Stack Web & Mobile Developer.",
      },
      {
        property: "og:title",
        content:
          "Trung Thanh Tran — AI Automation, Anti-Bot Web Scraping & Full-Stack Engineer",
      },
      {
        property: "og:description",
        content:
          "6 Production Apify Actors • <50MB RAM Async Python & Hidden-API Scrapers • 0.00% Schema Drift LLM & n8n Pipelines • FastAPI, React & Mobile.",
      },
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

const DEFAULT_HERO_TAGS = [
  "PYTHON & PLAYWRIGHT",
  "AI / N8N AUTOMATION",
  "APIFY & REST APIS",
  "FASTAPI & SUPABASE",
  "REACT & MOBILE",
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
      ? "Shipping resilient web scrapers, AI workflow automations & full-stack products."
      : "Xây dựng hệ thống cào dữ liệu, tự động hoá AI & sản phẩm full-stack vận hành thật.");
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
