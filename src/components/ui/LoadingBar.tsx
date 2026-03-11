"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";

export default function LoadingBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setVisible(true);
    setProgress(20);

    let interval: NodeJS.Timeout;
    
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.random() * 25;
      });
    }, 120);

    const timeout = setTimeout(() => {
      setProgress(100);
      clearInterval(interval);
      setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 100);
    }, 400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] transition-all duration-100 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
