import { createFileRoute } from "@tanstack/react-router";
import { ContactSection } from "@/components/ContactSection";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Engineering Channels — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "Get in touch with Trung Thanh Tran for Python/Playwright web scraping, n8n & OpenAI workflow automation, API integration, and full-stack development.",
      },
      { property: "og:title", content: "Contact — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "Available for part-time, fixed-scope freelance work (UTC+7).",
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
  component: Contact,
});

function Contact() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ContactSection />
    </main>
  );
}
