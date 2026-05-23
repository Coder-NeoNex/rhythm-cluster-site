"use client";

import { useState } from "react";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";

const utilityLinks = [
  { label: "网页语言", href: "/#language" },
  { label: "FAQ", href: "/#faq" },
  { label: "我的账户/登录", href: "/#account" },
  { label: "购物车", href: "/#cart" },
];

const mainNavItems = [
  { label: "课程", href: "/courses" },
  { label: "工具", href: "/#tools" },
  { label: "声音创作委托", href: "/#commission" },
  { label: "最近作品", href: "/#works" },
  { label: "关于我们", href: "/#about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const promoText =
    "律动簇 · Rhythm Cluster · 用心制作的声音创作学习方式 · 条理清晰、高效、轻松理解";

  return (
    <header className="sticky top-0 z-50 border-b border-black/20 bg-white text-black dark:border-white/20 dark:bg-neutral-950 dark:text-white">
      <div className="border-b border-black/15 dark:border-white/15">
        <div className="no-scrollbar mx-auto flex h-10 max-w-[1600px] items-center justify-start gap-3 overflow-x-auto px-4 sm:justify-end sm:gap-6 md:px-8">
          <Link
            href={utilityLinks[0].href}
            className="nav-link-hover shrink-0 text-[11px] font-medium text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 sm:text-xs"
          >
            {utilityLinks[0].label}
          </Link>
          <ThemeToggle variant="text" />
          {utilityLinks.slice(1).map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link-hover shrink-0 text-[11px] font-medium text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 sm:text-xs"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="border-b border-black/15 dark:border-white/15">
        <div className="promo-marquee overflow-hidden px-4 py-2 md:px-8">
          <div className="promo-marquee-track">
            <span>{promoText}</span>
            <span aria-hidden="true">{promoText}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-4 md:px-8">
        <Link
          href="/"
          className="nav-link-hover text-sm font-semibold tracking-[0.12em] text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100 md:text-xl"
        >
          律动簇Logo
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-10">
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link-hover text-base font-medium text-emerald-700 transition hover:text-emerald-900 dark:text-emerald-300 dark:hover:text-emerald-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="inline-flex items-center rounded-md border border-black/20 px-4 py-2 text-sm text-emerald-700 transition hover:border-emerald-700 hover:text-emerald-900 dark:border-white/25 dark:text-emerald-300 dark:hover:border-emerald-200 dark:hover:text-emerald-100 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="切换导航菜单"
          aria-expanded={mobileOpen}
        >
          菜单
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/15 bg-white/95 px-4 py-4 dark:border-white/15 dark:bg-neutral-950/95 md:hidden">
          <nav className="mx-auto flex max-w-[1600px] flex-col gap-2">
            {mainNavItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-2 py-2 text-sm font-medium text-emerald-700 transition hover:bg-black/5 hover:text-emerald-900 dark:text-emerald-300 dark:hover:bg-white/5 dark:hover:text-emerald-100"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-black/10 pt-3 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={utilityLinks[0].href}
                  className="text-xs text-emerald-700 dark:text-emerald-300"
                >
                  {utilityLinks[0].label}
                </Link>
                <ThemeToggle variant="text" />
                {utilityLinks.slice(1).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="text-xs text-emerald-700 dark:text-emerald-300"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
