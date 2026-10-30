import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Trung Thanh Tran | AI Automation, Web Scraping & Full-Stack Engineer" },
      {
        name: "description",
        content:
          "Curriculum Vitae of Trung Thanh Tran (Trần Trung Thành) — AI Automation, Anti-Bot Web Scraping & Full-Stack Engineer (Python, Playwright, FastAPI, n8n, OpenAI, React Native, PHP, PostgreSQL).",
      },
    ],
  }),
  component: CvPage,
});

// Thông tin liên hệ hiển thị trên CV. Số điện thoại viết cách nhóm 4-3-3 cho dễ
// đọc; dán vào máy vẫn gọi được. Cố ý KHÔNG có GPA — chủ ý của tác giả.
const PHONE = "+84 372 131 320";
const PHONE_VI = "0372 131 320";

const EMAIL = "ttrungthanh90@gmail.com";
const GITHUB = "github.com/Tthanh2k6";
const APIFY = "apify.com/thanh81646";
const SITE = "trungthanhtran.vercel.app";
const LOCATION_VI = "TP. Hồ Chí Minh, Việt Nam (UTC+7)";
const LOCATION_EN = "Ho Chi Minh City, Vietnam (UTC+7)";

type Lang = "vi" | "en";

const T = {
  vi: {
    langBtn: "English",
    print: "Tải CV (PDF)",
    role: "Lập trình viên Tự động hoá AI, Web Scraping & Full-Stack",
    tagline:
      "Kỹ sư phần mềm & tự động hoá chú trọng tính thực chiến: đã độc lập xây dựng và phát hành ứng dụng di động doanh nghiệp trên Google Play, xuất bản 6 microservice thu thập dữ liệu thương mại trên Apify Store (<50MB RAM), 2 REST API trên RapidAPI, cùng các luồng AI/n8n kiểm soát chặt cấu trúc dữ liệu.",
    hExp: "Kinh nghiệm thực tế",
    hProjects: "Dự án kỹ thuật tiêu biểu",
    hSkills: "Kỹ năng chuyên môn",
    hCerts: "Chứng chỉ xác thực",
    hEdu: "Học vấn",
    hContact: "Liên hệ",
    eduSchool: "Đại học Công nghiệp TP.HCM (IUH)",
    eduMajor: "Cử nhân Khoa học Máy tính · MSSV 24731801",
    eduTime: "2024 — 2028 (dự kiến)",
    present: "nay",
    skills: [
      ["Scraping & ETL", "Python (asyncio, httpx, BeautifulSoup4), Playwright (CDP), Selenium, dò Hidden JSON/GraphQL API, xác thực DNS/MX, Apify SDK"],
      ["AI & Tự động hoá", "OpenAI & Anthropic Structured Outputs (JSON Schema chặt), Hybrid RAG (BM25 + Vector RRF), n8n, Make.com, Google Apps Script"],
      ["Backend & CSDL", "FastAPI, PHP (REST API, JWT HS256, phân quyền DB, rate-limit, cron), PostgreSQL / Supabase (RLS, pgTAP), MySQL, SQLite"],
      ["Web & Extension", "React 19, TypeScript, TanStack Start (SSR), TailwindCSS, Three.js (WebGL), Chrome Extension (Manifest V3)"],
      ["Mobile & Hệ thống", "React Native (Expo Router, EAS Build, OTA), Kotlin (Jetpack Glance/Compose, WorkManager), apktool/smali, C++17, ESP32 BLE"],
    ],
    exp: [
      {
        role: "Lập trình viên Tự động hoá AI & Dữ liệu độc lập",
        org: "Apify Store, RapidAPI & Khách hàng quốc tế",
        time: "2026 — nay",
        bullets: [
          "Thiết kế và xuất bản 6 Actor thương mại trả phí theo kết quả trên Apify Store (@thanh81646) cùng 2 REST API công khai trên RapidAPI Hub, tối ưu chạy gọn trong container serverless 256 MB (<50MB RAM thực tế).",
          "Xây dựng các bộ làm giàu dữ liệu B2B (xác thực DNS/MX, lọc chuỗi phòng khám tập đoàn DSO Hoa Kỳ đạt độ chính xác 96.4%) và theo dõi giá/tồn kho Shopify & WooCommerce nhanh gấp 51 lần cào DOM bằng trình duyệt.",
          "Phát triển kiến trúc tham chiếu AI doanh nghiệp kết hợp FastAPI, Pydantic Strict JSON Schemas (0% lỗi lệch định dạng JSON), kiểm soát nghẽn luồng (backpressure), Hybrid RAG và tự động hoá webhook n8n/CRM.",
        ],
      },
      {
        role: "Lập trình viên Full-stack & Mobile",
        org: "Madalena (Chuỗi mỹ phẩm & Thương mại điện tử)",
        time: "2026 — nay",
        bullets: [
          "Độc lập phát triển trọn bộ ứng dụng khách hàng thân thiết cho iOS + Android đã phát hành trên Google Play (com.madalena.app): React Native (TypeScript, Expo Router) + REST API PHP/MySQL.",
          "Xây dựng hệ thống tự động xếp hạng thành viên theo doanh thu, mã QR định danh tại quầy, flash sale do máy chủ kiểm soát thời gian chống gian lận giờ máy, thông báo đẩy chống gửi trùng và cron chúc mừng sinh nhật.",
          "Bảo mật & Tối ưu chi phí: xác thực JWT HS256, đối chiếu quyền admin trực tiếp từ CSDL, chặn brute-force theo cặp IP + SĐT; chủ động chuyển toàn bộ backend từ Node/Express (Render + Aiven) sang PHP dùng chung hạ tầng web công ty, cắt giảm 100% phí máy chủ phát sinh hàng tháng.",
          "Phát triển các phân hệ nghiệp vụ trên website bán hàng đang vận hành thật (madalena.vn): hệ thống mã giảm giá giới hạn lượt theo SĐT, tự động đồng bộ đơn hàng sang Google Sheets cho đội sale và quản lý trạng thái tồn kho.",
        ],
      },
    ],
    projects: [
      {
        name: "WorkFlow AI — Dây chuyền sản xuất video AI khép kín",
        tech: "Python · FastAPI · Playwright/CDP · ffmpeg",
        desc: "Tự động hoá từ kịch bản → phân cảnh → sinh ảnh/video trên nền tảng không có API công khai (điều khiển Chrome thật qua giao thức CDP kèm cơ chế dự phòng) → dựng phim bằng ffmpeg; tích hợp license server quản lý và hoàn trả credit tự động.",
      },
      {
        name: "BurgerShop POD Listing Automator — Tiện ích Chrome quản trị TMĐT",
        tech: "JavaScript · Chrome MV3 · Angular/PrimeNG",
        desc: "Tiện ích Manifest V3 tự động điền quy trình đăng sản phẩm nhiều bước trên cổng quản trị Angular: đồng bộ change detection của Reactive Forms, cuộn từng nhịp qua bảng ảo hoá PrimeNG để áp giá chính xác từng SKU và chèn mô tả vào TinyMCE.",
      },
      {
        name: "ToolPhone — Hệ thống phân tích chênh lệch giá điện thoại cũ",
        tech: "Python · Flask · SQLite · pytest",
        desc: "Theo dõi song song 113 dòng máy trên 4 sàn rao vặt; khắc phục sai số thiên lệch sống sót (tin tốt bán nhanh khiến giá còn lại cao hơn 17%) bằng cách tính 'giá thoát hàng' thực tế và lọc đa tầng dân buôn đội lốt cá nhân.",
      },
      {
        name: "Lịch IUH & Ghi chú Mod — Hệ sinh thái tiện ích Android chuyên sâu",
        tech: "Kotlin · Jetpack Glance · apktool/smali · Supabase",
        desc: "Lịch IUH: 3 widget màn hình chính, OAuth2 đồng bộ nền và tự nhúng chứng chỉ TLS trung gian bị thiếu của máy chủ trường. Ghi chú Mod: dịch ngược 15.386 file app hệ thống Xiaomi, tiêm tính năng lịch tuần + trợ lý Gemini biên dịch xuống smali mà giữ nguyên 100% tính năng vẽ tay gốc.",
      },
      {
        name: "Moto-Nav BLE HUD & AI Game Arena — Nhúng C++17 & Mô phỏng 3D",
        tech: "C++17 · ESP32 · Kotlin · TypeScript · Three.js",
        desc: "Moto-Nav: nhân dẫn đường C++17 dùng chung cho Android (JNI) và màn hình ghi-đông ESP32 qua BLE GATT. AI Game Arena: 9 môi trường trực quan hoá giải thuật MCTS/UCT, Minimax Zobrist, Q-Learning và tiến hoá thần kinh 3D.",
      },
    ],
    certs: [
      ["HackerRank Software Engineer", "Chứng chỉ Kỹ sư Phần mềm xác thực — Mã ID: 3e14323f3998"],
      ["HackerRank SQL (Advanced)", "Truy vấn phân tích nâng cao, tối ưu hoá & cửa sổ dữ liệu — Mã ID: f6214fbc9a7f"],
      ["HackerRank REST API (Intermediate)", "Thiết kế, phân trang & tích hợp HTTP/JSON API — Mã ID: 0950402ec1b3"],
      ["HackerRank Node.js & JS (Intermediate)", "Node.js (ID: aea6444671ab) · JavaScript (ID: 73f0cc9845c4)"],
      ["HackerRank Problem Solving & IBM Python", "Problem Solving Intermediate (ID: 34ee18911edf) · IBM Python 101 for Data Science"],
    ],
  },

  en: {
    langBtn: "Tiếng Việt",
    print: "Download CV (PDF)",
    role: "AI Automation, Web Scraping & Full-Stack Engineer",
    tagline:
      "Production-focused software and automation engineer who single-handedly shipped a commercial loyalty app on Google Play, published 6 Pay-Per-Event data extraction microservices on Apify Store (<50MB RAM) plus 2 public REST APIs on RapidAPI, and builds zero-drift OpenAI/n8n/FastAPI pipelines.",
    hExp: "Experience",
    hProjects: "Selected Engineering Projects",
    hSkills: "Technical Stack",
    hCerts: "Verified Certifications",
    hEdu: "Education",
    hContact: "Contact",
    eduSchool: "Industrial University of Ho Chi Minh City (IUH)",
    eduMajor: "B.S. in Computer Science · Student ID 24731801",
    eduTime: "2024 — 2028 (expected)",
    present: "Present",
    skills: [
      ["Scraping & ETL", "Python (asyncio, httpx, BeautifulSoup4), Playwright (CDP), Selenium, Hidden JSON/GraphQL API extraction, DNS/MX validation, Apify SDK"],
      ["AI & Automation", "OpenAI & Anthropic Structured Outputs (Strict JSON Schema), Hybrid RAG (BM25 + Vector RRF), n8n, Make.com, Google Apps Script"],
      ["Backend & Data", "FastAPI, PHP (REST API, JWT HS256, DB-backed RBAC, rate limiting, cron), PostgreSQL / Supabase (RLS, pgTAP), MySQL, SQLite"],
      ["Web & Browser", "React 19, TypeScript, TanStack Start (SSR), TailwindCSS, Three.js (WebGL), Chrome Extensions (Manifest V3)"],
      ["Mobile & Systems", "React Native (Expo Router, EAS Build, OTA), Kotlin (Jetpack Glance/Compose, WorkManager), apktool/smali, C++17, ESP32 BLE"],
    ],
    exp: [
      {
        role: "Independent AI Automation & Data Extraction Engineer",
        org: "Apify Store, RapidAPI & Global Clients",
        time: "2026 — Present",
        bullets: [
          "Engineered and published 6 commercial Pay-Per-Event microservices on Apify Store (@thanh81646) and 2 public REST APIs on RapidAPI Hub, optimized for 256 MB serverless containers (<50MB runtime RAM).",
          "Built sub-second B2B contact & technographics enrichers (cached DNS/MX verification, 96.4%-precision US Healthcare corporate DSO/MSO chain filtering) and Shopify/WooCommerce SKU monitors running 51× faster than headless DOM scrapers.",
          "Architected production LLM & workflow toolkits combining FastAPI, Pydantic Strict JSON Schemas (0.00% schema drift), stream backpressure, Hybrid BM25 + Vector RRF retrieval, and idempotent n8n/CRM webhook sync.",
        ],
      },
      {
        role: "Full-Stack & Mobile Developer",
        org: "Madalena (Retail Cosmetics & E-Commerce)",
        time: "2026 — Present",
        bullets: [
          "Sole developer of the customer loyalty app live on Google Play (com.madalena.app) for iOS and Android: React Native (TypeScript, Expo Router) paired with a custom PHP/MySQL REST API.",
          "Implemented spend-based membership tiers, counter QR identification, server-authoritative flash sales immune to device-clock tampering, idempotent Expo Push reminders, and automated birthday cron campaigns.",
          "Security & Cost Engineering: enforced JWT HS256 auth, database-resolved admin RBAC, and IP+phone brute-force throttling; migrated the backend from Node/Express (Render + Aiven) to shared PHP infrastructure, eliminating 100% of separate monthly cloud hosting bills.",
          "Delivered core revenue features on the live production storefront (madalena.vn): per-phone-capped discount engine, real-time order sync to Google Sheets for sales operations, and inventory-aware catalog ranking.",
        ],
      },
    ],
    projects: [
      {
        name: "WorkFlow AI — Closed-Loop AI Video Production Pipeline",
        tech: "Python · FastAPI · Playwright/CDP · ffmpeg",
        desc: "Automates script generation → scene breakdown → visual synthesis on platforms with no public API (driving real Chrome over CDP with graceful manual fallbacks) → final ffmpeg cut; backed by a custom credit-based licence server with automatic failure refunds.",
      },
      {
        name: "BurgerShop POD Listing Automator — Chrome MV3 Admin Extension",
        tech: "JavaScript · Chrome MV3 · Angular/PrimeNG",
        desc: "Automates multi-step Print-on-Demand catalog uploads inside an Angular admin portal: dispatches change-detection-safe reactive form events, incrementally scrolls virtualized PrimeNG SKU tables, and injects HTML into sandboxed TinyMCE editors.",
      },
      {
        name: "ToolPhone — Multi-Marketplace Used-Phone Arbitrage Analytics",
        tech: "Python · Flask · SQLite · pytest",
        desc: "Tracks 113 phone models across 4 marketplaces in parallel; corrects a measured 17% survivorship-bias markup in live asking prices by computing historical clearing-price ceilings and multi-layer dealer/red-flag filters.",
      },
      {
        name: "Lich IUH & Xiaomi Notes Mod — Native Android & Reverse Engineering",
        tech: "Kotlin · Jetpack Glance · apktool/smali · Supabase",
        desc: "Lich IUH: 3 home-screen schedule widgets with OAuth2 background sync and custom TLS intermediate-cert pinning. Notes Mod: decompiled 15,386 system app files, injecting Kotlin week-calendar & Gemini AI features compiled to smali while keeping proprietary stylus capabilities intact.",
      },
      {
        name: "Moto-Nav BLE HUD & AI Game Arena — C++17 Embedded & 3D RL",
        tech: "C++17 · ESP32 · Kotlin · TypeScript · Three.js",
        desc: "Moto-Nav: shared bit-exact C++17 turn-by-turn geometry core running across Android (JNI) and an ESP32 handlebar HUD over BLE GATT. AI Game Arena: 9 interactive 2D/3D environments showcasing MCTS/UCT, Zobrist Minimax, Q-Learning, and neuroevolution.",
      },
    ],
    certs: [
      ["HackerRank Software Engineer", "Verified Role Certification — Credential ID: 3e14323f3998"],
      ["HackerRank SQL (Advanced)", "Complex joins, window functions, aggregations & query tuning — ID: f6214fbc9a7f"],
      ["HackerRank REST API (Intermediate)", "HTTP pagination, filtering & JSON payload consumption — ID: 0950402ec1b3"],
      ["HackerRank Node.js & JS (Intermediate)", "Node.js (ID: aea6444671ab) · JavaScript (ID: 73f0cc9845c4)"],
      ["HackerRank Problem Solving & IBM Python", "Problem Solving Intermediate (ID: 34ee18911edf) · IBM Python 101 for Data Science"],
    ],
  },
} as const;

function CvPage() {
  const { lang } = useLang();
  const t = T[lang as Lang];

  return (
    <div className="cv-page">
      <NavBar className="cv-noprint" />

      {/* Thanh điều khiển — không in ra giấy */}
      <div className="cv-toolbar cv-noprint">
        <button className="cv-primary" onClick={() => window.print()}>
          {t.print}
        </button>
      </div>

      <main className="cv-sheet">
        <header className="cv-head">
          <h1>{lang === "vi" ? "Trần Trung Thành" : "Trung Thanh Tran (Trần Trung Thành)"}</h1>
          <p className="cv-role">{t.role}</p>
          <p className="cv-contact">
            {lang === "vi" ? LOCATION_VI : LOCATION_EN} · {lang === "vi" ? PHONE_VI : PHONE} · {EMAIL}
            <br />
            {SITE} · {GITHUB} · {APIFY}
          </p>
          <p className="cv-tagline">{t.tagline}</p>
        </header>

        <section>
          <h2>{t.hExp}</h2>
          {t.exp.map((e) => (
            <article key={e.role + e.org} className="cv-item">
              <div className="cv-item-head">
                <strong>
                  {e.role} — {e.org}
                </strong>
                <span>{e.time}</span>
              </div>
              <ul>
                {e.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section>
          <h2>{t.hProjects}</h2>
          {t.projects.map((p) => (
            <article key={p.name} className="cv-item">
              <div className="cv-item-head">
                <strong>{p.name}</strong>
                <span>{p.tech}</span>
              </div>
              <p>{p.desc}</p>
            </article>
          ))}
        </section>

        <section>
          <h2>{t.hSkills}</h2>
          <table className="cv-skills">
            <tbody>
              {t.skills.map(([group, items]) => (
                <tr key={group}>
                  <th>{group}</th>
                  <td>{items}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>{t.hCerts}</h2>
          <table className="cv-skills">
            <tbody>
              {t.certs.map(([certName, certDetail]) => (
                <tr key={certName}>
                  <th>{certName}</th>
                  <td>{certDetail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>{t.hEdu}</h2>
          <article className="cv-item">
            <div className="cv-item-head">
              <strong>{t.eduSchool}</strong>
              <span>{t.eduTime}</span>
            </div>
            <p>{t.eduMajor}</p>
          </article>
        </section>
      </main>

      <style>{`
        .cv-page {
          min-height: 100vh;
          background: #0b0d13;
          padding: 120px 20px 60px;
          font-family: 'Be Vietnam Pro', system-ui, sans-serif;
        }

        .cv-toolbar {
          max-width: 840px;
          margin: 0 auto 16px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .cv-toolbar button {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.25);
          color: rgba(255,255,255,0.8);
          padding: 9px 18px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .cv-toolbar button:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .cv-toolbar .cv-primary { background: #fff; color: #000; border-color: #fff; }
        .cv-toolbar .cv-primary:hover { background: #c9d4ff; border-color: #c9d4ff; }

        /* Tờ CV: nền trắng ngay trên màn hình để thấy đúng bản sẽ in ra */
        .cv-sheet {
          max-width: 840px;
          margin: 0 auto;
          background: #ffffff;
          color: #14161c;
          padding: 44px 52px;
          border-radius: 6px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
          line-height: 1.5;
          font-size: 0.91rem;
        }

        .cv-head { border-bottom: 2px solid #14161c; padding-bottom: 14px; margin-bottom: 20px; }
        .cv-head h1 { font-size: 1.85rem; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
        .cv-role { font-size: 1rem; font-weight: 600; color: #3b4256; margin: 2px 0 7px; }
        .cv-contact { font-size: 0.84rem; color: #4c5566; margin: 0 0 9px; }
        .cv-tagline { font-size: 0.88rem; margin: 0; color: #1f2430; }

        .cv-sheet section { margin-bottom: 20px; }
        .cv-sheet h2 {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.6px;
          color: #6b7280;
          border-bottom: 1px solid #d7dbe3;
          padding-bottom: 4px;
          margin: 0 0 10px;
        }

        .cv-item { margin-bottom: 12px; break-inside: avoid; }
        .cv-item-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 3px;
        }
        .cv-item-head strong { font-size: 0.94rem; }
        .cv-item-head span { font-size: 0.79rem; color: #6b7280; white-space: nowrap; }
        .cv-item p { margin: 0; }
        .cv-item ul { margin: 4px 0 0; padding-left: 18px; }
        .cv-item li { margin-bottom: 3px; }

        .cv-skills { width: 100%; border-collapse: collapse; }
        .cv-skills th {
          text-align: left;
          vertical-align: top;
          width: 195px;
          padding: 4px 14px 4px 0;
          font-size: 0.85rem;
        }
        .cv-skills td { padding: 4px 0; }

        @media (max-width: 640px) {
          .cv-page { padding: 100px 12px 40px; }
          .cv-sheet { padding: 28px 22px; }
          .cv-item-head { flex-direction: column; gap: 0; }
          .cv-item-head span { white-space: normal; }
          .cv-skills th { width: auto; display: block; padding-bottom: 0; }
          .cv-skills td { display: block; padding-top: 0; }
        }

        /* In ra giấy / xuất PDF: bỏ nền tối, bỏ thanh điều khiển, canh khổ A4 */
        @media print {
          @page { size: A4; margin: 12mm 14mm; }
          .cv-noprint { display: none !important; }
          .cv-page { background: #fff; padding: 0; }
          .cv-sheet {
            max-width: none;
            box-shadow: none;
            border-radius: 0;
            padding: 0;
            font-size: 9.6pt;
            line-height: 1.44;
          }
          .cv-sheet section { break-inside: auto; }
        }
      `}</style>
    </div>
  );
}
