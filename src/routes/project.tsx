import { createFileRoute } from "@tanstack/react-router";
import { ProjectSection } from "@/components/ProjectSection";

export const Route = createFileRoute("/project")({
  head: () => ({
    meta: [
      { title: "Project Showcase — Trần Trung Thành" },
      { name: "description", content: "Project Showcase của Trần Trung Thành — AI / WEB3 / UI / 3D / MOTION / VIDEO" },
      { property: "og:title", content: "Project Showcase — Trần Trung Thành" },
      { property: "og:description", content: "Featured digital products and case studies." },
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
