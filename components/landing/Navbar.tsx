"use client";

import { useState, useEffect } from "react";
import { RxArrowTopLeft } from "react-icons/rx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ActionButton from "./ActionButton";

const links = [
  { name: "الرئيسية", href: "#hero" },
  { name: "حول المنصة", href: "#about" },
  { name: "عن الوصية", href: "#about-will" },
  { name: "الخدمات", href: "#services" },
  { name: "تواصل معنا", href: "#contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const activeIndex = links.findIndex((link) => link.href === pathname);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNav(false);
      } else {
        setShowNav(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const currentIndex =
    hoveredIndex !== null
      ? hoveredIndex
      : activeIndex >= 0
        ? links.length - 1 - activeIndex
        : null;

  return (
    <header
      className={`absolute top-0 left-0 right-0 w-full px-6 pt-6 z-10 transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      }`}
      dir="ltr"
    >
      <div className="flex items-center justify-between rounded-full bg-white px-2.5 py-2.5 shadow-sm mx-auto max-w-6xl">
        <ActionButton
          label="احصل على استشارة"
          variant="primary"
          className="  text-base font-bold hidden md:inline-flex   text-white"
          icon={<RxArrowTopLeft />}
        />
        <nav
          className="flex items-center  text-sm font-bold text-primary relative"
          dir="rtl"
        >
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`w-28 text-center py-2 transition hidden md:block relative z-10 ${
                  isActive ? "text-foreground" : "hover:text-foreground"
                }`}
                onMouseEnter={() => setHoveredIndex(links.length - 1 - index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {link.name}
              </Link>
            );
          })}
          {/* Hover highlight background */}
          <div
            className="absolute h-9 rounded-full bg-black/5 transition-all duration-300 ease-out hidden md:block"
            style={{
              opacity: currentIndex !== null ? 1 : 0,
              width: "112px",
              transform: `translateX(${currentIndex !== null ? currentIndex * 112 : 0}px)`,
              left: 0,
              top: "50%",
              marginTop: "-18px",
            }}
          />
        </nav>
        <div className=" px-3 py-1 mr-2.5">
          <h2 className="text-2xl font-bold text-foreground">وصيتي</h2>
        </div>
      </div>
    </header>
  );
}
