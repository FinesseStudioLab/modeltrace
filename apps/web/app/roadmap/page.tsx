export const metadata = {
  title: "Roadmap",
  description: "Modeltrace Roadmap — explore the roadmap section.",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pt-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <span className="text-xs font-mono text-white/40 uppercase tracking-widest">/roadmap</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Roadmap</h1>
          <p className="text-white/60 text-lg max-w-2xl">
            This section is under active development. Check the
            {" "}<a href="https://github.com/grantfox-org/modeltrace/issues" className="text-blue-400 underline">open issues</a>{" "}
            to contribute.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mt-12">
          {[1,2,3,4].map(i => (
            <div key={i} className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-3 w-3/4" />
              <div className="h-3 bg-white/10 rounded mb-2 w-full" />
              <div className="h-3 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
        <div className="mt-16 p-8 rounded-2xl bg-white/[0.03] border border-white/10 text-center">
          <p className="text-2xl font-bold mb-3">Want to build this page?</p>
          <p className="text-white/50 mb-6">Pick up an issue and submit a PR. All levels welcome.</p>
          <a href="https://github.com/grantfox-org/modeltrace/issues?q=label%3Afrontend"
            target="_blank" rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-xl bg-white text-black font-semibold hover:scale-105 transition-transform">
            Browse Frontend Issues
          </a>
        </div>
      </div>
    </main>
  );
}
