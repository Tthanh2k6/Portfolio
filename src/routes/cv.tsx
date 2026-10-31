import { createFileRoute } from "@tanstack/react-router";
import { NavBar } from "@/components/NavBar";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Trung Thanh Tran | Python & Automation Developer" },
      {
        name: "description",
        content:
          "CV of Trung Thanh Tran (Trần Trung Thành) — IT student at IUH and developer at Madalena (React Native loyalty app + PHP API). Python, Playwright, n8n, FastAPI, React Native.",
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
    role: "Lập trình viên Python & tự động hoá: thu thập dữ liệu web, API, luồng n8n",
    tagline:
      "Có một vị trí làm việc chính thức (app di động + REST API, tự làm một mình) và một loạt dự án tự động hoá công khai đang lớn dần. Tôi ưu tiên gọi thẳng API JSON phía sau trang web thay vì cào giao diện, và thích biến việc thủ công lộn xộn thành công cụ nhỏ có kiểm thử. Tiếng Anh: B2, đọc tài liệu và trao đổi với khách bằng văn bản thoải mái.",
    hExp: "Kinh nghiệm",
    hProjects: "Dự án công khai & cá nhân",
    hDeliver: "Tôi nhận làm",
    hSkills: "Kỹ năng",
    hCerts: "Chứng chỉ",
    hEdu: "Học vấn",
    hContact: "Liên hệ",
    eduSchool: "Đại học Công nghiệp TP.HCM (IUH)",
    eduMajor: "Sinh viên ngành Công nghệ Thông tin",
    eduTime: "2024 — đang học",
    present: "nay",
    skills: [
      ["Ngôn ngữ", "Python, TypeScript/JavaScript, PHP, SQL, Kotlin, Dart"],
      ["Dữ liệu", "httpx, Playwright, Selenium, Apify SDK, n8n, Make, REST/GraphQL, webhook, Pydantic, pandas"],
      ["Backend & App", "FastAPI, Node.js, PostgreSQL/Supabase, SQLite, React, React Native (Expo), Flutter, Docker, Git"],
      ["AI", "OpenAI và Claude API (structured outputs, tool use), MediaPipe, YOLOv8, scikit-learn/PyTorch"],
    ],
    deliver: [
      ["Dữ liệu web", "Bộ cào và Apify Actor (ưu tiên API JSON/GraphQL ẩn, cần mới dùng Playwright), theo dõi định kỳ, xuất CSV/Sheets/DB sạch"],
      ["Tự động hoá", "Luồng n8n và Make, webhook, tích hợp CRM/Sheets/Telegram/email, Google Apps Script, Chrome extension (MV3)"],
      ["Tính năng AI", "Trích xuất và phân loại bằng LLM theo JSON schema chặt, tìm kiếm RAG, AI agent gọi công cụ, mô hình thị giác nhỏ"],
      ["App & công cụ", "REST API FastAPI/Node, dashboard React, app React Native, công cụ offline một tệp nhập Excel/CSV, báo cáo PDF/Excel"],
    ],
    exp: [
      {
        role: "Lập trình viên",
        org: "Madalena (bán lẻ mỹ phẩm)",
        time: "05/2026 — nay · TP.HCM",
        bullets: [
          "Tự làm một mình app khách hàng thân thiết: app React Native (Expo, TypeScript) cùng REST API PHP có xác thực JWT, check-in bằng QR, thông báo đẩy và tác vụ định kỳ (ưu đãi sinh nhật, flash sale). App đã lên Google Play.",
          "Chuyển backend từ Node.js trên Render sang PHP trên hosting sẵn có của công ty, bỏ được một khoản phí máy chủ riêng hằng tháng.",
          "Làm thêm tính năng cho website thương mại điện tử PHP của công ty cùng với đội.",
        ],
      },
      {
        role: "Dự án freelance",
        org: "Việc nhận lẻ",
        time: "2026",
        bullets: [
          "Web app fitness làm cho phần thi của một nhóm sinh viên, khách huỷ nên nay đã mở mã nguồn (React, TypeScript): lên lịch tập theo hồ sơ người dùng, nhận xét tư thế tập theo thời gian thực bằng MediaPipe Pose, và bộ phân loại ảnh món ăn tự huấn luyện trên 30 món Việt (đặc trưng MobileNetV3 + logistic, top-1 76% / top-3 91%).",
          "Một buổi tư vấn trên Upwork (10/2026, đánh giá 5★) về bot cào tin tuyển dụng: kiến trúc lấy tin từ Telegram, LinkedIn và X, lọc tin giả.",
        ],
      },
    ],
    projects: [
      {
        name: "5 Actor trên Apify Store",
        tech: "10/2026 — nay · Python · httpx · Playwright",
        desc: "Bộ cào Python bất đồng bộ: làm giàu liên hệ & công nghệ từ website B2B, theo dõi giá và tồn kho Shopify/WooCommerce, nhận diện liên hệ phòng khám tại Mỹ, cào danh sách chủ đầu tư bất động sản Malaysia, tối ưu lộ trình nhiều điểm. Mới có vài lượt chạy, chưa có khách trả phí.",
      },
      {
        name: "vn-sme-offline-tools — Công cụ offline cho doanh nghiệp nhỏ",
        tech: "HTML · JavaScript thuần",
        desc: "9 công cụ chạy trong trình duyệt không cần mạng cho hộ kinh doanh Việt Nam: VietQR thu ngân, công nợ B2B, báo giá sỉ, giá vốn hàng nhập, đối soát hoá đơn XML, đối soát đội xe... Làm ở dạng bản mẫu. tthanh2k6.github.io/vn-sme-offline-tools",
      },
      {
        name: "Tích hợp mã nguồn mở",
        tech: "github.com/Tthanh2k6 · FastAPI · n8n · pytest",
        desc: "Đồng bộ Apify sang Twenty CRM có chống trùng và webhook xác thực HMAC; bộ công cụ webhook và structured output cho LLM (FastAPI, n8n). Có bộ test pytest; chưa có khách trả phí dùng.",
      },
      {
        name: "Dự án cá nhân",
        tech: "2025 — 2026",
        desc: "PWA điểm danh QR với backend Google Apps Script (DiemDanhQR); app Android viết bằng Kotlin (widget lịch học của trường, giữ kết nối thông báo); Chrome extension (Manifest V3); ba bài viết kỹ thuật trên dev.to.",
      },
    ],
    certs: [
      ["HackerRank Software Engineer", "Mã ID: 3e14323f3998"],
      ["HackerRank SQL (Advanced)", "Mã ID: f6214fbc9a7f"],
      ["HackerRank REST API (Intermediate)", "Mã ID: 0950402ec1b3"],
      ["HackerRank Node.js & JS (Intermediate)", "Node.js (ID: aea6444671ab) · JavaScript (ID: 73f0cc9845c4)"],
      ["HackerRank Problem Solving & IBM Python", "Problem Solving Intermediate (ID: 34ee18911edf) · IBM Python 101 for Data Science"],
    ],
  },

  en: {
    langBtn: "Tiếng Việt",
    print: "Download CV (PDF)",
    role: "Python & automation developer: web data extraction, APIs, n8n workflows",
    tagline:
      "Developer with one in-house role (mobile app + REST API, built alone) and a growing set of public automation projects. I prefer calling the JSON APIs behind a web page over scraping the rendered page, and I like turning messy manual work into small, tested tools. English: good working proficiency (B2), comfortable reading docs and writing to clients.",
    hExp: "Experience",
    hProjects: "Public work & personal projects",
    hDeliver: "What I deliver",
    hSkills: "Skills",
    hCerts: "Certifications",
    hEdu: "Education",
    hContact: "Contact",
    eduSchool: "Industrial University of Ho Chi Minh City (IUH)",
    eduMajor: "Information Technology student",
    eduTime: "2024 — in progress",
    present: "Present",
    skills: [
      ["Languages", "Python, TypeScript/JavaScript, PHP, SQL, Kotlin, Dart"],
      ["Data", "httpx, Playwright, Selenium, Apify SDK, n8n, Make, REST/GraphQL, webhooks, Pydantic, pandas"],
      ["Backend & Apps", "FastAPI, Node.js, PostgreSQL/Supabase, SQLite, React, React Native (Expo), Flutter, Docker, Git"],
      ["AI", "OpenAI and Claude APIs (structured outputs, tool use), MediaPipe, YOLOv8, scikit-learn/PyTorch"],
    ],
    deliver: [
      ["Web data", "Scrapers and Apify Actors (hidden JSON/GraphQL APIs first, Playwright when needed), scheduled monitoring, clean CSV/Sheets/DB output"],
      ["Automation", "n8n and Make workflows, webhooks, CRM/Sheets/Telegram/email integrations, Google Apps Script, Chrome extensions (MV3)"],
      ["AI features", "LLM extraction and classification with strict JSON schemas, RAG search, AI agents with tool calls, small vision models"],
      ["Apps & tools", "FastAPI/Node REST APIs, React dashboards, React Native apps, offline single-file tools that import Excel/CSV, PDF/Excel reports"],
    ],
    exp: [
      {
        role: "Software Developer",
        org: "Madalena (cosmetics retailer)",
        time: "May 2026 — Present · Ho Chi Minh City",
        bullets: [
          "Built the customer loyalty app alone: React Native (Expo, TypeScript) app plus a PHP REST API with JWT auth, QR check-in, push notifications and scheduled jobs (birthday offers, flash sales). The app is on Google Play.",
          "Moved the backend from Node.js on Render to PHP on the company's existing hosting, removing a separate monthly server bill.",
          "Added features to the company's PHP e-commerce website as part of the team.",
        ],
      },
      {
        role: "Freelance projects",
        org: "Individual jobs",
        time: "2026",
        bullets: [
          "Fitness web app built for a student team's competition entry, now open source after the client cancelled (React, TypeScript): workout plans from a user profile, real-time exercise form feedback with MediaPipe Pose, and a food photo classifier I trained on 30 Vietnamese dishes (MobileNetV3 features + logistic head, 76% top-1 / 91% top-3).",
          "Upwork consultation (Oct 2026, 5★ review) for a job-posting scraper bot: architecture across Telegram, LinkedIn and X; fake-post filtering.",
        ],
      },
    ],
    projects: [
      {
        name: "5 Actors on the Apify Store",
        tech: "Oct 2026 — Present · Python · httpx · Playwright",
        desc: "Async Python scrapers: B2B website contact and tech-stack enricher, Shopify/WooCommerce price and stock monitor, US clinic contact detector, Malaysia property developer scraper, multi-stop route optimizer. A few runs each so far; no paying clients yet.",
      },
      {
        name: "vn-sme-offline-tools — Offline tools for small businesses",
        tech: "HTML · Vanilla JavaScript",
        desc: "Nine browser tools that work without a connection, for Vietnamese small businesses: VietQR cashier, B2B receivables, wholesale quotes, import landed cost, e-invoice XML checks, fleet fuel reconciliation and more. Built as templates. tthanh2k6.github.io/vn-sme-offline-tools",
      },
      {
        name: "Open-source integrations",
        tech: "github.com/Tthanh2k6 · FastAPI · n8n · pytest",
        desc: "Apify-to-Twenty CRM sync with dedupe and HMAC-verified webhooks; webhook and LLM structured-output toolkit (FastAPI, n8n). Covered by pytest suites; not yet used by paying clients.",
      },
      {
        name: "Personal projects",
        tech: "2025 — 2026",
        desc: "QR attendance PWA with Google Apps Script backend (DiemDanhQR); Android apps in Kotlin (university timetable widget, notification keep-alive); Chrome extensions (Manifest V3); three technical articles on dev.to.",
      },
    ],
    certs: [
      ["HackerRank Software Engineer", "Credential ID: 3e14323f3998"],
      ["HackerRank SQL (Advanced)", "ID: f6214fbc9a7f"],
      ["HackerRank REST API (Intermediate)", "ID: 0950402ec1b3"],
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
          <h2>{t.hDeliver}</h2>
          <table className="cv-skills">
            <tbody>
              {t.deliver.map(([area, items]) => (
                <tr key={area}>
                  <th>{area}</th>
                  <td>{items}</td>
                </tr>
              ))}
            </tbody>
          </table>
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
