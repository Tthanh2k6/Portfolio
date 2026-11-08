import { createFileRoute } from "@tanstack/react-router";
import { pageSeo } from "@/lib/site";
import { ProjectSection } from "@/components/ProjectSection";

const SEO = pageSeo("/project");

export const Route = createFileRoute("/project")({
  head: () => ({
    meta: [
      { title: "Projects — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "Projects by Trung Thanh Tran — open-source supabase-rls-check (Python CLI & MCP), race-safe salon booking on Cloudflare Workers + D1 + Stripe, Madalena loyalty app on the App Store & Google Play, Electron admin, and 5 public Apify Store Actors.",
      },
      { property: "og:title", content: "Projects & Case Studies — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "supabase-rls-check (Python/SQL/MCP) • Cloudflare Workers + D1 race-safe booking • App Store & Google Play loyalty app • 5 public Apify Actors.",
      },
      SEO.ogUrl,
    ],
    links: [
      SEO.canonical,
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap",
      },
    ],
  }),
  component: Project,
});

function Project() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ProjectSection />
    </main>
  );
}
