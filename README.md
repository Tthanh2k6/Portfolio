# Portfolio — Trần Trung Thành

Trang portfolio cá nhân với hiệu ứng 3D, hoạt ảnh chuyển động và giao diện tương tác.
Chủ đề: **AI / WEB3 / UI / 3D / MOTION / VIDEO**.

> Just chill. The future is rendering...

---

## ✨ Tính năng

- **Home** — Hero 3D lưới neon isometric (Three.js + UnrealBloom), con trỏ chuột tùy chỉnh kiểu giọt nước.
- **Skills** — Bàn phím cơ 3D tương tác, hiệu ứng đánh máy (typewriter) và biểu đồ tròn kỹ năng phản ứng khi hover.
- **Information** — Giới thiệu bản thân, hiệu ứng chữ động.
- **Project** — Carousel vô hạn dạng cuộn phim, tự động chạy, click để xem chi tiết dự án.
- **Contact** — Form liên hệ (gửi mail qua FormSubmit) + sổ lưu bút (guestbook) cho phép bình luận & đính kèm ảnh.
- **Admin** — Trang quản trị nội dung phía client (chỉnh sửa text, màu, dự án, link mạng xã hội...). Xem [Lưu ý về Admin](#-lưu-ý-về-trang-admin).

---

## 🛠️ Công nghệ

| Nhóm | Thư viện |
|------|----------|
| Framework | [TanStack Start](https://tanstack.com/start) + [TanStack Router](https://tanstack.com/router) + [TanStack Query](https://tanstack.com/query) |
| UI | React 19, TypeScript |
| 3D | [Three.js](https://threejs.org) (WebGL, postprocessing, line2) |
| Animation | [Framer Motion](https://www.framer.com/motion/) |
| Styling | [TailwindCSS v4](https://tailwindcss.com) + tw-animate-css |
| Build | [Vite](https://vitejs.dev) |

---

## 🚀 Bắt đầu

Yêu cầu: **Node.js ≥ 18** và npm.

```bash
# Cài đặt phụ thuộc
npm install

# Chạy môi trường phát triển (mặc định http://localhost:3000)
npm run dev

# Build production
npm run build

# Xem thử bản build
npm run preview
```

Các lệnh khác:

```bash
npm run lint     # Kiểm tra lỗi với ESLint
npm run format   # Định dạng code với Prettier
```

---

## 📁 Cấu trúc thư mục

```
.
├── IMG/                    # Ảnh tĩnh (logo kỹ năng, ảnh dự án, ảnh nền)
├── Idea Demo/              # Bản phác thảo HTML gốc (tham khảo thiết kế)
├── src/
│   ├── components/         # Component dùng chung (HeroScene, NavBar, các Section)
│   ├── routes/             # Các trang (file-based routing của TanStack Router)
│   │   ├── __root.tsx      # Layout gốc + con trỏ tùy chỉnh
│   │   ├── index.tsx       # Home
│   │   ├── skills.tsx
│   │   ├── information.tsx
│   │   ├── project.tsx
│   │   ├── contact.tsx
│   │   └── admin.tsx       # Trang quản trị (CMS phía client)
│   ├── lib/                # Tiện ích (xử lý/báo lỗi)
│   ├── styles.css          # Theme & design system (Tailwind)
│   ├── router.tsx          # Cấu hình router
│   └── server.ts           # Entry SSR + bọc trang lỗi
├── vite.config.ts
└── package.json
```

---

## 🗂️ Quản lý nội dung (CMS phía client)

Trang web **không dùng backend**. Toàn bộ nội dung động (text, màu sắc 3D, danh sách
dự án, link mạng xã hội, bình luận guestbook...) được lưu trong **`localStorage`** của
trình duyệt theo các key như `home_line_*`, `project_list`, `contact_socials`, `info_*`...

Cơ chế: trang `/admin` ghi dữ liệu vào `localStorage`; các trang công khai đọc lại đúng
key đó để hiển thị. Nếu key chưa tồn tại, trang dùng **giá trị mặc định** được khai báo
cứng trong code (các hằng `DEFAULT_*`).

> ⚠️ **Quan trọng:** Vì dữ liệu nằm trong `localStorage` của từng trình duyệt, chỉnh sửa
> qua `/admin` **chỉ áp dụng cho trình duyệt đang mở**, KHÔNG đồng bộ lên server và KHÔNG
> thay đổi nội dung mà khách truy cập khác nhìn thấy.
>
> Để cập nhật nội dung mặc định cho **mọi người**, hãy sửa trực tiếp các hằng `DEFAULT_*`
> trong code (ví dụ `DEFAULT_SOCIALS`, `DEFAULT_PROJECTS`...) rồi build & deploy lại.

---

## 🔒 Lưu ý về trang Admin

Trang `/admin` là công cụ chỉnh sửa nội dung **chạy hoàn toàn ở client**, không có xác
thực phía server. Trên bản deploy tĩnh (GitHub Pages...), nó chỉ ảnh hưởng tới
`localStorage` của người đang mở nên **không thể dùng để phá nội dung của người khác**.

Tuy vậy, để tránh trang quản trị bị lộ công khai, dự án giới hạn truy cập `/admin`
(xem cấu hình trong [`src/routes/admin.tsx`](src/routes/admin.tsx)).

---

## 🌐 Triển khai

Dự án hiện được cấu hình deploy lên **Vercel**: `vite.config.ts` đặt `nitro: { preset: "vercel" }`,
khi `npm run build` sẽ xuất ra định dạng `.vercel/output` (Build Output API) để Vercel chạy SSR.

> Lưu ý: TanStack Start mặc định build cho môi trường có server (SSR). Muốn host tĩnh thuần
> (GitHub Pages, Netlify static...) thì cần đổi sang preset xuất SPA/tĩnh và cấu hình base path
> phù hợp với tên repository.

---

## 📄 Giấy phép

Dự án cá nhân — © Trần Trung Thành.
