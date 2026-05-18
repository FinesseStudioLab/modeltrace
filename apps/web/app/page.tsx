"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Brain, Eye, ShieldCheck, Zap, Globe, Activity, Users,
  ArrowRight, Wallet, Sun, Moon, Database, Lock, Cpu,
  ChevronRight, Layers, X, BarChart3, Network, Binary,
  Search, AlertTriangle, CheckCircle, Clock, GitBranch,
  Code, Fingerprint, TrendingUp, Shield, FileCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── TYPES ───────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    freighter?: {
      requestAccess: () => Promise<{ address: string } | { error: string }>;
      getNetwork: () => Promise<{ networkPassphrase: string } | { error: string }>;
    };
  }
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const AUDIT_EVENTS = [
  { id: "EVT-9847", type: "INFERENCE", model: "GPT-Audit-v2.1", hash: "0x7f3a…c91e", risk: "LOW", ts: "00:00:01" },
  { id: "EVT-9846", type: "BIAS_FLAG", model: "MedDiag-Vision-3", hash: "0x2b4f…a78d", risk: "CRITICAL", ts: "00:00:04" },
  { id: "EVT-9845", type: "VERSION", model: "LLM-70B-Base", hash: "0xc8e2…3f4a", risk: "LOW", ts: "00:00:07" },
  { id: "EVT-9844", type: "TRAINING", model: "Diffusion-XL-FT", hash: "0x5a1b…8e2c", risk: "MEDIUM", ts: "00:00:12" },
  { id: "EVT-9843", type: "INFERENCE", model: "FraudDetect-v4", hash: "0xf9d3…1b7e", risk: "LOW", ts: "00:00:15" },
  { id: "EVT-9842", type: "DATA", model: "CreditScore-AI", hash: "0x3c7a…5d9f", risk: "MEDIUM", ts: "00:00:19" },
  { id: "EVT-9841", type: "BIAS_FLAG", model: "ResumeScreen-v1", hash: "0xa4e8…2c1b", risk: "CRITICAL", ts: "00:00:23" },
  { id: "EVT-9840", type: "INFERENCE", model: "TradingBot-v3", hash: "0xd8f1…4a9e", risk: "LOW", ts: "00:00:28" },
];

const MODEL_REGISTRY = [
  { name: "GPT-Audit-v2.1", provider: "OpenCompute", score: 97, status: "VERIFIED", events: "1.2M" },
  { name: "MedDiag-Vision-3", provider: "BioTech AI", score: 71, status: "REVIEW", events: "89K" },
  { name: "LLM-70B-Base", provider: "ResearchLab", score: 94, status: "VERIFIED", events: "4.7M" },
];

const REGULATION_TICKER = [
  "EU AI Act Article 13 — Transparency obligations for high-risk AI systems",
  "NIST AI RMF — Govern, Map, Measure, Manage framework now enforceable",
  "UK AI Safety Institute — Frontier model audit requirements effective 2026",
  "US Executive Order 14110 — AI safety evaluations for critical infrastructure",
  "ISO/IEC 42001 — AI management systems certification standard published",
];

const STATS = [
  { label: "Models Audited", value: "847", icon: Brain, color: "text-violet-400" },
  { label: "Events / Day", value: "12.4M", icon: Activity, color: "text-emerald-400" },
  { label: "Bias Flags", value: "7", icon: AlertTriangle, color: "text-amber-400" },
  { label: "Avg Latency", value: "<1s", icon: Zap, color: "text-violet-300" },
];

const CONTRACTS = [
  {
    name: "Audit Registry",
    tag: "contracts/audit-registry",
    icon: Database,
    desc: "Registers AI models with immutable weight hashes, training data CIDs, and versioned provenance. Every model registration is a permanent on-chain event.",
    color: "border-violet-500/30 hover:border-violet-500/60",
  },
  {
    name: "Inference Logger",
    tag: "contracts/usage-meter",
    icon: Activity,
    desc: "Captures inference request metadata, response hashes, and latency metrics per model. Enables post-hoc audit of any output traced to its exact model state.",
    color: "border-emerald-500/30 hover:border-emerald-500/60",
  },
  {
    name: "Attestation Router",
    tag: "contracts/payment-router",
    icon: ShieldCheck,
    desc: "Coordinates audit completion attestations from validators. Manages the staking and reward mechanism for independent auditors flagging anomalies.",
    color: "border-blue-500/30 hover:border-blue-500/60",
  },
];

// ─── RISK BADGE ───────────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: string }) {
  const map: Record<string, string> = {
    LOW: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    MEDIUM: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    HIGH: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    CRITICAL: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={cn("text-[7px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border shrink-0", map[risk] ?? map.LOW)}>
      {risk}
    </span>
  );
}

// ─── EVENT TYPE BADGE ─────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: string }) {
  const map: Record<string, string> = {
    INFERENCE: "text-violet-400",
    BIAS_FLAG: "text-red-400",
    VERSION: "text-amber-400",
    TRAINING: "text-blue-400",
    DATA: "text-cyan-400",
  };
  return (
    <span className={cn("text-[7px] font-mono font-bold uppercase tracking-widest w-16 shrink-0", map[type] ?? "text-slate-400")}>
      {type === "BIAS_FLAG" ? "BIAS" : type.slice(0, 5)}
    </span>
  );
}

// ─── LIVE AUDIT FEED ──────────────────────────────────────────────────────────

function LiveAuditFeed({ isDark }: { isDark: boolean }) {
  const [events, setEvents] = useState(AUDIT_EVENTS);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setEvents(prev => {
        const next = AUDIT_EVENTS[tick % AUDIT_EVENTS.length];
        const updated = { ...next, id: `EVT-${9848 + tick}`, ts: `00:00:${String(tick * 3 % 60).padStart(2, "0")}` };
        return [updated, ...prev.slice(0, 7)];
      });
      setTick(t => t + 1);
    }, 2500);
    return () => clearInterval(id);
  }, [tick]);

  return (
    <div className={cn("rounded-xl border flex flex-col overflow-hidden h-full", isDark ? "bg-slate-950/60 border-slate-800/60" : "bg-white/80 border-slate-200")}>
      <div className={cn("flex items-center justify-between px-4 py-3 border-b shrink-0", isDark ? "border-slate-800/60" : "border-slate-200")}>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[8px] font-mono text-violet-400 tracking-[0.4em] uppercase">Live Audit Stream</span>
        </div>
        <span className="text-[7px] font-mono text-slate-600">Real-time</span>
      </div>
      <div className={cn("grid grid-cols-4 gap-2 px-4 py-2 border-b text-[6px] font-mono uppercase tracking-widest shrink-0", isDark ? "border-slate-800/40 text-slate-700" : "border-slate-200 text-slate-400")}>
        <span>ID</span><span>Type</span><span className="col-span-1 truncate">Model</span><span>Risk</span>
      </div>
      <div className="flex-1 overflow-hidden divide-y divide-slate-800/20">
        {events.map((ev, i) => (
          <motion.div
            key={ev.id + i}
            initial={i === 0 ? { opacity: 0, y: -8, backgroundColor: "rgba(124,58,237,0.12)" } : { opacity: 1 }}
            animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-4 gap-2 px-4 py-2.5 items-center"
          >
            <span className={cn("text-[8px] font-mono", isDark ? "text-slate-500" : "text-slate-400")}>{ev.id}</span>
            <TypeBadge type={ev.type} />
            <span className={cn("text-[8px] font-mono truncate", isDark ? "text-slate-300" : "text-slate-700")}>{ev.model.split("-")[0]}</span>
            <RiskBadge risk={ev.risk} />
          </motion.div>
        ))}
      </div>
      <div className={cn("px-4 py-2.5 border-t text-[7px] font-mono text-slate-700 shrink-0", isDark ? "border-slate-800/50" : "border-slate-200")}>
        {events.length} events · Stellar Mainnet
      </div>
    </div>
  );
}

// ─── MODEL RISK CARD ──────────────────────────────────────────────────────────

function ModelRiskCard({ model, isDark }: { model: typeof MODEL_REGISTRY[0]; isDark: boolean }) {
  const color = model.score >= 90 ? "text-emerald-400" : model.score >= 70 ? "text-amber-400" : "text-red-400";
  const bgColor = model.score >= 90 ? "bg-emerald-500/10" : model.score >= 70 ? "bg-amber-500/10" : "bg-red-500/10";
  const statusColor = model.status === "VERIFIED" ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className={cn("p-4 rounded-xl border transition-all group", isDark ? "bg-slate-950/50 border-slate-800/50 hover:border-violet-500/30" : "bg-white border-slate-200 hover:border-violet-300")}>
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <div className={cn("text-[10px] font-black truncate", isDark ? "text-white" : "text-slate-900")}>{model.name}</div>
          <div className={cn("text-[8px] font-mono", isDark ? "text-slate-600" : "text-slate-400")}>{model.provider}</div>
        </div>
        <span className={cn("text-[7px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ml-2 shrink-0", statusColor)}>
          {model.status}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className={cn("text-2xl font-black leading-none", color)}>{model.score}</div>
        <div className={cn("text-[7px] font-mono text-slate-600")}>{model.events} events</div>
      </div>
      <div className={cn("mt-2 h-1 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
        <div className={cn("h-full rounded-full transition-all", bgColor.replace("/10", ""))} style={{ width: `${model.score}%` }} />
      </div>
    </div>
  );
}

// ─── NEURAL BACKGROUND ───────────────────────────────────────────────────────

function NeuralBackground({ isDark }: { isDark: boolean }) {
  const nodes = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: ((i * 17 + 5) % 92) + 4,
    y: ((i * 23 + 8) % 85) + 7,
    size: i % 3 === 0 ? 4 : 2,
  }));

  const edges = [
    [0, 3], [3, 7], [7, 11], [1, 5], [5, 9], [9, 14],
    [2, 6], [6, 10], [10, 15], [4, 8], [8, 12], [12, 17],
    [0, 1], [3, 4], [7, 8], [11, 12], [5, 6], [9, 10],
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {edges.map(([a, b], i) => {
          const na = nodes[a], nb = nodes[b];
          return (
            <line key={i}
              x1={`${na.x}%`} y1={`${na.y}%`}
              x2={`${nb.x}%`} y2={`${nb.y}%`}
              stroke={isDark ? "rgba(124,58,237,0.07)" : "rgba(124,58,237,0.04)"}
              strokeWidth="1"
            />
          );
        })}
        {nodes.map(n => (
          <circle key={n.id}
            cx={`${n.x}%`} cy={`${n.y}%`} r={n.size}
            fill={isDark ? "rgba(124,58,237,0.15)" : "rgba(124,58,237,0.08)"}
          />
        ))}
      </svg>
    </div>
  );
}

// ─── WALLET MODAL ─────────────────────────────────────────────────────────────

function WalletModal({ isOpen, onClose, isDark }: { isOpen: boolean; onClose: () => void; isDark: boolean }) {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      if (!window.freighter) {
        window.open("https://freighter.app", "_blank");
        setError("Freighter not found. Install it to continue.");
        return;
      }
      const result = await window.freighter.requestAccess();
      if ("error" in result) throw new Error(result.error);
      setAddress(result.address);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Connection failed");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            className={cn("relative w-full max-w-sm rounded-2xl p-7 shadow-2xl border", isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200")}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent rounded-t-2xl" />
            <div className="flex items-center justify-between mb-7">
              <div>
                <h3 className={cn("text-xl font-black uppercase tracking-tight", isDark ? "text-white" : "text-slate-900")}>Connect Wallet</h3>
                <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] mt-1">Stellar · Mainnet Only</p>
              </div>
              <button onClick={onClose} className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", isDark ? "bg-slate-800 hover:bg-slate-700" : "bg-slate-100 hover:bg-slate-200")}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
            {error && (
              <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}
            {address ? (
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" />
                  <p className="text-[9px] text-violet-400 uppercase tracking-widest font-bold">Connected</p>
                </div>
                <p className="font-mono text-xs text-white break-all">{address}</p>
              </div>
            ) : (
              <button onClick={connect} disabled={connecting}
                className="w-full flex items-center gap-4 p-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-violet-500/30 transition-all text-left group">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
                  <Wallet className="w-5 h-5 text-violet-400" />
                </div>
                <div className="flex-1">
                  <p className="font-black text-white uppercase text-sm tracking-wide">Freighter</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">Official Stellar Extension</p>
                </div>
                {connecting
                  ? <div className="w-5 h-5 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                  : <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-violet-400 transition-colors" />}
              </button>
            )}
            <p className="text-center text-[9px] text-slate-700 mt-5 uppercase tracking-widest">Soroban · ModelTrace Protocol</p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────

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

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function ModelTracePage() {
  const [walletOpen, setWalletOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <div className={cn("min-h-screen transition-colors duration-500", isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-900")}>

      {/* Neural network background */}
      <NeuralBackground isDark={isDark} />

      {/* Subtle radial glow */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[180px] opacity-10 bg-violet-600" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] opacity-5 bg-emerald-500" />
      </div>

      <WalletModal isOpen={walletOpen} onClose={() => setWalletOpen(false)} isDark={isDark} />

      {/* ── HEADER ── */}
      <header className="fixed top-0 inset-x-0 z-50">
        {/* Top metrics strip */}
        <div className={cn("h-7 flex items-center px-6 gap-5 border-b text-[7px] font-mono uppercase tracking-[0.35em] overflow-hidden", isDark ? "bg-slate-900/95 border-slate-800" : "bg-white/95 border-slate-200")}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
            <span className="text-violet-400">847 Models Active</span>
          </div>
          <span className={isDark ? "text-slate-800" : "text-slate-300"}>·</span>
          <span className={isDark ? "text-slate-600" : "text-slate-400"}>12.4M Events Today</span>
          <span className={isDark ? "text-slate-800" : "text-slate-300"}>·</span>
          <span className="text-amber-400">7 Anomalies Flagged</span>
          <div className="ml-auto flex items-center gap-4">
            <span className={isDark ? "text-slate-700" : "text-slate-400"}>Block #9,847,512</span>
            <span className="text-violet-500">Stellar Mainnet</span>
          </div>
        </div>

        {/* Main nav */}
        <div className={cn("flex items-center h-13 border-b backdrop-blur-xl", isDark ? "bg-slate-950/90 border-slate-800/60" : "bg-white/95 border-slate-200")}>
          {/* Logo */}
          <div className={cn("flex items-center gap-3 px-6 h-full border-r", isDark ? "border-slate-800/60" : "border-slate-200")}>
            <div className="w-8 h-8 bg-violet-600 flex items-center justify-center rounded-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div className="border-l-2 border-violet-500 pl-3">
              <span className={cn("font-black text-sm uppercase tracking-[0.15em] leading-none block", isDark ? "text-white" : "text-slate-900")}>ModelTrace</span>
              <span className="text-[6px] font-mono text-violet-500/70 uppercase tracking-[0.4em]">AI Audit Protocol</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center flex-1 h-full px-2">
            {[
              { label: "Models", href: "/" },
              { label: "Audit Log", href: "/attestations" },
              { label: "Contracts", href: "/contracts" },
              { label: "Compliance", href: "/compliance" },
              { label: "Operators", href: "/operators" },
              { label: "Roadmap", href: "/roadmap" },
            ].map((n, i) => (
              <div key={n.label} className="flex items-center h-full">
                {i > 0 && <div className={cn("w-px h-4 self-center", isDark ? "bg-slate-800" : "bg-slate-200")} />}
                <a href={n.href}
                  className={cn("px-5 h-full flex items-center text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-violet-400 hover:bg-violet-500/5", isDark ? "text-slate-600" : "text-slate-500")}>
                  {n.label}
                </a>
              </div>
            ))}
          </nav>

          {/* Right */}
          <div className={cn("flex items-center gap-3 px-5 ml-auto border-l h-full", isDark ? "border-slate-800/60" : "border-slate-200")}>
            <ThemeToggle isDark={isDark} />
            <button onClick={() => setWalletOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-[11px] font-black uppercase tracking-widest hover:bg-violet-500 transition-colors">
              <Wallet className="w-3.5 h-3.5" /> Connect
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative flex flex-col min-h-screen overflow-hidden" style={{ paddingTop: "83px" }}>

        <div className="flex flex-1">

          {/* LEFT: Vertical brand label + Live audit feed */}
          <div className="hidden lg:flex shrink-0">
            <div className={cn("flex items-center justify-center w-9 border-r", isDark ? "border-slate-800/40" : "border-slate-200")}>
              <span className="text-[6px] font-black tracking-[0.6em] uppercase select-none"
                style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", color: isDark ? "rgba(124,58,237,0.2)" : "rgba(124,58,237,0.15)" }}>
                MODELTRACE
              </span>
            </div>
            <div className={cn("w-[280px] border-r flex flex-col", isDark ? "border-slate-800/40" : "border-slate-200")}>
              <LiveAuditFeed isDark={isDark} />
            </div>
          </div>

          {/* CENTER: Statement + Stats + CTAs */}
          <div className="flex-1 flex flex-col justify-center px-8 lg:px-14 py-12">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
              <p className="text-[8px] font-mono text-violet-500 tracking-[0.5em] uppercase mb-5">
                ◆ AI Accountability Protocol · Soroban Mainnet
              </p>

              <h1 className="font-black leading-[1.04] tracking-tight mb-6">
                <div className={cn("text-xl md:text-2xl font-medium mb-1", isDark ? "text-slate-500" : "text-slate-400")}>
                  847 AI models are running right now.
                </div>
                <div className={cn("text-3xl md:text-4xl lg:text-5xl", isDark ? "text-white" : "text-slate-900")}>
                  How many are actually
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-violet-500 to-emerald-400">
                  accountable?
                </div>
              </h1>

              <p className={cn("text-sm leading-[1.8] mb-8 max-w-xl", isDark ? "text-slate-400" : "text-slate-600")}>
                ModelTrace creates an immutable audit trail for every AI model version, training dataset, and inference event — on Stellar Soroban. Not optional. Not self-reported. Cryptographically sealed.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => setWalletOpen(true)}
                  className="flex items-center gap-2 px-7 py-3.5 font-black uppercase text-[11px] tracking-widest bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/25">
                  Audit a Model <ArrowRight className="w-4 h-4" />
                </button>
                <a href="/contracts"
                  className={cn("flex items-center gap-2 px-7 py-3.5 font-bold uppercase text-[11px] tracking-widest border transition-all", isDark ? "border-slate-700 text-slate-400 hover:border-violet-500/30 hover:text-white" : "border-slate-300 text-slate-600")}>
                  Protocol Docs
                </a>
              </div>

              {/* Stats grid */}
              <div className={cn("grid grid-cols-2 gap-px border", isDark ? "border-slate-800 bg-slate-800" : "border-slate-200 bg-slate-200")}>
                {STATS.map((s) => (
                  <div key={s.label} className={cn("p-5", isDark ? "bg-[#030712]" : "bg-white")}>
                    <s.icon className={cn("w-4 h-4 mb-2", s.color)} />
                    <div className={cn("text-2xl font-black leading-none mb-1", isDark ? "text-white" : "text-slate-900")}>{s.value}</div>
                    <div className="text-[7px] font-mono text-slate-600 uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT: Model Risk Monitor */}
          <div className={cn("hidden lg:flex flex-col w-[260px] border-l px-5 py-10 shrink-0 justify-center gap-3", isDark ? "border-slate-800/40" : "border-slate-200")}>
            <div className="text-[7px] font-mono text-slate-600 tracking-[0.4em] uppercase mb-1">Risk Monitor</div>
            {MODEL_REGISTRY.map((m) => (
              <ModelRiskCard key={m.name} model={m} isDark={isDark} />
            ))}
            <div className={cn("mt-2 p-3 rounded-xl border text-center", isDark ? "border-slate-800/50" : "border-slate-200")}>
              <span className="text-[8px] font-mono text-violet-500 uppercase tracking-widest">All models</span>
              <div className={cn("text-2xl font-black mt-1", isDark ? "text-white" : "text-slate-900")}>93.2</div>
              <div className="text-[7px] font-mono text-slate-600">Avg. audit score</div>
            </div>
          </div>
        </div>

        {/* Regulation ticker */}
        <div className={cn("border-t h-8 flex items-center overflow-hidden shrink-0", isDark ? "border-slate-800/50" : "border-slate-200")}>
          <motion.div className="flex items-center gap-12 whitespace-nowrap px-4"
            animate={{ x: ["0%", "-50%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }}>
            {[...REGULATION_TICKER, ...REGULATION_TICKER].map((fact, i) => (
              <span key={i} className={cn("text-[7px] font-mono tracking-widest", isDark ? "text-slate-700" : "text-slate-400")}>
                {fact} <span className="text-violet-500/30 mx-2">◆</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── WHY AI AUDIT MATTERS ── */}
      <section className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[8px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-3">The Problem</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              AI systems make decisions that affect billions.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
                None of them are required to explain themselves.
              </span>
            </h2>
          </div>
          <div className={cn("grid grid-cols-2 md:grid-cols-4 gap-px border", isDark ? "bg-slate-800/50 border-slate-800" : "bg-slate-200 border-slate-200")}>
            {[
              { value: "$13B+", label: "Annual cost of biased AI decisions in hiring, lending, healthcare", note: "Stanford HAI, 2024" },
              { value: "0%", label: "Of production AI systems have cryptographic audit trails", note: "Our research" },
              { value: "2026", label: "EU AI Act enforcement begins — unaudited high-risk models face €30M fines", note: "EUR-Lex" },
              { value: "73%", label: "Of organizations cannot trace a model output to its training data", note: "Gartner, 2025" },
            ].map((s, i) => (
              <motion.div key={s.value}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn("p-6 flex flex-col", isDark ? "bg-[#030712]" : "bg-white")}>
                <div className="text-4xl font-black text-violet-400 mb-3 leading-none">{s.value}</div>
                <p className={cn("text-xs leading-relaxed flex-1 mb-3", isDark ? "text-slate-400" : "text-slate-600")}>{s.label}</p>
                <div className="text-[7px] font-mono text-slate-700 uppercase tracking-widest">{s.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROTOCOL ARCHITECTURE ── */}
      <section id="protocol" className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[8px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-3">Architecture</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Three contracts. Every AI event — sealed forever.
            </h2>
          </div>
          <div className="relative">
            <div className={cn("absolute top-8 left-[16%] right-[16%] h-px hidden md:block bg-gradient-to-r from-violet-500/30 via-emerald-500/30 to-violet-500/30")} />
            <div className="grid md:grid-cols-3 gap-6">
              {CONTRACTS.map((c, i) => (
                <motion.div key={c.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={cn("p-6 border relative transition-all hover:shadow-xl group", isDark ? "bg-slate-900/60" : "bg-white", c.color)}>
                  <div className={cn("absolute -top-3 left-5 text-[7px] font-mono px-2 py-0.5 border", isDark ? "bg-[#030712] border-slate-800 text-slate-600" : "bg-white border-slate-200 text-slate-500")}>
                    0{i + 1}
                  </div>
                  <div className={cn("w-10 h-10 flex items-center justify-center mb-4 rounded-lg", isDark ? "bg-violet-500/10" : "bg-violet-50")}>
                    <c.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="text-[7px] font-mono text-slate-600 mb-1 tracking-wider">{c.tag}</div>
                  <h3 className={cn("text-lg font-black uppercase tracking-tight mb-2", isDark ? "text-white" : "text-slate-900")}>{c.name}</h3>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPLIANCE ── */}
      <section className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[8px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-3">Compliance</p>
            <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
              Built for the regulation that&apos;s already here.
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { reg: "EU AI Act", scope: "High-risk AI systems in hiring, credit, healthcare, law enforcement", status: "Enforced 2026", color: "border-violet-500/30" },
              { reg: "NIST AI RMF", scope: "Govern, Map, Measure, Manage — risk framework for US federal AI", status: "Active", color: "border-emerald-500/30" },
              { reg: "ISO/IEC 42001", scope: "AI management systems certification — supply chain and audit trail", status: "Published 2023", color: "border-blue-500/30" },
              { reg: "UK AI Safety Act", scope: "Frontier model mandatory evaluations before deployment", status: "Consultation 2025", color: "border-amber-500/30" },
            ].map((c, i) => (
              <motion.div key={c.reg}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn("p-5 border rounded-xl flex items-start gap-4", isDark ? "bg-slate-900/40" : "bg-white", c.color)}>
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className={cn("font-black text-sm", isDark ? "text-white" : "text-slate-900")}>{c.reg}</span>
                    <span className="text-[7px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">{c.status}</span>
                  </div>
                  <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>{c.scope}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className={cn("border-t py-20 px-6", isDark ? "border-slate-800/50" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto">
          <div className={cn("border overflow-hidden", isDark ? "border-slate-800 bg-slate-900" : "border-slate-200 bg-white")}>
            <div className="grid md:grid-cols-[1fr_auto]">
              <div className="p-10 md:p-14">
                <p className="text-[7px] font-mono text-violet-500 uppercase tracking-[0.5em] mb-4">Open Protocol</p>
                <h2 className={cn("text-3xl md:text-4xl font-black tracking-tight mb-5", isDark ? "text-white" : "text-slate-900")}>
                  The AI black box<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-emerald-400">
                    is now open.
                  </span>
                </h2>
                <p className={cn("text-sm leading-relaxed mb-8 max-w-lg", isDark ? "text-slate-400" : "text-slate-600")}>
                  ModelTrace is MIT-licensed infrastructure any AI operator, auditor, or regulator can deploy. The protocol is open-source — accountability is structural.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setWalletOpen(true)}
                    className="flex items-center gap-2 px-7 py-3.5 font-black uppercase text-[11px] tracking-widest bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20">
                    <Wallet className="w-4 h-4" /> Start Auditing
                  </button>
                  <a href="https://github.com/FinesseStudioLab/modeltrace" target="_blank" rel="noopener noreferrer"
                    className={cn("flex items-center gap-2 px-7 py-3.5 font-bold uppercase text-[11px] tracking-widest border transition-all", isDark ? "border-slate-700 text-slate-400 hover:border-violet-500/30 hover:text-white" : "border-slate-300 text-slate-600")}>
                    <GitBranch className="w-4 h-4" /> GitHub
                  </a>
                </div>
              </div>
              <div className={cn("hidden md:flex flex-col divide-y min-w-[220px] border-l", isDark ? "divide-slate-800 border-slate-800" : "divide-slate-200 border-slate-200")}>
                {[
                  { icon: Lock, label: "Immutable Records", desc: "SHA-256 weight hashes" },
                  { icon: Eye, label: "Full Traceability", desc: "Input → output chain" },
                  { icon: Shield, label: "Bias Detection", desc: "Flagged on-chain" },
                  { icon: FileCode, label: "OCDS Compatible", desc: "Machine-readable exports" },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3 px-6 py-4">
                    <div className="w-8 h-8 bg-violet-500/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                      <p className={cn("font-bold text-xs", isDark ? "text-white" : "text-slate-900")}>{f.label}</p>
                      <p className="text-[8px] text-slate-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={cn("border-t px-6 py-10", isDark ? "border-slate-800" : "border-slate-200")}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-600 flex items-center justify-center rounded-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div className="border-l-2 border-violet-500 pl-3">
              <span className={cn("font-black text-sm uppercase tracking-[0.15em]", isDark ? "text-white" : "text-slate-900")}>ModelTrace</span>
              <span className={cn("text-[7px] block font-mono uppercase tracking-[0.4em]", isDark ? "text-slate-600" : "text-slate-500")}>AI Audit Protocol</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            {["GitHub", "Docs", "Discord", "Twitter"].map(l => (
              <a key={l} href="#" className={cn("text-[10px] font-bold uppercase tracking-widest transition-colors hover:text-violet-400", isDark ? "text-slate-600" : "text-slate-500")}>{l}</a>
            ))}
          </div>
          <p className="text-[8px] font-mono text-slate-700 uppercase tracking-widest">© 2026 FinesseStudioLab · MIT License</p>
        </div>
      </footer>
    </div>
  );
}
