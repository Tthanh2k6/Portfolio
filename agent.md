# Hướng dẫn Thực chiến Đọc-Hiểu & Bảo trì Dự án Portfolio (`agent.md`)

> **Tài liệu điều phối trung tâm dành cho AI Coding Agent và Tác giả dự án (`Trần Trung Thành`).**
> Đọc tệp này ĐẦU TIÊN trong mọi phiên làm việc mới trước khi chạm vào bất kỳ tệp mã nguồn nào trong `d:\Project\Portfolio`.

---

## 1. Mục đích & Nguyên tắc Hoạt động

Dự án **Portfolio Cá nhân Tương tác 3D** (`TanStack Start` + `React 19` + `Three.js` + `Tailwind CSS v4` + `Nitro Vercel`) kết hợp nhiều kỹ thuật đồ họa thời gian thực, vật lý mô phỏng, kết xuất SSR đa ngôn ngữ và hệ thống quản trị nội dung phía trình duyệt (`69` khóa Web Storage). Nhiều thành phần liên kết ngầm với nhau qua hằng số phiên bản cache (`CONTENT_VERSION`), nguồn dữ liệu mặc định dùng chung (`DEFAULT_*`), và hệ thống sự kiện `window.dispatchEvent`.

Hệ thống tài liệu của dự án được tổ chức thành 4 tệp bổ trợ lẫn nhau (tuyệt đối **không xóa hay ghi đè** tài liệu gốc của dự án):

1. **`agent.md` *(Tệp này — Điểm xuất phát bắt buộc)*:** Cung cấp quy trình làm việc chuẩn, Bảng Định tuyến Nhanh tới từng phân hệ, các rào chắn kỹ thuật chống lỗi (`Guardrails`), quy trình đồng bộ tài liệu bắt buộc sau khi sửa code và danh sách kiểm tra nghiệm thu.
2. **`CODEBASE.md` *(Bách khoa toàn thư kỹ thuật 9 chương)*:** Chứa kiến trúc tổng thể, sơ đồ luồng dữ liệu, bản đồ 100% tệp nguồn & tài nguyên ảnh, giải phẫu chi tiết từng hàm/thuật toán/vật lý, bảng tra cứu toàn bộ 69 khóa `localStorage`/`sessionStorage`, API ngoài, Design System và kiểm toán bảo mật.
3. **`README.md` *(Tài liệu giới thiệu gốc)*:** Tóm tắt tính năng sản phẩm, hướng dẫn chạy nhanh và triển khai Vercel cho người xem GitHub.
4. **`src/routes/README.md` *(Quy ước thư mục định tuyến)*:** Bản đồ ánh xạ nhanh các tệp trong `src/routes/` và quy tắc của TanStack File-Based Routing.

**Nguyên tắc Vàng cho mọi phiên chat mới:**
- **Không đoán mò, không đọc lướt, không grep mù quáng:** Dùng **Bảng Định tuyến Nhanh** ở Mục 2 để nhảy thẳng tới đúng chương trong `CODEBASE.md`, nắm rõ cơ chế hiện hữu rồi mới mở đúng tệp mã nguồn cần sửa.
- **Sửa code tới đâu — Đồng bộ tài liệu tới đó:** `CODEBASE.md` và `agent.md` phải luôn phản ánh trung thực 100% trạng thái thực tế của mã nguồn ở cuối mỗi phiên làm việc.

---

## 2. Quy trình BẮT BUỘC Trước Khi Sửa Code (Read-First Protocol)

Trước khi thực hiện bất kỳ thay đổi mã nguồn nào, AI Agent hoặc lập trình viên **PHẢI** đi theo đúng 4 bước sau:

1. **Bước 1 — Xác định phân hệ bị ảnh hưởng:** Tra cứu yêu cầu của người dùng trong **Bảng Định tuyến Nhanh (Mục 2.1)** bên dưới để biết chính xác mục cần đọc trong `CODEBASE.md` và danh sách tệp nguồn liên quan (bao gồm cả các tệp phụ thuộc ngầm như `__root.tsx` hoặc `admin.tsx`).
2. **Bước 2 — Đọc mục tương ứng trong `CODEBASE.md`:** Nắm rõ chữ ký hàm, cấu trúc state, khóa `localStorage` đang dùng và luồng dữ liệu hai chiều giữa trang hiển thị và trang `/admin`.
3. **Bước 3 — Kiểm tra Rào chắn Kỹ thuật (Mục 3 của `agent.md`):** Đối chiếu thay đổi dự kiến với 12 quy tắc an toàn sống còn (đặc biệt lưu ý `CONTENT_VERSION`, SSR hydration, CSS `preserve-3d` và dọn dẹp bộ nhớ WebGL).
4. **Bước 4 — Đọc trực tiếp tệp mã nguồn mục tiêu:** Mở tệp thực tế cần sửa để kiểm tra chính xác số dòng và ngữ cảnh xung quanh trước khi gọi công cụ chỉnh sửa.

### 2.1. Bảng Định tuyến Nhanh (Quick Routing Table)

| Khi cần làm việc với mảng chức năng... | Đọc mục nào trong `CODEBASE.md`? | Mở những tệp mã nguồn nào? |
| :--- | :--- | :--- |
| **1. Thêm / sửa / xóa Dự án, đổi mô tả 2 tầng (`desc`/`detail`), ảnh dự án hoặc đồng bộ GitHub API** | • **Mục 2.4** (Luồng 1)<br>• **Mục 4.8** (`ProjectSection.tsx`)<br>• **Mục 5.2.C & 5.3** (`ProjectItem`)<br>• **Mục 8.1** (Bất biến #1, #3, #6) | • `src/components/ProjectSection.tsx`<br>• `src/routes/__root.tsx` *(tăng `CONTENT_VERSION`!)*<br>• `src/routes/admin.tsx` *(nếu thêm trường mới)*<br>• `public/IMG/` *(nếu thêm ảnh dự án)* |
| **2. Chỉnh hiệu ứng trượt, tự chạy (`Autoplay`) hoặc lỗi kẹt băng chuyền trên trang `/project`** | • **Mục 4.8** (Thuật toán `Infinite Film-Strip Carousel` & `ProjectDetailModal`)<br>• **Mục 8.1** (Bất biến #6) | • `src/components/ProjectSection.tsx`<br>• `src/routes/project.tsx` |
| **3. Thêm / sửa Phím Kỹ năng 3D, đổi lưới bàn phím, chữ nổi 3D `ExtrudedText` hoặc biểu đồ `DonutChart`** | • **Mục 4.7** (`SkillsSection.tsx`)<br>• **Mục 5.2.C & 5.3** (`KeycapItem`, `ChartSlice`)<br>• **Mục 8.1** (Bất biến #1, #3, #4, #5) | • `src/components/SkillsSection.tsx`<br>• `src/styles.css` *(keyframes & `.skills-*`)*<br>• `src/routes/__root.tsx` *(tăng `CONTENT_VERSION`!)*<br>• `src/routes/admin.tsx` *(Tab Skills)* |
| **4. Cảnh nền 3D Lưới Neon Isometric, ánh sáng `UnrealBloomPass`, raycasting chuột trên Trang chủ `/`** | • **Mục 4.5** (`index.tsx` & `HeroScene.tsx`)<br>• **Mục 5.2.B** (44 khóa `home_*` & `scene_*`)<br>• **Mục 8.1** (Bất biến #10) | • `src/components/HeroScene.tsx`<br>• `src/routes/index.tsx`<br>• `src/routes/admin.tsx` *(Tab Home & 3D Scene)* |
| **5. Trang Hồ sơ `/information`, hiệu ứng gõ chữ terminal hoặc vật lý dây đeo thẻ `Verlet` 25 nút** | • **Mục 4.6** (`information.tsx`)<br>• **Mục 5.2.C** (10 khóa `info_*`) | • `src/routes/information.tsx`<br>• `src/routes/admin.tsx` *(Tab Information)* |
| **6. Form gửi Email (`FormSubmit`), thẻ mạng xã hội Bento hoặc Sổ lưu bút `Guestbook` trên `/contact`** | • **Mục 2.4** (Luồng 4)<br>• **Mục 4.9** (`ContactSection.tsx`)<br>• **Mục 5.3 & 5.4** (`SocialItem`, `Comment`, FormSubmit API) | • `src/components/ContactSection.tsx`<br>• `src/routes/contact.tsx`<br>• `src/routes/admin.tsx` *(Tab Contact & Comments)* |
| **7. Nội dung Hồ sơ CV hoặc căn chỉnh bố cục In ấn / Xuất PDF khổ A4 trên `/cv`** | • **Mục 2.4** (Luồng 5)<br>• **Mục 4.10** (`cv.tsx`)<br>• **Mục 6.5** (`@media print`) | • `src/routes/cv.tsx` |
| **8. Đa ngôn ngữ Việt – Anh (`VI` / `EN`), thêm bản dịch mới hoặc nút chuyển ngôn ngữ** | • **Mục 2.4** (Luồng 3)<br>• **Mục 4.3** (`src/lib/i18n.tsx`)<br>• **Mục 8.1** (Bất biến #2) | • `src/lib/i18n.tsx`<br>• `src/components/NavBar.tsx`<br>• Component / Route chứa văn bản cần dịch |
| **9. Thanh điều hướng `NavBar` (bong bóng kính mờ trượt theo chuột) hoặc Con trỏ vật lý `CustomCursor`** | • **Mục 4.4** (`__root.tsx`, `NavBar.tsx`)<br>• **Mục 5.4** (Custom DOM Events `cursorHover*`, `navHover*`) | • `src/components/NavBar.tsx`<br>• `src/routes/__root.tsx` *(component `CustomCursor`)*<br>• `src/styles.css` *(dòng `cursor: none !important`)* |
| **10. Trang Quản trị `/admin`, đổi mật khẩu đăng nhập `SHA-256` hoặc thêm trường cấu hình `localStorage`** | • **Mục 2.4** (Luồng 2)<br>• **Mục 4.11** (`admin.tsx`)<br>• **Mục 5.1 & 5.2** (Bảng 69 khóa Web Storage)<br>• **Mục 7.3 & 8.2** (Lệnh tạo hash SHA-256 & bảo mật) | • `src/routes/admin.tsx`<br>• Trang đích đọc khóa `localStorage` tương ứng |
| **11. Thêm Route (trang) mới, sửa thẻ `<head>` / Google Fonts, màn hình `404` hoặc `ErrorBoundary`** | • **Mục 3.2** & **Mục 4.2, 4.4**<br>• **Mục 8.1** (Bất biến #7) | • `src/routes/README.md`<br>• `src/routes/__root.tsx`<br>• `src/routes/<ten-trang>.tsx` |
| **12. Xử lý lỗi SSR 500, Middleware máy chủ, cấu hình Vite, Tailwind v4 hoặc Deploy Vercel** | • **Mục 2.2** (Tầng SSR)<br>• **Mục 4.1 & 4.2** (`vite.config.ts`, `server.ts`, `start.ts`, `error-*.ts`)<br>• **Mục 7.4** & **Mục 8.1** (Bất biến #8, #9) | • `vite.config.ts`<br>• `src/server.ts`, `src/start.ts`<br>• `src/lib/error-capture.ts`, `src/lib/error-page.ts`<br>• `src/styles.css`, `eslint.config.js` |

---

## 3. Các Bất biến Kỹ thuật & Quy tắc An toàn Riêng của Dự án (Project-Specific Guardrails)

Khi chỉnh sửa mã nguồn của dự án này, bạn **BẮT BUỘC** tuân thủ nghiêm ngặt 12 quy tắc sống còn dưới đây:

1. **LUÔN TĂNG `CONTENT_VERSION` khi sửa dữ liệu gốc của Dự án hoặc Kỹ năng:**
   - Trong `src/routes/__root.tsx` (dòng `16`), hằng số `CONTENT_VERSION` kiểm soát hook `useResetStaleContent()`.
   - Mỗi khi sửa mảng `projects` (`src/components/ProjectSection.tsx`) hoặc `KEYCAPS` / `CHART_DATA` / `TITLE_TO_CHART` (`src/components/SkillsSection.tsx`), **phải đổi `CONTENT_VERSION` sang chuỗi ngày-phiên bản mới** (ví dụ `"2026-10-27-1"`). Nếu quên, trình duyệt đã có `localStorage` sẽ giữ mãi dữ liệu cũ và không bao giờ thấy thay đổi của bạn.
2. **Bảo vệ tuyệt đối tính nhất quán SSR Hydration (Không đọc `window`/`localStorage` khi render lần đầu):**
   - Mọi trang đều chạy SSR trên Node.js trước khi hydrate trên trình duyệt. Tuyệt đối **không** gọi `localStorage`, `sessionStorage`, `window`, `document` trực tiếp ngoài `useEffect` hoặc event handler.
   - Trong `src/lib/i18n.tsx`, `lang` **phải luôn khởi tạo mặc định là `"en"`** để khớp giữa HTML máy chủ và lần render đầu tiên phía client; việc đọc `localStorage["site_lang"]` chỉ được diễn ra bên trong `useEffect`.
3. **Không làm phẳng (`flatten`) không gian 3D `preserve-3d` trên trang `/skills`:**
   - Trên các lớp bao ngoài bàn phím 3D và khối chữ nổi `ExtrudedText` (`.skills-stage`, `.skills-keyboard`, `.skills-info-3d`, `.skills-3d-slide-in`, `.skills-3d-slide-out`), **CHỈ được animate thuộc tính `transform`**.
   - **CẤM** thêm `opacity < 1`, `filter`, `backdrop-filter`, `overflow: hidden` hoặc `clip-path` lên các container mang `transform-style: preserve-3d`, vì trình duyệt sẽ lập tức ép phẳng toàn bộ các lát `translateZ` thành 2D bẹt.
4. **Duy trì Nguồn Dữ liệu Đơn (`Single Source of Truth`) & Sao chép Nông cho `/admin`:**
   - Không bao giờ copy-paste nhân bản mảng dự án hay kỹ năng sang `src/routes/admin.tsx`. Phải tiếp tục import trực tiếp `projects as DEFAULT_PROJECTS` và `KEYCAPS`, `CHART_DATA`, `TITLE_TO_CHART` từ component gốc, đồng thời clone nông (`.map(item => ({ ...item }))`) trước khi nạp vào state của `/admin`.
5. **Giữ nguyên cơ chế chống kẹt khóa `isAnimating` của băng chuyền `/project`:**
   - Trong `goToProject` (`ProjectSection.tsx`), không bao giờ xóa dòng kiểm tra sớm `if (closestTarget === currentIdx) return;` và bộ đếm bảo hiểm `unlockTimerRef` (`1.200ms`). Nếu thiếu chúng, click vào thẻ đang mở sẽ không sinh ra `transitionend` và làm khóa chết toàn bộ băng chuyền.
6. **Giải phóng triệt để tài nguyên GPU WebGL & vòng lặp vật lý khi rời trang:**
   - Trong `HeroScene.tsx`, mọi đối tượng `Geometry`, `Material`, `EffectComposer`, `WebGLRenderer` tạo mới phải được `.dispose()` trong hàm cleanup của `useEffect`, kèm theo `cancelAnimationFrame` và gỡ toàn bộ `window.removeEventListener` (tương tự cho vòng lặp Verlet ở `information.tsx` và lò xo con trỏ ở `__root.tsx`).
7. **Không sửa tay `src/routeTree.gen.ts` và không làm mất `<Outlet />`:**
   - Tệp `src/routeTree.gen.ts` được sinh tự động bởi `@tanstack/router-plugin`. Trong `src/routes/__root.tsx`, phải luôn giữ `<Outlet />`, `<HeadContent />` và `<Scripts />`.
8. **Không khai báo trùng Plugin Vite trong `vite.config.ts`:**
   - Gói `@lovable.dev/vite-tanstack-config` đã tích hợp sẵn Tailwind v4, tsconfig paths, TanStack Start và React plugin. Không import chồng lặp các plugin này vào `vite.config.ts`.
9. **Không import gói `server-only` của Next.js:**
   - Quy tắc ESLint `no-restricted-imports` cấm hoàn toàn `import "server-only"`. Dùng `createServerFn` của `@tanstack/react-start` nếu cần logic chỉ chạy phía máy chủ.
10. **Đảm bảo đầy đủ Song ngữ Việt – Anh (`VI` / `EN`) cho mọi nội dung mới:**
    - Mọi chuỗi giao diện mới phải bọc qua `t("Tiếng Việt", "English")` từ `useLang()`.
    - Mọi dự án mới trong `ProjectSection.tsx` nên khai báo đầy đủ cặp trường tiếng Việt và hậu tố `*En` (`shortNameEn`, `titleEn`, `descEn`, `detailEn`, `roleEn`, `clientEn`, `demoLabelEn`); phím kỹ năng mới có `desc` và `descEn`; mục mới trong `cv.tsx` phải cập nhật đồng thời cả `T.vi` lẫn `T.en`.
11. **Bảo toàn khả năng In ấn A4 trên `/cv` và Con trỏ Tùy biến toàn trang:**
    - Mọi nút công cụ hoặc thành phần điều hướng thêm vào `/cv` mà không thuộc nội dung tờ giấy CV phải gắn class `cv-noprint` để tự động ẩn khi gọi `window.print()`.
    - Các nút/thẻ tương tác mới nên phát sự kiện `window.dispatchEvent(new CustomEvent("cursorHoverEnter"))` khi `onMouseEnter` và `"cursorHoverLeave"` khi `onMouseLeave` để đồng bộ hiệu ứng phóng to `1.35x` của `CustomCursor`.
12. **Không sửa thư mục lưu trữ `Idea Demo/` và luôn giữ chuẩn mã hóa UTF-8 trên Windows:**
    - Thư mục `Idea Demo/*.html` là tư liệu nguyên mẫu lịch sử chỉ dùng để đối chiếu thiết kế, không chỉnh sửa trừ khi người dùng yêu cầu đích danh.
    - Mọi tệp nguồn chứa tiếng Việt có dấu phải lưu ở định dạng `UTF-8` (không BOM, xuống dòng `LF` theo `.gitattributes`). Khi chạy script Python hỗ trợ trên Windows PowerShell, luôn dùng `python -X utf8`.

---

## 4. Quy trình BẮT BUỘC Cập nhật Tài liệu Sau Mỗi Lần Sửa Code (Post-Edit Sync Protocol)

> [!IMPORTANT]
> **QUY TẮC BẮT BUỘC:** Mọi thay đổi đối với mã nguồn, cấu hình, dữ liệu mặc định, khóa lưu trữ hay tài nguyên trong dự án đều **PHẢI đi kèm việc cập nhật `CODEBASE.md` (và `agent.md` nếu thay đổi kiến trúc, đường dẫn định tuyến hoặc quy tắc an toàn) ngay trong cùng một phiên làm việc**, trước khi báo cáo hoàn thành cho người dùng. Tuyệt đối không để tài liệu bị lệch hậu kỳ so với code thực tế!

### 4.1. Ma trận Đồng bộ Tài liệu (Documentation Sync Matrix)

Tra cứu bảng dưới đây ngay sau khi sửa code để biết **chính xác những mục nào bắt buộc phải cập nhật**:

| Loại thay đổi vừa thực hiện trong Codebase | Các mục PHẢI cập nhật trong `CODEBASE.md` | Các mục PHẢI cập nhật trong `agent.md` |
| :--- | :--- | :--- |
| **1. Thêm / xóa / đổi tên tệp nguồn, component, route hoặc ảnh trong `public/IMG/`** | • **Mục 3.1** (Cây thư mục)<br>• **Mục 3.2** (Bảng kê khai tệp nguồn, số dòng, exports)<br>• **Mục 3.3** (Bảng tài nguyên ảnh nếu đổi `public/IMG/`)<br>• **Mục 4.x** (Thêm/xóa phân tích chi tiết tệp đó)<br>• **Mục 9** (Ghi Changelog) | • **Mục 2.1** (Cập nhật cột tệp nguồn trong Bảng Định tuyến Nhanh nếu liên quan) |
| **2. Thêm / sửa / xóa Dự án (`projects`), Phím kỹ năng (`KEYCAPS`), Biểu đồ (`CHART_DATA`) hoặc tăng `CONTENT_VERSION`** | • **Mục 1.2 / 2.4** (Nếu tổng số lượng dự án/phím thay đổi)<br>• **Mục 4.7 / 4.8** (Danh sách dự án/kỹ năng mặc định)<br>• **Mục 5.2.A & 5.2.C** (Giá trị `CONTENT_VERSION` mới & số phần tử mặc định)<br>• **Mục 7.2** (Bảng hằng số cấu hình)<br>• **Mục 8.3** (Xóa/cập nhật ghi chú thiếu ảnh nếu đã bổ sung ảnh)<br>• **Mục 9** (Ghi Changelog) | *(Không cần sửa trừ khi đổi cơ chế lưu trữ hoặc quy tắc `CONTENT_VERSION`)* |
| **3. Sửa đổi hàm, thuật toán vật lý/3D/carousel, thêm state hoặc đổi luồng xử lý** | • **Mục 2.1 – 2.4** (Nếu luồng dữ liệu hoặc sequence thay đổi)<br>• **Mục 4.x** (Cập nhật chữ ký hàm, công thức, hằng số vật lý tại module tương ứng)<br>• **Mục 9** (Ghi Changelog) | • **Mục 3** (Nếu phát sinh bất biến kỹ thuật mới cần bảo vệ) |
| **4. Thêm / đổi tên / xóa khóa `localStorage`, `sessionStorage`, sửa interface dữ liệu JSON hoặc đổi API ngoài** | • **Mục 2.1** (Tổng số keys trên sơ đồ kiến trúc)<br>• **Mục 5.1 / 5.2** (Bảng kê khai khóa Web Storage, kiểu, mặc định, file đọc/ghi)<br>• **Mục 5.3** (Interface TypeScript của dữ liệu JSON)<br>• **Mục 5.4** (Bảng API & Custom Events)<br>• **Mục 9** (Ghi Changelog) | • **Mục 2.1** (Nếu tạo mảng chức năng lưu trữ mới)<br>• **Mục 3** (Nếu khóa mới chịu sự chi phối của `CONTENT_VERSION`) |
| **5. Thay đổi giao diện, thêm màn hình / Modal mới, sửa bảng màu, font chữ hoặc responsive / `@media print`** | • **Mục 6.1 & 6.2** (Bảng danh mục màn hình/modal & sơ đồ `stateDiagram-v2`)<br>• **Mục 6.3 – 6.6** (Bảng màu `oklch`/Hex, Typography, Breakpoints, Print, Loading/Fallback)<br>• **Mục 9** (Ghi Changelog) | • **Mục 2.1** (Thêm dòng định tuyến cho màn hình/modal mới) |
| **6. Nâng cấp/thêm/xóa thư viện trong `package.json`, đổi lệnh npm script, cấu hình Vite/Nitro hoặc cổng chạy** | • **Mục 1.3** (Bảng Tech Stack & phiên bản)<br>• **Mục 4.1** (Phân tích file cấu hình)<br>• **Mục 7.1 – 7.4** (Yêu cầu công cụ, hằng số, câu lệnh CLI, cơ chế đóng gói)<br>• **Mục 9** (Ghi Changelog) | • **Mục 5.1** (Cập nhật lệnh kiểm tra & xác minh nhanh nếu script thay đổi) |
| **7. Đổi cơ chế mật khẩu `/admin`, giải quyết nợ kỹ thuật hoặc phát hiện edge case / giới hạn mới** | • **Mục 8.1** (Bất biến kỹ thuật)<br>• **Mục 8.2** (Kiểm toán bảo mật)<br>• **Mục 8.3** (Giới hạn hiện tại & nợ kỹ thuật — gỡ mục đã sửa xong hoặc thêm mục mới)<br>• **Mục 9** (Ghi Changelog) | • **Mục 3** (Cập nhật danh sách Guardrails cho khớp thực tế) |

### 4.2. Quy chuẩn Viết Bổ sung Khi Cập nhật Tài liệu

- **Giữ nguyên chiều sâu kỹ thuật:** Viết bằng tiếng Việt mạch lạc, chính xác; luôn bọc tên biến, tên hàm, component, đường dẫn tệp, câu lệnh CLI, endpoint và khóa lưu trữ trong dấu backtick `` `...` ``.
- **Không xóa nhầm thông tin còn hiệu lực:** Chỉ dùng `edit_file` sửa đúng đoạn bị thay đổi, không tóm tắt rút gọn làm mất chi tiết của các module khác.
- **An toàn cú pháp Markdown & Mermaid:**
  - Nếu trong văn bản có ký hiệu tiền tệ đô-la nằm ngoài backtick, luôn escape thành `\$` để không kích hoạt nhầm công thức toán LaTeX.
  - Trong sơ đồ `mermaid`, mọi nhãn node chứa dấu ngoặc đơn `()`, ngoặc vuông `[]`, dấu hai chấm `:` hoặc ký tự đặc biệt **phải bọc trong dấu ngoặc kép** (ví dụ: `NodeA["HeroScene (Three.js)"]`), và tuyệt đối không dùng thẻ HTML như `<br/>` bên trong nhãn Mermaid.
- **Luôn ghi nhật ký:** Cuối mỗi đợt cập nhật, thêm một dòng mới vào bảng tại **Mục 9 (`Nhật ký Cập nhật Tài liệu — Documentation Changelog`)** của `CODEBASE.md` ghi rõ ngày `YYYY-MM-DD`, các tệp/mục vừa thay đổi và tóm tắt kỹ thuật.

---

## 5. Lệnh Kiểm tra & Xác minh Nhanh (Verification Commands) & Checklist Hoàn tất

### 5.1. Tổ hợp Lệnh Xác minh Nhanh Trước Khi Kết thúc Phiên Làm việc

Chạy tuần tự các lệnh sau tại thư mục `d:\Project\Portfolio` để đảm bảo mã nguồn sạch lỗi biên dịch, đúng chuẩn lint và đóng gói SSR thành công:

```powershell
# 1. Kiểm tra kiểu tĩnh TypeScript trên toàn dự án (nhanh, không sinh tệp rác)
npx tsc --noEmit

# 2. Kiểm tra quy tắc ESLint (React Hooks, TypeScript, cấm import server-only)
npm run lint

# 3. Kiểm thử đóng gói Production toàn trình (Client + Nitro Serverless Vercel)
npm run build

# 4. Kiểm tra trạng thái Git để chắc chắn không sửa nhầm tệp ngoài phạm vi
git status --short
```

### 5.2. Checklist Nghiệm thu Bắt buộc Trước Khi Trả lời Người dùng

Trước khi gửi câu trả lời hoàn tất công việc, hãy tự đối chiếu đủ **8 mục** sau:

- [ ] **1. Đúng yêu cầu & Không phá hỏng tính năng lân cận:** Đã kiểm tra ảnh hưởng chéo giữa trang công khai và trang `/admin` (cùng đọc/ghi một khóa `localStorage`).
- [ ] **2. Đã tăng `CONTENT_VERSION` (nếu có sửa `projects` hoặc `KEYCAPS`/`CHART_DATA`/`TITLE_TO_CHART`):** Hằng số tại `src/routes/__root.tsx:16` đã được cập nhật sang mã mới.
- [ ] **3. An toàn SSR & Đa ngôn ngữ:** Không có lệnh truy cập `window`/`localStorage` trần lúc SSR; mọi nội dung hiển thị mới đã hỗ trợ cả tiếng Việt (`vi`) và tiếng Anh (`en`).
- [ ] **4. An toàn Đồ họa 3D & Bố cục In ấn:** Không thêm `opacity`/`filter` làm gãy `preserve-3d` ở `/skills`; không rò rỉ bộ nhớ GPU ở `HeroScene`; không làm vỡ bản in PDF A4 ở `/cv`.
- [ ] **5. Vượt qua kiểm tra tự động:** Đã chạy `npx tsc --noEmit` và `npm run lint` (cùng `npm run build` nếu sửa cấu hình/route/SSR) với mã thoát `0`.
- [ ] **6. Bảo toàn tệp gốc ngoài phạm vi:** Không ghi đè trái phép `README.md`, `src/routes/README.md`, `src/routeTree.gen.ts` hay `Idea Demo/*.html`.
- [ ] **7. Đã đồng bộ `CODEBASE.md` (& `agent.md` nếu cần):** Toàn bộ các mục tương ứng trong Ma trận Đồng bộ Tài liệu (Mục 4.1) và bảng Changelog (Mục 9 của `CODEBASE.md`) đã được cập nhật đầy đủ.
- [ ] **8. Trình bày báo cáo rõ ràng:** Đính kèm liên kết tệp chính xác, tóm tắt ngắn gọn thay đổi mã nguồn + thay đổi tài liệu và kết quả xác minh.
