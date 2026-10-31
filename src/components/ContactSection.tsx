import { useState, useRef, useEffect } from "react";
import { NavBar } from "./NavBar";
import { useLang } from "@/lib/i18n";

interface Toast {
  id: number;
  message: string;
  tone?: "ok" | "warn";
}

interface EngagementTier {
  id: string;
  code: string;
  titleEn: string;
  titleVi: string;
  badgeEn: string;
  badgeVi: string;
  descEn: string;
  descVi: string;
  deliverablesEn: string[];
  deliverablesVi: string[];
  prefillEn: string;
  prefillVi: string;
}

const DIRECT_EMAIL = "ttrungthanh90@gmail.com";

// Danh sách kênh chuyên môn mặc định cho khách hàng quốc tế & nhà tuyển dụng
// (Giữ nguyên export DEFAULT_SOCIALS để tương thích 100% với src/routes/admin.tsx)
export const DEFAULT_SOCIALS = [
  {
    type: "GitHub",
    url: "https://github.com/Tthanh2k6",
    handle: "@Tthanh2k6 · Public Repos",
    visible: true,
    large: true,
  },
  {
    type: "Apify Store",
    url: "https://apify.com/thanh81646",
    handle: "5 Public Actors (early, few runs)",
    visible: true,
    large: false,
  },
  {
    type: "Upwork",
    url: "https://www.upwork.com/freelancers/trungthanhtrandev",
    handle: "1 Completed Job (5★) · UTC+7",
    visible: true,
    large: false,
  },
  {
    type: "Dev.to",
    url: "https://dev.to/tthanh2k6",
    handle: "Technical Articles",
    visible: true,
    large: false,
  },
  {
    type: "RapidAPI",
    url: "https://rapidapi.com/Tthanh2k6/api/b2b-website-email-phone-and-tech-stack-enricher",
    handle: "2 Freemium API Listings",
    visible: true,
    large: false,
  },
];

const ENGAGEMENT_TIERS: EngagementTier[] = [
  {
    id: "rescue",
    code: "01",
    titleEn: "Fix a Broken Website / API / Webhook",
    titleVi: "Sửa Lỗi Website / API / Webhook",
    badgeEn: "From $120 • Timeline Agreed Per Job",
    badgeVi: "Từ $120 • Thời Gian Thống Nhất Theo Việc",
    descEn:
      "Finding the root cause and shipping a fix for broken n8n/Make scenarios, dropped Stripe/Shopify/CRM webhooks, broken mobile checkout/booking links, or blocked scrapers.",
    descVi:
      "Tìm nguyên nhân gốc và sửa các luồng n8n/Make đứt gãy, mất webhook thanh toán/CRM, hỏng nút đặt lịch trên di động hoặc scraper bị chặn anti-bot.",
    deliverablesEn: [
      "Retry guard against duplicates + error logging where it fits",
      "Before/after check & a clean patch or PR",
    ],
    deliverablesVi: [
      "Khóa chống lặp dữ liệu (idempotent) + ghi log bắt lỗi tự động",
      "Báo cáo đối chiếu trước/sau & bàn giao bản vá sạch",
    ],
    prefillEn:
      "Scope: Fix a Broken Website / API / Webhook (from $120)\nTarget URL / Stack: \nCurrent bottleneck or error: ",
    prefillVi:
      "Gói đăng ký: Sửa lỗi Website / API / Webhook (từ $120)\nURL hoặc hệ thống hiện tại: \nLỗi cần xử lý gấp: ",
  },
  {
    id: "trial-sprint",
    code: "02",
    titleEn: "1-Week Paid Trial",
    titleVi: "Làm Thử Có Trả Phí 1 Tuần",
    badgeEn: "$300–$450 Fixed • About 1 Week",
    badgeVi: "$300–$450 Cố Định • Khoảng 1 Tuần",
    descEn:
      "For teams that want to see how I work on one small, well-defined piece of their system before agreeing to anything longer.",
    descVi:
      "Dành cho đội muốn xem tôi làm việc thế nào trên một phần nhỏ, rõ ràng của hệ thống trước khi hợp tác lâu dài.",
    deliverablesEn: [
      "A small FastAPI / Node / Supabase service or an LLM strict-JSON step",
      "Written progress updates (I work part-time, UTC+7)",
    ],
    deliverablesVi: [
      "Phân hệ FastAPI / Next.js / Supabase / MCP hoặc LLM chuẩn JSON Schema",
      "Cập nhật tiến độ bằng văn bản (tôi làm bán thời gian, UTC+7)",
    ],
    prefillEn:
      "Scope: 1-Week Paid Trial ($300-$450 Fixed)\nCompany / Team: \nSprint deliverable we want to ship this week: ",
    prefillVi:
      "Gói đăng ký: Sprint kỹ thuật dùng thử 1 tuần ($300-$450)\nĐơn vị / Dự án: \nHạng mục muốn hoàn thành trong tuần này: ",
  },
  {
    id: "custom-pipeline",
    code: "03",
    titleEn: "Custom Scraper / Data Sync Pipeline",
    titleVi: "Công Cụ Cào Dữ Liệu & Đồng Bộ Dữ Liệu",
    badgeEn: "Scoped Milestones",
    badgeVi: "Theo Cột Mốc",
    descEn:
      "Async Python & Playwright extractors, private Apify Actors, multi-store SKU price/stock monitors, and automated PostgreSQL/Sheets/ERP data sync.",
    descVi:
      "Bộ trích xuất dữ liệu Python bất đồng bộ & Playwright, Apify Actor riêng, theo dõi giá/tồn kho đa sàn và đồng bộ đối soát ERP/PostgreSQL/Google Sheets.",
    deliverablesEn: [
      "A small sample of real rows before the deposit, when the site allows it",
      "Deployment notes + basic schema and completeness checks",
    ],
    deliverablesVi: [
      "Gửi trước một ít dòng dữ liệu thật trước khi đặt cọc, nếu trang nguồn cho phép",
      "Hướng dẫn triển khai kèm kiểm tra schema và độ đầy đủ dữ liệu cơ bản",
    ],
    prefillEn:
      "Scope: Custom Scraper / Data Sync Pipeline\nTarget data source(s) & destination (CRM/ERP/DB): \nDesired schedule & fields: ",
    prefillVi:
      "Gói đăng ký: Công cụ cào dữ liệu / Đồng bộ dữ liệu\nNguồn dữ liệu & nơi nhận (CRM/ERP/Sheets): \nTrường dữ liệu & tần suất chạy: ",
  },
];

function getSocialIcon(type: string) {
  const t = type.toLowerCase();
  if (t === "github") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    );
  }
  if (t.includes("apify")) {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 22 7.5 22 16.5 12 22 2 16.5 2 7.5 12 2" />
        <polyline points="2 7.5 12 13 22 7.5" />
        <line x1="12" y1="22" x2="12" y2="13" />
      </svg>
    );
  }
  if (t.includes("upwork")) {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
        <path d="M12 12v4" />
        <path d="M9 14h6" />
      </svg>
    );
  }
  if (t.includes("dev.to") || t === "dev") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    );
  }
  if (t.includes("rapidapi") || t.includes("api")) {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    );
  }
  if (t === "linkedin") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }
  return (
    <svg className="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timerShow = setTimeout(() => setShow(true), 10);
    const timerHide = setTimeout(() => setShow(false), 3800);
    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerHide);
    };
  }, []);

  return (
    <div className={`toast ${show ? "show" : ""} ${toast.tone === "warn" ? "toast-warn" : ""}`}>
      <svg
        className="toast-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span>{toast.message}</span>
    </div>
  );
}

export function ContactSection() {
  const { lang, t } = useLang();
  const [socials, setSocials] = useState<any[]>(DEFAULT_SOCIALS);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [receiverEmail, setReceiverEmail] = useState<string>(DIRECT_EMAIL);
  const [emailCopied, setEmailCopied] = useState(false);

  // State của form liên hệ trực tiếp
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const triggerCursorHover = (enter: boolean) => {
    const eventName = enter ? "cursorHoverEnter" : "cursorHoverLeave";
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const hoverProps = {
    onMouseEnter: () => triggerCursorHover(true),
    onMouseLeave: () => triggerCursorHover(false),
  };

  const showToast = (message: string, tone: "ok" | "warn" = "ok") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4300);
  };

  useEffect(() => {
    try {
      const storedSocials = localStorage.getItem("contact_socials");
      if (storedSocials) {
        setSocials(JSON.parse(storedSocials));
      }
      const storedEmail = localStorage.getItem("contact_receiver_email");
      if (storedEmail && storedEmail.includes("@")) {
        setReceiverEmail(storedEmail.trim());
      }
    } catch (e) {
      console.error("Failed to read contact settings", e);
    }
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(receiverEmail);
      setEmailCopied(true);
      showToast(
        t(
          `Đã sao chép ${receiverEmail} vào bộ nhớ tạm!`,
          `Copied ${receiverEmail} to clipboard!`
        )
      );
      setTimeout(() => setEmailCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${receiverEmail}`;
    }
  };

  const handleSelectScope = (tier: EngagementTier) => {
    const template = lang === "en" ? tier.prefillEn : tier.prefillVi;
    setContactMessage(template);
    showToast(
      t(
        "Đã điền sẵn khung yêu cầu ở cột trái — bạn chỉ cần thêm URL/chi tiết!",
        "Scope pre-filled on the left — just add your target URL or brief!"
      )
    );
    if (!contactName.trim()) {
      nameInputRef.current?.focus();
    } else {
      messageInputRef.current?.focus();
    }
  };

  const openMailtoFallback = (targetEmail: string, name: string, senderEmail: string, bodyText: string) => {
    const subject = encodeURIComponent(`Project Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nReply-To Email: ${senderEmail}\n\nProject Brief:\n${bodyText}`
    );
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = contactName.trim();
    const trimmedEmail = contactEmail.trim();
    const trimmedMsg = contactMessage.trim();
    if (!trimmedName || !trimmedEmail || !trimmedMsg) return;

    setIsSending(true);
    const targetEmail = receiverEmail || DIRECT_EMAIL;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8500);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        signal: controller.signal,
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          _replyto: trimmedEmail,
          _subject: `B2B Project Inquiry from ${trimmedName}`,
          _captcha: "false",
          message: `From: ${trimmedName} (${trimmedEmail})\n\n${trimmedMsg}`,
        }),
      });

      const data = await response.json().catch(() => null);
      const isDelivered =
        response.ok &&
        data !== null &&
        (data.success === "true" || data.success === true);

      if (isDelivered) {
        showToast(
          t(
            "Đã gửi yêu cầu thành công! Mình thường phản hồi trong vòng 2–4 giờ.",
            "Inquiry delivered! I typically reply within 2–4 hours with a concrete plan."
          )
        );
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } else {
        throw new Error(data?.message || "FormSubmit activation or gateway fallback triggered");
      }
    } catch (err) {
      console.warn("Form gateway fallback -> opening direct mailto:", err);
      try {
        await navigator.clipboard.writeText(targetEmail);
      } catch {
        /* ignore clipboard permission failure */
      }
      showToast(
        t(
          `Đang mở trình gửi mail trực tiếp tới ${targetEmail} (đã copy sẵn email) để không thất lạc tin nhắn!`,
          `Opening your mail client to ${targetEmail} (email also copied) so your brief is never lost!`
        ),
        "warn"
      );
      openMailtoFallback(targetEmail, trimmedName, trimmedEmail, trimmedMsg);
    } finally {
      clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  return (
    <div className="contact-page-container">
      <style>{`
        .contact-page-container {
          background-color: #0b0c10;
          background-image: url('/IMG/background_info.jpeg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          background-attachment: fixed;
          min-height: 100vh;
          overflow-x: hidden;
          font-family: 'Be Vietnam Pro', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #ffffff;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-top: 100px;
        }

        .contact-header-wrapper {
          text-align: center;
          margin-top: 44px;
          margin-bottom: 28px;
          padding: 0 20px;
          z-index: 2;
          opacity: 0;
          animation: contactFadeUp 0.9s ease 0.25s forwards;
        }

        .gallery-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
        }

        .gallery-title .word-project {
          color: #ffffff;
          text-shadow: 0 0 20px rgba(255, 255, 255, 0.05);
        }

        .gallery-title .word-showcase {
          color: #71717a;
          text-shadow: 0 0 20px rgba(113, 113, 122, 0.05);
        }

        .contact-subtitle {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.04rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.68);
          margin: 12px auto 0 auto;
          max-width: 780px;
          letter-spacing: 0.3px;
          line-height: 1.5;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.12fr;
          gap: 34px;
          max-width: 1240px;
          width: 100%;
          margin: 0 auto;
          padding: 0 36px 64px 36px;
          z-index: 2;
          opacity: 0;
          animation: contactFadeIn 1.1s ease 0.35s forwards;
        }

        .contact-column-card {
          background: rgba(15, 18, 26, 0.68);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          padding: 34px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
          height: max-content;
        }

        .column-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.65rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.4px;
          color: #ffffff;
        }

        .column-subtitle {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.55;
          margin: 0 0 20px 0;
        }

        .direct-desk-box {
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(0, 162, 255, 0.22);
          border-radius: 14px;
          padding: 15px 16px;
          margin-bottom: 22px;
          display: flex;
          flex-direction: column;
          gap: 11px;
        }

        .direct-email-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        .direct-email-addr {
          font-family: 'Fira Code', monospace;
          font-size: 0.88rem;
          font-weight: 500;
          color: #e4e4e7;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          word-break: break-all;
        }

        .direct-email-addr:hover {
          color: #38bdf8;
        }

        .direct-email-addr svg {
          width: 16px;
          height: 16px;
          color: #38bdf8;
          flex-shrink: 0;
        }

        .copy-email-btn {
          background: rgba(56, 189, 248, 0.12);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 9px;
          color: #e0f2fe;
          font-family: inherit;
          font-size: 0.76rem;
          font-weight: 700;
          letter-spacing: 0.3px;
          padding: 7px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.22s ease;
        }

        .copy-email-btn:hover {
          background: #38bdf8;
          color: #090d16;
          border-color: #38bdf8;
        }

        .copy-email-btn svg {
          width: 13px;
          height: 13px;
        }

        .meta-pills-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .meta-pill {
          font-size: 0.73rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.72);
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 999px;
          padding: 4px 10px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .meta-pill-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.8);
          flex-shrink: 0;
        }

        .form-group {
          position: relative;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          width: 18px;
          height: 18px;
          color: rgba(255, 255, 255, 0.35);
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.025);
          border: 1.5px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          padding: 14px 15px 14px 46px;
          font-family: inherit;
          font-size: 0.9rem;
          color: #ffffff;
          outline: none;
          transition: border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease;
        }

        textarea.form-input {
          resize: vertical;
          min-height: 118px;
          line-height: 1.5;
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(56, 189, 248, 0.65);
          box-shadow: 0 0 20px rgba(56, 189, 248, 0.14);
        }

        .submit-btn {
          background: #ffffff;
          border: 1px solid #ffffff;
          border-radius: 12px;
          color: #090d16;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          padding: 15px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.25s cubic-bezier(0.25, 1, 0.5, 1);
          width: 100%;
          margin-bottom: 28px;
        }

        .submit-btn:hover {
          background: #38bdf8;
          border-color: #38bdf8;
          color: #05080f;
          box-shadow: 0 10px 25px rgba(56, 189, 248, 0.25);
          transform: translateY(-2px);
        }

        .submit-btn svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
          transition: transform 0.25s ease;
        }

        .submit-btn:hover svg {
          transform: translate(2px, -2px);
        }

        .social-section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
          margin: 0 0 14px 0;
          letter-spacing: 0.8px;
        }

        .social-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .social-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 14px 15px;
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: #ffffff;
          transition: all 0.25s ease;
        }

        .social-card.large {
          grid-column: span 2;
        }

        .social-card:hover {
          background: rgba(255, 255, 255, 0.055);
          border-color: rgba(255, 255, 255, 0.18);
          transform: translateY(-2px);
        }

        .social-icon {
          width: 21px;
          height: 21px;
          color: rgba(255, 255, 255, 0.75);
          fill: currentColor;
          transition: color 0.25s ease;
          flex-shrink: 0;
        }

        .social-card:hover .social-icon {
          color: #38bdf8;
        }

        .social-info {
          display: flex;
          flex-direction: column;
        }

        .social-name {
          font-size: 0.88rem;
          font-weight: 700;
        }

        .social-handle {
          font-size: 0.74rem;
          color: rgba(255, 255, 255, 0.45);
          margin-top: 2px;
        }

        /* CỘT PHẢI: B2B Engagement Options & cách làm việc */
        .tier-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }

        .tier-card {
          background: rgba(255, 255, 255, 0.022);
          border: 1px solid rgba(255, 255, 255, 0.075);
          border-radius: 15px;
          padding: 18px 20px;
          transition: border-color 0.25s ease, background-color 0.25s ease, transform 0.25s ease;
        }

        .tier-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(56, 189, 248, 0.35);
          transform: translateY(-1px);
        }

        .tier-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 8px;
        }

        .tier-title-group {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .tier-code {
          font-family: 'Fira Code', monospace;
          font-size: 0.72rem;
          font-weight: 600;
          color: #38bdf8;
          background: rgba(56, 189, 248, 0.1);
          border: 1px solid rgba(56, 189, 248, 0.25);
          border-radius: 6px;
          padding: 2px 7px;
          flex-shrink: 0;
        }

        .tier-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          line-height: 1.35;
        }

        .tier-badge {
          font-family: 'Fira Code', monospace;
          font-size: 0.72rem;
          font-weight: 600;
          color: #6ee7b7;
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.28);
          border-radius: 999px;
          padding: 3px 10px;
          white-space: nowrap;
        }

        .tier-desc {
          font-size: 0.83rem;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.5;
          margin: 0 0 10px 0;
        }

        .tier-list {
          list-style: none;
          padding: 0;
          margin: 0 0 12px 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .tier-list li {
          font-size: 0.79rem;
          color: rgba(255, 255, 255, 0.78);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tier-list li svg {
          width: 14px;
          height: 14px;
          color: #10b981;
          flex-shrink: 0;
        }

        .tier-select-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-radius: 8px;
          color: #e4e4e7;
          font-family: inherit;
          font-size: 0.76rem;
          font-weight: 700;
          padding: 6px 12px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s ease;
        }

        .tier-select-btn:hover {
          background: rgba(56, 189, 248, 0.14);
          border-color: #38bdf8;
          color: #38bdf8;
        }

        .tier-select-btn svg {
          width: 13px;
          height: 13px;
        }

        .sla-guarantee-box {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.09), rgba(56, 189, 248, 0.06));
          border: 1px solid rgba(16, 185, 129, 0.32);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .sla-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .sla-header svg {
          width: 20px;
          height: 20px;
          color: #10b981;
          flex-shrink: 0;
        }

        .sla-headline {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.94rem;
          font-weight: 800;
          color: #ecfdf5;
          margin: 0;
          letter-spacing: 0.1px;
        }

        .sla-points {
          display: grid;
          grid-template-columns: 1fr;
          gap: 6px;
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .sla-points li {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.74);
          line-height: 1.45;
        }

        .sla-points strong {
          color: #ffffff;
        }

        .toast-container {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
        }

        .toast {
          pointer-events: auto;
          background: rgba(15, 18, 26, 0.96);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(56, 189, 248, 0.35);
          border-radius: 12px;
          padding: 15px 22px;
          color: #ffffff;
          font-size: 0.86rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 440px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.55);
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .toast.toast-warn {
          border-color: rgba(245, 158, 11, 0.45);
        }

        .toast.show {
          transform: translateY(0);
          opacity: 1;
        }

        .toast-icon {
          width: 18px;
          height: 18px;
          color: #38bdf8;
          flex-shrink: 0;
        }

        @keyframes contactFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes contactFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 1040px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 0 20px 44px 20px;
          }
          .contact-header-wrapper {
            margin-top: 72px;
          }
        }
      `}</style>

      <div className="toast-container">
        {toasts.map((item) => (
          <ToastItem key={item.id} toast={item} />
        ))}
      </div>

      <NavBar />

      <div className="contact-header-wrapper">
        <h1 className="gallery-title" style={{ marginBottom: "10px" }}>
          <span className="word-project">{t("Hợp Tác Kỹ Thuật", "Engineering")}</span>
          <span className="word-showcase">{t("& Báo Giá Sprint", "& Direct Dispatch")}</span>
        </h1>
        <p className="contact-subtitle">
          {t(
            "Nhận phát triển trọn gói hệ thống cào dữ liệu chống chặn, tự động hóa n8n/FastAPI và hợp đồng kỹ sư B2B từ xa.",
            "Scoped B2B data extraction pipelines, deterministic workflow automations, and paid engineering trial sprints."
          )}
        </p>
      </div>

      <section className="contact-grid">
        {/* CỘT TRÁI: Hộp Email Trực Tiếp + Form Bảo Hiểm Kép + 5 Kênh Xác Thực */}
        <div className="contact-column-card">
          <h2 className="column-title">{t("Gửi Yêu Cầu Trực Tiếp", "Direct Engineering Brief")}</h2>
          <p className="column-subtitle">
            {t(
              "Gửi URL mục tiêu hoặc bài toán hệ thống đang nghẽn — phản hồi trong 2–4 giờ kèm phương án kỹ thuật hoặc mẫu dữ liệu thật.",
              "Share your target URL, API spec, or workflow bottleneck. Typical response within 2–4 hours with a concrete technical plan or sample."
            )}
          </p>

          <div className="direct-desk-box">
            <div className="direct-email-row">
              <a
                href={`mailto:${receiverEmail}`}
                className="direct-email-addr"
                {...hoverProps}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span>{receiverEmail}</span>
              </a>

              <button
                type="button"
                className="copy-email-btn"
                onClick={handleCopyEmail}
                {...hoverProps}
              >
                {emailCopied ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{t("Đã Chép Email", "Copied")}</span>
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    <span>{t("Chép Email Trực Tiếp", "Copy Direct Email")}</span>
                  </>
                )}
              </button>
            </div>

            <div className="meta-pills-row">
              <span className="meta-pill">
                <span className="meta-pill-dot" />
                Ho Chi Minh City (UTC+7)
              </span>
              <span className="meta-pill">
                {t("Nhận việc qua Upwork hoặc email", "Work via Upwork or email")}
              </span>
            </div>
          </div>

          <form onSubmit={handleContactSubmit}>
            <div className="form-group">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                ref={nameInputRef}
                type="text"
                className="form-input"
                placeholder={t("Tên của bạn / Công ty", "Your Name & Company")}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                {...hoverProps}
              />
            </div>

            <div className="form-group">
              <svg
                className="input-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                type="email"
                className="form-input"
                placeholder={t("Email làm việc của bạn", "Work Email (for sample & quote reply)")}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                {...hoverProps}
              />
            </div>

            <div className="form-group">
              <svg
                className="input-icon"
                style={{ top: "15px" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <textarea
                ref={messageInputRef}
                className="form-input"
                placeholder={t(
                  "Dán URL mục tiêu, lỗi hệ thống hiện tại hoặc phạm vi Sprint bạn muốn triển khai...",
                  "Share target URL(s), broken workflow details, or desired sprint deliverables..."
                )}
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
                {...hoverProps}
              />
            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={isSending}
              style={{ opacity: isSending ? 0.72 : 1 }}
              {...hoverProps}
            >
              <svg viewBox="0 0 24 24" className={isSending ? "animate-pulse" : ""}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              {isSending
                ? t("Đang Gửi...", "Dispatching...")
                : t("Gửi Yêu Cầu Báo Giá & Mẫu Thử", "Send Brief & Request Sample")}
            </button>
          </form>

          <h3 className="social-section-title">
            {t("Nơi Xem Công Việc Của Tôi", "Where to See My Work")}
          </h3>
          <div className="social-grid">
            {socials
              .filter((s) => s.visible)
              .map((s, idx) => (
                <a
                  key={idx}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`social-card ${s.large ? "large" : ""}`}
                  {...hoverProps}
                >
                  {getSocialIcon(s.type)}
                  <div className="social-info">
                    <span className="social-name">{s.type}</span>
                    <span className="social-handle">{s.handle}</span>
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/* CỘT PHẢI: Engagement Options & cách làm việc (Thay thế sổ lưu bút localStorage) */}
        <div className="contact-column-card">
          <h2 className="column-title">
            {t("Cách Hợp Tác", "Ways to Work Together")}
          </h2>
          <p className="column-subtitle">
            {t(
              "Giá cố định theo phạm vi việc. Chọn một mục bên dưới để điền sẵn bản mô tả sang cột trái.",
              "Fixed price per agreed scope. Pick an option below to pre-fill your project brief."
            )}
          </p>

          <div className="tier-stack">
            {ENGAGEMENT_TIERS.map((tier) => (
              <div key={tier.id} className="tier-card">
                <div className="tier-top-row">
                  <div className="tier-title-group">
                    <span className="tier-code">{tier.code}</span>
                    <h3 className="tier-title">{t(tier.titleVi, tier.titleEn)}</h3>
                  </div>
                  <span className="tier-badge">{t(tier.badgeVi, tier.badgeEn)}</span>
                </div>

                <p className="tier-desc">{t(tier.descVi, tier.descEn)}</p>

                <ul className="tier-list">
                  {(lang === "en" ? tier.deliverablesEn : tier.deliverablesVi).map((item, i) => (
                    <li key={i}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="tier-select-btn"
                  onClick={() => handleSelectScope(tier)}
                  {...hoverProps}
                >
                  <span>{t("Chọn Khung Dự Án Này", "Use This Scope Template")}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="sla-guarantee-box">
            <div className="sla-header">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <polyline points="9 12 11 14 15 10" />
              </svg>
              <h3 className="sla-headline">
                {t(
                  "Bạn Xem Nó Chạy Trước Khi Thanh Toán Phần Cuối",
                  "You See It Working Before the Final Payment"
                )}
              </h3>
            </div>

            <ul className="sla-points">
              <li>
                <strong>{t("Xem mẫu trước:", "Sample first:")}</strong>{" "}
                {t(
                  "Khi làm được, tôi gửi vài dòng dữ liệu thật hoặc bản chẩn đoán lỗi trước khi bạn đặt cọc.",
                  "Where possible, I send a few real rows or a written diagnosis before you pay a deposit."
                )}
              </li>
              <li>
                <strong>{t("Thanh toán:", "Payment:")}</strong>{" "}
                {t(
                  "Qua hợp đồng Upwork, hoặc thoả thuận trực tiếp qua email.",
                  "Through an Upwork contract, or agreed directly by email."
                )}
              </li>
              <li>
                <strong>{t("Bàn giao:", "Handover:")}</strong>{" "}
                {t(
                  "Bạn sở hữu mã nguồn (Python / TypeScript), kèm hướng dẫn chạy và cấu hình.",
                  "You own the source (Python / TypeScript), with setup notes and config."
                )}
              </li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="bottom-controls" style={{ paddingBottom: "30px", zIndex: 2 }} />
    </div>
  );
}
