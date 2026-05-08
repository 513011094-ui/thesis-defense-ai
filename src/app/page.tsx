import ThesisUploadForm from "@/components/upload/ThesisUploadForm";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen px-10 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold tracking-tight" style={{ color: "var(--lp-text-strong)" }}>
            模拟答辩
          </h1>
          <p className="mt-2 text-[15px]" style={{ color: "var(--lp-text-muted)" }}>
            让AI提前折磨你一次，别在现场崩。三位AI导师模拟真实答辩场景，帮你发现论文漏洞、训练临场表达。
          </p>
        </div>
        <ThesisUploadForm />
      </div>
    </main>
  );
}
