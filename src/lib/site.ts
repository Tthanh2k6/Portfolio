// Địa chỉ public duy nhất của site — dùng cho canonical, og:url, JSON-LD, og:image.
export const SITE_URL = "https://trungthanhtran.vercel.app";

// Canonical + og:url cho từng route công khai. Mỗi route tự khai trong head() của nó.
// KHÔNG đặt canonical ở __root: TanStack gộp `links` của mọi route khớp mà chỉ bỏ thẻ
// trùng y hệt, nên canonical ở root + ở route con sẽ ra 2 thẻ canonical khác nhau.
// (meta thì khác: trùng name/property thì route sâu nhất thắng, nên og:url ghi đè được.)
export function pageSeo(path: `/${string}`) {
  const url = `${SITE_URL}${path}`;
  return {
    canonical: { rel: "canonical", href: url },
    ogUrl: { property: "og:url", content: url },
  };
}
