import Link from "next/link";
export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-sm">
        <span>© 2025 Modeltrace Contributors · Apache-2.0</span>
        <span>Part of the <strong className="text-white/60">GrantFox</strong> ecosystem</span>
        <div className="flex gap-4">
          <a href="https://github.com/grantfox-org/modeltrace" className="hover:text-white transition-colors">GitHub</a>
          <Link href="/roadmap" className="hover:text-white transition-colors">Roadmap</Link>
        </div>
      </div>
    </footer>
  );
}
