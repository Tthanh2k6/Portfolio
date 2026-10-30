import { createFileRoute } from "@tanstack/react-router";
import { ProjectSection } from "@/components/ProjectSection";

export const Route = createFileRoute("/project")({
  head: () => ({
    meta: [
      { title: "Projects & Commercial Microservices — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "Production case studies by Trung Thanh Tran — Google Play loyalty app, 6 commercial Apify Store Actors, Hybrid RAG & OpenAI pipelines, Hidden-API scrapers, and full-stack apps.",
      },
      { property: "og:title", content: "Projects & Case Studies — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "Shipped commercial mobile/web systems, 6 live Apify Store Actors, async Python scrapers, and AI workflow engines.",
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
