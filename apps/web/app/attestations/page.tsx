"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Search, ShieldCheck, AlertTriangle, CheckCircle, XCircle,
  Clock, ExternalLink, FileText, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/Header";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type AttestationStatus = "VERIFIED" | "UPHELD" | "DISMISSED";
type AuditType = "Full Audit" | "Bias Challenge" | "Version Audit";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

interface Attestation {
  id: string;
  model: string;
  auditor: string;
  filed: string;
  type: AuditType;
  status: AttestationStatus;
  risk: RiskLevel;
  score: number;
  txHash: string;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const ATTESTATIONS: Attestation[] = [
  { id: "ATT-0091", model: "GPT-Audit-v2.1",    auditor: "GCXK…4F2A", filed: "2026-05-12", type: "Full Audit",     status: "VERIFIED",  risk: "LOW",      score: 97, txHash: "0x7f3a9c…c91e" },
  { id: "ATT-0090", model: "MedDiag-Vision-3",  auditor: "GBTZ…9E1C", filed: "2026-05-10", type: "Bias Challenge", status: "UPHELD",    risk: "HIGH",     score: 58, txHash: "0x2b4fa1…a78d" },
  { id: "ATT-0089", model: "ResumeScreen-v1",   auditor: "GDQR…7B3F", filed: "2026-05-09", type: "Bias Challenge", status: "UPHELD",    risk: "CRITICAL", score: 34, txHash: "0xa4e8c2…2c1b" },
  { id: "ATT-0088", model: "LLM-70B-Base",      auditor: "GCXK…4F2A", filed: "2026-05-07", type: "Version Audit",  status: "VERIFIED",  risk: "LOW",      score: 94, txHash: "0xc8e23b…3f4a" },
  { id: "ATT-0087", model: "FraudDetect-v4",    auditor: "GBMN…2A9D", filed: "2026-05-05", type: "Full Audit",     status: "VERIFIED",  risk: "MEDIUM",   score: 82, txHash: "0xf9d31e…1b7e" },
  { id: "ATT-0086", model: "CreditScore-AI",    auditor: "GCPL…5C8E", filed: "2026-05-03", type: "Full Audit",     status: "DISMISSED", risk: "MEDIUM",   score: 76, txHash: "0x3c7ab4…5d9f" },
  { id: "ATT-0085", model: "Diffusion-XL-FT",   auditor: "GBTZ…9E1C", filed: "2026-04-30", type: "Version Audit",  status: "VERIFIED",  risk: "LOW",      score: 91, txHash: "0x5a1bc7…8e2c" },
  { id: "ATT-0084", model: "TradingBot-v3",     auditor: "GDQR…7B3F", filed: "2026-04-28", type: "Full Audit",     status: "DISMISSED", risk: "HIGH",     score: 61, txHash: "0xd8f14a…4a9e" },
];

const STATS = [
  { label: "Total Attestations", value: "91",  icon: FileText,     color: "text-violet-400" },
  { label: "Verified",           value: "82",  icon: ShieldCheck,  color: "text-emerald-400" },
  { label: "Challenges Upheld",  value: "3",   icon: AlertTriangle, color: "text-amber-400" },
  { label: "Avg Review Time",    value: "38h", icon: Clock,        color: "text-sky-400" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getBadgeStyles(status: AttestationStatus, isDark: boolean) {
  if (status === "VERIFIED")  return { wrap: isDark ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-600", icon: <CheckCircle className="w-3 h-3" /> };
  if (status === "UPHELD")    return { wrap: isDark ? "bg-amber-400/10 border-amber-400/30 text-amber-400"       : "bg-amber-50 border-amber-300 text-amber-600",         icon: <AlertTriangle className="w-3 h-3" /> };
  return                             { wrap: isDark ? "bg-slate-700/30 border-slate-600/40 text-slate-400"        : "bg-slate-100 border-slate-300 text-slate-500",         icon: <XCircle className="w-3 h-3" /> };
}

function riskColor(risk: RiskLevel): string {
  return { LOW: "text-emerald-400", MEDIUM: "text-amber-400", HIGH: "text-orange-400", CRITICAL: "text-red-400" }[risk];
}

function scoreColor(score: number): string {
  if (score >= 90) return "text-emerald-400";
  if (score >= 75) return "text-amber-400";
  if (score >= 50) return "text-orange-400";
  return "text-red-400";
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function AttestationsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | AttestationStatus>("ALL");

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  const filtered = ATTESTATIONS.filter((a) => {
    const q = search.toLowerCase();
    const matchSearch = a.model.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.auditor.toLowerCase().includes(q);
    const matchFilter = filter === "ALL" || a.status === filter;
    return matchSearch && matchFilter;
  });

  const filterTabs: Array<"ALL" | AttestationStatus> = ["ALL", "VERIFIED", "UPHELD", "DISMISSED"];

  return (
    <div className={cn("min-h-screen", isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-900")}>
      <Header />
      <main style={{ paddingTop: "83px" }} className="px-6 py-12 max-w-7xl mx-auto">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-violet-400" />
            <span className={cn("text-xs font-mono tracking-widest uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
              On-chain Registry
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Attestation Registry</h1>
          <p className={cn("text-lg max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
            Every AI model audit, bias challenge, and version review — immutably recorded on Stellar Soroban.
          </p>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className={cn(
                "rounded-xl border p-5 flex flex-col gap-2",
                isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
              )}
            >
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <div className="text-3xl font-bold font-mono">{stat.value}</div>
              <div className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── CONTROLS ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className={cn("absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4", isDark ? "text-slate-500" : "text-slate-400")} />
            <input
              type="text"
              placeholder="Search model, ID, auditor…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm font-mono outline-none transition-colors",
                isDark
                  ? "bg-slate-900 border-slate-700 text-slate-200 placeholder-slate-600 focus:border-violet-500"
                  : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-violet-400"
              )}
            />
          </div>

          <div className={cn("flex gap-1 p-1 rounded-lg border", isDark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200")}>
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all",
                  filter === tab
                    ? "bg-violet-600 text-white shadow-sm"
                    : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── TABLE ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className={cn("rounded-xl border overflow-hidden", isDark ? "border-slate-800" : "border-slate-200 shadow-sm")}>
          {/* Header row */}
          <div className={cn(
            "hidden lg:grid grid-cols-[80px_1fr_120px_110px_140px_110px_80px_70px] gap-3 px-5 py-3 text-xs font-semibold uppercase tracking-widest",
            isDark ? "bg-slate-900 text-slate-500 border-b border-slate-800" : "bg-slate-100 text-slate-400 border-b border-slate-200"
          )}>
            <span>ID</span><span>Model</span><span>Auditor</span><span>Filed</span>
            <span>Type</span><span>Status</span><span>Risk</span><span className="text-right">Score</span>
          </div>

          {/* Data rows */}
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className={cn("py-16 text-center text-sm font-mono", isDark ? "text-slate-600" : "text-slate-400")}>
                No attestations match your filter.
              </motion.div>
            ) : (
              filtered.map((att, i) => {
                const badge = getBadgeStyles(att.status, isDark);
                return (
                  <motion.div
                    key={att.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ delay: i * 0.04 }}
                    className={cn(
                      "grid grid-cols-1 lg:grid-cols-[80px_1fr_120px_110px_140px_110px_80px_70px] gap-3 px-5 py-4 items-center border-b last:border-b-0 group transition-colors cursor-pointer",
                      isDark ? "border-slate-800/60 hover:bg-slate-800/30" : "border-slate-100 hover:bg-violet-50/40"
                    )}
                  >
                    <span className={cn("font-mono text-xs font-bold", isDark ? "text-violet-400" : "text-violet-600")}>{att.id}</span>

                    <div>
                      <div className="text-sm font-semibold">{att.model}</div>
                      <div className={cn("font-mono text-xs flex items-center gap-1", isDark ? "text-slate-600" : "text-slate-400")}>
                        {att.txHash}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    <span className={cn("font-mono text-xs", isDark ? "text-slate-400" : "text-slate-600")}>{att.auditor}</span>
                    <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>{att.filed}</span>

                    <span className={cn(
                      "text-xs px-2 py-1 rounded-md border font-medium w-fit",
                      isDark ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-100 border-slate-200 text-slate-600"
                    )}>
                      {att.type}
                    </span>

                    <span className={cn("inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md border font-semibold w-fit", badge.wrap)}>
                      {badge.icon}{att.status}
                    </span>

                    <span className={cn("text-xs font-mono font-bold", riskColor(att.risk))}>{att.risk}</span>
                    <span className={cn("text-sm font-mono font-bold text-right", scoreColor(att.score))}>{att.score}</span>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── FOOTER NOTE ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className={cn("mt-8 flex items-center justify-center gap-2 text-xs font-mono py-4 border rounded-lg", isDark ? "border-slate-800 text-slate-600" : "border-slate-200 text-slate-400")}>
          <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
          All attestations permanently recorded on Stellar Soroban · Network: Testnet · Block finality: ~5s
        </motion.div>

      </main>
    </div>
  );
}
