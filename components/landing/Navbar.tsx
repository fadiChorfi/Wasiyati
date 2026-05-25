"use client";

import { useState, useEffect } from "react";
import {
  RxArrowTopLeft,
  RxHamburgerMenu,
  RxCross2,
  RxLink2,
} from "react-icons/rx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ActionButton from "./ActionButton";
import Image from "next/image";

const links = [
  { name: "الرئيسية", href: "/" },
  { name: "حول المنصة", href: "/#about" },
  { name: "عن الوصية", href: "/#about-will" },
  { name: "الخدمات", href: "/#services" },
  { name: "تواصل معنا", href: "/#contact" },
];

const USEFUL_LINKS_HREF = "/useful-links";

export default function Navbar() {
  const pathname = usePathname();
  const activeIndex = links.findIndex((link) => link.href === pathname);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const isUsefulLinksActive = pathname === USEFUL_LINKS_HREF;

  return (
    <header
      className={`absolute top-0 left-0 right-0 w-full px-6 pt-6 z-10 transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      }`}
      dir="ltr"
    >
      <div className="flex items-center justify-between rounded-full bg-white px-2.5 py-2.5 shadow-sm mx-auto max-w-6xl relative z-50 transition-all duration-300">
        {/* Left side: CTA + mobile hamburger */}
        <div className="flex items-center gap-2">
          <Link href="/consultation">
            <ActionButton
              label="احصل على استشارة"
              variant="primary"
              className="text-base font-bold hidden md:inline-flex text-white"
              icon={<RxArrowTopLeft />}
            />
          </Link>

          <button
            className="md:hidden flex items-center justify-center p-2.5 rounded-full bg-black/5 text-foreground hover:bg-black/10 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <RxCross2 className="text-xl" />
            ) : (
              <RxHamburgerMenu className="text-xl" />
            )}
          </button>
        </div>
        <div className="flex flex-row-reverse">
          <span className="hidden md:block w-px h-5 bg-black/10 mx-2" />

          {/* Useful links — visually distinct: icon + muted label, signals "external-ish" */}
          <Link
            href={USEFUL_LINKS_HREF}
            className={`hidden md:flex items-center gap-1.5 text-xs font-semibold  rounded-full transition-colors whitespace-nowrap ${
              isUsefulLinksActive
                ? "bg-primary/10 text-primary"
                : "text-foreground/50 hover:text-foreground hover:bg-black/5"
            }`}
          >
            <RxLink2 className="text-sm shrink-0" />
            روابط مفيدة
          </Link>
        </div>
        {/* Center: anchor pill nav */}
        <nav
          className="flex items-center text-sm font-bold text-primary relative"
          dir="rtl"
        >
          {links.map((link, index) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`w-32 text-center py-2 transition hidden md:block relative z-10 ${
                  isActive ? "text-foreground" : "hover:text-foreground"
                }`}
                onMouseEnter={() => setHoveredIndex(links.length - 1 - index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {link.name}
              </Link>
            );
          })}

          {/* Sliding hover highlight */}
          <div
            className="absolute h-9 rounded-full bg-black/5 transition-all duration-300 ease-out hidden md:block"
            style={{
              opacity: currentIndex !== null ? 1 : 0,
              width: "128px",
              transform: `translateX(${currentIndex !== null ? currentIndex * 128 : 0}px)`,
              left: 0,
              top: "50%",
              marginTop: "-18px",
            }}
          />
        </nav>

        {/* Right side: logo + "روابط مفيدة" as a quiet secondary link */}
        <div
          className="flex items-center gap-1 px-3 py-1 mr-1 z-50 relative"
          dir="rtl"
        >
          <Link href="/" className=" ">
            {/* <h2 className="text-2xl font-bold text-foreground cursor-pointer">
              وصيتي
            </h2> */}
            <Image
              src="/logo.png"
              alt="وصيتي"
              width={120}
              height={10}
              className="object-contain"
            />
          </Link>
          {/* Divider */}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`absolute top-24 left-6 right-6 bg-white border border-black/5 rounded-3xl p-4 shadow-xl md:hidden flex flex-col gap-2 z-40 transition-all duration-300 origin-top overflow-hidden ${
          isMobileMenuOpen
            ? "opacity-100 scale-y-100 pointer-events-auto"
            : "opacity-0 scale-y-95 pointer-events-none"
        }`}
        dir="rtl"
      >
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`px-4 py-3.5 rounded-2xl text-sm font-bold transition-colors ${
                isActive
                  ? "bg-primary/5 text-primary"
                  : "text-foreground hover:bg-black/5"
              }`}
            >
              {link.name}
            </Link>
          );
        })}

        {/* روابط مفيدة in mobile — separated by a divider to preserve its distinction */}
        <div className="pt-3 border-t border-black/5">
          <Link
            href={USEFUL_LINKS_HREF}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-2 px-4 py-3.5 rounded-2xl text-sm font-bold transition-colors ${
              isUsefulLinksActive
                ? "bg-primary/5 text-primary"
                : "text-foreground/60 hover:bg-black/5 hover:text-foreground"
            }`}
          >
            <RxLink2 className="text-base shrink-0" />
            روابط مفيدة
          </Link>
        </div>

        <div className="mt-2 pt-4 border-t border-black/5">
          <Link
            href="/consultation"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex w-full items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-2xl text-sm font-bold shadow-sm active:scale-95 transition-transform"
          >
            احصل على استشارة
            <RxArrowTopLeft className="text-lg" />
          </Link>
        </div>
      </div>
    </header>
  );
}
