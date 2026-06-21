import { createFileRoute } from "@tanstack/react-router";
import { SkillsSection } from "@/components/SkillsSection";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills — Trần Trung Thành" },
      { name: "description", content: "Kỹ năng chuyên môn của Trần Trung Thành — AI / WEB3 / UI / 3D / MOTION / VIDEO" },
      { property: "og:title", content: "Skills — Trần Trung Thành" },
      { property: "og:description", content: "Experience gained through projects and school." },
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
