"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  {
    label: "学习",
    href: "#",
    children: [
      { label: "课程与作品", href: "/courses" },
      { label: "声音知识库", href: "/#sound-knowledge" },
      { label: "音频编年史", href: "/#audio-timeline" },
    ],
  },
  { label: "FAQ", href: "/#faq" },
  { label: "联系", href: "/#contact" },
  { label: "关于", href: "/#about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<string | null>(
    null
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl dark:border-neutral-800/60 dark:bg-neutral-950/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        <Link
          href="/"
          className="text-xs font-semibold tracking-[0.25em] text-gray-600 transition hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white md:text-sm"
        >
          RHYTHM CLUSTER · 律动簇
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop nav */}
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative pb-2"
                onMouseEnter={() =>
                  item.children && setActiveDropdown(item.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.children ? (
                  <span className="nav-link-hover cursor-default text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="nav-link-hover text-sm text-gray-600 hover:text-gray-900 dark:text-neutral-300 dark:hover:text-white"
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 min-w-[200px] rounded-xl border border-gray-200 bg-white/95 py-2 shadow-lg backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/95">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="nav-link-hover block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 dark:border-neutral-700 dark:text-neutral-300 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="切换导航菜单"
            aria-expanded={mobileOpen}
          >
            菜单
          </button>
        </div>
      </div>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div className="border-t border-gray-200 bg-white/95 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-950/95 md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {navItems.map((item) => (
              <div key={item.label}>
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="block w-full rounded-lg px-2 py-2 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                      onClick={() =>
                        setMobileDropdownOpen((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                    >
                      {item.label}
                    </button>
                    {mobileDropdownOpen === item.label && (
                      <div className="ml-4 flex flex-col border-l border-gray-200 py-1 dark:border-neutral-800">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="px-3 py-2 text-sm text-gray-500 transition hover:text-gray-900 dark:text-neutral-400 dark:hover:text-white"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
