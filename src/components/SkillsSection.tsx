import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { NavBar } from "./NavBar";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Skills", to: "/skills" },
  { label: "Information", to: "/information" },
  { label: "Project", to: "/project" },
  { label: "Contact", to: "/contact" },
];

const KEYCAPS = [
  { bg: "#ff5722", shadow: "#b73209", color: "#fff",    img: "/IMG/HTML.png",            title: "HTML5",           desc: "Cấu trúc web ngữ nghĩa, chuẩn truy cập & SEO." },
  { bg: "#2196f3", shadow: "#0d6aad", color: "#fff",    img: "/IMG/CSS.png",             title: "CSS3",            desc: "Giao diện responsive với Flexbox, Grid và animation mượt mà." },
  { bg: "#ffeb3b", shadow: "#bfa500", color: "#000",    img: "/IMG/JavaScript.png",      title: "JavaScript / TS", desc: "Frontend tương tác, API Node.js và app di động." },
  { bg: "#007acc", shadow: "#005187", color: "#fff",    img: "/IMG/C++.png",             title: "C / C++",         desc: "Xử lý hiệu năng cao, quản lý bộ nhớ thủ công, đệ quy tối ưu." },
  { bg: "#e76f51", shadow: "#a73e25", color: "#fff",    img: "/IMG/Java.jpg",            title: "Java",            desc: "Backend doanh nghiệp và ứng dụng Android trên nền JVM." },
  { bg: "#777bb4", shadow: "#4f5b93", color: "#fff",    img: "/IMG/PHP-logo.png",        title: "PHP",             desc: "Phát triển tính năng cho web công ty: routing, xử lý form & bảo mật trên nền MVC." },
  { bg: "#3875a6", shadow: "#204969", color: "#fff",    img: "/IMG/Python.png",          title: "Python",          desc: "Tự động hóa, API bất đồng bộ và mọi thử nghiệm ML/AI." },
  { bg: "#00a8cc", shadow: "#006b82", color: "#fff",    img: "/IMG/MySQL-Photoroom.png", title: "MySQL",           desc: "Cơ sở dữ liệu quan hệ cho web công ty: truy vấn, lược đồ và tối ưu." },
  { bg: "#2c3e50", shadow: "#1a252f", color: "#00d8ff", img: "/IMG/React.png",           title: "React",           desc: "Giao diện hiện đại: component, hook, RSC, Tailwind." },
  { bg: "#f4511e", shadow: "#b02600", color: "#fff",    img: "/IMG/Git.png",             title: "Git",             desc: "Quản lý phiên bản chi tiết cho codebase phức tạp." },
  { bg: "#33353f", shadow: "#1a1b21", color: "#fff",    img: "/IMG/GitHub.png",          title: "GitHub",          desc: "Quản lý phiên bản, nhánh và cộng tác nhóm." },
  { bg: "#00a2ff", shadow: "#006bb3", color: "#fff",    img: "/IMG/Visual_Studio_Code.png", title: "VS Code",      desc: "Buồng lái phát triển nhanh, tối ưu cho tự động hóa." },
  { bg: "#10a37f", shadow: "#0a664f", color: "#fff",    img: "/IMG/chatgpt-logo-png_seeklogo-465219-Photoroom.png", title: "ChatGPT", desc: "Công cụ AI hỗ trợ lập trình cặp & tự động hóa công việc hằng ngày." },
  { bg: "#e08260", shadow: "#a64f31", color: "#fff",    img: "/IMG/Claude.png",          title: "Claude",          desc: "Công cụ AI hỗ trợ: suy luận sâu, kiểm chứng và refactor code hóc búa." },
  { bg: "#4c75f2", shadow: "#2143b3", color: "#fff",    img: "/IMG/Gemini.png",          title: "Gemini",          desc: "Công cụ AI hỗ trợ suy luận đa phương thức trong quy trình code." },
  { bg: "#eef1f7", shadow: "#b9c0cf", color: "#1a1b23", img: "/IMG/unnamed-Photoroom.png", title: "Expo",          desc: "Build, OTA update & phát hành app React Native đa nền tảng." },
] as const;

// Phần trăm sử dụng kỹ năng (hiển thị trong biểu đồ tròn) — chỉ vài mục chính
const CHART_DATA = [
  { name: "HTML/CSS",   pct: 22, color: "#FB923C" },
  { name: "JavaScript", pct: 16, color: "#FCD34D" },
  { name: "Python",     pct: 16, color: "#60A5FA" },
  { name: "React",      pct: 12, color: "#67E8F9" },
  { name: "C++",        pct: 11, color: "#C084FC" },
  { name: "PHP",        pct:  8, color: "#818CF8" },
  { name: "MySQL",      pct:  8, color: "#34D399" },
  { name: "Git",        pct:  7, color: "#F87171" },
];

// Ánh xạ title của keycap → tên mục trong biểu đồ. Chỉ các phím chính được map;
// các phím khác (Java, GitHub, VS Code, ChatGPT, Claude, Gemini, Expo) không có ở đây
// nên hover chúng sẽ KHÔNG đổi biểu đồ (giữ mục gần nhất).
const TITLE_TO_CHART: Record<string, string> = {
  "HTML5": "HTML/CSS",
  "CSS3": "HTML/CSS",
  "JavaScript / TS": "JavaScript",
  "C / C++": "C++",
  "PHP": "PHP",
  "Python": "Python",
  "MySQL": "MySQL",
  "React": "React",
  "Git": "Git",
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
  const [subText, setSubText] = useState("Always improving myself day by day");
  const [title1, setTitle1] = useState("Current");
  const [title2, setTitle2] = useState("skills");
  const [typewriterText, setTypewriterText] = useState("Experience gained through projects and school");
  const [descText, setDescText] = useState("Transforming complex development challenges into smooth, fluid user experiences. Focusing on optimized performance, responsive layouts, and scalable codebases.");
  
  const [keycaps, setKeycaps] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [titleToChart, setTitleToChart] = useState<Record<string, string>>({});

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
    setSubText(storedSub || "Always improving myself day by day");

    const storedTitle1 = localStorage.getItem("skills_title_1");
    setTitle1(storedTitle1 || "Current");

    const storedTitle2 = localStorage.getItem("skills_title_2");
    setTitle2(storedTitle2 || "skills");

    const storedTypewriter = localStorage.getItem("skills_typewriter");
    setTypewriterText(storedTypewriter || "Experience gained through projects and school");

    const storedDesc = localStorage.getItem("skills_desc");
    setDescText(storedDesc || "Transforming complex development challenges into smooth, fluid user experiences. Focusing on optimized performance, responsive layouts, and scalable codebases.");

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
          setInfoDesc(key.desc);
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
      setInfoDesc(key.desc);
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
              borderRadius: "24px", padding: "28px",
              transformStyle: "preserve-3d",
              boxShadow: "-1px 1px 0px #0e0f14, -2px 2px 0px #0e0f14, -3px 3px 0px #0e0f14, -15px 20px 35px rgba(0,0,0,0.9)",
              display: "grid", gridTemplateColumns: "repeat(4, 78px)", gap: "18px",
            }}
          >
            {keycaps.map((key) => (
              <div
                key={key.title}
                className={`keycap-3d${idlePressedKeys.has(key.title) ? " keycap-idle-press" : ""}`}
                onMouseEnter={() => onKeycapEnter(key)}
                onMouseLeave={onKeycapLeave}
                style={{
                  position: "relative", width: "78px", height: "78px",
                  borderRadius: "16px",
                  backgroundColor: key.bg, color: key.color,
                  transformStyle: "preserve-3d",
                  boxShadow: `-1px 1px 0px ${key.shadow}, -2px 2px 0px ${key.shadow}, -3px 3px 1px ${key.shadow}, -4px 4px 1px rgba(0,0,0,0.3), -5px 5px 1px rgba(0,0,0,0.4), -8px 10px 15px rgba(0,0,0,0.5)`,
                  display: "flex", justifyContent: "center", alignItems: "center",
                }}
              >
                {/* Hiệu ứng bóng loáng */}
                <div style={{
                  position: "absolute", top: "2px", left: "2px", right: "2px", bottom: "2px",
                  borderRadius: "11px",
                  background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(0,0,0,0.15) 100%)",
                  pointerEvents: "none",
                }} />
                {key.img ? (
                  <img
                    src={key.img}
                    alt={key.title}
                    draggable={false}
                    style={{
                      width: "46px", height: "46px", objectFit: "contain",
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
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    textAlign: "center",
                    padding: "0 4px",
                    lineHeight: 1.1,
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
