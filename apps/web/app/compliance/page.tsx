"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import {
  ShieldCheck, AlertTriangle, CheckCircle, ChevronDown,
  Globe, FileText, BookOpen, Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/Header";

// ─── DATA ────────────────────────────────────────────────────────────────────

interface Framework {
  name: string;
  shortName: string;
  icon: React.ElementType;
  region: string;
  effective: string;
  requirementSummary: string;
  modelTraceCoverage: string;
  status: "COVERED" | "PARTIAL" | "IN PROGRESS";
  coveragePct: number;
}

const FRAMEWORKS: Framework[] = [
  {
    name: "EU AI Act",
    shortName: "EU AIA",
    icon: Globe,
    region: "European Union",
    effective: "Aug 2026 (high-risk)",
    requirementSummary:
      "High-risk AI systems must maintain technical documentation, keep detailed logs, enable human oversight, and undergo third-party conformity assessment before deployment.",
    modelTraceCoverage:
      "ModelTrace provides immutable audit logs, model metadata storage, bias-challenge records, and version history — satisfying Articles 12, 13, 17, and 61 of the Act.",
    status: "COVERED",
    coveragePct: 91,
  },
  {
    name: "NIST AI Risk Management Framework",
    shortName: "NIST AI RMF",
    icon: BookOpen,
    region: "United States",
    effective: "Jan 2023 (voluntary)",
    requirementSummary:
      "Four core functions — Govern, Map, Measure, Manage — require organisations to document AI risks, establish accountability structures, and continuously monitor deployed models.",
    modelTraceCoverage:
      "ModelTrace's operator registry, risk scoring, inference metering, and attestation system map directly to the Measure and Manage functions. Governance tooling is planned in Phase 2.",
    status: "PARTIAL",
    coveragePct: 74,
  },
  {
    name: "ISO/IEC 42001",
    shortName: "ISO 42001",
    icon: FileText,
    region: "International",
    effective: "Dec 2023",
    requirementSummary:
      "Establishes requirements for an AI Management System (AIMS). Organisations must define AI policies, assess risks, implement controls, and perform internal audits of AI systems.",
    modelTraceCoverage:
      "Audit trail and attestation registry satisfy Clause 8 (Operation) and Clause 9 (Performance Evaluation). Policy documentation and supplier controls require additional tooling.",
    status: "PARTIAL",
    coveragePct: 68,
  },
  {
    name: "UK AI Safety Act (draft)",
    shortName: "UK AI Safety",
    icon: Scale,
    region: "United Kingdom",
    effective: "2025–2026 (draft)",
    requirementSummary:
      "Frontier and high-impact models must be registered, safety-evaluated, and subject to mandatory incident reporting. A designated operator must hold accountability.",
    modelTraceCoverage:
      "Operator registration and model registry satisfy the accountability requirement. Safety evaluations and incident reporting hooks are targeted in Phase 1 milestones.",
    status: "IN PROGRESS",
    coveragePct: 55,
  },
];

const COVERAGE_BREAKDOWN = [
  { label: "Audit Logging",        pct: 100, color: "bg-emerald-400" },
  { label: "Model Registration",   pct: 100, color: "bg-emerald-400" },
  { label: "Bias Detection",       pct: 85,  color: "bg-emerald-400" },
  { label: "Version Tracking",     pct: 90,  color: "bg-emerald-400" },
  { label: "Risk Scoring",         pct: 78,  color: "bg-amber-400" },
  { label: "Incident Reporting",   pct: 30,  color: "bg-amber-400" },
  { label: "Policy Documentation", pct: 20,  color: "bg-red-400" },
];

const FAQS = [
  {
    q: "Does my company need to audit AI models right now?",
    a: "If you deploy AI in the EU for high-risk use cases (hiring, credit, medical, law enforcement), the EU AI Act Article 12 logging requirements apply from August 2026. Under NIST AI RMF, auditing is currently voluntary in the US but increasingly required by enterprise procurement and insurance.",
  },
  {
    q: "How does ModelTrace create an audit trail?",
    a: "Every model registration, inference call, training event, and version update is hashed and stored immutably on Stellar Soroban. The hash acts as a cryptographic receipt. Auditors can verify any event by comparing hashes — no central authority required.",
  },
  {
    q: "Is ModelTrace itself compliant with the EU AI Act?",
    a: "ModelTrace is infrastructure, not a deployed AI system, so it is not directly regulated as a high-risk AI. However, it is designed to help the AI systems that run on it achieve compliance. We are pursuing ISO 42001 certification for the protocol itself in 2026.",
  },
];

function statusBadge(status: Framework["status"], isDark: boolean) {
  if (status === "COVERED")     return isDark ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-700";
  if (status === "PARTIAL")     return isDark ? "bg-amber-400/10 border-amber-400/30 text-amber-400"       : "bg-amber-50 border-amber-300 text-amber-700";
  return                               isDark ? "bg-sky-400/10 border-sky-400/30 text-sky-400"              : "bg-sky-50 border-sky-300 text-sky-700";
}

function statusIcon(status: Framework["status"]) {
  if (status === "COVERED")  return <CheckCircle className="w-3.5 h-3.5" />;
  if (status === "PARTIAL")  return <AlertTriangle className="w-3.5 h-3.5" />;
  return                            <ShieldCheck className="w-3.5 h-3.5" />;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function CompliancePage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  const overallScore = Math.round(FRAMEWORKS.reduce((acc, f) => acc + f.coveragePct, 0) / FRAMEWORKS.length);

  return (
    <div className={cn("min-h-screen", isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-900")}>
      <Header />
      <main style={{ paddingTop: "83px" }} className="px-6 py-12 max-w-7xl mx-auto">

        {/* ── HERO ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-14 text-center max-w-3xl mx-auto">
          <div className={cn("inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest mb-4 px-3 py-1.5 rounded-full border",
            isDark ? "border-slate-700 text-slate-500" : "border-slate-200 text-slate-400")}>
            <Scale className="w-3.5 h-3.5 text-violet-400" />
            Regulatory Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">
            AI regulation is here.<br />
            <span className="text-violet-400">ModelTrace is ready.</span>
          </h1>
          <p className={cn("text-lg", isDark ? "text-slate-400" : "text-slate-600")}>
            We track every major AI governance framework and map ModelTrace features directly to their requirements — so your team can ship with confidence.
          </p>
        </motion.div>

        {/* ── COMPLIANCE MATRIX ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-14">
          <h2 className="text-xl font-bold mb-6">Compliance Matrix</h2>
          <div className="flex flex-col gap-4">
            {FRAMEWORKS.map((fw, i) => (
              <motion.div
                key={fw.name}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                className={cn("rounded-2xl border p-6", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm")}
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-5">
                  {/* Left: framework info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <div className={cn("p-1.5 rounded-lg", isDark ? "bg-slate-800" : "bg-slate-100")}>
                        <fw.icon className="w-4 h-4 text-violet-400" />
                      </div>
                      <h3 className="font-bold text-base">{fw.name}</h3>
                      <span className={cn("text-xs px-2 py-0.5 rounded-md border font-semibold flex items-center gap-1", statusBadge(fw.status, isDark))}>
                        {statusIcon(fw.status)} {fw.status}
                      </span>
                    </div>
                    <div className={cn("flex gap-4 text-xs mb-3 font-mono", isDark ? "text-slate-500" : "text-slate-400")}>
                      <span>{fw.region}</span>
                      <span>·</span>
                      <span>Effective: {fw.effective}</span>
                    </div>
                    <p className={cn("text-sm mb-3 leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                      <span className="font-semibold">Requirement: </span>{fw.requirementSummary}
                    </p>
                    <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-300" : "text-slate-700")}>
                      <span className="font-semibold text-violet-400">Coverage: </span>{fw.modelTraceCoverage}
                    </p>
                  </div>

                  {/* Right: coverage meter */}
                  <div className={cn("lg:w-36 flex flex-col items-center justify-center rounded-xl p-4 shrink-0", isDark ? "bg-slate-800" : "bg-slate-50 border border-slate-200")}>
                    <div className={cn("text-4xl font-bold font-mono mb-1",
                      fw.coveragePct >= 85 ? "text-emerald-400" : fw.coveragePct >= 65 ? "text-amber-400" : "text-orange-400")}>
                      {fw.coveragePct}%
                    </div>
                    <div className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Coverage</div>
                    <div className={cn("w-full mt-3 h-1.5 rounded-full overflow-hidden", isDark ? "bg-slate-700" : "bg-slate-200")}>
                      <motion.div
                        className={cn("h-full rounded-full", fw.coveragePct >= 85 ? "bg-emerald-400" : fw.coveragePct >= 65 ? "bg-amber-400" : "bg-orange-400")}
                        initial={{ width: 0 }}
                        animate={{ width: `${fw.coveragePct}%` }}
                        transition={{ delay: 0.4 + i * 0.08, duration: 0.6, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── COVERAGE SCORE ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mb-14">
          <div className={cn("rounded-2xl border p-8", isDark ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm")}>
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              {/* Score */}
              <div className="flex flex-col items-center justify-center lg:w-48 shrink-0">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke={isDark ? "#1e293b" : "#e2e8f0"} strokeWidth="10" />
                    <motion.circle
                      cx="60" cy="60" r="50" fill="none"
                      stroke="#7c3aed" strokeWidth="10" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 50}`}
                      strokeDashoffset={`${2 * Math.PI * 50 * (1 - overallScore / 100)}`}
                      initial={{ strokeDashoffset: `${2 * Math.PI * 50}` }}
                      animate={{ strokeDashoffset: `${2 * Math.PI * 50 * (1 - overallScore / 100)}` }}
                      transition={{ delay: 0.6, duration: 1, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-mono text-violet-400">{overallScore}%</span>
                    <span className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Overall</span>
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <div className="font-bold text-sm">Coverage Score</div>
                  <div className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>Across 4 frameworks</div>
                </div>
              </div>

              {/* Breakdown bars */}
              <div className="flex-1">
                <h2 className="text-lg font-bold mb-5">Feature Coverage Breakdown</h2>
                <div className="flex flex-col gap-3">
                  {COVERAGE_BREAKDOWN.map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className={cn("text-xs font-mono w-44 shrink-0", isDark ? "text-slate-400" : "text-slate-600")}>{item.label}</div>
                      <div className={cn("flex-1 h-2 rounded-full overflow-hidden", isDark ? "bg-slate-800" : "bg-slate-100")}>
                        <motion.div
                          className={cn("h-full rounded-full", item.color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.pct}%` }}
                          transition={{ delay: 0.65 + idx * 0.06, duration: 0.5, ease: "easeOut" }}
                        />
                      </div>
                      <span className={cn("text-xs font-mono w-10 text-right font-bold",
                        item.pct === 100 ? "text-emerald-400" : item.pct >= 60 ? "text-amber-400" : "text-red-400")}>
                        {item.pct}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── FAQ ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h2 className="text-xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 + i * 0.07 }}
                className={cn("rounded-xl border overflow-hidden", isDark ? "border-slate-800" : "border-slate-200")}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className={cn(
                    "w-full flex items-center justify-between gap-4 px-6 py-4 text-left transition-colors",
                    isDark ? "bg-slate-900/60 hover:bg-slate-800/60" : "bg-white hover:bg-slate-50"
                  )}
                >
                  <span className="font-semibold text-sm">{faq.q}</span>
                  <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", openFaq === i && "rotate-180", isDark ? "text-slate-500" : "text-slate-400")} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className={cn("px-6 py-5 text-sm leading-relaxed border-t",
                        isDark ? "bg-slate-900/30 border-slate-800 text-slate-400" : "bg-slate-50 border-slate-100 text-slate-600")}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </main>
    </div>
  );
}
