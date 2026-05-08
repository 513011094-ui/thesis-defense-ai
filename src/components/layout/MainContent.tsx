"use client";

import { useDefenseStore } from "@/store/defenseStore";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const sidebarVisible = useDefenseStore((s) => s.sidebarVisible);

  return (
    <div
      className="min-h-screen transition-[margin] duration-300"
      style={{ marginLeft: sidebarVisible ? "280px" : "0" }}
    >
      {children}
    </div>
  );
}
