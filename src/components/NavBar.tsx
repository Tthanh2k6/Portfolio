import { useRef, useState, useEffect, useCallback } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const navItems = [
  { label: "Home",        to: "/" },
  { label: "Information", to: "/information" },
  { label: "Skills",      to: "/skills" },
  { label: "Project",     to: "/project" },
  { label: "Contact",     to: "/contact" },
];

interface BubbleRect { left: number; width: number; height: number; top: number }

export function NavBar({ className = "" }: { className?: string }) {
  const router        = useRouterState();
  const currentPath   = router.location.pathname;

  const navRef        = useRef<HTMLElement>(null);
  const itemRefs      = useRef<(HTMLLIElement | null)[]>([]);
  const bubbleRef     = useRef<HTMLDivElement>(null);
  const returnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [bubbleRect, setBubbleRect] = useState<BubbleRect | null>(null);
  const [visible, setVisible]       = useState(false);
  // Đã cuộn khỏi đầu trang chưa — dùng để hiện nền mờ cho navbar, tránh chữ trang
  // (vd header "Get In Touch") trượt lên dưới navbar trong suốt gây chồng chữ.
  const [scrolled, setScrolled]     = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lấy rect của một <li> trong nav, tương đối so với <nav>
  const getRectOf = useCallback((el: HTMLLIElement | null): BubbleRect | null => {
    if (!el || !navRef.current) return null;
    const navBox  = navRef.current.getBoundingClientRect();
    const itemBox = el.getBoundingClientRect();
    return {
      left:   itemBox.left - navBox.left,
      top:    itemBox.top  - navBox.top,
      width:  itemBox.width,
      height: itemBox.height,
    };
  }, []);

  // Di chuyển bubble tới mục trang đang active khi mount / khi đổi route
  useEffect(() => {
    const activeIdx = navItems.findIndex(item => {
      if (item.to === "/") return currentPath === "/";
      return currentPath.startsWith(item.to);
    });
    const el = itemRefs.current[activeIdx] ?? null;
    const rect = getRectOf(el);
    if (rect) {
      setBubbleRect(rect);
      setVisible(true);
    }
  }, [currentPath, getRectOf]);

  const moveBubbleTo = (el: HTMLLIElement | null) => {
    const rect = getRectOf(el);
    if (rect) setBubbleRect(rect);
  };

  const onItemEnter = (idx: number) => {
    if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
    moveBubbleTo(itemRefs.current[idx]);
  };

  const onNavEnter = () => {
    if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
    window.dispatchEvent(new CustomEvent("navHoverEnter"));
  };

  const onNavLeave = () => {
    // Đưa bubble về trang đang active sau một khoảng trễ ngắn
    if (returnTimerRef.current) clearTimeout(returnTimerRef.current);
    returnTimerRef.current = setTimeout(() => {
      const activeIdx = navItems.findIndex(item => {
        if (item.to === "/") return currentPath === "/";
        return currentPath.startsWith(item.to);
      });
      moveBubbleTo(itemRefs.current[activeIdx] ?? null);
    }, 120);
    window.dispatchEvent(new CustomEvent("navHoverLeave"));
  };

  useEffect(() => {
    return () => { if (returnTimerRef.current) clearTimeout(returnTimerRef.current); };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed left-0 top-0 z-50 flex w-full items-center justify-center px-8 py-7 ${className}`}
      style={{
        transition:
          "background-color 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
        // Phong cách glass (đồng bộ với bubble indicator): trắng trong mờ + blur mạnh
        backgroundColor: scrolled ? "rgba(255,255,255,0.06)" : "transparent",
        backdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px) saturate(140%)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,0.12)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 4px 24px rgba(0,0,0,0.18)" : "none",
      }}
      onMouseEnter={onNavEnter}
      onMouseLeave={onNavLeave}
    >
      {/* Chỉ báo bubble — định vị absolute bên trong nav */}
      {visible && bubbleRect && (
        <div
          ref={bubbleRef}
          aria-hidden="true"
          style={{
            position:     "absolute",
            left:         bubbleRect.left - 12,
            top:          bubbleRect.top  - 6,
            width:        bubbleRect.width  + 24,
            height:       bubbleRect.height + 12,
            borderRadius: "9999px",
            background:   "rgba(255,255,255,0.10)",
            border:       "1px solid rgba(255,255,255,0.18)",
            backdropFilter: "blur(6px)",
            transition:   "left 0.38s cubic-bezier(0.34,1.56,0.64,1), top 0.38s cubic-bezier(0.34,1.56,0.64,1), width 0.38s cubic-bezier(0.34,1.56,0.64,1), height 0.38s cubic-bezier(0.34,1.56,0.64,1)",
            pointerEvents: "none",
            zIndex:       0,
            boxShadow:    "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 16px rgba(0,0,0,0.18)",
          }}
        />
      )}

      <ul
        className="relative flex items-center gap-12 font-sans text-lg text-zinc-400"
        style={{ zIndex: 1 }}
      >
        {navItems.map((item, idx) => (
          <li
            key={item.label}
            ref={el => { itemRefs.current[idx] = el; }}
            onMouseEnter={() => onItemEnter(idx)}
            style={{ position: "relative", zIndex: 1 }}
          >
            <Link
              to={item.to}
              className="transition-colors duration-300 hover:text-white [&.active]:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
