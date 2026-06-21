import { useState, useRef, useEffect } from "react";
import { NavBar } from "./NavBar";

interface Comment {
  id: number;
  author: string;
  text: string;
  pinned: boolean;
  likes: number;
  liked: boolean;
  image: string | null;
  initial: string;
}

interface Toast {
  id: number;
  message: string;
}

const DEFAULT_SOCIALS = [
  { type: "GitHub", url: "https://github.com", handle: "@tranthanh", visible: true, large: true },
  { type: "Facebook", url: "https://facebook.com", handle: "Trần Trung Thành", visible: true, large: false },
  { type: "Zalo", url: "https://zalo.me", handle: "Trần Trung Thành", visible: true, large: false },
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
  if (t === "facebook") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
      </svg>
    );
  }
  if (t === "zalo") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 5.58 2 10c0 1.69.64 3.24 1.72 4.54L2.08 20.3c-.22.68.42 1.32 1.1 1.1l5.76-1.64C10.24 20.64 11.11 21 12 21c5.52 0 10-4.48 10-10S17.52 2 12 2zm2.14 12.22h-3.4l2.5-3.5H10.1v-1.2h3.28l-2.43 3.5h3.19v1.2z" />
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
  if (t === "instagram") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0 3.259.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }
  if (t === "youtube") {
    return (
      <svg className="social-icon" viewBox="0 0 24 24">
        <path d="M23.498 6.163c-.272-1.026-1.077-1.83-2.101-2.102C19.537 3.5 12 3.5 12 3.5s-7.537 0-9.397.561c-1.024.272-1.829 1.076-2.101 2.102C0 8.026 0 12 0 12s0 3.974.502 5.837c.272 1.026 1.077 1.83 2.101 2.102C4.463 20.5 12 20.5 12 20.5s7.537 0 9.397-.561c1.024-.272 1.83-1.076 2.101-2.102C24 15.974 24 12 24 12s0-3.974-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
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

const initialComments: Comment[] = [
  {
    id: 1,
    author: "Rifqi Muhammad A",
    text: "Terima kasih đã mampir",
    pinned: true,
    likes: 2,
    liked: false,
    image: null,
    initial: "R",
  },
  {
    id: 3,
    author: "kyy",
    text: "hii",
    pinned: false,
    likes: 0,
    liked: false,
    image: null,
    initial: "K",
  },
];

function ToastItem({ toast }: { toast: Toast }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timerShow = setTimeout(() => setShow(true), 10);
    const timerHide = setTimeout(() => setShow(false), 3500);
    return () => {
      clearTimeout(timerShow);
      clearTimeout(timerHide);
    };
  }, []);

  return (
    <div className={`toast ${show ? "show" : ""}`}>
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
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [socials, setSocials] = useState<any[]>(DEFAULT_SOCIALS);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Contact Form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  // Guestbook Form state
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentText, setCommentText] = useState("");
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerCursorHover = (enter: boolean) => {
    const eventName = enter ? "cursorHoverEnter" : "cursorHoverLeave";
    window.dispatchEvent(new CustomEvent(eventName));
  };

  const hoverProps = {
    onMouseEnter: () => triggerCursorHover(true),
    onMouseLeave: () => triggerCursorHover(false),
  };

  const showToast = (message: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Load dy details from localStorage on client side mount
  useEffect(() => {
    const storedSocials = localStorage.getItem("contact_socials");
    if (storedSocials) {
      try {
        setSocials(JSON.parse(storedSocials));
      } catch (e) {
        console.error("Failed to parse contact_socials", e);
      }
    }

    const storedComments = localStorage.getItem("contact_comments");
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (e) {
        console.error("Failed to parse contact_comments", e);
      }
    }
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) return;

    setIsSending(true);
    const receiverEmail = localStorage.getItem("contact_receiver_email") || "ttrungthanh90@gmail.com";

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${receiverEmail}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          _subject: `Contact from ${contactName}`,
          _captcha: "false",
          message: `hello, my name's ${contactName}\nmy email is ${contactEmail}\n\nmessage:\n${contactMessage}`
        })
      });

      if (response.ok) {
        showToast("Message sent successfully!");
        setContactName("");
        setContactEmail("");
        setContactMessage("");
      } else {
        throw new Error("Failed to send email");
      }
    } catch (err) {
      console.error("Error sending email:", err);
      showToast("Error sending message. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          setSelectedImageBase64(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentAuthor.trim() || !commentText.trim()) return;

    const initial = commentAuthor.trim().charAt(0).toUpperCase() || "?";
    const newComment: Comment = {
      id: Date.now(),
      author: commentAuthor,
      text: commentText,
      pinned: false,
      likes: 0,
      liked: false,
      image: selectedImageBase64,
      initial,
    };

    setComments((prev) => {
      const pinned = prev.filter((c) => c.pinned);
      const regular = prev.filter((c) => !c.pinned);
      const updated = [...pinned, newComment, ...regular];
      localStorage.setItem("contact_comments", JSON.stringify(updated));
      return updated;
    });

    showToast("Comment posted successfully!");
    setCommentAuthor("");
    setCommentText("");
    setSelectedImageBase64(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const toggleLike = (id: number) => {
    setComments((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          const liked = !c.liked;
          const likes = liked ? c.likes + 1 : c.likes - 1;
          return { ...c, liked, likes };
        }
        return c;
      });
      localStorage.setItem("contact_comments", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="contact-page-container">
      {/* SCOPED CUSTOM CSS STYLES */}
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
          margin-top: 50px;
          margin-bottom: 30px;
          padding: 0 20px;
          z-index: 2;
          opacity: 0;
          animation: contactFadeUp 0.9s ease 0.3s forwards;
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
          color: #52525b;
          text-shadow: 0 0 20px rgba(82, 82, 91, 0.05);
        }

        .contact-subtitle {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.65);
          margin: 12px 0 0 0;
          letter-spacing: 0.5px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr 1.1fr;
          gap: 40px;
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 0 40px 60px 40px;
          z-index: 2;
          opacity: 0;
          animation: contactFadeIn 1.2s ease 0.4s forwards;
        }

        .contact-column-card {
          background: rgba(18, 20, 29, 0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 36px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
          height: max-content;
        }

        .column-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0 0 8px 0;
          letter-spacing: -0.5px;
          color: #ffffff;
        }

        .column-subtitle {
          font-size: 0.88rem;
          color: rgba(255, 255, 255, 0.55);
          line-height: 1.5;
          margin: 0 0 28px 0;
        }

        .form-group {
          position: relative;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 18px;
          width: 20px;
          height: 20px;
          color: rgba(255, 255, 255, 0.35);
          pointer-events: none;
          transition: color 0.3s ease;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1.5px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 16px 16px 16px 50px;
          font-family: inherit;
          font-size: 0.92rem;
          color: #ffffff;
          outline: none;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
        }

        textarea.form-input {
          resize: none;
          height: 120px;
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(0, 162, 255, 0.6);
          box-shadow: 0 0 20px rgba(0, 162, 255, 0.15);
        }

        .form-input:focus + .input-icon {
          color: #00a2ff;
        }

        .submit-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          padding: 15px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          width: 100%;
          margin-bottom: 32px;
          border-color: rgba(255,255,255,0.1);
        }

        .submit-btn:hover {
          background: #ffffff;
          color: #000000;
          box-shadow: 0 10px 25px rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .submit-btn svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
          transition: transform 0.3s ease;
        }

        .submit-btn:hover svg {
          transform: translate(2px, -2px);
        }

        .social-section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 16px 0;
          letter-spacing: 0.5px;
        }

        .social-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        .social-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
          color: #ffffff;
          transition: all 0.3s ease;
        }

        .social-card.large {
          grid-column: span 2;
        }

        .social-card:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .social-icon {
          width: 22px;
          height: 22px;
          color: rgba(255, 255, 255, 0.7);
          fill: currentColor;
          transition: color 0.3s ease;
          flex-shrink: 0;
        }

        .social-card:hover .social-icon {
          color: #ffffff;
        }

        .social-info {
          display: flex;
          flex-direction: column;
        }

        .social-name {
          font-size: 0.9rem;
          font-weight: 700;
        }

        .social-handle {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 2px;
        }

        .comments-input-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        .comments-input-row .form-group {
          margin-bottom: 0;
        }

        .comment-textarea {
          padding-left: 18px;
        }

        .comments-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 30px;
        }

        .action-sub-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1.5px dashed rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: rgba(255, 255, 255, 0.6);
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 600;
          padding: 14px 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
          cursor: none !important;
        }

        .action-sub-btn:hover {
          border-color: rgba(255, 255, 255, 0.3);
          color: #ffffff;
          background: rgba(255, 255, 255, 0.04);
        }

        .action-sub-btn svg {
          width: 16px;
          height: 16px;
          fill: currentColor;
        }

        .action-post-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #ffffff;
          font-family: inherit;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 14px 0;
          transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          border-color: rgba(255,255,255,0.1);
        }

        .action-post-btn:hover {
          background: #ffffff;
          color: #000000;
          box-shadow: 0 10px 20px rgba(255, 255, 255, 0.1);
        }

        .comments-feed-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.6);
          margin: 0 0 16px 0;
          letter-spacing: 0.5px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 24px;
        }

        .comments-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 6px;
        }

        .comments-list::-webkit-scrollbar {
          width: 4px;
        }
        .comments-list::-webkit-scrollbar-track {
          background: transparent;
        }
        .comments-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .comments-list::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .comment-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 14px;
          padding: 16px;
          display: flex;
          gap: 14px;
          position: relative;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }

        .comment-card:hover {
          background: rgba(255, 255, 255, 0.03);
          border-color: rgba(255, 255, 255, 0.1);
        }

        .comment-card.pinned {
          border-color: rgba(147, 51, 234, 0.3);
          background: rgba(147, 51, 234, 0.02);
        }

        .comment-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #252836;
          color: #ffffff;
          font-size: 0.95rem;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          text-transform: uppercase;
          flex-shrink: 0;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .comment-content-box {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .comment-author-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
        }

        .comment-author-name {
          font-size: 0.88rem;
          font-weight: 700;
          color: #ffffff;
        }

        .comment-badge-pinned {
          background: rgba(147, 51, 234, 0.2);
          border: 1.5px solid rgba(147, 51, 234, 0.4);
          border-radius: 6px;
          color: #c084fc;
          font-size: 0.62rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          padding: 2px 6px;
          text-transform: uppercase;
        }

        .comment-text {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.45;
          margin: 0;
        }

        .comment-attachment {
          width: 100%;
          max-width: 140px;
          height: 90px;
          border-radius: 8px;
          object-fit: cover;
          margin-top: 10px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .comment-like-box {
          position: absolute;
          right: 16px;
          top: 16px;
          display: flex;
          align-items: center;
          gap: 5px;
          color: rgba(255, 255, 255, 0.3);
          font-size: 0.75rem;
          font-weight: 600;
          cursor: none !important;
          transition: color 0.3s ease;
        }

        .comment-like-box:hover, .comment-like-box.liked {
          color: #f43f5e;
        }

        .comment-like-box svg {
          width: 14px;
          height: 14px;
          fill: currentColor;
          transition: transform 0.2s ease;
        }

        .comment-like-box:active svg {
          transform: scale(1.3);
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
          background: rgba(18, 20, 29, 0.95);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(0, 162, 255, 0.25);
          border-radius: 12px;
          padding: 16px 24px;
          color: #ffffff;
          font-size: 0.88rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 162, 255, 0.1);
          transform: translateY(100px);
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .toast.show {
          transform: translateY(0);
          opacity: 1;
        }

        .toast-icon {
          width: 18px;
          height: 18px;
          color: #00a2ff;
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

        @media (max-width: 1024px) {
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 0 20px 40px 20px;
          }
          .contact-header-wrapper {
            margin-top: 80px;
          }
        }
      `}</style>

      {/* TOAST NOTIFICATIONS */}
      <div className="toast-container">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </div>

      {/* NAVBAR */}
      <NavBar />

      {/* HEADER TITLE */}
      <div className="contact-header-wrapper">
        <h1 className="gallery-title" style={{ marginBottom: "12px" }}>
          <span className="word-project">Get In</span>
          <span className="word-showcase">Touch</span>
        </h1>
        <p className="contact-subtitle">
          Have something in mind? Send a message and let's connect.
        </p>
      </div>

      {/* TWO-COLUMN GRID */}
      <section className="contact-grid">
        {/* LEFT COLUMN: Contact Form + Social Grid */}
        <div className="contact-column-card">
          <h2 className="column-title">Contact Me</h2>
          <p className="column-subtitle">
            Feel free to reach out if you want to collaborate, discuss ideas, or simply say hello.
          </p>

          <form onSubmit={handleContactSubmit}>
            {/* Name input */}
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
                type="text"
                className="form-input"
                placeholder="Your Name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                required
                {...hoverProps}
              />
            </div>

            {/* Email input */}
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
                placeholder="Your Email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                {...hoverProps}
              />
            </div>

            {/* Message input */}
            <div className="form-group">
              <svg
                className="input-icon"
                style={{ top: "16px" }}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <textarea
                className="form-input"
                placeholder="Your Message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                required
                {...hoverProps}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isSending} style={{ opacity: isSending ? 0.7 : 1 }} {...hoverProps}>
              <svg viewBox="0 0 24 24" className={isSending ? "animate-pulse" : ""}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              {isSending ? "Sending..." : "Send Message"}
            </button>
          </form>

          <h3 className="social-section-title">Connect With Me</h3>
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

        {/* RIGHT COLUMN: Guestbook / Comments */}
        <div className="contact-column-card">
          <h2 className="column-title">Comments</h2>
          <p className="column-subtitle">Leave your thoughts here</p>

          <form onSubmit={handleCommentSubmit}>
            <div className="comments-input-row">
              {/* Comment Name */}
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
                  type="text"
                  className="form-input"
                  placeholder="Your Name"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  required
                  {...hoverProps}
                />
              </div>

              {/* Comment text */}
              <div className="form-group">
                <textarea
                  className="form-input comment-textarea"
                  placeholder="Your Comment"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  {...hoverProps}
                />
              </div>
            </div>

            <div className="comments-actions">
              {/* Upload image */}
              <button
                type="button"
                className="action-sub-btn animate-pulse-glow"
                onClick={triggerFileInput}
                {...hoverProps}
                style={{
                  borderColor: selectedImageBase64 ? "rgba(0, 162, 255, 0.4)" : "rgba(255, 255, 255, 0.1)",
                  color: selectedImageBase64 ? "#00a2ff" : "rgba(255, 255, 255, 0.6)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>{selectedImageBase64 ? "Image Selected" : "Upload Image"}</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageSelected}
              />

              <button type="submit" className="action-post-btn" {...hoverProps}>
                Post Comment
              </button>
            </div>
          </form>

          <h3 className="comments-feed-title">Latest Comments</h3>

          {/* COMMENTS FEED LIST */}
          <div className="comments-list">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`comment-card ${comment.pinned ? "pinned" : ""}`}
              >
                <div className="comment-avatar">{comment.initial}</div>
                <div className="comment-content-box">
                  <div className="comment-author-row">
                    <span className="comment-author-name">{comment.author}</span>
                    {comment.pinned && <span className="comment-badge-pinned">Pinned</span>}
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  {comment.image && (
                    <img
                      src={comment.image}
                      className="comment-attachment"
                      alt="Attached attachment"
                    />
                  )}
                </div>

                <button
                  type="button"
                  className={`comment-like-box ${comment.liked ? "liked" : ""}`}
                  onClick={() => toggleLike(comment.id)}
                  {...hoverProps}
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span>{comment.likes}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bottom-controls" style={{ paddingBottom: "30px", zIndex: 2 }}>
      </footer>
    </div>
  );
}
