"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  CheckCircle, Circle, Clock, ArrowRight, Github,
  Code, Cpu, FileCode, Users, Rocket, Map,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/Header";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type PhaseStatus = "DONE" | "IN PROGRESS" | "PLANNED";

interface PhaseItem {
  text: string;
  done: boolean;
}

interface Phase {
  phase: number;
  title: string;
  dateRange: string;
  status: PhaseStatus;
  summary: string;
  items: PhaseItem[];
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const PHASES: Phase[] = [
  {
    phase: 0,
    title: "Protocol Foundation",
    dateRange: "Q4 2025 – Q1 2026",
    status: "DONE",
    summary: "Core Soroban contracts, basic audit logging, and the public web app shipped.",
    items: [
      { text: "Audit Registry Soroban contract deployed to testnet", done: true },
      { text: "Usage Meter contract deployed and wired to inference events", done: true },
      { text: "Attestation Router contract with challenge/dispute logic", done: true },
      { text: "Next.js web app with live audit feed and model registry", done: true },
      { text: "Freighter wallet connect for operator identity", done: true },
      { text: "Open-source repository and contributor guidelines published", done: true },
    ],
  },
  {
    phase: 1,
    title: "Audit Tooling & SDK",
    dateRange: "Q2 2026",
    status: "IN PROGRESS",
    summary: "Developer-facing SDK, operator CLI, and automated risk scoring pipeline.",
    items: [
      { text: "TypeScript SDK for logging inferences from any AI stack",    done: true },
      { text: "Python SDK (scikit-learn / HuggingFace integration)",        done: true },
      { text: "Operator CLI: register, log, and query models from terminal", done: false },
      { text: "Automated risk score pipeline (bias indicators + usage)",    done: false },
      { text: "Webhook support: trigger alerts on CRITICAL risk events",    done: false },
      { text: "Attestation explorer with full event timeline UI",           done: false },
    ],
  },
  {
    phase: 2,
    title: "Mainnet & Compliance APIs",
    dateRange: "Q3 2026",
    status: "PLANNED",
    summary: "Mainnet launch, regulatory export tools, and third-party auditor programme.",
    items: [
      { text: "Soroban mainnet deployment with production contract IDs",  done: false },
      { text: "EU AI Act Article 12 compliance report export (PDF/JSON)", done: false },
      { text: "NIST AI RMF gap analysis dashboard",                      done: false },
      { text: "Certified auditor registry — apply to become an auditor", done: false },
      { text: "Multi-sig governance for protocol parameter upgrades",     done: false },
    ],
  },
  {
    phase: 3,
    title: "Decentralised Governance",
    dateRange: "Q4 2026",
    status: "PLANNED",
    summary: "Token-free DAO governance, community auditor incentives, and protocol treasury.",
    items: [
      { text: "On-chain governance for contract upgrades via Soroban",         done: false },
      { text: "Auditor reputation system with on-chain staking",               done: false },
      { text: "Public dashboard of aggregated AI risk trends across operators", done: false },
      { text: "API marketplace: sell audit data to compliance platforms",       done: false },
      { text: "Cross-chain bridge: mirror attestations to Ethereum EAS",        done: false },
    ],
  },
  {
    phase: 4,
    title: "AI Safety Research Layer",
    dateRange: "2027",
    status: "PLANNED",
    summary: "Deep model evaluation integrations, academic partnerships, and safety benchmarks.",
    items: [
      { text: "Integration with METR TASK benchmark suite",                    done: false },
      { text: "Automated red-teaming hooks via ModelTrace audit log",          done: false },
      { text: "Academic API for AI safety researchers to query aggregated data", done: false },
      { text: "Real-time bias monitoring with model-level fairness metrics",    done: false },
      { text: "Incident database: public record of AI failures across operators", done: false },
    ],
  },
];

const ROLES = [
  {
    icon: Code,
    title: "Rust / Soroban Engineers",
    desc: "Help extend the on-chain contracts — new event types, governance primitives, cross-chain bridges.",
    label: "good first issue",
    color: (dark: boolean) => dark ? "bg-violet-400/10 border-violet-400/30 text-violet-300" : "bg-violet-50 border-violet-300 text-violet-700",
  },
  {
    icon: Cpu,
    title: "ML Engineers",
    desc: "Build the automated risk scoring pipeline, bias detection models, and benchmark integrations.",
    label: "help wanted",
    color: (dark: boolean) => dark ? "bg-amber-400/10 border-amber-400/30 text-amber-300" : "bg-amber-50 border-amber-300 text-amber-700",
  },
  {
    icon: FileCode,
    title: "TypeScript / Next.js Devs",
    desc: "Own the web app — these 5 pages, the SDK, the operator CLI dashboard, and the compliance explorer.",
    label: "frontend",
    color: (dark: boolean) => dark ? "bg-sky-400/10 border-sky-400/30 text-sky-300" : "bg-sky-50 border-sky-300 text-sky-700",
  },
];

function statusConfig(status: PhaseStatus, isDark: boolean) {
  if (status === "DONE")        return { badge: isDark ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-700", dot: "bg-emerald-400", line: isDark ? "border-emerald-400/40" : "border-emerald-300" };
  if (status === "IN PROGRESS") return { badge: isDark ? "bg-violet-400/10 border-violet-400/30 text-violet-400"   : "bg-violet-50 border-violet-300 text-violet-700",   dot: "bg-violet-500",  line: isDark ? "border-violet-400/40"  : "border-violet-300" };
  return                               { badge: isDark ? "bg-slate-700/30 border-slate-600/40 text-slate-400"       : "bg-slate-100 border-slate-300 text-slate-500",      dot: isDark ? "bg-slate-700" : "bg-slate-300", line: isDark ? "border-slate-700" : "border-slate-200" };
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function RoadmapPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  return (
    <div className={cn("min-h-screen", isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-900")}>
      <Header />
      <main style={{ paddingTop: "83px" }} className="px-6 py-12 max-w-4xl mx-auto">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-violet-400" />
            <span className={cn("text-xs font-mono tracking-widest uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
              Protocol Roadmap
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Where we&apos;re going.</h1>
          <p className={cn("text-lg max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
            ModelTrace is built in the open. Every phase is a concrete milestone with shippable deliverables — not marketing language.
          </p>
        </motion.div>

        {/* ── TIMELINE ── */}
        <div className="relative mb-16">
          {/* Vertical spine */}
          <div className={cn("absolute left-[22px] top-3 bottom-3 w-px", isDark ? "bg-slate-800" : "bg-slate-200")} />

          <div className="flex flex-col gap-0">
            {PHASES.map((phase, i) => {
              const sc = statusConfig(phase.status, isDark);
              return (
                <motion.div
                  key={phase.phase}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.1 }}
                  className="relative pl-14 pb-12 last:pb-0"
                >
                  {/* Dot */}
                  <div className={cn(
                    "absolute left-0 top-1 w-[46px] h-[46px] rounded-full border-2 flex items-center justify-center z-10",
                    isDark ? "bg-[#030712]" : "bg-slate-50",
                    phase.status === "DONE" ? "border-emerald-400" : phase.status === "IN PROGRESS" ? "border-violet-500" : isDark ? "border-slate-700" : "border-slate-300"
                  )}>
                    <span className={cn(
                      "text-xs font-bold font-mono",
                      phase.status === "DONE" ? "text-emerald-400" : phase.status === "IN PROGRESS" ? "text-violet-400" : isDark ? "text-slate-600" : "text-slate-400"
                    )}>
                      P{phase.phase}
                    </span>
                  </div>

                  {/* Card */}
                  <div className={cn(
                    "rounded-2xl border p-6",
                    isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm",
                    phase.status === "IN PROGRESS" && (isDark ? "ring-1 ring-violet-500/30" : "ring-1 ring-violet-300")
                  )}>
                    {/* Card header */}
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h2 className="text-lg font-bold">{phase.title}</h2>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-semibold", sc.badge)}>
                            {phase.status}
                          </span>
                          {phase.status === "IN PROGRESS" && (
                            <span className="flex items-center gap-1 text-xs text-violet-400 font-mono">
                              <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                              active
                            </span>
                          )}
                        </div>
                        <div className={cn("flex items-center gap-1.5 mt-1 text-xs font-mono", isDark ? "text-slate-500" : "text-slate-400")}>
                          <Clock className="w-3 h-3" />
                          {phase.dateRange}
                        </div>
                      </div>
                      {/* Progress pill */}
                      <div className={cn("text-xs font-mono px-2.5 py-1 rounded-lg", isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")}>
                        {phase.items.filter(it => it.done).length}/{phase.items.length} done
                      </div>
                    </div>

                    <p className={cn("text-sm mb-5", isDark ? "text-slate-400" : "text-slate-600")}>{phase.summary}</p>

                    {/* Checklist */}
                    <ul className="flex flex-col gap-2.5">
                      {phase.items.map((item, j) => (
                        <motion.li
                          key={j}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 + i * 0.1 + j * 0.04 }}
                          className="flex items-start gap-2.5"
                        >
                          {item.done
                            ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            : <Circle className={cn("w-4 h-4 shrink-0 mt-0.5", isDark ? "text-slate-700" : "text-slate-300")} />
                          }
                          <span className={cn("text-sm", item.done
                            ? isDark ? "text-slate-300" : "text-slate-700"
                            : isDark ? "text-slate-500" : "text-slate-400"
                          )}>
                            {item.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── WHAT WE NEED ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mb-12">
          <h2 className="text-2xl font-bold mb-2">What we need to get there</h2>
          <p className={cn("mb-7 text-sm", isDark ? "text-slate-400" : "text-slate-600")}>
            ModelTrace is a small team. Every contribution moves the needle. Here&apos;s where to plug in.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {ROLES.map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75 + i * 0.07 }}
                className={cn("rounded-xl border p-5", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm")}
              >
                <div className="flex items-center gap-2 mb-3">
                  <role.icon className={cn("w-5 h-5", isDark ? "text-violet-400" : "text-violet-600")} />
                  <h3 className="font-bold text-sm">{role.title}</h3>
                </div>
                <p className={cn("text-xs leading-relaxed mb-3", isDark ? "text-slate-500" : "text-slate-500")}>{role.desc}</p>
                <span className={cn("inline-block text-xs px-2 py-0.5 rounded-full border font-mono", role.color(isDark))}>
                  {role.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className={cn(
            "rounded-2xl border p-10 text-center",
            isDark
              ? "bg-gradient-to-br from-violet-950/40 to-slate-900/60 border-violet-500/20"
              : "bg-gradient-to-br from-violet-50 to-white border-violet-200 shadow-sm"
          )}
        >
          <Rocket className="w-8 h-8 text-violet-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Pick up an issue</h2>
          <p className={cn("max-w-md mx-auto mb-8 text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
            Every item on this roadmap has a corresponding GitHub issue. Browse open issues, claim one with a comment, and submit a PR. All experience levels welcome.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://github.com/grantfox-org/modeltrace/issues"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-500 transition-colors"
            >
              <Github className="w-4 h-4" />
              Browse open issues <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/grantfox-org/modeltrace/blob/main/CONTRIBUTING.md"
              target="_blank" rel="noopener noreferrer"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold text-sm transition-colors",
                isDark ? "border-slate-700 text-slate-300 hover:border-violet-500 hover:text-violet-300" : "border-slate-300 text-slate-700 hover:border-violet-300 hover:text-violet-700"
              )}
            >
              <Users className="w-4 h-4" />
              Read the contributor guide
            </a>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
