import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";

export const Route = createFileRoute("/information")({
  head: () => ({
    meta: [
      { title: "Information — Trần Trung Thành" },
      { name: "description", content: "Thông tin về Trần Trung Thành — AI / WEB3 / UI / 3D / MOTION / VIDEO" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&family=Syne:wght@800&family=Fira+Code:wght@400;500&display=swap",
      },
    ],
  }),
  component: Information,
});

// Chuỗi chữ chạy dọc theo dây đeo (4 nbsp đầu + "3D CARD" × 5, ngăn cách bởi 8 nbsp)
const LANYARD_TEXT = "    " + Array(5).fill("3D CARD").join(" ".repeat(8));

// Toàn bộ CSS gốc của Info.html, đổi selector `body` -> `.info-page` và reset `*` thu hẹp phạm vi
const INFO_CSS = `
/* --- GIAO DIỆN NỀN & CHỮ TỐI GIẢN --- */
/* (Khong reset margin/padding toan cuc: Tailwind preflight da lam viec do,
    va viec reset .info-page * se pha padding cua NavBar) */
.info-page {
    position: relative;
    background-color: #0b0c10;
    background-image: url('/IMG/background_info.jpeg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;

    color: #ffffff;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    user-select: none;
    font-family: 'Plus Jakarta Sans', sans-serif;
}

/* --- KHU VỰC BỐ CỤC CHÍNH --- */
.info-page .container {
    width: 100%;
    max-width: 1600px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 4rem;
}

/* Khung chứa chữ bên trái */
.info-page .content-left {
    max-width: 850px;
    z-index: 2;
    margin-left: -50px; /* dịch khối chữ lề trái sang trái ~50px */
}

/* Tạo hiệu ứng trượt lên cho từng dòng chữ lề trái */
.info-page .content-left > * {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}

.info-page .content-left > *.visible {
    opacity: 1;
    transform: translateY(0);
}

/* DÒNG 1: + AVAILABLE FOR WORK */
.info-page .status {
    font-size: 0.91rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 3.9px;
    margin-bottom: 1.4rem;
    font-weight: 500;
    font-family: 'Fira Code', monospace;
}

/* DÒNG 2 & 3: CHỮ TIÊU ĐỀ RỘNG VÀ ĐẬM NÉT */
.info-page h1 {
    font-family: 'Syne', sans-serif;
    font-size: 6.5rem;
    font-weight: 800;
    line-height: 0.95;
    margin-bottom: 1.2rem;
    letter-spacing: -2.6px;
    text-transform: none;
}

.info-page h1 .title-top {
    color: #ffffff;
    display: block;
}

.info-page h1 .title-bottom {
    color: #52525b;
    display: block;
}

/* DÒNG 4: HAPPY CODING CHỮ THƯỜNG DẠNG TERMINAL */
.info-page .happy-coding {
    font-family: 'Fira Code', monospace;
    font-size: 1.235rem;
    color: #a1a1aa;
    text-transform: none;
    margin-bottom: 1.2rem;
    display: inline-block;
}

.info-page .happy-coding::after {
    content: ' _';
    font-weight: 700;
    color: #a1a1aa;
    animation: infoBlink 0.8s step-end infinite;
}

@keyframes infoBlink {
    from, to { opacity: 1; }
    50% { opacity: 0; }
}

/* DÒNG 5, 6, 7: MÔ TẢ CHI TIẾT VỚI FONT MẢNH MÀU TRẦM */
.info-page .description {
    color: #9ca3af;
    font-size: 1.105rem;
    line-height: 1.65;
    margin-bottom: 1.9rem;
    font-weight: 400;
    max-width: 650px;
}

/* DÒNG 8: TAGS HIỆU ỨNG GLASSMORPHISM TỐI GIẢN */
.info-page .tags {
    display: flex;
    gap: 10.4px;
    margin-bottom: 2rem;
}

.info-page .tag {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(15.6px);
    -webkit-backdrop-filter: blur(15.6px);
    padding: 8px 20px;
    border-radius: 130px;
    font-size: 0.975rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: #d1d5db;
    box-shadow: 0 5.2px 26px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.info-page .tag:hover {
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.15);
    color: #ffffff;
}

/* DÒNG CUỐI: CÁC LINK KHÁM PHÁ DẠNG MONOSPACE */
.info-page .explore-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-page .explore {
    font-family: 'Fira Code', monospace;
    font-size: 0.975rem;
    color: #52525b;
    text-transform: lowercase;
    letter-spacing: -0.26px;
}

/* --- KHU VỰC DÂY ĐEO VÀ THẺ VẬT LÝ --- */
.info-page .content-right {
    position: relative;
    width: 450px;
    height: 845px;
}

.info-page #lanyard-svg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 5;
}

.info-page #lanyard-rope {
    stroke: #14151a;
    stroke-width: 15.6;
    stroke-linecap: round;
}

.info-page .lanyard-text-style {
    font-size: 9.1px;
    font-weight: 800;
    letter-spacing: 3.9px;
    text-transform: uppercase;
    fill: #ffffff;
    opacity: 0.85;
}

.info-page #lanyard-clip {
    fill: none;
    stroke: #27272a;
    stroke-width: 3.9;
}

/* Tấm thẻ ID (+30% kích thước), vị trí ban đầu đồng bộ với engine vật lý */
.info-page .id-card {
    width: 364px;
    height: 520px;
    background: #111218;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20.8px;
    padding: 23.4px;
    position: fixed;
    transform: translate(-50%, 0);
    box-shadow: 0 52px 104px rgba(0, 0, 0, 0.6);
    z-index: 10;
    cursor: grab;
    transition: box-shadow 0.2s ease, opacity 0.4s ease;
    overflow: hidden;
    opacity: 0;
}

.info-page .id-card:active {
    cursor: grabbing;
    box-shadow: 0 19.5px 39px rgba(0, 0, 0, 0.8);
}

.info-page .id-card::before {
    content: 'MEMBER CARD';
    position: absolute;
    left: 10.4px;
    top: 50%;
    transform: translateY(-50%) rotate(-90deg);
    transform-origin: left center;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.15);
    letter-spacing: 2.6px;
    white-space: nowrap;
}

.info-page .photo-box {
    width: 100%;
    height: 82%;
    background: #191b24;
    border-radius: 13px;
    overflow: hidden;
    margin-bottom: 18.2px;
    border: 1px solid rgba(255, 255, 255, 0.03);
    pointer-events: none;
}

.info-page .photo-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(0%) contrast(100%); /* Giữ màu gốc rực rỡ */
}

.info-page .card-info {
    text-align: center;
    pointer-events: none;
}

.info-page .card-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: #f3f4f6;
}

.info-page .card-title {
    font-size: 0.975rem;
    color: #6b7280;
    margin-top: 3.9px;
    text-transform: uppercase;
    letter-spacing: 1.3px;
}

@media (max-width: 1400px) {
    .info-page h1 { font-size: 5.5rem; }
}

@media (max-width: 768px) {
    .info-page .container { flex-direction: column-reverse; gap: 5.2rem; padding: 0 1.5rem; }
    .info-page h1 { font-size: 4.55rem; }
    .info-page .content-right { height: 520px; width: 100%; }
    .info-page .content-left { max-width: 100%; margin-left: 0; }
    .info-page .id-card { width: 299px; height: 429px; padding: 18px; }
    .info-page .card-name { font-size: 1.17rem; }
    .info-page .card-title { font-size: 0.8rem; }
}
`;

function Information() {
  const [status, setStatus] = useState("+ AVAILABLE FOR WORK");
  const [titleTop, setTitleTop] = useState("Prompt");
  const [titleBottom, setTitleBottom] = useState("Engineering");
  const [description, setDescription] = useState("Sức mạnh của ngôn ngữ: Kết nối ý tưởng và trí tuệ nhân tạo.\nTối ưu hóa Prompts: Nghệ thuật điều khiển AI.\nTriết lý: Hiểu, Thử nghiệm, Tinh chỉnh.");
  const [tags, setTags] = useState(["Python", "JavaScript", "React"]);
  const [explore1, setExplore1] = useState("↓ explore my skills above");
  const [explore2, setExplore2] = useState("↗ explore portfolio & contact details below");
  const [cardName, setCardName] = useState("TRAN TRUNG THANH");
  const [cardTitle, setCardTitle] = useState("Industrial University \nof Ho Chi Minh City");

  useEffect(() => {
    // Load local settings
    const storedStatus = localStorage.getItem("info_status");
    const storedTitleTop = localStorage.getItem("info_title_top");
    const storedTitleBottom = localStorage.getItem("info_title_bottom");
    const storedDesc = localStorage.getItem("info_description");
    const storedTags = localStorage.getItem("info_tags");
    const storedExplore1 = localStorage.getItem("info_explore_1");
    const storedExplore2 = localStorage.getItem("info_explore_2");
    const storedCardName = localStorage.getItem("info_card_name");
    const storedCardTitle = localStorage.getItem("info_card_title");

    if (storedStatus) setStatus(storedStatus);
    if (storedTitleTop) setTitleTop(storedTitleTop);
    if (storedTitleBottom) setTitleBottom(storedTitleBottom);
    if (storedDesc) setDescription(storedDesc);
    if (storedTags) setTags(storedTags.split(",").map(t => t.trim()).filter(Boolean));
    if (storedExplore1) setExplore1(storedExplore1);
    if (storedExplore2) setExplore2(storedExplore2);
    if (storedCardName) setCardName(storedCardName);
    if (storedCardTitle) setCardTitle(storedCardTitle);

    const svgPath = document.getElementById("lanyard-rope");
    const svgClip = document.getElementById("lanyard-clip");
    const idCard = document.getElementById("id-card");
    const anchorZone = document.getElementById("rope-anchor-zone");
    const contentLeft = document.getElementById("content-left");
    const typingElement = document.getElementById("typing-effect");

    if (!svgPath || !svgClip || !idCard || !anchorZone || !contentLeft || !typingElement) return;

    // --- ENGINE VẬT LÝ VERLET (THẢ RƠI TỰ NHIÊN BAN ĐẦU) ---
    const totalPoints = 25;
    const segmentLen = 11;
    const gravity = 0.4;
    const startOffsetX = 150; // vị trí XUẤT PHÁT (lúc load) lệch phải điểm neo 150px -> rơi + đung đưa rồi lắng thẳng xuống
    const bounceFriction = 0.95;
    const constraintIterations = 8; // độ cứng dây: cao -> dây thật/con lắc; thấp -> co giãn "dây chun" nhiều hơn
    const physicsPoints: { x: number; y: number; oldX: number; oldY: number }[] = [];

    let anchorX = 0,
      anchorY = 0;
    let isDragging = false;
    let mouseX = 0,
      mouseY = 0;
    let grabOffsetX = 0;
    let grabOffsetY = 0;

    let rafId = 0;
    let cardShown = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function calcAnchor() {
      const rect = anchorZone!.getBoundingClientRect();
      anchorX = rect.left + rect.width / 2;
      anchorY = -30;
    }

    // Khởi tạo các điểm vật lý theo một đường thẳng nghiêng (con lắc thật)
    function initPhysics() {
      calcAnchor();
      // Trải dây thành một đường THẲNG CĂNG nghiêng từ neo tới vị trí thẻ (lệch phải startOffsetX px).
      // Mỗi điểm cách đều theo segmentLen, vận tốc đầu = 0 -> thả ra rơi như con lắc thật (trọng lực),
      // đung đưa theo cung + nảy nhẹ rồi lắng thẳng đứng dưới neo. Tránh cú "hút về neo" do dồn 1 chỗ.
      const ropeLength = segmentLen * (totalPoints - 1);
      const offX = Math.min(startOffsetX, ropeLength * 0.95); // clamp để luôn còn phương rơi xuống
      const dirX = offX / ropeLength;
      const dirY = Math.sqrt(1 - dirX * dirX);
      for (let i = 0; i < totalPoints; i++) {
        const px = anchorX + segmentLen * dirX * i;
        const py = anchorY + segmentLen * dirY * i;
        physicsPoints.push({ x: px, y: py, oldX: px, oldY: py });
      }
    }

    function updatePhysics() {
      physicsPoints[0].x = anchorX;
      physicsPoints[0].y = anchorY;
      physicsPoints[0].x += Math.sin(Date.now() * 0.002) * 0.35;

      if (isDragging) {
        const lastPoint = physicsPoints[totalPoints - 1];
        lastPoint.x = mouseX - grabOffsetX;
        lastPoint.y = mouseY - grabOffsetY;
      }

      for (let i = 1; i < totalPoints; i++) {
        const p = physicsPoints[i];
        const velX = (p.x - p.oldX) * bounceFriction;
        const velY = (p.y - p.oldY) * bounceFriction;

        p.oldX = p.x;
        p.oldY = p.y;

        p.x += velX;
        p.y += velY + gravity;
      }

      for (let loop = 0; loop < constraintIterations; loop++) {
        for (let i = 0; i < totalPoints - 1; i++) {
          const p1 = physicsPoints[i];
          const p2 = physicsPoints[i + 1];

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const currentDist = Math.sqrt(dx * dx + dy * dy);
          const diff = segmentLen - currentDist;
          const errorPercent = (diff / currentDist) * 0.5;
          const offsetX = dx * errorPercent;
          const offsetY = dy * errorPercent;

          if (i === 0) {
            p2.x += offsetX * 2;
            p2.y += offsetY * 2;
          } else {
            p1.x -= offsetX;
            p1.y -= offsetY;
            p2.x += offsetX;
            p2.y += offsetY;
          }
        }
      }

      let pathString = `M ${physicsPoints[0].x} ${physicsPoints[0].y}`;
      for (let i = 1; i < totalPoints - 1; i++) {
        const midX = (physicsPoints[i].x + physicsPoints[i + 1].x) / 2;
        const midY = (physicsPoints[i].y + physicsPoints[i + 1].y) / 2;
        pathString += ` Q ${physicsPoints[i].x} ${physicsPoints[i].y}, ${midX} ${midY}`;
      }
      pathString += ` L ${physicsPoints[totalPoints - 1].x} ${physicsPoints[totalPoints - 1].y}`;
      svgPath!.setAttribute("d", pathString);

      const lastNode = physicsPoints[totalPoints - 1];
      svgClip!.setAttribute("cx", String(lastNode.x));
      svgClip!.setAttribute("cy", String(lastNode.y));

      idCard!.style.left = `${lastNode.x}px`;
      idCard!.style.top = `${lastNode.y}px`;

      if (!cardShown) {
        cardShown = true;
        idCard!.style.opacity = "1";
      }

      rafId = requestAnimationFrame(updatePhysics);
    }

    // --- HIỆU ỨNG INTRO XUẤT HIỆN CHỮ SO LE ---
    function runIntroSequence() {
      // Kích hoạt xuất hiện tuần tự các dòng chữ lề trái (Staggered Effect)
      const textElements = contentLeft!.children;
      for (let i = 0; i < textElements.length; i++) {
        timers.push(
          setTimeout(() => {
            textElements[i].classList.add("visible");
          }, 300 + i * 150),
        );
      }

      // 3. Kích hoạt hiệu ứng đánh máy chữ ngay sau khi dòng text Happy Coding xuất hiện
      timers.push(setTimeout(typeCharacter, 300 + 3 * 150 + 200));
    }

    // --- HIỆU ỨNG GÕ CHỮ ---
    const textToType = localStorage.getItem("info_typing") || "Happy coding";
    let charIndex = 0;

    function typeCharacter() {
      if (charIndex < textToType.length) {
        typingElement!.innerHTML += textToType.charAt(charIndex);
        charIndex++;
        timers.push(setTimeout(typeCharacter, 120));
      }
    }

    // Tương tác chuột kéo thả dây đeo
    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      const lastPoint = physicsPoints[totalPoints - 1];
      grabOffsetX = e.clientX - lastPoint.x;
      grabOffsetY = e.clientY - lastPoint.y;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isDragging) {
        physicsPoints.forEach((p) => {
          const diffX = p.x - mouseX;
          const diffY = p.y - mouseY;
          const distance = Math.sqrt(diffX * diffX + diffY * diffY);
          if (distance < 25) {
            p.x += (diffX / distance) * 2;
          }
        });
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    idCard.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", calcAnchor);

    // --- KHỞI CHẠY HỆ THỐNG ĐỒNG THỜI NGAY KHI TẢI TRANG ---
    initPhysics();
    updatePhysics(); // Chạy liên tục vòng lặp vật lý ngay lập tức
    runIntroSequence(); // Chạy chuỗi hiệu ứng chữ trượt lên

    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
      idCard.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", calcAnchor);
    };
  }, []);

  return (
    <main className="info-page">
      <style dangerouslySetInnerHTML={{ __html: INFO_CSS }} />

      <NavBar className="mix-blend-difference" />

      <div className="container">
        <div className="content-left" id="content-left">
          <div className="status">{status}</div>

          <h1>
            <span className="title-top">{titleTop}</span>
            <span className="title-bottom">{titleBottom}</span>
          </h1>

          <div className="happy-coding" id="typing-effect"></div>

          <p className="description">
            {description.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </p>

          <div className="tags">
            {tags.map((t) => (
              <div key={t} className="tag">{t}</div>
            ))}
          </div>

          <div className="explore-group">
            <div className="explore">{explore1}</div>
            <div className="explore">{explore2}</div>
          </div>
        </div>

        <div className="content-right" id="rope-anchor-zone"></div>
      </div>

      <svg id="lanyard-svg">
        <path id="lanyard-rope" fill="none" />
        <text className="lanyard-text-style" dy="3.3" dominantBaseline="central">
          <textPath id="lanyard-text-path" href="#lanyard-rope">
            {LANYARD_TEXT}
          </textPath>
        </text>
        <circle id="lanyard-clip" r="13" stroke="#27272a" strokeWidth="3.9" fill="none" />
      </svg>

      <div className="id-card" id="id-card">
        <div className="photo-box">
          <img src="/IMG/Profile.jpeg" alt="Avatar" />
        </div>
        <div className="card-info">
          <div className="card-name">{cardName}</div>
          <div className="card-title">
            {cardTitle.split("\n").map((line, idx) => (
              <span key={idx}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
