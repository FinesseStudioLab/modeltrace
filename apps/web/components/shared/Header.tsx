"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Eye, Wallet, Sun, Moon, X, ChevronRight, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    freighter?: {
      requestAccess: () => Promise<{ address: string } | { error: string }>;
      getNetwork: () => Promise<{ networkPassphrase: string } | { error: string }>;
    };
  }
}

const NAV_LINKS = [
  { label: "Models", href: "/" },
  { label: "Audit Log", href: "/attestations" },
  { label: "Contracts", href: "/contracts" },
  { label: "Compliance", href: "/compliance" },
  { label: "Operators", href: "/operators" },
  { label: "Roadmap", href: "/roadmap" },
];

function WalletModal({ isOpen, onClose, isDark }: { isOpen: boolean; onClose: () => void; isDark: boolean }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setConnecting(true); setError(null);
    try {
      if (!window.freighter) { window.open("https://freighter.app", "_blank"); setError("Freighter not found."); return; }
      const result = await window.freighter.requestAccess();
      if ("error" in result) throw new Error(result.error);
      setAddress(result.address);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Connection failed");
    } finally { setConnecting(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
          <motion.div initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className={cn("relative w-full max-w-sm rounded-2xl p-7 shadow-2xl border", isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}>
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-t-2xl" />
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className={cn("text-lg font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>Connect Wallet</h3>
                <p className="text-[8px] text-slate-500 uppercase tracking-[0.3em] mt-0.5">Stellar · Mainnet Only</p>
              </div>
              <button onClick={onClose} className={cn("w-8 h-8 rounded-full flex items-center justify-center", isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200")}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            {error && <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-red-400 shrink-0" /><p className="text-xs text-red-300">{error}</p></div>}
            {address
              ? <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20"><div className="flex items-center gap-2 mb-2"><div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" /><p className="text-[9px] text-violet-400 uppercase tracking-widest font-bold">Connected</p></div><p className="font-mono text-xs text-white break-all">{address}</p></div>
              : <button onClick={connect} disabled={connecting} className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-violet-500/30 transition-all text-left group">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors"><Wallet className="w-5 h-5 text-violet-400" /></div>
                  <div className="flex-1"><p className="font-black text-white uppercase text-sm tracking-wide">Freighter</p><p className="text-[9px] text-slate-500 mt-0.5">Official Stellar Extension</p></div>
                  {connecting ? <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /> : <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />}
                </button>}
            <p className="text-center text-[8px] text-slate-700 mt-5 uppercase tracking-widest">ModelTrace · Soroban Protocol</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ThemeToggle({ isDark }: { isDark: boolean }) {
  const { setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-all border", isDark ? "bg-violet-500/10 border-violet-500/20 hover:bg-violet-500/20" : "bg-violet-50 border-violet-200 hover:bg-violet-100")}>
      <AnimatePresence mode="wait" initial={false}>
        {isDark
          ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><Sun className="w-4 h-4 text-violet-400" /></motion.span>
          : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Moon className="w-4 h-4 text-violet-700" /></motion.span>}
      </AnimatePresence>
    </button>
  );
}

export function Header() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <>
      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} isDark={isDark} />
      <header className="fixed top-0 inset-x-0 z-50">
        {/* Metrics strip */}
        <div className={cn("h-7 flex items-center px-6 gap-5 border-b text-[7px] font-mono uppercase tracking-[0.35em] overflow-hidden", isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200")}>
          <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" /><span className="text-violet-400">847 Models Active</span></div>
          <span className={isDark ? "text-slate-800" : "text-slate-300"}>·</span>
          <span className={isDark ? "text-slate-600" : "text-slate-400"}>12.4M Events Today</span>
          <span className={isDark ? "text-slate-800" : "text-slate-300"}>·</span>
          <span className="text-amber-400">7 Anomalies Flagged</span>
          <div className="ml-auto flex items-center gap-4">
            <span className={isDark ? "text-slate-700" : "text-slate-400"}>Block #9,847,512</span>
            <span className="text-violet-500">Stellar Mainnet</span>
          </div>
        </div>
        {/* Nav */}
        <div className={cn("flex items-center border-b backdrop-blur-xl", isDark ? "bg-slate-950/90 border-slate-800/60 h-13" : "bg-white/95 border-slate-200 h-13")}>
          <a href="/" className={cn("flex items-center gap-3 px-6 h-full border-r shrink-0", isDark ? "border-slate-800/60" : "border-slate-200")}>
            <div className="w-8 h-8 bg-violet-600 flex items-center justify-center rounded-lg"><Eye className="w-4 h-4 text-white" /></div>
            <div className="border-l-2 border-violet-500 pl-3">
              <span className={cn("font-black text-sm uppercase tracking-[0.15em] leading-none block", isDark ? "text-white" : "text-slate-900")}>ModelTrace</span>
              <span className="text-[6px] font-mono text-violet-500/70 uppercase tracking-[0.4em]">AI Audit Protocol</span>
            </div>
          </a>
          <nav className="hidden md:flex items-center flex-1 h-full px-2">
            {NAV_LINKS.map((n, i) => (
              <div key={n.label} className="flex items-center h-full">
                {i > 0 && <div className={cn("w-px h-4 self-center", isDark ? "bg-slate-800" : "bg-slate-200")} />}
                <a href={n.href} className={cn("px-5 h-full flex items-center text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-violet-400 hover:bg-violet-500/5", isDark ? "text-slate-600" : "text-slate-500")}>{n.label}</a>
              </div>
            ))}
          </nav>
          <div className={cn("flex items-center gap-3 px-5 ml-auto border-l h-full", isDark ? "border-slate-800/60" : "border-slate-200")}>
            <ThemeToggle isDark={isDark} />
            <button onClick={() => setWalletOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-violet-500 transition-colors">
              <Wallet className="w-3.5 h-3.5" /> Connect
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
