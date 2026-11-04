import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pageSeo, SITE_URL } from "@/lib/site";
import { useLang } from "@/lib/i18n";

// Trang "link in bio" để dán vào hồ sơ Zalo / Instagram / dev.to / GitHub.
// Cố ý gọn nhẹ: không NavBar, không 3D/WebGL, không ảnh nặng — chỉ HTML + CSS,
// mọi nút là thẻ <a> thường nên vẫn bấm được khi tắt JavaScript (SSR).
const SEO = pageSeo("/links");

type LinkItem = {
  href: string;
  vi: string;
  en: string;
  /** Dòng phụ: địa chỉ hiển thị cho người xem biết sẽ mở đi đâu. */
  handle: string;
  icon: ReactNode;
  /** Mở tab mới + rel="noopener" (mọi link trừ Portfolio cùng site và mailto). */
  external: boolean;
};

const svgProps = {
  className: "links-icon",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const LINKS: LinkItem[] = [
  {
    href: `${SITE_URL}/`,
    vi: "Portfolio",
    en: "Portfolio",
    handle: "trungthanhtran.vercel.app",
    external: false,
    icon: (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    href: "https://tthanh2k6.github.io/vn-sme-offline-tools/",
    vi: "Bộ công cụ cho hộ kinh doanh (demo trực tiếp)",
    en: "Offline tools for Vietnamese small businesses (live demo)",
    handle: "tthanh2k6.github.io/vn-sme-offline-tools",
    external: true,
    icon: (
      <svg {...svgProps}>
        <path d="M3 9l1.5-5h15L21 9" />
        <path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
        <path d="M5 13.5V21h14v-7.5" />
        <path d="M10 21v-5h4v5" />
      </svg>
    ),
  },
  {
    href: "https://apify.com/thanh81646",
    vi: "Apify Store (Actors)",
    en: "Apify Store (Actors)",
    handle: "apify.com/thanh81646",
    external: true,
    icon: (
      <svg {...svgProps}>
        <polygon points="12 2 22 7.5 22 16.5 12 22 2 16.5 2 7.5 12 2" />
        <polyline points="2 7.5 12 13 22 7.5" />
        <line x1="12" y1="22" x2="12" y2="13" />
      </svg>
    ),
  },
  {
    href: "https://github.com/Tthanh2k6",
    vi: "GitHub",
    en: "GitHub",
    handle: "github.com/Tthanh2k6",
    external: true,
    icon: (
      <svg className="links-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    href: "https://dev.to/tthanh2k6",
    vi: "Bài viết trên dev.to",
    en: "dev.to articles",
    handle: "dev.to/tthanh2k6",
    external: true,
    icon: (
      <svg {...svgProps}>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    href: "https://contra.com/trung_thanh_tran_7tjnw73h",
    vi: "Contra",
    en: "Contra",
    handle: "contra.com/trung_thanh_tran_7tjnw73h",
    external: true,
    icon: (
      <svg {...svgProps}>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
  },
  {
    href: "https://www.upwork.com/freelancers/trungthanhtrandev",
    vi: "Upwork",
    en: "Upwork",
    handle: "upwork.com/freelancers/trungthanhtrandev",
    external: true,
    icon: (
      <svg {...svgProps}>
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/trungthanhtran-dev/",
    vi: "LinkedIn",
    en: "LinkedIn",
    handle: "linkedin.com/in/trungthanhtran-dev",
    external: true,
    icon: (
      <svg {...svgProps}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M7 10v7M7 7h.01M11 17v-7M11 13a3 3 0 0 1 6 0v4" />
      </svg>
    ),
  },
  {
    href: "mailto:ttrungthanh90@gmail.com",
    vi: "Email",
    en: "Email",
    handle: "ttrungthanh90@gmail.com",
    external: false,
    icon: (
      <svg {...svgProps}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 6L2 7" />
      </svg>
    ),
  },
];

export const Route = createFileRoute("/links")({
  head: () => ({
    meta: [
      { title: "Links — Trung Thanh Tran" },
      {
        name: "description",
        content:
          "All links of Trung Thanh Tran, Python & automation developer: portfolio, offline tools for Vietnamese small businesses, Apify Actors, GitHub, dev.to, Contra, Upwork, LinkedIn and email.",
      },
      { property: "og:title", content: "Links — Trung Thanh Tran" },
      {
        property: "og:description",
        content:
          "Python & automation developer · web scraping, Apify Actors, n8n/Make, Google Sheets.",
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
  component: LinksPage,
});

const cursorHover = (enter: boolean) => {
  window.dispatchEvent(new CustomEvent(enter ? "cursorHoverEnter" : "cursorHoverLeave"));
};

const hoverProps = {
  onMouseEnter: () => cursorHover(true),
  onMouseLeave: () => cursorHover(false),
};

function LinksPage() {
  const { lang, setLang, t } = useLang();

  return (
    <main className="links-page">
      <style>{`
        .links-page {
          min-height: 100vh;
          min-height: 100dvh;
          background-color: #0b0c10;
          background-image: radial-gradient(120% 55% at 50% 0%, rgba(56, 189, 248, 0.09), transparent 62%);
          color: #ffffff;
          font-family: 'Be Vietnam Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          display: flex;
          justify-content: center;
          padding: 20px 16px 48px;
          -webkit-tap-highlight-color: transparent;
        }

        .links-shell {
          width: 100%;
          max-width: 480px;
          display: flex;
          flex-direction: column;
        }

        .links-top {
          display: flex;
          justify-content: flex-end;
          min-height: 34px;
        }

        .links-lang {
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 999px;
          color: rgba(255, 255, 255, 0.78);
          font-family: 'Fira Code', monospace;
          font-size: 0.74rem;
          font-weight: 500;
          letter-spacing: 0.6px;
          padding: 6px 13px;
          transition: border-color 0.22s ease, color 0.22s ease;
        }

        .links-lang:hover {
          border-color: rgba(56, 189, 248, 0.55);
          color: #38bdf8;
        }

        .links-header {
          text-align: center;
          margin: 18px 0 30px;
        }

        .links-avatar {
          display: block;
          width: 76px;
          height: 76px;
          margin: 0 auto 16px;
          border-radius: 20px;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), 0 14px 34px rgba(0, 0, 0, 0.45);
        }

        .links-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          letter-spacing: -0.4px;
          margin: 0;
        }

        .links-tagline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.68);
          margin: 10px auto 0;
          max-width: 400px;
        }

        .links-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .links-btn {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 64px;
          padding: 13px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 14px;
          color: #ffffff;
          text-decoration: none;
          transition: background-color 0.22s ease, border-color 0.22s ease, transform 0.22s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.22s ease;
        }

        .links-btn:hover {
          background: rgba(255, 255, 255, 0.055);
          border-color: rgba(56, 189, 248, 0.45);
          transform: translateY(-2px);
        }

        .links-btn:active {
          transform: translateY(0) scale(0.985);
        }

        .links-btn:focus-visible,
        .links-lang:focus-visible {
          outline: 2px solid #38bdf8;
          outline-offset: 3px;
        }

        .links-btn.is-primary {
          background: #ffffff;
          border-color: #ffffff;
          color: #090d16;
        }

        .links-btn.is-primary:hover {
          background: #38bdf8;
          border-color: #38bdf8;
          color: #05080f;
          box-shadow: 0 10px 25px rgba(56, 189, 248, 0.25);
        }

        .links-icon {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.75);
          transition: color 0.22s ease;
        }

        .links-btn:hover .links-icon {
          color: #38bdf8;
        }

        .links-btn.is-primary .links-icon,
        .links-btn.is-primary:hover .links-icon {
          color: currentColor;
        }

        .links-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
          flex: 1;
        }

        .links-label {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.96rem;
          font-weight: 700;
          line-height: 1.35;
        }

        .links-handle {
          font-family: 'Fira Code', monospace;
          font-size: 0.72rem;
          color: rgba(255, 255, 255, 0.48);
          margin-top: 3px;
          overflow-wrap: anywhere;
        }

        .links-btn.is-primary .links-handle {
          color: rgba(9, 13, 22, 0.6);
        }

        .links-arrow {
          width: 16px;
          height: 16px;
          flex-shrink: 0;
          opacity: 0.55;
          transition: transform 0.22s ease, opacity 0.22s ease;
        }

        .links-btn:hover .links-arrow {
          opacity: 1;
          transform: translate(2px, -2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .links-btn,
          .links-arrow,
          .links-icon,
          .links-lang {
            transition: none;
          }
          .links-btn:hover,
          .links-btn:active,
          .links-btn:hover .links-arrow {
            transform: none;
          }
        }

        /* Tắt JavaScript: CustomCursor không chạy nên trả lại con trỏ gốc của hệ điều hành
           (styles.css đang ẩn nó toàn trang), và ẩn nút đổi ngôn ngữ vì nút cần JS. */
        @media (scripting: none) {
          .links-page,
          .links-page * {
            cursor: auto !important;
          }
          .links-page a {
            cursor: pointer !important;
          }
          .links-lang {
            visibility: hidden;
          }
        }
      `}</style>

      <div className="links-shell">
        <div className="links-top">
          <button
            type="button"
            className="links-lang"
            onClick={() => setLang(lang === "vi" ? "en" : "vi")}
            aria-label={t("Switch to English", "Chuyển sang tiếng Việt")}
            {...hoverProps}
          >
            {lang === "vi" ? "EN" : "VI"}
          </button>
        </div>

        <header className="links-header">
          <img className="links-avatar" src="/favicon.svg" width={76} height={76} alt="" />
          <h1 className="links-name">Trung Thanh Tran</h1>
          <p className="links-tagline">
            {t(
              "Lập trình viên Python & tự động hoá · cào dữ liệu web, Apify Actors, n8n/Make, Google Sheets",
              "Python & automation developer · web scraping, Apify Actors, n8n/Make, Google Sheets",
            )}
          </p>
        </header>

        <nav aria-label={t("Liên kết", "Links")}>
          <ul className="links-list">
            {LINKS.map((item, idx) => (
              <li key={item.href}>
                <a
                  className={`links-btn${idx === 0 ? " is-primary" : ""}`}
                  href={item.href}
                  {...(item.external ? { target: "_blank", rel: "noopener" } : {})}
                  {...hoverProps}
                >
                  {item.icon}
                  <span className="links-text">
                    <span className="links-label">{t(item.vi, item.en)}</span>
                    <span className="links-handle">{item.handle}</span>
                  </span>
                  <svg
                    className="links-arrow"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M8 7h9v9" />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </main>
  );
}
