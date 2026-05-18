"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import {
  Code, Terminal, CheckCircle, ExternalLink, Copy, ChevronRight,
  Database, Layers, ArrowLeftRight, Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/shared/Header";

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface ContractFn {
  name: string;
  sig: string;
  desc: string;
}

interface Contract {
  name: string;
  tag: string;
  status: "DEPLOYED" | "BUILDING";
  contractId: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  functions: ContractFn[];
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const CONTRACTS: Contract[] = [
  {
    name: "Audit Registry",
    tag: "contracts/audit-registry",
    status: "DEPLOYED",
    contractId: "CAQM…X7TR",
    description:
      "Core registry contract. Stores every model audit event on-chain with a tamper-proof hash. Operators call this contract to log inferences, training runs, and version upgrades.",
    icon: Database,
    accent: "violet",
    functions: [
      { name: "register_model",   sig: "register_model(operator: Address, model_id: Symbol, metadata_hash: BytesN<32>) -> u64", desc: "Register a new AI model and return its on-chain ID." },
      { name: "log_audit_event",  sig: "log_audit_event(model_id: u64, event_type: Symbol, payload_hash: BytesN<32>) -> u64",    desc: "Append an immutable audit event to a model's log." },
      { name: "get_model",        sig: "get_model(model_id: u64) -> ModelRecord",                                                desc: "Fetch the full on-chain record for a registered model." },
      { name: "total_events",     sig: "total_events(model_id: u64) -> u64",                                                     desc: "Return the total number of events logged for a model." },
    ],
  },
  {
    name: "Usage Meter",
    tag: "contracts/usage-meter",
    status: "DEPLOYED",
    contractId: "CBXZ…N2PK",
    description:
      "Tracks per-model inference counts and compute units consumed. Feeds data into the risk-scoring pipeline. Zero cost to operators — all gas is subsidised by the protocol.",
    icon: Cpu,
    accent: "sky",
    functions: [
      { name: "record_inference", sig: "record_inference(model_id: u64, caller: Address, input_hash: BytesN<32>)",   desc: "Record a single inference call against a model." },
      { name: "get_usage",        sig: "get_usage(model_id: u64, period: u32) -> UsageStats",                        desc: "Return aggregated usage stats for a given 24h period." },
      { name: "reset_period",     sig: "reset_period(model_id: u64)",                                                desc: "Roll over the usage counter to a fresh period (admin only)." },
      { name: "compute_risk",     sig: "compute_risk(model_id: u64) -> u32",                                         desc: "Derive a 0-100 risk score from current usage patterns." },
    ],
  },
  {
    name: "Attestation Router",
    tag: "contracts/attestation-router",
    status: "DEPLOYED",
    contractId: "CDWR…Q9FS",
    description:
      "Routes completed audit attestations from auditors to the registry. Handles dispute resolution, upheld challenges, and final on-chain sealing of audit records.",
    icon: ArrowLeftRight,
    accent: "emerald",
    functions: [
      { name: "file_attestation",    sig: "file_attestation(auditor: Address, model_id: u64, result: AttestResult) -> u64",   desc: "Submit a completed audit attestation for a model." },
      { name: "challenge",           sig: "challenge(challenger: Address, attestation_id: u64, evidence_hash: BytesN<32>)",   desc: "File a bias or safety challenge against an attestation." },
      { name: "resolve_challenge",   sig: "resolve_challenge(attestation_id: u64, verdict: Verdict)",                        desc: "Resolve a challenge as UPHELD or DISMISSED (arbiter only)." },
      { name: "get_attestation",     sig: "get_attestation(attestation_id: u64) -> AttestRecord",                            desc: "Fetch a full attestation record by its ID." },
    ],
  },
];

const CLI_EXAMPLE = `# Install Stellar CLI
cargo install stellar-cli --features opt

# Call audit-registry on testnet
stellar contract invoke \\
  --id CAQM...X7TR \\
  --network testnet \\
  --source alice \\
  -- register_model \\
  --operator GCXK...4F2A \\
  --model_id "gpt-audit-v2" \\
  --metadata_hash aabbcc...ff`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function accentClasses(accent: string, isDark: boolean) {
  const map: Record<string, { border: string; icon: string; badge: string }> = {
    violet:  { border: isDark ? "border-violet-500/30"  : "border-violet-300",  icon: "text-violet-400",  badge: isDark ? "bg-violet-400/10 text-violet-300 border-violet-400/30"  : "bg-violet-50 text-violet-700 border-violet-300" },
    sky:     { border: isDark ? "border-sky-500/30"     : "border-sky-300",     icon: "text-sky-400",     badge: isDark ? "bg-sky-400/10 text-sky-300 border-sky-400/30"            : "bg-sky-50 text-sky-700 border-sky-300" },
    emerald: { border: isDark ? "border-emerald-500/30" : "border-emerald-300", icon: "text-emerald-400", badge: isDark ? "bg-emerald-400/10 text-emerald-300 border-emerald-400/30" : "bg-emerald-50 text-emerald-700 border-emerald-300" },
  };
  return map[accent] ?? map["violet"];
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ContractsPage() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const [copied, setCopied] = useState(false);
  const [expandedFn, setExpandedFn] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const isDark = theme !== "light";

  function handleCopy() {
    navigator.clipboard.writeText(CLI_EXAMPLE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={cn("min-h-screen", isDark ? "bg-[#030712] text-slate-100" : "bg-slate-50 text-slate-900")}>
      <Header />
      <main style={{ paddingTop: "83px" }} className="px-6 py-12 max-w-7xl mx-auto">

        {/* ── PAGE HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Layers className="w-5 h-5 text-violet-400" />
            <span className={cn("text-xs font-mono tracking-widest uppercase", isDark ? "text-slate-500" : "text-slate-400")}>
              Soroban Testnet
            </span>
            <span className={cn("text-xs px-2 py-0.5 rounded-full border font-semibold", isDark ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400" : "bg-emerald-50 border-emerald-300 text-emerald-600")}>
              LIVE
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Smart Contracts</h1>
          <p className={cn("text-lg max-w-2xl", isDark ? "text-slate-400" : "text-slate-600")}>
            Three Soroban contracts form ModelTrace&apos;s audit infrastructure. Open source, zero fees, permanently auditable.
          </p>
        </motion.div>

        {/* ── NETWORK BADGE ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className={cn("inline-flex items-center gap-2 text-xs font-mono px-3 py-2 rounded-lg border mb-10",
            isDark ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-white border-slate-200 text-slate-500 shadow-sm")}>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Soroban Testnet · Passphrase: Test SDF Network ; September 2015 · RPC: https://soroban-testnet.stellar.org
        </motion.div>

        {/* ── CONTRACT CARDS ── */}
        <div className="grid lg:grid-cols-3 gap-6 mb-14">
          {CONTRACTS.map((contract, ci) => {
            const ac = accentClasses(contract.accent, isDark);
            return (
              <motion.div
                key={contract.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + ci * 0.1 }}
                className={cn(
                  "rounded-2xl border p-6 flex flex-col gap-5",
                  isDark ? `bg-slate-900/60 border-slate-800 hover:${ac.border} transition-colors` : "bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                )}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", isDark ? "bg-slate-800" : "bg-slate-100")}>
                      <contract.icon className={cn("w-5 h-5", ac.icon)} />
                    </div>
                    <div>
                      <h2 className="font-bold text-base">{contract.name}</h2>
                      <code className={cn("text-xs font-mono", isDark ? "text-slate-500" : "text-slate-400")}>{contract.tag}</code>
                    </div>
                  </div>
                  <span className={cn("text-xs px-2 py-1 rounded-md border font-semibold shrink-0", ac.badge)}>
                    {contract.status}
                  </span>
                </div>

                {/* Contract ID */}
                <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-xs", isDark ? "bg-slate-800 text-slate-400" : "bg-slate-50 text-slate-500 border border-slate-200")}>
                  <Code className="w-3.5 h-3.5 shrink-0" />
                  {contract.contractId}
                  <ExternalLink className="w-3 h-3 ml-auto opacity-50 hover:opacity-100 cursor-pointer transition-opacity" />
                </div>

                {/* Description */}
                <p className={cn("text-sm leading-relaxed", isDark ? "text-slate-400" : "text-slate-600")}>
                  {contract.description}
                </p>

                {/* Functions */}
                <div className="flex flex-col gap-1">
                  <div className={cn("text-xs font-semibold uppercase tracking-widest mb-1", isDark ? "text-slate-500" : "text-slate-400")}>
                    Functions
                  </div>
                  {contract.functions.map((fn) => {
                    const key = `${contract.name}::${fn.name}`;
                    const isOpen = expandedFn === key;
                    return (
                      <div key={fn.name}>
                        <button
                          onClick={() => setExpandedFn(isOpen ? null : key)}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                            isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                          )}
                        >
                          <ChevronRight className={cn("w-3 h-3 shrink-0 transition-transform", isOpen && "rotate-90", ac.icon)} />
                          <code className="text-xs font-mono font-semibold">{fn.name}</code>
                        </button>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={cn("mx-3 mb-1 p-3 rounded-lg text-xs font-mono leading-relaxed", isDark ? "bg-slate-950 text-slate-400 border border-slate-800" : "bg-slate-50 text-slate-600 border border-slate-200")}>
                              <div className={cn("mb-1.5 break-all", isDark ? "text-slate-300" : "text-slate-700")}>{fn.sig}</div>
                              <div className={cn("text-xs", isDark ? "text-slate-500" : "text-slate-400")}>{fn.desc}</div>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── TRY IT ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className={cn("rounded-2xl border overflow-hidden", isDark ? "border-slate-800" : "border-slate-200 shadow-sm")}>

          <div className={cn("flex items-center justify-between px-6 py-4 border-b", isDark ? "bg-slate-900 border-slate-800" : "bg-slate-100 border-slate-200")}>
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-violet-400" />
              <span className="font-semibold text-sm">Try it — Stellar CLI</span>
            </div>
            <button
              onClick={handleCopy}
              className={cn(
                "flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border transition-all",
                copied
                  ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
                  : isDark ? "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200" : "bg-white border-slate-300 text-slate-500 hover:text-slate-800"
              )}
            >
              {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <pre className={cn("px-6 py-5 text-xs font-mono leading-relaxed overflow-x-auto", isDark ? "bg-[#030712] text-slate-300" : "bg-white text-slate-700")}>
            {CLI_EXAMPLE}
          </pre>
        </motion.div>

        {/* ── FOOTER LINKS ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
          className="mt-10 flex flex-wrap gap-4 justify-center">
          {[
            { label: "View on GitHub",       href: "https://github.com/grantfox-org/modeltrace/tree/main/contracts" },
            { label: "Soroban Docs",          href: "https://developers.stellar.org/docs/build/smart-contracts" },
            { label: "Testnet Explorer",      href: "https://stellar.expert/explorer/testnet" },
          ].map((link) => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              className={cn("flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border transition-colors",
                isDark ? "border-slate-800 text-slate-400 hover:text-violet-400 hover:border-violet-500/40" : "border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-300")}>
              {link.label} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ))}
        </motion.div>

      </main>
    </div>
  );
}
