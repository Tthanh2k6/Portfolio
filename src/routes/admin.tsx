import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { NavBar } from "@/components/NavBar";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — Trần Trung Thành" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPanel,
});

// DEFAULT VALUES FALLBACKS (To initialize form states correctly)
const DEFAULT_CUBES = {
  pink: "#FF00FF",
  purple: "#9900FF",
  cyan: "#00FFFF",
  orange: "#FF6B6B",
  yellow: "#4A0E17",
};

const DEFAULT_HOME = {
  line1: "Just chill. The future is rendering...",
  line2: "Trần Trung Thành",
  tags: "AI, WEB3, UI, 3D, MOTION, VIDEO",
};

const DEFAULT_INFO = {
  status: "+ AVAILABLE FOR WORK",
  titleTop: "Prompt",
  titleBottom: "Engineering",
  typing: "Happy coding",
  description: "Sức mạnh của ngôn ngữ: Kết nối ý tưởng và trí tuệ nhân tạo.\nTối ưu hóa Prompts: Nghệ thuật điều khiển AI.\nTriết lý: Hiểu, Thử nghiệm, Tinh chỉnh.",
  tags: "Python, JavaScript, React",
  explore1: "↓ explore my skills above",
  explore2: "↗ explore portfolio & contact details below",
  cardName: "TRAN TRUNG THANH",
  cardTitle: "Industrial University \nof Ho Chi Minh City",
};

const DEFAULT_SKILLS_TEXT = {
  sub: "Always improving myself day by day",
  title1: "Current",
  title2: "skills",
  typewriter: "Experience gained through projects and school",
  desc: "Transforming complex development challenges into smooth, fluid user experiences. Focusing on optimized performance, responsive layouts, and scalable codebases.",
};

const DEFAULT_KEYCAPS = [
  { bg: "#ff5722", shadow: "#b73209", color: "#fff", img: "/IMG/HTML.png", title: "HTML5", desc: "Cấu trúc web ngữ nghĩa, chuẩn truy cập & SEO." },
  { bg: "#2196f3", shadow: "#0d6aad", color: "#fff", img: "/IMG/CSS.png", title: "CSS3", desc: "Giao diện responsive với Flexbox, Grid và animation mượt mà." },
  { bg: "#ffeb3b", shadow: "#bfa500", color: "#000", img: "/IMG/JavaScript.png", title: "JavaScript / TS", desc: "Frontend tương tác, API Node.js và app di động." },
  { bg: "#007acc", shadow: "#005187", color: "#fff", img: "/IMG/C++.png", title: "C / C++", desc: "Xử lý hiệu năng cao, quản lý bộ nhớ thủ công, đệ quy tối ưu." },
  { bg: "#e76f51", shadow: "#a73e25", color: "#fff", img: "/IMG/Java.jpg", title: "Java", desc: "Backend doanh nghiệp và ứng dụng Android trên nền JVM." },
  { bg: "#777bb4", shadow: "#4f5b93", color: "#fff", img: "/IMG/PHP-logo.png", title: "PHP", desc: "Web động & ứng dụng MVC: ORM, routing, bảo mật." },
  { bg: "#3875a6", shadow: "#204969", color: "#fff", img: "/IMG/Python.png", title: "Python", desc: "Tự động hóa, API bất đồng bộ và mọi thử nghiệm ML/AI." },
  { bg: "#00a8cc", shadow: "#006b82", color: "#fff", img: "/IMG/MySQL-Photoroom.png", title: "MySQL", desc: "Lược đồ quan hệ xử lý logic phân hạng nhiều tầng." },
  { bg: "#2c3e50", shadow: "#1a252f", color: "#00d8ff", img: "/IMG/React.png", title: "React", desc: "Giao diện hiện đại: component, hook, RSC, Tailwind." },
  { bg: "#f4511e", shadow: "#b02600", color: "#fff", img: "/IMG/Git.png", title: "Git", desc: "Quản lý phiên bản chi tiết cho codebase phức tạp." },
  { bg: "#33353f", shadow: "#1a1b21", color: "#fff", img: "/IMG/GitHub.png", title: "GitHub", desc: "Quản lý phiên bản, nhánh và cộng tác nhóm." },
  { bg: "#00a2ff", shadow: "#006bb3", color: "#fff", img: "/IMG/Visual_Studio_Code.png", title: "VS Code", desc: "Buồng lái phát triển nhanh, tối ưu cho tự động hóa." },
  { bg: "#10a37f", shadow: "#0a664f", color: "#fff", img: "/IMG/chatgpt-logo-png_seeklogo-465219-Photoroom.png", title: "ChatGPT", desc: "Trợ thủ lập trình cặp và tự động hóa hằng ngày." },
  { bg: "#e08260", shadow: "#a64f31", color: "#fff", img: "/IMG/Claude.png", title: "Claude", desc: "Suy luận sâu và kiểm chứng logic code hóc búa." },
  { bg: "#4c75f2", shadow: "#2143b3", color: "#fff", img: "/IMG/Gemini.png", title: "Gemini", desc: "Suy luận đa phương thức ngay trong quy trình code." },
  { bg: "#eef1f7", shadow: "#b9c0cf", color: "#1a1b23", img: "/IMG/unnamed-Photoroom.png", title: "Expo", desc: "Build, OTA update & phát hành app React Native đa nền tảng." },
];

const DEFAULT_CHART = [
  { name: "HTML/CSS", pct: 22, color: "#FB923C" },
  { name: "JavaScript", pct: 16, color: "#FCD34D" },
  { name: "Python", pct: 16, color: "#60A5FA" },
  { name: "React", pct: 12, color: "#67E8F9" },
  { name: "C++", pct: 11, color: "#C084FC" },
  { name: "PHP", pct: 8, color: "#818CF8" },
  { name: "MySQL", pct: 8, color: "#34D399" },
  { name: "Git", pct: 7, color: "#F87171" },
];

const DEFAULT_MAP = {
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

const DEFAULT_PROJECTS = [
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
  },
];

const DEFAULT_SOCIALS = [
  { type: "GitHub", url: "https://github.com", handle: "@tranthanh", visible: true, large: true },
  { type: "Facebook", url: "https://facebook.com", handle: "Trần Trung Thành", visible: true, large: false },
  { type: "Zalo", url: "https://zalo.me", handle: "Trần Trung Thành", visible: true, large: false },
];

function AdminPanel() {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [saveStatus, setSaveStatus] = useState("");

  // Home states
  const [homeCubePink, setHomeCubePink] = useState("");
  const [homeCubePurple, setHomeCubePurple] = useState("");
  const [homeCubeCyan, setHomeCubeCyan] = useState("");
  const [homeCubeOrange, setHomeCubeOrange] = useState("");
  const [homeCubeYellow, setHomeCubeYellow] = useState("");
  const [homeLine1, setHomeLine1] = useState("");
  const [homeLine2, setHomeLine2] = useState("");
  const [homeTags, setHomeTags] = useState("");

  // Scene physics settings states
  const [sceneVisibleGridSize, setSceneVisibleGridSize] = useState("");
  const [sceneGridSize, setSceneGridSize] = useState("");
  const [sceneCubeSize, setSceneCubeSize] = useState("");
  const [sceneGridSpacing, setSceneGridSpacing] = useState("");
  const [sceneMinH, setSceneMinH] = useState("");
  const [sceneMaxH, setSceneMaxH] = useState("");
  const [sceneHoverR, setSceneHoverR] = useState("");
  const [sceneLerpIn, setSceneLerpIn] = useState("");
  const [sceneLerpOut, setSceneLerpOut] = useState("");
  const [sceneBgOpa, setSceneBgOpa] = useState("");
  const [sceneBgArm, setSceneBgArm] = useState("");
  const [sceneFogStart, setSceneFogStart] = useState("");
  const [sceneFogEnd, setSceneFogEnd] = useState("");
  const [sceneLineThickness, setSceneLineThickness] = useState("");
  const [sceneBloomStrength, setSceneBloomStrength] = useState("");
  const [sceneBloomRadius, setSceneBloomRadius] = useState("");
  const [sceneBloomThreshold, setSceneBloomThreshold] = useState("");
  const [sceneBaseH, setSceneBaseH] = useState("");
  const [sceneIdleMs, setSceneIdleMs] = useState("");
  const [sceneCameraYOffset, setSceneCameraYOffset] = useState("");

  // Cube state & Scene advanced settings states
  const [sceneCubeSolidColor, setSceneCubeSolidColor] = useState("");
  const [sceneCubeMetalness, setSceneCubeMetalness] = useState("");
  const [sceneCubeRoughness, setSceneCubeRoughness] = useState("");
  const [scenePlatformColor, setScenePlatformColor] = useState("");
  const [scenePlatformMetalness, setScenePlatformMetalness] = useState("");
  const [scenePlatformRoughness, setScenePlatformRoughness] = useState("");
  const [sceneAmbientColor, setSceneAmbientColor] = useState("");
  const [sceneAmbientIntensity, setSceneAmbientIntensity] = useState("");
  const [sceneLight1Intensity, setSceneLight1Intensity] = useState("");
  const [sceneLight2Intensity, setSceneLight2Intensity] = useState("");
  const [sceneLightDecay, setSceneLightDecay] = useState("");
  const [sceneLightDistanceFactor, setSceneLightDistanceFactor] = useState("");
  const [sceneIdleHeightSteps, setSceneIdleHeightSteps] = useState("");
  const [sceneIdleHeightMult, setSceneIdleHeightMult] = useState("");
  const [sceneIdleUpdateMin, setSceneIdleUpdateMin] = useState("");
  const [sceneIdleUpdateRand, setSceneIdleUpdateRand] = useState("");

  // Info states
  const [infoStatus, setInfoStatus] = useState("");
  const [infoTitleTop, setInfoTitleTop] = useState("");
  const [infoTitleBottom, setInfoTitleBottom] = useState("");
  const [infoTyping, setInfoTyping] = useState("");
  const [infoDescription, setInfoDescription] = useState("");
  const [infoTags, setInfoTags] = useState("");
  const [infoExplore1, setInfoExplore1] = useState("");
  const [infoExplore2, setInfoExplore2] = useState("");
  const [infoCardName, setInfoCardName] = useState("");
  const [infoCardTitle, setInfoCardTitle] = useState("");

  // Skills states
  const [skillsSub, setSkillsSub] = useState("");
  const [skillsTitle1, setSkillsTitle1] = useState("");
  const [skillsTitle2, setSkillsTitle2] = useState("");
  const [skillsTypewriter, setSkillsTypewriter] = useState("");
  const [skillsDesc, setSkillsDesc] = useState("");
  const [skillsKeycaps, setSkillsKeycaps] = useState<any[]>([]);
  const [skillsChartData, setSkillsChartData] = useState<any[]>([]);
  const [skillsTitleToChart, setSkillsTitleToChart] = useState<Record<string, string>>({});

  // Keycap Edit Modal state
  const [editingKeycap, setEditingKeycap] = useState<any | null>(null);

  // Projects states
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any | null>(null);

  // Contact states
  const [socialsList, setSocialsList] = useState<any[]>([]);
  const [commentsList, setCommentsList] = useState<any[]>([]);
  const [contactReceiverEmail, setContactReceiverEmail] = useState("");

  // Auth check
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_authorized");
    if (auth === "true") {
      setIsAuthorized(true);
    }
  }, []);

  // Load all settings
  useEffect(() => {
    if (!isAuthorized) return;

    // Home
    setHomeCubePink(localStorage.getItem("home_cube_pink") || DEFAULT_CUBES.pink);
    setHomeCubePurple(localStorage.getItem("home_cube_purple") || DEFAULT_CUBES.purple);
    setHomeCubeCyan(localStorage.getItem("home_cube_cyan") || DEFAULT_CUBES.cyan);
    setHomeCubeOrange(localStorage.getItem("home_cube_orange") || DEFAULT_CUBES.orange);
    setHomeCubeYellow(localStorage.getItem("home_cube_yellow") || DEFAULT_CUBES.yellow);
    setHomeLine1(localStorage.getItem("home_line_1") || DEFAULT_HOME.line1);
    setHomeLine2(localStorage.getItem("home_line_2") || DEFAULT_HOME.line2);
    setHomeTags(localStorage.getItem("home_line_3") || DEFAULT_HOME.tags);

    // Scene Grid settings
    setSceneVisibleGridSize(localStorage.getItem("scene_visible_grid_size") || "20");
    setSceneGridSize(localStorage.getItem("scene_grid_size") || "38");
    setSceneCubeSize(localStorage.getItem("scene_cube_size") || "6.2");
    setSceneGridSpacing(localStorage.getItem("scene_grid_spacing") || "10.2");
    setSceneMinH(localStorage.getItem("scene_min_h") || "0.10");
    setSceneMaxH(localStorage.getItem("scene_max_h") || "6.0");
    setSceneHoverR(localStorage.getItem("scene_hover_r") || "15.0");
    setSceneLerpIn(localStorage.getItem("scene_lerp_in") || "0.16");
    setSceneLerpOut(localStorage.getItem("scene_lerp_out") || "0.055");
    setSceneBgOpa(localStorage.getItem("scene_bg_opa") || "0.06");
    setSceneBgArm(localStorage.getItem("scene_bg_arm") || "1.60");
    setSceneFogStart(localStorage.getItem("scene_fog_start") || "40.0");
    setSceneFogEnd(localStorage.getItem("scene_fog_end") || "95.0");
    setSceneLineThickness(localStorage.getItem("scene_line_thickness") || "3.8");
    setSceneBloomStrength(localStorage.getItem("scene_bloom_strength") || "1.1");
    setSceneBloomRadius(localStorage.getItem("scene_bloom_radius") || "0.38");
    setSceneBloomThreshold(localStorage.getItem("scene_bloom_threshold") || "0.15");
    setSceneBaseH(localStorage.getItem("scene_base_h") || "0.15");
    setSceneIdleMs(localStorage.getItem("scene_idle_ms") || "3000");
    setSceneCameraYOffset(localStorage.getItem("scene_camera_y_offset") || "20");

    // Cube state & Scene advanced settings
    setSceneCubeSolidColor(localStorage.getItem("scene_cube_solid_color") || "#010101");
    setSceneCubeMetalness(localStorage.getItem("scene_cube_metalness") || "0.4");
    setSceneCubeRoughness(localStorage.getItem("scene_cube_roughness") || "0.5");
    setScenePlatformColor(localStorage.getItem("scene_platform_color") || "#020202");
    setScenePlatformMetalness(localStorage.getItem("scene_platform_metalness") || "0.2");
    setScenePlatformRoughness(localStorage.getItem("scene_platform_roughness") || "0.6");
    setSceneAmbientColor(localStorage.getItem("scene_ambient_color") || "#ffffff");
    setSceneAmbientIntensity(localStorage.getItem("scene_ambient_intensity") || "0.04");
    setSceneLight1Intensity(localStorage.getItem("scene_light1_intensity") || "1.5");
    setSceneLight2Intensity(localStorage.getItem("scene_light2_intensity") || "1.5");
    setSceneLightDecay(localStorage.getItem("scene_light_decay") || "1.5");
    setSceneLightDistanceFactor(localStorage.getItem("scene_light_distance_factor") || "2.5");
    setSceneIdleHeightSteps(localStorage.getItem("scene_idle_height_steps") || "5");
    setSceneIdleHeightMult(localStorage.getItem("scene_idle_height_mult") || "1.1");
    setSceneIdleUpdateMin(localStorage.getItem("scene_idle_update_min") || "600");
    setSceneIdleUpdateRand(localStorage.getItem("scene_idle_update_rand") || "600");

    // Info
    setInfoStatus(localStorage.getItem("info_status") || DEFAULT_INFO.status);
    setInfoTitleTop(localStorage.getItem("info_title_top") || DEFAULT_INFO.titleTop);
    setInfoTitleBottom(localStorage.getItem("info_title_bottom") || DEFAULT_INFO.titleBottom);
    setInfoTyping(localStorage.getItem("info_typing") || DEFAULT_INFO.typing);
    setInfoDescription(localStorage.getItem("info_description") || DEFAULT_INFO.description);
    setInfoTags(localStorage.getItem("info_tags") || DEFAULT_INFO.tags);
    setInfoExplore1(localStorage.getItem("info_explore_1") || DEFAULT_INFO.explore1);
    setInfoExplore2(localStorage.getItem("info_explore_2") || DEFAULT_INFO.explore2);
    setInfoCardName(localStorage.getItem("info_card_name") || DEFAULT_INFO.cardName);
    setInfoCardTitle(localStorage.getItem("info_card_title") || DEFAULT_INFO.cardTitle);

    // Skills
    setSkillsSub(localStorage.getItem("skills_sub") || DEFAULT_SKILLS_TEXT.sub);
    setSkillsTitle1(localStorage.getItem("skills_title_1") || DEFAULT_SKILLS_TEXT.title1);
    setSkillsTitle2(localStorage.getItem("skills_title_2") || DEFAULT_SKILLS_TEXT.title2);
    setSkillsTypewriter(localStorage.getItem("skills_typewriter") || DEFAULT_SKILLS_TEXT.typewriter);
    setSkillsDesc(localStorage.getItem("skills_desc") || DEFAULT_SKILLS_TEXT.desc);

    const storedKeycaps = localStorage.getItem("skills_keycaps");
    setSkillsKeycaps(storedKeycaps ? JSON.parse(storedKeycaps) : DEFAULT_KEYCAPS);

    const storedChart = localStorage.getItem("skills_chart_data");
    setSkillsChartData(storedChart ? JSON.parse(storedChart) : DEFAULT_CHART);

    const storedMap = localStorage.getItem("skills_title_to_chart");
    setSkillsTitleToChart(storedMap ? JSON.parse(storedMap) : DEFAULT_MAP);

    // Projects
    const storedProjects = localStorage.getItem("project_list");
    setProjectsList(storedProjects ? JSON.parse(storedProjects) : DEFAULT_PROJECTS);

    // Contact
    const storedSocials = localStorage.getItem("contact_socials");
    setSocialsList(storedSocials ? JSON.parse(storedSocials) : DEFAULT_SOCIALS);
    setContactReceiverEmail(localStorage.getItem("contact_receiver_email") || "ttrungthanh90@gmail.com");

    // Load Guestbook Comments
    const storedComments = localStorage.getItem("contact_comments");
    if (storedComments) {
      setCommentsList(JSON.parse(storedComments));
    } else {
      // Fallback initially to contact's current static comments
      setCommentsList([
        { id: 1, author: "Rifqi Muhammad A", text: "Terima kasih đã mampir", pinned: true, likes: 2, liked: false, image: null, initial: "R" },
        { id: 3, author: "kyy", text: "hii", pinned: false, likes: 0, liked: false, image: null, initial: "K" }
      ]);
    }
  }, [isAuthorized]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin") {
      setIsAuthorized(true);
      sessionStorage.setItem("admin_authorized", "true");
    } else {
      alert("Mật khẩu không chính xác!");
    }
  };

  const flashSaveMessage = () => {
    setSaveStatus("Đã lưu cài đặt thành công!");
    setTimeout(() => setSaveStatus(""), 3000);
  };

  const handleSaveHome = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("home_cube_pink", homeCubePink);
    localStorage.setItem("home_cube_purple", homeCubePurple);
    localStorage.setItem("home_cube_cyan", homeCubeCyan);
    localStorage.setItem("home_cube_orange", homeCubeOrange);
    localStorage.setItem("home_cube_yellow", homeCubeYellow);
    localStorage.setItem("home_line_1", homeLine1);
    localStorage.setItem("home_line_2", homeLine2);
    localStorage.setItem("home_line_3", homeTags);
    localStorage.setItem("scene_visible_grid_size", sceneVisibleGridSize);
    localStorage.setItem("scene_grid_size", sceneGridSize);
    localStorage.setItem("scene_cube_size", sceneCubeSize);
    localStorage.setItem("scene_grid_spacing", sceneGridSpacing);
    localStorage.setItem("scene_min_h", sceneMinH);
    localStorage.setItem("scene_max_h", sceneMaxH);
    localStorage.setItem("scene_hover_r", sceneHoverR);
    localStorage.setItem("scene_lerp_in", sceneLerpIn);
    localStorage.setItem("scene_lerp_out", sceneLerpOut);
    localStorage.setItem("scene_bg_opa", sceneBgOpa);
    localStorage.setItem("scene_bg_arm", sceneBgArm);
    localStorage.setItem("scene_fog_start", sceneFogStart);
    localStorage.setItem("scene_fog_end", sceneFogEnd);
    localStorage.setItem("scene_line_thickness", sceneLineThickness);
    localStorage.setItem("scene_bloom_strength", sceneBloomStrength);
    localStorage.setItem("scene_bloom_radius", sceneBloomRadius);
    localStorage.setItem("scene_bloom_threshold", sceneBloomThreshold);
    localStorage.setItem("scene_base_h", sceneBaseH);
    localStorage.setItem("scene_idle_ms", sceneIdleMs);
    localStorage.setItem("scene_camera_y_offset", sceneCameraYOffset);

    localStorage.setItem("scene_cube_solid_color", sceneCubeSolidColor);
    localStorage.setItem("scene_cube_metalness", sceneCubeMetalness);
    localStorage.setItem("scene_cube_roughness", sceneCubeRoughness);
    localStorage.setItem("scene_platform_color", scenePlatformColor);
    localStorage.setItem("scene_platform_metalness", scenePlatformMetalness);
    localStorage.setItem("scene_platform_roughness", scenePlatformRoughness);
    localStorage.setItem("scene_ambient_color", sceneAmbientColor);
    localStorage.setItem("scene_ambient_intensity", sceneAmbientIntensity);
    localStorage.setItem("scene_light1_intensity", sceneLight1Intensity);
    localStorage.setItem("scene_light2_intensity", sceneLight2Intensity);
    localStorage.setItem("scene_light_decay", sceneLightDecay);
    localStorage.setItem("scene_light_distance_factor", sceneLightDistanceFactor);
    localStorage.setItem("scene_idle_height_steps", sceneIdleHeightSteps);
    localStorage.setItem("scene_idle_height_mult", sceneIdleHeightMult);
    localStorage.setItem("scene_idle_update_min", sceneIdleUpdateMin);
    localStorage.setItem("scene_idle_update_rand", sceneIdleUpdateRand);
    flashSaveMessage();
  };

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("info_status", infoStatus);
    localStorage.setItem("info_title_top", infoTitleTop);
    localStorage.setItem("info_title_bottom", infoTitleBottom);
    localStorage.setItem("info_typing", infoTyping);
    localStorage.setItem("info_description", infoDescription);
    localStorage.setItem("info_tags", infoTags);
    localStorage.setItem("info_explore_1", infoExplore1);
    localStorage.setItem("info_explore_2", infoExplore2);
    localStorage.setItem("info_card_name", infoCardName);
    localStorage.setItem("info_card_title", infoCardTitle);
    flashSaveMessage();
  };

  const handleSaveSkillsText = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("skills_sub", skillsSub);
    localStorage.setItem("skills_title_1", skillsTitle1);
    localStorage.setItem("skills_title_2", skillsTitle2);
    localStorage.setItem("skills_typewriter", skillsTypewriter);
    localStorage.setItem("skills_desc", skillsDesc);
    flashSaveMessage();
  };

  // Manage Keycaps
  const deleteKeycap = (title: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa keycap ${title}?`)) return;
    const updated = skillsKeycaps.filter(k => k.title !== title);
    setSkillsKeycaps(updated);
    localStorage.setItem("skills_keycaps", JSON.stringify(updated));
    
    // Clean up mapping
    const newMap = { ...skillsTitleToChart };
    delete newMap[title];
    setSkillsTitleToChart(newMap);
    localStorage.setItem("skills_title_to_chart", JSON.stringify(newMap));
    flashSaveMessage();
  };

  const saveEditingKeycap = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: any[];
    if (editingKeycap.isNew) {
      updated = [...skillsKeycaps, { ...editingKeycap, isNew: undefined }];
    } else {
      updated = skillsKeycaps.map(k => k.title === editingKeycap.originalTitle ? { ...editingKeycap, originalTitle: undefined } : k);
    }
    setSkillsKeycaps(updated);
    localStorage.setItem("skills_keycaps", JSON.stringify(updated));

    // Update Mapping if mapped
    if (editingKeycap.chartName) {
      const newMap = { ...skillsTitleToChart, [editingKeycap.title]: editingKeycap.chartName };
      setSkillsTitleToChart(newMap);
      localStorage.setItem("skills_title_to_chart", JSON.stringify(newMap));
    }

    setEditingKeycap(null);
    flashSaveMessage();
  };

  // Manage Donut Chart Data
  const updateChartItem = (index: number, field: string, val: any) => {
    const updated = skillsChartData.map((c, idx) => {
      if (idx === index) {
        return { ...c, [field]: val };
      }
      return c;
    });
    setSkillsChartData(updated);
    localStorage.setItem("skills_chart_data", JSON.stringify(updated));
  };

  const saveChartData = () => {
    localStorage.setItem("skills_chart_data", JSON.stringify(skillsChartData));
    flashSaveMessage();
  };

  // Manage Projects
  const deleteProject = (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa dự án này?")) return;
    const updated = projectsList.filter(p => p.id !== id);
    setProjectsList(updated);
    localStorage.setItem("project_list", JSON.stringify(updated));
    flashSaveMessage();
  };

  const saveProject = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: any[];
    if (editingProject.isNew) {
      updated = [...projectsList, { ...editingProject, isNew: undefined }];
    } else {
      updated = projectsList.map(p => p.id === editingProject.originalId ? { ...editingProject, originalId: undefined } : p);
    }
    setProjectsList(updated);
    localStorage.setItem("project_list", JSON.stringify(updated));
    setEditingProject(null);
    flashSaveMessage();
  };

  // Manage Social Links
  const updateSocialItem = (index: number, field: string, val: any) => {
    const updated = socialsList.map((s, idx) => {
      if (idx === index) {
        return { ...s, [field]: val };
      }
      return s;
    });
    setSocialsList(updated);
    localStorage.setItem("contact_socials", JSON.stringify(updated));
  };

  const saveSocialLinks = () => {
    localStorage.setItem("contact_socials", JSON.stringify(socialsList));
    flashSaveMessage();
  };

  const handleSaveContactEmail = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("contact_receiver_email", contactReceiverEmail.trim() || "ttrungthanh90@gmail.com");
    flashSaveMessage();
  };

  const addNewSocial = () => {
    const type = window.prompt("Nhập tên mạng xã hội (ví dụ: TikTok, GitHub, LinkedIn):");
    if (!type) return;
    const url = window.prompt("Nhập đường dẫn URL:");
    if (!url) return;
    const handle = window.prompt("Nhập Handle hiển thị (ví dụ: @tranthanh):") || "";

    const newItem = { type, url, handle, visible: true, large: false };
    const updated = [...socialsList, newItem];
    setSocialsList(updated);
    localStorage.setItem("contact_socials", JSON.stringify(updated));
    flashSaveMessage();
  };

  // Manage Comments
  const deleteComment = (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;
    const updated = commentsList.filter(c => c.id !== id);
    setCommentsList(updated);
    localStorage.setItem("contact_comments", JSON.stringify(updated));
    flashSaveMessage();
  };

  const togglePinComment = (id: number) => {
    const updated = commentsList.map(c => {
      if (c.id === id) {
        return { ...c, pinned: !c.pinned };
      }
      return c;
    });
    const pinned = updated.filter(c => c.pinned);
    const unpinned = updated.filter(c => !c.pinned);
    const sorted = [...pinned, ...unpinned];

    setCommentsList(sorted);
    localStorage.setItem("contact_comments", JSON.stringify(sorted));
    flashSaveMessage();
  };

  // RESET ALL SETTINGS TO DEFAULT
  const handleResetAll = () => {
    if (!window.confirm("CẢNH BÁO: Hành động này sẽ xóa tất cả chỉnh sửa của bạn và khôi phục giao diện mặc định. Bạn chắc chắn chứ?")) return;
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (!isAuthorized) {
    return (
      <main className="admin-login-container">
        <style dangerouslySetInnerHTML={{ __html: `
          .admin-login-container {
            min-height: 100vh;
            background-color: #0b0c10;
            background-image: url('/IMG/background_info.jpeg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: 'Be Vietnam Pro', sans-serif;
            color: #ffffff;
          }
          .glass-card {
            background: rgba(18, 20, 29, 0.75);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 20px;
            padding: 40px;
            width: 100%;
            max-width: 420px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
            text-align: center;
          }
          .admin-title {
            font-size: 1.6rem;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .admin-subtitle {
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.5);
            margin-bottom: 28px;
          }
          .input-pass {
            width: 100%;
            background: rgba(255, 255, 255, 0.03);
            border: 1.5px solid rgba(255, 255, 255, 0.08);
            border-radius: 10px;
            padding: 14px 18px;
            color: #ffffff;
            font-size: 0.95rem;
            outline: none;
            text-align: center;
            margin-bottom: 18px;
            transition: all 0.3s;
          }
          .input-pass:focus {
            border-color: #00a2ff;
            box-shadow: 0 0 15px rgba(0, 162, 255, 0.2);
          }
          .login-btn {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #ffffff;
            border-radius: 10px;
            padding: 12px 0;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s;
          }
          .login-btn:hover {
            background: #ffffff;
            color: #000000;
            box-shadow: 0 10px 20px rgba(255,255,255,0.15);
          }
        ` }} />
        <div className="glass-card">
          <div className="admin-title">ADMIN CONTROL PANEL</div>
          <div className="admin-subtitle">Nhập mật khẩu quản trị để mở khóa cài đặt</div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              className="input-pass"
              placeholder="Mật khẩu (Mặc định: admin)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
            <button type="submit" className="login-btn">XÁC THỰC</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <style dangerouslySetInnerHTML={{ __html: `
        .admin-page-wrapper {
          min-height: 100vh;
          background-color: #0b0c10;
          background-image: url('/IMG/background_info.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          color: #ffffff;
          font-family: 'Be Vietnam Pro', sans-serif;
          padding: 120px 40px 60px 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .admin-container {
          width: 100%;
          max-width: 1200px;
          background: rgba(18, 20, 29, 0.6);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 20px;
        }

        .admin-title-panel {
          font-size: 2rem;
          font-weight: 800;
          letter-spacing: -0.5px;
          background: linear-gradient(90deg, #00a2ff 0%, #f0932b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .admin-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .admin-tab-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 10px 20px;
          color: rgba(255,255,255,0.6);
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .admin-tab-btn:hover, .admin-tab-btn.active {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .admin-tab-btn.active {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
        }

        .admin-form-group {
          margin-bottom: 24px;
        }

        .admin-label {
          display: block;
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.65);
          margin-bottom: 8px;
          letter-spacing: 0.5px;
        }

        .admin-input, .admin-textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1.5px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          padding: 12px 16px;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.92rem;
          outline: none;
          transition: all 0.3s;
        }

        .admin-input:focus, .admin-textarea:focus {
          border-color: #00a2ff;
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 0 15px rgba(0, 162, 255, 0.1);
        }

        .admin-textarea {
          resize: vertical;
          min-height: 100px;
        }

        select.admin-input option {
          background-color: #12141d;
          color: #ffffff;
        }

        .admin-row-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .admin-color-picker-group {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255,255,255,0.02);
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.04);
        }

        .admin-color-input {
          width: 44px;
          height: 44px;
          border-radius: 6px;
          border: none;
          background: none;
          cursor: pointer;
        }

        .admin-btn-save {
          background: #00a2ff;
          color: #ffffff;
          border: none;
          border-radius: 8px;
          padding: 14px 28px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s;
        }

        .admin-btn-save:hover {
          background: #33b5ff;
          box-shadow: 0 10px 20px rgba(0, 162, 255, 0.25);
        }

        .admin-btn-reset {
          background: transparent;
          color: #f43f5e;
          border: 1.5px solid rgba(244, 63, 94, 0.3);
          border-radius: 8px;
          padding: 12px 24px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }

        .admin-btn-reset:hover {
          background: rgba(244, 63, 94, 0.1);
          border-color: #f43f5e;
        }

        /* Tables & Lists */
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
          text-align: left;
        }

        .admin-table th, .admin-table td {
          padding: 14px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.9rem;
        }

        .admin-table th {
          color: rgba(255, 255, 255, 0.5);
          font-weight: 600;
        }

        .action-icon-btn {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          width: 32px;
          height: 32px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          color: #ffffff;
          cursor: pointer;
          transition: all 0.2s;
          margin-right: 6px;
        }

        .action-icon-btn:hover {
          background: rgba(255,255,255,0.08);
        }

        .action-icon-btn.delete:hover {
          background: rgba(244, 63, 94, 0.2);
          border-color: #f43f5e;
          color: #f43f5e;
        }

        .admin-badge-image {
          width: 32px;
          height: 32px;
          object-fit: contain;
          border-radius: 4px;
          background: #111;
          padding: 2px;
        }

        /* Save Flash banner */
        .admin-flash-banner {
          position: fixed;
          top: 30px;
          right: 30px;
          background: #10a37f;
          color: #ffffff;
          padding: 16px 24px;
          border-radius: 10px;
          font-weight: 600;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          z-index: 99999;
          animation: adminFadeIn 0.3s;
        }

        @keyframes adminFadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .admin-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }

        .admin-modal-card {
          background: #12141d;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 32px;
          width: 100%;
          max-width: 560px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.8);
          overflow-y: auto;
          max-height: 90vh;
        }
      ` }} />

      {saveStatus && (
        <div className="admin-flash-banner">
          {saveStatus}
        </div>
      )}

      <NavBar />

      <div className="admin-container">
        <div className="admin-header">
          <div className="admin-title-panel">PORTFOLIO CONTROL CENTER</div>
          <button onClick={handleResetAll} className="admin-btn-reset">KHÔI PHỤC MẶC ĐỊNH</button>
        </div>

        {/* TAB CONTROLS */}
        <div className="admin-tabs">
          <button className={`admin-tab-btn ${activeTab === "home" ? "active" : ""}`} onClick={() => setActiveTab("home")}>Trang Chủ</button>
          <button className={`admin-tab-btn ${activeTab === "info" ? "active" : ""}`} onClick={() => setActiveTab("info")}>Giới Thiệu (Info)</button>
          <button className={`admin-tab-btn ${activeTab === "skills" ? "active" : ""}`} onClick={() => setActiveTab("skills")}>Kỹ Năng (Skills)</button>
          <button className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`} onClick={() => setActiveTab("projects")}>Dự Án (Projects)</button>
          <button className={`admin-tab-btn ${activeTab === "contact" ? "active" : ""}`} onClick={() => setActiveTab("contact")}>Liên Hệ & Bình Luận</button>
        </div>

        {/* 1. HOME TAB */}
        {activeTab === "home" && (
          <form onSubmit={handleSaveHome}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>Cài Đặt Trang Chủ</h3>
            
            <div className="admin-form-group">
              <label className="admin-label">Dòng chữ 1 (Mono text ở góc)</label>
              <input type="text" className="admin-input" value={homeLine1} onChange={e => setHomeLine1(e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Dòng chữ 2 (Tiêu đề Tên)</label>
              <input type="text" className="admin-input" value={homeLine2} onChange={e => setHomeLine2(e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Các Tags (Phân tách bằng dấu phẩy)</label>
              <input type="text" className="admin-input" value={homeTags} onChange={e => setHomeTags(e.target.value)} />
            </div>

            <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "30px 0 15px 0" }}>Cấu Hình Màu Sắc Khối 3D (R3F Cube Grid)</h4>
            
            <div className="admin-form-group">
              <label className="admin-label">Màu Cạnh Cube (Neon Colors)</label>
              <div className="admin-row-grid">
                <div className="admin-color-picker-group">
                  <input type="color" className="admin-color-input" value={homeCubePink} onChange={e => setHomeCubePink(e.target.value)} />
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Cực Pink</span>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{homeCubePink}</div>
                  </div>
                </div>
                <div className="admin-color-picker-group">
                  <input type="color" className="admin-color-input" value={homeCubePurple} onChange={e => setHomeCubePurple(e.target.value)} />
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Cực Purple</span>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{homeCubePurple}</div>
                  </div>
                </div>
                <div className="admin-color-picker-group">
                  <input type="color" className="admin-color-input" value={homeCubeCyan} onChange={e => setHomeCubeCyan(e.target.value)} />
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Cực Cyan</span>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{homeCubeCyan}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-form-group" style={{ marginBottom: "30px" }}>
              <label className="admin-label">Màu Đế Cube (Base Colors)</label>
              <div className="admin-row-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
                <div className="admin-color-picker-group">
                  <input type="color" className="admin-color-input" value={homeCubeOrange} onChange={e => setHomeCubeOrange(e.target.value)} />
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Màu Cam đế</span>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{homeCubeOrange}</div>
                  </div>
                </div>
                <div className="admin-color-picker-group">
                  <input type="color" className="admin-color-input" value={homeCubeYellow} onChange={e => setHomeCubeYellow(e.target.value)} />
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>Màu Đỏ đô đế</span>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{homeCubeYellow}</div>
                  </div>
                </div>
              </div>
            </div>

            <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "40px 0 15px 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
              Cấu Hình Vật Lý & Hiệu Ứng Mạng Lưới 3D (R3F Grid Physics & Effects)
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
              <div className="admin-form-group">
                <label className="admin-label">Số ô lưới hiển thị (Visible Grid Size)</label>
                <input type="number" step="any" className="admin-input" value={sceneVisibleGridSize} onChange={e => setSceneVisibleGridSize(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Số lượng hàng/cột hiển thị thực tế (mặc định: 20)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Tổng ma trận lưới (Grid Matrix Size)</label>
                <input type="number" step="1" className="admin-input" value={sceneGridSize} onChange={e => setSceneGridSize(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Kích thước ma trận tính toán rộng x sâu (mặc định: 38)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Kích thước Cube (Cube Size)</label>
                <input type="number" step="any" className="admin-input" value={sceneCubeSize} onChange={e => setSceneCubeSize(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ dài cạnh của từng khối Cube (mặc định: 6.2)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Khoảng cách lưới (Grid Spacing)</label>
                <input type="number" step="any" className="admin-input" value={sceneGridSpacing} onChange={e => setSceneGridSpacing(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Khoảng cách tâm giữa các khối (mặc định: 10.2)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Chiều cao tối thiểu (Min Height)</label>
                <input type="number" step="any" className="admin-input" value={sceneMinH} onChange={e => setSceneMinH(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ cao tối thiểu khi khối nằm im (mặc định: 0.10)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Chiều cao tối đa (Max Height)</label>
                <input type="number" step="any" className="admin-input" value={sceneMaxH} onChange={e => setSceneMaxH(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ cao tối đa của khối khi hover chuột (mặc định: 6.0)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Bán kính ảnh hưởng (Hover Radius)</label>
                <input type="number" step="any" className="admin-input" value={sceneHoverR} onChange={e => setSceneHoverR(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Bán kính tác động xung quanh con trỏ chuột (mặc định: 15.0)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Tốc độ nhô lên (Lerp In)</label>
                <input type="number" step="any" className="admin-input" value={sceneLerpIn} onChange={e => setSceneLerpIn(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Tốc độ nhô lên của Cube khi hover (mặc định: 0.16)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Tốc độ chìm xuống (Lerp Out)</label>
                <input type="number" step="any" className="admin-input" value={sceneLerpOut} onChange={e => setSceneLerpOut(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Tốc độ lún xuống của Cube khi chuột rời đi (mặc định: 0.055)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ mờ lưới nền (BG Opacity)</label>
                <input type="number" step="any" className="admin-input" value={sceneBgOpa} onChange={e => setSceneBgOpa(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ mờ của đường kẻ lưới (+) dưới nền (mặc định: 0.06)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ dài cánh lưới nền (BG Arm)</label>
                <input type="number" step="any" className="admin-input" value={sceneBgArm} onChange={e => setSceneBgArm(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ dài của vạch lưới (+) dưới nền (mặc định: 1.60)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Sương mù bắt đầu (Fog Start)</label>
                <input type="number" step="any" className="admin-input" value={sceneFogStart} onChange={e => setSceneFogStart(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Khoảng cách bắt đầu hiệu ứng sương mù mờ dần (mặc định: 40.0)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Sương mù kết thúc (Fog End)</label>
                <input type="number" step="any" className="admin-input" value={sceneFogEnd} onChange={e => setSceneFogEnd(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Khoảng cách sương mù che phủ tối đen hoàn toàn (mặc định: 95.0)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ dày viền Cube (Line Thickness)</label>
                <input type="number" step="any" className="admin-input" value={sceneLineThickness} onChange={e => setSceneLineThickness(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ dày nét vẽ viền phát sáng của Cube (mặc định: 3.8)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Cường độ sáng (Bloom Strength)</label>
                <input type="number" step="any" className="admin-input" value={sceneBloomStrength} onChange={e => setSceneBloomStrength(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Cường độ phát sáng Bloom toàn cảnh (mặc định: 1.1)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Bán kính sáng (Bloom Radius)</label>
                <input type="number" step="any" className="admin-input" value={sceneBloomRadius} onChange={e => setSceneBloomRadius(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Bán kính khuếch tán ánh sáng Bloom (mặc định: 0.38)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Ngưỡng lọc sáng (Bloom Threshold)</label>
                <input type="number" step="any" className="admin-input" value={sceneBloomThreshold} onChange={e => setSceneBloomThreshold(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Ngưỡng lọc độ sáng Bloom (mặc định: 0.15)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ dày bệ đỡ (Base Plate Height)</label>
                <input type="number" step="any" className="admin-input" value={sceneBaseH} onChange={e => setSceneBaseH(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ dày bệ đỡ dưới chân Cube (mặc định: 0.15)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ trễ khi rảnh (Idle Timeout ms)</label>
                <input type="number" step="1" className="admin-input" value={sceneIdleMs} onChange={e => setSceneIdleMs(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Thời gian chờ chuột (ms) trước khi tạo sóng tự động (mặc định: 3000)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ lệch dọc Camera (Camera Y Offset)</label>
                <input type="number" step="any" className="admin-input" value={sceneCameraYOffset} onChange={e => setSceneCameraYOffset(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ lệch của camera isometric theo trục Y đứng (mặc định: 20)</span>
              </div>
            </div>

            <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "40px 0 15px 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "20px" }}>
              Cấu Hình Nâng Cao: Trạng Thái Cube, Ánh Sáng & Mặt Nền (Advanced Cube States, Lighting & Platform)
            </h4>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "30px" }}>
              <div className="admin-form-group">
                <label className="admin-label">Màu Thân Cube (Cube Solid Color)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" className="admin-color-input" style={{ width: "40px", height: "40px", padding: 0 }} value={sceneCubeSolidColor} onChange={e => setSceneCubeSolidColor(e.target.value)} />
                  <input type="text" className="admin-input" style={{ flex: 1 }} value={sceneCubeSolidColor} onChange={e => setSceneCubeSolidColor(e.target.value)} />
                </div>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Màu sắc phần thân khối đặc của Cube (mặc định: #010101)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Màu Ánh Sáng Môi Trường (Ambient Light Color)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" className="admin-color-input" style={{ width: "40px", height: "40px", padding: 0 }} value={sceneAmbientColor} onChange={e => setSceneAmbientColor(e.target.value)} />
                  <input type="text" className="admin-input" style={{ flex: 1 }} value={sceneAmbientColor} onChange={e => setSceneAmbientColor(e.target.value)} />
                </div>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Màu của nguồn sáng môi trường tỏa đều trong không gian (mặc định: #ffffff)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Màu Mặt Nền Đất (Platform Color)</label>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <input type="color" className="admin-color-input" style={{ width: "40px", height: "40px", padding: 0 }} value={scenePlatformColor} onChange={e => setScenePlatformColor(e.target.value)} />
                  <input type="text" className="admin-input" style={{ flex: 1 }} value={scenePlatformColor} onChange={e => setScenePlatformColor(e.target.value)} />
                </div>
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Màu của mặt sàn phẳng hấp thụ ánh sáng bên dưới các khối Cube (mặc định: #020202)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Cường Độ Sáng Môi Trường (Ambient Light Intensity)</label>
                <input type="number" step="any" className="admin-input" value={sceneAmbientIntensity} onChange={e => setSceneAmbientIntensity(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ sáng của AmbientLight, tăng lên để làm nổi bật các mặt Cube không đón đèn điểm (mặc định: 0.04)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ Kim Loại Thân Cube (Cube Metalness)</label>
                <input type="number" step="any" min="0" max="1" className="admin-input" value={sceneCubeMetalness} onChange={e => setSceneCubeMetalness(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Tính phản chiếu kim loại của bề mặt Cube. Giá trị từ 0.0 đến 1.0 (mặc định: 0.4)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ Nhám Thân Cube (Cube Roughness)</label>
                <input type="number" step="any" min="0" max="1" className="admin-input" value={sceneCubeRoughness} onChange={e => setSceneCubeRoughness(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ nhám mờ của bề mặt thân Cube. Giá trị từ 0.0 (phản chiếu gương) đến 1.0 (mờ hoàn toàn) (mặc định: 0.5)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ Kim Loại Mặt Nền (Platform Metalness)</label>
                <input type="number" step="any" min="0" max="1" className="admin-input" value={scenePlatformMetalness} onChange={e => setScenePlatformMetalness(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ phản chiếu kim loại của mặt sàn phẳng bên dưới. Từ 0.0 đến 1.0 (mặc định: 0.2)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ Nhám Mặt Nền (Platform Roughness)</label>
                <input type="number" step="any" min="0" max="1" className="admin-input" value={scenePlatformRoughness} onChange={e => setScenePlatformRoughness(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ nhám bề mặt của mặt sàn phẳng bên dưới. Từ 0.0 đến 1.0 (mặc định: 0.6)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Cường Độ Đèn Điểm 1 (Light 1 Intensity - Pink)</label>
                <input type="number" step="any" className="admin-input" value={sceneLight1Intensity} onChange={e => setSceneLight1Intensity(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ sáng của đèn điểm hồng ở góc trái không gian (mặc định: 1.5)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Cường Độ Đèn Điểm 2 (Light 2 Intensity - Cyan)</label>
                <input type="number" step="any" className="admin-input" value={sceneLight2Intensity} onChange={e => setSceneLight2Intensity(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Độ sáng của đèn điểm xanh ngọc ở góc phải không gian (mặc định: 1.5)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Độ Suy Hao Ánh Sáng Đèn (Light Decay)</label>
                <input type="number" step="any" className="admin-input" value={sceneLightDecay} onChange={e => setSceneLightDecay(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Tốc độ suy giảm độ sáng của các nguồn đèn điểm theo khoảng cách (mặc định: 1.5)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Hệ Số Khoảng Cách Đèn (Light Distance Factor)</label>
                <input type="number" step="any" className="admin-input" value={sceneLightDistanceFactor} onChange={e => setSceneLightDistanceFactor(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Bán kính chiếu sáng của đèn điểm (được nhân với kích thước lưới ma trận) (mặc định: 2.5)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Cấp Độ Cao Rảnh (Idle Height Steps)</label>
                <input type="number" step="1" className="admin-input" value={sceneIdleHeightSteps} onChange={e => setSceneIdleHeightSteps(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Số mức độ cao ngẫu nhiên khác nhau mà các khối Cube có thể nhấp nhô khi rảnh (mặc định: 5)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Hệ Số Nhân Chiều Cao Rảnh (Idle Height Multiplier)</label>
                <input type="number" step="any" className="admin-input" value={sceneIdleHeightMult} onChange={e => setSceneIdleHeightMult(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Hệ số nhân với bước độ cao ngẫu nhiên để xác định chiều cao mục tiêu của Cube khi rảnh (mặc định: 1.1)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">T.gian Cập Nhật Rảnh Cơ Bản (Idle Update Min ms)</label>
                <input type="number" step="1" className="admin-input" value={sceneIdleUpdateMin} onChange={e => setSceneIdleUpdateMin(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Khoảng thời gian tối thiểu (ms) mà một Cube giữ nguyên chiều cao rảnh trước khi đổi chiều cao mới (mặc định: 600)</span>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">T.gian Cập Nhật Rảnh Ngẫu Nhiên (Idle Update Rand ms)</label>
                <input type="number" step="1" className="admin-input" value={sceneIdleUpdateRand} onChange={e => setSceneIdleUpdateRand(e.target.value)} />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Khoảng thời gian ngẫu nhiên tối đa cộng thêm vào thời gian cơ bản để tạo hiệu ứng nhấp nhô so le (mặc định: 600)</span>
              </div>
            </div>

            <button type="submit" className="admin-btn-save">LƯU CÀI ĐẶT TRANG CHỦ</button>
          </form>
        )}

        {/* 2. INFO TAB */}
        {activeTab === "info" && (
          <form onSubmit={handleSaveInfo}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>Cài Đặt Trang Giới Thiệu (Information)</h3>
            
            <div className="admin-row-grid">
              <div className="admin-form-group">
                <label className="admin-label">Dòng Trạng Thái (Status)</label>
                <input type="text" className="admin-input" value={infoStatus} onChange={e => setInfoStatus(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Chữ Hiệu Ứng Gõ (Typing line)</label>
                <input type="text" className="admin-input" value={infoTyping} onChange={e => setInfoTyping(e.target.value)} />
              </div>
            </div>

            <div className="admin-row-grid">
              <div className="admin-form-group">
                <label className="admin-label">Tiêu Đề Trực Diện (Dòng trên)</label>
                <input type="text" className="admin-input" value={infoTitleTop} onChange={e => setInfoTitleTop(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Tiêu Đề Trực Diện (Dòng dưới)</label>
                <input type="text" className="admin-input" value={infoTitleBottom} onChange={e => setInfoTitleBottom(e.target.value)} />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Đoạn Mô Tả (Mỗi dòng là một thẻ xuống hàng, xuống hàng bằng Enter)</label>
              <textarea className="admin-textarea" value={infoDescription} onChange={e => setInfoDescription(e.target.value)} />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Các Tags bên dưới mô tả (Phân tách bằng dấu phẩy)</label>
              <input type="text" className="admin-input" value={infoTags} onChange={e => setInfoTags(e.target.value)} />
            </div>

            <div className="admin-row-grid">
              <div className="admin-form-group">
                <label className="admin-label">Dòng dẫn explore 1 (Skills)</label>
                <input type="text" className="admin-input" value={infoExplore1} onChange={e => setInfoExplore1(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Dòng dẫn explore 2 (Projects/Contact)</label>
                <input type="text" className="admin-input" value={infoExplore2} onChange={e => setInfoExplore2(e.target.value)} />
              </div>
            </div>

            <h4 style={{ fontSize: "1rem", fontWeight: 700, margin: "30px 0 15px 0" }}>Thông Tin Trên Thẻ Lanyard Card (Thẻ Rơi 3D)</h4>
            
            <div className="admin-row-grid">
              <div className="admin-form-group">
                <label className="admin-label">Tên hiển thị trên thẻ</label>
                <input type="text" className="admin-input" value={infoCardName} onChange={e => setInfoCardName(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Nơi công tác / Chức danh trên thẻ</label>
                <textarea className="admin-textarea" style={{ minHeight: "60px" }} value={infoCardTitle} onChange={e => setInfoCardTitle(e.target.value)} />
              </div>
            </div>

            <button type="submit" className="admin-btn-save" style={{ marginTop: "15px" }}>LƯU CÀI ĐẶT GIỚI THIỆU</button>
          </form>
        )}

        {/* 3. SKILLS TAB */}
        {activeTab === "skills" && (
          <div>
            <form onSubmit={handleSaveSkillsText} style={{ marginBottom: "40px" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>Cài Đặt Chữ Trang Kỹ Năng</h3>
              
              <div className="admin-form-group">
                <label className="admin-label">Dòng chữ nhỏ (Nhãn trên tiêu đề)</label>
                <input type="text" className="admin-input" value={skillsSub} onChange={e => setSkillsSub(e.target.value)} />
              </div>

              <div className="admin-row-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Tiêu đề - Chữ xanh</label>
                  <input type="text" className="admin-input" value={skillsTitle1} onChange={e => setSkillsTitle1(e.target.value)} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Tiêu đề - Chữ cam</label>
                  <input type="text" className="admin-input" value={skillsTitle2} onChange={e => setSkillsTitle2(e.target.value)} />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Dòng đánh máy (Typewriter text)</label>
                <input type="text" className="admin-input" value={skillsTypewriter} onChange={e => setSkillsTypewriter(e.target.value)} />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Đoạn Mô Tả bên dưới</label>
                <textarea className="admin-textarea" value={skillsDesc} onChange={e => setSkillsDesc(e.target.value)} />
              </div>

              <button type="submit" className="admin-btn-save">LƯU CHỮ TRANG SKILLS</button>
            </form>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "15px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "30px" }}>
              Danh Sách Phím Kỹ Năng (Keycaps Grid - Tối đa 16 phím)
            </h3>
            <button
              className="admin-btn-save"
              style={{ padding: "8px 18px", fontSize: "0.85rem", marginBottom: "15px" }}
              onClick={() => setEditingKeycap({ bg: "#ffffff", shadow: "#cccccc", color: "#000000", img: "/IMG/React.png", title: "New Skill", desc: "Mô tả kỹ năng mới.", isNew: true })}
            >
              + THÊM KEYCAP MỚI
            </button>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Logo</th>
                  <th>Tên phím</th>
                  <th>Mô tả</th>
                  <th>Màu sắc</th>
                  <th>Biểu đồ (Chart)</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {skillsKeycaps.map((k) => (
                  <tr key={k.title}>
                    <td>
                      <img src={k.img} className="admin-badge-image" alt="" />
                    </td>
                    <td style={{ fontWeight: 700 }}>{k.title}</td>
                    <td style={{ color: "rgba(255,255,255,0.6)", maxWidth: "300px" }}>{k.desc}</td>
                    <td>
                      <span style={{ display: "inline-block", width: "14px", height: "14px", borderRadius: "3px", backgroundColor: k.bg, border: "1px solid #555", marginRight: "6px", verticalAlign: "middle" }} />
                      <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.4)" }}>{k.bg}</span>
                    </td>
                    <td>{skillsTitleToChart[k.title] || "Không có (Static)"}</td>
                    <td>
                      <button className="action-icon-btn" onClick={() => setEditingKeycap({ ...k, originalTitle: k.title, chartName: skillsTitleToChart[k.title] || "" })}>
                        ✎
                      </button>
                      <button className="action-icon-btn delete" onClick={() => deleteKeycap(k.title)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, margin: "40px 0 15px 0", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "30px" }}>
              Kiểm Soát Biểu Đồ Tròn (Donut Chart Data)
            </h3>
            
            <table className="admin-table" style={{ marginBottom: "25px" }}>
              <thead>
                <tr>
                  <th>Tên kỹ năng</th>
                  <th>Tỷ trọng (%)</th>
                  <th>Màu sắc hiển thị</th>
                </tr>
              </thead>
              <tbody>
                {skillsChartData.map((c, index) => (
                  <tr key={c.name}>
                    <td style={{ fontWeight: 700 }}>{c.name}</td>
                    <td>
                      <input
                        type="number"
                        className="admin-input"
                        style={{ width: "90px", padding: "6px 10px" }}
                        value={c.pct}
                        onChange={e => updateChartItem(index, "pct", parseInt(e.target.value) || 0)}
                      />
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <input
                          type="color"
                          value={c.color}
                          onChange={e => updateChartItem(index, "color", e.target.value)}
                          style={{ width: "30px", height: "30px", border: "none", cursor: "pointer" }}
                        />
                        <span>{c.color}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="admin-btn-save" onClick={saveChartData}>LƯU DỮ LIỆU BIỂU ĐỒ</button>
          </div>
        )}

        {/* 4. PROJECTS TAB */}
        {activeTab === "projects" && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "15px" }}>Quản Lý Dự Án (Projects Showcase)</h3>
            
            <button
              className="admin-btn-save"
              style={{ padding: "8px 18px", fontSize: "0.85rem", marginBottom: "20px" }}
              onClick={() => setEditingProject({ id: `project_${Date.now()}`, category: "CATEGORY", shortName: "SHORT NAME", title: "Project Title", desc: "Mô tả dự án mới.", image: "/IMG/neoswap.png", role: "Developer", client: "Client Name", year: "2026", isNew: true })}
            >
              + THÊM DỰ ÁN MỚI
            </button>

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Tên dự án / Khách hàng</th>
                  <th>Mô tả</th>
                  <th>Năm / Vai trò</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {projectsList.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <img src={p.image} className="admin-badge-image" style={{ width: "60px", height: "40px", objectFit: "cover" }} alt="" />
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{p.title}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>Client: {p.client}</div>
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.6)", maxWidth: "350px" }}>{p.desc}</td>
                    <td>
                      <div>{p.year}</div>
                      <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{p.role}</div>
                    </td>
                    <td>
                      <button className="action-icon-btn" onClick={() => setEditingProject({ ...p, originalId: p.id })}>
                        ✎
                      </button>
                      <button className="action-icon-btn delete" onClick={() => deleteProject(p.id)}>
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 5. CONTACT TAB */}
        {activeTab === "contact" && (
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "15px" }}>Quản Lý Mạng Xã Hội (Connect With Me)</h3>
            <button
              className="admin-btn-save"
              style={{ padding: "8px 18px", fontSize: "0.85rem", marginBottom: "15px" }}
              onClick={addNewSocial}
            >
              + LIÊN KẾT MẠNG XÃ HỘI KHÁC
            </button>

            <table className="admin-table" style={{ marginBottom: "40px" }}>
              <thead>
                <tr>
                  <th>Tên Mạng Xã Hội</th>
                  <th>Đường dẫn (URL)</th>
                  <th>Tên Handle hiển thị</th>
                  <th>Thẻ rộng (Bento)</th>
                  <th>Trạng thái hiển thị</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {socialsList.map((s, index) => (
                  <tr key={s.type}>
                    <td style={{ fontWeight: 700 }}>{s.type}</td>
                    <td>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ padding: "6px 10px" }}
                        value={s.url}
                        onChange={e => updateSocialItem(index, "url", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="admin-input"
                        style={{ padding: "6px 10px" }}
                        value={s.handle}
                        onChange={e => updateSocialItem(index, "handle", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={s.large}
                        onChange={e => updateSocialItem(index, "large", e.target.checked)}
                      />
                    </td>
                    <td>
                      <select
                        className="admin-input"
                        style={{ padding: "6px 10px", width: "120px" }}
                        value={s.visible ? "true" : "false"}
                        onChange={e => updateSocialItem(index, "visible", e.target.value === "true")}
                      >
                        <option value="true">Hiển thị</option>
                        <option value="false">Ẩn</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="action-icon-btn delete"
                        onClick={() => {
                          if (window.confirm("Xóa liên kết mạng xã hội này?")) {
                            const updated = socialsList.filter((_, idx) => idx !== index);
                            setSocialsList(updated);
                            localStorage.setItem("contact_socials", JSON.stringify(updated));
                            flashSaveMessage();
                          }
                        }}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="admin-btn-save" onClick={saveSocialLinks} style={{ marginBottom: "40px" }}>LƯU LIÊN KẾT MẠNG XÃ HỘI</button>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "15px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "30px" }}>
              Cấu Hình Nhận Email Liên Hệ (Auto Email Forwarding)
            </h3>
            <form onSubmit={handleSaveContactEmail} style={{ marginBottom: "40px" }}>
              <div className="admin-form-group">
                <label className="admin-label">Email Nhận Tin Nhắn (Receiver Email)</label>
                <input
                  type="email"
                  className="admin-input"
                  placeholder="ví dụ: ttrungthanh90@gmail.com"
                  value={contactReceiverEmail}
                  onChange={e => setContactReceiverEmail(e.target.value)}
                  required
                />
                <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>
                  Email này sẽ nhận được nội dung tin nhắn tự động từ FormSubmit khi có người gửi tin nhắn ở mục "Contact Me" (Mặc định: ttrungthanh90@gmail.com).
                </span>
              </div>
              <button type="submit" className="admin-btn-save" style={{ marginTop: "10px" }}>LƯU EMAIL NHẬN TIN</button>
            </form>

            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "15px", borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "30px" }}>
              Quản Lý Bình Luận Lưu Bút (Guestbook Comments)
            </h3>
            
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tác giả</th>
                  <th>Nội dung bình luận</th>
                  <th>Đính kèm</th>
                  <th>Lượt thích (Likes)</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {commentsList.map((c) => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 700 }}>
                      {c.author} {c.pinned && <span style={{ color: "#c084fc", fontSize: "0.75rem", border: "1px solid #a855f7", padding: "1px 4px", borderRadius: "3px", marginLeft: "4px" }}>Ghim</span>}
                    </td>
                    <td style={{ color: "rgba(255,255,255,0.75)", maxWidth: "400px" }}>{c.text}</td>
                    <td>
                      {c.image ? <img src={c.image} className="admin-badge-image" style={{ width: "40px", height: "30px", objectFit: "cover" }} alt="" /> : "Không"}
                    </td>
                    <td>❤️ {c.likes}</td>
                    <td>
                      <button 
                        className="action-icon-btn" 
                        onClick={() => togglePinComment(c.id)} 
                        title={c.pinned ? "Bỏ ghim bình luận" : "Ghim bình luận"}
                        style={{ 
                          color: c.pinned ? "#c084fc" : "inherit", 
                          borderColor: c.pinned ? "#a855f7" : "rgba(255,255,255,0.08)",
                          padding: "0 8px",
                          width: "auto",
                          fontSize: "0.8rem",
                          fontWeight: 600
                        }}
                      >
                        📌 {c.pinned ? "Bỏ Ghim" : "Ghim"}
                      </button>
                      <button className="action-icon-btn delete" onClick={() => deleteComment(c.id)} title="Xóa bình luận" style={{ padding: "0 8px", width: "auto" }}>
                        ✕ Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* KEYCAP EDIT MODAL */}
      {editingKeycap && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              {editingKeycap.isNew ? "Thêm Kỹ Năng Mới" : "Sửa Kỹ Năng"}
            </h3>
            <form onSubmit={saveEditingKeycap}>
              <div className="admin-form-group">
                <label className="admin-label">Tên Kỹ Năng (Tiêu đề phím)</label>
                <input type="text" className="admin-input" required value={editingKeycap.title} onChange={e => setEditingKeycap({ ...editingKeycap, title: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Mô tả ngắn</label>
                <textarea className="admin-textarea" required value={editingKeycap.desc} onChange={e => setEditingKeycap({ ...editingKeycap, desc: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Đường dẫn ảnh Logo (Ví dụ: /IMG/React.png)</label>
                <input type="text" className="admin-input" required value={editingKeycap.img} onChange={e => setEditingKeycap({ ...editingKeycap, img: e.target.value })} />
              </div>
              <div className="admin-row-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Màu Nền Phím (Hex)</label>
                  <input type="color" style={{ width: "100%", height: "40px", cursor: "pointer" }} value={editingKeycap.bg} onChange={e => setEditingKeycap({ ...editingKeycap, bg: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Màu Shadow Phím</label>
                  <input type="color" style={{ width: "100%", height: "40px", cursor: "pointer" }} value={editingKeycap.shadow} onChange={e => setEditingKeycap({ ...editingKeycap, shadow: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Màu chữ (Hex)</label>
                <input type="color" style={{ width: "100%", height: "40px", cursor: "pointer" }} value={editingKeycap.color} onChange={e => setEditingKeycap({ ...editingKeycap, color: e.target.value })} />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Liên kết tới danh mục Biểu Đồ Tròn (Chọn mục có sẵn hoặc bỏ trống)</label>
                <select className="admin-input" value={editingKeycap.chartName || ""} onChange={e => setEditingKeycap({ ...editingKeycap, chartName: e.target.value })}>
                  <option value="">Không liên kết (Tĩnh)</option>
                  {skillsChartData.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "30px", justifyContent: "flex-end" }}>
                <button type="button" className="admin-btn-reset" style={{ padding: "10px 20px" }} onClick={() => setEditingKeycap(null)}>Hủy</button>
                <button type="submit" className="admin-btn-save" style={{ padding: "10px 20px" }}>Lưu Kỹ Năng</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT EDIT MODAL */}
      {editingProject && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-card">
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "20px" }}>
              {editingProject.isNew ? "Thêm Dự Án Mới" : "Sửa Dự Án"}
            </h3>
            <form onSubmit={saveProject}>
              <div className="admin-row-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Mã ID (Duy nhất, viết liền)</label>
                  <input type="text" className="admin-input" required disabled={!editingProject.isNew} value={editingProject.id} onChange={e => setEditingProject({ ...editingProject, id: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Danh Mục (Ví dụ: AI & COGNITION)</label>
                  <input type="text" className="admin-input" required value={editingProject.category} onChange={e => setEditingProject({ ...editingProject, category: e.target.value })} />
                </div>
              </div>

              <div className="admin-row-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Tên Ngắn (Bản rút gọn)</label>
                  <input type="text" className="admin-input" required value={editingProject.shortName} onChange={e => setEditingProject({ ...editingProject, shortName: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Tiêu Đề Đầy Đủ</label>
                  <input type="text" className="admin-input" required value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Mô tả chi tiết dự án</label>
                <textarea className="admin-textarea" required value={editingProject.desc} onChange={e => setEditingProject({ ...editingProject, desc: e.target.value })} />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Đường dẫn ảnh Thumbnail (Ví dụ: /IMG/neoswap.png)</label>
                <input type="text" className="admin-input" required value={editingProject.image} onChange={e => setEditingProject({ ...editingProject, image: e.target.value })} />
              </div>

              <div className="admin-row-grid">
                <div className="admin-form-group">
                  <label className="admin-label">Khách Hàng (Client)</label>
                  <input type="text" className="admin-input" required value={editingProject.client} onChange={e => setEditingProject({ ...editingProject, client: e.target.value })} />
                </div>
                <div className="admin-form-group">
                  <label className="admin-label">Năm thực hiện</label>
                  <input type="text" className="admin-input" required value={editingProject.year} onChange={e => setEditingProject({ ...editingProject, year: e.target.value })} />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Vai Trò (Role)</label>
                <input type="text" className="admin-input" required value={editingProject.role} onChange={e => setEditingProject({ ...editingProject, role: e.target.value })} />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "30px", justifyContent: "flex-end" }}>
                <button type="button" className="admin-btn-reset" style={{ padding: "10px 20px" }} onClick={() => setEditingProject(null)}>Hủy</button>
                <button type="submit" className="admin-btn-save" style={{ padding: "10px 20px" }}>Lưu Dự Án</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
