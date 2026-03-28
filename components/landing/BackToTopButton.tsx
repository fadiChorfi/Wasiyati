"use client";

import { useState, useEffect } from "react";
import { RxArrowUp } from "react-icons/rx";

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-8 right-8 z-50 p-3.5 rounded-2xl shadow-xl transition-all duration-300
        bg-[#19714f]/10 backdrop-blur-md border border-[#19714f]/30
        hover:bg-[#19714f] hover:text-white group animate-in fade-in slide-in-from-bottom-5
      `}
      aria-label="العودة للأعلى"
    >
      <div className="relative w-6 h-6 flex items-center justify-center">
        {/* Animated dot icon background inside matching the action button ui */}

        <RxArrowUp
          className="text-xl text-[#06281e] group-hover:text-white transition-colors"
          strokeWidth={1}
        />
      </div>
    </button>
  );
}
