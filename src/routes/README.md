# Bản đồ routes

[← Portfolio](../../README.md)

Dự án dùng **file-based routing của TanStack Router/Start**. Khai báo route nằm trong các file `.tsx` tại thư mục này; layout gốc là `__root.tsx`.

## Các trang hiện có

| File | URL | Vai trò |
| --- | --- | --- |
| [`__root.tsx`](__root.tsx) | Layout chung | App shell và phần hiển thị route con |
| [`index.tsx`](index.tsx) | `/` | Trang chủ |
| [`skills.tsx`](skills.tsx) | `/skills` | Kỹ năng |
| [`information.tsx`](information.tsx) | `/information` | Hồ sơ cá nhân |
| [`project.tsx`](project.tsx) | `/project` | Dự án |
| [`contact.tsx`](contact.tsx) | `/contact` | Liên hệ |
| [`cv.tsx`](cv.tsx) | `/cv` | CV |
| [`admin.tsx`](admin.tsx) | `/admin` | Tùy chỉnh nội dung cục bộ |

## Khi sửa hoặc thêm trang

- Giữ cơ chế hiển thị route con trong layout gốc.
- Dùng cấu trúc TanStack hiện có; không thêm `src/pages/` hoặc `app/layout.tsx` theo quy ước framework khác.
- Để plugin sinh lại [`routeTree.gen.ts`](../routeTree.gen.ts); không chỉnh thủ công file này.
- Đọc/ghi `localStorage` ở phía client, tránh truy cập trực tiếp khi SSR.
- Nội dung sửa qua admin chỉ nằm trong trình duyệt đó. Để cập nhật mặc định cho mọi người, sửa dữ liệu nguồn rồi build và triển khai lại.

Các component dùng chung nằm trong [`../components/`](../components), cấu hình router nằm tại [`../router.tsx`](../router.tsx).
