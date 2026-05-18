"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Users, Cpu, Activity, CheckCircle, AlertTriangle,
  Shield, GitBranch, BarChart3, ArrowRight, Zap, Clock,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/Header";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type OperatorStatus = "ACTIVE" | "REVIEW" | "SUSPENDED";

interface Operator {
  name: string;
  shortId: string;
  models: number;
  inferences: string;
  lastActive: string;
  avgRisk: number;
  riskLabel: "LOW" | "MEDIUM" | "HIGH";
  status: OperatorStatus;
  verified: boolean;
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const OPERATORS: Operator[] = [
  { name: "OpenCompute Labs",  shortId: "GCXK…4F2A", models: 14, inferences: "12.4M", lastActive: "2 min ago",  avgRisk: 18, riskLabel: "LOW",    status: "ACTIVE",    verified: true },
  { name: "BioTech AI",        shortId: "GBTZ…9E1C", models:  6, inferences: "890K",  lastActive: "17 min ago", avgRisk: 71, riskLabel: "HIGH",   status: "REVIEW",    verified: true },
  { name: "ResearchLab DAO",   shortId: "GDQR…7B3F", models: 22, inferences: "47.1M", lastActive: "4 min ago",  avgRisk: 24, riskLabel: "LOW",    status: "ACTIVE",    verified: true },
  { name: "FinEdge Capital",   shortId: "GBMN…2A9D", models:  9, inferences: "3.2M",  lastActive: "1 hr ago",   avgRisk: 54, riskLabel: "MEDIUM", status: "ACTIVE",    verified: false },
  { name: "MedInsight Corp",   shortId: "GCPL…5C8E", models:  4, inferences: "220K",  lastActive: "3 days ago", avgRisk: 67, riskLabel: "HIGH",   status: "REVIEW",    verified: true },
  { name: "AutoDeploy.io",     shortId: "GDRX…1B8C", models: 31, inferences: "104M",  lastActive: "1 min ago",  avgRisk: 11, riskLabel: "LOW",    status: "ACTIVE",    verified: true },
];

const STATS = [
  { label: "Models Registered", value: "847",   icon: Cpu,        color: "text-violet-400" },
  { label: "Active Operators",  value: "23",    icon: Users,      color: "text-sky-400" },
  { label: "Protocol Cost",     value: "$0",    icon: DollarSign, color: "text-emerald-400" },
  { label: "Uptime",            value: "99.9%", icon: Activity,   color: "text-amber-400" },
];

const BENEFITS = [
  { icon: Shield,    title: "Free Audit Trail",        desc: "Every inference, training run, and version change logged on-chain at no cost. Your evidence of compliance." },
  { icon: CheckCircle, title: "Regulatory Compliance", desc: "Meet EU AI Act Article 12 logging requirements and NIST AI RMF Measure/Manage functions out of the box." },
  { icon: AlertTriangle, title: "Bias Detection",      desc: "Third-party auditors can file bias challenges against your models. Upheld challenges trigger automatic review gates." },
  { icon: GitBranch, title: "Version History",         desc: "Full on-chain version graph for every model. Know exactly what changed, when, and who approved it." },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function statusStyles(status: OperatorStatus, isDark: boolean) {
  if (status === "ACTIVE")    return isDark ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-700";
  if (status === "REVIEW")    return isDark ? "bg-amber-400/10 border-amber-400/30 text-amber-400"       : "bg-amber-50 border-amber-300 text-amber-700";
  return                             isDark ? "bg-red-400/10 border-red-400/30 text-red-400"              : "bg-red-50 border-red-300 text-red-700";
}

function riskColor(label: "LOW" | "MEDIUM" | "HIGH"): string {
  return { LOW: "text-emerald-400", MEDIUM: "text-amber-400", HIGH: "text-red-400" }[label];
}

function riskBarColor(label: "LOW" | "MEDIUM" | "HIGH"): string {
  return { LOW: "bg-emerald-400", MEDIUM: "bg-amber-400", HIGH: "bg-red-400" }[label];
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function OperatorsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <div className={cn("min-h-screen", isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-900")}>
      <Header />
      <main style={{ paddingTop: "83px" }} className="px-6 py-12 max-w-7xl mx-auto">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-5 h-5 text-violet-400" />
            <span className={cn("text-xs font-mono tracking-widest uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
              Registered Operators
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">AI Operators</h1>
          <p className={cn("text-lg max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
            Teams and organisations running AI models through ModelTrace. Operators register models, log usage, and receive public audit records.
          </p>
        </motion.div>

        {/* ── STATS ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + i * 0.06 }}
              className={cn("rounded-xl border p-5 flex flex-col gap-2", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm")}
            >
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <div className="text-3xl font-bold font-mono">{stat.value}</div>
              <div className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-500")}>{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── OPERATOR TABLE ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={cn("rounded-2xl border overflow-hidden mb-14", isDark ? "border-slate-800" : "border-slate-200 shadow-sm")}>

          {/* Table header */}
          <div className={cn(
            "hidden lg:grid grid-cols-[1fr_100px_130px_120px_150px_100px] gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-widest",
            isDark ? "bg-slate-900 text-slate-500 border-b border-slate-800" : "bg-slate-100 text-slate-400 border-b border-slate-200"
          )}>
            <span>Operator</span>
            <span className="text-right">Models</span>
            <span className="text-right">Inferences</span>
            <span>Last Active</span>
            <span>Avg Risk Score</span>
            <span>Status</span>
          </div>

          {/* Rows */}
          {OPERATORS.map((op, i) => (
            <motion.div
              key={op.shortId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.06 }}
              className={cn(
                "grid grid-cols-1 lg:grid-cols-[1fr_100px_130px_120px_150px_100px] gap-4 px-6 py-4 items-center border-b last:border-b-0 transition-colors",
                isDark ? "border-slate-800/60 hover:bg-slate-800/30" : "border-slate-100 hover:bg-violet-50/30"
              )}
            >
              {/* Operator name */}
              <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                  isDark ? "bg-violet-500/20 text-violet-300" : "bg-violet-100 text-violet-700")}>
                  {op.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm">
                    {op.name}
                    {op.verified && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <div className={cn("font-mono text-xs", isDark ? "text-slate-600" : "text-slate-400")}>{op.shortId}</div>
                </div>
              </div>

              {/* Models */}
              <div className={cn("text-right font-mono font-bold text-sm", isDark ? "text-slate-300" : "text-slate-700")}>{op.models}</div>

              {/* Inferences */}
              <div className={cn("text-right font-mono text-sm", isDark ? "text-slate-300" : "text-slate-700")}>{op.inferences}</div>

              {/* Last active */}
              <div className={cn("flex items-center gap-1.5 text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                <Clock className="w-3.5 h-3.5 shrink-0" />
                {op.lastActive}
              </div>

              {/* Risk score bar */}
              <div className="flex items-center gap-2">
                <div className={cn("flex-1 h-1.5 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
                  <motion.div
                    className={cn("h-full rounded-full", riskBarColor(op.riskLabel))}
                    initial={{ width: 0 }}
                    animate={{ width: `${op.avgRisk}%` }}
                    transition={{ delay: 0.5 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <span className={cn("text-xs font-mono font-bold w-10 text-right", riskColor(op.riskLabel))}>
                  {op.avgRisk}
                </span>
              </div>

              {/* Status */}
              <span className={cn("inline-flex items-center text-xs px-2.5 py-1 rounded-md border font-semibold w-fit", statusStyles(op.status, isDark))}>
                {op.status}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* ── WHAT OPERATORS GET ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="mb-14">
          <h2 className="text-2xl font-bold mb-2">What operators get</h2>
          <p className={cn("mb-8 text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
            Free, forever. ModelTrace earns nothing from protocol usage — it&apos;s public infrastructure.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {BENEFITS.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.07 }}
                className={cn("rounded-xl border p-5", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm")}
              >
                <b.icon className={cn("w-5 h-5 mb-3", isDark ? "text-violet-400" : "text-violet-600")} />
                <h3 className="font-bold text-sm mb-1.5">{b.title}</h3>
                <p className={cn("text-xs leading-relaxed", isDark ? "text-slate-500" : "text-slate-500")}>{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── BECOME AN OPERATOR CTA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.75 }}
          className={cn(
            "rounded-2xl border p-10 text-center",
            isDark
              ? "bg-gradient-to-br from-violet-950/40 to-slate-900/60 border-violet-500/20"
              : "bg-gradient-to-br from-violet-50 to-white border-violet-200 shadow-sm"
          )}
        >
          <Zap className="w-8 h-8 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Become an Operator</h2>
          <p className={cn("max-w-lg mx-auto mb-8 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
            Register your AI models on Stellar Soroban in under 5 minutes. No fees, no gatekeepers — just an open protocol for responsible AI deployment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://github.com/grantfox-org/modeltrace"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-colors"
            >
              Read the docs <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/contracts"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-sm transition-colors",
                isDark ? "border-slate-700 text-slate-300 hover:border-violet-500 hover:text-violet-300" : "border-slate-300 text-slate-700 hover:border-violet-300 hover:text-violet-700"
              )}
            >
              <BarChart3 className="w-4 h-4" />
              View contracts
            </a>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
