import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { NavBar } from "@/components/NavBar";

export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Trần Trung Thành" },
      {
        name: "description",
        content:
          "CV của Trần Trung Thành — Full-stack & Mobile Developer (React Native, Kotlin/Android, PHP, Python).",
      },
    ],
  }),
  component: CvPage,
});

/* ────────────────────────────────────────────────────────────────────────────
   CHỖ CẦN TỰ ĐIỀN — mấy trường này không suy ra được từ mã nguồn.
   Điền xong thì xoá luôn dấu 〈 〉 đi.
   ──────────────────────────────────────────────────────────────────────────── */
const PHONE = "〈điền số điện thoại〉";
const GPA = "〈điền GPA nếu muốn khoe, không thì xoá dòng này〉";

const EMAIL = "ttrungthanh90@gmail.com";
const GITHUB = "github.com/Tthanh2k6";
const SITE = "portfolio-tthanh2006.vercel.app";
const LOCATION_VI = "TP. Hồ Chí Minh, Việt Nam";
const LOCATION_EN = "Ho Chi Minh City, Vietnam";

type Lang = "vi" | "en";

const T = {
  vi: {
    langBtn: "English",
    print: "Tải CV (PDF)",
    role: "Full-stack & Mobile Developer",
    tagline:
      "Sinh viên năm 3 ngành CNTT, đã tự làm trọn gói một ứng dụng di động đang chạy thật cho doanh nghiệp — từ app React Native tới REST API và cơ sở dữ liệu.",
    hExp: "Kinh nghiệm",
    hProjects: "Dự án tiêu biểu",
    hSkills: "Kỹ năng",
    hEdu: "Học vấn",
    hContact: "Liên hệ",
    eduSchool: "Đại học Công nghiệp TP.HCM (IUH)",
    eduMajor: "Công nghệ Thông tin · MSSV 24731801",
    eduTime: "2024 — 2028 (dự kiến)",
    present: "nay",
    skills: [
      ["Di động", "React Native (Expo Router, EAS Build, OTA update), Kotlin, Jetpack Glance, WorkManager"],
      ["Backend", "PHP (REST API, JWT HS256, phân quyền, rate-limit, cron), FastAPI, MySQL"],
      ["Web", "React 19, TypeScript, TanStack Start/Router, Three.js, TailwindCSS"],
      ["Tự động hoá", "Playwright (CDP), Selenium, dịch ngược & tiêm mã Android (apktool, smali)"],
      ["ML / AI", "scikit-learn, TensorFlow/Keras, YOLOv8, OpenCV"],
      ["Khác", "Git, Linux, DirectAdmin, Supabase, Firebase Cloud Messaging"],
    ],
    exp: [
      {
        role: "Lập trình viên Full-stack",
        org: "Madalena",
        time: "2026 — nay",
        bullets: [
          "Tự làm một mình trọn bộ ứng dụng khách hàng thân thiết cho iOS + Android: app React Native (TypeScript, Expo Router) và REST API PHP/MySQL.",
          "Xây hệ thống hạng thành viên theo doanh thu, mã QR định danh khách, flash sale theo khung giờ do máy chủ kiểm soát thời gian, và chiến dịch chúc mừng sinh nhật chạy tự động bằng cron.",
          "Bảo mật: xác thực JWT HS256, kiểm tra quyền admin đọc thẳng từ cơ sở dữ liệu thay vì tin token, chặn brute-force đăng nhập theo IP + số điện thoại.",
          "Chủ động port backend từ Node/Express (Render + Aiven) sang PHP để gộp chung hạ tầng với website công ty, cắt được chi phí máy chủ hằng tháng.",
          "Gửi thông báo đẩy tới khách qua Expo Push, kèm cờ chống gửi trùng cho các mốc nhắc trước giờ flash sale.",
        ],
      },
      {
        role: "Lập trình viên PHP (phát triển tính năng)",
        org: "Madalena — website thương mại điện tử",
        time: "2026 — nay",
        bullets: [
          "Phát triển và bảo trì một số tính năng trên website bán hàng đang vận hành thật (PHP tự viết: AltoRouter, PDO, giỏ hàng, SEO, cache).",
          "Làm việc trên codebase có sẵn của đội, phối hợp cùng các thành viên khác.",
        ],
      },
    ],
    projects: [
      {
        name: "Lịch IUH — Widget lịch học Android",
        tech: "Kotlin · Jetpack Glance · WorkManager",
        desc: "App cho sinh viên IUH vì app chính thức của trường không có widget: 3 widget (lịch 7 ngày, hôm nay, đếm ngược lịch thi), đăng nhập OAuth2, tự đồng bộ nền 2 lần/ngày, cache offline. Tự xử lý lỗi máy chủ trường thiếu chứng chỉ trung gian bằng cách nhúng cert vào network security config.",
      },
      {
        name: "WorkFlow AI — Tool sản xuất video AI",
        tech: "Python · FastAPI · Playwright/CDP · ffmpeg",
        desc: "Pipeline trọn gói: kịch bản → chia cảnh → tạo ảnh/video → ghép phim. Nền tảng đích không có API công khai nên tool điều khiển Chrome thật qua remote-debugging. Có license server riêng bán theo credit.",
      },
      {
        name: "Ghi chú Mod — Dịch ngược app Xiaomi",
        tech: "Android · apktool · smali · Kotlin",
        desc: "Thêm tính năng vào thẳng app hệ thống mà giữ nguyên toàn bộ chức năng gốc: dịch ngược 15.386 file, tiêm mã Kotlin biên dịch xuống smali, đổi tên gói (13 authority · 88 URI) để cài song song bản gốc.",
      },
      {
        name: "AI Game Arena",
        tech: "TypeScript · Electron · Three.js",
        desc: "8 môi trường cho AI tự học và đối kháng: Minimax + cắt tỉa Alpha-Beta, MCTS/UCT, Q-Learning, mạng nơ-ron kết hợp giải thuật di truyền, mô phỏng 3D thời gian thực.",
      },
      {
        name: "DiemDanhQR",
        tech: "JavaScript · PWA · Google Apps Script",
        desc: "Điểm danh bằng quét QR trên điện thoại, ghi thẳng vào Google Sheets, chạy dạng PWA không cần máy chủ riêng.",
      },
    ],
  },

  en: {
    langBtn: "Tiếng Việt",
    print: "Download CV (PDF)",
    role: "Full-stack & Mobile Developer",
    tagline:
      "Third-year Computer Science student who single-handedly built and shipped a production mobile app for a business — from the React Native client through the REST API and database.",
    hExp: "Experience",
    hProjects: "Selected Projects",
    hSkills: "Skills",
    hEdu: "Education",
    hContact: "Contact",
    eduSchool: "Industrial University of Ho Chi Minh City (IUH)",
    eduMajor: "Information Technology · Student ID 24731801",
    eduTime: "2024 — 2028 (expected)",
    present: "Present",
    skills: [
      ["Mobile", "React Native (Expo Router, EAS Build, OTA updates), Kotlin, Jetpack Glance, WorkManager"],
      ["Backend", "PHP (REST API, JWT HS256, RBAC, rate limiting, cron), FastAPI, MySQL"],
      ["Web", "React 19, TypeScript, TanStack Start/Router, Three.js, TailwindCSS"],
      ["Automation", "Playwright (CDP), Selenium, Android reverse engineering (apktool, smali injection)"],
      ["ML / AI", "scikit-learn, TensorFlow/Keras, YOLOv8, OpenCV"],
      ["Other", "Git, Linux, DirectAdmin, Supabase, Firebase Cloud Messaging"],
    ],
    exp: [
      {
        role: "Full-stack Developer",
        org: "Madalena",
        time: "2026 — Present",
        bullets: [
          "Sole developer of a customer loyalty app for iOS and Android: React Native client (TypeScript, Expo Router) plus a PHP/MySQL REST API.",
          "Built revenue-based membership tiers, QR customer identification, server-timed flash sales, and an automated birthday campaign driven by cron jobs.",
          "Security: JWT HS256 authentication, admin authorisation resolved from the database rather than trusting the token, and login brute-force protection keyed on IP + phone number.",
          "Independently ported the backend from Node/Express (Render + Aiven) to PHP so it shares infrastructure with the company website, cutting recurring server costs.",
          "Delivered push notifications through Expo Push, with idempotency flags preventing duplicate flash-sale reminders.",
        ],
      },
      {
        role: "PHP Developer (feature work)",
        org: "Madalena — e-commerce website",
        time: "2026 — Present",
        bullets: [
          "Developed and maintained selected features on a live production storefront (custom PHP stack: AltoRouter, PDO, cart, SEO, file caching).",
          "Worked inside an existing team codebase alongside other developers.",
        ],
      },
    ],
    projects: [
      {
        name: "Lich IUH — Android class-schedule widget",
        tech: "Kotlin · Jetpack Glance · WorkManager",
        desc: "Built for IUH students because the official university app ships no widget: three widgets (7-day schedule, today, exam countdown), OAuth2 login, twice-daily background sync and offline cache. Worked around the university server's missing intermediate certificate by bundling it into the network security config.",
      },
      {
        name: "WorkFlow AI — AI video production tool",
        tech: "Python · FastAPI · Playwright/CDP · ffmpeg",
        desc: "End-to-end pipeline: script → scene breakdown → image/video generation → final cut. The target platform exposes no public API, so the tool drives a real Chrome instance over remote debugging. Ships with its own credit-based licence server.",
      },
      {
        name: "Notes Mod — Xiaomi app reverse engineering",
        tech: "Android · apktool · smali · Kotlin",
        desc: "Added features directly into a system app while preserving every original capability: decompiled 15,386 files, injected Kotlin compiled down to smali, and renamed the package (13 authorities · 88 URIs) so it installs alongside the original.",
      },
      {
        name: "AI Game Arena",
        tech: "TypeScript · Electron · Three.js",
        desc: "Eight environments where AI agents learn and compete: Minimax with alpha-beta pruning, MCTS/UCT, Q-Learning, and neural networks trained by genetic algorithms, with real-time 3D simulation.",
      },
      {
        name: "DiemDanhQR",
        tech: "JavaScript · PWA · Google Apps Script",
        desc: "QR-code attendance scanner running as a PWA on any phone, writing straight into Google Sheets with no dedicated server.",
      },
    ],
  },
} as const;

function CvPage() {
  const [lang, setLang] = useState<Lang>("vi");
  const t = T[lang];

  return (
    <div className="cv-page">
      <NavBar className="cv-noprint" />

      {/* Thanh điều khiển — không in ra giấy */}
      <div className="cv-toolbar cv-noprint">
        <button onClick={() => setLang(lang === "vi" ? "en" : "vi")}>
          {t.langBtn}
        </button>
        <button className="cv-primary" onClick={() => window.print()}>
          {t.print}
        </button>
      </div>

      <main className="cv-sheet">
        <header className="cv-head">
          <h1>Trần Trung Thành</h1>
          <p className="cv-role">{t.role}</p>
          <p className="cv-contact">
            {lang === "vi" ? LOCATION_VI : LOCATION_EN} · {PHONE} · {EMAIL}
            <br />
            {GITHUB} · {SITE}
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
          <h2>{t.hEdu}</h2>
          <article className="cv-item">
            <div className="cv-item-head">
              <strong>{t.eduSchool}</strong>
              <span>{t.eduTime}</span>
            </div>
            <p>
              {t.eduMajor}
              <br />
              {GPA}
            </p>
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
          max-width: 820px;
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
          max-width: 820px;
          margin: 0 auto;
          background: #ffffff;
          color: #14161c;
          padding: 48px 54px;
          border-radius: 6px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.45);
          line-height: 1.55;
          font-size: 0.93rem;
        }

        .cv-head { border-bottom: 2px solid #14161c; padding-bottom: 16px; margin-bottom: 22px; }
        .cv-head h1 { font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; margin: 0; }
        .cv-role { font-size: 1.02rem; font-weight: 600; color: #3b4256; margin: 2px 0 8px; }
        .cv-contact { font-size: 0.85rem; color: #4c5566; margin: 0 0 10px; }
        .cv-tagline { font-size: 0.9rem; margin: 0; }

        .cv-sheet section { margin-bottom: 24px; }
        .cv-sheet h2 {
          font-size: 0.82rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1.6px;
          color: #6b7280;
          border-bottom: 1px solid #d7dbe3;
          padding-bottom: 5px;
          margin: 0 0 12px;
        }

        .cv-item { margin-bottom: 14px; break-inside: avoid; }
        .cv-item-head {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 16px;
          margin-bottom: 3px;
        }
        .cv-item-head strong { font-size: 0.96rem; }
        .cv-item-head span { font-size: 0.8rem; color: #6b7280; white-space: nowrap; }
        .cv-item p { margin: 0; }
        .cv-item ul { margin: 4px 0 0; padding-left: 18px; }
        .cv-item li { margin-bottom: 3px; }

        .cv-skills { width: 100%; border-collapse: collapse; }
        .cv-skills th {
          text-align: left;
          vertical-align: top;
          width: 116px;
          padding: 4px 12px 4px 0;
          font-size: 0.88rem;
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
          @page { size: A4; margin: 14mm; }
          .cv-noprint { display: none !important; }
          .cv-page { background: #fff; padding: 0; }
          .cv-sheet {
            max-width: none;
            box-shadow: none;
            border-radius: 0;
            padding: 0;
            font-size: 10.2pt;
          }
          .cv-sheet section { break-inside: auto; }
        }
      `}</style>
    </div>
  );
}
