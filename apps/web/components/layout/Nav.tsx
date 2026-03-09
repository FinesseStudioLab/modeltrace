'use client';
import Link from "next/link";
import { useState } from "react";

const ROUTES = ['product', 'contracts', 'operators', 'compliance', 'roadmap', 'attestations'];

export function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">Modeltrace</Link>
        <div className="hidden md:flex gap-6 text-sm text-white/70">
          {ROUTES.map((r) => (
            <Link key={r} href={`/${r}`} className="hover:text-white transition-colors capitalize">{r}</Link>
          ))}
        </div>
        <a href="https://github.com/grantfox-org/modeltrace" target="_blank" rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-all">
          GitHub ↗
        </a>
      </div>
    </nav>
  );
}
