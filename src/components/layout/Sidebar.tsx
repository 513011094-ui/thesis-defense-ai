"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDefenseStore } from "@/store/defenseStore";

const NAV_ITEMS = [
  {
    label: "模拟答辩",
    href: "/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
      </svg>
    ),
  },
  {
    label: "答辩记录",
    href: "/history",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="8" height="18" x="3" y="3" rx="1" />
        <path d="M7 3v18" />
        <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
      </svg>
    ),
  },
  {
    label: "我的论文",
    href: "/thesis",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
        <path d="M14 2v5a1 1 0 0 0 1 1h5" />
        <path d="M10 9H8" />
        <path d="M16 13H8" />
        <path d="M16 17H8" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarVisible = useDefenseStore((s) => s.sidebarVisible);

  if (!sidebarVisible) return null;

  return (
    <aside
      className="glass fixed left-5 top-5 z-30 flex h-[calc(100vh-40px)] w-[240px] flex-shrink-0 flex-col rounded-[20px]"
    >
      <div className="flex items-center justify-start px-5 pt-5 pb-6">
        <span className="text-[18px] font-bold tracking-tight" style={{ color: "var(--lp-text-strong)" }}>
          一坨答辩
        </span>
      </div>

      <nav className="flex flex-shrink-0 flex-col gap-2 px-5">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-8 w-full items-center gap-3 rounded-lg pl-1 pr-3 text-left text-[14px] font-medium leading-none transition-colors ${
                isActive
                  ? "text-[var(--lp-text-strong)] bg-[var(--lp-surface-active)]"
                  : "text-[var(--lp-text-strong)] hover:bg-[var(--lp-surface-hover)]"
              }`}
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center text-[var(--lp-text-strong)]">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto px-5 pb-5">
        <div className="relative">
          <div className="flex w-full items-center gap-2">
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
            >
              答
            </div>
            <span className="truncate text-[14px]" style={{ color: "var(--lp-text-strong)" }}>
              免费版
            </span>
            <span
              className="ml-auto inline-flex flex-shrink-0 items-center rounded-md px-2.5 py-1.5 text-[12px] font-normal leading-none"
              style={{
                border: "1px solid var(--lp-border-subtle)",
                background: "#fff",
                color: "var(--lp-text-muted)",
              }}
            >
              免费使用
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
