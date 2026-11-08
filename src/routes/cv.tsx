import { createFileRoute } from "@tanstack/react-router";
import { pageSeo } from "@/lib/site";
import { NavBar } from "@/components/NavBar";
import { useLang } from "@/lib/i18n";

const SEO = pageSeo("/cv");

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      {
        title:
          "CV — Trung Thanh Tran | Full-stack Developer — Supabase/Postgres security, React Native apps, Python automation",
      },
      {
        name: "description",
        content:
          "CV of Trung Thanh Tran (Trần Trung Thành) — Full-stack Developer: Supabase/Postgres security, React Native apps (App Store & Google Play), Python automation. Full-time at Madalena since March 2026.",
      },
      SEO.ogUrl,
    ],
    links: [SEO.canonical],
  }),
  component: CvPage,
});

// Thông tin liên hệ công khai trên CV web (không ghi số điện thoại / địa chỉ nhà).
const EMAIL = "ttrungthanh90@gmail.com";
const GITHUB = "github.com/Tthanh2k6";
const LINKEDIN = "linkedin.com/in/trungthanhtran-dev";
const APIFY = "apify.com/thanh81646";
const SITE = "trungthanhtran.vercel.app";
const LOCATION_VI = "TP. Hồ Chí Minh, Việt Nam (UTC+7)";
const LOCATION_EN = "Ho Chi Minh City, Vietnam (UTC+7)";

type Lang = "vi" | "en";

const T = {
  vi: {
    print: "Tải CV (PDF)",
    role: "Lập trình viên full-stack — bảo mật Supabase/Postgres, app React Native, tự động hoá Python",
    hSummary: "Tóm tắt",
    tagline:
      "Lập trình viên full-stack xây dựng ứng dụng vận hành thực tế và kiểm tra các lỗi bảo mật thường gặp ở những ứng dụng phát triển nhanh. Làm việc full-time tại một doanh nghiệp bán lẻ mỹ phẩm từ tháng 03/2026, nơi tôi một mình xây dựng ứng dụng khách hàng thân thiết (đã lên cả App Store và Google Play), REST API PHP và phần mềm quản trị Electron. Nhận hợp đồng làm việc từ xa khoảng 20–30 giờ/tuần, trao đổi bất đồng bộ (async) bằng văn bản (tiếng Anh B2, tiếng Việt bản ngữ).",
    hSkills: "Kỹ năng kỹ thuật",
    hExp: "Kinh nghiệm làm việc",
    hProjects: "Dự án tiêu biểu",
    hEdu: "Học vấn",
    eduSchool: "Cử nhân Khoa học Máy tính, Đại học Công nghiệp TP.HCM (IUH)",
    eduTime: "2024 – 2029 (dự kiến)",
    skills: [
      [
        "Security",
        "Postgres Row Level Security (RLS) & rà soát policy, kiểm tra SECURITY DEFINER & quyền grant, xác minh chữ ký webhook HMAC/Stripe, JWT auth, chống brute-force",
      ],
      ["Ngôn ngữ lập trình", "Python, TypeScript, JavaScript, PHP, SQL, Kotlin"],
      [
        "Thu thập dữ liệu & ETL",
        "Apify Actors, Playwright, httpx (asyncio), Selenium, REST & GraphQL API, pandas",
      ],
      [
        "Tự động hoá quy trình",
        "n8n, Make, webhook, Google Apps Script, Chrome extension (Manifest V3)",
      ],
      [
        "Backend & Ứng dụng",
        "PostgreSQL/Supabase, Cloudflare Workers + D1, FastAPI, Node.js, REST API, React, React Native (Expo), Electron, Git",
      ],
      [
        "AI agents & LLMs",
        "Claude Code, Codex CLI, Gemini CLI hằng ngày: chạy nhiều agent song song theo đặc tả viết sẵn, tự viết skill, tự làm MCP server, tự động hoá trình duyệt, kiểm kết quả agent bằng test; OpenAI/Claude API trả JSON đúng schema",
      ],
    ],
    exp: [
      {
        title: "Lập trình viên phần mềm, Madalena",
        sub: "Full-time · Bán lẻ mỹ phẩm, TP. Hồ Chí Minh",
        time: "03/2026 – nay",
        bullets: [
          "Một mình xây dựng và đưa ứng dụng khách hàng thân thiết lên cả App Store và Google Play: React Native (Expo, TypeScript) kết hợp REST API PHP có xác thực JWT, thông báo đẩy, quét mã QR check-in và tác vụ định kỳ (152 commit từ 05/2026).",
          "Xây dựng chương trình tích điểm: điểm mua hàng và livestream, chiến dịch khuyến mãi, cộng điểm hàng loạt từ Excel, đổi quà có quản lý tồn kho quà tặng, flash sale giới hạn theo từng khách.",
          "Xây dựng ứng dụng quản trị Electron trên desktop cho nhân viên, có phân quyền theo vai trò và nhật ký kiểm toán (audit log): tra cứu khách hàng, hẹn giờ gửi thông báo, flash sale, nhập doanh thu có kiểm tra trùng kỳ, xuất báo cáo.",
          "Phát triển hầu hết tính năng của website thương mại điện tử PHP cho công ty từ 03/2026 trên bộ khung có sẵn của bên khác, đồng thời kết nối với app (đồng bộ sản phẩm, số lượng đã bán, bậc miễn phí vận chuyển).",
          "Chuyển backend từ Node.js trên Render sang PHP hosting; bổ sung sao lưu tự động (automated backups) và chống dò mật khẩu (brute-force protection).",
        ],
      },
      {
        title: "Lập trình viên Python & Tự động hoá Freelance",
        sub: "Hợp đồng · Làm việc từ xa, Upwork",
        time: "10/2026 – nay",
        bullets: [
          "Bàn giao báo cáo kiến trúc cho bot thu thập tin tuyển dụng từ Telegram, LinkedIn và X kèm bộ lọc tin giả; khách hàng đánh giá hợp đồng 5.0/5 trên Upwork.",
          "Xây dựng web app thể hình cho một nhóm sinh viên (React, TypeScript, MediaPipe Pose): nhận xét tư thế tập trực tiếp qua camera và bộ phân loại ảnh món ăn.",
        ],
      },
    ],
    projects: [
      {
        name: "supabase-rls-check (mã nguồn mở MIT: Python, SQL, MCP)",
        tech: "github.com/Tthanh2k6/supabase-rls-check",
        desc: "Truy vấn chỉ-đọc catalog Postgres, CLI Python và chế độ MCP server phát hiện 8 nhóm lỗi cấu hình: bảng tắt RLS, policy true, policy anon trên bảng nhạy cảm, hàm SECURITY DEFINER gọi được bằng anon key, hàm definer thiếu search_path, view bỏ qua RLS, bucket Storage public, extension trong schema public; kèm chế độ probe chỉ GET/HEAD có cờ đồng ý và quét khoá service_role lộ ở frontend. CI kiểm trên PostgreSQL 15 với lỗi cài sẵn (bắt đủ, không báo nhầm); 52 test; xuất báo cáo HTML/MD + fix.sql bọc ROLLBACK. Cũng bán thành gói review trên Contra.",
      },
      {
        name: "Race-safe salon booking (Cloudflare Workers, D1, Stripe)",
        tech: "bản demo",
        desc: "5 yêu cầu đặt cùng lúc cho cùng thợ và khung giờ: nhận 1, chặn 4; kiểm tra chống chồng ca giữa các dịch vụ có độ dài khác nhau; đặt cọc qua Stripe Checkout xác minh chữ ký webhook bằng Web Crypto; lịch iCal cho từng thợ; trang admin có mật khẩu; giao diện Anh/Việt; 11 test. Có gói cài đặt trên Contra.",
      },
      {
        name: "Apify Store: 5 Actor công khai",
        tech: "apify.com/thanh81646",
        desc: "Các Actor Python bất đồng bộ (httpx, Playwright) ưu tiên gọi thẳng JSON API: làm giàu liên hệ B2B, theo dõi giá Shopify, tìm liên hệ phòng khám Mỹ, danh bạ chủ đầu tư bất động sản Malaysia, tối ưu lộ trình nhiều điểm.",
      },
      {
        name: "Các dự án khác",
        tech: "2025 – 2026",
        desc: "Bot thành viên Discord (webhook có chữ ký Stripe/Whop); đồng bộ Apify sang Twenty CRM; bộ công cụ LLM structured-output (FastAPI, Pydantic, n8n); công cụ offline cho doanh nghiệp nhỏ Việt Nam; 5 bài viết trên dev.to.",
      },
    ],
  },

  en: {
    print: "Download CV (PDF)",
    role: "Full-stack Developer — Supabase/Postgres security, React Native apps, Python automation",
    hSummary: "Summary",
    tagline:
      "Full-stack developer who ships production apps and checks them for the security mistakes that fast-built apps often have. Full-time at a cosmetics retailer since March 2026, where I built the loyalty app (App Store and Google Play), its PHP API and an Electron admin as the only developer. Open to remote contract work, about 20–30 hours per week, async and in writing (English B2, Vietnamese native).",
    hSkills: "Technical Skills",
    hExp: "Work Experience",
    hProjects: "Projects",
    hEdu: "Education",
    eduSchool: "B.S. in Computer Science, Industrial University of Ho Chi Minh City (IUH)",
    eduTime: "2024 – 2029 (expected)",
    skills: [
      [
        "Security",
        "Postgres Row Level Security and policy review, SECURITY DEFINER and grant checks, HMAC/Stripe webhook verification, JWT auth, brute-force protection",
      ],
      ["Programming", "Python, TypeScript, JavaScript, PHP, SQL, Kotlin"],
      [
        "Web scraping & ETL",
        "Apify Actors, Playwright, httpx (asyncio), Selenium, REST and GraphQL APIs, pandas",
      ],
      [
        "Workflow automation",
        "n8n, Make, webhooks, Google Apps Script, Chrome extensions (Manifest V3)",
      ],
      [
        "Backend & apps",
        "PostgreSQL/Supabase, Cloudflare Workers + D1, FastAPI, Node.js, REST APIs, React, React Native (Expo), Electron, Git",
      ],
      [
        "AI agents & LLMs",
        "Claude Code, Codex CLI, Gemini CLI daily: parallel agents from written specs, custom skills, MCP servers (built one), browser automation, results checked by tests; OpenAI/Claude APIs with structured outputs",
      ],
    ],
    exp: [
      {
        title: "Software Developer, Madalena",
        sub: "Full-time · Cosmetics retailer, Ho Chi Minh City",
        time: "Mar 2026 – Present",
        bullets: [
          "Built and shipped the customer loyalty app to the App Store and Google Play as the only developer: React Native (Expo, TypeScript) and a PHP REST API with JWT auth, push notifications, QR check-in and scheduled jobs (152 commits since May 2026).",
          "Built the points program: purchase and livestream points, campaigns, bulk grants from Excel, rewards with gift stock, flash sales with per-customer limits.",
          "Built an Electron desktop admin for staff with roles and an audit log: customer search, scheduled notifications, flash sales, revenue import with duplicate-period checks, reports.",
          "Built most features of the company's PHP e-commerce site since March 2026 on a vendor's base framework, and linked it to the app (product sync, sold counts, freeship tiers).",
          "Moved the backend from Node.js on Render to PHP hosting; added automated backups and brute-force protection.",
        ],
      },
      {
        title: "Freelance Python & Automation Developer",
        sub: "Contract · Remote, Upwork",
        time: "Oct 2026 – Present",
        bullets: [
          "Delivered an architecture report for a job-posting bot collecting posts from Telegram, LinkedIn and X with fake-post filtering; client rated the contract 5.0/5 on Upwork.",
          "Built a fitness web app for a student team (React, TypeScript, MediaPipe Pose): live exercise form feedback and a food photo classifier.",
        ],
      },
    ],
    projects: [
      {
        name: "supabase-rls-check (open source: Python, SQL, MCP)",
        tech: "github.com/Tthanh2k6/supabase-rls-check",
        desc: "Read-only catalog query, CLI and MCP server mode that flag 8 misconfiguration types: RLS turned off, true policies, anon policies on sensitive tables, SECURITY DEFINER functions callable with the anon key, definer functions missing search_path, views bypassing RLS, public Storage buckets, extensions in public schema; plus opt-in GET/HEAD probe and a service_role key check in frontend code. CI checks it on PostgreSQL 15 with seeded issues (all found, no false positives); 52 tests; HTML/MD report plus ROLLBACK-wrapped fix.sql. Also sold as a review on Contra.",
      },
      {
        name: "Race-safe salon booking (Cloudflare Workers, D1, Stripe)",
        tech: "demo build",
        desc: "Five simultaneous requests for the same technician and time: 1 accepted, 4 rejected; overlap checks for mixed service lengths; deposits through Stripe Checkout with webhook signatures verified in Web Crypto; per-technician iCal feeds; password-protected admin page; English/Vietnamese UI; 11 tests. Setup package on Contra.",
      },
      {
        name: "Apify Store: 5 published scrapers",
        tech: "apify.com/thanh81646",
        desc: "Async Python Actors (httpx, Playwright) that call JSON APIs first: B2B contact enricher, Shopify price monitor, US clinic contact finder, Malaysia property developer registry, route optimizer.",
      },
      {
        name: "Other projects",
        tech: "2025 – 2026",
        desc: "Discord membership bot (Stripe/Whop signed webhooks); Apify to Twenty CRM sync; LLM structured-output toolkit (FastAPI, Pydantic, n8n); offline tools for Vietnamese small businesses; five dev.to articles.",
      },
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
          <h1>{lang === "vi" ? "Trần Trung Thành" : "Trung Thanh Tran"}</h1>
          <p className="cv-role">{t.role}</p>
          <p className="cv-contact">
            {lang === "vi" ? LOCATION_VI : LOCATION_EN} · {EMAIL}
            <br />
            {GITHUB} · {LINKEDIN} · {APIFY} · {SITE}
          </p>
        </header>

        <section>
          <h2>{t.hSummary}</h2>
          <p className="cv-tagline">{t.tagline}</p>
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
          <h2>{t.hExp}</h2>
          {t.exp.map((e) => (
            <article key={e.title} className="cv-item">
              <div className="cv-item-head">
                <strong>{e.title}</strong>
                <span>{e.time}</span>
              </div>
              <p className="cv-sub">{e.sub}</p>
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

        <section style={{ marginBottom: 0 }}>
          <h2>{t.hEdu}</h2>
          <article className="cv-item" style={{ marginBottom: 0 }}>
            <div className="cv-item-head">
              <strong>{t.eduSchool}</strong>
              <span>{t.eduTime}</span>
            </div>
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
          padding: 40px 48px;
          border-radius: 6px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
          line-height: 1.46;
          font-size: 0.9rem;
        }

        .cv-head { border-bottom: 2px solid #14161c; padding-bottom: 12px; margin-bottom: 16px; }
        .cv-head h1 { font-size: 1.85rem; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
        .cv-role { font-size: 0.98rem; font-weight: 600; color: #1a365d; margin: 2px 0 6px; }
        .cv-contact { font-size: 0.83rem; color: #4c5566; margin: 0; }
        .cv-tagline { font-size: 0.88rem; margin: 0; color: #1f2430; }
        .cv-sub { font-size: 0.82rem; font-style: italic; color: #4c5566; margin: 0 0 3px; }

        .cv-sheet section { margin-bottom: 16px; }
        .cv-sheet h2 {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.4px;
          color: #1a365d;
          border-bottom: 1px solid #cbd5e1;
          padding-bottom: 3px;
          margin: 0 0 8px;
        }

        .cv-item { margin-bottom: 10px; break-inside: avoid; }
        .cv-item-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 2px;
        }
        .cv-item-head strong { font-size: 0.93rem; }
        .cv-item-head span { font-size: 0.79rem; color: #4c5566; white-space: nowrap; }
        .cv-item p { margin: 0; }
        .cv-item ul { margin: 3px 0 0; padding-left: 18px; }
        .cv-item li { margin-bottom: 2px; }

        .cv-skills { width: 100%; border-collapse: collapse; }
        .cv-skills th {
          text-align: left;
          vertical-align: top;
          width: 175px;
          padding: 3px 12px 3px 0;
          font-size: 0.85rem;
        }
        .cv-skills td { padding: 3px 0; }

        @media (max-width: 640px) {
          .cv-page { padding: 100px 12px 40px; }
          .cv-sheet { padding: 28px 20px; }
          .cv-item-head { flex-direction: column; gap: 0; }
          .cv-item-head span { white-space: normal; }
          .cv-skills th { width: auto; display: block; padding-bottom: 0; }
          .cv-skills td { display: block; padding-top: 0; }
        }

        /* In ra giấy / xuất PDF: bỏ nền tối, bỏ thanh điều khiển, canh gọn 1 trang khổ A4 */
        @media print {
          @page { size: A4; margin: 9mm 13mm; }
          .cv-noprint { display: none !important; }
          .cv-page { background: #fff; padding: 0; }
          .cv-sheet {
            max-width: none;
            box-shadow: none;
            border-radius: 0;
            padding: 0;
            font-size: 9.2pt;
            line-height: 1.3;
          }
          .cv-head { padding-bottom: 6px; margin-bottom: 8px; }
          .cv-sheet section { margin-bottom: 8px; break-inside: auto; }
          .cv-sheet h2 { margin-bottom: 4px; padding-bottom: 2px; }
          .cv-item { margin-bottom: 5px; }
          .cv-skills th, .cv-skills td { padding: 1.5px 8px 1.5px 0; }
        }
      `}</style>
    </div>
  );
}
