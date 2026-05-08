export default function ThesisPage() {
  return (
    <main className="min-h-screen px-10 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: "var(--lp-text-strong)" }}>
            我的论文
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--lp-text-muted)" }}>
            管理已上传的论文
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
              <path d="M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" />
              <path d="M14 2v5a1 1 0 0 0 1 1h5" />
              <path d="M10 9H8" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
            </svg>
          </div>
          <p className="text-[15px] font-medium" style={{ color: "var(--lp-text-strong)" }}>
            功能开发中
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--lp-text-subtle)" }}>
            论文管理功能即将上线，敬请期待
          </p>
        </div>
      </div>
    </main>
  );
}
