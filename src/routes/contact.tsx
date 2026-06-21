import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Project Showcase & Contact — Trần Trung Thành" },
      { name: "description", content: "Liên hệ và để lại lời nhắn cho Trần Trung Thành — AI / WEB3 / UI / 3D / MOTION / VIDEO" },
      { property: "og:title", content: "Project Showcase & Contact — Trần Trung Thành" },
      { property: "og:description", content: "Have something in mind? Send a message and let's connect." },
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
  component: Contact,
});

function Contact() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ContactSection />
    </main>
  );
}
