import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { LangProvider } from "../lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    const errObj = error instanceof Error ? error : new Error(String(error));
    reportLovableError(errObj, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

const SITE_URL = "https://trungthanhtran.vercel.app";
const OG_IMAGE_URL = `${SITE_URL}/og-preview-1200x630.png`;

const SCHEMA_ORG_GRAPH = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Trung Thanh Tran",
      alternateName: ["Trần Trung Thành", "Tthanh2k6", "thanh81646"],
      jobTitle: "AI Automation, Web Scraping & Full-Stack Software Engineer",
      url: `${SITE_URL}/`,
      image: OG_IMAGE_URL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Ho Chi Minh City",
        addressCountry: "VN",
      },
      knowsAbout: [
        "Python Asyncio & Anti-Bot Web Scraping",
        "Playwright Browser Automation",
        "Hidden JSON & GraphQL API Extraction",
        "n8n & Make.com Workflow Automation",
        "OpenAI & Anthropic Structured Outputs",
        "Hybrid RAG (BM25 + Vector RRF)",
        "FastAPI, PHP & PostgreSQL / Supabase",
        "React 19, TypeScript & React Native (Expo)",
        "Google Apps Script & Chrome Extensions (MV3)",
      ],
      sameAs: [
        "https://github.com/Tthanh2k6",
        "https://apify.com/thanh81646",
        "https://dev.to/tthanh2k6",
        "https://www.upwork.com/freelancers/trungthanhtrandev",
        "https://rapidapi.com/Tthanh2k6/api/b2b-website-email-phone-and-tech-stack-enricher",
        "https://trungthanh16.gumroad.com",
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#apify-actors`,
      name: "Public Apify Actors by Trung Thanh Tran",
      itemListElement: [
        {
          "@type": "SoftwareApplication",
          position: 1,
          name: "B2B Website Email, Phone, Social Links & Tech Stack Scraper",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Cloud Serverless (Apify & RapidAPI)",
          url: "https://apify.com/thanh81646/apify-b2b-lead-and-contact-enricher",
          author: { "@id": `${SITE_URL}/#person` },
          offers: { "@type": "Offer", price: "2.00", priceCurrency: "USD" },
        },
        {
          "@type": "SoftwareApplication",
          position: 2,
          name: "Shopify & WooCommerce Product Price, Stock & JSON-LD Monitor",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Cloud Serverless (Apify & RapidAPI)",
          url: "https://apify.com/thanh81646/apify-ecommerce-price-and-stock-monitor",
          author: { "@id": `${SITE_URL}/#person` },
          offers: { "@type": "Offer", price: "2.00", priceCurrency: "USD" },
        },
        {
          "@type": "SoftwareApplication",
          position: 3,
          name: "US Healthcare Clinic Contact, Schema & Chain Detector",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Cloud Serverless (Apify)",
          url: "https://apify.com/thanh81646/apify-us-healthcare-clinic-contact-enricher",
          author: { "@id": `${SITE_URL}/#person` },
          offers: { "@type": "Offer", price: "2.00", priceCurrency: "USD" },
        },
        {
          "@type": "SoftwareApplication",
          position: 4,
          name: "Malaysia KPKT TEDUH Property Developers & Housing Projects",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Cloud Serverless (Apify)",
          url: "https://apify.com/thanh81646/malaysia-kpkt-teduh-property-developer-scraper",
          author: { "@id": `${SITE_URL}/#person` },
          offers: { "@type": "Offer", price: "2.00", priceCurrency: "USD" },
        },
        {
          "@type": "SoftwareApplication",
          position: 5,
          name: "Multi-Stop Route, Geocoder & 2-Opt TSP Distance Optimizer",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Cloud Serverless (Apify & Python)",
          url: "https://github.com/Tthanh2k6/apify-multi-stop-route-and-distance-optimizer",
          author: { "@id": `${SITE_URL}/#person` },
          offers: { "@type": "Offer", price: "2.00", priceCurrency: "USD" },
        },
      ],
    },
  ],
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title:
          "Trung Thanh Tran (Trần Trung Thành) — AI Automation, Web Scraping & Full-Stack Engineer",
      },
      {
        name: "description",
        content:
          "IT student and developer at Madalena (React Native loyalty app on Google Play + PHP API). Builds async Python & Playwright scrapers, OpenAI/n8n/FastAPI workflows, and 5 public Apify Store Actors.",
      },
      { name: "author", content: "Trung Thanh Tran" },
      {
        name: "keywords",
        content:
          "Trung Thanh Tran, Trần Trung Thành, Python Web Scraping, Playwright Automation, n8n Workflow Engineer, FastAPI, OpenAI Structured Outputs, Apify Actor Developer, B2B Lead Enrichment, Full-Stack TypeScript React Native",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Trung Thanh Tran — Engineering Portfolio" },
      { property: "og:url", content: `${SITE_URL}/` },
      {
        property: "og:title",
        content:
          "Trung Thanh Tran — AI Automation, Anti-Bot Web Scraping & Full-Stack Engineer",
      },
      {
        property: "og:description",
        content:
          "Python & Playwright scrapers • n8n / OpenAI workflows • React Native app on Google Play • 5 public Apify Actors.",
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:secure_url", content: OG_IMAGE_URL },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content:
          "Trung Thanh Tran — AI Automation, Anti-Bot Web Scraping & Full-Stack Engineer (Async Python, Playwright, n8n, FastAPI)",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@Tthanh2k6" },
      { name: "twitter:creator", content: "@Tthanh2k6" },
      {
        name: "twitter:title",
        content: "Trung Thanh Tran — AI Automation, Web Scraping & Full-Stack Engineer",
      },
      {
        name: "twitter:description",
        content:
          "Async Python/Playwright scrapers • Strict-schema OpenAI, n8n & FastAPI workflows • 5 public Apify Actors.",
      },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "canonical",
        href: `${SITE_URL}/`,
      },
      {
        rel: "alternate",
        type: "text/plain",
        href: `${SITE_URL}/llms.txt`,
        title: "LLM Context Summary",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: SCHEMA_ORG_GRAPH }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// Nội dung do /admin chỉnh nằm trong localStorage và LUÔN được ưu tiên hơn giá trị mặc
// định trong code. Hệ quả: sửa danh sách dự án / kỹ năng / giới thiệu trong code xong
// deploy thì trình duyệt nào từng vào /admin vẫn hiện bản cũ, tưởng là deploy hỏng.
//
// Cách xử lý: tăng CONTENT_VERSION mỗi khi đổi các mặc định trong code. Trình duyệt thấy
// phiên bản lệch sẽ xoá đúng các khoá nội dung cũ để rơi về mặc định mới.
// Các khoá KHÔNG liên quan tới nội dung mặc định (vd sổ lưu bút khách viết) được giữ nguyên.
const CONTENT_VERSION = "2026-10-31-1";
const VERSIONED_CONTENT_KEYS = [
  "project_list",
  "skills_keycaps",
  "skills_chart_data",
  "skills_title_to_chart",
  "skills_sub",
  "skills_title_1",
  "skills_title_2",
  "skills_typewriter",
  "skills_desc",
  "home_line_1",
  "home_line_2",
  "home_line_3",
  "info_status",
  "info_title_top",
  "info_title_bottom",
  "info_typing",
  "info_description",
  "info_tags",
  "info_explore_1",
  "info_explore_2",
  "info_card_name",
  "info_card_title",
  "contact_socials",
];

function useResetStaleContent() {
  useEffect(() => {
    try {
      if (localStorage.getItem("content_version") === CONTENT_VERSION) return;
      VERSIONED_CONTENT_KEYS.forEach((k) => localStorage.removeItem(k));
      localStorage.setItem("content_version", CONTENT_VERSION);
    } catch {
      // Trình duyệt chặn localStorage (chế độ riêng tư) — bỏ qua, trang vẫn dùng mặc định.
    }
  }, []);
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  useResetStaleContent();

  return (
    <QueryClientProvider client={queryClient}>
      <LangProvider>
        {/* Bắt buộc: các route con render ở đây. Xóa <Outlet /> sẽ làm hỏng toàn bộ route con. */}
        <Outlet />
        <CustomCursor />
      </LangProvider>
    </QueryClientProvider>
  );
}


// ─── Con trỏ tùy chỉnh ──────────────────────────────────────────────────
function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const hoverScaleRef = useRef(1.0);
  const targetHoverScaleRef = useRef(1.0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    posRef.current   = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    velRef.current   = { x: 0, y: 0 };
    hoverScaleRef.current = 1.0;
    targetHoverScaleRef.current = 1.0;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    let rafId: number;
    const tick = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      let px = posRef.current.x;
      let py = posRef.current.y;
      let vx = velRef.current.x;
      let vy = velRef.current.y;

      // Hằng số vật lý lò xo - giảm chấn
      const spring = 0.085;  // Hệ số lò xo (độ cứng)
      const damping = 0.62;  // Hệ số giảm chấn (ma sát/lực cản)

      // Tính gia tốc
      const ax = (targetX - px) * spring - vx * damping;
      const ay = (targetY - py) * spring - vy * damping;

      // Cập nhật vận tốc & vị trí
      vx += ax;
      vy += ay;
      px += vx;
      py += vy;

      posRef.current = { x: px, y: py };
      velRef.current = { x: vx, y: vy };

      // Tính tốc độ và góc di chuyển để co giãn động
      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx);

      // Hệ số co giãn dạng giọt nước: kéo dài theo trục vận tốc, co lại theo phương vuông góc
      const maxStretch = 1.95;
      const stretch = Math.min(1 + speed * 0.038, maxStretch);
      const shrink = Math.max(1 - speed * 0.018, 0.45);

      // Hoạt ảnh phóng to khi hover một cách mượt mà
      const targetHoverScale = targetHoverScaleRef.current;
      let currentHoverScale = hoverScaleRef.current;
      currentHoverScale += (targetHoverScale - currentHoverScale) * 0.15;
      hoverScaleRef.current = currentHoverScale;

      const finalScaleX = stretch * currentHoverScale;
      const finalScaleY = shrink * currentHoverScale;

      if (cursorRef.current) {
        // Không offset cứng ở đây! Việc canh giữa được xử lý bằng CSS margin-top/margin-left
        cursorRef.current.style.transform =
          `translate3d(${px}px, ${py}px, 0) rotate(${angle}rad) scale(${finalScaleX}, ${finalScaleY})`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onLeave = () => { if (cursorRef.current) cursorRef.current.style.opacity = "0"; };
    const onEnter = () => { if (cursorRef.current) cursorRef.current.style.opacity = "1"; };

    const handleHoverEnter = () => {
      targetHoverScaleRef.current = 1.35;
    };
    const handleHoverLeave = () => {
      targetHoverScaleRef.current = 1.0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("cursorHoverEnter", handleHoverEnter);
    window.addEventListener("cursorHoverLeave", handleHoverLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("cursorHoverEnter", handleHoverEnter);
      window.removeEventListener("cursorHoverLeave", handleHoverLeave);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div ref={cursorRef} className="skills-cursor">
      {/* Chấm trung tâm - hiển thị màu thật để ngắm mục tiêu */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "4px",
          height: "4px",
          backgroundColor: "#000000",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>,
    document.body
  );
}
