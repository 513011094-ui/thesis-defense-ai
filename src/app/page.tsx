import ThesisUploadForm from "@/components/upload/ThesisUploadForm";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm text-gray-500 mb-6 border border-gray-200/60">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            AI答辩系统 v1.0
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            一坨答辩
          </h1>
          <p className="text-xl text-gray-500 mb-2">
            上传论文，提前经历一次真实答辩
          </p>
          <p className="text-sm text-gray-400">
            三位AI导师模拟真实答辩场景，帮你发现论文漏洞、训练临场表达
          </p>
        </div>
        <ThesisUploadForm />
      </div>
    </main>
  );
}
