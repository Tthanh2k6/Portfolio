import { createFileRoute } from "@tanstack/react-router";
import { pageSeo } from "@/lib/site";
import { ContactSection } from "@/components/ContactSection";

const SEO = pageSeo("/contact");

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Engineering Channels — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "Get in touch with Trung Thanh Tran for Supabase/Postgres security reviews, React Native apps, Cloudflare Workers + D1 backends, and Python automation. Async, written updates, UTC+7, about 20–30 hours/week for contract work.",
      },
      { property: "og:title", content: "Contact — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "Async, written updates, UTC+7, about 20–30 hours/week for contract work.",
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
  component: Contact,
});

function Contact() {
  return (
    <main className="min-h-screen bg-black text-white">
      <ContactSection />
    </main>
  );
}
