import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { NavBar } from "./NavBar";
import { useLang } from "@/lib/i18n";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Skills", to: "/skills" },
  { label: "Information", to: "/information" },
  { label: "Project", to: "/project" },
  { label: "Contact", to: "/contact" },
];

// Kích thước bàn phím kỹ năng. Để chung một chỗ vì lưới, ô phím và logo phải khớp nhau.
//
// 28 phím xếp 7 CỘT × 4 HÀNG (giữ đúng 4 hàng để chiều cao ~300px vừa gọn 1 màn hình,
// không làm hoạt ảnh keyboard-float sinh thanh cuộn dọc gây giật; chia hết cho 7 nên hàng cuối đầy đặn).
const KEYS_PER_ROW = 7;
const KEY_SIZE     = 55;   // cạnh một phím (px)
const KEY_GAP      = 12;   // khoảng cách giữa các phím (px)
const KEY_ICON     = 32;   // cạnh logo trong phím (px)

// Bàn phím kỹ năng — 28 phím (4 phím nhóm mới Security / AI Agents / MCP / Cloudflare + 24 phím cũ).
//
// Thứ tự = thứ tự hiển thị: nhóm định vị chính & kỹ năng có sản phẩm thật chứng minh đứng trước.
// Phím nào chưa có logo trong public/IMG thì để img: "" — keycap sẽ tự hiện chữ
// (xem span.keycap-label-fallback ở phần render). Có logo thì thả file vào
// public/IMG/ rồi điền đường dẫn vào đây.
export const KEYCAPS = [
  { bg: "#dc2626", shadow: "#991b1b", color: "#fff",    img: "",                         title: "Security",        desc: "Postgres RLS & rà soát policy, kiểm tra SECURITY DEFINER/grant, xác minh webhook HMAC/Stripe, JWT auth, chống brute-force.", descEn: "Postgres Row Level Security & policy review, SECURITY DEFINER/grant checks, HMAC/Stripe webhook verification, JWT auth, brute-force protection." },
  { bg: "#d97706", shadow: "#92400e", color: "#fff",    img: "",                         title: "AI Agents",       desc: "Claude Code, Codex CLI, Gemini CLI hằng ngày: chạy nhiều agent song song theo đặc tả, tự viết skill & MCP server, browser automation, kiểm bằng test.", descEn: "Claude Code, Codex CLI, Gemini CLI daily: parallel agents from written specs, custom skills, custom MCP servers, browser automation, checked by tests." },
  { bg: "#0ea5e9", shadow: "#0369a1", color: "#fff",    img: "",                         title: "MCP",             desc: "Tự làm MCP server (gồm chế độ MCP của supabase-rls-check) để nối kiểm tra catalog Postgres & công cụ riêng vào agent CLI.", descEn: "Built custom Model Context Protocol servers (including supabase-rls-check MCP mode) wiring Postgres catalog audits into coding agents." },
  { bg: "#f38020", shadow: "#a8520b", color: "#fff",    img: "",                         title: "Cloudflare",      desc: "Cloudflare Workers + D1 SQLite: đặt lịch chống trùng ca (5 yêu cầu đồng thời nhận 1 chặn 4), xác minh webhook Stripe bằng Web Crypto.", descEn: "Cloudflare Workers + D1 SQLite: race-safe booking concurrency, Stripe webhook verification in Web Crypto, and edge APIs." },
  { bg: "#3875a6", shadow: "#204969", color: "#fff",    img: "/IMG/Python.png",          title: "Python",          desc: "CLI bảo mật supabase-rls-check (52 test), asyncio, httpx, pipeline ETL và 5 Actor công khai trên Apify Store.", descEn: "Open-source supabase-rls-check CLI (52 tests), asyncio, httpx, ETL pipelines, and 5 public Apify Store Actors." },
  { bg: "#2d8a4e", shadow: "#1b5730", color: "#fff",    img: "",                         title: "Playwright",      desc: "Tự động hoá trình duyệt, kiểm thử luồng giao diện cho AI agent, điều khiển Chrome qua CDP và gọi JSON API ẩn.", descEn: "Browser automation, UI verification for AI agents, Chrome CDP debugging, and JSON API-first extraction." },
  { bg: "#009688", shadow: "#00635a", color: "#fff",    img: "",                         title: "FastAPI",         desc: "Backend bất đồng bộ, cổng OpenAI Structured Outputs, kiểm soát backpressure & license server.", descEn: "Async microservices, OpenAI Structured Output routers, and credit licence servers." },
  { bg: "#ea4b71", shadow: "#9c2b47", color: "#fff",    img: "",                         title: "n8n",             desc: "Điều phối luồng tự động hoá doanh nghiệp, webhook Make.com/Clay, đồng bộ CRM & hàng đợi thử lại.", descEn: "Workflow orchestration, Make.com/Clay webhooks, CRM sync, and idempotent retry queues." },
  { bg: "#10a37f", shadow: "#0a664f", color: "#fff",    img: "/IMG/chatgpt-logo-png_seeklogo-465219-Photoroom.png", title: "OpenAI API", desc: "Ép AI trả JSON đúng schema (Structured Outputs), dùng Codex CLI hằng ngày, Hybrid RAG và gọi hàm.", descEn: "Strict JSON Schema Structured Outputs, Codex CLI daily workflows, Hybrid BM25 + Vector RRF RAG, and tool calling." },
  { bg: "#3178c6", shadow: "#1f4e80", color: "#fff",    img: "",                         title: "TypeScript",      desc: "Ứng dụng full-stack kiểm kiểu chặt: app Expo trên App Store & Google Play, Cloudflare Workers + D1 và TanStack Start SSR.", descEn: "Strictly typed full-stack apps: the App Store & Google Play Expo app, Cloudflare Workers + D1, and this TanStack Start SSR site." },
  { bg: "#2c3e50", shadow: "#1a252f", color: "#00d8ff", img: "/IMG/React.png",           title: "React",           desc: "Giao diện web & Electron desktop admin (phân quyền, audit log) với React 19, custom hooks, SSR và TailwindCSS.", descEn: "Web UIs and Electron desktop admin (roles, audit log) built with React 19, custom hooks, SSR, and TailwindCSS." },
  { bg: "#eef1f7", shadow: "#b9c0cf", color: "#1a1b23", img: "/IMG/unnamed-Photoroom.png", title: "Expo",          desc: "App khách hàng thân thiết React Native trên cả App Store và Google Play (152 commit từ 05/2026): push, quét QR, OTA.", descEn: "Shipped React Native loyalty app on both the App Store and Google Play (152 commits since May 2026): push, QR check-in, OTA." },
  { bg: "#777bb4", shadow: "#4f5b93", color: "#fff",    img: "/IMG/PHP-logo.png",        title: "PHP",             desc: "REST API cho app chạy thật (JWT, phân quyền, chống brute-force, backup tự động) và hầu hết tính năng web TMĐT công ty.", descEn: "REST API behind a live app (JWT auth, roles, brute-force protection, automated backups) and most features of the company's e-commerce site." },
  { bg: "#00a8cc", shadow: "#006b82", color: "#fff",    img: "/IMG/MySQL-Photoroom.png", title: "MySQL",           desc: "Thiết kế lược đồ cơ sở dữ liệu vận hành thật, migration, đối soát kỳ doanh thu trùng và tối ưu chỉ mục.", descEn: "Relational schemas in live use, migrations, duplicate-period revenue checks, and index tuning." },
  { bg: "#24b47e", shadow: "#15734f", color: "#fff",    img: "",                         title: "Supabase",        desc: "PostgreSQL RLS, tác giả supabase-rls-check (phát hiện 8 nhóm lỗi cấu hình catalog, CI PG15, 52 test) và pgTAP.", descEn: "PostgreSQL RLS, author of supabase-rls-check (flags 8 catalog misconfiguration types, PG15 CI, 52 tests), and pgTAP." },
  { bg: "#ffeb3b", shadow: "#bfa500", color: "#000",    img: "/IMG/JavaScript.png",      title: "JavaScript",      desc: "Chrome Extension Manifest V3 tự động hoá Angular/PrimeNG, Electron desktop app, Google Apps Script và PWA.", descEn: "Manifest V3 Chrome Extensions automating Angular/PrimeNG portals, Electron apps, Google Apps Script, and PWAs." },
  { bg: "#7f52ff", shadow: "#5433b0", color: "#fff",    img: "",                         title: "Kotlin",          desc: "Ngôn ngữ chính cho Android native: app widget Lịch IUH, GiuThongBao và mã tiêm smali cho Ghi chú Mod.", descEn: "Primary native Android language: Lich IUH widgets, push keep-alive utility, and smali-injected mods." },
  { bg: "#2aa06a", shadow: "#186a45", color: "#fff",    img: "",                         title: "Android",         desc: "Jetpack Glance widget, WorkManager đồng bộ nền, ghim chứng chỉ TLS tuỳ chỉnh và dịch ngược APK.", descEn: "Jetpack Glance widgets, WorkManager background sync, custom TLS cert pinning, and APK reverse engineering." },
  { bg: "#43b02a", shadow: "#2b731b", color: "#fff",    img: "",                         title: "Selenium",        desc: "Tự động đăng nhập trang quản trị, cập nhật giá hàng loạt và đối soát đơn hàng xuất ra Excel.", descEn: "Automated admin logins, validated batch price updates, and order reconciliation exports to Excel." },
  { bg: "#1a1a1a", shadow: "#000000", color: "#fff",    img: "",                         title: "Three.js",        desc: "Dựng cảnh 3D WebGL thời gian thực: lưới neon isometric, hiệu ứng UnrealBloom và mô phỏng vật lý.", descEn: "Real-time WebGL scenes: isometric neon grids, UnrealBloom post-processing, and 3D AI simulations." },
  { bg: "#ff6f00", shadow: "#b34e00", color: "#fff",    img: "",                         title: "TensorFlow",      desc: "Mạng nơ-ron CNN/MLP (99.14% MNIST), chỉnh tư thế tập bằng MediaPipe Pose và phân loại ảnh trên trình duyệt.", descEn: "CNN/MLP pipelines (99.14% MNIST), real-time MediaPipe Pose coaching, and in-browser TF.js classifiers." },
  { bg: "#007acc", shadow: "#005187", color: "#fff",    img: "/IMG/C++.png",             title: "C / C++",         desc: "Nhân dẫn đường C++17 chính xác từng bit, firmware màn hình HUD ESP32 qua BLE và mod Windhawk Windows 11.", descEn: "Bit-exact C++17 turn-by-turn navigation core, ESP32 BLE HUD firmware, and native Windows 11 C++ mods." },
  { bg: "#e76f51", shadow: "#a73e25", color: "#fff",    img: "/IMG/Java.jpg",            title: "Java",            desc: "Nền tảng lập trình hướng đối tượng trên JVM và kiến trúc hệ thống Android.", descEn: "Object-oriented backend foundations on the JVM and Android platform internals." },
  { bg: "#f4511e", shadow: "#b02600", color: "#fff",    img: "/IMG/Git.png",             title: "Git",             desc: "Quản lý lịch sử phiên bản chặt chẽ (152 commit trên app Madalena từ 05/2026) và phân nhánh đa nền tảng.", descEn: "Clean version history (152 commits on the Madalena app since May 2026) and multi-platform release branching." },
  { bg: "#33353f", shadow: "#1a1b21", color: "#fff",    img: "/IMG/GitHub.png",          title: "GitHub",          desc: "Kho mã nguồn mở công khai (gồm supabase-rls-check MIT) kèm CI PostgreSQL 15, kiểm thử tự động và tài liệu rõ ràng.", descEn: "Public open-source repositories (including MIT supabase-rls-check) with PostgreSQL 15 CI and automated tests." },
  { bg: "#00a2ff", shadow: "#006bb3", color: "#fff",    img: "/IMG/Visual_Studio_Code.png", title: "VS Code",      desc: "Môi trường phát triển tốc độ cao tối ưu cho Python, TypeScript, Docker và điều phối agent CLI.", descEn: "High-velocity development environment tuned for Python, TypeScript, and parallel CLI agent workflows." },
  { bg: "#e08260", shadow: "#a64f31", color: "#fff",    img: "/IMG/Claude.png",          title: "Claude",          desc: "Dùng Claude Code hằng ngày: chạy nhiều agent song song theo đặc tả viết sẵn, tự viết skill & MCP server, Structured Outputs.", descEn: "Claude Code daily for spec-driven parallel agents, custom skills & MCP servers, plus Anthropic Structured Outputs." },
  { bg: "#4c75f2", shadow: "#2143b3", color: "#fff",    img: "/IMG/Gemini.png",          title: "Gemini",          desc: "Dùng Gemini CLI hằng ngày kiểm kết quả bằng test; tích hợp Gemini API đọc ảnh hoá đơn (OCR) trong app di động.", descEn: "Gemini CLI daily in test-verified agent workflows, plus multimodal Gemini API receipt OCR in mobile apps." },
] as const;

// Tỉ trọng sử dụng kỹ năng (biểu đồ tròn) — gom theo nhóm sản xuất thực tế, tổng = 100.
export const CHART_DATA = [
  { name: "Security",               pct: 18, color: "#F87171" },
  { name: "AI Agents & MCP",        pct: 16, color: "#FBBF24" },
  { name: "Python & FastAPI",       pct: 18, color: "#60A5FA" },
  { name: "Backend & Databases",    pct: 14, color: "#818CF8" },
  { name: "Mobile (Expo / Kotlin)", pct: 12, color: "#A78BFA" },
  { name: "TypeScript & React",     pct: 10, color: "#67E8F9" },
  { name: "Scraping & Automation",  pct: 7,  color: "#34D399" },
  { name: "LLM / RAG & ML",         pct: 5,  color: "#FB923C" },
];

// Ánh xạ title của keycap → tên mục trong biểu đồ (hover phím thì lát tương ứng bật ra).
export const TITLE_TO_CHART: Record<string, string> = {
  "Security": "Security",
  "Supabase": "Security",
  "AI Agents": "AI Agents & MCP",
  "MCP": "AI Agents & MCP",
  "Claude": "AI Agents & MCP",
  "Gemini": "AI Agents & MCP",
  "Python": "Python & FastAPI",
  "FastAPI": "Python & FastAPI",
  "Playwright": "Scraping & Automation",
  "Selenium": "Scraping & Automation",
  "n8n": "Scraping & Automation",
  "TypeScript": "TypeScript & React",
  "JavaScript": "TypeScript & React",
  "React": "TypeScript & React",
  "Three.js": "TypeScript & React",
  "Expo": "Mobile (Expo / Kotlin)",
  "Kotlin": "Mobile (Expo / Kotlin)",
  "Android": "Mobile (Expo / Kotlin)",
  "Cloudflare": "Backend & Databases",
  "PHP": "Backend & Databases",
  "MySQL": "Backend & Databases",
  "OpenAI API": "LLM / RAG & ML",
  "TensorFlow": "LLM / RAG & ML",
};

function DonutChart({
  activeKeycapTitle,
  chartData,
  titleToChart,
}: {
  activeKeycapTitle: string | null;
  chartData: any[];
  titleToChart: Record<string, string>;
}) {
  const R       = 86;
  const EXPLODE = 10;     // số px để đẩy segment active ra ngoài
  const GAP_RAD = 0.018;  // khoảng hở nhỏ giữa các segment (≈1°)

  const activeChartName = activeKeycapTitle ? (titleToChart[activeKeycapTitle] ?? null) : null;
  const activeData      = chartData.find(d => d.name === activeChartName) ?? null;
  const total           = chartData.reduce((s, d) => s + d.pct, 0);

  // Tạo các segment path được tô màu, bắt đầu từ đỉnh (-π/2)
  let cumAngle = -Math.PI / 2;
  const segments = chartData.map(d => {
    const sweep      = total > 0 ? (d.pct / total) * 2 * Math.PI : 0;
    const startAngle = cumAngle + GAP_RAD / 2;
    const endAngle   = cumAngle + sweep - GAP_RAD / 2;
    const midAngle   = cumAngle + sweep / 2;
    cumAngle += sweep;

    // Toạ độ điểm đầu/cuối cung trên đường tròn bán kính R (gốc 0,0 là tâm)
    const x1 = R * Math.cos(startAngle);
    const y1 = R * Math.sin(startAngle);
    const x2 = R * Math.cos(endAngle);
    const y2 = R * Math.sin(endAngle);
    // largeArc=1 khi cung > 180° để SVG vẽ đúng phần cung lớn thay vì cung nhỏ
    const largeArc = sweep - GAP_RAD > Math.PI ? 1 : 0;

    // Path hình quạt: M tâm → L điểm đầu → A vẽ cung (sweep=1: chiều kim đồng hồ) tới điểm cuối → Z đóng về tâm
    const path = `M 0 0 L ${x1.toFixed(3)} ${y1.toFixed(3)} A ${R} ${R} 0 ${largeArc} 1 ${x2.toFixed(3)} ${y2.toFixed(3)} Z`;

    return { ...d, path, midAngle };
  });

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: "18px",
    }}>
      <svg
        viewBox="-100 -100 200 200"
        width="220" height="220"
        style={{ overflow: "visible" }}
      >
        {segments.map(seg => {
          const isActive  = seg.name === activeChartName;
          const hasActive = activeChartName !== null;
          // Đẩy segment active ra ngoài theo hướng góc giữa (explode): dịch EXPLODE px dọc vector đơn vị (cos,sin) của midAngle
          const tx = isActive ? EXPLODE * Math.cos(seg.midAngle) : 0;
          const ty = isActive ? EXPLODE * Math.sin(seg.midAngle) : 0;

          return (
            <path
              key={seg.name}
              d={seg.path}
              fill={seg.color}
              opacity={hasActive && !isActive ? 0.30 : 1}
              transform={`translate(${tx.toFixed(3)}, ${ty.toFixed(3)})`}
              style={{
                transition:
                  "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), " +
                  "opacity 0.25s ease, filter 0.25s ease",
                filter: isActive
                  ? `drop-shadow(0 0 10px ${seg.color}) drop-shadow(0 0 3px ${seg.color})`
                  : "none",
              }}
            />
          );
        })}

        {/* Nhãn ở giữa */}
        {activeData ? (
          <text
            textAnchor="middle" dominantBaseline="central"
            fill="#ffffff" fontSize="26" fontWeight="900"
            style={{ fontFamily: "'Be Vietnam Pro', sans-serif", pointerEvents: "none" }}
          >
            {activeData.pct}%
          </text>
        ) : (
          <text
            textAnchor="middle" dominantBaseline="central"
            fill="rgba(255,255,255,0.15)" fontSize="10" fontWeight="600"
            letterSpacing="2"
            style={{ pointerEvents: "none" }}
          >
            SKILLS
          </text>
        )}
      </svg>

      {/* Nhãn bên dưới biểu đồ */}
      <div style={{
        minHeight: "48px",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "4px",
      }}>
        {activeData ? (
          <>
            <span style={{
              fontSize: "1.3rem", fontWeight: 800, color: activeData.color,
              letterSpacing: "-0.3px", transition: "color 0.2s",
            }}>
              {activeData.name}
            </span>
            <span style={{
              fontSize: "0.85rem", color: "rgba(255,255,255,0.45)",
              fontWeight: 600, letterSpacing: "0.1em",
            }}>
              {activeData.pct}% of stack
            </span>
          </>
        ) : (
          <span style={{
            fontSize: "0.8rem", color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.15em", fontWeight: 600,
          }}>
            HOVER A KEY
          </span>
        )}
      </div>
    </div>
  );
}

function ExtrudedText({
  text,
  depth,
  step,
  containerStyle,
  frontStyle,
  sideColor,
}: {
  text: string;
  depth: number;
  step: number;
  containerStyle?: React.CSSProperties;
  frontStyle?: React.CSSProperties;
  sideColor?: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        transformStyle: "preserve-3d",
        width: "100%",
        ...containerStyle,
      }}
    >
      {/* Dựng chữ 3D: xếp chồng `depth` lớp text lùi dần theo trục Z để tạo độ dày (extrude) */}
      {Array.from({ length: depth }, (_, idx) => {
        const i = depth - idx;       // vẽ từ lớp sâu nhất ra trước để lớp gần mặt nằm trên cùng
        const t = i / depth;         // tỉ lệ độ sâu 0..1: càng sâu càng tối
        const light = Math.round(58 - t * 28); // độ sáng HSL giảm dần theo độ sâu (tạo khối)
        const brightness = 1 - t * 0.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              display: "block",
              width: "100%",
              margin: 0,
              whiteSpace: "pre-wrap",
              color: sideColor || `hsl(222,9%,${light}%)`,
              filter: `brightness(${brightness})`,
              transform: `translateZ(${-i * step}px)`, // mỗi lớp lùi thêm `step` px theo Z
              userSelect: "none",
              ...(i === depth ? { textShadow: "3px 4px 12px rgba(0,0,0,0.5)" } : {}), // chỉ lớp sâu nhất đổ bóng nền
            }}
          >
            {text}
          </div>
        );
      })}
      <div
        style={{
          display: "block",
          width: "100%",
          margin: 0,
          whiteSpace: "pre-wrap",
          ...frontStyle,
        }}
      >
        {text}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const { t, pick } = useLang();
  const [mounted, setMounted]         = useState(false);
  const [typedText, setTypedText]     = useState("");
  const [infoTitle, setInfoTitle]     = useState("");
  const [infoDesc,  setInfoDesc]      = useState("");
  const [panelVisible, setPanelVisible] = useState(false);
  const [activeKey, setActiveKey]     = useState<any | null>(null);
  // Tiêu đề đang active của BIỂU ĐỒ TRÒN — chỉ đổi khi hover phím thuộc nhóm chính,
  // hover phím khác sẽ giữ nguyên (mục gần nhất).
  const [chartTitle, setChartTitle]   = useState<string | null>(null);
  const [idlePressedKeys, setIdlePressedKeys] = useState<Set<string>>(new Set());
  // 'idle' | 'exiting' | 'entering' (nghỉ | đang thoát | đang vào)
  const [phase, setPhase]             = useState<"idle"|"exiting"|"entering">("idle");

  // Các text layout động và mảng dữ liệu từ localStorage (null = dùng mặc định song ngữ VI/EN)
  const [customSub, setCustomSub] = useState<string | null>(null);
  const [customTitle1, setCustomTitle1] = useState<string | null>(null);
  const [customTitle2, setCustomTitle2] = useState<string | null>(null);
  const [customTypewriter, setCustomTypewriter] = useState<string | null>(null);
  const [customDesc, setCustomDesc] = useState<string | null>(null);

  const subText =
    customSub ||
    t(
      "Dùng trong sản phẩm chạy thật — kiểm tra bằng test mỗi ngày",
      "Used in production apps & security reviews, verified by tests"
    );
  const title1 = customTitle1 || t("Hệ kỹ năng", "Engineering");
  const title2 = customTitle2 || t("thực chiến", "stack");
  const typewriterText =
    customTypewriter ||
    t(
      "App trên App Store & Google Play • supabase-rls-check • 5 Apify Actor",
      "App Store & Google Play app • supabase-rls-check • 5 Apify Actors"
    );
  const descText =
    customDesc ||
    t(
      "Từ rà soát bảo mật Supabase/Postgres RLS, app React Native (iOS & Android), Cloudflare Workers + D1 đến tự động hoá Python — rê chuột lên từng phím để xem dự án thực tế.",
      "From Supabase/Postgres RLS security checks, React Native apps (iOS & Android), and Cloudflare Workers + D1 to Python automation — hover any keycap to see where I used it."
    );
  const displayInfoDesc = activeKey ? pick(activeKey, "desc") : infoDesc;
  
  // Khởi tạo bằng chính giá trị mặc định (không phải mảng rỗng) để HTML do server dựng
  // đã có sẵn tên kỹ năng — trước đây trang này trả về khung trống, Google và công cụ
  // quét CV không đọc được gì. useEffect bên dưới vẫn ghi đè bằng bản admin đã lưu.
  // Server và lần render đầu ở client dùng chung dữ liệu này nên không lệch hydrate.
  const [keycaps, setKeycaps] = useState<any[]>(() => KEYCAPS.map(k => ({ ...k })));
  const [chartData, setChartData] = useState<any[]>(() => CHART_DATA.map(c => ({ ...c })));
  const [titleToChart, setTitleToChart] = useState<Record<string, string>>(() => ({ ...TITLE_TO_CHART }));

  const infoPanelRef    = useRef<HTMLDivElement>(null);
  const currentTitleRef = useRef<string | null>(null);
  const pendingKeyRef   = useRef<any | null>(null);
  const phaseTimerRef   = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cổng cho Animation A: true sau 2s không có chuyển động chuột ở bất cứ đâu
  const idleActiveRef = useRef(false);
  const idleTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Dừng ngay trạng thái idle và xóa các phím đang nhấn
  const stopIdle = () => {
    idleActiveRef.current = false;
    setIdlePressedKeys(new Set());
  };

  useEffect(() => {
    setMounted(true);

    // Tải cấu hình từ localStorage ở phía client (chỉ ghi đè khi người dùng đã lưu qua /admin)
    const storedSub = localStorage.getItem("skills_sub");
    if (storedSub) setCustomSub(storedSub);

    const storedTitle1 = localStorage.getItem("skills_title_1");
    if (storedTitle1) setCustomTitle1(storedTitle1);

    const storedTitle2 = localStorage.getItem("skills_title_2");
    if (storedTitle2) setCustomTitle2(storedTitle2);

    const storedTypewriter = localStorage.getItem("skills_typewriter");
    if (storedTypewriter) setCustomTypewriter(storedTypewriter);

    const storedDesc = localStorage.getItem("skills_desc");
    if (storedDesc) setCustomDesc(storedDesc);

    const storedKeycaps = localStorage.getItem("skills_keycaps");
    if (storedKeycaps) {
      try {
        setKeycaps(JSON.parse(storedKeycaps));
      } catch (e) {
        console.error("Failed to parse skills_keycaps", e);
        setKeycaps([...KEYCAPS]);
      }
    } else {
      setKeycaps([...KEYCAPS]);
    }

    const storedChart = localStorage.getItem("skills_chart_data");
    if (storedChart) {
      try {
        setChartData(JSON.parse(storedChart));
      } catch (e) {
        console.error("Failed to parse skills_chart_data", e);
        setChartData([...CHART_DATA]);
      }
    } else {
      setChartData([...CHART_DATA]);
    }

    const storedMap = localStorage.getItem("skills_title_to_chart");
    if (storedMap) {
      try {
        setTitleToChart(JSON.parse(storedMap));
      } catch (e) {
        console.error("Failed to parse skills_title_to_chart", e);
        setTitleToChart({ ...TITLE_TO_CHART });
      }
    } else {
      setTitleToChart({ ...TITLE_TO_CHART });
    }

    return () => {
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      if (idleTimerRef.current)  clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Hiệu ứng đánh máy (typewriter)
  useEffect(() => {
    if (!mounted || !typewriterText) return;
    setTypedText("");
    let i = 0;
    let charTimer: ReturnType<typeof setTimeout>;
    // Đệ quy qua setTimeout: mỗi 38ms thêm 1 ký tự cho tới hết chuỗi (tốc độ gõ)
    const typeNext = () => {
      if (i < typewriterText.length) {
        setTypedText(typewriterText.slice(0, i + 1));
        i++;
        charTimer = setTimeout(typeNext, 38);
      }
    };
    const timer = setTimeout(typeNext, 700);
    return () => {
      clearTimeout(timer);
      clearTimeout(charTimer);
    };
  }, [mounted, typewriterText]);

  // Nhấn phím ngẫu nhiên khi idle — chỉ kích hoạt sau 2s không có chuyển động chuột ở bất cứ đâu
  useEffect(() => {
    if (!mounted || keycaps.length === 0) return;
    let pressTimer:   ReturnType<typeof setTimeout>;
    let releaseTimer: ReturnType<typeof setTimeout>;

    // Bất kỳ chuyển động chuột nào cũng reset bộ đếm ngược 2s
    const onMouseMove = () => {
      idleActiveRef.current = false;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        idleActiveRef.current = true;
      }, 2000);
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    onMouseMove(); // khởi động bộ đếm ngược 2s ban đầu khi mount

    const scheduleNextPress = () => {
      const delay = 500 + Math.random() * 700; // khoảng nghỉ ngẫu nhiên 0.5–1.2s giữa hai lần gõ
      pressTimer = setTimeout(() => {
        if (idleActiveRef.current && keycaps.length > 0) {
          const shuffled = [...keycaps].sort(() => Math.random() - 0.5); // trộn ngẫu nhiên để chọn phím
          const count = Math.random() < 0.25 ? 2 : 1; // 25% cơ hội nhấn 2 phím cùng lúc, còn lại 1 phím
          const titles = new Set(shuffled.slice(0, count).map(k => k.title));
          setIdlePressedKeys(titles);
          // Nhả phím sau 100–250ms để mô phỏng một cú gõ ngắn
          releaseTimer = setTimeout(() => setIdlePressedKeys(new Set()), 100 + Math.random() * 150);
        }
        scheduleNextPress();
      }, delay);
    };
    scheduleNextPress();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      clearTimeout(pressTimer);
      clearTimeout(releaseTimer);
    };
  }, [mounted, keycaps]);

  // Máy trạng thái: khi phase thay đổi sẽ điều khiển transition
  useEffect(() => {
    if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    if (phase === "exiting") {
      // Sau khi slide-out hoàn tất, cập nhật nội dung và vào
      phaseTimerRef.current = setTimeout(() => {
        const key = pendingKeyRef.current;
        if (key) {
          setInfoTitle(key.title);
          setInfoDesc(pick(key, "desc"));
          setActiveKey(key);
        }
        setPhase("entering");
      }, 180); // khớp với thời lượng slide-out
    } else if (phase === "entering") {
      // Sau khi slide-in hoàn tất, chuyển về idle
      phaseTimerRef.current = setTimeout(() => {
        setPhase("idle");
      }, 220); // khớp với thời lượng slide-in
    }
  }, [phase]);

  const showInfo = (key: any) => {
    if (key.title === currentTitleRef.current) return;
    currentTitleRef.current = key.title;
    pendingKeyRef.current = key;

    // Nếu là lần hiển thị đầu tiên, bỏ qua slide-out, vào thẳng entering
    if (!infoTitle) {
      setInfoTitle(key.title);
      setInfoDesc(pick(key, "desc"));
      setActiveKey(key);
      setPhase("entering");
    } else {
      setPhase("exiting");
    }
  };

  const panelClass =
    phase === "exiting"  ? "skills-3d-slide-out" :
    phase === "entering" ? "skills-3d-slide-in"  : "";

  const onKeycapEnter = (key: any) => {
    stopIdle(); // dừng idle ngay lập tức khi có bất kỳ tương tác nào
    showInfo(key);
    // Chỉ cập nhật biểu đồ tròn khi phím thuộc nhóm chính; còn lại giữ nguyên mục gần nhất
    if (titleToChart[key.title]) setChartTitle(key.title);
    setPanelVisible(true);
    window.dispatchEvent(new CustomEvent("cursorHoverEnter"));
  };

  const onKeycapLeave = () => {
    // listener mousemove tự động xử lý bộ đếm ngược 2s
    window.dispatchEvent(new CustomEvent("cursorHoverLeave"));
  };

  return (
    <>

      {/* Thanh điều hướng */}
      <NavBar className="mix-blend-difference" />


      <section
        className="skills-section"
        style={{
          perspective: "1000px",
          background: "#06070d url(/IMG/background.jpeg) no-repeat center center fixed",
          backgroundSize: "cover",
        }}
      >
        {/* Lớp phủ tech pulse (tương đương body::before) */}
        <div
          style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(circle, rgba(0,162,255,0.05) 0%, rgba(240,147,43,0.02) 60%, transparent 100%)",
            pointerEvents: "none", zIndex: 1,
            animation: "skillsTechPulse 8s ease-in-out infinite alternate",
          }}
        />

        {/* Phần bên trái */}
        {mounted && (
          <div
            style={{
              position: "absolute", top: "24%", left: "54px",
              zIndex: 90, maxWidth: "470px",
              animation: "skillsFadeUp 0.9s ease 0.5s both",
            }}
          >
            <p style={{
              color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 700,
              margin: "0 0 10px 0", letterSpacing: "2px", textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}>
              {subText}
            </p>

            <h2 style={{
              fontSize: "clamp(2.6rem, 4.2vw, 3.8rem)", fontWeight: 900,
              margin: "0 0 18px 0", lineHeight: 1.05, letterSpacing: "-1px",
            }}>
              <span style={{ color: "#00d8ff", textShadow: "0 0 35px rgba(0,216,255,0.6), 0 4px 15px rgba(0,0,0,0.6)" }}>
                {title1}
              </span>{" "}
              <span style={{ color: "#ff9f43", textShadow: "0 0 35px rgba(255,159,67,0.6), 0 4px 15px rgba(0,0,0,0.6)" }}>
                {title2}
              </span>
            </h2>

            <p style={{
              color: "rgba(255,255,255,0.85)", fontSize: "1.05rem", fontWeight: 600,
              lineHeight: 1.55, margin: 0, minHeight: "1.6em",
              textShadow: "0 2px 12px rgba(0,0,0,0.7)",
            }}>
              {typedText}
              <span style={{
                display: "inline-block", width: "3px", height: "1.1em",
                backgroundColor: "#00d8ff", marginLeft: "6px", verticalAlign: "middle",
                boxShadow: "0 0 10px #00d8ff",
                animation: "skillsBlinkCursor 0.7s infinite",
              }} />
            </p>

            <p style={{
              color: "rgba(255,255,255,0.52)", fontSize: "0.85rem", fontWeight: 400,
              lineHeight: 1.55, marginTop: "14px", marginBottom: "14px",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
            }}>
              {descText}
            </p>

            {/* Hai nhóm trọng tâm mới (Security & AI agents) hiển thị trực tiếp song ngữ */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{
                padding: "9px 12px",
                borderRadius: "10px",
                background: "rgba(15, 18, 28, 0.72)",
                border: "1px solid rgba(248, 113, 113, 0.28)",
                fontSize: "0.76rem",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
              }}>
                <strong style={{ color: "#fca5a5", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.7rem" }}>
                  Security ·{" "}
                </strong>
                {t(
                  "Postgres Row Level Security & rà soát policy, kiểm tra SECURITY DEFINER/grant, xác minh webhook HMAC/Stripe, JWT auth, chống brute-force.",
                  "Postgres Row Level Security & policy review, SECURITY DEFINER/grant checks, HMAC/Stripe webhook verification, JWT auth, brute-force protection."
                )}
              </div>

              <div style={{
                padding: "9px 12px",
                borderRadius: "10px",
                background: "rgba(15, 18, 28, 0.72)",
                border: "1px solid rgba(251, 191, 36, 0.28)",
                fontSize: "0.76rem",
                lineHeight: 1.45,
                color: "rgba(255,255,255,0.78)",
              }}>
                <strong style={{ color: "#fcd34d", letterSpacing: "0.04em", textTransform: "uppercase", fontSize: "0.7rem" }}>
                  AI agents ·{" "}
                </strong>
                {t(
                  "Claude Code, Codex CLI, Gemini CLI hằng ngày: chạy nhiều agent song song theo đặc tả viết sẵn, tự viết skill, tự làm MCP server, tự động hoá trình duyệt, kiểm kết quả agent bằng test.",
                  "Claude Code, Codex CLI, Gemini CLI daily: parallel agents from written specs, custom skills, custom MCP servers, browser automation, agent output checked by tests."
                )}
              </div>
            </div>
          </div>
        )}

        {/* Phần bên phải — Biểu đồ tròn */}
        {mounted && (
          <div style={{
            position: "absolute", right: "60px", top: "50%",
            transform: "translateY(-50%)",
            zIndex: 90,
            animation: "skillsFadeUp 0.9s ease 0.8s both",
          }}>
            <DonutChart
              activeKeycapTitle={chartTitle}
              chartData={chartData}
              titleToChart={titleToChart}
            />
          </div>
        )}

        {/* Cảnh 3D chính */}
        <div
          style={{
            position: "relative", display: "flex", flexDirection: "column",
            alignItems: "center", transformStyle: "preserve-3d",
            transform: "rotateX(46deg) rotateY(0deg) rotateZ(-36deg)",
            paddingTop: "220px", zIndex: 2,
          }}
        >
          {/* Panel thông tin: toàn bộ khối preserve-3d trượt vào/ra như một khối thống nhất */}
          <div
            ref={infoPanelRef}
            className={panelClass}
            style={{
              position: "absolute", top: "26px", left: 0,
              width: "460px", height: "172px",
              transformStyle: "preserve-3d", transform: "translateZ(60px)",
              pointerEvents: "none",
              visibility: panelVisible ? "visible" : "hidden",
              display: "flex", flexDirection: "column",
              justifyContent: "center", alignItems: "flex-start",
              textAlign: "left",
            }}
          >
            <div style={{ transform: "rotateZ(0deg)", transformStyle: "preserve-3d" }}>
              <ExtrudedText
                text={infoTitle}
                depth={12}
                step={0.8}
                containerStyle={{
                  fontSize: "4.6rem", fontWeight: 900, margin: "0 0 20px 0",
                  lineHeight: 1.06, textTransform: "uppercase",
                }}
                frontStyle={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
                sideColor="#ffffff"
              />
              <ExtrudedText
                text={displayInfoDesc}
                depth={6}
                step={0.6}
                containerStyle={{
                  fontSize: "1.32rem", fontWeight: 800,
                  lineHeight: 1.28, letterSpacing: "-0.3px", maxWidth: "460px",
                }}
                frontStyle={{ color: "#f2f2f2", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                sideColor="#ffffff"
              />
            </div>
          </div>

          {/* Vỏ bàn phím — keyboard-float điều khiển hoạt ảnh trôi nổi khi idle */}
          <div
            className="keyboard-float"
            style={{
              width: "max-content",
              backgroundColor: "rgba(26,27,35,0.85)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "24px", padding: "22px",
              transformStyle: "preserve-3d",
              boxShadow: "-1px 1px 0px #0e0f14, -2px 2px 0px #0e0f14, -3px 3px 0px #0e0f14, -15px 20px 35px rgba(0,0,0,0.9)",
              display: "grid",
              gridTemplateColumns: `repeat(${KEYS_PER_ROW}, ${KEY_SIZE}px)`,
              gap: `${KEY_GAP}px`,
            }}
          >
            {keycaps.map((key) => (
              <div
                key={key.title}
                className={`keycap-3d${idlePressedKeys.has(key.title) ? " keycap-idle-press" : ""}`}
                onMouseEnter={() => onKeycapEnter(key)}
                onMouseLeave={onKeycapLeave}
                style={{
                  position: "relative", width: `${KEY_SIZE}px`, height: `${KEY_SIZE}px`,
                  borderRadius: "13px",
                  backgroundColor: key.bg, color: key.color,
                  transformStyle: "preserve-3d",
                  boxShadow: `-1px 1px 0px ${key.shadow}, -2px 2px 0px ${key.shadow}, -3px 3px 1px ${key.shadow}, -4px 4px 1px rgba(0,0,0,0.3), -5px 5px 1px rgba(0,0,0,0.4), -8px 10px 15px rgba(0,0,0,0.5)`,
                  display: "flex", justifyContent: "center", alignItems: "center",
                }}
              >
                {/* Hiệu ứng bóng loáng */}
                <div style={{
                  position: "absolute", top: "2px", left: "2px", right: "2px", bottom: "2px",
                  borderRadius: "9px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.15) 100%)",
                  pointerEvents: "none",
                }} />
                {key.img ? (
                  <img
                    src={key.img}
                    alt={key.title}
                    draggable={false}
                    style={{
                      width: `${KEY_ICON}px`, height: `${KEY_ICON}px`, objectFit: "contain",
                      transform: "translateZ(3px)",
                      filter: "drop-shadow(-1px 2px 2px rgba(0,0,0,0.4))",
                      pointerEvents: "none",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                {/* Text dự phòng hiển thị khi ảnh lỗi hoặc bị bỏ qua */}
                <span
                  style={{
                    position: "absolute",
                    transform: "translateZ(3px)",
                    // Phím nhỏ lại nên chữ dự phòng cũng phải nhỏ theo, không thì
                    // các tên dài ("Cloudflare", "TensorFlow", "Playwright") tràn ra ngoài phím.
                    fontSize: "0.54rem",
                    fontWeight: 800,
                    textAlign: "center",
                    padding: "0 3px",
                    lineHeight: 1.05,
                    wordBreak: "break-word",
                    pointerEvents: "none",
                    opacity: key.img ? 0 : 1, // Chỉ hiển thị khi không có ảnh hoặc ảnh bị ẩn
                  }}
                  className="keycap-label-fallback"
                >
                  {key.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
