import { useEffect, useMemo, useRef, useState } from "react";
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
  "supabase-multitenant-rls": "/IMG/project-multitenant-rls.png",
  "supabase-rls-check": "/IMG/project-supabase-rls-check.png",
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
  "supabase-rls-check": {
    category: "PYTHON • POSTGRES RLS • MCP",
    shortName: "SUPABASE-RLS-CHECK",
    shortNameEn: "SUPABASE-RLS-CHECK",
    title: "supabase-rls-check | Kiểm tra bảo mật RLS Postgres & MCP",
    titleEn: "supabase-rls-check | Postgres RLS & Catalog Security Scanner",
    desc: "CLI Python & MCP server đọc catalog Postgres, phát hiện 15 nhóm lỗi phân quyền RLS, xuất báo cáo HTML/MD kèm fix.sql (100 test); có GitHub Action.",
    descEn:
      "Open-source Python CLI & MCP server flagging 11 Postgres/Supabase RLS misconfiguration types, with HTML/MD reports, ROLLBACK fix.sql and a GitHub Action.",
    detailEn:
      "An MIT-licensed open-source Python CLI and MCP server that runs read-only Postgres catalog metadata queries to flag 15 misconfiguration types common in fast-built Supabase apps:\n\n• Tables with RLS turned off, permissive `true` policies, `anon` policies on sensitive tables, `SECURITY DEFINER` functions callable with the `anon` key, definer functions missing `search_path`, views bypassing RLS, public Storage buckets, extensions installed in the `public` schema, policies that read user-editable `user_metadata`, `auth.uid()` calls evaluated per row, and public views that expose `auth.users`.\n\n• Includes an opt-in `GET`/`HEAD`-only live probe gated behind an explicit consent flag, plus a scanner for leaked `service_role` JWTs in frontend code.\n\n• CI verifies every check against PostgreSQL 15 seeded with intentional misconfigurations (all found, zero false positives), backed by 66 automated tests. Outputs HTML/Markdown reports and a `ROLLBACK`-wrapped `fix.sql` script for safe review.\n\n• Also offered as a fixed-scope security review on Contra: https://contra.com/s/sFUXWqOZ-supabase-security-check-for-lovable-bolt-and-v0-apps",
    detail:
      "Công cụ mã nguồn mở (MIT) gồm CLI Python và chế độ MCP server, truy vấn chỉ-đọc metadata catalog của Postgres để phát hiện 15 nhóm lỗi cấu hình bảo mật thường gặp trên ứng dụng Supabase:\n\n• Bảng tắt Row Level Security (RLS), policy dùng điều kiện `true`, policy cho phép `anon` trên bảng nhạy cảm, hàm `SECURITY DEFINER` gọi được bằng `anon` key, hàm definer thiếu `search_path`, view bỏ qua RLS, bucket Storage để public, extension cài trong schema `public`, policy đọc `user_metadata` (người dùng tự sửa được), `auth.uid()` bị gọi lại từng dòng, và view công khai lộ `auth.users`.\n\n• Có thêm chế độ probe chỉ gửi `GET`/`HEAD` khi bật cờ đồng ý rõ ràng, cùng bộ quét tìm khoá JWT `service_role` bị lộ ở mã nguồn frontend.\n\n• CI chạy trên PostgreSQL 15 với các lỗi cài sẵn (bắt đủ toàn bộ, không báo nhầm), gồm 66 bài test. Xuất báo cáo HTML/MD và tệp `fix.sql` bọc `ROLLBACK` để kiểm tra an toàn trước khi chạy.\n\n• Cũng bán thành gói review cố định trên Contra: https://contra.com/s/sFUXWqOZ-supabase-security-check-for-lovable-bolt-and-v0-apps",
    tech: ["Python", "PostgreSQL", "Supabase RLS", "SQL", "MCP Server", "pytest", "GitHub Actions"],
    role: "Tác giả mã nguồn mở",
    roleEn: "Open-source Author",
    client: "Mã nguồn mở (MIT) & gói review Contra",
    clientEn: "Open-source (MIT) & Contra security review",
    yearRole: "2026 • Python, SQL, MCP",
    demo: "https://contra.com/s/sFUXWqOZ-supabase-security-check-for-lovable-bolt-and-v0-apps",
    demoLabel: "Xem gói review trên Contra",
    demoLabelEn: "Fixed-Scope Review on Contra",
  },
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
      "Open-source reference examples to read and adapt (not a packaged library, not yet used by paying clients; the SQL, Apps Script and Odoo files have not been run against a live database or sheet):\n\n1. FastAPI + OpenAI Structured Outputs endpoint: parses the model reply into a Pydantic model, retries 429/timeouts, and returns an error instead of parsing truncated output or a refusal; includes an offline self-test. A separate sketch shows bounded stream buffering and micro-batching.\n\n2. Hybrid RAG Engine (`BM25` + Dense Vector `Reciprocal Rank Fusion`): Combines exact SKU/part-number lexical recall with semantic dense embeddings so exact identifiers are less likely to be missed.\n\n3. Multi-Tenant PostgreSQL RLS Auditing (`pgTAP`) & Apps Script Route Optimizer: Ships automated SQL security assertions verifying tenant isolation plus a zero-infrastructure Google Sheets route optimization module.",
    detail:
      "Bộ mã ví dụ mã nguồn mở để đọc và chỉnh lại (không phải thư viện đóng gói, chưa có khách trả phí dùng; phần SQL, Apps Script, Odoo chưa chạy trên database hay sheet thật):\n\n1. Endpoint FastAPI + OpenAI Structured Outputs: ép câu trả lời của model vào model Pydantic, thử lại khi gặp 429/timeout, báo lỗi thay vì đọc câu trả lời bị cắt hoặc bị từ chối; có self-test chạy offline. Kèm một bản phác thảo bộ đệm luồng có giới hạn và gom lô nhỏ.\n\n2. Động cơ Hybrid RAG (`BM25` + Vector `Reciprocal Rank Fusion`): Kết hợp tìm kiếm từ khoá chính xác cho mã SKU/mã linh kiện với tìm kiếm ngữ nghĩa vector.\n\n3. Kiểm toán phân quyền PostgreSQL RLS tự động bằng `pgTAP` kèm module tối ưu lộ trình chạy thẳng trên Google Apps Script.",
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
      "A public Actor on the Apify Store (`thanh81646/apify-b2b-lead-and-contact-enricher`). It has had a handful of test runs and no paying users yet.\n\nInstead of launching a headless browser, it uses a bounded `httpx.AsyncClient` pool to fetch a company's homepage plus up to two internal pages whose link mentions contact, about, impressum, support or team. It pulls out email addresses (regex and `mailto:` links), phone-number-like strings, social profiles, `Schema.org` JSON-LD types and a tech-stack guess from about 15 HTML signatures plus the `Server` / `X-Powered-By` headers (Shopify, WooCommerce, WordPress, HubSpot, Stripe, Intercom, GTM...), with output shaped for n8n, Sheets or a CRM import.\n\nLimitations worth knowing: emails are taken as they appear on the site, with no MX or SMTP check, so deliverability is not verified; phone strings are not normalised; content rendered only by JavaScript is not seen.",
    detail:
      "Actor công khai trên Apify Store (`thanh81646/apify-b2b-lead-and-contact-enricher`). Mới có vài lượt chạy thử, chưa có người dùng trả phí.\n\nThay vì bật trình duyệt không đầu, Actor dùng nhóm kết nối `httpx.AsyncClient` có giới hạn để tải trang chủ công ty cùng tối đa hai trang nội bộ có liên kết nhắc tới contact, about, impressum, support hoặc team. Trích xuất email (regex và liên kết `mailto:`), chuỗi giống số điện thoại, mạng xã hội, kiểu `Schema.org` JSON-LD và đoán công nghệ web từ khoảng 15 dấu hiệu HTML cộng header `Server` / `X-Powered-By`, xuất ra dạng dùng được ngay cho n8n, Google Sheets hoặc CRM.\n\nGiới hạn cần biết: email được lấy đúng như trên website, chưa kiểm tra MX hay SMTP nên không đảm bảo email còn nhận thư; số điện thoại chưa được chuẩn hoá; nội dung chỉ hiện ra sau khi chạy JavaScript thì không đọc được.",
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
    desc: "Đọc tên, giá bán và tình trạng còn hàng của sản phẩm từ trang cửa hàng (Shopify, WooCommerce...) mà không cần mở trình duyệt.",
    descEn:
      "Public Apify Actor reading product name, price, currency and stock status from store pages (Shopify, WooCommerce...) without a browser.",
    detailEn:
      "A public Actor on the Apify Store for watching competitor prices. A handful of runs so far, no paying users yet.\n\nFor each product or category URL it fetches the page once and tries three steps in order: a `Schema.org/Product` JSON-LD block (name, SKU and the first offer's price, currency and availability), then common HTML product-card selectors, then a single-product `h1` + price element. It returns title, price, currency, an `In Stock` / `Out of Stock` status, SKU and product URL, plus which step produced the record. Reading the HTML directly is lighter than rendering the page in a headless browser.\n\nLimitations: only the first JSON-LD offer is read, so there is no per-variant price or stock; it does not follow pagination or keep history between runs (schedule it and compare datasets to monitor changes).",
    detail:
      "Actor công khai trên Apify Store phục vụ việc theo dõi giá đối thủ. Mới có vài lượt chạy, chưa có người dùng trả phí.\n\nVới mỗi URL sản phẩm hoặc danh mục, Actor tải trang một lần và thử lần lượt ba bước: khối `Schema.org/Product` JSON-LD (tên, SKU và giá, tiền tệ, tình trạng của offer đầu tiên), rồi các bộ chọn thẻ sản phẩm HTML phổ biến, rồi `h1` + phần tử giá của trang một sản phẩm. Trả về tên, giá, tiền tệ, trạng thái `In Stock` / `Out of Stock`, SKU và URL sản phẩm, kèm cho biết bước nào sinh ra bản ghi. Đọc thẳng HTML nhẹ hơn nhiều so với mở trang bằng trình duyệt.\n\nGiới hạn: chỉ đọc offer JSON-LD đầu tiên nên chưa có giá/tồn kho theo từng biến thể; không tự đi qua các trang phân trang và không lưu lịch sử giữa các lần chạy (muốn theo dõi biến động thì hẹn giờ chạy rồi so sánh dataset).",
    tech: ["Python", "Async HTTPX", "BeautifulSoup4", "JSON-LD", "Apify SDK"],
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
      "A public Actor on the Apify Store targeting the Malaysian Ministry of Housing and Local Government registry (`teduh.kpkt.gov.my`). A handful of runs so far, no paying users yet.\n\nIt reads the portal's public JSON API and flattens licensed private housing developers (`Pemaju Perumahan Swasta`) into one row per developer-project pair: developer code and name, registered address, phone, email, website, project name, state and licence validity dates.\n\nLimitation: when the portal's API fails, the Actor falls back to sample rows instead of returning live data, so a run's output should be checked before it is relied on.",
    detail:
      "Actor công khai trên Apify Store lấy dữ liệu từ cổng của Bộ Nhà ở & Chính quyền Địa phương Malaysia (`teduh.kpkt.gov.my`). Mới có vài lượt chạy, chưa có người dùng trả phí.\n\nĐọc API JSON công khai của cổng và trải phẳng danh sách chủ đầu tư bất động sản được cấp phép (`Pemaju Perumahan Swasta`) thành mỗi dòng một cặp chủ đầu tư – dự án: mã và tên chủ đầu tư, địa chỉ đăng ký, điện thoại, email, website, tên dự án, bang và thời hạn giấy phép.\n\nGiới hạn: khi API của cổng lỗi, Actor rơi về dữ liệu mẫu thay vì dữ liệu thật, nên cần kiểm tra kết quả mỗi lần chạy trước khi dùng.",
    tech: ["Python", "Async HTTPX", "JSON API", "Data Normalization", "Apify SDK"],
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
      "A public Apify Actor (a handful of runs, no paying users yet) combining async OpenStreetMap Nominatim geocoding with a deterministic Nearest-Neighbor + `2-Opt` local-search Travelling Salesperson solver.\n\nApplies a shift time budget, estimates leg durations from Haversine distance times a road-circuity factor, removes route crossovers, and outputs ready-to-tap multi-stop Google Maps navigation URLs for delivery drivers and field reps.\n\nLimitations: distances are estimates, not a real road-routing engine (no one-way streets or traffic). If an address cannot be geocoded, the Actor places a synthetic point near the origin and marks it `fallback_centroid`, so those rows must be checked or given coordinates.",
    detail:
      "Actor công khai trên Apify (mới có vài lượt chạy, chưa có người dùng trả phí) tối ưu lộ trình giao hàng: kết hợp giải mã toạ độ địa lý bất đồng bộ (OSM Nominatim) với thuật toán bài toán người du lịch Nearest-Neighbor + cải thiện cục bộ `2-Opt`.\n\nÁp quỹ thời gian của ca làm việc, ước tính thời gian từng chặng từ khoảng cách Haversine nhân hệ số đường vòng, loại bỏ các đoạn đường cắt chéo và sinh liên kết dẫn đường nhiều điểm trên Google Maps mở được ngay trên điện thoại tài xế.\n\nGiới hạn: khoảng cách là ước tính, không phải bộ định tuyến đường thật (không biết đường một chiều hay kẹt xe). Địa chỉ nào không giải mã được toạ độ sẽ được đặt một điểm giả gần điểm xuất phát và gắn nhãn `fallback_centroid`, nên cần kiểm tra hoặc tự nhập toạ độ cho các dòng đó.",
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
      "An end-to-end embedded + mobile navigation system designed so motorcyclists can see turn-by-turn arrows and distance countdowns on a small handlebar display without mounting their phone in the sun.\n\nShares a deterministic, bit-exact C++17 geometry and off-route detection core across Android (via JNI + Kotlin) and ESP32 firmware over custom binary BLE GATT packets.",
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
    client: "Công cụ cá nhân (mã nguồn chưa công khai)",
    clientEn: "Personal desktop suite (source not public)",
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
      "Python scraping toolkit: async HTML crawler, Playwright vs. hidden JSON API benchmark (two measured runs on 11 Nov 2026: 7.5× and 1.8× faster) and an XHR endpoint sniffer.",
    detailEn:
      "A Python web data extraction toolkit demonstrating three core workflows on public sandbox targets:\n\n1. Polite Async HTML Scraper (`scrape-books`): Crawls 1,000+ paginated catalog and product detail pages using `httpx.AsyncClient`, bounded concurrency (`asyncio.Semaphore`), exponential backoff, and `Retry-After` header support. Exports simultaneously to CSV, pretty JSON, and an idempotent SQLite database (`INSERT OR REPLACE` upserts).\n\n2. Infinite Scroll vs. Direct Hidden JSON API (`compare-scroll`): Extracts the exact same dataset via headless Chromium (Playwright infinite scroll) and via the underlying JSON API. Two runs of 100 items on 11 Nov 2026: 31.27 s vs 4.15 s with a cold browser start, then 7.25 s vs 4.07 s (memory was not measured).\n\n3. Reusable Hidden-API Sniffer (`sniff-api`): Launches headless Chromium on any JavaScript-heavy page, scrolls automatically, intercepts XHR/Fetch responses returning JSON, and prints discovered endpoints with their top-level schema keys and item counts.",
    detail:
      "Bộ công cụ thu thập dữ liệu web bằng Python, trình diễn 3 quy trình cốt lõi:\n\n1. Cào HTML bất đồng bộ có kiểm soát (`scrape-books`): Quét hơn 1.000 trang danh mục và chi tiết sản phẩm bằng `httpx.AsyncClient`, giới hạn số luồng đồng thời (`asyncio.Semaphore`), tự động thử lại theo cấp số nhân (exponential backoff) và tôn trọng header `Retry-After`. Xuất đồng thời ra CSV, JSON và cơ sở dữ liệu SQLite chống trùng lặp (`INSERT OR REPLACE`).\n\n2. So sánh Cuộn vô tận Playwright và Hidden JSON API (`compare-scroll`): Thu thập cùng một tập dữ liệu bằng trình duyệt không đầu (Playwright) và gọi trực tiếp API JSON ẩn bên dưới. Hai lần đo 100 mục ngày 11/11/2026: 31,27 giây so với 4,15 giây khi trình duyệt khởi động lạnh, rồi 7,25 giây so với 4,07 giây (chưa đo RAM).\n\n3. Công cụ dò API ẩn dùng lại được (`sniff-api`): Mở trang bất kỳ bằng Chromium, tự động cuộn trang, bắt mọi gói tin XHR/Fetch trả về JSON và liệt kê endpoint kèm cấu trúc khoá dữ liệu.",
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
      "AI Game Arena — a desktop app (Electron) that visualises how AI algorithms, classic and modern, learn and make decisions. You tune the training parameters, network shape or heuristic weights yourself, then watch an AI learn from nothing, or pit two of them against each other.\n\nNine environments, each built on a different family of algorithms:\n• Flappy Bird and AI Racing — neural networks evolved by a genetic algorithm; the cars sense their surroundings with raycasts, and a built-in track builder lets you draw your own circuit.\n• Maze robot — Q-Learning, with a heatmap of the Q-table brightening as the agent learns.\n• 2048 — Expectimax search with heuristics for smoothness, monotonicity and keeping the largest tile cornered.\n• Connect Four and 20×20 Gomoku — Minimax with alpha-beta pruning and a Zobrist-hashed transposition table, plus an MCTS/UCT implementation so the two can be compared head to head.\n• 3D Soccer and 3D Tag — competitive co-evolution with 8-direction raycast sensors and real ball physics.\n• Cell War — territory expansion on a grid for 2 to 6 sides, each driven by one of five heuristic strategies.",
    detail:
      "AI Game Arena — ứng dụng desktop (Electron) trực quan hoá cách các giải thuật AI từ cổ điển tới hiện đại học hỏi và ra quyết định. Người dùng tự chỉnh tham số huấn luyện, cấu trúc mạng nơ-ron hoặc hàm heuristic rồi xem AI tự học từ con số 0, hoặc cho hai AI đấu nhau.\n\nChín môi trường, mỗi cái một họ giải thuật khác nhau:\n• Flappy Bird và Đua xe — mạng nơ-ron kết hợp tiến hoá di truyền, xe dùng cảm biến raycast; có sẵn trình tự vẽ đường đua.\n• Mê cung — Q-Learning, hiển thị bản đồ nhiệt của Q-Table sáng dần theo thời gian học.\n• 2048 — tìm kiếm Expectimax với heuristic độ mượt, tính đơn điệu, ô lớn ở góc.\n• Connect Four và Cờ Caro 20×20 — Minimax kèm cắt tỉa Alpha-Beta, bảng chuyển vị mã hoá Zobrist, và một bản MCTS/UCT để so sánh hiệu năng trực tiếp.\n• Bóng đá 3D và Đuổi bắt 3D — tiến hoá song song đối kháng, vật lý nảy sân và raycast 8 hướng.\n• Chiến tranh Ô (Cell War) — mở rộng lãnh thổ trên lưới ô cho 2–6 phe, mỗi phe theo một trong năm chiến lược heuristic.",
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
    category: "REACT NATIVE • PHP API • ELECTRON",
    shortName: "MADALENA APP",
    title: "Madalena | App khách hàng thân thiết & Electron Admin",
    titleEn: "Madalena | Loyalty App (App Store & Google Play) & Admin",
    desc: "App khách hàng thân thiết đã lên cả App Store và Google Play (152 commit từ 05/2026), kèm REST API PHP và app quản trị Electron.",
    descEn:
      "Customer loyalty app shipped to both the App Store and Google Play (152 commits since May 2026), plus its PHP API and Electron admin.",
    detailEn:
      "Built and shipped as the sole developer while working full-time at cosmetics retailer Madalena (since March 2026): the customer loyalty app on both the App Store and Google Play (React Native, Expo, TypeScript — 152 commits since May 2026), its PHP REST API, database, and an Electron desktop admin for staff.\n\nPoints & loyalty program: automatic membership tiers (GOLDEN → VIP → VIP PRO → VIP PROMAX → VIP BLACK), purchase and livestream points, promotional campaigns, bulk point grants from Excel, rewards with gift stock tracking, QR check-in at the counter, and flash sales with per-customer limits and server-authoritative countdowns.\n\nElectron desktop admin for staff: role-based access control and an audit log, customer search, scheduled push notifications, flash-sale scheduling, monthly revenue import with duplicate-period checks, and operational reports.\n\nBackend & security: migrated the backend from Node.js on Render to PHP hosting shared with the company storefront; implemented JWT HS256 authentication, DB-resolved roles, login brute-force protection, scheduled cron jobs, and automated backups.",
    detail:
      "Xây dựng và phát hành một mình toàn bộ khi làm full-time tại chuỗi mỹ phẩm Madalena (từ 03/2026): ứng dụng khách hàng thân thiết trên cả App Store và Google Play (React Native, Expo, TypeScript — 152 commit từ 05/2026), REST API PHP, cơ sở dữ liệu và ứng dụng quản trị Electron trên desktop cho nhân viên.\n\nChương trình tích điểm & khách hàng thân thiết: tự động xếp hạng thành viên (GOLDEN → VIP → VIP PRO → VIP PROMAX → VIP BLACK), tích điểm mua hàng và livestream, chiến dịch khuyến mãi, cộng điểm hàng loạt từ Excel, đổi quà có quản lý tồn kho quà tặng, quét mã QR tại quầy và flash sale giới hạn theo từng khách với đồng hồ đếm ngược tính từ máy chủ.\n\nỨng dụng Electron desktop admin cho nhân viên: phân quyền theo vai trò kèm nhật ký kiểm toán (audit log), tra cứu khách hàng, hẹn giờ gửi thông báo đẩy, lên lịch flash sale, nhập doanh thu có kiểm tra trùng kỳ và xuất báo cáo.\n\nHạ tầng & bảo mật: chuyển đổi backend từ Node.js trên Render sang PHP hosting dùng chung với website công ty; trang bị xác thực JWT HS256, đối chiếu quyền trực tiếp từ DB, chống brute-force đăng nhập, tác vụ hẹn giờ và sao lưu tự động (automated backups).",
    tech: ["React Native", "Expo", "TypeScript", "PHP", "MySQL", "Electron", "JWT"],
    image: projectImage("MadalenaApp"),
    role: "Full-stack Developer (full-time, làm một mình)",
    roleEn: "Full-stack Developer (full-time, sole developer)",
    client: "Madalena — dự án công ty (full-time từ 03/2026)",
    clientEn: "Madalena — full-time since Mar 2026",
    year: "2026",
    yearRole: "2026 • React Native, PHP, Electron",
    link: undefined as string | undefined,
    demo: "https://play.google.com/store/apps/details?id=com.madalena.app",
    demoLabel: "Google Play (đã có cả App Store)",
    demoLabelEn: "Google Play (also on App Store)",
  },
  {
    id: "MadalenaWeb",
    category: "PHP • E-COMMERCE • APP SYNC",
    shortName: "MADALENA WEB",
    title: "Madalena | Website thương mại điện tử PHP",
    titleEn: "Madalena | PHP E-commerce Storefront",
    desc: "Phát triển hầu hết tính năng web bán hàng PHP của công ty từ 03/2026 trên bộ khung có sẵn và kết nối đồng bộ với app di động.",
    descEn:
      "Built most features of Madalena's live PHP e-commerce site since March 2026 on a vendor's base framework and linked it to the mobile app.",
    detailEn:
      "Madalena's live online cosmetics store, processing daily customer orders. Working full-time since March 2026, I built most of the storefront's features on top of an external vendor's base PHP framework (AltoRouter, PDO, file caching, custom admin) and connected the website directly to the mobile loyalty app.\n\nStorefront-to-app integration: product catalog sync, live sold counts, and tiered free-shipping rules shared between web and mobile.\n\nCheckout, promotions & order ops: built the discount-code engine from scratch (product-scoped codes, per-phone redemption caps, usage analytics, and final-price input that auto-computes discount percentages), customer order history and self-service cancellation, email notifications, automatic order sync to Google Sheets for the sales team, product search, and automatic out-of-stock demotion.",
    detail:
      "Website thương mại điện tử đang vận hành hằng ngày của Madalena. Làm việc full-time từ 03/2026, tôi phát triển hầu hết tính năng nghiệp vụ của site dựa trên bộ khung PHP nền tảng của đơn vị bên ngoài (AltoRouter, PDO, cache file, trang quản trị riêng) và kết nối trực tiếp website với ứng dụng khách hàng thân thiết.\n\nLiên kết dữ liệu giữa Web và App: đồng bộ danh mục sản phẩm, số lượng đã bán (sold counts) và các bậc miễn phí vận chuyển (freeship tiers).\n\nThanh toán, khuyến mãi & vận hành đơn hàng: xây dựng mới hệ thống mã giảm giá (gắn theo sản phẩm, giới hạn lượt dùng theo số điện thoại, thống kê lượt sử dụng, nhập thẳng giá sau giảm để máy tự tính phần trăm), lịch sử & tự huỷ đơn cho khách, gửi email báo đơn mới, tự động đồng bộ đơn sang Google Sheets cho đội bán hàng, tìm kiếm sản phẩm và tự đẩy hàng tạm hết xuống cuối danh sách.",
    tech: ["PHP", "MySQL", "JavaScript", "Google Sheets API", "AltoRouter", "PDO"],
    image: projectImage("MadalenaWeb"),
    role: "Full-stack / PHP Developer (full-time)",
    roleEn: "Full-stack / PHP Developer (full-time)",
    client: "Madalena — dự án công ty (full-time từ 03/2026)",
    clientEn: "Madalena — full-time since Mar 2026",
    year: "2026",
    yearRole: "2026 • PHP & MySQL",
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
      "A third-year student research project in the Faculty of IT at Industrial University of Ho Chi Minh City. The goal is a system that detects and counts people in images and video using YOLOv8 combined with object tracking, evaluated on COCO 2017 (person class) plus footage filmed in the university's lobbies and classrooms.\n\nTargets set for the project: mAP@0.5 ≥ 0.85 on the person class, mean absolute counting error ≤ 2 people per frame on the test set, and measured FPS on live video (reference ≥ 25).\n\nStill early. What is built so far is the tracking layer, written by hand rather than pulled from a library: a BBox frozen dataclass with IoU, and a CentroidTracker that assigns a stable ID to each person across frames. The v2 handles temporary occlusion through an absence counter — without it, every time someone walks behind a pillar the system issues a fresh ID and counts them twice.\n\nRuns on Python 3.11 with CUDA 12.6 (RTX 3050 6GB), laid out as a proper research repository: source as an installable package, experiment configs, logs and checkpoints, and notebooks each kept separate, with datasets and the virtualenv deliberately out of version control.",
    detail:
      "Đề tài nghiên cứu khoa học sinh viên năm 3, khoa Công nghệ Thông tin — Đại học Công nghiệp TP.HCM. Mục tiêu là xây hệ thống phát hiện và đếm người trong ảnh/video bằng YOLOv8 kết hợp theo dõi đối tượng, đánh giá trên COCO 2017 (lớp person) cùng video tự quay ở sảnh và lớp học của trường.\n\nChỉ tiêu đặt ra: mAP@0.5 ≥ 0.85 trên lớp person, sai số đếm tuyệt đối trung bình ≤ 2 người/khung hình trên tập test, và đo FPS trên video thời gian thực (tham chiếu ≥ 25).\n\nDự án đang ở giai đoạn đầu. Phần đã dựng xong là tầng theo dõi đối tượng, tự viết chứ không lấy sẵn từ thư viện: lớp BBox dạng frozen dataclass kèm phép tính IoU, và CentroidTracker gán ID ổn định cho từng người qua các khung hình. Bản v2 xử lý được trường hợp bị che khuất tạm thời bằng bộ đếm số khung vắng mặt — không có nó thì mỗi lần một người đi khuất sau cây cột là hệ thống cấp ID mới và đếm trùng.\n\nChạy trên Python 3.11 với CUDA 12.6 (RTX 3050 6GB), tổ chức theo đúng cấu trúc một kho nghiên cứu: mã nguồn dạng package cài được, cấu hình thí nghiệm, log và checkpoint, notebook để riêng từng phần; dữ liệu và môi trường ảo cố ý không đưa vào quản lý phiên bản.",
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
  // Repo đã chuyển sang private (02/11/2026): giữ thẻ, bỏ link GitHub
  {
    id: "burgershop-pod-tool",
    ...REPO_META["burgershop-pod-tool"],
    image: projectImage("burgershop-pod-tool"),
    year: "2026",
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

// Danh sách hiển thị mặc định: 2 dự án định vị mới đứng ĐẦU danh sách, tiếp đến các dự án gần đây,
// dự án doanh nghiệp/private và các repo công khai.
// Được export để trang /admin dùng CHUNG một nguồn — tránh lệch dữ liệu khi lưu localStorage.
const recentProjects = [
  {
    id: "supabase-rls-check",
    ...REPO_META["supabase-rls-check"],
    image: projectImage("supabase-rls-check"),
    year: "2026",
    link: "https://github.com/Tthanh2k6/supabase-rls-check",
  },
  {
    id: "supabase-multitenant-rls",
    category: "SUPABASE • POSTGRES RLS • MULTI-TENANT",
    shortName: "MULTI-TENANT RLS",
    shortNameEn: "MULTI-TENANT RLS",
    title: "Mẫu SaaS nhiều khách hàng trên Supabase, có test cô lập dữ liệu",
    titleEn: "Multi-tenant Supabase RLS reference with isolation tests",
    desc: "Nhiều doanh nghiệp dùng chung một cơ sở dữ liệu mà mỗi bên chỉ thấy dữ liệu của mình; 19 test thử vượt ranh giới đều bị chặn.",
    descEn:
      "Many customers share one database and each sees only its own rows; 19 tests try to cross the boundary and all are blocked.",
    detail:
      "Migration mẫu cho mô hình nhiều khách hàng (multi-tenant) dùng chung một schema Postgres trên Supabase:\n\n• Mọi dòng có tenant_id, mọi bảng bật RLS; bảng dữ liệu bật FORCE ROW LEVEL SECURITY nên cả backend kết nối bằng tài khoản chủ bảng cũng bị lọc.\n\n• Vai trò owner/admin/member nằm trong bảng memberships, không đọc từ user_metadata (người dùng tự sửa được).\n\n• Khoá ngoại ghép (id, tenant_id) chặn việc gắn dữ liệu của khách này vào bản ghi của khách khác; file Storage chia theo thư mục tenant.\n\n• 19 test đăng nhập như người dùng thật và thử đọc, ghi, chuyển dòng, gắn chéo, tự xưng admin: tất cả bị chặn đúng mã lỗi. CI chạy trên PostgreSQL 15 và kiểm schema bằng supabase-rls-check (0 phát hiện).",
    detailEn:
      "A reference migration for many customers (tenants) in one shared Postgres schema on Supabase:\n\n• tenant_id on every row and RLS on every table; tenant data tables use FORCE ROW LEVEL SECURITY, so a backend connecting as the table owner is filtered too.\n\n• Roles (owner, admin, member) come from a memberships table, never from user-editable user_metadata.\n\n• Composite foreign keys (id, tenant_id) block cross-tenant references; Storage files live under a tenant folder.\n\n• 19 tests sign in as real users and try to read, write, move rows, cross-link and claim admin: every attempt is blocked with the expected error. CI runs on PostgreSQL 15 and lints the schema with supabase-rls-check (0 findings).",
    tech: ["PostgreSQL", "Supabase RLS", "SQL", "pytest", "psycopg", "GitHub Actions"],
    image: projectImage("supabase-multitenant-rls"),
    role: "Tác giả",
    roleEn: "Author",
    client: "Mã nguồn mở (MIT)",
    clientEn: "Open source (MIT)",
    year: "2026",
    yearRole: "2026 • PostgreSQL, Supabase",
    link: "https://github.com/Tthanh2k6/supabase-multitenant-rls" as string | undefined,
    demo: undefined as string | undefined,
  },
  {
    id: "market-data-pipeline",
    category: "PYTHON • SUPABASE • GITHUB ACTIONS",
    shortName: "MARKET DATA PIPELINE",
    shortNameEn: "MARKET DATA PIPELINE",
    title: "Pipeline dữ liệu thị trường tự động vào Supabase",
    titleEn: "Automated market data pipeline into Supabase",
    desc: "Tự tải giá chỉ số, ngoại tệ, crypto, hàng hoá, trái phiếu theo lịch, kiểm lỗi dữ liệu và lưu vào cơ sở dữ liệu.",
    descEn:
      "Pulls indices, FX, crypto, commodities and bonds on a schedule, checks the data for errors and stores it in a database.",
    detail:
      "Job Python chạy theo lịch trên GitHub Actions:\n\n• Nguồn miễn phí: yfinance cho chỉ số, ngoại tệ, hàng hoá, trái phiếu, VIX; API công khai của Binance cho crypto.\n\n• Chuẩn hoá về OHLCV giờ UTC, dựng nến 4 giờ từ nến 1 giờ, nến ngày/tuần đưa về 00:00 UTC.\n\n• Kiểm dữ liệu: trùng thời điểm, OHLC vô lý, khoảng trống bất thường (bỏ qua giờ đóng cửa sàn); thêm SMA, EMA, RSI, ATR.\n\n• Ghi vào Supabase qua PostgREST theo khoá (symbol, timeframe, ts) nên chạy lại không tạo trùng. 22 test; chạy thật 14/14 mã.",
    detailEn:
      "A Python job scheduled on GitHub Actions:\n\n• Free sources: yfinance for indices, FX, commodities, bonds and VIX; Binance public klines for crypto.\n\n• Normalises to OHLCV in UTC, builds 4H bars from 1H, and stores daily/weekly bars at 00:00 UTC.\n\n• Validation for duplicates, impossible OHLC values and unusual gaps (market closures excluded), plus SMA, EMA, RSI and ATR.\n\n• Upserts into Supabase through PostgREST on (symbol, timeframe, ts), so re-runs never duplicate. 22 tests; a live dry run fetched all 14 symbols.",
    tech: ["Python", "pandas", "Supabase", "PostgREST", "GitHub Actions", "pytest"],
    image: projectImage("market-data-pipeline"),
    role: "Tác giả",
    roleEn: "Author",
    client: "Mã nguồn mở (MIT)",
    clientEn: "Open source (MIT)",
    year: "2026",
    yearRole: "2026 • Python, Supabase",
    link: "https://github.com/Tthanh2k6/market-data-pipeline" as string | undefined,
    demo: undefined as string | undefined,
  },
  {
    id: "race-safe-salon-booking",
    category: "CLOUDFLARE WORKERS • D1 • STRIPE",
    shortName: "SALON BOOKING (D1)",
    shortNameEn: "RACE-SAFE BOOKING",
    title: "Đặt lịch tiệm nail chống trùng ca (Cloudflare Workers + D1 + Stripe)",
    titleEn: "Race-safe salon booking (Cloudflare Workers + D1 + Stripe)",
    desc: "Trang đặt lịch có đặt cọc Stripe: 5 yêu cầu cùng lúc cho cùng thợ và giờ chỉ nhận 1, chặn 4; chống chồng ca khác thời lượng.",
    descEn:
      "Deposit booking build on Workers + D1: 5 simultaneous requests for the same technician & slot accept 1 and reject 4; 11 tests.",
    detail:
      "Bản dựng demo hệ thống đặt lịch tiệm nail chạy trên Cloudflare Workers, cơ sở dữ liệu D1 và Stripe (đặt cọc đã tắt trên bản demo):\n\n• Chống trùng lịch khi đặt đồng thời (race-safe): gửi 5 yêu cầu đặt cùng lúc cho cùng một thợ và khung giờ → hệ thống nhận đúng 1 yêu cầu và chặn 4 yêu cầu còn lại; kiểm tra chống chồng ca khi các dịch vụ có thời lượng dài ngắn khác nhau.\n\n• Đặt cọc qua Stripe Checkout, xác minh chữ ký webhook bằng Web Crypto ngay trên Workers.\n\n• Cấp lịch iCal riêng cho từng thợ, trang quản trị có mật khẩu bảo vệ, giao diện song ngữ Anh/Việt và 11 bài test.\n\n• Gói cài đặt trên Contra: https://contra.com/s/rM2mMN2k-nail-salon-booking-page-with-deposits-no-monthly-fee",
    detailEn:
      "A demo salon booking system built on Cloudflare Workers, D1 SQLite, and Stripe (deposits are turned off on the demo):\n\n• Race-safe concurrency: 5 simultaneous booking requests for the same technician and time result in 1 accepted and 4 rejected, with overlap checks across mixed service lengths.\n\n• Deposits processed via Stripe Checkout with webhook signatures verified in Web Crypto.\n\n• Per-technician iCal feeds, password-protected admin page, English/Vietnamese UI, and 11 tests.\n\n• Setup package on Contra: https://contra.com/s/rM2mMN2k-nail-salon-booking-page-with-deposits-no-monthly-fee",
    tech: ["Cloudflare Workers", "Cloudflare D1", "TypeScript", "Stripe Checkout", "Web Crypto", "iCal"],
    image: "/IMG/lotus-booking-live.png",
    role: "Full-stack Developer",
    roleEn: "Full-stack Developer",
    client: "Bản demo & gói cài đặt trên Contra",
    clientEn: "Demo build & Contra setup package",
    year: "2026",
    yearRole: "2026 • Cloudflare Workers, D1",
    link: undefined as string | undefined,
    demo: "https://lotus-nail-booking.lotus-nail-booking-v2.workers.dev" as string | undefined,
    demoLabel: "Xem bản demo chạy thật",
    demoLabelEn: "Live demo",
  },
  {
    id: "discord-membership-bot",
    category: "NODE.JS • DISCORD • SUBSCRIPTIONS",
    shortName: "BOT THÀNH VIÊN DISCORD",
    shortNameEn: "DISCORD MEMBERSHIP BOT",
    title: "Bot quản lý thành viên Discord",
    titleEn: "Discord membership bot",
    desc: "Cấp vai trò Discord khi gói trả phí còn hiệu lực, thu hồi khi hết kỳ; báo đơn Shopify không kèm thông tin liên hệ.",
    descEn: "Grants paid Discord roles during active subscriptions, removes them when the paid period ends, and posts Shopify order alerts.",
    detail: "Bot Node.js dùng discord.js và node:sqlite. Cấp vai trò Discord trả phí cho thành viên có gói đăng ký còn hiệu lực qua Stripe, Whop hoặc Zapier/Make; thu hồi vai trò khi kỳ trả phí kết thúc.\n\nĐăng thông báo đơn hàng Shopify không kèm thông tin liên hệ của khách hàng. Có 57 bài kiểm thử offline.",
    detailEn: "A Node.js bot using discord.js and node:sqlite. Gives a paid Discord role to members with an active Stripe, Whop or Zapier/Make subscription and removes it when the paid period ends.\n\nPosts Shopify order alerts without customer contact details. Includes 57 offline tests.",
    tech: ["Node.js", "discord.js", "node:sqlite"],
    image: "https://placehold.co/600x338/111219/ffffff?text=Discord+Membership+Bot",
    role: "Lập trình viên",
    roleEn: "Developer",
    client: "Dự án mã nguồn mở",
    clientEn: "Open-source project",
    year: "2026",
    yearRole: "2026 • Node.js & Discord",
    link: "https://github.com/Tthanh2k6/discord-membership-bot",
  },
  {
    id: "demo-nail-salon-booking-agent",
    category: "AI • AGENTPLACE • DEMO",
    shortName: "AI ĐẶT LỊCH NAIL",
    shortNameEn: "AI NAIL BOOKING DEMO",
    title: "AI đặt lịch cho tiệm nail mẫu (Agentplace)",
    titleEn: "AI booking agent for a demo nail salon (Agentplace)",
    desc: "Tư vấn dịch vụ và giá, gợi ý ba giờ trống, tóm tắt trước khi xác nhận, trả lời được tiếng Việt. Tiệm mẫu, lịch hẹn không có thật.",
    descEn: "Recommends services and prices, offers three open times, and summarizes before confirmation. Demo salon; bookings are not real.",
    detail: "Agent trên Agentplace trả lời bằng tiếng Việt, đề xuất dịch vụ kèm giá và ba khung giờ còn trống. Hiển thị tóm tắt trước khi xác nhận và chỉ báo giá đã được niêm yết.\n\nĐây là cơ sở kinh doanh mẫu; các lịch đặt không có thật.",
    detailEn: "An Agentplace agent that recommends a service with its price, and offers three open times. Shows a summary before confirming, only quotes listed prices, and answers in Vietnamese when the customer writes in Vietnamese.\n\nThis is a demo business; bookings are not real.",
    tech: ["Agentplace"],
    image: "https://placehold.co/600x338/111219/ffffff?text=Nail+Salon+Booking+Demo",
    role: "Người xây dựng agent",
    roleEn: "Agent builder",
    client: "Tiệm nail mẫu — lịch hẹn không có thật",
    clientEn: "Demo nail salon — bookings are not real",
    year: "2026",
    yearRole: "2026 • Agentplace",
    link: undefined as string | undefined,
    demo: "https://nsit6vgim8oi.run.agentplace.io",
    demoLabel: "Thử bản demo",
    demoLabelEn: "Try the demo",
  },
  {
    id: "offline-fuel-receipt-ocr",
    category: "PYTHON • PADDLEOCR • EXCEL",
    shortName: "OCR HOÁ ĐƠN XĂNG DẦU",
    shortNameEn: "OFFLINE FUEL RECEIPT OCR",
    title: "OCR hoá đơn xăng dầu sang Excel, chạy offline",
    titleEn: "Offline fuel receipt OCR to Excel",
    desc: "Đọc ảnh hoá đơn xăng dầu Việt Nam vào Excel, đánh dấu dòng lệch tiền. Đã thử trên 6 hoá đơn tổng hợp.",
    descEn: "Reads Vietnamese fuel receipt photos into Excel and flags mismatched totals. Tested on 6 synthetic receipts.",
    detail: "Công cụ Python dùng PaddleOCR chạy offline để đọc ảnh hoá đơn xăng dầu tiếng Việt và xuất sang Excel. Đánh dấu các dòng mà số lít nhân đơn giá không khớp với tổng tiền.\n\nĐã kiểm thử trên 6 hoá đơn tổng hợp, không phải bộ hoá đơn thực tế.",
    detailEn: "An offline Python tool using PaddleOCR to read Vietnamese fuel receipt photos into Excel. Flags rows where liters × unit price does not match the total.\n\nTested on 6 synthetic receipts, not a real-world receipt dataset.",
    tech: ["Python", "PaddleOCR"],
    image: "https://placehold.co/600x338/111219/ffffff?text=Offline+Fuel+Receipt+OCR",
    role: "Lập trình viên",
    roleEn: "Developer",
    client: "Dự án thử nghiệm — hoá đơn tổng hợp",
    clientEn: "Experimental project — synthetic receipts",
    year: "2026",
    yearRole: "2026 • Python & PaddleOCR",
    link: undefined as string | undefined,
    demo: "https://dev.to/tthanh2k6/offline-vietnamese-fuel-receipt-ocr-in-python-and-the-apostrophe-bug-that-zeroed-three-fields-8n5",
    demoLabel: "Đọc bài viết kỹ thuật",
    demoLabelEn: "Read the write-up",
  },
];

export const projects = [...recentProjects, ...privateProjects, ...publicProjects];

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
            {paragraphs.map((p, i) => {
              const parts = p.split(/(https?:\/\/[^\s]+)/g);
              return (
                <p key={i}>
                  {parts.map((part, j) =>
                    /^https?:\/\//.test(part) ? (
                      <a
                        key={j}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#93c5fd",
                          textDecoration: "underline",
                          wordBreak: "break-all",
                        }}
                      >
                        {part}
                      </a>
                    ) : (
                      part
                    )
                  )}
                </p>
              );
            })}
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

// 5 dự án chủ lực hiển thị dạng thẻ lớn ở hàng Featured đầu trang (giữ đúng thứ tự)
const FEATURED_IDS = [
  "supabase-rls-check",
  "supabase-multitenant-rls",
  "race-safe-salon-booking",
  "MadalenaApp",
  "market-data-pipeline",
] as const;

const PAGE_SIZE = 9;

type ProjectGroup =
  | "Security & Supabase"
  | "Mobile"
  | "Automation & Data"
  | "AI & ML"
  | "Web & Tools";

type FilterGroupKey = "All" | ProjectGroup;

const FILTER_GROUPS: ReadonlyArray<{
  key: FilterGroupKey;
  labelVi: string;
  labelEn: string;
}> = [
  { key: "All", labelVi: "Tất cả", labelEn: "All" },
  {
    key: "Security & Supabase",
    labelVi: "Bảo mật & Supabase",
    labelEn: "Security & Supabase",
  },
  { key: "Mobile", labelVi: "Di động", labelEn: "Mobile" },
  {
    key: "Automation & Data",
    labelVi: "Tự động hoá & Dữ liệu",
    labelEn: "Automation & Data",
  },
  { key: "AI & ML", labelVi: "AI & Học máy", labelEn: "AI & ML" },
  { key: "Web & Tools", labelVi: "Web & Công cụ", labelEn: "Web & Tools" },
];

function matchCategoryToken(text: string): ProjectGroup | null {
  if (!text) return null;
  if (/\b(RLS|SUPABASE|POSTGRES|POSTGRESQL|POSTGREST)\b/i.test(text)) {
    return "Security & Supabase";
  }
  if (/\b(REACT\s+NATIVE|KOTLIN|ANDROID|FLUTTER|MOBILE|IOS)\b/i.test(text)) {
    return "Mobile";
  }
  if (
    /\b(APIFY|SCRAPING|SCRAPER|PLAYWRIGHT|SELENIUM|AUTOMATION|N8N)\b/i.test(
      text
    ) ||
    /PYTHON\s*[•·&/|-]\s*DATA/i.test(text)
  ) {
    return "Automation & Data";
  }
  if (
    /\b(AI|ML|MACHINE\s+LEARNING|DEEP\s+LEARNING|RAG|OPENAI|LLM|VISION|MEDIAPIPE|TENSORFLOW|TF\.JS|PYTORCH|YOLOV8|PADDLEOCR|OCR)\b/i.test(
      text
    )
  ) {
    return "AI & ML";
  }
  return null;
}

// Hàm thuần phân nhóm dự án dựa trên `category` (nhãn chính) rồi tới `tech`
function getProjectGroup(proj: {
  category?: string;
  tech?: string[];
}): ProjectGroup {
  const byCategory = matchCategoryToken(String(proj.category ?? ""));
  if (byCategory) return byCategory;

  const techJoined = Array.isArray(proj.tech) ? proj.tech.join(" • ") : "";
  const byTech = matchCategoryToken(techJoined);
  if (byTech) return byTech;

  return "Web & Tools";
}

function foldVietnamese(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

// Tìm kiếm không phân biệt hoa thường trên cả tiếng Việt & tiếng Anh (title, desc, tech, category)
function matchesProjectSearch(proj: any, rawQuery: string): boolean {
  const q = rawQuery.trim().toLowerCase();
  if (!q) return true;

  const searchable = [
    proj.title,
    proj.titleEn,
    proj.shortName,
    proj.shortNameEn,
    proj.desc,
    proj.descEn,
    proj.category,
    proj.id,
    ...(Array.isArray(proj.tech) ? proj.tech : []),
  ]
    .filter(Boolean)
    .join(" \n ")
    .toLowerCase();

  if (searchable.includes(q)) return true;

  // Hỗ trợ gõ tiếng Việt không dấu (vd: "diem danh", "lich hoc", "so thu chi")
  const foldedQuery = foldVietnamese(q);
  if (foldedQuery === q) {
    return foldVietnamese(searchable).includes(foldedQuery);
  }
  return false;
}

function normalizeProjectItems(raw: any[]): any[] {
  return raw.map((item: any) =>
    item.yearRole ? item : { ...item, yearRole: `${item.year} • ${item.role}` }
  );
}

function ProjectThumbnail({
  proj,
  alt,
  eager = false,
}: {
  proj: any;
  alt: string;
  eager?: boolean;
}) {
  return (
    <div className="ps-thumb">
      <img
        src={proj.image}
        alt={alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className={`ps-thumb-img ${proj.id === "AI_Lab" ? "is-zoom" : ""} ${
          ["DiemDanhQR", "supabase-multitenant-rls", "supabase-rls-check"].includes(proj.id) ? "is-fit-top" : ""
        }`}
        onError={(e) => {
          const target = e.currentTarget;
          const og = ghImage(proj.id);
          // Thiếu ảnh local -> thử ảnh OpenGraph GitHub; nếu vẫn lỗi -> placeholder
          if (!target.dataset.fallback && proj.id) {
            target.dataset.fallback = "og";
            target.src = og;
          } else {
            target.src = `https://placehold.co/600x338/111219/ffffff?text=${encodeURIComponent(
              proj.shortName || proj.title
            )}`;
          }
        }}
      />
    </div>
  );
}

export function ProjectSection() {
  const { t, pick } = useLang();
  const [projectList, setProjectList] = useState<any[]>(() =>
    normalizeProjectItems(projects)
  );
  const [activeGroup, setActiveGroup] = useState<FilterGroupKey>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Dự án đang mở trong modal chi tiết (null = đang đóng)
  const [detailProj, setDetailProj] = useState<any | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  // Tín hiệu hover của con trỏ chuột tuỳ chỉnh trên toàn site
  const triggerCursorHover = (enter: boolean) => {
    const eventName = enter ? "cursorHoverEnter" : "cursorHoverLeave";
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const openProjectModal = (proj: any, triggerEl?: HTMLElement | null) => {
    lastFocusRef.current =
      triggerEl ?? (document.activeElement as HTMLElement | null);
    setDetailProj(proj);
  };

  const closeProjectModal = () => {
    setDetailProj(null);
    requestAnimationFrame(() => {
      lastFocusRef.current?.focus?.();
    });
  };

  // Tải danh sách dự án (chỉ chạy phía client). Thứ tự ưu tiên:
  //   1. localStorage "project_list" (do admin chỉnh) — nếu có thì dùng luôn, không gọi API.
  //   2. Hiển thị ngay danh sách tĩnh, rồi fetch repo công khai từ GitHub để cập nhật.
  //   3. Nếu fetch lỗi (offline / vượt giới hạn request) thì giữ nguyên danh sách tĩnh.
  useEffect(() => {
    const applyList = (raw: any[]) => {
      const list = normalizeProjectItems(raw);
      setProjectList(list);
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

    // 2. Hiển thị ngay danh sách tĩnh làm nội dung tức thì + dự phòng
    applyList(projects);

    // 3. Lấy repo công khai mới nhất từ GitHub (tự cập nhật khi thêm repo mới)
    let cancelled = false;
    fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((repos) => {
        if (cancelled || !Array.isArray(repos)) return;
        // Bỏ các repo fork và repo trùng với dự án đã có trong danh sách recent/private
        const HIDDEN_REPOS = new Set([
          "GhiChu",
          "Tthanh2k6",
          "apify-thefork-restaurant-scraper",
        ]);
        const existingIds = new Set([
          ...recentProjects.map((p) => p.id),
          ...privateProjects.map((p) => p.id),
        ]);
        const mapped = repos
          .filter(
            (r: any) =>
              !r.fork && !HIDDEN_REPOS.has(r.name) && !existingIds.has(r.name)
          )
          .map(mapRepoToProject);
        // Giữ các dự án định vị mới và dự án doanh nghiệp/private ở đầu khi gộp.
        if (mapped.length > 0) {
          applyList([...recentProjects, ...privateProjects, ...mapped]);
        }
      })
      .catch((err) => console.error("Không lấy được repo GitHub:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  // Hàng Featured ở đầu trang theo đúng thứ tự FEATURED_IDS (bỏ qua nếu id không tồn tại)
  const featuredProjects = useMemo(() => {
    const byId = new Map<string, any>();
    for (const item of projectList) {
      if (item?.id && !byId.has(item.id)) {
        byId.set(item.id, item);
      }
    }
    return FEATURED_IDS.map((id) => byId.get(id)).filter(Boolean);
  }, [projectList]);

  // Lọc theo từ khoá trước để số đếm trên từng chip phản ánh trực tiếp kết quả đang khớp
  const searchMatchedProjects = useMemo(
    () => projectList.filter((proj) => matchesProjectSearch(proj, searchQuery)),
    [projectList, searchQuery]
  );

  const groupCounts = useMemo(() => {
    const counts: Record<FilterGroupKey, number> = {
      All: searchMatchedProjects.length,
      "Security & Supabase": 0,
      Mobile: 0,
      "Automation & Data": 0,
      "AI & ML": 0,
      "Web & Tools": 0,
    };
    for (const proj of searchMatchedProjects) {
      const grp = getProjectGroup(proj);
      counts[grp] += 1;
    }
    return counts;
  }, [searchMatchedProjects]);

  const filteredProjects = useMemo(() => {
    if (activeGroup === "All") return searchMatchedProjects;
    return searchMatchedProjects.filter(
      (proj) => getProjectGroup(proj) === activeGroup
    );
  }, [searchMatchedProjects, activeGroup]);

  const visibleProjects = useMemo(
    () => filteredProjects.slice(0, visibleCount),
    [filteredProjects, visibleCount]
  );

  const remainingCount = Math.max(
    0,
    filteredProjects.length - visibleProjects.length
  );

  const handleSelectGroup = (group: FilterGroupKey) => {
    setActiveGroup(group);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setVisibleCount(PAGE_SIZE);
  };

  const handleResetFilters = () => {
    setActiveGroup("All");
    setSearchQuery("");
    setVisibleCount(PAGE_SIZE);
    searchInputRef.current?.focus();
  };

  const hasOddFeatured = featuredProjects.length % 2 === 1;

  return (
    <>
      {/* Khối style đóng gói phạm vi */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .project-section-wrapper {
          --ps-bg: #06070d;
          --ps-surface: rgba(17, 18, 25, 0.9);
          --ps-surface-solid: #111219;
          --ps-surface-hover: #161824;
          --ps-elevated: #252e42;
          --ps-border: rgba(255, 255, 255, 0.08);
          --ps-border-hover: rgba(142, 162, 255, 0.38);
          --ps-accent: #8ea2ff;
          --ps-accent-soft: rgba(142, 162, 255, 0.11);
          --ps-accent-border: rgba(142, 162, 255, 0.24);
          --ps-accent-text: #c3cdff;
          --ps-cyan: #00a2ff;
          --ps-amber: #f0932b;
          --ps-font-display: 'Plus Jakarta Sans', 'Be Vietnam Pro', sans-serif;
          --ps-font-body: 'Be Vietnam Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          --ps-font-mono: 'Fira Code', ui-monospace, SFMono-Regular, Menlo, monospace;

          position: relative;
          min-height: 100vh;
          width: 100%;
          background-color: var(--ps-bg);
          background-image: url('/IMG/background.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          overflow-x: clip;
          font-family: var(--ps-font-body);
          color: #ffffff;
        }

        /* Lớp phủ tối làm dịu ảnh nền để chữ và hệ thống thẻ đọc rõ trên suốt chiều dài cuộn */
        .project-section-wrapper::before {
          content: '';
          position: fixed;
          inset: 0;
          background:
            radial-gradient(circle at 18% 12%, rgba(0, 162, 255, 0.09) 0%, transparent 46%),
            radial-gradient(circle at 84% 18%, rgba(240, 147, 43, 0.06) 0%, transparent 42%),
            linear-gradient(180deg, rgba(6, 7, 13, 0.78) 0%, rgba(6, 7, 13, 0.9) 55%, rgba(6, 7, 13, 0.96) 100%);
          pointer-events: none;
          z-index: 0;
        }

        .ps-shell {
          position: relative;
          z-index: 1;
          width: min(1240px, 100%);
          margin: 0 auto;
          padding: 118px 28px 88px;
        }

        /* ===== TIÊU ĐỀ TRANG ===== */
        .ps-hero {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px 32px;
          padding-bottom: 28px;
          border-bottom: 1px solid var(--ps-border);
          animation: psFadeUp 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .ps-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--ps-font-mono);
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ps-accent);
          margin: 0 0 10px;
          font-variant-numeric: tabular-nums;
        }

        .ps-eyebrow-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--ps-cyan), var(--ps-amber));
          box-shadow: 0 0 10px rgba(0, 162, 255, 0.6);
        }

        .ps-title {
          font-family: var(--ps-font-display);
          font-size: clamp(2rem, 3.6vw, 2.85rem);
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.2;
          margin: 0;
          color: #ffffff;
        }

        .ps-title-accent {
          background: linear-gradient(90deg, var(--ps-cyan) 0%, var(--ps-accent) 52%, var(--ps-amber) 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .ps-subtitle {
          max-width: 520px;
          margin: 0;
          font-size: 0.92rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.66);
        }

        /* ===== CẤU TRÚC SECTION CHUNG ===== */
        .ps-section {
          margin-top: 38px;
        }

        .ps-section-all {
          margin-top: 56px;
          padding-top: 40px;
          border-top: 1px solid var(--ps-border);
        }

        .ps-section-head {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px 24px;
          margin-bottom: 20px;
        }

        .ps-section-title-group {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ps-section-kicker {
          font-family: var(--ps-font-mono);
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.45);
          font-variant-numeric: tabular-nums;
        }

        .ps-section-title {
          font-family: var(--ps-font-display);
          font-size: clamp(1.32rem, 2.2vw, 1.65rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin: 0;
          color: #ffffff;
        }

        .ps-section-note {
          margin: 0;
          font-size: 0.84rem;
          color: rgba(255, 255, 255, 0.56);
          font-variant-numeric: tabular-nums;
        }

        /* ===== HÀNG FEATURED (THẺ LỚN Ở ĐẦU TRANG) ===== */
        .ps-featured-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 22px;
        }

        /* ===== KHUNG THẺ DỰ ÁN DÙNG CHUNG ===== */
        .ps-card {
          position: relative;
          display: flex;
          flex-direction: column;
          min-width: 0;
          background: var(--ps-surface);
          border: 1px solid var(--ps-border);
          border-radius: 18px;
          overflow: hidden;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 14px 36px rgba(0, 0, 0, 0.36);
          transition:
            transform 0.26s cubic-bezier(0.22, 1, 0.36, 1),
            border-color 0.24s ease,
            background-color 0.24s ease,
            box-shadow 0.26s ease;
        }

        .ps-card:hover {
          transform: translateY(-3px);
          background: var(--ps-surface-hover);
          border-color: var(--ps-border-hover);
          box-shadow: 0 22px 48px rgba(0, 0, 0, 0.54), 0 0 0 1px rgba(142, 162, 255, 0.14);
        }

        .ps-card-featured {
          border-color: rgba(142, 162, 255, 0.18);
          background: linear-gradient(180deg, rgba(22, 25, 38, 0.94) 0%, rgba(15, 16, 24, 0.95) 100%);
        }

        /* Chữ ký thị giác tinh gọn cho thẻ đầu bảng Featured: dải phổ mảnh 2px */
        .ps-card-lead::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--ps-cyan) 0%, var(--ps-accent) 55%, var(--ps-amber) 100%);
          z-index: 3;
          pointer-events: none;
        }

        @media (min-width: 1024px) {
          .ps-card-lead {
            grid-column: 1 / -1;
            display: grid;
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
            align-items: stretch;
          }

          .ps-card-lead .ps-thumb {
            height: 100%;
            min-height: 290px;
            border-bottom: none;
            border-right: 1px solid var(--ps-border);
          }

          .ps-card-lead .ps-card-body {
            padding: 26px 28px;
          }

          .ps-card-lead .ps-card-title {
            font-size: 1.42rem;
          }
        }

        /* KHUNG THUMBNAIL 16:9 */
        .ps-thumb {
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #0a0b11;
          border-bottom: 1px solid var(--ps-border);
          flex-shrink: 0;
        }

        .ps-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), filter 0.3s ease;
        }

        .ps-card:hover .ps-thumb-img {
          transform: scale(1.035);
        }

        .ps-thumb-img.is-fit-top {
          object-position: center top;
        }

        .ps-thumb-img.is-zoom {
          transform: scale(1.42);
          object-position: center top;
        }

        .ps-card:hover .ps-thumb-img.is-zoom {
          transform: scale(1.47);
        }

        /* PHẦN THÂN THẺ (lưu ý: giữ position: static để .ps-card-cta::after phủ trọn .ps-card) */
        .ps-card-body {
          display: flex;
          flex-direction: column;
          flex: 1 1 auto;
          min-width: 0;
          padding: 16px 18px 18px;
          gap: 8px;
        }

        .ps-card-featured .ps-card-body {
          padding: 20px 22px 22px;
          gap: 10px;
        }

        .ps-card-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-width: 0;
        }

        .ps-card-category {
          font-family: var(--ps-font-mono);
          font-size: 0.67rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ps-accent);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .ps-featured-badge {
          flex-shrink: 0;
          font-family: var(--ps-font-mono);
          font-size: 0.64rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 3px 8px;
          border-radius: 999px;
          background: rgba(0, 162, 255, 0.12);
          border: 1px solid rgba(0, 162, 255, 0.28);
          color: #8fd8ff;
        }

        .ps-card-title {
          font-family: var(--ps-font-display);
          font-size: 1.04rem;
          font-weight: 700;
          line-height: 1.36;
          letter-spacing: -0.015em;
          color: #ffffff;
          margin: 0;
          padding-top: 1px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          overflow-wrap: anywhere;
        }

        .ps-card-featured .ps-card-title {
          font-size: 1.22rem;
          font-weight: 800;
        }

        .ps-card-desc {
          font-size: 0.855rem;
          line-height: 1.56;
          color: rgba(255, 255, 255, 0.68);
          margin: 0;
          padding-top: 1px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ps-card-featured .ps-card-desc {
          font-size: 0.9rem;
          -webkit-line-clamp: 3;
          line-clamp: 3;
          color: rgba(255, 255, 255, 0.74);
        }

        .ps-featured-context {
          font-size: 0.78rem;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.5);
          margin: 2px 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ps-tech-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          list-style: none;
          padding: 2px 0 0;
          margin: 0;
        }

        .ps-tech-chip {
          font-family: var(--ps-font-mono);
          font-size: 0.69rem;
          font-weight: 500;
          line-height: 1.2;
          padding: 4px 9px;
          border-radius: 999px;
          background: var(--ps-accent-soft);
          border: 1px solid var(--ps-accent-border);
          color: var(--ps-accent-text);
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ps-card-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .ps-card-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--ps-font-mono);
          font-size: 0.69rem;
          color: rgba(255, 255, 255, 0.52);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ps-status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .ps-status-dot.is-live {
          background: #34d399;
          box-shadow: 0 0 8px rgba(52, 211, 153, 0.65);
        }

        .ps-status-dot.is-open {
          background: var(--ps-accent);
        }

        .ps-status-dot.is-private {
          background: rgba(255, 255, 255, 0.34);
        }

        /* Nút chi tiết trải pseudo-element ::after phủ toàn bộ .ps-card:
           cả thẻ vừa bấm được vừa nhận focus bàn phím chuẩn ngữ nghĩa mà không lồng <button>. */
        .ps-card-cta {
          appearance: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--ps-font-body);
          font-size: 0.77rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          padding: 7px 13px;
          border-radius: 9px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: var(--ps-elevated);
          color: #ffffff;
          cursor: pointer;
          flex-shrink: 0;
          transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }

        .ps-card-cta::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 2;
          border-radius: inherit;
        }

        .ps-cta-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }

        .ps-card:hover .ps-card-cta {
          background: #ffffff;
          color: #06070d;
          border-color: #ffffff;
        }

        .ps-card:hover .ps-cta-arrow {
          transform: translateX(3px);
        }

        .ps-card-cta:focus {
          outline: none;
        }

        .ps-card-cta:focus-visible {
          outline: 2px solid var(--ps-accent);
          outline-offset: 2px;
        }

        .ps-card:has(.ps-card-cta:focus-visible) {
          border-color: var(--ps-accent);
          box-shadow: 0 0 0 2px var(--ps-accent), 0 22px 48px rgba(0, 0, 0, 0.6);
        }

        .ps-card:has(.ps-card-cta:focus-visible) .ps-card-cta {
          outline: none;
          background: #ffffff;
          color: #06070d;
          border-color: #ffffff;
        }

        /* ===== THANH TÌM KIẾM & BỘ LỌC CHIP ===== */
        .ps-controls {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 24px;
        }

        .ps-search-row {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-end;
          justify-content: space-between;
          gap: 14px 20px;
        }

        .ps-search-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          width: min(400px, 100%);
        }

        .ps-search-label {
          font-family: var(--ps-font-mono);
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.62);
        }

        .ps-search-box {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
        }

        .ps-search-icon {
          position: absolute;
          left: 13px;
          width: 16px;
          height: 16px;
          color: rgba(255, 255, 255, 0.44);
          pointer-events: none;
        }

        .ps-search-input {
          width: 100%;
          height: 42px;
          padding: 0 38px 0 38px;
          border-radius: 11px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          background: rgba(17, 18, 25, 0.92);
          color: #ffffff;
          font-family: var(--ps-font-body);
          font-size: 0.88rem;
          user-select: text;
          -webkit-user-select: text;
          transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
        }

        .ps-search-input::placeholder {
          color: rgba(255, 255, 255, 0.38);
        }

        .ps-search-input::-webkit-search-cancel-button,
        .ps-search-input::-webkit-search-decoration {
          -webkit-appearance: none;
          appearance: none;
        }

        .ps-search-input:hover {
          border-color: rgba(255, 255, 255, 0.24);
        }

        .ps-search-input:focus {
          outline: none;
        }

        .ps-search-input:focus-visible {
          border-color: var(--ps-accent);
          box-shadow: 0 0 0 2px rgba(142, 162, 255, 0.35);
          background: #141622;
        }

        .ps-search-clear {
          position: absolute;
          right: 7px;
          width: 28px;
          height: 28px;
          border-radius: 7px;
          border: none;
          background: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.78);
          font-size: 0.75rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
        }

        .ps-search-clear:hover {
          background: rgba(255, 255, 255, 0.2);
          color: #ffffff;
        }

        .ps-search-clear:focus-visible {
          outline: 2px solid var(--ps-accent);
          outline-offset: 2px;
        }

        .ps-filter-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .ps-chip {
          appearance: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 38px;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          background: rgba(17, 18, 25, 0.82);
          color: rgba(255, 255, 255, 0.76);
          font-family: var(--ps-font-body);
          font-size: 0.83rem;
          font-weight: 600;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.18s ease;
        }

        .ps-chip:hover {
          border-color: rgba(255, 255, 255, 0.28);
          color: #ffffff;
          background: rgba(30, 34, 50, 0.9);
        }

        .ps-chip.is-active {
          background: #ffffff;
          color: #06070d;
          border-color: #ffffff;
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.14);
        }

        .ps-chip:focus-visible {
          outline: 2px solid var(--ps-accent);
          outline-offset: 3px;
        }

        .ps-chip-count {
          font-family: var(--ps-font-mono);
          font-size: 0.72rem;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          padding: 1px 7px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.09);
          color: rgba(255, 255, 255, 0.72);
        }

        .ps-chip.is-active .ps-chip-count {
          background: rgba(6, 7, 13, 0.12);
          color: #06070d;
          font-weight: 600;
        }

        /* ===== LƯỚI COMPACT CARDS (3 DESKTOP / 2 TABLET / 1 PHONE) ===== */
        .ps-compact-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        /* ===== NÚT SHOW MORE & TRẠNG THÁI RỖNG ===== */
        .ps-more-wrap {
          margin-top: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .ps-more-btn {
          appearance: none;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-height: 44px;
          padding: 11px 24px;
          border-radius: 12px;
          border: 1px solid rgba(142, 162, 255, 0.34);
          background: var(--ps-elevated);
          color: #ffffff;
          font-family: var(--ps-font-body);
          font-size: 0.88rem;
          font-weight: 700;
          cursor: pointer;
          transition:
            background-color 0.22s ease,
            color 0.22s ease,
            border-color 0.22s ease,
            transform 0.2s ease;
        }

        .ps-more-btn:hover {
          background: #ffffff;
          color: #06070d;
          border-color: #ffffff;
          transform: translateY(-1px);
        }

        .ps-more-btn:focus-visible {
          outline: 2px solid var(--ps-accent);
          outline-offset: 3px;
        }

        .ps-more-badge {
          font-family: var(--ps-font-mono);
          font-size: 0.74rem;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
        }

        .ps-more-btn:hover .ps-more-badge {
          background: rgba(6, 7, 13, 0.12);
        }

        .ps-empty-state {
          padding: 48px 24px;
          border-radius: 18px;
          border: 1px dashed rgba(255, 255, 255, 0.18);
          background: rgba(17, 18, 25, 0.78);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .ps-empty-title {
          font-family: var(--ps-font-display);
          font-size: 1.14rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
        }

        .ps-empty-desc {
          max-width: 440px;
          margin: 0;
          font-size: 0.88rem;
          line-height: 1.55;
          color: rgba(255, 255, 255, 0.6);
        }

        .ps-reset-btn {
          margin-top: 8px;
          appearance: none;
          min-height: 40px;
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          background: #ffffff;
          color: #06070d;
          font-family: var(--ps-font-body);
          font-size: 0.83rem;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        .ps-reset-btn:hover {
          background: #c9d4ff;
          border-color: #c9d4ff;
        }

        .ps-reset-btn:focus-visible {
          outline: 2px solid var(--ps-accent);
          outline-offset: 3px;
        }

        /* ===== MODAL CHI TIẾT DỰ ÁN (GIỮ NGUYÊN PHONG CÁCH) ===== */
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

        .pd-close:focus-visible {
          outline: 2px solid #8ea2ff;
          outline-offset: 2px;
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

        .pd-btn:focus-visible {
          outline: 2px solid #8ea2ff;
          outline-offset: 3px;
        }

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

        @keyframes psFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1023px) {
          .ps-shell {
            padding: 104px 22px 72px;
          }

          .ps-compact-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .ps-featured-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .ps-card-lead {
            grid-column: 1 / -1;
          }
        }

        @media (max-width: 639px) {
          .ps-shell {
            padding: 96px 16px 60px;
          }

          .ps-featured-grid,
          .ps-compact-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .ps-card-lead {
            grid-column: auto;
          }

          .ps-search-field {
            width: 100%;
          }

          .pd-overlay { padding: 16px 12px; }
          .pd-body { padding: 20px 20px 24px; }
          .pd-title { font-size: 1.3rem; }
          .pd-meta { grid-template-columns: 1fr; gap: 10px; }
        }

        /* ===== TÔN TRỌNG PREFERS-REDUCED-MOTION ===== */
        @media (prefers-reduced-motion: reduce) {
          .ps-hero,
          .pd-overlay,
          .pd-panel {
            animation: none !important;
          }

          .ps-card,
          .ps-thumb-img,
          .ps-card-cta,
          .ps-cta-arrow,
          .ps-chip,
          .ps-search-input,
          .ps-search-clear,
          .ps-more-btn,
          .ps-reset-btn,
          .pd-close,
          .pd-btn {
            transition: none !important;
          }

          .ps-card:hover,
          .ps-more-btn:hover,
          .pd-close:hover {
            transform: none !important;
          }

          .ps-card:hover .ps-thumb-img {
            transform: none !important;
          }

          .ps-card:hover .ps-thumb-img.is-zoom {
            transform: scale(1.42) !important;
          }
        }
      `}</style>

      <div className="project-section-wrapper">
        {/* Thanh điều hướng */}
        <NavBar className="mix-blend-difference" />

        <div className="ps-shell">
          {/* Tiêu đề trang */}
          <header className="ps-hero">
            <div>
              <p className="ps-eyebrow">
                <span className="ps-eyebrow-dot" aria-hidden="true" />
                {t(
                  `Danh mục kỹ thuật · ${projectList.length} dự án`,
                  `Engineering Index · ${projectList.length} builds`
                )}
              </p>
              <h1 className="ps-title">
                {t("Dự án ", "Project ")}
                <span className="ps-title-accent">
                  {t("& Sản phẩm thực tế", "Showcase")}
                </span>
              </h1>
            </div>
            <p className="ps-subtitle">
              {t(
                "Các công cụ kiểm tra bảo mật Postgres/Supabase, ứng dụng di động trên App Store & Google Play, cùng hệ thống tự động hoá Python.",
                "Postgres/Supabase security tooling, App Store & Google Play mobile apps, edge booking systems, and Python data automation."
              )}
            </p>
          </header>

          {/* 1. Hàng dự án tiêu biểu (Featured) ở đầu trang */}
          {featuredProjects.length > 0 ? (
            <section
              className="ps-section"
              aria-labelledby="ps-featured-heading"
            >
              <div className="ps-section-head">
                <div className="ps-section-title-group">
                  <span className="ps-section-kicker">
                    {t("Chọn lọc hàng đầu", "Selected Highlights")}
                  </span>
                  <h2 id="ps-featured-heading" className="ps-section-title">
                    {t("Dự án tiêu biểu", "Featured Projects")}
                  </h2>
                </div>
                <p className="ps-section-note">
                  {t(
                    "Bấm vào bất kỳ thẻ nào để đọc kiến trúc & kiểm thử chi tiết",
                    "Select any card for architecture & testing breakdown"
                  )}
                </p>
              </div>

              <div className="ps-featured-grid">
                {featuredProjects.map((proj, idx) => {
                  const isLead = hasOddFeatured && idx === 0;
                  const titleText = String(pick(proj, "title") || "");
                  const thumbAlt = String(
                    pick(proj, "shortName") || titleText
                  );
                  const contextParts = [
                    pick(proj, "role"),
                    pick(proj, "client"),
                  ].filter(Boolean);

                  return (
                    <article
                      key={proj.id}
                      className={`ps-card ps-card-featured ${
                        isLead ? "ps-card-lead" : ""
                      }`}
                      onMouseEnter={() => triggerCursorHover(true)}
                      onMouseLeave={() => triggerCursorHover(false)}
                    >
                      <ProjectThumbnail
                        proj={proj}
                        alt={thumbAlt}
                        eager={idx < 2}
                      />

                      <div className="ps-card-body">
                        <div className="ps-card-topline">
                          <span className="ps-card-category">
                            {proj.category}
                          </span>
                          <span className="ps-featured-badge">
                            {t("Tiêu biểu", "Featured")}
                          </span>
                        </div>

                        <h3 className="ps-card-title">{titleText}</h3>
                        <p className="ps-card-desc">{pick(proj, "desc")}</p>

                        {contextParts.length > 0 ? (
                          <p className="ps-featured-context">
                            {contextParts.join(" · ")}
                          </p>
                        ) : null}

                        {proj.tech?.length ? (
                          <ul
                            className="ps-tech-list"
                            aria-label={t("Công nghệ", "Technologies")}
                          >
                            {proj.tech.slice(0, 5).map((techName: string) => (
                              <li key={techName} className="ps-tech-chip">
                                {techName}
                              </li>
                            ))}
                          </ul>
                        ) : null}

                        <div className="ps-card-footer">
                          <span className="ps-card-status">
                            {proj.demo ? (
                              <>
                                <span
                                  className="ps-status-dot is-live"
                                  aria-hidden="true"
                                />
                                {t("Có bản chạy thật", "Live version")}
                              </>
                            ) : proj.link ? (
                              <>
                                <span
                                  className="ps-status-dot is-open"
                                  aria-hidden="true"
                                />
                                {t("Mã nguồn công khai", "Source public")}
                              </>
                            ) : (
                              <>
                                <span
                                  className="ps-status-dot is-private"
                                  aria-hidden="true"
                                />
                                {t("Mã nguồn nội bộ", "Private source")}
                              </>
                            )}
                          </span>

                          <button
                            type="button"
                            className="ps-card-cta"
                            aria-label={`${titleText} — ${t(
                              "Xem chi tiết",
                              "View details"
                            )}`}
                            onClick={(e) =>
                              openProjectModal(proj, e.currentTarget)
                            }
                          >
                            <span>{t("Xem chi tiết", "View details")}</span>
                            <span className="ps-cta-arrow" aria-hidden="true">
                              →
                            </span>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ) : null}

          {/* 2. Danh sách toàn bộ dự án (lọc theo nhóm + tìm kiếm + phân trang 9 thẻ) */}
          <section
            className="ps-section ps-section-all"
            aria-labelledby="ps-all-heading"
          >
            <div className="ps-controls">
              <div className="ps-search-row">
                <div className="ps-section-title-group">
                  <span className="ps-section-kicker">
                    {t("Kho lưu trữ đầy đủ", "Complete Archive")}
                  </span>
                  <h2 id="ps-all-heading" className="ps-section-title">
                    {t("Tất cả dự án", "All projects")}
                  </h2>
                  <p className="ps-section-note" aria-live="polite">
                    {filteredProjects.length === 0
                      ? t("0 dự án khớp bộ lọc", "0 matching projects")
                      : t(
                          `Đang hiển thị ${visibleProjects.length} / ${filteredProjects.length} dự án`,
                          `Showing ${visibleProjects.length} of ${filteredProjects.length} projects`
                        )}
                  </p>
                </div>

                <div className="ps-search-field">
                  <label
                    htmlFor="project-search-input"
                    className="ps-search-label"
                  >
                    {t("Tìm kiếm dự án", "Search projects")}
                  </label>
                  <div className="ps-search-box">
                    <svg
                      className="ps-search-icon"
                      viewBox="0 0 20 20"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M14.167 14.167L17.5 17.5M15.833 9.167a6.667 6.667 0 11-13.333 0 6.667 6.667 0 0113.333 0z"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      ref={searchInputRef}
                      id="project-search-input"
                      type="search"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onMouseEnter={() => triggerCursorHover(true)}
                      onMouseLeave={() => triggerCursorHover(false)}
                      placeholder={t(
                        "Tên, mô tả, công nghệ, danh mục…",
                        "Title, summary, tech, category…"
                      )}
                      autoComplete="off"
                      spellCheck={false}
                      className="ps-search-input"
                    />
                    {searchQuery ? (
                      <button
                        type="button"
                        className="ps-search-clear"
                        aria-label={t("Xoá từ khoá tìm kiếm", "Clear search")}
                        onMouseEnter={() => triggerCursorHover(true)}
                        onMouseLeave={() => triggerCursorHover(false)}
                        onClick={() => {
                          triggerCursorHover(false);
                          handleSearchChange("");
                          searchInputRef.current?.focus();
                        }}
                      >
                        ✕
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Thanh chip lọc theo nhóm kèm số lượng */}
              <div
                className="ps-filter-bar"
                role="group"
                aria-label={t(
                  "Lọc dự án theo nhóm kỹ thuật",
                  "Filter projects by category"
                )}
              >
                {FILTER_GROUPS.map((group) => {
                  const isSelected = activeGroup === group.key;
                  return (
                    <button
                      key={group.key}
                      type="button"
                      aria-pressed={isSelected}
                      className={`ps-chip ${isSelected ? "is-active" : ""}`}
                      onMouseEnter={() => triggerCursorHover(true)}
                      onMouseLeave={() => triggerCursorHover(false)}
                      onClick={() => handleSelectGroup(group.key)}
                    >
                      <span>{t(group.labelVi, group.labelEn)}</span>
                      <span className="ps-chip-count">
                        {groupCounts[group.key]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {visibleProjects.length > 0 ? (
              <>
                <div className="ps-compact-grid">
                  {visibleProjects.map((proj) => {
                    const titleText = String(pick(proj, "title") || "");
                    const thumbAlt = String(
                      pick(proj, "shortName") || titleText
                    );

                    return (
                      <article
                        key={proj.id}
                        className="ps-card ps-card-compact"
                        onMouseEnter={() => triggerCursorHover(true)}
                        onMouseLeave={() => triggerCursorHover(false)}
                      >
                        <ProjectThumbnail proj={proj} alt={thumbAlt} />

                        <div className="ps-card-body">
                          <span className="ps-card-category">
                            {proj.category}
                          </span>
                          <h3 className="ps-card-title">{titleText}</h3>
                          <p className="ps-card-desc">{pick(proj, "desc")}</p>

                          {proj.tech?.length ? (
                            <ul
                              className="ps-tech-list"
                              aria-label={t("Công nghệ", "Technologies")}
                            >
                              {proj.tech.slice(0, 3).map((techName: string) => (
                                <li key={techName} className="ps-tech-chip">
                                  {techName}
                                </li>
                              ))}
                            </ul>
                          ) : null}

                          <div className="ps-card-footer">
                            <span className="ps-card-status">
                              {proj.demo ? (
                                <>
                                  <span
                                    className="ps-status-dot is-live"
                                    aria-hidden="true"
                                  />
                                  {t("Chạy thật", "Live")}
                                </>
                              ) : proj.link ? (
                                <>
                                  <span
                                    className="ps-status-dot is-open"
                                    aria-hidden="true"
                                  />
                                  {t("Công khai", "Public")}
                                </>
                              ) : (
                                <>
                                  <span
                                    className="ps-status-dot is-private"
                                    aria-hidden="true"
                                  />
                                  {t("Nội bộ", "Private")}
                                </>
                              )}
                            </span>

                            <button
                              type="button"
                              className="ps-card-cta"
                              aria-label={`${titleText} — ${t(
                                "Xem chi tiết",
                                "View details"
                              )}`}
                              onClick={(e) =>
                                openProjectModal(proj, e.currentTarget)
                              }
                            >
                              <span>{t("Xem chi tiết", "View details")}</span>
                              <span
                                className="ps-cta-arrow"
                                aria-hidden="true"
                              >
                                →
                              </span>
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>

                {remainingCount > 0 ? (
                  <div className="ps-more-wrap">
                    <button
                      type="button"
                      className="ps-more-btn"
                      onMouseEnter={() => triggerCursorHover(true)}
                      onMouseLeave={() => triggerCursorHover(false)}
                      onClick={() => {
                        if (remainingCount <= PAGE_SIZE) {
                          triggerCursorHover(false);
                        }
                        setVisibleCount((prev) => prev + PAGE_SIZE);
                      }}
                    >
                      <span>{t("Xem thêm", "Show more")}</span>
                      <span className="ps-more-badge">
                        +{Math.min(PAGE_SIZE, remainingCount)} ·{" "}
                        {t(
                          `còn ${remainingCount}`,
                          `${remainingCount} remaining`
                        )}
                      </span>
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="ps-empty-state" role="status">
                <h3 className="ps-empty-title">
                  {t(
                    "Không có dự án nào khớp điều kiện",
                    "No projects match your filter"
                  )}
                </h3>
                <p className="ps-empty-desc">
                  {t(
                    "Thử xoá bớt từ khoá tìm kiếm hoặc chuyển bộ lọc về Tất cả để xem lại toàn bộ danh sách dự án.",
                    "Try a shorter keyword or switch the category filter back to All to browse every build."
                  )}
                </p>
                <button
                  type="button"
                  className="ps-reset-btn"
                  onMouseEnter={() => triggerCursorHover(true)}
                  onMouseLeave={() => triggerCursorHover(false)}
                  onClick={() => {
                    triggerCursorHover(false);
                    handleResetFilters();
                  }}
                >
                  {t("Đặt lại bộ lọc & tìm kiếm", "Reset filter & search")}
                </button>
              </div>
            )}
          </section>
        </div>

        {detailProj ? (
          <ProjectDetailModal proj={detailProj} onClose={closeProjectModal} />
        ) : null}
      </div>
    </>
  );
}
