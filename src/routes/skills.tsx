import { createFileRoute } from "@tanstack/react-router";
import { SkillsSection } from "@/components/SkillsSection";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & Tech Stack — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "Interactive 3D tech stack of Trung Thanh Tran — Python, Playwright, FastAPI, n8n, OpenAI Structured Outputs, TypeScript, React, React Native, PHP & PostgreSQL/Supabase.",
      },
      { property: "og:title", content: "Skills & Tech Stack — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "Production stack across Python, Anti-Bot Web Scraping, AI Workflow Automation, Backend APIs, Web & Mobile.",
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
  component: Skills,
});

function Skills() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SkillsSection />
    </main>
  );
}
