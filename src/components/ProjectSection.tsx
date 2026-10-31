import { useEffect, useRef, useState } from "react";
import { NavBar } from "./NavBar";
import { useLang } from "@/lib/i18n";

// Tài khoản GitHub dùng để lấy danh sách dự án
const GITHUB_USER = "Tthanh2k6";

// Ảnh OpenGraph tự sinh của GitHub cho từng repo (card xã hội đẹp, luôn có sẵn)
const ghImage = (repo: string) =>
  `https://opengraph.githubassets.com/1/${GITHUB_USER}/${repo}`;

// Ảnh chụp màn hình thật của từng dự án (đặt trong thư mục public IMG/).
// Được ưu tiên hơn ảnh OpenGraph; nếu thiếu file, <img onError> sẽ tự rơi về ảnh GitHub.
const REPO_IMAGES: Record<string, string> = {
  "ai-automation-and-rag-toolkit": "/IMG/project-rag-toolkit.png",
  "apify-b2b-lead-and-contact-enricher": "/IMG/project-apify-b2b.png",
  "apify-ecommerce-price-and-stock-monitor": "/IMG/project-apify-ecommerce.png",
  "apify-us-healthcare-clinic-contact-enricher": "/IMG/project-apify-healthcare.png",
  "apify-multi-stop-route-and-distance-optimizer": "/IMG/project-apify-route.png",
  "burgershop-pod-tool": "/IMG/project-pod-extension.png",
  "web-scraping-showcase": "/IMG/project-scraping.png",
  "vn-sme-offline-tools": "/IMG/project-vn-sme-tools.png",
  DiemDanhQR: "/IMG/project-diemdanhqr.jpg",
  AI_Lab: "/IMG/project-ailab.png",
  KNN: "/IMG/project-knn.png",
  "H-c-AI-ML": "/IMG/project-aiml.png",
  Portfolio: "/IMG/project-portfolio.png",
  // Dự án private (không công khai code) — chỉ hiển thị ảnh demo, thả file vào public/IMG/
  AutoTool: "/IMG/project-autotool.png",
  WorkFlowAI: "/IMG/project-workflowai.png",
  MadalenaApp: "/IMG/project-madalena-app.png",
  MadalenaWeb: "/IMG/project-madalena-web.png",
  LichIUH: "/IMG/project-lichiuh.png",
  NoteMod: "/IMG/project-notemod.png",
  ToolPhone: "/IMG/project-toolphone.png",
  Sothuchi: "/IMG/project-sothuchi.png",
  "NCKH-PeopleCount": "/IMG/project-peoplecount.png",
};
// Ảnh dùng cho card: ưu tiên ảnh chụp local, không có thì dùng ảnh OpenGraph của GitHub
const projectImage = (repo: string) => REPO_IMAGES[repo] || ghImage(repo);

// Ghi đè thông tin (tên, mô tả, vai trò) cho từng repo GitHub.
// Bản fetch GitHub chỉ trả về tên + mô tả thô của repo; map này dùng để hiển thị
// đúng vai trò trên từng dự án — áp cho cả danh sách tĩnh lẫn bản fetch.
// Lưu ý: key phải trùng TÊN REPO thật trên GitHub (vd AI-ML nằm ở repo "H-c-AI-ML").
//
// Mỗi dự án có HAI mức mô tả, đừng gộp làm một:
//   desc   — câu ngắn hiện trên card. Viết cho NGƯỜI KHÔNG RÀNH KỸ THUẬT: nói dự án
//            làm được gì cho người dùng, tránh tên công nghệ và từ chuyên ngành.
//            Card bị -webkit-line-clamp: 3 nên viết dài là bị cắt ngang kèm "…".
//            Giữ dưới ~130 ký tự.
//   detail  — bản đầy đủ trong modal "Xem chi tiết", viết cho NHÀ TUYỂN DỤNG: đi sâu
//            vào cách giải quyết vấn đề, quyết định kỹ thuật và kết quả đạt được.
//   tech    — danh sách công nghệ, hiện dạng chip trong modal.
const REPO_META: Record<string, any> = {
  "ai-automation-and-rag-toolkit": {
    category: "OPENAI • HYBRID RAG • FASTAPI",
    shortName: "AI & RAG TOOLKIT",
    shortNameEn: "AI & RAG TOOLKIT",
    title: "AI Automation & Hybrid RAG | Kiến trúc AI chuẩn Schema",
    titleEn: "AI Automation & Hybrid RAG Reference Architecture",
    desc: "Bộ mã mẫu AI: tìm kiếm lai BM25 + Vector, ép AI trả JSON đúng schema và kiểm thử phân quyền PostgreSQL.",
    descEn:
      "Open-source AI & automation reference code: Hybrid BM25 + Vector RRF retrieval, schema-validated OpenAI Structured Outputs & FastAPI backpressure.",
    detailEn:
      "An open-source reference toolkit (with pytest suites, not yet used by paying clients) covering three common failure points in AI and workflow engineering:\n\n1. Structured LLM Router (FastAPI + Pydantic Strict JSON Schemas): Replaces brittle regex markdown parsing with schema-validated OpenAI/Anthropic Structured Outputs, idempotency keys, dead-letter webhook routing, and async stream backpressure control.\n\n2. Hybrid RAG Engine (`BM25` + Dense Vector `Reciprocal Rank Fusion`): Combines exact SKU/part-number lexical recall with semantic dense embeddings so technical queries never miss exact identifiers.\n\n3. Multi-Tenant PostgreSQL RLS Auditing (`pgTAP`) & Apps Script Route Optimizer: Ships automated SQL security assertions verifying tenant isolation plus a zero-infrastructure Google Sheets route optimization module.",
    detail:
      "Bộ mã tham chiếu mã nguồn mở (có bộ test pytest, chưa có khách trả phí dùng) xử lý 3 điểm hay gãy khi đưa AI và tự động hoá vào công việc:\n\n1. Cổng điều phối LLM ép kiểu chặt (FastAPI + Pydantic Strict JSON Schemas): Kiểm tra JSON AI trả về theo schema thay vì bóc tách bằng regex, tích hợp khoá chống xử lý trùng (idempotency), định tuyến webhook lỗi và kiểm soát nghẽn luồng (backpressure).\n\n2. Động cơ Hybrid RAG (`BM25` + Vector `Reciprocal Rank Fusion`): Kết hợp tìm kiếm từ khoá chính xác cho mã SKU/mã linh kiện với tìm kiếm ngữ nghĩa vector.\n\n3. Kiểm toán phân quyền PostgreSQL RLS tự động bằng `pgTAP` kèm module tối ưu lộ trình chạy thẳng trên Google Apps Script.",
    tech: ["Python", "FastAPI", "OpenAI API", "Hybrid RAG", "PostgreSQL RLS", "pgTAP", "Apps Script"],
    role: "AI & Backend Systems Engineer",
    roleEn: "AI & Backend Systems Engineer",
    client: "Mã nguồn mở",
    clientEn: "Open-source reference toolkit",
    yearRole: "2026 • FastAPI & OpenAI",
    demo: "https://dev.to/tthanh2k6/eliminating-broken-llm-json-in-production-workflows-nodejs-fastapi-n8n-strict-schemas-3fli",
    demoLabel: "Đọc bài phân tích kỹ thuật",
    demoLabelEn: "Read Engineering Deep-Dive",
  },
  "apify-b2b-lead-and-contact-enricher": {
    category: "APIFY STORE • PYTHON",
    shortName: "B2B LEAD ENRICHER",
    shortNameEn: "B2B LEAD ENRICHER",
    title: "B2B Contact & Tech Stack Enricher | Apify Actor",
    titleEn: "B2B Website Contact & Tech Stack Enricher (Apify Actor)",
    desc: "Actor công khai trên Apify Store: từ danh sách website công ty, lấy email, số điện thoại, mạng xã hội và công nghệ web đang dùng.",
    descEn:
      "Public Apify Store Actor: give it company websites, get back emails, phone numbers, social links and the web technologies they use.",
    detailEn:
      "A public Actor on the Apify Store (`thanh81646/apify-b2b-lead-and-contact-enricher`). It has had a handful of test runs and no paying users yet.\n\nInstead of launching a headless browser, it uses a bounded `httpx.AsyncClient` pool to fetch a company's homepage plus likely contact pages (`/contact`, `/about`, `/legal`). It pulls out de-obfuscated email addresses, normalised phone numbers, social profiles, `Schema.org` Organization JSON-LD and around 30 technology fingerprints (Shopify, HubSpot, WordPress, Stripe, Intercom, GTM), with output shaped for Clay, n8n or a CRM import.\n\nLimitation worth knowing: emails are taken as they appear on the site. There is no MX or SMTP check, so deliverability is not verified.",
    detail:
      "Actor công khai trên Apify Store (`thanh81646/apify-b2b-lead-and-contact-enricher`). Mới có vài lượt chạy thử, chưa có người dùng trả phí.\n\nThay vì bật trình duyệt không đầu, Actor dùng nhóm kết nối `httpx.AsyncClient` có giới hạn để tải trang chủ công ty cùng các trang hay chứa liên hệ (`/contact`, `/about`, `/impressum`). Trích xuất email (kể cả email bị viết lách để chống bot), chuẩn hoá số điện thoại, mạng xã hội, `Schema.org` JSON-LD và khoảng 30 dấu hiệu công nghệ web, xuất ra dạng dùng được ngay cho Clay, n8n hoặc CRM.\n\nGiới hạn cần biết: email được lấy đúng như trên website, chưa kiểm tra MX hay SMTP nên không đảm bảo email còn nhận thư.",
    tech: ["Python", "Async HTTPX", "BeautifulSoup4", "JSON-LD", "Apify SDK"],
    role: "Creator & Data Engineer",
    roleEn: "Creator & Data Engineer",
    client: "Apify Store (Actor công khai)",
    clientEn: "Apify Store (public Actor)",
    yearRole: "2026 • Apify Actor",
    demo: "https://apify.com/thanh81646/apify-b2b-lead-and-contact-enricher",
    demoLabel: "Xem trên Apify Store",
    demoLabelEn: "View on Apify Store",
  },
  "apify-ecommerce-price-and-stock-monitor": {
    category: "APIFY STORE • E-COMMERCE • PYTHON",
    shortName: "PRICE & STOCK MONITOR",
    shortNameEn: "PRICE & STOCK MONITOR",
    title: "Shopify & WooCommerce Price Monitor | Apify Actor",
    titleEn: "Shopify & WooCommerce Price, Stock & JSON-LD Monitor",
    desc: "Đọc giá bán, giá gốc và tình trạng còn hàng của sản phẩm trên cửa hàng Shopify/WooCommerce mà không cần mở trình duyệt.",
    descEn:
      "Public Apify Actor reading product price, compare-at price and stock status from Shopify/WooCommerce stores without a browser.",
    detailEn:
      "A public Actor on the Apify Store for watching competitor prices. A handful of runs so far, no paying users yet.\n\nIt looks for structured data first (Shopify `/products.json`, WooCommerce Store API, `Schema.org/Product` JSON-LD) and only falls back to OpenGraph/HTML selectors when none is found. It returns price, compare-at price, currency, SKU and an `in_stock` flag. Reading the JSON directly is lighter and faster than rendering the page in a headless browser.\n\nLimitation: from JSON-LD it reads only the first offer, so stock is reported per product, not per variant.",
    detail:
      "Actor công khai trên Apify Store phục vụ việc theo dõi giá đối thủ. Mới có vài lượt chạy, chưa có người dùng trả phí.\n\nActor ưu tiên dữ liệu có cấu trúc (Shopify `/products.json`, WooCommerce Store API, khối `Schema.org/Product` JSON-LD), chỉ khi không có mới rơi về đọc thẻ OpenGraph/HTML. Trả về giá bán, giá gốc trước giảm, đơn vị tiền tệ, mã SKU và cờ còn hàng `in_stock`. Đọc thẳng JSON nhẹ và nhanh hơn nhiều so với mở trang bằng trình duyệt.\n\nGiới hạn: với JSON-LD chỉ đọc offer đầu tiên, nên tồn kho tính theo sản phẩm chứ chưa tách theo từng biến thể.",
    tech: ["Python", "Async HTTPX", "JSON-LD", "Shopify API", "WooCommerce", "Apify SDK"],
    role: "Creator & Data Engineer",
    roleEn: "Creator & Data Engineer",
    client: "Apify Store (Actor công khai)",
    clientEn: "Apify Store (public Actor)",
    yearRole: "2026 • E-Commerce Data",
    demo: "https://apify.com/thanh81646/apify-ecommerce-price-and-stock-monitor",
    demoLabel: "Xem trên Apify Store",
    demoLabelEn: "View on Apify Store",
  },
  "apify-us-healthcare-clinic-contact-enricher": {
    category: "APIFY STORE • HEALTHCARE B2B",
    shortName: "US CLINIC ENRICHER",
    shortNameEn: "US CLINIC ENRICHER",
    title: "US Healthcare Clinic Contact Enricher | Apify Actor",
    titleEn: "US Healthcare Clinic Contact Enricher (Apify Actor)",
    desc: "Lấy thông tin liên hệ từ website phòng khám nha khoa, y tế, thú y tại Mỹ và đoán phòng khám độc lập hay thuộc chuỗi.",
    descEn:
      "Pulls contact details from US dental, medical and vet clinic websites and guesses whether each is independent or part of a chain.",
    detailEn:
      "A public Actor on the Apify Store aimed at teams that sell to independent US practices. A handful of runs so far, no paying users yet.\n\nIt crawls dental, medical, audiology and veterinary clinic websites and extracts phone numbers, emails, addresses and `MedicalOrganization` / `Dentist` JSON-LD. A keyword heuristic (brand names such as Heartland Dental, Aspen, PDS, Banfield, plus common corporate wording) flags clinics that look like part of a chain, so they can be filtered out.\n\nWhat it does not do: no NPI registry lookup and no detection of online booking widgets. The chain flag is a heuristic, not a verified classification.",
    detail:
      "Actor công khai trên Apify Store dành cho đội bán hàng nhắm tới phòng khám tư nhân độc lập tại Mỹ. Mới có vài lượt chạy, chưa có người dùng trả phí.\n\nActor quét website phòng khám nha khoa, đa khoa, thính học và thú y để lấy số điện thoại, email, địa chỉ và dữ liệu `MedicalOrganization` / `Dentist` JSON-LD. Một bộ luật theo từ khoá (tên chuỗi như Heartland Dental, Aspen, PDS, Banfield và các cụm từ kiểu tập đoàn) đánh dấu phòng khám có vẻ thuộc chuỗi để lọc bớt.\n\nChưa làm: chưa tra cứu sổ NPI và chưa nhận diện widget đặt lịch khám. Cờ thuộc chuỗi chỉ là ước đoán theo từ khoá, chưa phải phân loại đã kiểm chứng.",
    tech: ["Python", "Async HTTPX", "BeautifulSoup4", "Healthcare JSON-LD", "Apify SDK"],
    role: "Creator & Data Engineer",
    roleEn: "Creator & Data Engineer",
    client: "Apify Store (Actor công khai)",
    clientEn: "Apify Store (public Actor)",
    yearRole: "2026 • Healthcare B2B Data",
    demo: "https://apify.com/thanh81646/apify-us-healthcare-clinic-contact-enricher",
    demoLabel: "Xem trên Apify Store",
    demoLabelEn: "View on Apify Store",
  },
  "apify-malaysia-kpkt-teduh-property-scraper": {
    category: "APIFY STORE • PROPTECH SEA",
    shortName: "KPKT TEDUH SCRAPER",
    shortNameEn: "KPKT TEDUH SCRAPER",
    title: "Malaysia KPKT Property Registry | Apify Actor",
    titleEn: "Malaysia KPKT TEDUH Property Developers & Projects Extractor",
    desc: "Lấy danh sách chủ đầu tư bất động sản và dự án nhà ở được cấp phép từ cổng KPKT TEDUH của Malaysia, xuất ra JSON/CSV.",
    descEn:
      "Public Apify Actor listing licensed Malaysian property developers and housing projects from the KPKT TEDUH portal as JSON/CSV.",
    detailEn:
      "A public Actor on the Apify Store targeting the Malaysian Ministry of Housing and Local Government registry (`teduh.kpkt.gov.my`). A handful of runs so far, no paying users yet.\n\nIt normalises licensed private housing developers (`Pemaju Perumahan Swasta`), company registration numbers, contact details, statuses and housing project records into flat JSON/CSV.\n\nLimitation: when the portal's API fails, the Actor falls back to sample rows instead of returning live data, so a run's output should be checked before it is relied on.",
    detail:
      "Actor công khai trên Apify Store lấy dữ liệu từ cổng của Bộ Nhà ở & Chính quyền Địa phương Malaysia (`teduh.kpkt.gov.my`). Mới có vài lượt chạy, chưa có người dùng trả phí.\n\nChuẩn hoá danh sách chủ đầu tư bất động sản được cấp phép (`Pemaju Perumahan Swasta`), mã đăng ký doanh nghiệp, thông tin liên hệ, tình trạng và danh mục dự án thành tập JSON/CSV phẳng.\n\nGiới hạn: khi API của cổng lỗi, Actor rơi về dữ liệu mẫu thay vì dữ liệu thật, nên cần kiểm tra kết quả mỗi lần chạy trước khi dùng.",
    tech: ["Python", "Async HTTPX", "BeautifulSoup4", "Data Normalization", "Apify SDK"],
    role: "Creator & Data Engineer",
    roleEn: "Creator & Data Engineer",
    client: "Apify Store (Actor công khai)",
    clientEn: "Apify Store (public Actor)",
    yearRole: "2026 • SEA PropTech Data",
    demo: "https://apify.com/thanh81646/malaysia-kpkt-teduh-property-developer-scraper",
    demoLabel: "Xem trên Apify Store",
    demoLabelEn: "View on Apify Store",
  },
  "apify-multi-stop-route-and-distance-optimizer": {
    category: "PYTHON • ALGORITHMS • LOGISTICS",
    shortName: "2-OPT ROUTE OPTIMIZER",
    shortNameEn: "2-OPT ROUTE OPTIMIZER",
    title: "Multi-Stop 2-Opt Route Optimizer | Tối ưu lộ trình",
    titleEn: "Multi-Stop Geocoder & 2-Opt TSP Route Optimizer",
    desc: "Tự động chuyển địa chỉ sang toạ độ, sắp xếp thứ tự giao hàng cho quãng đường ngắn hơn và xuất link Google Maps một chạm.",
    descEn:
      "Public Apify Actor: geocodes a stop list, orders the stops with Nearest-Neighbor + 2-Opt and builds a multi-stop Google Maps link.",
    detailEn:
      "A public Apify Actor (a handful of runs, no paying users yet) combining async OpenStreetMap Nominatim geocoding with a deterministic Nearest-Neighbor + `2-Opt` local-search Travelling Salesperson solver.\n\nValidates shift time windows, computes Haversine/road-adjusted leg durations, removes route crossovers, and outputs ready-to-tap multi-stop Google Maps navigation URLs for delivery drivers and field reps.",
    detail:
      "Actor công khai trên Apify (mới có vài lượt chạy, chưa có người dùng trả phí) tối ưu lộ trình giao hàng: kết hợp giải mã toạ độ địa lý bất đồng bộ (OSM Nominatim) với thuật toán bài toán người du lịch Nearest-Neighbor + cải thiện cục bộ `2-Opt`.\n\nKiểm tra ràng buộc khung giờ ca làm việc, loại bỏ các đoạn đường cắt chéo và sinh liên kết dẫn đường nhiều điểm trên Google Maps mở được ngay trên điện thoại tài xế.",
    tech: ["Python", "2-Opt TSP", "Async HTTPX", "OSM Nominatim", "Apify SDK"],
    role: "Algorithm & Python Engineer",
    roleEn: "Algorithm & Python Engineer",
    client: "Apify & Open-source",
    clientEn: "Apify & Open-source",
    yearRole: "2026 • Logistics Optimization",
    demo: "https://dev.to/tthanh2k6/engineering-sub-second-b2b-lead-enrichment-2-opt-route-optimization-pipelines-in-python-1le8",
    demoLabel: "Đọc bài viết kỹ thuật",
    demoLabelEn: "Read the write-up",
  },
  "vn-sme-offline-tools": {
    category: "HTML • VANILLA JS • OFFLINE",
    shortName: "VN SME OFFLINE TOOLS",
    shortNameEn: "VN SME OFFLINE TOOLS",
    title: "VN SME Offline Tools | Công cụ offline cho hộ kinh doanh",
    titleEn: "VN SME Offline Tools | Browser Tools for Vietnamese Small Businesses",
    desc: "9 công cụ chạy ngay trong trình duyệt, không cần mạng: VietQR thu ngân, công nợ, báo giá sỉ, đối soát đội xe, hoá đơn XML...",
    descEn:
      "Nine offline browser tools for Vietnamese small businesses: VietQR cashier, receivables, quotes, fleet fuel checks, e-invoice XML.",
    detailEn:
      "Nine single-file HTML tools for Vietnamese household businesses and small companies. Each page is vanilla JavaScript with no server, no build step and no account; data stays on the device, and the few network features (a Google Apps Script webhook, a published Google Sheets price list, the public VietQR image API) are off by default.\n\nThe set: a dynamic VietQR cashier that reads confirmed payments aloud, B2B receivables aging with A4 confirmation letters and Zalo reminder drafts, a wholesale and corporate gift quote builder (tiered discounts, split 8%/10% VAT), a clinic/academy commission and installment tracker, an import landed-cost allocator, an e-invoice XML and Shopee/TikTok Shop payout reconciler, a fleet fuel, VETC toll and driver pay reconciler that imports Excel/CSV, a year-end party QR check-in and lucky draw, and a nail salon booking page.\n\nBuilt as demos and templates: the sample data uses placeholder names, tax IDs and bank accounts, and fields need adapting to each business.",
    detail:
      "9 công cụ HTML một tệp dành cho hộ kinh doanh và doanh nghiệp nhỏ Việt Nam. Mỗi trang viết bằng JavaScript thuần, không máy chủ, không cần build, không cần tài khoản; dữ liệu nằm trên máy người dùng, còn vài tính năng có dùng mạng (webhook Google Apps Script, bảng giá từ Google Sheets, ảnh QR từ API VietQR công khai) đều tắt sẵn.\n\nGồm: VietQR động cho quầy thu ngân có đọc to số tiền khi nhận, thu hồi & đối chiếu công nợ B2B (in thư xác nhận A4, soạn sẵn tin nhắc Zalo), báo giá sỉ & quà tặng doanh nghiệp (chiết khấu theo bậc, tách VAT 8%/10%), hoa hồng & trả góp cho phòng khám/học viện, phân bổ giá vốn hàng nhập khẩu, đối soát hoá đơn điện tử XML & tiền về từ Shopee/TikTok Shop, đối soát dầu, vé VETC và lương tài xế đội xe (nhập Excel/CSV), check-in QR & quay số tiệc cuối năm, và trang đặt lịch tiệm nail.\n\nLàm ở dạng bản mẫu: dữ liệu mẫu dùng tên, mã số thuế và số tài khoản giả, cần chỉnh trường cho từng doanh nghiệp.",
    tech: ["HTML", "Vanilla JavaScript", "VietQR / EMVCo", "localStorage", "Print CSS"],
    role: "Developer",
    roleEn: "Developer",
    client: "Dự án mã nguồn mở",
    clientEn: "Open-source project",
    yearRole: "2026 • HTML & JavaScript",
    demo: "https://tthanh2k6.github.io/vn-sme-offline-tools/",
    demoLabel: "Mở bản chạy thử",
    demoLabelEn: "Open live demo",
  },
  "burgershop-pod-tool": {
    category: "CHROME MV3 • BROWSER AUTOMATION",
    shortName: "POD ADMIN EXTENSION",
    shortNameEn: "POD ADMIN EXTENSION",
    title: "BurgerShop POD Tool | Chrome Extension tự động đăng hàng",
    titleEn: "BurgerShop POD Listing Automator (Chrome MV3 Extension)",
    desc: "Tiện ích Chrome tự động điền form nhiều bước, bảng cuộn ảo PrimeNG và trình soạn thảo TinyMCE trên trang quản trị bán hàng.",
    descEn:
      "Manifest V3 Chrome Extension automating multi-step Angular/PrimeNG virtual-scroll variant tables & TinyMCE POD product listings.",
    detailEn:
      "A Chrome Extension (Manifest V3) built to automate repetitive Print-on-Demand catalog uploads inside a complex Angular admin portal.\n\nStandard DOM scripts fail on Angular reactive forms, PrimeNG virtual-scroll variant pricing tables (where off-screen rows do not exist in the DOM), and sandboxed TinyMCE iframes. This extension dispatches native-equivalent input events synced with Angular's change detection, incrementally scrolls virtualized PrimeNG viewports to price every SKU variant accurately, and injects rich HTML descriptions cleanly.",
    detail:
      "Tiện ích mở rộng Chrome (Manifest V3) tự động hoá quy trình đăng sản phẩm Print-on-Demand nhiều bước trên cổng quản trị viết bằng Angular.\n\nGiải quyết ba bài toán khó khiến script thông thường gãy: kích hoạt đúng chu kỳ nhận diện thay đổi (change detection) của Reactive Forms trong Angular, cuộn từng nhịp qua bảng ảo hoá PrimeNG (nơi các dòng khuất màn hình bị xoá khỏi DOM) để điền giá chính xác cho từng biến thể SKU, và chèn mô tả HTML vào khung soạn thảo TinyMCE.",
    tech: ["JavaScript", "Chrome Extension MV3", "Angular DOM", "PrimeNG", "TinyMCE"],
    role: "Browser Automation Developer",
    roleEn: "Browser Automation Developer",
    client: "Công cụ vận hành TMĐT",
    clientEn: "E-commerce ops automation",
    yearRole: "2026 • Chrome Extension MV3",
  },
  "moto-nav": {
    category: "C++17 • KOTLIN • ESP32 BLE",
    shortName: "MOTO-NAV BLE HUD",
    shortNameEn: "MOTO-NAV BLE HUD",
    title: "Moto-Nav | Màn hình dẫn đường gắn ghi-đông xe máy",
    titleEn: "Moto-Nav | BLE Turn-by-Turn Engine & ESP32 Handlebar HUD",
    desc: "Hệ thống dẫn đường từng khúc cua kết nối điện thoại Android với màn hình nhỏ gắn trên tay lái xe máy qua Bluetooth tiết kiệm pin.",
    descEn:
      "Cross-platform BLE turn-by-turn navigation engine pairing an Android Kotlin app, bit-exact C++17 core & ESP32 handlebar HUD.",
    detailEn:
      "An end-to-end embedded + mobile navigation system designed so motorcyclists can see crisp turn-by-turn arrows and distance countdowns on a weatherproof handlebar HUD without mounting their phone in the sun.\n\nShares a deterministic, bit-exact C++17 geometry and off-route detection core across Android (via JNI + Kotlin) and ESP32 firmware over custom binary BLE GATT packets.",
    detail:
      "Hệ thống dẫn đường kết hợp phần cứng nhúng và di động giúp người đi xe máy xem mũi tên rẽ và khoảng cách đếm ngược ngay trên màn hình phụ gắn ghi-đông mà không phải phơi điện thoại ngoài nắng.\n\nDùng chung một nhân tính toán hình học và phát hiện lệch lộ trình viết bằng C++17 cho cả ứng dụng Android (qua JNI + Kotlin) và vi điều khiển ESP32 truyền gói tin nhị phân tối giản qua Bluetooth Low Energy (BLE).",
    tech: ["C++17", "Kotlin", "Android JNI", "ESP32", "BLE GATT"],
    role: "Systems & Mobile Developer",
    roleEn: "Systems & Mobile Developer",
    client: "Dự án phần cứng & di động",
    clientEn: "Embedded & mobile project",
    yearRole: "2026 • C++17, Kotlin & ESP32",
  },
  GiuThongBao: {
    category: "KOTLIN • JETPACK COMPOSE",
    shortName: "PUSH KEEP-ALIVE",
    shortNameEn: "PUSH KEEP-ALIVE",
    title: "GiuThongBao | Giữ kết nối thông báo trên máy Xiaomi",
    titleEn: "GiuThongBao | OEM Push-Socket Keep-Alive Utility",
    desc: "Ứng dụng Android siêu nhẹ giúp điện thoại Xiaomi/HyperOS nhận tin nhắn và thông báo tức thì, không bị trễ do hệ thống tự ngắt ngầm.",
    descEn:
      "Native Kotlin & Jetpack Compose Android utility keeping FCM/MCS push sockets alive on aggressive OEM ROMs (Xiaomi HyperOS/MIUI).",
    detailEn:
      "Aggressive battery killers on Chinese/OEM Android ROMs (Xiaomi HyperOS, MIUI) routinely drop idle FCM/MCS TCP heartbeats, delaying critical work notifications until the screen is unlocked. Built in pure Kotlin and Jetpack Compose, this utility maintains lightweight foreground/network heartbeat scheduling with near-zero battery impact.",
    detail:
      "Các bản ROM tuỳ biến mạnh về tiết kiệm pin như Xiaomi HyperOS / MIUI thường tự ngắt kết nối ngầm của FCM/MCS khiến thông báo công việc bị trễ cho tới khi bật sáng màn hình. Tiện ích viết thuần bằng Kotlin và Jetpack Compose này duy trì nhịp kết nối cực nhẹ giúp thông báo đến tức thì mà hầu như không hao pin.",
    tech: ["Kotlin", "Jetpack Compose", "Android Services", "FCM"],
    role: "Android Developer",
    roleEn: "Android Developer",
    client: "Tiện ích Android mã nguồn mở",
    clientEn: "Open-source Android utility",
    yearRole: "2026 • Kotlin & Compose",
  },
  DesktopCustom: {
    category: "C++ • WINDOWS 11 • WEBVIEW2",
    shortName: "WIN11 DESKTOP SUITE",
    shortNameEn: "WIN11 DESKTOP SUITE",
    title: "DesktopCustom | Bộ tuỳ biến màn hình Windows 11",
    titleEn: "Windows 11 Interactive Wallpaper, DPAPI Sync & C++ Dock",
    desc: "Bộ công cụ cá nhân hoá Windows 11: hình nền tương tác trực tiếp, tự đồng bộ lịch học mã hoá DPAPI và thanh dock C++ siêu nhẹ.",
    descEn:
      "Windows 11 desktop suite combining a Lively WebView2 interactive dashboard wallpaper, DPAPI timetable sync & Windhawk C++ dock.",
    detailEn:
      "A cohesive Windows 11 customization workspace: an interactive Lively WebView2 desktop HUD displaying live schedules and telemetry, a background timetable synchronizer protecting credentials via Windows DPAPI encryption, and a zero-overhead native C++ Windhawk taskbar/dock mod.",
    detail:
      "Bộ công cụ cá nhân hoá không gian làm việc trên Windows 11: hình nền tương tác chạy trên WebView2 hiển thị lịch học trực tiếp, tiến trình đồng bộ nền bảo vệ thông tin đăng nhập bằng mã hoá phần cứng Windows DPAPI, và bản độ thanh taskbar/dock viết bằng C++ chạy qua Windhawk.",
    tech: ["C++", "Windows API", "DPAPI", "WebView2", "Windhawk"],
    role: "C++ / Desktop Developer",
    roleEn: "C++ / Desktop Developer",
    client: "Công cụ cá nhân mã nguồn mở",
    clientEn: "Open-source desktop suite",
    yearRole: "2026 • C++ & Windows 11",
  },
  "fitness-app": {
    category: "TYPESCRIPT • MEDIAPIPE • TF.JS",
    shortName: "AI FITNESS COACH",
    shortNameEn: "AI FITNESS COACH",
    title: "AI Fitness App | Chấm tư thế tập & nhận diện món ăn",
    titleEn: "AI Fitness Coach | Real-Time Pose & Food Vision Web App",
    desc: "Ứng dụng web dùng camera chỉnh tư thế tập thể dục theo thời gian thực và chụp ảnh bữa ăn để ước tính dinh dưỡng ngay trên trình duyệt.",
    descEn:
      "Full-stack AI fitness web app with real-time MediaPipe Pose form correction & in-browser MobileNetV3 TensorFlow.js food classification.",
    detailEn:
      "A privacy-preserving AI fitness web app running computer vision inference directly in the client browser with zero GPU server costs: real-time skeletal joint angle tracking and rep counting via MediaPipe Pose, paired with an in-browser MobileNetV3 TensorFlow.js food classifier for instant meal logging.",
    detail:
      "Ứng dụng web hỗ trợ tập luyện chạy mô hình thị giác máy tính trực tiếp ngay trên trình duyệt người dùng (không tốn máy chủ GPU, không gửi video nhạy cảm lên mạng): theo dõi góc khớp xương và đếm nhịp tập thời gian thực bằng MediaPipe Pose, kết hợp nhận diện món ăn bằng MobileNetV3 trên TensorFlow.js.",
    tech: ["TypeScript", "React", "MediaPipe Pose", "TensorFlow.js", "MobileNetV3"],
    role: "Full-Stack & WebML Developer",
    roleEn: "Full-Stack & WebML Developer",
    client: "Dự án mã nguồn mở",
    clientEn: "Open-source WebML app",
    yearRole: "2026 • TypeScript & WebML",
  },
  "web-scraping-showcase": {
    category: "PYTHON • PLAYWRIGHT • API",
    shortName: "SCRAPING TOOLKIT",
    shortNameEn: "SCRAPING TOOLKIT",
    title: "Web Scraping | Cào dữ liệu & Dò API ẩn",
    titleEn: "Web Scraping & Hidden API Extraction Toolkit",
    desc: "Bộ công cụ Python cào dữ liệu song song, tự động dò API JSON ẩn phía sau trang web và xuất ra CSV, JSON, SQLite.",
    descEn:
      "Python scraping toolkit: async HTML crawler, Playwright vs. hidden JSON API benchmark (about 3.3× faster on one run) and an XHR endpoint sniffer.",
    detailEn:
      "A Python web data extraction toolkit demonstrating three core workflows on public sandbox targets:\n\n1. Polite Async HTML Scraper (`scrape-books`): Crawls 1,000+ paginated catalog and product detail pages using `httpx.AsyncClient`, bounded concurrency (`asyncio.Semaphore`), exponential backoff, and `Retry-After` header support. Exports simultaneously to CSV, pretty JSON, and an idempotent SQLite database (`INSERT OR REPLACE` upserts).\n\n2. Infinite Scroll vs. Direct Hidden JSON API (`compare-scroll`): Extracts the exact same dataset via headless Chromium (Playwright infinite scroll) and via the underlying JSON API, cutting memory from ~180 MB to <15 MB; on one measured run of 100 items the API route took ~1.45 s versus ~4.80 s for the browser (about 3.3× faster).\n\n3. Reusable Hidden-API Sniffer (`sniff-api`): Launches headless Chromium on any JavaScript-heavy page, scrolls automatically, intercepts XHR/Fetch responses returning JSON, and prints discovered endpoints with their top-level schema keys and item counts.",
    detail:
      "Bộ công cụ thu thập dữ liệu web bằng Python, trình diễn 3 quy trình cốt lõi:\n\n1. Cào HTML bất đồng bộ có kiểm soát (`scrape-books`): Quét hơn 1.000 trang danh mục và chi tiết sản phẩm bằng `httpx.AsyncClient`, giới hạn số luồng đồng thời (`asyncio.Semaphore`), tự động thử lại theo cấp số nhân (exponential backoff) và tôn trọng header `Retry-After`. Xuất đồng thời ra CSV, JSON và cơ sở dữ liệu SQLite chống trùng lặp (`INSERT OR REPLACE`).\n\n2. So sánh Cuộn vô tận Playwright và Hidden JSON API (`compare-scroll`): Thu thập cùng một tập dữ liệu bằng trình duyệt không đầu (Playwright) và gọi trực tiếp API JSON ẩn bên dưới, giúp giảm RAM từ ~180 MB xuống dưới 15 MB; một lần đo với 100 mục, gọi API mất ~1,45 giây so với ~4,80 giây khi dùng trình duyệt (nhanh hơn khoảng 3,3 lần).\n\n3. Công cụ dò API ẩn dùng lại được (`sniff-api`): Mở trang bất kỳ bằng Chromium, tự động cuộn trang, bắt mọi gói tin XHR/Fetch trả về JSON và liệt kê endpoint kèm cấu trúc khoá dữ liệu.",
    tech: ["Python", "Playwright", "httpx", "Asyncio", "BeautifulSoup4", "SQLite"],
    role: "Python / Scraping Developer",
    roleEn: "Python / Scraping Developer",
    client: "Dự án mã nguồn mở",
    clientEn: "Open-source showcase",
    yearRole: "2026 • Python & Playwright",
    demo: "https://dev.to/tthanh2k6/stop-scraping-doms-when-json-apis-are-hiding-in-plain-sight-benchmarks-with-async-python--5bia",
    demoLabel: "Đọc bài benchmark",
    demoLabelEn: "Read the benchmark write-up",
  },
  DiemDanhQR: {
    category: "JAVASCRIPT • PWA",
    shortName: "QR ATTENDANCE",
    shortNameEn: "QR ATTENDANCE",
    title: "DiemDanhQR | Điểm danh QR",
    titleEn: "QR Attendance | Serverless Check-In PWA",
    desc: "Điểm danh bằng cách quét mã QR trên điện thoại, tên người có mặt tự chạy thẳng vào Google Sheets.",
    descEn:
      "Take attendance by scanning a QR code on your phone — names land straight in a Google Sheet.",
    detail:
      "Công cụ điểm danh bằng mã QR cho một cộng đồng nhỏ. Mở trên điện thoại, bật camera quét mã của từng thành viên là tự động ghi vào Google Sheets qua Google Apps Script — không dựng máy chủ, không cài app từ store.\n\nCó hai chế độ quét: liên tục (không cần xác nhận) và từng người (chờ xác nhận). Quét xong phát âm thanh và đọc tên tiếng Việt để người cầm máy biết đã nhận, kèm lịch sử quét ngay trên màn hình. Chọn được ống kính cụ thể (góc rộng, camera trước/sau) vì camera mặc định trên nhiều máy lấy nét kém ở cự ly gần.\n\nCài lên màn hình chính như app thường nhờ PWA, có chế độ sáng/tối.",
    detailEn:
      "A QR attendance tool built for a small community. Open it on a phone, point the camera at each member's code, and the entry is written to Google Sheets through Google Apps Script — no server to run, no app to install from a store.\n\nTwo scanning modes: continuous (no confirmation) and one-at-a-time (waits for confirmation). Each successful scan plays a sound and reads the person's name aloud in Vietnamese so whoever is holding the phone knows it registered without looking, and recent scans stay listed on screen. You can pick a specific lens (wide, front, rear) because the default camera on many phones focuses poorly at close range.\n\nInstalls to the home screen like a normal app via PWA, with light and dark themes.",
    tech: ["JavaScript", "PWA", "Google Apps Script", "Google Sheets"],
    role: "JavaScript Developer",
    roleEn: "JavaScript Developer",
    client: "Dự án cá nhân",
    clientEn: "Personal project",
  },
  AI_Lab: {
    category: "TYPESCRIPT & AI",
    shortName: "AI LAB",
    shortNameEn: "AI LAB",
    title: "AI_Lab | Phòng thí nghiệm AI",
    titleEn: "AI Game Arena | Interactive AI & RL Lab",
    desc: "9 đấu trường 2D/3D để xem máy tính tự học chơi từ con số 0 — từ đua xe thần kinh, cờ caro 20×20 tới đá bóng 3D.",
    descEn:
      "Nine 2D & 3D arenas where you watch AI teach itself to play from scratch — raycast racing, 20×20 Gomoku, Q-Maze to 3D football.",
    detailEn:
      "AI Game Arena — a desktop app (Electron) that visualises how AI algorithms, classic and modern, learn and make decisions. You tune the training parameters, network shape or heuristic weights yourself, then watch an AI learn from nothing, or pit two of them against each other.\n\nEight environments, each built on a different family of algorithms:\n• Flappy Bird and AI Racing — neural networks evolved by a genetic algorithm; the cars sense their surroundings with raycasts, and a built-in track builder lets you draw your own circuit.\n• Maze robot — Q-Learning, with a heatmap of the Q-table brightening as the agent learns.\n• 2048 — Expectimax search with heuristics for smoothness, monotonicity and keeping the largest tile cornered.\n• Connect Four and 20×20 Gomoku — Minimax with alpha-beta pruning and a Zobrist-hashed transposition table, plus an MCTS/UCT implementation so the two can be compared head to head.\n• 3D Soccer and 3D Tag — competitive co-evolution with 8-direction raycast sensors and real ball physics.",
    detail:
      "AI Game Arena — ứng dụng desktop (Electron) trực quan hoá cách các giải thuật AI từ cổ điển tới hiện đại học hỏi và ra quyết định. Người dùng tự chỉnh tham số huấn luyện, cấu trúc mạng nơ-ron hoặc hàm heuristic rồi xem AI tự học từ con số 0, hoặc cho hai AI đấu nhau.\n\nTám môi trường, mỗi cái một họ giải thuật khác nhau:\n• Flappy Bird và Đua xe — mạng nơ-ron kết hợp tiến hoá di truyền, xe dùng cảm biến raycast; có sẵn trình tự vẽ đường đua.\n• Mê cung — Q-Learning, hiển thị bản đồ nhiệt của Q-Table sáng dần theo thời gian học.\n• 2048 — tìm kiếm Expectimax với heuristic độ mượt, tính đơn điệu, ô lớn ở góc.\n• Connect Four và Cờ Caro 20×20 — Minimax kèm cắt tỉa Alpha-Beta, bảng chuyển vị mã hoá Zobrist, và một bản MCTS/UCT để so sánh hiệu năng trực tiếp.\n• Bóng đá 3D và Đuổi bắt 3D — tiến hoá song song đối kháng, vật lý nảy sân và raycast 8 hướng.",
    tech: ["TypeScript", "Electron", "Three.js", "Minimax", "MCTS", "Q-Learning"],
    role: "TypeScript Developer",
    roleEn: "TypeScript Developer",
    client: "Dự án cá nhân",
    clientEn: "Personal project",
  },
  KNN: {
    category: "MACHINE LEARNING",
    shortName: "KNN ELBOW",
    title: "KNN | Elbow Method",
    desc: "Bài tập nhóm về cách máy tự chia dữ liệu thành từng nhóm. Tôi làm nhóm trưởng, quản lý code cho 9 người.",
    descEn:
      "A team assignment on how machines group data on their own. I led the team and owned the codebase for nine people.",
    detailEn:
      "A university AI course team project: analysing how the number of clusters K affects a clustering algorithm, and implementing the Elbow method to find the optimal K.\n\nMy role was project manager — splitting the work into nine assignments across nine members, owning the whole codebase on GitHub, and personally implementing the K-Means algorithm plus the analysis of how stable the elbow point is.\n\nThe work covers data cleaning and normalisation, computing WCSS/inertia across a range of K values, plotting to locate the elbow, and cross-checking the conclusion against Silhouette scores.",
    detail:
      "Bài tập nhóm môn Trí tuệ Nhân tạo: phân tích ảnh hưởng của số cụm K tới thuật toán phân cụm và triển khai phương pháp Elbow để tìm K tối ưu.\n\nVai trò của tôi là Project Manager: chia 9 đầu việc cho 9 thành viên, quản lý toàn bộ source code trên GitHub, và trực tiếp lập trình thuật toán K-Means cùng phần kiểm tra biến động của điểm gãy Elbow.\n\nNội dung gồm tiền xử lý và chuẩn hoá dữ liệu, tính WCSS/Inertia cho từng giá trị K, vẽ biểu đồ tìm điểm khuỷu tay, và đối chiếu chéo với Silhouette Score để xác nhận kết luận.",
    tech: ["Python", "scikit-learn", "pandas", "Matplotlib", "Jupyter"],
    role: "Project Manager",
    roleEn: "Project Manager",
    client: "Dự án học thuật (nhóm 9 người)",
    clientEn: "Academic project (team of 9)",
    yearRole: "2026 • Project Manager",
  },
  Portfolio: {
    category: "WEB & 3D",
    shortName: "PORTFOLIO",
    shortNameEn: "PORTFOLIO",
    title: "Portfolio | Trang cá nhân 3D",
    titleEn: "Portfolio | Interactive 3D & SSR Showcase",
    desc: "Chính là trang web bạn đang xem: hiệu ứng 3D, bàn phím tương tác và các trang giới thiệu bản thân.",
    descEn:
      "The site you're looking at right now: 3D effects, an interactive keyboard and the pages introducing me.",
    detailEn:
      "My personal portfolio — the site you are currently browsing.\n\nThe home page is an isometric neon grid built with Three.js (WebGL + UnrealBloom), with a custom liquid-drop cursor. The Skills page has an interactive 3D mechanical keyboard: hovering a key pops the matching slice out of the skills donut chart. The Project page is an infinite film-strip carousel that autoplays and opens a detail view on click.\n\nBuilt on TanStack Start (SSR) + React 19 + TailwindCSS v4, deployed to Vercel. Dynamic content — project list, skills, 3D colours — is editable through a client-side admin page without rebuilding.",
    detail:
      "Trang portfolio cá nhân, cũng chính là website bạn đang xem.\n\nTrang chủ là lưới neon isometric dựng bằng Three.js (WebGL + UnrealBloom), con trỏ chuột tuỳ biến kiểu giọt nước. Trang Skills có bàn phím cơ 3D tương tác: rê chuột lên từng phím thì biểu đồ tròn kỹ năng bật lát tương ứng ra ngoài. Trang Project là băng phim cuộn vô hạn, tự chạy, bấm vào xem chi tiết.\n\nDựng trên TanStack Start (SSR) + React 19 + TailwindCSS v4, deploy lên Vercel. Nội dung động (danh sách dự án, kỹ năng, màu sắc 3D) chỉnh được qua trang admin phía client mà không cần build lại.",
    tech: ["React 19", "TypeScript", "TanStack Start", "Three.js", "TailwindCSS", "Vercel"],
    role: "Frontend Developer",
    roleEn: "Frontend Developer",
    client: "Dự án cá nhân",
    clientEn: "Personal project",
  },
  // AI-ML nằm ở repo GitHub tên "H-c-AI-ML".
  "H-c-AI-ML": {
    category: "MACHINE LEARNING",
    shortName: "AI / ML",
    title: "AI-ML | Học Máy & Học Sâu",
    titleEn: "AI-ML | Machine & Deep Learning",
    desc: "Bộ bài tập tôi tự làm để học về trí tuệ nhân tạo, viết tay từng bước thay vì gọi thư viện cho xong.",
    descEn:
      "Exercises I worked through to learn AI, written out step by step instead of just calling a library.",
    detailEn:
      "A collection of self-study lessons and exercises in machine learning and deep learning. Each file is a standalone topic that runs on its own.\n\nThe fundamentals (scikit-learn): data cleaning and preprocessing, feature scaling, KNN, decision trees, multiclass classification, confusion matrices and evaluation metrics, cross-validation, combining steps with Pipeline, and TF-IDF text vectorisation with Naive Bayes.\n\nThe deep learning half (TensorFlow/Keras): multilayer perceptrons, convolutional networks, and handwritten digit classification on MNIST.\n\nWritten out by hand rather than calling a library and moving on, so the maths behind each algorithm actually sticks.",
    detail:
      "Tổng hợp bài học và bài tập tự thực hành về Machine Learning và Deep Learning, mỗi file là một chủ đề độc lập chạy được riêng.\n\nPhần cơ bản (scikit-learn): làm sạch và tiền xử lý dữ liệu, chuẩn hoá đặc trưng, KNN, Decision Tree, phân loại nhiều lớp, ma trận nhầm lẫn và các chỉ số đánh giá, kiểm định chéo, gộp bằng Pipeline, vector hoá văn bản TF-IDF kèm Naive Bayes.\n\nPhần học sâu (TensorFlow/Keras): mạng perceptron nhiều lớp, mạng nơ-ron tích chập, và phân loại chữ số viết tay MNIST.\n\nViết tay từng bước thay vì gọi thư viện cho xong, để nắm rõ toán học phía sau mỗi thuật toán.",
    tech: ["Python", "scikit-learn", "TensorFlow", "Keras", "NumPy", "pandas"],
    role: "ML / AI Developer",
    roleEn: "ML / AI Developer",
    client: "Dự án tự học",
    clientEn: "Self-study project",
    yearRole: "2026 • Machine Learning",
  },
};

// Dự án KHÔNG CÔNG KHAI MÃ NGUỒN: sản phẩm cho doanh nghiệp + tool cá nhân.
// GitHub API chỉ trả về repo công khai nên các mục này phải gộp thủ công và KHÔNG đặt
// `link` tới GitHub. Thứ tự ở đây = thứ tự hiển thị: việc làm thật cho doanh nghiệp
// đứng trước, rồi tới sản phẩm có người dùng thật, cuối cùng là tool cá nhân.
const privateProjects = [
  {
    id: "MadalenaApp",
    category: "REACT NATIVE • PHP API",
    shortName: "MADALENA APP",
    title: "Madalena | App khách hàng thân thiết",
    titleEn: "Madalena | Customer Loyalty App",
    desc: "App tích điểm cho khách của một chuỗi mỹ phẩm, đã có trên Google Play. Tôi làm một mình từ app tới máy chủ.",
    descEn:
      "A loyalty app for a cosmetics chain, live on Google Play. I built all of it alone, app through server.",
    detailEn:
      "A customer loyalty app for the Madalena cosmetics chain, published on Google Play and serving real customers. I built the whole thing on my own: the mobile app, the REST API, the database, and the operational tooling for staff.\n\nFor customers: membership tiers assigned automatically from accumulated spend (GOLDEN → VIP → VIP PRO → VIP PROMAX → VIP BLACK), a QR code staff scan at the counter to identify them, a screen to look up their spend year by year, and a benefits table per tier.\n\nFlash sales run inside a window an admin schedules ahead of time. The remaining time is computed by the server rather than trusting the device clock, so changing your phone's time gets you nowhere. Customers are reminded three times — when it's scheduled, 15 minutes before, and at the opening bell — each with an idempotency flag so nobody gets a duplicate.\n\nBirthday campaigns go out automatically on a cron job. On security: JWT HS256 authentication, admin rights resolved from the database instead of trusting the token, and login brute-force protection keyed on IP plus phone number.\n\nThe backend originally ran on Node/Express hosted on Render with an Aiven database. I ported all of it to PHP so it shares infrastructure with the company website, removing the recurring server bill entirely. It ships with Windows tooling to import monthly revenue and export the customer list without needing SSH access to the host.",
    detail:
      "Ứng dụng khách hàng thân thiết cho chuỗi mỹ phẩm Madalena, đã phát hành trên Google Play và đang phục vụ khách thật. Tôi làm một mình toàn bộ: app di động, REST API, cơ sở dữ liệu và các công cụ vận hành cho quản trị viên.\n\nPhía khách hàng: hạng thành viên tự xếp theo doanh thu tích luỹ (GOLDEN → VIP → VIP PRO → VIP PROMAX → VIP BLACK), mã QR định danh để nhân viên quét tại quầy, màn hình tra cứu chi tiêu từng năm, và bảng đặc quyền riêng cho mỗi hạng.\n\nFlash sale chạy theo khung giờ do quản trị viên hẹn trước. Thời gian còn lại do máy chủ tính chứ không tin đồng hồ máy khách, nên đổi giờ điện thoại cũng không lách được. Khách được nhắc ba lần: lúc đặt lịch, trước 15 phút và đúng giờ mở — mỗi mốc có cờ chống gửi trùng.\n\nChiến dịch chúc mừng sinh nhật gửi tự động bằng cron. Bảo mật: xác thực JWT HS256, quyền admin kiểm tra thẳng từ cơ sở dữ liệu thay vì tin token, và chặn brute-force đăng nhập theo cặp IP + số điện thoại.\n\nBackend ban đầu chạy Node/Express trên Render kèm database Aiven. Tôi tự port toàn bộ sang PHP để gộp chung hạ tầng với website công ty, cắt hẳn chi phí máy chủ hằng tháng. Kèm theo là bộ công cụ chạy từ máy Windows để nhập doanh thu hàng tháng và xuất danh sách khách, không cần SSH vào hosting.",
    tech: ["React Native", "Expo", "TypeScript", "PHP", "MySQL", "JWT", "Expo Push"],
    image: projectImage("MadalenaApp"),
    role: "Full-stack Developer (một mình toàn bộ)",
    roleEn: "Full-stack Developer (sole developer)",
    client: "Madalena — dự án công ty",
    clientEn: "Madalena — company project",
    year: "2026",
    yearRole: "2026 • React Native & PHP",
    link: undefined as string | undefined,
    demo: "https://play.google.com/store/apps/details?id=com.madalena.app",
    demoLabel: "Tải trên Google Play",
    demoLabelEn: "Get it on Google Play",
  },
  {
    id: "MadalenaWeb",
    category: "PHP • WEB",
    shortName: "MADALENA WEB",
    title: "Madalena | Website thương mại điện tử",
    titleEn: "Madalena | E-commerce Website",
    desc: "Website bán mỹ phẩm đang hoạt động thật. Tôi làm phần mã giảm giá, quản lý đơn hàng và tìm kiếm sản phẩm.",
    descEn:
      "A live cosmetics storefront. I built the discount-code system, order management and product search.",
    detailEn:
      "Madalena's online store — live, with real orders coming in daily. I joined when the site already existed, as a feature developer on the team. I did not build the whole site, but the areas below are core business functionality I owned.\n\nThe discount-code system, built from scratch: admins create codes, attach them to specific products, cap how many times each phone number may redeem one, and track storage and usage statistics per code. On the customer side, codes are entered at checkout.\n\nOrder management: customers review past orders and cancel their own, and payment details are remembered for next time. The shop gets an email on every new order, and all orders sync automatically into Google Sheets along with address, discount code and amount discounted — so the sales team follows everything in the spreadsheet they already live in, instead of logging into an admin panel.\n\nAlso: product search, an \"out of stock\" state that automatically pushes sold-out items to the bottom of listings, free-shipping tags, and a rework of how discounts are entered — the admin now types the final post-discount price and the system derives the percentage, rather than making them do the arithmetic.\n\nThe stack is the web agency's own PHP codebase (AltoRouter, PDO, cart, SEO, file caching, custom admin), so every feature meant reading and understanding existing code before adding to it.",
    detail:
      "Website bán hàng của Madalena, chạy thật và có khách đặt hàng mỗi ngày. Tôi vào dự án khi site đã tồn tại, với vai trò lập trình viên tính năng trong đội — không phải người dựng toàn bộ site, nhưng phần tôi làm là những mảng nghiệp vụ chính bên dưới.\n\nHệ thống mã giảm giá làm từ đầu: quản trị viên tạo mã, gắn mã vào từng sản phẩm, giới hạn số lần mỗi số điện thoại được dùng, lưu trữ và thống kê mức tiêu thụ của từng mã. Phía khách thì nhập mã ngay lúc thanh toán.\n\nQuản lý đơn hàng: khách xem lại đơn cũ và tự huỷ đơn, thông tin thanh toán được nhớ cho lần mua sau. Phía cửa hàng nhận email báo mỗi khi có đơn mới, và toàn bộ đơn tự đồng bộ sang Google Sheets kèm địa chỉ, mã giảm giá, mức giảm — nhờ vậy bộ phận bán hàng theo dõi ngay trên bảng tính quen thuộc thay vì phải vào trang quản trị.\n\nNgoài ra: tìm kiếm sản phẩm, trạng thái \"Tạm hết hàng\" kèm việc tự đẩy hàng hết xuống cuối danh sách, nhãn miễn phí vận chuyển, và sửa lại cách nhập giảm giá — quản trị viên nhập thẳng giá sau giảm rồi hệ thống tự tính ra phần trăm chiết khấu, thay vì phải tự nhẩm.\n\nNền tảng là PHP tự viết của đơn vị làm web (AltoRouter, PDO, giỏ hàng, SEO, cache file, trang quản trị riêng) nên phải đọc hiểu codebase có sẵn rồi mới chèn tính năng vào.",
    tech: ["PHP", "MySQL", "JavaScript", "Google Sheets API", "AltoRouter", "PDO"],
    image: projectImage("MadalenaWeb"),
    role: "PHP Developer (phát triển tính năng)",
    roleEn: "PHP Developer (feature work)",
    client: "Madalena — dự án công ty",
    clientEn: "Madalena — company project",
    year: "2026",
    yearRole: "2026 • PHP",
    // Mã nguồn là tài sản của công ty nên không công khai, nhưng site chạy thật thì
    // công khai → chỉ đưa link bản chạy thật, giữ nhãn "private" cho phần mã nguồn.
    link: undefined as string | undefined,
    demo: "https://madalena.vn",
  },
  {
    id: "LichIUH",
    category: "KOTLIN • ANDROID",
    shortName: "LỊCH IUH",
    // Bản tiếng Anh bỏ dấu cho khách nước ngoài đọc được, khớp với titleEn.
    shortNameEn: "LICH IUH",
    title: "Lịch IUH | Widget lịch học",
    titleEn: "Lich IUH | Class Schedule Widget",
    desc: "Xem lịch học ngay ngoài màn hình điện thoại, không cần mở app — làm cho sinh viên trường tôi.",
    descEn:
      "See your class schedule right on the phone's home screen without opening an app — built for my university.",
    detailEn:
      "An Android app for students at Industrial University of Ho Chi Minh City. It exists because the official university app makes you open it and log in before you can see anything, when all a student actually wants is a glance to know which room the next class is in.\n\nThree widgets sit on the home screen: the next 7 days grouped by day, today's classes, and a countdown to exams. Each entry shows the period, subject and room, marks online sessions explicitly, flags make-up classes, and hides suspended ones.\n\nData comes from the university's official API via OAuth2 login, syncing in the background twice a day (6am and 6pm). Results are cached, so the widget is populated the instant the screen lights up rather than waiting on the network. The password is stored encrypted with EncryptedSharedPreferences because the university's tokens expire after 30 minutes and the app has to silently re-authenticate.\n\nThe university's server omits its intermediate certificate, so Android refuses the connection outright. I embedded that certificate in the app and declared it in the network security config, rather than disabling certificate validation — the lazy fix, and one that would leave the app wide open to man-in-the-middle attacks.",
    detail:
      "App Android cho sinh viên Đại học Công nghiệp TP.HCM. Ra đời vì app chính thức của trường bắt phải mở app rồi đăng nhập mới xem được lịch, trong khi thứ sinh viên cần chỉ là liếc một cái biết tiết sau học phòng nào.\n\nBa widget đặt thẳng ngoài màn hình chính: lịch 7 ngày tới gom theo từng ngày, lịch học hôm nay, và đếm ngược tới ngày thi. Mỗi buổi hiện tiết, tên môn và phòng, ghi rõ \"Trực tuyến\" nếu học online, đánh dấu buổi dạy bù và ẩn buổi tạm ngưng.\n\nDữ liệu lấy qua API chính thức của trường bằng đăng nhập OAuth2, tự đồng bộ nền hai lần mỗi ngày (6h sáng và 6h tối). Kết quả được lưu lại nên mở màn hình là widget hiện ngay, không phải chờ mạng. Mật khẩu lưu mã hoá bằng EncryptedSharedPreferences vì token của trường chỉ sống 30 phút, phải tự đăng nhập lại ngầm.\n\nMáy chủ của trường gửi thiếu chứng chỉ trung gian nên Android từ chối kết nối. Tôi nhúng thẳng chứng chỉ đó vào app và khai báo trong network security config để đi qua được, thay vì tắt kiểm tra chứng chỉ — cách làm tắt đó dễ nhưng mở toang cửa cho tấn công chen giữa.",
    tech: ["Kotlin", "Jetpack Glance", "WorkManager", "OAuth2", "EncryptedSharedPreferences"],
    image: projectImage("LichIUH"),
    role: "Android Developer",
    roleEn: "Android Developer",
    client: "Sản phẩm cá nhân — người dùng thật",
    clientEn: "Personal product — real users",
    year: "2026",
    yearRole: "2026 • Kotlin & Android",
    link: undefined as string | undefined,
  },
  {
    id: "WorkFlowAI",
    category: "PYTHON & AI",
    shortName: "WORKFLOW AI",
    title: "WorkFlow AI | Sản xuất video AI",
    titleEn: "WorkFlow AI | AI Video Production",
    desc: "Công cụ làm video bằng AI: nhập ý tưởng, máy tự viết kịch bản, tạo hình ảnh rồi ghép thành phim.",
    descEn:
      "An AI video tool: type an idea, it writes the script, generates the visuals and cuts the film together.",
    detailEn:
      "A tool that produces AI video through one closed pipeline: enter an idea → the AI writes a script → it's split into scenes → images and video are generated per scene → everything is assembled into a finished film with ffmpeg. The point is to do the whole job in one place instead of hopping between five or six websites.\n\nThe hardest part is generation: the target platform exposes no public API, so the tool attaches to a real Chrome window over the remote debugging protocol (CDP) and drives it with Playwright using the user's own account. Because that web UI can change at any time, every step has a manual paste fallback so the tool degrades instead of dying whenever the provider ships an update.\n\nScript generation offers four modes to suit different budgets: a paid API, browser automation against an existing account, manual paste, or buying credits through a dedicated licence server.\n\nThat licence server is the infrastructure for selling the tool: API keys and prompt templates live on the server rather than in the customer's copy, and customers top up credits with a code. Each AI request costs exactly one credit regardless of how expensive the model is, and if the AI returns malformed output the credit is refunded automatically.",
    detail:
      "Công cụ làm video bằng AI theo một dây chuyền khép kín: nhập ý tưởng → AI viết kịch bản → chia thành từng cảnh → sinh ảnh và video cho mỗi cảnh → ghép lại thành phim hoàn chỉnh bằng ffmpeg. Mục tiêu là làm trọn quy trình trong một tool, không phải nhảy qua lại giữa năm sáu trang web.\n\nKhó nhất là khâu sinh hình ảnh: nền tảng đích không mở API công khai, nên tool gắn vào một cửa sổ Chrome thật qua giao thức gỡ lỗi từ xa (CDP) và điều khiển bằng Playwright, dùng chính tài khoản của người dùng. Vì giao diện web có thể đổi bất cứ lúc nào, mọi bước đều có phương án dự phòng dán tay để tool không chết cứng khi nhà cung cấp cập nhật.\n\nPhần hỏi AI cho kịch bản có bốn chế độ để người dùng chọn theo túi tiền: gọi API trả phí, điều khiển trình duyệt để dùng tài khoản sẵn có, dán tay, hoặc mua credit qua license server riêng.\n\nLicense server đó là phần hạ tầng để bán tool: khoá API và mẫu câu lệnh nằm trên máy chủ chứ không nằm trong bản giao cho khách, khách nạp credit bằng mã. Mỗi lần hỏi AI trừ đúng một lượt bất kể model đắt hay rẻ, và nếu AI trả về sai định dạng thì tự hoàn lại credit.",
    tech: ["Python", "FastAPI", "Playwright", "CDP", "ffmpeg", "SQLite"],
    image: projectImage("WorkFlowAI"),
    role: "Python / AI Developer",
    roleEn: "Python / AI Developer",
    client: "Sản phẩm cá nhân (private)",
    clientEn: "Personal product (private)",
    year: "2026",
    yearRole: "2026 • Python & AI",
    link: undefined as string | undefined,
  },
  {
    id: "ToolPhone",
    category: "PYTHON • DATA",
    shortName: "TOOLPHONE",
    title: "ToolPhone | Phân tích giá điện thoại cũ",
    titleEn: "ToolPhone | Used-Phone Price Analytics",
    desc: "Tự dò giá điện thoại cũ trên các chợ mạng rồi chỉ ra máy nào đang rao rẻ hơn mặt bằng thị trường.",
    descEn:
      "Scans used-phone marketplaces and points out which listings are priced below the going rate.",
    detailEn:
      "A tool for buying and reselling used phones: it tracks 113 models (iPhone X→17, Galaxy S20→S26, Note, Z Fold/Flip, Xiaomi, Oppo, Vivo, Honor, Pixel) across four marketplaces, builds a reference price table, and surfaces the listings currently priced below the \"worth buying\" threshold.\n\nThe hard part was never the scraping — it was that the prices you collect are biased. A table built from listings that are still live suffers survivorship bias: the well-priced phones sell fast, so what remains is disproportionately overpriced. Measured across 27 groups with enough samples, listings that had disappeared were 17% cheaper than those still up. So the tool computes a separate \"clearing price\" from listings that have left the market and uses it as a ceiling, instead of trusting asking prices.\n\nFiltering out the noise takes several layers: shop listings, dealers posing as private sellers (caught by shop-style account names and by how many ads one account has live at once), red-flag listings (\"locked\", \"Face ID broken\", \"instalments\"), and boilerplate ads — the ones that just paste catalogue specs and say nothing about the actual handset.\n\nThe four sources are crawled in parallel, each on its own thread with its own rate limit, and never several pages of the same site at once, which is what gets your IP blocked. It ships with a local web UI (bound to 127.0.0.1 only) for the control panel, sortable and filterable reports, run history and CSV export. Raw responses are kept on disk so the analysis can be re-run offline.",
    detail:
      "Công cụ phục vụ việc mua đi bán lại điện thoại cũ: theo dõi 113 dòng máy (iPhone X→17, Galaxy S20→S26, Note, Z Fold/Flip, Xiaomi, Oppo, Vivo, Honor, Pixel) trên 4 chợ mạng, dựng bảng giá tham chiếu rồi chỉ ra tin nào đang rao dưới ngưỡng \"nên mua\".\n\nPhần khó chưa bao giờ là cào dữ liệu, mà là giá lấy về bị lệch. Bảng giá dựng từ tin còn đang rao mắc lỗi thiên lệch sống sót: tin giá tốt bị mua mất nhanh nên thứ còn lại toàn tin giá cao. Đo trên 27 nhóm đủ mẫu, tin đã biến mất rẻ hơn tin còn sống 17%. Vì vậy tool tính riêng \"giá thoát hàng\" từ những tin đã rời chợ và dùng nó làm trần, thay vì tin vào giá rao.\n\nLọc nhiễu phải làm nhiều tầng: loại tin shop, dân buôn đội lốt cá nhân (nhận ra qua tên tài khoản kiểu cửa hàng và số tin đang rao cùng lúc), tin có cờ đỏ (\"lock\", \"mất face\", \"trả góp\"), và tin chép mô tả rập khuôn — loại chỉ dán thông số catalogue chứ không nói gì về chính chiếc máy đó.\n\nBốn nguồn cào song song, mỗi nguồn một luồng và một hạn mức tốc độ riêng; không bao giờ cào nhiều trang cùng lúc trên cùng một site vì đó là cách nhanh nhất để bị chặn IP. Có giao diện web chạy nội bộ (chỉ mở được từ 127.0.0.1) gồm bảng điều khiển, báo cáo lọc và sắp xếp được, lịch sử các lần chạy, xuất CSV. Dữ liệu thô giữ lại trên đĩa để chạy lại phân tích mà không cần mạng.",
    tech: ["Python", "Flask", "SQLite", "requests", "pytest", "YAML"],
    image: projectImage("ToolPhone"),
    role: "Python Developer",
    roleEn: "Python Developer",
    client: "Công cụ cá nhân (private)",
    clientEn: "Personal tool (private)",
    year: "2026",
    yearRole: "2026 • Python & Data",
    link: undefined as string | undefined,
  },
  {
    id: "NoteMod",
    category: "ANDROID • REVERSE ENGINEERING",
    shortName: "NOTE MOD",
    title: "Ghi chú Mod | Dịch ngược app Xiaomi",
    titleEn: "Notes Mod | Xiaomi App Reverse Engineering",
    desc: "Thêm tính năng vào app Ghi chú có sẵn của điện thoại Xiaomi mà không làm mất chức năng cũ nào.",
    descEn:
      "Adding features to the Notes app that ships on Xiaomi phones, without losing a single original function.",
    detailEn:
      "Xiaomi's Notes app was missing a few things I wanted, but rewriting it from scratch would have cost the features only the manufacturer can ship: freehand drawing, stylus input, mind maps — all running on proprietary native libraries. So instead of rewriting, I modified the original app directly.\n\nThe process: decompile the app into 15,386 files, write the new features in Kotlin, compile them down to smali and inject them at the right call sites, then re-sign and install. I also renamed the package (13 authorities, 88 URIs) so the modified build installs alongside the original — if it breaks, there's a way back.\n\nWhat's in so far: a Schedule screen laid out as a week calendar (pinch to zoom, a red line marking the current time, repeating events and advance reminders), sync through Supabase in place of Mi Cloud, and a Gemini assistant.\n\nThe two things that ate the most time: the decompiler can't read resources until you load the miui.system framework pulled off a real device — I wrongly concluded this route was a dead end because of it; and since Xiaomi ships no API jar, I had to build a stub module declaring fake classes just to compile against, where signatures must match exactly down to the return type.\n\nThe trade-off I had to accept: the modified build lacks 29 signature-level permissions, so it loses Mi Cloud sync and fingerprint unlock for private notes — unfixable without the manufacturer's signing key.",
    detail:
      "App Ghi chú của Xiaomi thiếu vài thứ tôi cần, nhưng viết lại từ đầu thì mất những tính năng chỉ hãng mới làm được: vẽ tay, viết bút cảm ứng, bản đồ tư duy — chúng chạy trên thư viện native riêng. Nên thay vì viết lại, tôi sửa thẳng vào app gốc.\n\nQuy trình: dịch ngược app ra 15.386 file, viết tính năng mới bằng Kotlin, biên dịch xuống smali rồi tiêm vào đúng chỗ, ký lại và cài. Đổi luôn tên gói (13 authority, 88 URI) để bản sửa cài song song bản gốc, lỡ hỏng vẫn còn đường lùi.\n\nĐã thêm được: màn Lịch trình dạng lịch tuần (chụm ngón phóng to, vạch đỏ chỉ giờ hiện tại, sự kiện lặp và nhắc trước), đồng bộ qua Supabase thay cho Mi Cloud, và trợ lý Gemini.\n\nHai chỗ tốn nhiều thời gian nhất: công cụ dịch ngược không đọc nổi tài nguyên nếu chưa nạp khung miui.system lấy từ máy thật — chỗ này tôi từng kết luận nhầm là không làm được; và vì Xiaomi không phát hành thư viện API, tôi phải dựng một module khai lớp giả để biên dịch được, chữ ký phải khớp tuyệt đối tới từng kiểu trả về.\n\nĐánh đổi phải chấp nhận: bản sửa thiếu 29 quyền cấp chữ ký nên mất đồng bộ Mi Cloud và mở khoá ghi chú riêng tư bằng vân tay — không sửa được vì cần khoá ký của hãng.",
    tech: ["Kotlin", "smali", "apktool", "Supabase", "Gemini API", "Android"],
    image: projectImage("NoteMod"),
    role: "Android / Reverse Engineering",
    roleEn: "Android / Reverse Engineering",
    client: "Sản phẩm cá nhân (private)",
    clientEn: "Personal product (private)",
    year: "2026",
    yearRole: "2026 • Reverse Engineering",
    link: undefined as string | undefined,
  },
  {
    id: "Sothuchi",
    category: "FLUTTER • ANDROID",
    shortName: "SỔ THU CHI",
    shortNameEn: "EXPENSE BOOK",
    title: "Sổ thu chi | App quản lý chi tiêu",
    titleEn: "Expense Book | Personal Finance App",
    desc: "App ghi chi tiêu cho điện thoại: gõ \"ăn phở 45k\" hoặc chụp ảnh hoá đơn là tự vào sổ.",
    descEn:
      "A spending tracker for your phone: type \"lunch 45k\" or snap a receipt and it records itself.",
    detailEn:
      "A personal build derived from Cashew (GPL-3.0) by James Kokoska, reworked to revolve around wallet balance rather than budgets — which is how I actually use a spending app.\n\nThe largest piece of my own work is the Gemini-powered assistant: press and hold the plus button for half a second and it opens. It records transactions from plain sentences (\"lunch 45k\"), reads receipt photos, answers questions about your spending, and edits or deletes entries. Every action it proposes goes through a confirmation card before touching the database — an AI misreading an amount is routine, so it never writes directly.\n\nAlso added: a 4×4 home-screen widget (balance, 30-day income and expense, a line chart, and a pocket calculator for logging a transaction without opening the app), a Statistics tab merging budgets, spending charts, a pie chart and a heatmap into one place, and a Vietnamese category set with sub-categories. Removed: Google sign-in, Cashew Pro ads, and 47 unused languages.\n\nA constraint I had to live with: the project pins Flutter 3.19.6, because pubspec.lock pins intl 0.18.1 while newer SDKs' flutter_localizations demands intl 0.20.2, and six packages simply will not compile on Flutter 3.4x. Upgrading breaks the build, so I pinned the version and documented exactly why in the README instead of leaving the next person to rediscover it. 37 tests are kept passing and flutter analyze must stay clean.",
    detail:
      "Bản dùng riêng tách ra từ Cashew (GPL-3.0) của James Kokoska, viết lại để xoay quanh số dư ví thay vì ngân sách — đúng cách tôi thực sự dùng một app chi tiêu.\n\nPhần tự làm đáng kể nhất là trợ lý AI chạy trên Gemini: nhấn giữ nút cộng khoảng nửa giây là mở. Nó ghi giao dịch bằng câu chữ tự nhiên (\"ăn phở 45k\"), đọc ảnh hoá đơn, trả lời câu hỏi về chi tiêu và sửa hoặc xoá giao dịch. Mọi thao tác AI đề xuất đều phải qua một thẻ xác nhận trước khi ghi vào cơ sở dữ liệu — AI đọc sai số tiền là chuyện thường, không thể để nó ghi thẳng.\n\nNgoài ra: widget 4×4 ngoài màn hình chính (tổng tiền, thu chi 30 ngày, biểu đồ đường và một máy tính bỏ túi để ghi giao dịch không cần mở app), tab Thống kê gộp ngân sách, biểu đồ chi tiêu, biểu đồ tròn và bản đồ nhiệt vào một chỗ, và bộ danh mục tiếng Việt có danh mục con. Đã gỡ: đăng nhập Google, quảng cáo bản Pro và 47 ngôn ngữ không dùng.\n\nRàng buộc phải sống chung: dự án ghim Flutter 3.19.6, vì pubspec.lock ghim intl 0.18.1 trong khi flutter_localizations của SDK mới lại đòi intl 0.20.2, cộng thêm sáu gói không biên dịch nổi trên Flutter 3.4x. Nâng SDK là gãy build, nên tôi ghim phiên bản và ghi rõ lý do trong README thay vì để người sau tự dò lại. Giữ 37 test luôn xanh và flutter analyze phải sạch lỗi.",
    tech: ["Flutter", "Dart", "Android", "SQLite", "Gemini API", "Home Widget"],
    image: projectImage("Sothuchi"),
    role: "Flutter Developer",
    roleEn: "Flutter Developer",
    client: "Dự án cá nhân (private)",
    clientEn: "Personal project (private)",
    year: "2026",
    yearRole: "2026 • Flutter & Android",
    link: undefined as string | undefined,
  },
  {
    id: "AutoTool",
    category: "PYTHON • AUTOMATION",
    shortName: "AUTOTOOL",
    title: "AutoTool | Tự động hoá web",
    titleEn: "AutoTool | Web Automation",
    desc: "Phần mềm máy tính làm thay việc nhập liệu tay: sửa giá hàng loạt và xuất báo cáo Excel.",
    descEn:
      "A desktop tool that does the manual data entry for you: bulk price edits and Excel reports.",
    detailEn:
      "An internal tool built to kill one repetitive manual chore: every promotion meant opening the admin panel and editing prices one product at a time, hundreds of times over. The tool logs in on its own and does the whole batch.\n\nYou tick the products, then choose how to adjust them: enter a discount percentage applied across the batch, or set one flat price for everything. Input is validated on the spot (a discount must be a whole number 0–100, leading zeros are normalised away) so a slip of the finger can't push a wrong price live.\n\nBeyond pricing, it extracts orders with delivery addresses and exports them to Excel for reconciliation.\n\nAll heavy work runs on a background thread so the window never freezes mid-task — the classic failure of a hastily written Tkinter app, and the reason users assume it has crashed and kill it halfway through.",
    detail:
      "Công cụ nội bộ sinh ra để bỏ một việc thủ công lặp đi lặp lại: mỗi đợt khuyến mãi phải mở trang quản trị, sửa giá từng sản phẩm một, hàng trăm lần. Tool tự đăng nhập rồi làm hàng loạt.\n\nNgười dùng tick chọn sản phẩm rồi chọn cách chỉnh: nhập phần trăm chiết khấu áp cho cả loạt, hoặc đặt đồng giá một mức cho tất cả. Có kiểm tra dữ liệu nhập ngay tại chỗ (chiết khấu phải là số 0–100, tự bỏ số 0 thừa) để không lỡ tay đẩy giá sai lên sàn.\n\nNgoài chỉnh giá còn trích xuất được đơn hàng kèm địa chỉ và xuất ra Excel để đối chiếu.\n\nToàn bộ tác vụ nặng chạy ở luồng nền nên cửa sổ không bị treo trắng khi đang xử lý — đây là lỗi kinh điển của ứng dụng Tkinter viết vội, và cũng là lý do người dùng hay tưởng phần mềm hỏng rồi tắt ngang giữa chừng.",
    tech: ["Python", "Tkinter", "Selenium", "openpyxl", "threading"],
    image: projectImage("AutoTool"),
    role: "Python Developer",
    roleEn: "Python Developer",
    client: "Công cụ nội bộ (private)",
    clientEn: "Internal tool (private)",
    year: "2026",
    yearRole: "2026 • Python",
    link: undefined as string | undefined,
  },
  {
    id: "NCKH-PeopleCount",
    category: "COMPUTER VISION • NCKH",
    shortName: "PEOPLECOUNT",
    title: "PeopleCount | Đếm người bằng thị giác máy",
    titleEn: "PeopleCount | Vision-Based People Counting",
    desc: "Đề tài nghiên cứu khoa học: đếm số người trong video mà không đếm trùng một người hai lần.",
    descEn:
      "A student research project: counting people in video without counting the same person twice.",
    detailEn:
      "A third-year student research project in the Faculty of IT at Industrial University of Ho Chi Minh City (supervisor: Lê Thị Vĩnh Thanh). The goal is a system that detects and counts people in images and video using YOLOv8 combined with object tracking, evaluated on COCO 2017 (person class) plus footage filmed in the university's lobbies and classrooms.\n\nTargets set for the project: mAP@0.5 ≥ 0.85 on the person class, mean absolute counting error ≤ 2 people per frame on the test set, and measured FPS on live video (reference ≥ 25).\n\nStill early. What is built so far is the tracking layer, written by hand rather than pulled from a library: a BBox frozen dataclass with IoU, and a CentroidTracker that assigns a stable ID to each person across frames. The v2 handles temporary occlusion through an absence counter — without it, every time someone walks behind a pillar the system issues a fresh ID and counts them twice.\n\nRuns on Python 3.11 with CUDA 12.6 (RTX 3050 6GB), laid out as a proper research repository: source as an installable package, experiment configs, logs and checkpoints, and notebooks each kept separate, with datasets and the virtualenv deliberately out of version control.",
    detail:
      "Đề tài nghiên cứu khoa học sinh viên năm 3, khoa Công nghệ Thông tin — Đại học Công nghiệp TP.HCM (GVHD: Lê Thị Vĩnh Thanh). Mục tiêu là xây hệ thống phát hiện và đếm người trong ảnh/video bằng YOLOv8 kết hợp theo dõi đối tượng, đánh giá trên COCO 2017 (lớp person) cùng video tự quay ở sảnh và lớp học của trường.\n\nChỉ tiêu đặt ra: mAP@0.5 ≥ 0.85 trên lớp person, sai số đếm tuyệt đối trung bình ≤ 2 người/khung hình trên tập test, và đo FPS trên video thời gian thực (tham chiếu ≥ 25).\n\nDự án đang ở giai đoạn đầu. Phần đã dựng xong là tầng theo dõi đối tượng, tự viết chứ không lấy sẵn từ thư viện: lớp BBox dạng frozen dataclass kèm phép tính IoU, và CentroidTracker gán ID ổn định cho từng người qua các khung hình. Bản v2 xử lý được trường hợp bị che khuất tạm thời bằng bộ đếm số khung vắng mặt — không có nó thì mỗi lần một người đi khuất sau cây cột là hệ thống cấp ID mới và đếm trùng.\n\nChạy trên Python 3.11 với CUDA 12.6 (RTX 3050 6GB), tổ chức theo đúng cấu trúc một kho nghiên cứu: mã nguồn dạng package cài được, cấu hình thí nghiệm, log và checkpoint, notebook để riêng từng phần; dữ liệu và môi trường ảo cố ý không đưa vào quản lý phiên bản.",
    tech: ["Python", "PyTorch", "YOLOv8", "OpenCV", "NumPy", "CUDA"],
    image: projectImage("NCKH-PeopleCount"),
    role: "Computer Vision Researcher",
    roleEn: "Computer Vision Researcher",
    client: "Đề tài NCKH — IUH",
    clientEn: "Student research — IUH",
    year: "2026",
    yearRole: "2026 • Computer Vision",
    link: undefined as string | undefined,
  },
];

// Danh sách dự án tĩnh = dự án private + các repo công khai chủ lực trên GitHub.
// Dùng để hiển thị tức thì ngay trên SSR và làm phương án dự phòng khi không gọi được API
// (offline / vượt giới hạn request). Bản fetch động bên dưới sẽ ghi đè phần repo công khai.
const buildStaticPublic = (id: string) => ({
  id,
  ...REPO_META[id],
  image: projectImage(id),
  year: "2026",
  link: `https://github.com/${GITHUB_USER}/${id}`,
});

const publicProjects = [
  buildStaticPublic("ai-automation-and-rag-toolkit"),
  buildStaticPublic("apify-b2b-lead-and-contact-enricher"),
  buildStaticPublic("apify-ecommerce-price-and-stock-monitor"),
  buildStaticPublic("apify-us-healthcare-clinic-contact-enricher"),
  buildStaticPublic("apify-multi-stop-route-and-distance-optimizer"),
  buildStaticPublic("apify-malaysia-kpkt-teduh-property-scraper"),
  buildStaticPublic("vn-sme-offline-tools"),
  buildStaticPublic("web-scraping-showcase"),
  buildStaticPublic("burgershop-pod-tool"),
  buildStaticPublic("moto-nav"),
  {
    ...buildStaticPublic("DiemDanhQR"),
    yearRole: "2026 • JavaScript",
    demo: "https://tthanh2k6.github.io/DiemDanhQR/",
  },
  {
    ...buildStaticPublic("AI_Lab"),
    yearRole: "2026 • TypeScript",
    demo: "https://ai-lab-tthanh2006.vercel.app",
  },
  {
    ...buildStaticPublic("Portfolio"),
    yearRole: "2026 • Web & 3D",
    demo: "https://trungthanhtran.vercel.app/",
  },
  buildStaticPublic("KNN"),
  buildStaticPublic("H-c-AI-ML"),
];

// Danh sách hiển thị mặc định: dự án không công khai mã nguồn đứng trước, rồi tới repo công khai.
// Được export để trang /admin dùng CHUNG một nguồn — trước đây admin tự chép lại danh sách
// riêng nên bị lệch, và mỗi lần bấm lưu là ghi đè danh sách thiếu dự án xuống localStorage.
export const projects = [...privateProjects, ...publicProjects];

// Nhãn cho nút chính của card, tuỳ theo dự án có công khai mã nguồn hay không:
//  - không có link  -> dự án private, nút trơ (không bấm được)
//  - link GitHub    -> mở mã nguồn
//  - link khác      -> website chạy thật của khách hàng
function primaryLinkLabel(link: string | undefined, lang: "vi" | "en") {
  if (!link) {
    return lang === "en"
      ? "Private • source not public"
      : "Private • mã nguồn không công khai";
  }
  if (link.includes("github.com")) {
    return lang === "en" ? "View on GitHub" : "Xem trên GitHub";
  }
  return lang === "en" ? "Visit website" : "Xem website";
}

// Modal "Xem chi tiết": card chỉ đủ chỗ cho 3 dòng mô tả nên phần viết sâu cho nhà
// tuyển dụng (cách giải quyết vấn đề, quyết định kỹ thuật, đánh đổi) để hết ở đây.
function ProjectDetailModal({
  proj,
  onClose,
}: {
  proj: any;
  onClose: () => void;
}) {
  const { lang, t, pick } = useLang();

  // Esc để đóng + khoá cuộn nền, tránh cuộn xuyên qua modal xuống carousel bên dưới
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // detail có thể xuống dòng bằng \n\n -> tách thành từng đoạn cho dễ đọc
  const paragraphs = String(pick(proj, "detail") || pick(proj, "desc") || "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      className="pd-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={proj.title}
      onClick={onClose}
    >
      {/* Chặn nổi bọt để bấm bên trong panel không đóng modal */}
      <div className="pd-panel" onClick={(e) => e.stopPropagation()}>
        <button
          className="pd-close"
          onClick={onClose}
          aria-label={t("Đóng", "Close")}
        >
          ✕
        </button>

        <div className="pd-banner">
          <img
            src={proj.image}
            alt={pick(proj, "title")}
            onError={(e) => {
              const t = e.currentTarget;
              t.src = `https://placehold.co/1440x880/111219/ffffff?text=${encodeURIComponent(
                proj.shortName || proj.title
              )}`;
            }}
          />
        </div>

        <div className="pd-body">
          <span className="pd-category">{proj.category}</span>
          <h2 className="pd-title">{pick(proj, "title")}</h2>

          <div className="pd-meta">
            <div>
              <span>{t("Vai trò", "Role")}</span>
              <strong>{pick(proj, "role")}</strong>
            </div>
            <div>
              <span>{t("Bối cảnh", "Context")}</span>
              <strong>{pick(proj, "client")}</strong>
            </div>
            <div>
              <span>{t("Năm", "Year")}</span>
              <strong>{proj.year}</strong>
            </div>
          </div>

          {proj.tech?.length ? (
            <div className="pd-tech">
              {proj.tech.map((t: string) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          ) : null}

          <div className="pd-text">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="pd-actions">
            {proj.demo ? (
              <a
                href={proj.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn pd-btn-primary"
              >
                {pick(proj, "demoLabel") || t("Xem bản chạy thật", "View it live")}
              </a>
            ) : null}
            {proj.link ? (
              <a
                href={proj.link}
                target="_blank"
                rel="noopener noreferrer"
                className="pd-btn"
              >
                {primaryLinkLabel(proj.link, lang)}
              </a>
            ) : (
              <span className="pd-btn pd-btn-private">
                {primaryLinkLabel(undefined, lang)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Chuyển một repo trả về từ GitHub API sang đúng cấu trúc card dự án
function mapRepoToProject(repo: any) {
  const lang = repo.language || "Code";
  const year = (repo.updated_at || "").slice(0, 4);
  const base = {
    id: repo.name,
    category: (repo.language || "PROJECT").toUpperCase(),
    shortName: repo.name,
    shortNameEn: repo.name,
    title: repo.name,
    titleEn: repo.name,
    desc: repo.description || "Dự án mã nguồn trên GitHub — bấm để xem chi tiết.",
    descEn: repo.description || "Open-source project on GitHub — click for details.",
    image: projectImage(repo.name),
    role: `${lang} Developer`,
    roleEn: `${lang} Developer`,
    client: "Dự án cá nhân",
    clientEn: "Personal project",
    year,
    yearRole: `${year} • ${lang}`,
    link: repo.html_url,
    // Trường "Website" của repo trên GitHub = bản deploy chạy thật, dùng làm nút phụ.
    // Tự động chuyển link vercel cũ sang domain chính thức trungthanhtran.vercel.app.
    demo: repo.homepage
      ? String(repo.homepage).replace(
          /https?:\/\/(portfolio-red-theta-65|portfolio-tthanh2006)\.vercel\.app/,
          "https://trungthanhtran.vercel.app"
        )
      : undefined,
  };
  // Ghi đè bằng thông tin tự soạn (vai trò, bản chạy thử trên Apify Store...) nếu repo có trong REPO_META
  return { ...base, ...(REPO_META[repo.name] || {}) };
}

// Vị trí xuất phát của băng chuyền, dùng ĐÚNG công thức của applyList bên dưới:
// giữa bộ nhân bản thứ 3 — cũng là "vùng an toàn" [2*N .. 3*N-1] mà goToProject dùng,
// nên hai đầu luôn còn bộ đệm để cuộn. Phải suy ra từ số dự án chứ không ghim số:
// trước đây ghim cứng 12, nên mỗi lần thêm/bớt dự án là điểm xuất phát lại trôi đi chỗ khác
// (với 14 dự án thì 12 rơi hẳn vào bộ nhân bản đầu tiên, hết đệm bên trái).
// Khớp với applyList để khung hình đầu tiên không bị nhảy một nhịp khi effect chạy.
const START_INDEX = projects.length * 2 + Math.floor(projects.length / 2);

export function ProjectSection() {
  const { t, pick } = useLang();
  const [projectList, setProjectList] = useState<any[]>(projects);
  const [activeIndex, setActiveIndex] = useState(START_INDEX);
  const [translateX, setTranslateX] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNoTransitions, setIsNoTransitions] = useState(false);
  const [isFastTransitions, setIsFastTransitions] = useState(false);

  // Dự án đang mở trong modal chi tiết (null = đang đóng)
  const [detailProj, setDetailProj] = useState<any | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(START_INDEX);
  const isTransitioningRef = useRef(false);
  const autoplayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bản ref của trạng thái modal: resetAutoplayTimer chạy trong setTimeout nên đọc
  // state trực tiếp sẽ dính giá trị cũ (stale closure).
  const detailOpenRef = useRef(false);

  // Mở modal thì dừng hẳn autoplay, đóng thì chạy lại — không thì carousel vẫn
  // trượt sau lưng modal, đóng ra đã lạc sang dự án khác.
  useEffect(() => {
    detailOpenRef.current = detailProj !== null;
    if (detailProj) {
      if (autoplayTimeoutRef.current) clearTimeout(autoplayTimeoutRef.current);
    } else {
      resetAutoplayTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detailProj]);

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
        // Bỏ các repo fork và repo trùng với dự án đã có trong danh sách private (vd GhiChu trùng NoteMod)
        const HIDDEN_REPOS = new Set(["GhiChu", "Tthanh2k6", "apify-thefork-restaurant-scraper"]);
        const mapped = repos
          .filter((r: any) => !r.fork && !HIDDEN_REPOS.has(r.name))
          .map(mapRepoToProject);
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

    // Đang đọc chi tiết thì không tự chuyển card
    if (detailOpenRef.current) return;

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

        /* Cụm nút cuối card: gom nút "bản chạy thật" + nút mã nguồn vào một khối,
           khối này mới là thứ bị đẩy xuống đáy (thay cho margin-top:auto của từng nút). */
        .expanded-actions {
          margin-top: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: 100%;
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
          margin-top: 0;
        }

        .expanded-btn:hover {
          background: #ffffff;
          color: #000000;
        }

        /* Nút chính (bản chạy thật) — nổi bật hơn nút xem mã nguồn */
        .expanded-btn.primary-cta {
          background: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        .expanded-btn.primary-cta:hover {
          background: #c9d4ff;
          border-color: #c9d4ff;
        }

        /* Dự án không công khai mã nguồn: nút chỉ để thông báo, không bấm được */
        .expanded-btn.is-private {
          background: transparent;
          border-style: dashed;
          border-color: rgba(255, 255, 255, 0.22);
          color: rgba(255, 255, 255, 0.55);
          cursor: default;
          letter-spacing: 1px;
        }

        .expanded-btn.is-private:hover {
          background: transparent;
          color: rgba(255, 255, 255, 0.55);
        }

        /* Nút chi tiết là <button> chứ không phải <a>, nên phải trả lại font và
           con trỏ mặc định của trình duyệt cho khớp các nút dạng link còn lại. */
        button.expanded-btn {
          font-family: inherit;
          cursor: pointer;
        }

        /* Dòng chú thích nhỏ dưới nút: cho biết dự án có công khai mã nguồn không */
        .expanded-note {
          font-size: 0.68rem;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.38);
          text-align: center;
        }

        /* ===== MODAL CHI TIẾT DỰ ÁN ===== */
        .pd-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(4, 5, 9, 0.78);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 20px;
          animation: pdFade 0.25s ease;
        }

        @keyframes pdFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        .pd-panel {
          position: relative;
          width: min(880px, 100%);
          max-height: 88vh;
          overflow-y: auto;
          background: #12131a;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65);
          animation: pdRise 0.3s cubic-bezier(0.25, 1, 0.5, 1);
        }

        @keyframes pdRise {
          from { transform: translateY(18px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }

        .pd-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 2;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(10, 11, 16, 0.72);
          backdrop-filter: blur(6px);
          color: #fff;
          font-size: 0.9rem;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.25s ease;
        }

        .pd-close:hover {
          background: #ffffff;
          color: #000000;
          transform: rotate(90deg);
        }

        .pd-banner {
          width: 100%;
          aspect-ratio: 1440 / 880;
          overflow: hidden;
          border-radius: 20px 20px 0 0;
          background: #0c0d12;
        }

        .pd-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .pd-body { padding: 26px 32px 32px; }

        .pd-category {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 2px;
          color: #8ea2ff;
        }

        .pd-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          margin: 6px 0 18px;
          letter-spacing: -0.5px;
        }

        .pd-meta {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          padding: 16px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.07);
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .pd-meta div { display: flex; flex-direction: column; gap: 3px; }

        .pd-meta span {
          font-size: 0.68rem;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.4);
        }

        .pd-meta strong {
          font-size: 0.88rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.92);
        }

        .pd-tech {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin: 18px 0 4px;
        }

        .pd-tech span {
          font-size: 0.74rem;
          font-weight: 600;
          padding: 5px 11px;
          border-radius: 999px;
          background: rgba(142, 162, 255, 0.11);
          border: 1px solid rgba(142, 162, 255, 0.22);
          color: #c3cdff;
        }

        .pd-text {
          margin-top: 18px;
          font-size: 0.92rem;
          line-height: 1.72;
          color: rgba(255, 255, 255, 0.74);
        }

        .pd-text p { margin: 0 0 13px; }
        .pd-text p:last-child { margin-bottom: 0; }

        .pd-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 26px;
        }

        .pd-btn {
          flex: 1 1 200px;
          text-align: center;
          padding: 12px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: #252e42;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .pd-btn:hover { background: #fff; color: #000; }

        .pd-btn-primary {
          background: #fff;
          color: #000;
          border-color: #fff;
        }

        .pd-btn-primary:hover { background: #c9d4ff; border-color: #c9d4ff; }

        .pd-btn-private {
          background: transparent;
          border-style: dashed;
          border-color: rgba(255, 255, 255, 0.2);
          color: rgba(255, 255, 255, 0.5);
          cursor: default;
        }

        .pd-btn-private:hover {
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 640px) {
          .pd-overlay { padding: 16px 12px; }
          .pd-body { padding: 20px 20px 24px; }
          .pd-title { font-size: 1.3rem; }
          .pd-meta { grid-template-columns: 1fr; gap: 10px; }
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
                    <h3 className="collapsed-title">{pick(proj, "shortName")}</h3>
                    <span className="collapsed-preview-link">
                      {proj.yearRole}
                    </span>
                  </div>

                  {/* Thông tin mở rộng */}
                  <div className="info-expanded">
                    <h2 className="expanded-title">{pick(proj, "title")}</h2>
                    <p className="expanded-desc">{pick(proj, "desc")}</p>
                    <div className="expanded-details">
                      <div className="detail-row">
                        <span className="detail-label">Role:</span>
                        <span>{pick(proj, "role")}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Client:</span>
                        <span>{pick(proj, "client")}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Year:</span>
                        <span>{proj.year}</span>
                      </div>
                    </div>
                    {/* Card chỉ giữ MỘT hành động cho gọn; link bản chạy thật và mã
                        nguồn chuyển hết vào modal cùng với mô tả đầy đủ. */}
                    <div className="expanded-actions">
                      <button
                        type="button"
                        className="expanded-btn primary-cta"
                        onMouseEnter={() => triggerCursorHover(true)}
                        onMouseLeave={() => triggerCursorHover(false)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailProj(proj);
                        }}
                      >
                        {t("Xem chi tiết", "View details")}
                      </button>
                      <span className="expanded-note">
                        {proj.link
                          ? t("Mã nguồn công khai", "Source public")
                          : t("Mã nguồn không công khai", "Source not public")}
                        {proj.demo ? t(" • có bản chạy thật", " • live version") : ""}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {detailProj ? (
          <ProjectDetailModal
            proj={detailProj}
            onClose={() => setDetailProj(null)}
          />
        ) : null}

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
