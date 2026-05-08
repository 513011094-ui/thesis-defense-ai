export default function HistoryPage() {
  return (
    <main className="min-h-screen px-10 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: "var(--lp-text-strong)" }}>
            答辩记录
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--lp-text-muted)" }}>
            查看历史答辩记录和评分报告
          </p>
        </div>
        <div
          className="glass-card flex flex-col items-center justify-center py-20"
        >
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-full text-[28px]"
            style={{ background: "var(--lp-surface-hover)", color: "var(--lp-text-subtle)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="8" height="18" x="3" y="3" rx="1" />
              <path d="M7 3v18" />
              <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
            </svg>
          </div>
          <p className="text-[15px] font-medium" style={{ color: "var(--lp-text-strong)" }}>
            功能开发中
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--lp-text-subtle)" }}>
            答辩记录功能即将上线，敬请期待
          </p>
        </div>
      </div>
    </main>
  );
}
