# Trần Trung Thành · Portfolio

**Code, chuyển động và không gian 3D trong một trang giới thiệu cá nhân.**

![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-111827?style=flat-square&logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

Website giới thiệu bản thân, kỹ năng và các dự án qua giao diện tương tác. Hình ảnh 3D, hiệu ứng chuyển động và bố cục dạng cuộn phim tạo nên trải nghiệm xuyên suốt giữa các trang.

[Trải nghiệm](#trải-nghiệm) · [Chạy dự án](#chạy-dự-án) · [Chỉnh nội dung](#chỉnh-nội-dung) · [Triển khai](#triển-khai) · [Cấu trúc](#cấu-trúc)

## Trải nghiệm

| Trang | Điểm nhấn |
| --- | --- |
| Home | Không gian neon 3D, hiệu ứng bloom và con trỏ tùy biến |
| Skills | Bàn phím 3D tương tác, chữ chạy và biểu đồ kỹ năng |
| Information | Hồ sơ cá nhân và giới thiệu |
| Project | Danh sách dự án dưới dạng carousel, xem nội dung chi tiết |
| Contact | Form liên hệ qua FormSubmit và sổ lưu bút cục bộ |
| CV | Trang CV riêng tại `/cv` |
| Admin | Công cụ tùy chỉnh nội dung của trình duyệt đang sử dụng |

## Chạy dự án

**Yêu cầu:** Node.js **22.12+** và npm, phù hợp yêu cầu Vite trong lockfile.

```powershell
git clone https://github.com/Tthanh2k6/Portfolio.git
cd Portfolio
npm ci
npm run dev
```

Mở địa chỉ được in trong terminal. Các trang 3D cần trình duyệt có WebGL.

| Lệnh | Mục đích |
| --- | --- |
| `npm run dev` | Phát triển với Vite |
| `npm run build` | Build production |
| `npm run preview` | Xem trước bản build |
| `npm run lint` | Chạy ESLint |
| `npm run format` | Định dạng mã nguồn bằng Prettier; lệnh này sửa file |

## Chỉnh nội dung

Có hai mức chỉnh sửa khác nhau:

| Cách chỉnh | Phạm vi áp dụng |
| --- | --- |
| Dùng `/admin` | Ghi vào `localStorage`, chỉ tác động trình duyệt hiện tại |
| Sửa các giá trị mặc định trong mã nguồn | Có hiệu lực với khách truy cập sau khi build và triển khai lại, trừ dữ liệu ghi đè cục bộ của họ |

Nội dung dự án và mạng xã hội dùng các giá trị `DEFAULT_*`; tìm trong `src/components/` và `src/routes/`. Tài nguyên tĩnh đặt tại [`public/IMG/`](public/IMG).

Sổ lưu bút hiện cũng lưu cục bộ, chưa phải hệ thống bình luận chia sẻ giữa nhiều khách truy cập. Trang admin chưa có lớp xác thực phía server; cơ chế này phù hợp thử giao diện và cá nhân hóa tại máy.

## Kiến trúc

**TanStack Start/Router** quản lý ứng dụng và định tuyến; **React 19 + TypeScript** xây giao diện; **Three.js** dựng 3D; **Framer Motion** phụ trách chuyển động; **Tailwind CSS 4** định kiểu.

Ứng dụng có phần server/SSR của TanStack Start. Việc nội dung tùy chỉnh lưu ở trình duyệt không có nghĩa bản build là website tĩnh thuần.

```text
public/IMG/          # Hình ảnh, logo và ảnh dự án
src/
├── components/      # Các section, điều hướng và cảnh 3D
├── routes/          # Các trang theo file-based routing
├── lib/             # Tiện ích và hỗ trợ ứng dụng
├── styles.css       # Theme và kiểu dùng chung
├── router.tsx       # Cấu hình router
└── server.ts        # Điểm vào SSR
Idea Demo/           # Các bản phác thảo HTML
vite.config.ts       # Cấu hình build và preset triển khai
```

Xem [bản đồ routes](src/routes/README.md) khi thêm hoặc chỉnh trang. `src/routeTree.gen.ts` được sinh tự động.

## Triển khai

[`vite.config.ts`](vite.config.ts) đang chọn **Nitro preset `vercel`**. Chạy `npm run build` để tạo đầu ra triển khai tương ứng trong `.vercel/output`.

Nếu chuyển sang hosting tĩnh, cần điều chỉnh cấu hình xuất bản và routing; không dùng nguyên hướng dẫn copy thư mục `dist/` của một ứng dụng Vite SPA thông thường. Nội dung ảnh/form liên hệ nên được kiểm tra lại sau khi triển khai.

---

**Trần Trung Thành** · [@Tthanh2k6](https://github.com/Tthanh2k6)
