// @lovable.dev/vite-tanstack-config đã bao gồm sẵn những thứ sau — KHÔNG thêm thủ công
// nếu không app sẽ hỏng do trùng plugin:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (chỉ dùng khi build, mặc định target là cloudflare),
//     componentTagger (chỉ dùng khi dev), inject biến môi trường VITE_*, path alias @, dedupe React/TanStack,
//     các plugin ghi log lỗi, và phát hiện sandbox (port/host/strictPort).
// Bạn có thể truyền thêm config qua defineConfig({ vite: { ... }, v.v... }) nếu cần.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Chuyển hướng server entry đóng gói của TanStack Start sang src/server.ts (lớp bọc xử lý lỗi SSR của chúng ta).
    // nitro/vite build dựa trên cái này
    server: { entry: "server" },
  },
});
