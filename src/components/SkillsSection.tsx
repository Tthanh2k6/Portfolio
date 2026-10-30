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
// 24 phím xếp 6 CỘT × 4 HÀNG. Trước đây là 4 cột × 6 hàng: bàn phím cao ~614px, cộng
// với phần chữ phía trên thì tràn khỏi màn hình -> trang bị cuộn, mà hoạt ảnh trôi nổi
// (keyboard-float) lại đẩy chiều cao lên xuống liên tục nên thanh cuộn hiện/ẩn theo,
// gây giật. Xếp ngang lại còn ~346px nên vừa một màn hình, hết giật.
// Đổi số cột thì nhớ giữ tổng số phím chia hết cho số cột để hàng cuối không lẻ.
const KEYS_PER_ROW = 6;
const KEY_SIZE     = 62;   // cạnh một phím (px)
const KEY_GAP      = 14;   // khoảng cách giữa các phím (px)
const KEY_ICON     = 36;   // cạnh logo trong phím (px)

// Bàn phím kỹ năng — 24 phím.
//
// Thứ tự = thứ tự hiển thị: kỹ năng có sản phẩm thật chứng minh đứng trước.
// Phím nào chưa có logo trong public/IMG thì để img: "" — keycap sẽ tự hiện chữ
// (xem span.keycap-label-fallback ở phần render). Có logo thì thả file vào
// public/IMG/ rồi điền đường dẫn vào đây.
export const KEYCAPS = [
  { bg: "#3875a6", shadow: "#204969", color: "#fff",    img: "/IMG/Python.png",          title: "Python",          desc: "Asyncio, httpx, xử lý dữ liệu, 6 Actor thương mại trên Apify Store và các pipeline AI.", descEn: "Asyncio, httpx, ETL pipelines, 6 commercial Apify Store Actors, and ML/AI systems." },
  { bg: "#2d8a4e", shadow: "#1b5730", color: "#fff",    img: "",                         title: "Playwright",      desc: "Tự động hoá trình duyệt vượt anti-bot, điều khiển Chrome qua CDP và dò Hidden JSON API.", descEn: "Anti-bot browser automation, Chrome CDP remote debugging, and hidden JSON API sniffing." },
  { bg: "#009688", shadow: "#00635a", color: "#fff",    img: "",                         title: "FastAPI",         desc: "Backend bất đồng bộ hiệu năng cao, cổng OpenAI Structured Outputs, kiểm soát backpressure & license server.", descEn: "High-concurrency async microservices, OpenAI Structured Output routers, and credit licence servers." },
  { bg: "#ea4b71", shadow: "#9c2b47", color: "#fff",    img: "",                         title: "n8n",             desc: "Điều phối luồng tự động hoá doanh nghiệp, webhook Make.com/Clay, đồng bộ CRM & hàng đợi thử lại.", descEn: "Production workflow orchestration, Make.com/Clay webhooks, CRM sync, and idempotent retry queues." },
  { bg: "#10a37f", shadow: "#0a664f", color: "#fff",    img: "/IMG/chatgpt-logo-png_seeklogo-465219-Photoroom.png", title: "OpenAI API", desc: "Ép kiểu JSON Schema tuyệt đối (0% lệch cấu trúc), Hybrid RAG (BM25 + Vector RRF) và gọi hàm.", descEn: "Zero-drift Strict JSON Schema Structured Outputs, Hybrid BM25 + Vector RRF RAG, and tool calling." },
  { bg: "#3178c6", shadow: "#1f4e80", color: "#fff",    img: "",                         title: "TypeScript",      desc: "Ứng dụng full-stack kiểm kiểu chặt: app di động Expo Router, portfolio TanStack Start SSR và AI Lab.", descEn: "Strictly typed full-stack apps: the Google Play Expo app, this TanStack Start SSR site, and AI Arena." },
  { bg: "#2c3e50", shadow: "#1a252f", color: "#00d8ff", img: "/IMG/React.png",           title: "React",           desc: "Giao diện web tương tác cao với React 19, custom hooks, SSR, TailwindCSS và CMS phía client.", descEn: "Interactive interfaces built with React 19, custom hooks, SSR, TailwindCSS, and client-side CMS." },
  { bg: "#eef1f7", shadow: "#b9c0cf", color: "#1a1b23", img: "/IMG/unnamed-Photoroom.png", title: "Expo",          desc: "Ứng dụng React Native chạy thật trên Google Play (com.madalena.app): thông báo đẩy, quét QR, cập nhật OTA.", descEn: "Shipped React Native loyalty app on Google Play (com.madalena.app): push, QR scan, and OTA updates." },
  { bg: "#777bb4", shadow: "#4f5b93", color: "#fff",    img: "/IMG/PHP-logo.png",        title: "PHP",             desc: "REST API sản xuất thật (JWT HS256, phân quyền DB, chống brute-force, cron) và tính năng web TMĐT.", descEn: "Production REST API (JWT HS256, DB-backed RBAC, brute-force protection, cron) and live storefront work." },
  { bg: "#00a8cc", shadow: "#006b82", color: "#fff",    img: "/IMG/MySQL-Photoroom.png", title: "MySQL",           desc: "Thiết kế lược đồ cơ sở dữ liệu vận hành thật, migration, truy vấn hạng doanh thu và tối ưu chỉ mục.", descEn: "Production relational schemas, migrations, cumulative revenue tier queries, and index tuning." },
  { bg: "#24b47e", shadow: "#15734f", color: "#fff",    img: "",                         title: "Supabase",        desc: "PostgreSQL phân quyền từng dòng (RLS), kiểm thử bảo mật tự động bằng pgTAP và đồng bộ đám mây.", descEn: "PostgreSQL Row-Level Security (RLS), automated pgTAP policy auditing, and real-time cloud sync." },
  { bg: "#ffeb3b", shadow: "#bfa500", color: "#000",    img: "/IMG/JavaScript.png",      title: "JavaScript",      desc: "Chrome Extension Manifest V3 tự động hoá Angular/PrimeNG, Google Apps Script và ứng dụng PWA.", descEn: "Manifest V3 Chrome Extensions automating Angular/PrimeNG portals, Google Apps Script, and PWAs." },
  { bg: "#7f52ff", shadow: "#5433b0", color: "#fff",    img: "",                         title: "Kotlin",          desc: "Ngôn ngữ chính cho Android native: app widget Lịch IUH, GiuThongBao và mã tiêm smali cho Ghi chú Mod.", descEn: "Primary native Android language: Lich IUH widgets, push keep-alive utility, and smali-injected mods." },
  { bg: "#2aa06a", shadow: "#186a45", color: "#fff",    img: "",                         title: "Android",         desc: "Jetpack Glance widget, WorkManager đồng bộ nền, ghim chứng chỉ TLS tuỳ chỉnh và dịch ngược APK.", descEn: "Jetpack Glance widgets, WorkManager background sync, custom TLS cert pinning, and APK reverse engineering." },
  { bg: "#43b02a", shadow: "#2b731b", color: "#fff",    img: "",                         title: "Selenium",        desc: "Tự động đăng nhập trang quản trị, cập nhật giá hàng loạt và đối soát đơn hàng xuất ra Excel.", descEn: "Automated admin logins, validated batch price updates, and order reconciliation exports to Excel." },
  { bg: "#1a1a1a", shadow: "#000000", color: "#fff",    img: "",                         title: "Three.js",        desc: "Dựng cảnh 3D WebGL thời gian thực: lưới neon isometric, hiệu ứng UnrealBloom và mô phỏng vật lý.", descEn: "Real-time WebGL scenes: isometric neon grids, UnrealBloom post-processing, and 3D AI simulations." },
  { bg: "#ff6f00", shadow: "#b34e00", color: "#fff",    img: "",                         title: "TensorFlow",      desc: "Mạng nơ-ron CNN/MLP (99.14% MNIST), chỉnh tư thế tập bằng MediaPipe Pose và phân loại ảnh trên trình duyệt.", descEn: "CNN/MLP pipelines (99.14% MNIST), real-time MediaPipe Pose coaching, and in-browser TF.js classifiers." },
  { bg: "#007acc", shadow: "#005187", color: "#fff",    img: "/IMG/C++.png",             title: "C / C++",         desc: "Nhân dẫn đường C++17 chính xác từng bit, firmware màn hình HUD ESP32 qua BLE và mod Windhawk Windows 11.", descEn: "Bit-exact C++17 turn-by-turn navigation core, ESP32 BLE HUD firmware, and native Windows 11 C++ mods." },
  { bg: "#e76f51", shadow: "#a73e25", color: "#fff",    img: "/IMG/Java.jpg",            title: "Java",            desc: "Nền tảng lập trình hướng đối tượng trên JVM và kiến trúc hệ thống Android.", descEn: "Object-oriented backend foundations on the JVM and Android platform internals." },
  { bg: "#f4511e", shadow: "#b02600", color: "#fff",    img: "/IMG/Git.png",             title: "Git",             desc: "Quản lý lịch sử phiên bản chặt chẽ, phân nhánh rõ ràng trên các codebase đa nền tảng.", descEn: "Clean version history, disciplined branching, and multi-repository release workflows." },
  { bg: "#33353f", shadow: "#1a1b21", color: "#fff",    img: "/IMG/GitHub.png",          title: "GitHub",          desc: "20 kho mã nguồn mở công khai kèm tài liệu kiến trúc, kiểm thử tự động và benchmark tái lập được.", descEn: "20 public engineering repositories with architecture docs, automated tests, and reproducible benchmarks." },
  { bg: "#00a2ff", shadow: "#006bb3", color: "#fff",    img: "/IMG/Visual_Studio_Code.png", title: "VS Code",      desc: "Môi trường phát triển tốc độ cao tối ưu cho Python, TypeScript, Docker và gỡ lỗi từ xa.", descEn: "High-velocity development cockpit tuned for async Python, TypeScript, and remote debugging." },
  { bg: "#e08260", shadow: "#a64f31", color: "#fff",    img: "/IMG/Claude.png",          title: "Claude",          desc: "Tích hợp Anthropic Structured Outputs và đối tác suy luận sâu khi kiểm toán kiến trúc & refactor.", descEn: "Anthropic Structured Outputs integration and deep architectural reasoning for complex refactors." },
  { bg: "#4c75f2", shadow: "#2143b3", color: "#fff",    img: "/IMG/Gemini.png",          title: "Gemini",          desc: "Tích hợp Gemini API đọc ảnh hoá đơn (OCR) và trợ lý ngôn ngữ tự nhiên trong ứng dụng di động thực tế.", descEn: "Multimodal Gemini API integration for receipt OCR and natural-language assistants in mobile apps." },
] as const;

// Tỉ trọng sử dụng kỹ năng (biểu đồ tròn) — gom theo nhóm sản xuất thực tế, tổng = 100.
export const CHART_DATA = [
  { name: "Python & FastAPI",       pct: 26, color: "#60A5FA" },
  { name: "Scraping & Automation",  pct: 20, color: "#34D399" },
  { name: "TypeScript & React",     pct: 18, color: "#67E8F9" },
  { name: "Mobile (Expo / Kotlin)", pct: 14, color: "#A78BFA" },
  { name: "Backend & Databases",    pct: 12, color: "#818CF8" },
  { name: "LLM / RAG & ML",         pct: 10, color: "#FB923C" },
];

// Ánh xạ title của keycap → tên mục trong biểu đồ (hover phím thì lát tương ứng bật ra).
export const TITLE_TO_CHART: Record<string, string> = {
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
  "PHP": "Backend & Databases",
  "MySQL": "Backend & Databases",
  "Supabase": "Backend & Databases",
  "OpenAI API": "LLM / RAG & ML",
  "Claude": "LLM / RAG & ML",
  "Gemini": "LLM / RAG & ML",
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

  // Các text layout động và mảng dữ liệu từ localStorage
  const [subText, setSubText] = useState("Battle-tested in production, refined every day");
  const [title1, setTitle1] = useState("Engineering");
  const [title2, setTitle2] = useState("stack");
  const [typewriterText, setTypewriterText] = useState(
    "Proven across Google Play, 6 Apify Store Actors & live client systems"
  );
  const [descText, setDescText] = useState(
    "From <50MB RAM async Python scrapers and zero-drift OpenAI/n8n pipelines to shipped React Native apps and PHP/PostgreSQL backends — hover any keycap to inspect real production usage."
  );
  
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

    // Tải cấu hình từ localStorage ở phía client
    const storedSub = localStorage.getItem("skills_sub");
    setSubText(storedSub || "Battle-tested in production, refined every day");

    const storedTitle1 = localStorage.getItem("skills_title_1");
    setTitle1(storedTitle1 || "Engineering");

    const storedTitle2 = localStorage.getItem("skills_title_2");
    setTitle2(storedTitle2 || "stack");

    const storedTypewriter = localStorage.getItem("skills_typewriter");
    setTypewriterText(
      storedTypewriter || "Proven across Google Play, 6 Apify Store Actors & live client systems"
    );

    const storedDesc = localStorage.getItem("skills_desc");
    setDescText(
      storedDesc ||
        "From <50MB RAM async Python scrapers and zero-drift OpenAI/n8n pipelines to shipped React Native apps and PHP/PostgreSQL backends — hover any keycap to inspect real production usage."
    );

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
    let i = 0;
    // Đệ quy qua setTimeout: mỗi 45ms thêm 1 ký tự cho tới hết chuỗi (tốc độ gõ)
    const typeNext = () => {
      if (i < typewriterText.length) {
        setTypedText(typewriterText.slice(0, i + 1));
        i++;
        setTimeout(typeNext, 45);
      }
    };
    const timer = setTimeout(typeNext, 1200); // delay 1.2s trước khi bắt đầu gõ (chờ hiệu ứng fade-in)
    return () => clearTimeout(timer);
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
              position: "absolute", top: "36%", left: "54px",
              zIndex: 90, maxWidth: "520px",
              animation: "skillsFadeUp 0.9s ease 0.5s both",
            }}
          >
            <p style={{
              color: "rgba(255,255,255,0.6)", fontSize: "0.8rem", fontWeight: 700,
              margin: "0 0 12px 0", letterSpacing: "2px", textTransform: "uppercase",
              textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            }}>
              {subText}
            </p>

            <h2 style={{
              fontSize: "clamp(2.8rem, 4.5vw, 4rem)", fontWeight: 900,
              margin: "0 0 22px 0", lineHeight: 1.05, letterSpacing: "-1px",
            }}>
              <span style={{ color: "#00d8ff", textShadow: "0 0 35px rgba(0,216,255,0.6), 0 4px 15px rgba(0,0,0,0.6)" }}>
                {title1}
              </span>{" "}
              <span style={{ color: "#ff9f43", textShadow: "0 0 35px rgba(255,159,67,0.6), 0 4px 15px rgba(0,0,0,0.6)" }}>
                {title2}
              </span>
            </h2>

            <p style={{
              color: "rgba(255,255,255,0.85)", fontSize: "1.15rem", fontWeight: 600,
              lineHeight: 1.6, margin: 0, minHeight: "1.6em",
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
              color: "rgba(255,255,255,0.45)", fontSize: "0.88rem", fontWeight: 400,
              lineHeight: 1.6, marginTop: "18px",
              textShadow: "0 2px 10px rgba(0,0,0,0.5)",
              animation: "skillsFadeInText 1.2s ease 3s both",
            }}>
              {descText}
            </p>
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
              position: "absolute", top: "40px", left: 0,
              width: "422px", height: "160px",
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
                  fontSize: "5rem", fontWeight: 900, margin: "0 0 26px 0",
                  lineHeight: 1.08, textTransform: "uppercase",
                }}
                frontStyle={{ color: "#ffffff", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
                sideColor="#ffffff"
              />
              <ExtrudedText
                text={infoDesc}
                depth={6}
                step={0.6}
                containerStyle={{
                  fontSize: "1.5rem", fontWeight: 800,
                  lineHeight: 1.3, letterSpacing: "-0.3px", maxWidth: "430px",
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
                    // các tên dài ("TensorFlow", "Playwright") tràn ra ngoài phím.
                    fontSize: "0.58rem",
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
