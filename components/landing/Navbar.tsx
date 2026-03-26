"use client";

import { useState } from "react";
import { RxArrowTopLeft } from "react-icons/rx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ActionButton from "./ActionButton";

const links = [
  { name: "الرئيسية", href: "/" },
  { name: "من نحن", href: "/about" },
  { name: "الخدمات", href: "/services" },
  { name: "القضايا", href: "/cases" },
  { name: "تواصل", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const activeIndex = links.findIndex((link) => link.href === pathname);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentIndex =
    hoveredIndex !== null
      ? hoveredIndex
      : activeIndex >= 0
        ? 4 - activeIndex
        : null;

  return (
    <header
      className="absolute top-0 left-0 right-0 w-full px-6 pt-6 z-10"
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
          className="flex items-center bg-amber-600 text-sm font-bold text-primary relative"
          dir="rtl"
        >
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`w-23 text-center py-2 transition hidden md:block relative z-10 ${
                  isActive ? "text-foreground" : "hover:text-foreground"
                }`}
                onMouseEnter={() => setHoveredIndex(4 - index)}
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
              width: "92px",
              transform: `translateX(${currentIndex !== null ? currentIndex * 92 : 0}px)`,
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
