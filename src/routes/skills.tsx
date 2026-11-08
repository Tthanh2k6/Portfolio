import { createFileRoute } from "@tanstack/react-router";
import { pageSeo } from "@/lib/site";
import { SkillsSection } from "@/components/SkillsSection";

const SEO = pageSeo("/skills");

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills & Tech Stack — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "Interactive 3D tech stack of Trung Thanh Tran — Supabase/Postgres RLS security, AI Agents & MCP (Claude Code, Codex CLI, Gemini CLI), React Native (App Store & Google Play), Cloudflare Workers + D1, Python, Playwright, FastAPI, TypeScript & PHP.",
      },
      { property: "og:title", content: "Skills & Tech Stack — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "28 tools across Postgres/Supabase security, AI agents & MCP, React Native (iOS & Android), Cloudflare Workers + D1, and Python automation.",
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
  component: Skills,
});

function Skills() {
  return (
    <main className="min-h-screen bg-black text-white">
      <SkillsSection />
    </main>
  );
}
