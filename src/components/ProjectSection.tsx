import { useEffect, useRef, useState } from "react";
import { NavBar } from "./NavBar";

// Danh sách dự án mẫu
const projects = [
  {
    id: "neoswap",
    category: "WEB3 & FINTECH",
    shortName: "NEXUS SWAP",
    title: "NEXUS | Swap & Exchange",
    desc: "Hệ thống giao dịch phi tập trung tối ưu hóa trượt giá và thanh khoản. Cung cấp bảng điều khiển trực quan hiển thị hoạt động giao dịch của các ví Web3.",
    image: "/IMG/neoswap.png",
    role: "Lead Frontend Developer",
    client: "Nexus Finance Corp.",
    year: "2025",
    yearRole: "2025 • Lead Frontend"
  },
  {
    id: "cognitive",
    category: "AI & COGNITION",
    shortName: "COGNITIVE AI",
    title: "COGNITIVE | Neural Thought Tree",
    desc: "Hệ thống AI trực quan hóa các tầng suy luận và gỡ lỗi logic cho mô hình ngôn ngữ lớn (LLM). Cung cấp giao diện tương tác dạng cây tư duy thời gian thực.",
    image: "/IMG/cognitive.png",
    role: "Fullstack AI Engineer",
    client: "Cognitive Intelligence Labs",
    year: "2026",
    yearRole: "2026 • AI Engineer"
  },
  {
    id: "vortex",
    category: "3D & MOTION DESIGN",
    shortName: "VORTEX MOTION",
    title: "VORTEX | 3D Motion Library",
    desc: "Thư viện hoạt ảnh mô phỏng động lực học chất lỏng 3D bóng bẩy. Thiết kế hoàn hảo cho các màn hình trình diễn tương tác hiệu năng cao trên trình duyệt.",
    image: "/IMG/vortex.png",
    role: "3D Generalist & Designer",
    client: "Vortex Media Studios",
    year: "2024",
    yearRole: "2024 • 3D Generalist"
  },
  {
    id: "decentralized",
    category: "BLOCKCHAIN & DID",
    shortName: "IDENTITY SDK",
    title: "DID | Cryptographic Identity",
    desc: "Thư viện xác thực danh tính phi tập trung dựa trên mật mã học blockchain, hỗ trợ ký khóa số, ví Web3 và cơ chế xác thực không mật khẩu FIDO2.",
    image: "/IMG/decentralized.png",
    role: "Cryptographic Engineer",
    client: "Identity Decentralized Labs",
    year: "2025",
    yearRole: "2025 • Crypto Eng"
  },
  {
    id: "aura",
    category: "UX/UI WELLNESS",
    shortName: "AURA SYSTEM",
    title: "AURA | Digital Wellness Platform",
    desc: "Thiết kế ứng dụng di động toàn diện hỗ trợ thiền định, lối sống chánh niệm và theo dõi hành trình sức khỏe. Tập trung tối đa vào UX tĩnh lặng và giao diện tối giản.",
    image: "/IMG/aura.png",
    role: "Lead UX/UI Designer",
    client: "Aura Health Inc.",
    year: "2024",
    yearRole: "2024 • Lead UX/UI"
  }
];

export function ProjectSection() {
  const [projectList, setProjectList] = useState<any[]>(projects);
  const [activeIndex, setActiveIndex] = useState(12);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNoTransitions, setIsNoTransitions] = useState(false);
  const [isFastTransitions, setIsFastTransitions] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(12);
  const isTransitioningRef = useRef(false);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state refs to avoid stale closure issues in window events/timeouts
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Load dynamic projects from localStorage on client side mount
  useEffect(() => {
    const stored = localStorage.getItem("project_list");
    let list = [];
    if (stored) {
      try {
        list = JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse project_list", e);
      }
    }
    if (!list || list.length === 0) {
      list = [...projects];
    }

    list = list.map((item: any) => {
      if (!item.yearRole) {
        item.yearRole = `${item.year} • ${item.role}`;
      }
      return item;
    });

    setProjectList(list);

    const N = list.length;
    const initialIndex = Math.floor(5 / 2) * N + Math.floor(N / 2);
    setActiveIndex(initialIndex);
    activeIndexRef.current = initialIndex;
  }, []);

  // Center calculation effect
  const calculateTranslation = () => {
    if (!trackRef.current) return;
    const activeCard = trackRef.current.querySelector(
      `[data-index="${activeIndex}"]`
    ) as HTMLDivElement;
    if (!activeCard) return;

    const viewportCenter = window.innerWidth / 2;
    const activeCardCenterOffset =
      activeCard.offsetLeft + activeCard.offsetWidth / 2;
    const tx = viewportCenter - activeCardCenterOffset;
    setTranslateX(tx);
  };

  useEffect(() => {
    calculateTranslation();
    window.addEventListener("resize", calculateTranslation);
    return () => window.removeEventListener("resize", calculateTranslation);
  }, [activeIndex, projectList]);

  // Autoplay delay setup
  const AUTOPLAY_DELAY = 3000;

  const resetAutoplayTimer = () => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }

    // Pause autoplay completely if hover active card
    if (trackRef.current) {
      const activeCard = trackRef.current.querySelector(
        ".project-card.active"
      ) as HTMLDivElement;
      if (activeCard && activeCard.matches(":hover")) {
        return;
      }
    }

    autoplayTimeoutRef.current = setTimeout(() => {
      const currentIdx = activeIndexRef.current;
      if (projectList.length === 0) return;
      const nextLogical = (currentIdx + 1) % projectList.length;
      goToProject(nextLogical);
    }, AUTOPLAY_DELAY);
  };

  const getShortestPath = (fromIndex: number, targetLogical: number) => {
    const len = projectList.length;
    if (len === 0) return fromIndex;
    const currentLogical = fromIndex % len;
    let diff = targetLogical - currentLogical;
    if (diff > 2) diff -= len;
    if (diff < -2) diff += len;
    return fromIndex + diff;
  };

  const goToProject = (targetLogical: number) => {
    if (isTransitioningRef.current) return;

    const currentIdx = activeIndexRef.current;
    const closestTarget = getShortestPath(currentIdx, targetLogical);
    const N = projectList.length;
    if (N === 0) return;

    if (closestTarget >= 2 * N && closestTarget <= 3 * N - 1) {
      setIsTransitioning(true);
      setActiveIndex(closestTarget);
    } else {
      setIsTransitioning(true);
      const safeTarget = 2 * N + targetLogical;
      const start = safeTarget - (closestTarget - currentIdx);

      // Jump instantly to start with no transition
      setIsNoTransitions(true);
      setActiveIndex(start);

      // Flush synchronous layout jump state before resetting flag
      setTimeout(() => {
        setIsNoTransitions(false);

        // Run smooth transition to safe target
        setTimeout(() => {
          setActiveIndex(safeTarget);
        }, 20);
      }, 35);
    }
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.target === e.currentTarget && e.propertyName === "transform") {
      setIsTransitioning(false);
      setIsFastTransitions(false);
    }
  };

  // Card click triggers
  const handleCardClick = (idx: number) => {
    if (isTransitioningRef.current) return;
    if (projectList.length === 0) return;
    const clickedLogical = idx % projectList.length;
    setIsFastTransitions(true);
    goToProject(clickedLogical);
    resetAutoplayTimer();
  };

  // Mouse cursor hover signals
  const triggerCursorHover = (enter: boolean) => {
    const eventName = enter ? "cursorHoverEnter" : "cursorHoverLeave";
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const handleCardMouseEnter = (idx: number) => {
    triggerCursorHover(true);
    if (idx === activeIndex) {
      if (autoplayTimeoutRef.current) {
        clearTimeout(autoplayTimeoutRef.current);
      }
    }
  };

  const handleCardMouseLeave = () => {
    triggerCursorHover(false);
    resetAutoplayTimer();
  };

  // Autoplay timers & listeners
  useEffect(() => {
    resetAutoplayTimer();
    return () => {
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    };
  }, [activeIndex, projectList]);

  useEffect(() => {
    const handleGlobalInteraction = () => {
      resetAutoplayTimer();
    };

    window.addEventListener("mousemove", handleGlobalInteraction);
    window.addEventListener("mousedown", handleGlobalInteraction);
    window.addEventListener("keydown", handleGlobalInteraction);
    window.addEventListener("wheel", handleGlobalInteraction);
    document.addEventListener("mouseleave", handleGlobalInteraction);
    document.addEventListener("mouseenter", handleGlobalInteraction);

    return () => {
      window.removeEventListener("mousemove", handleGlobalInteraction);
      window.removeEventListener("mousedown", handleGlobalInteraction);
      window.removeEventListener("keydown", handleGlobalInteraction);
      window.removeEventListener("wheel", handleGlobalInteraction);
      document.removeEventListener("mouseleave", handleGlobalInteraction);
      document.removeEventListener("mouseenter", handleGlobalInteraction);
    };
  }, [projectList]);

  // Multiplied list rendering (5 sets = 25 cards)
  const repeatCount = 5;
  const cardsData = Array.from(
    { length: repeatCount * projectList.length },
    (_, idx) => {
      const proj = projectList[idx % projectList.length];
      return { ...proj, globalIdx: idx };
    }
  );

  const logicalProjIndex = activeIndex % projectList.length;

  return (
    <>
      {/* Scope encapsulation style block */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .project-section-wrapper {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #06070d;
          background-image: url('/IMG/Background.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          overflow: hidden;
          font-family: 'Be Vietnam Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #ffffff;
          user-select: none; -webkit-user-select: none;
          -webkit-user-drag: none;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        /* Nền mờ ảo đồng bộ */
        .project-section-wrapper::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(circle, rgba(0,162,255,0.04) 0%, rgba(240,147,43,0.01) 60%, transparent 100%);
          pointer-events: none; z-index: 1;
          animation: techPulse 8s ease-in-out infinite alternate;
        }
        @keyframes techPulse { 0%{opacity:.5} 100%{opacity:1} }

        /* ===== SCROLL HINT ===== */
        .scroll-hint {
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 100px;
          padding: 9px 20px;
          color: rgba(255,255,255,0.6);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.3px;
          backdrop-filter: blur(6px);
          background: rgba(255,255,255,0.04);
        }

        /* ===== MAIN GALLERY TITLE ===== */
        .gallery-title-wrapper {
          text-align: center;
          margin-top: 120px;
          z-index: 2;
          opacity: 0;
          animation: fadeUp 0.9s ease 0.3s forwards;
        }

        .gallery-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.6rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          justify-content: center;
          gap: 14px;
        }

        .gallery-title .word-project {
          color: #ffffff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .gallery-title .word-showcase {
          background: linear-gradient(90deg, #00a2ff 0%, #f0932b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 2px 8px rgba(0, 162, 255, 0.15));
        }

        /* ===== FILMSTRIP CONTAINER ===== */
        .filmstrip-container {
          position: relative;
          width: 100%;
          height: 580px;
          z-index: 2;
          overflow: visible;
          display: flex;
          align-items: center;
          opacity: 0;
          animation: fadeIn 1.2s ease 0.4s forwards;
        }

        /* Cuộn phim răng đục chạy nền */
        .filmstrip-bg-ribbon {
          position: absolute;
          left: 0; right: 0;
          top: 50%;
          transform: translateY(-50%);
          height: 260px;
          background: rgba(18, 20, 27, 0.4);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1;
          pointer-events: none;
        }

        .filmstrip-bg-ribbon::before, .filmstrip-bg-ribbon::after {
          content: '';
          position: absolute;
          left: 0;
          width: 100%;
          height: 10px;
          background-image: repeating-linear-gradient(to right, rgba(255, 255, 255, 0.05) 0px, rgba(255, 255, 255, 0.05) 8px, transparent 8px, transparent 18px);
        }
        .filmstrip-bg-ribbon::before { top: 6px; }
        .filmstrip-bg-ribbon::after { bottom: 6px; }

        /* Moving track */
        .filmstrip-track {
          display: flex;
          align-items: center;
          height: 100%;
          will-change: transform;
          transition: transform 0.65s cubic-bezier(0.25, 1, 0.5, 1);
          z-index: 2;
        }

        /* ===== CLASS KHÓA TRANSITION ĐỂ JUMP TRÁNH NHẤP NHÁY VÀ GIẬT HÌNH ===== */
        .no-transitions, .no-transitions * {
          transition: none !important;
          animation: none !important;
        }

        /* ===== TRƯỢT NHANH KHI CLICK CARD HOẶC INDICATOR ===== */
        .fast-transitions, .fast-transitions * {
          transition-duration: 0.28s !important;
        }

        /* ===== PROJECT CARD ===== */
        .project-card {
          position: relative;
          width: 360px;
          height: 220px;
          margin: 0 35px;
          border-radius: 20px;
          overflow: hidden;
          flex-shrink: 0;
          background: rgba(18, 19, 26, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.06);
          opacity: 0.25;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding: 14px;
          transition: height 0.65s cubic-bezier(0.25, 1, 0.5, 1), 
                      border-color 0.5s ease, 
                      box-shadow 0.5s ease,
                      opacity 0.6s ease;
        }

        /* Thẻ lân cận */
        .project-card.neighbor {
          opacity: 0.65;
          border-color: rgba(255, 255, 255, 0.12);
        }

        /* Thẻ active phình to */
        .project-card.active {
          height: 550px;
          opacity: 1;
          border: 2px solid #ffffff;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8), 0 0 35px rgba(255,255,255,0.08);
          background: #111219;
          z-index: 10;
          padding: 16px;
        }

        /* SHARED IMAGE BOX */
        .card-img-box {
          width: 100%;
          height: 120px;
          border-radius: 12px;
          overflow: hidden;
          background: #000;
          flex-shrink: 0;
          transition: height 0.65s cubic-bezier(0.25, 1, 0.5, 1), border-radius 0.65s ease;
        }

        .project-card.active .card-img-box {
          height: 200px;
          border-radius: 14px;
        }

        /* Image transitions */
        .project-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(1) brightness(0.5);
          transition: filter 0.45s ease, transform 0.6s ease;
        }

        /* Sắc độ thẻ lân cận */
        .project-card.neighbor .project-card-img {
          filter: grayscale(0.6) brightness(0.75);
        }

        /* Sắc độ thẻ active chính giữa */
        .project-card.active .project-card-img {
          filter: grayscale(0) brightness(0.95);
        }

        .project-card:hover .project-card-img {
          transform: scale(1.03);
        }

        /* --- COLLAPSED INFO STYLE --- */
        .info-collapsed {
          display: flex;
          flex-direction: column;
          margin-top: 12px;
          opacity: 1;
          transition: opacity 0.4s ease;
        }

        .project-card.active .info-collapsed {
          opacity: 0;
          height: 0;
          margin: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .collapsed-num {
          font-size: 0.65rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 2px;
        }

        .collapsed-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -0.2px;
        }

        .collapsed-preview-link {
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-top: 10px;
          display: inline-block;
        }

        /* --- EXPANDED INFO STYLE --- */
        .info-expanded {
          display: flex;
          flex-direction: column;
          margin-top: 14px;
          opacity: 0;
          height: 0;
          overflow: hidden;
          transition: opacity 0.5s ease 0.15s, height 0.65s cubic-bezier(0.25, 1, 0.5, 1);
          pointer-events: none;
        }

        .project-card.active .info-expanded {
          opacity: 1;
          height: calc(100% - 214px);
          pointer-events: auto;
        }

        .expanded-title {
          font-size: 1.28rem;
          font-weight: 800;
          color: #ffffff;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
          flex-shrink: 0;
        }

        .expanded-desc {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.5;
          margin: 0 0 12px 0;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex-shrink: 0;
        }

        .expanded-details {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 16px;
          font-size: 0.82rem;
          color: rgba(255, 255, 255, 0.85);
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 12px;
          flex-shrink: 0;
        }

        .detail-row {
          display: flex;
          gap: 8px;
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.4);
          width: 60px;
          font-weight: 500;
        }

        .expanded-btn {
          background: #252e42;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #ffffff;
          text-align: center;
          padding: 12px 0;
          border-radius: 10px;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          text-decoration: none;
          width: 100%;
          transition: all 0.3s ease;
          margin-top: auto; 
        }

        .expanded-btn:hover {
          background: #ffffff;
          color: #000000;
        }

        /* ===== BOTTOM CONTROLS ===== */
        .bottom-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 60px 40px 60px;
          z-index: 2;
          opacity: 0;
          animation: fadeIn 0.9s ease 0.5s forwards;
        }

        /* Slide indicators */
        .indicators-wrapper {
          display: flex;
          gap: 12px;
        }

        .indicator {
          width: 32px;
          height: 3px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 2px;
          transition: background 0.3s ease, width 0.3s ease;
        }

        .indicator.active {
          background: #ffffff;
          width: 48px;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .gallery-title-wrapper { margin-top: 100px; }
          .project-card { width: 320px; }
          .project-card.active { height: 510px; }
          .card-img-box { height: 110px; }
          .project-card.active .card-img-box { height: 180px; }
          .bottom-controls { padding: 0 30px 30px 30px; }
        }
      `}</style>

      <div className="project-section-wrapper">
        {/* Navigation Bar */}
        <NavBar className="mix-blend-difference" />

        {/* Title Block */}
        <div className="gallery-title-wrapper">
          <h1 className="gallery-title">
            <span className="word-project">Project</span>
            <span className="word-showcase">Showcase</span>
          </h1>
        </div>

        {/* Filmstrip Slider */}
        <main className="filmstrip-container" id="filmstripContainer">
          <div className="filmstrip-bg-ribbon" />
          <div
            ref={trackRef}
            className={`filmstrip-track ${
              isNoTransitions ? "no-transitions" : ""
            } ${isFastTransitions ? "fast-transitions" : ""}`}
            style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {cardsData.map((proj) => {
              const idx = proj.globalIdx;
              const isActive = idx === activeIndex;
              const isNeighbor =
                idx === activeIndex - 1 || idx === activeIndex + 1;

              return (
                <div
                  key={idx}
                  className={`project-card ${isActive ? "active" : ""} ${
                    isNeighbor ? "neighbor" : ""
                  }`}
                  data-index={idx}
                  onClick={() => handleCardClick(idx)}
                  onMouseEnter={() => handleCardMouseEnter(idx)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {/* Shared Image Box */}
                  <div className="card-img-box">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className="project-card-img"
                      draggable="false"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.src = `https://placehold.co/600x338/111219/ffffff?text=${encodeURIComponent(
                          proj.shortName
                        )}`;
                      }}
                    />
                  </div>

                  {/* Collapsed Info */}
                  <div className="info-collapsed">
                    <span className="collapsed-num">{proj.category}</span>
                    <h3 className="collapsed-title">{proj.shortName}</h3>
                    <span className="collapsed-preview-link">
                      {proj.yearRole}
                    </span>
                  </div>

                  {/* Expanded Info */}
                  <div className="info-expanded">
                    <h2 className="expanded-title">{proj.title}</h2>
                    <p className="expanded-desc">{proj.desc}</p>
                    <div className="expanded-details">
                      <div className="detail-row">
                        <span className="detail-label">Role:</span>
                        <span>{proj.role}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Client:</span>
                        <span>{proj.client}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Year:</span>
                        <span>{proj.year}</span>
                      </div>
                    </div>
                    <a
                      href="#"
                      className="expanded-btn"
                      onMouseEnter={() => triggerCursorHover(true)}
                      onMouseLeave={() => triggerCursorHover(false)}
                      onClick={(e) => e.preventDefault()}
                    >
                      View Case Study
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer Indicators */}
        <footer className="bottom-controls">
          <div className="indicators-wrapper" id="indicatorsWrapper">
            {projectList.map((proj, idx) => (
              <div
                key={idx}
                className={`indicator ${
                  idx === logicalProjIndex ? "active" : ""
                }`}
                onMouseEnter={() => triggerCursorHover(true)}
                onMouseLeave={() => triggerCursorHover(false)}
                onClick={() => {
                  setIsFastTransitions(true);
                  goToProject(idx);
                  resetAutoplayTimer();
                }}
              />
            ))}
          </div>
        </footer>
      </div>
    </>
  );
}
