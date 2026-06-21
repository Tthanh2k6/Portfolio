import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <CustomCursor />
    </QueryClientProvider>
  );
}


// ─── Custom Cursor ──────────────────────────────────────────────────
function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const posRef = useRef({ x: 0, y: 0 });
  const velRef = useRef({ x: 0, y: 0 });
  const hoverScaleRef = useRef(1.0);
  const targetHoverScaleRef = useRef(1.0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    mouseRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    posRef.current   = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    velRef.current   = { x: 0, y: 0 };
    hoverScaleRef.current = 1.0;
    targetHoverScaleRef.current = 1.0;

    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    let rafId: number;
    const tick = () => {
      const targetX = mouseRef.current.x;
      const targetY = mouseRef.current.y;

      let px = posRef.current.x;
      let py = posRef.current.y;
      let vx = velRef.current.x;
      let vy = velRef.current.y;

      // Spring-damper physics constants
      const spring = 0.085;  // Spring coefficient (stiffness)
      const damping = 0.62;  // Damping coefficient (friction/resistance)

      // Calculate acceleration
      const ax = (targetX - px) * spring - vx * damping;
      const ay = (targetY - py) * spring - vy * damping;

      // Update velocity & position
      vx += ax;
      vy += ay;
      px += vx;
      py += vy;

      posRef.current = { x: px, y: py };
      velRef.current = { x: vx, y: vy };

      // Calculate speed and angle of travel for dynamic stretching
      const speed = Math.sqrt(vx * vx + vy * vy);
      const angle = Math.atan2(vy, vx);

      // Droplet stretch factors: stretches along velocity axis, contracts perpendicular to it
      const maxStretch = 1.95;
      const stretch = Math.min(1 + speed * 0.038, maxStretch);
      const shrink = Math.max(1 - speed * 0.018, 0.45);

      // Smoothly animate hover scale expansion
      const targetHoverScale = targetHoverScaleRef.current;
      let currentHoverScale = hoverScaleRef.current;
      currentHoverScale += (targetHoverScale - currentHoverScale) * 0.15;
      hoverScaleRef.current = currentHoverScale;

      const finalScaleX = stretch * currentHoverScale;
      const finalScaleY = shrink * currentHoverScale;

      if (cursorRef.current) {
        // No hard offset here! Centering is handled by CSS margin-top/margin-left
        cursorRef.current.style.transform =
          `translate3d(${px}px, ${py}px, 0) rotate(${angle}rad) scale(${finalScaleX}, ${finalScaleY})`;
      }
      rafId = requestAnimationFrame(tick);
    };

    const onLeave = () => { if (cursorRef.current) cursorRef.current.style.opacity = "0"; };
    const onEnter = () => { if (cursorRef.current) cursorRef.current.style.opacity = "1"; };

    const handleHoverEnter = () => {
      targetHoverScaleRef.current = 1.35;
    };
    const handleHoverLeave = () => {
      targetHoverScaleRef.current = 1.0;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    window.addEventListener("cursorHoverEnter", handleHoverEnter);
    window.addEventListener("cursorHoverLeave", handleHoverLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("cursorHoverEnter", handleHoverEnter);
      window.removeEventListener("cursorHoverLeave", handleHoverLeave);
      cancelAnimationFrame(rafId);
    };
  }, [mounted]);

  if (!mounted) return null;

  return createPortal(
    <div ref={cursorRef} className="skills-cursor">
      {/* Center dot - displays actual color for targeting */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "4px",
          height: "4px",
          backgroundColor: "#000000",
          borderRadius: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </div>,
    document.body
  );
}
