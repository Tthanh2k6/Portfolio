import { useEffect, useRef, useState } from "react";
import { NavBar } from "./NavBar";

// Tài khoản GitHub dùng để lấy danh sách dự án
const GITHUB_USER = "Tthanh2k6";

// Ảnh OpenGraph tự sinh của GitHub cho từng repo (card xã hội đẹp, luôn có sẵn)
const ghImage = (repo: string) =>
  `https://opengraph.githubassets.com/1/${GITHUB_USER}/${repo}`;

// Ảnh chụp màn hình thật của từng dự án (đặt trong thư mục public IMG/).
// Được ưu tiên hơn ảnh OpenGraph; nếu thiếu file, <img onError> sẽ tự rơi về ảnh GitHub.
const REPO_IMAGES: Record<string, string> = {
  DiemDanhQR: "/IMG/project-diemdanhqr.jpg",
  AI_Lab: "/IMG/project-ailab.png",
  KNN: "/IMG/project-knn.png",
  Portfolio: "/IMG/project-portfolio.png",
  // Dự án private (không công khai code) — chỉ hiển thị ảnh demo, thả file vào public/IMG/
  AutoTool: "/IMG/project-autotool.png",
  WorkFlowAI: "/IMG/project-workflowai.png",
};
// Ảnh dùng cho card: ưu tiên ảnh chụp local, không có thì dùng ảnh OpenGraph của GitHub
const projectImage = (repo: string) => REPO_IMAGES[repo] || ghImage(repo);

// Ghi đè thông tin (tên, mô tả, vai trò) cho từng repo GitHub.
// Bản fetch GitHub chỉ trả về tên + mô tả thô của repo; map này dùng để hiển thị
// đúng vai trò và mức độ dùng AI trên từng dự án — áp cho cả danh sách tĩnh lẫn bản fetch.
// Lưu ý: key phải trùng TÊN REPO thật trên GitHub (vd AI-ML nằm ở repo "H-c-AI-ML").
const REPO_META: Record<string, any> = {
  DiemDanhQR: {
    desc: "Công cụ điểm danh bằng mã QR: quét QR trên điện thoại, tự ghi vào Google Sheets qua Google Apps Script — chạy dạng PWA, không cần server riêng. Tự phát triển với sự hỗ trợ của AI.",
    role: "JavaScript Developer",
    client: "Dự án cá nhân",
  },
  AI_Lab: {
    desc: "AI Game Arena — ứng dụng Electron cho AI tự học, tiến hóa và thi đấu game thời gian thực (Minimax, MCTS, mạng nơ-ron, giải thuật di truyền). Tự phát triển với sự hỗ trợ của AI.",
    role: "TypeScript Developer",
    client: "Dự án cá nhân",
  },
  KNN: {
    category: "MACHINE LEARNING",
    shortName: "KNN ELBOW",
    title: "KNN | Elbow Method",
    desc: "Bài tập nhóm môn Trí tuệ Nhân tạo: phân cụm K-Means và tối ưu số cụm K bằng phương pháp Elbow (Python / Jupyter). Vai trò Project Manager — quản lý source code và lập trình thuật toán K-Means cho nhóm 9 thành viên.",
    role: "Project Manager",
    client: "Dự án học thuật (nhóm 9 người)",
    yearRole: "2026 • Project Manager",
  },
  Portfolio: {
    desc: "Trang portfolio cá nhân với hero 3D, hoạt ảnh chuyển động và CMS phía client — chính là website này. Tự phát triển với sự hỗ trợ của AI.",
    role: "Frontend Developer",
    client: "Dự án cá nhân",
  },
  // AI-ML nằm ở repo GitHub tên "H-c-AI-ML" — dự án tự làm 100%, không dùng AI.
  "H-c-AI-ML": {
    category: "MACHINE LEARNING",
    shortName: "AI / ML",
    title: "AI-ML | Học Máy & Học Sâu",
    desc: "Tổng hợp bài thực hành Machine Learning & Deep Learning: tiền xử lý dữ liệu, K-Means, Decision Tree, KNN, MLP, CNN và phân loại MNIST (scikit-learn / TensorFlow). Tự code 100%, không dùng AI hỗ trợ.",
    role: "ML / AI Developer",
    client: "Dự án tự học",
    yearRole: "2026 • Machine Learning",
  },
};

// Dự án PRIVATE (tool cá nhân, không công khai mã nguồn).
// Không có repo trên GitHub nên KHÔNG đặt link và phải gộp thủ công vào danh sách —
// bản fetch GitHub bên dưới chỉ trả về repo công khai, sẽ không bao gồm các tool này.
const privateProjects = [
  {
    id: "AutoTool",
    category: "PYTHON • AUTOMATION",
    shortName: "AUTOTOOL",
    title: "AutoTool | Tự động hoá web",
    desc: "Tool desktop (Tkinter + Selenium) tự đăng nhập trang quản trị, cập nhật số liệu sản phẩm hàng loạt và xuất báo cáo Excel — chạy nền đa luồng. Tự phát triển với sự hỗ trợ của AI.",
    image: projectImage("AutoTool"),
    role: "Python Developer",
    client: "Dự án cá nhân (private)",
    year: "2026",
    yearRole: "2026 • Python",
    link: undefined as string | undefined,
  },
  {
    id: "WorkFlowAI",
    category: "PYTHON & AI",
    shortName: "WORKFLOW AI",
    title: "WorkFlow AI | Sản xuất video AI",
    desc: "Tool all-in-one sản xuất video AI theo pipeline: kịch bản → chia cảnh → tạo ảnh/video trên Google Flow (tự động hoá trình duyệt qua Playwright/CDP) → ghép phim. Backend FastAPI. Tự phát triển với sự hỗ trợ của AI.",
    image: projectImage("WorkFlowAI"),
    role: "Python / AI Developer",
    client: "Dự án cá nhân (private)",
    year: "2026",
    yearRole: "2026 • Python & AI",
    link: undefined as string | undefined,
  },
];

// Danh sách dự án tĩnh = dự án private + các repo công khai thật trên GitHub.
// Dùng để hiển thị tức thì khi mở trang và làm phương án dự phòng khi không gọi được API
// (offline / vượt giới hạn request). Bản fetch động bên dưới sẽ ghi đè phần repo công khai.
const publicProjects = [
  {
    id: "DiemDanhQR",
    category: "JAVASCRIPT",
    shortName: "QR ATTENDANCE",
    title: "DiemDanhQR | Điểm danh QR",
    ...REPO_META.DiemDanhQR,
    image: projectImage("DiemDanhQR"),
    year: "2026",
    yearRole: "2026 • JavaScript",
    link: `https://github.com/${GITHUB_USER}/DiemDanhQR`,
  },
  {
    id: "AI_Lab",
    category: "TYPESCRIPT & AI",
    shortName: "AI LAB",
    title: "AI_Lab | Thử nghiệm AI",
    ...REPO_META.AI_Lab,
    image: projectImage("AI_Lab"),
    year: "2026",
    yearRole: "2026 • TypeScript",
    link: `https://github.com/${GITHUB_USER}/AI_Lab`,
  },
  {
    id: "KNN",
    ...REPO_META.KNN,
    image: projectImage("KNN"),
    year: "2026",
    link: `https://github.com/${GITHUB_USER}/KNN`,
  },
  {
    id: "H-c-AI-ML",
    ...REPO_META["H-c-AI-ML"],
    image: projectImage("H-c-AI-ML"),
    year: "2026",
    link: `https://github.com/${GITHUB_USER}/H-c-AI-ML`,
  },
  {
    id: "Portfolio",
    category: "WEB & 3D",
    shortName: "PORTFOLIO",
    title: "Portfolio | Trang cá nhân",
    ...REPO_META.Portfolio,
    image: projectImage("Portfolio"),
    year: "2026",
    yearRole: "2026 • Web & 3D",
    link: `https://github.com/${GITHUB_USER}/Portfolio`,
  },
];

// Danh sách hiển thị mặc định: tool private luôn đứng trước, rồi tới repo công khai.
const projects = [...privateProjects, ...publicProjects];

// Chuyển một repo trả về từ GitHub API sang đúng cấu trúc card dự án
function mapRepoToProject(repo: any) {
  const lang = repo.language || "Code";
  const year = (repo.updated_at || "").slice(0, 4);
  const base = {
    id: repo.name,
    category: (repo.language || "PROJECT").toUpperCase(),
    shortName: repo.name,
    title: repo.name,
    desc: repo.description || "Dự án mã nguồn trên GitHub — bấm để xem chi tiết.",
    image: projectImage(repo.name),
    role: `${lang} Developer`,
    client: "Dự án cá nhân",
    year,
    yearRole: `${year} • ${lang}`,
    link: repo.html_url,
  };
  // Ghi đè bằng thông tin tự soạn (vai trò, mức độ dùng AI...) nếu repo có trong REPO_META
  return { ...base, ...(REPO_META[repo.name] || {}) };
}

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

  // Đồng bộ state refs để tránh lỗi stale closure trong window events/timeouts
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    isTransitioningRef.current = isTransitioning;
  }, [isTransitioning]);

  // Lưới an toàn: nếu đang transition mà sau ~1.2s vẫn chưa nhận được 'transitionend'
  // (vd: tab bị ẩn, transition bị huỷ giữa chừng) thì tự gỡ khoá để không kẹt cứng slider.
  useEffect(() => {
    if (!isTransitioning) return;
    const failSafe = setTimeout(() => {
      setIsTransitioning(false);
      setIsFastTransitions(false);
    }, 1200);
    return () => clearTimeout(failSafe);
  }, [isTransitioning]);

  // Tải danh sách dự án (chỉ chạy phía client). Thứ tự ưu tiên:
  //   1. localStorage "project_list" (do admin chỉnh) — nếu có thì dùng luôn, không gọi API.
  //   2. Hiển thị ngay danh sách tĩnh, rồi fetch repo công khai từ GitHub để cập nhật.
  //   3. Nếu fetch lỗi (offline / vượt giới hạn request) thì giữ nguyên danh sách tĩnh.
  useEffect(() => {
    // Gán danh sách + canh activeIndex về giữa dải nhân bản (5 bộ) để cuộn vòng mượt
    const applyList = (raw: any[]) => {
      const list = raw.map((item: any) =>
        item.yearRole ? item : { ...item, yearRole: `${item.year} • ${item.role}` }
      );
      setProjectList(list);
      const N = list.length;
      // Bộ thứ 3 (floor(5/2)=2 -> 2*N) + phần tử giữa của bộ (floor(N/2)), để dư bộ ở cả 2 phía.
      const initialIndex = Math.floor(5 / 2) * N + Math.floor(N / 2);
      setActiveIndex(initialIndex);
      activeIndexRef.current = initialIndex;
    };

    // 1. Ưu tiên danh sách do admin quản lý
    const stored = localStorage.getItem("project_list");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          applyList(parsed);
          return;
        }
      } catch (e) {
        console.error("Failed to parse project_list", e);
      }
    }

    // 2. Hiển thị ngay danh sách tĩnh (4 repo thật) làm nội dung tức thì + dự phòng
    applyList(projects);

    // 3. Lấy repo công khai mới nhất từ GitHub (tự cập nhật khi thêm repo mới)
    let cancelled = false;
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((repos) => {
        if (cancelled || !Array.isArray(repos)) return;
        // Bỏ các repo fork, chỉ giữ dự án của chính mình
        const mapped = repos.filter((r: any) => !r.fork).map(mapRepoToProject);
        // Luôn giữ dự án private (tool) ở đầu — GitHub API không trả về chúng
        if (mapped.length > 0) applyList([...privateProjects, ...mapped]);
      })
      .catch((err) => console.error("Không lấy được repo GitHub:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  // Effect tính toán căn giữa
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

  // Thiết lập độ trễ autoplay
  const AUTOPLAY_DELAY = 3000;

  const resetAutoplayTimer = () => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }

    // Tạm dừng hoàn toàn autoplay nếu đang hover card active
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

  // Tìm index đích gần nhất theo vòng tròn (modular): từ vị trí hiện tại đi tới logic đích
  // theo hướng ngắn nhất, thay vì luôn đi tiến. Nhờ vậy chuyển từ card cuối -> card đầu
  // sẽ trượt sang phải 1 bước thay vì lùi qua cả danh sách.
  const getShortestPath = (fromIndex: number, targetLogical: number) => {
    const len = projectList.length;
    if (len === 0) return fromIndex;
    const currentLogical = fromIndex % len;
    let diff = targetLogical - currentLogical;
    // Chuẩn hóa diff về khoảng [-len/2, len/2] (ở đây ngưỡng 2 = floor(5/2)) để chọn chiều ngắn nhất:
    // nếu đi tiến quá nửa vòng thì đổi sang đi lùi (và ngược lại).
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

    // Đích trùng vị trí hiện tại (vd: bấm vào chính card active ở giữa) -> không có
    // chuyển động nào -> sự kiện 'transitionend' của transform sẽ KHÔNG bao giờ bắn.
    // Phải thoát sớm, nếu không setIsTransitioning(true) bên dưới sẽ kẹt true mãi mãi
    // và khoá toàn bộ thao tác cuộn/click sau đó.
    if (closestTarget === currentIdx) {
      setIsFastTransitions(false);
      return;
    }

    // Vùng an toàn = bộ nhân bản ở giữa [2*N .. 3*N-1]. Nếu đích gần nhất vẫn nằm
    // trong vùng này thì chỉ cần transition mượt bình thường (còn dư bộ 2 phía nên không lo hết card).
    if (closestTarget >= 2 * N && closestTarget <= 3 * N - 1) {
      setIsTransitioning(true);
      setActiveIndex(closestTarget);
    } else {
      // Đích bị trôi ra ngoài vùng an toàn -> phải "tái định vị" về giữa để còn chỗ cuộn tiếp.
      setIsTransitioning(true);
      // safeTarget: cùng logic đích nhưng đặt trong bộ giữa.
      const safeTarget = 2 * N + targetLogical;
      // start: lùi safeTarget lại đúng quãng đường (closestTarget - currentIdx) cần trượt,
      // để khi trượt từ start -> safeTarget mắt thấy đúng hướng/khoảng cách như đi tới closestTarget.
      const start = safeTarget - (closestTarget - currentIdx);

      // Thủ thuật chống nhấp nháy: nhảy tức thì (tắt transition) về 'start' tương đương,
      // người dùng không thấy vì vị trí hiển thị giống hệt vị trí cũ.
      setIsNoTransitions(true);
      setActiveIndex(start);

      // 35ms: chờ React commit DOM + browser áp layout của bước nhảy (đang tắt transition) xong
      // mới bật lại transition, tránh trình duyệt gộp 2 lần đổi index thành 1 animation giật.
      setTimeout(() => {
        setIsNoTransitions(false);

        // 20ms: thêm 1 frame đệm sau khi bật lại transition rồi mới đổi tới safeTarget,
        // đảm bảo cú trượt cuối chạy mượt thay vì bị nhảy cóc.
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

  // Xử lý khi click vào card
  const handleCardClick = (idx: number) => {
    if (isTransitioningRef.current) return;
    if (projectList.length === 0) return;
    const clickedLogical = idx % projectList.length;
    setIsFastTransitions(true);
    goToProject(clickedLogical);
    resetAutoplayTimer();
  };

  // Tín hiệu hover của con trỏ chuột
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

  // Timers & listeners của autoplay
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

  // Nhân bản danh sách 5 lần (vd 5 dự án -> 25 card) để tạo ảo giác cuộn vô hạn:
  // luôn còn card đệm ở 2 đầu, kết hợp cú nhảy "tái định vị" trong goToProject.
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
      {/* Khối style đóng gói phạm vi */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .project-section-wrapper {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: #06070d;
          background-image: url('/IMG/background.jpeg');
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

        /* ===== GỢI Ý CUỘN ===== */
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

        /* ===== TIÊU ĐỀ GALLERY CHÍNH ===== */
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

        /* ===== CONTAINER CUỘN PHIM ===== */
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

        /* Track di chuyển */
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

        /* ===== CARD DỰ ÁN ===== */
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

        /* KHUNG ẢNH DÙNG CHUNG */
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

        /* Transition của ảnh */
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

        /* Canh phần trên của ảnh (hữu ích cho ảnh dọc như DiemDanhQR -> lộ header app) */
        .project-card-img.fit-top {
          object-position: center top;
        }

        /* Phóng to ảnh có nhiều lề trống (AI_Lab) để nội dung lấp đầy khung, canh phần trên */
        .project-card-img.zoom {
          transform: scale(1.5);
          object-position: center top;
        }
        .project-card:hover .project-card-img.zoom {
          transform: scale(1.55);
        }

        /* --- STYLE THÔNG TIN THU GỌN --- */
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

        /* --- STYLE THÔNG TIN MỞ RỘNG --- */
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

        /* ===== ĐIỀU KHIỂN PHÍA DƯỚI ===== */
        .bottom-controls {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 60px 40px 60px;
          z-index: 2;
          opacity: 0;
          animation: fadeIn 0.9s ease 0.5s forwards;
        }

        /* Indicator slide */
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

        /* Hoạt ảnh */
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
        {/* Thanh điều hướng */}
        <NavBar className="mix-blend-difference" />

        {/* Khối tiêu đề */}
        <div className="gallery-title-wrapper">
          <h1 className="gallery-title">
            <span className="word-project">Project</span>
            <span className="word-showcase">Showcase</span>
          </h1>
        </div>

        {/* Slider cuộn phim */}
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
                  {/* Khung ảnh dùng chung */}
                  <div className="card-img-box">
                    <img
                      src={proj.image}
                      alt={proj.title}
                      className={`project-card-img ${
                        proj.id === "AI_Lab" ? "zoom" : ""
                      } ${proj.id === "DiemDanhQR" ? "fit-top" : ""}`}
                      draggable="false"
                      onError={(e) => {
                        const target = e.currentTarget;
                        const og = ghImage(proj.id);
                        // Thiếu ảnh local -> thử ảnh OpenGraph GitHub; nếu vẫn lỗi -> placeholder
                        if (!target.dataset.fallback && proj.id) {
                          target.dataset.fallback = "og";
                          target.src = og;
                        } else {
                          target.src = `https://placehold.co/600x338/111219/ffffff?text=${encodeURIComponent(
                            proj.shortName
                          )}`;
                        }
                      }}
                    />
                  </div>

                  {/* Thông tin thu gọn */}
                  <div className="info-collapsed">
                    <span className="collapsed-num">{proj.category}</span>
                    <h3 className="collapsed-title">{proj.shortName}</h3>
                    <span className="collapsed-preview-link">
                      {proj.yearRole}
                    </span>
                  </div>

                  {/* Thông tin mở rộng */}
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
                      href={proj.link || "#"}
                      target={proj.link ? "_blank" : undefined}
                      rel={proj.link ? "noopener noreferrer" : undefined}
                      className="expanded-btn"
                      onMouseEnter={() => triggerCursorHover(true)}
                      onMouseLeave={() => triggerCursorHover(false)}
                      onClick={(e) => {
                        if (!proj.link) e.preventDefault();
                      }}
                    >
                      {proj.link ? "Xem trên GitHub" : "Private • mã nguồn không công khai"}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Indicator ở footer */}
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
