import { createFileRoute } from "@tanstack/react-router";
import { ProjectSection } from "@/components/ProjectSection";

export const Route = createFileRoute("/project")({
  head: () => ({
    meta: [
      { title: "Projects — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "Projects by Trung Thanh Tran — a loyalty app on Google Play built at Madalena, 5 public Apify Store Actors, offline tools for Vietnamese small businesses, scrapers, and AI workflow code.",
      },
      { property: "og:title", content: "Projects & Case Studies — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "A shipped React Native app, 5 public Apify Actors, async Python scrapers, and open-source tools.",
      },
    ],
    links: [
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
