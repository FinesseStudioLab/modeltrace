"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { 
  Fingerprint, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Activity, 
  Users, 
  ArrowRight,
  Wallet,
  Sun,
  Moon,
  Database,
  Lock,
  Cpu,
  ChevronRight,
  Layers,
  X,
  Sparkles,
  BarChart3,
  Network, Share2, Sparkles,
  Share2,
  Binary,
  Microchip,
  Search
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Background } from "@/components/background";

// --- UI PRIMITIVES ---

const Button = ({ className, variant = "primary", size = "md", children, ...props }: any) => {
  const variants = {
    primary: "bg-lime-600 text-black hover:bg-lime-500 shadow-lg shadow-lime-600/20",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
    outline: "border-2 border-lime-600/20 bg-transparent hover:bg-lime-600/5 text-lime-600",
    ghost: "hover:bg-accent text-muted-foreground hover:text-foreground",
    glass: "bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 text-white"
  };
  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-10 py-5 text-lg",
    icon: "p-3"
  };

  return (
    <button className={cn("rounded-2xl font-black uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50", variants[variant as keyof typeof variants], sizes[size as keyof typeof sizes], className)} {...props}>
      {children}
    </button>
  );
};

const Card = ({ className, children }: any) => (
  <div className={cn("rounded-[2.5rem] border border-border bg-card p-8 transition-all hover:shadow-2xl hover:border-lime-600/20 group relative overflow-hidden", className)}>
    {children}
  </div>
);

// --- COMPONENTS ---

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-12 h-12" />;

  return (
    <Button variant="secondary" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="rounded-xl border-none bg-accent/50 hover:bg-accent">
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div key="sun" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
            <Sun className="w-5 h-5 text-lime-400" />
          </motion.div>
        ) : (
          <motion.div key="moon" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }}>
            <Moon className="w-5 h-5 text-blue-600" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  );
};

const WalletModal = ({ isOpen, onClose }: any) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200]" />
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 w-full max-w-md z-[201] p-6">
          <div className="bg-card border border-border rounded-[3rem] p-10 shadow-3xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-3xl font-black tracking-tighter uppercase italic">Connect</h3>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full"><X className="w-6 h-6" /></Button>
            </div>
            <div className="grid gap-4">
              {['Freighter', 'Albedo', 'WalletConnect'].map(w => (
                <button key={w} className="flex items-center gap-6 p-6 rounded-2xl bg-accent/30 border border-border hover:border-lime-600/50 transition-all text-left group">
                  <div className="w-12 h-12 rounded-xl bg-background flex items-center justify-center group-hover:scale-110 transition-transform"><Network className="w-6 h-6 text-lime-600" /></div>
                  <div className="font-bold text-lg">{w}</div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default function HomePage() {
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("models");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 selection:bg-lime-500/30 relative">
      <Background />
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />

      <header className="fixed top-0 w-full z-[100] h-24 border-b border-border bg-background/60 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative w-12 h-12 rounded-2xl bg-lime-600 flex items-center justify-center group-hover:rotate-[15deg] transition-transform shadow-2xl shadow-lime-500/30 overflow-hidden">
              <Image src="/logo.png" alt="ModelTrace" fill className="object-cover" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter block leading-none italic uppercase">ModelTrace</span>
              <span className="text-[10px] font-black text-lime-600 uppercase tracking-[0.4em] mt-1">AI Provenance Protocol</span>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-12 text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground/60">
            {['Models', 'Lineage', 'Audit', 'Compute'].map(item => <a key={item} href="#" className="hover:text-lime-600 transition-all">{item}</a>)}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button onClick={() => setIsWalletOpen(true)}><Wallet className="w-4 h-4" />Connect</Button>
          </div>
        </div>
      </header>

      <section className="relative pt-64 pb-32 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] bg-lime-500 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 blur-[180px] rounded-full animate-pulse" />
        </div>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-3 px-8 py-2.5 rounded-full bg-lime-500/5 border border-lime-500/10 text-[10px] font-black text-lime-600 mb-12 tracking-[0.6em] uppercase">
            <Microchip className="w-4 h-4 animate-pulse" /> The Benchmark for AI Integrity
          </div>
          <h1 className="text-7xl md:text-[13rem] font-black tracking-tighter mb-16 leading-[0.75] uppercase italic">
            Neural <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-600 via-lime-400 to-lime-200">Provenance.</span>
          </h1>
          <p className="text-xl md:text-3xl text-muted-foreground/40 max-w-4xl mx-auto leading-relaxed mb-24 font-bold tracking-tight">
            Decentralized verification for AI model training and inference. <br /> Absolute transparency for the generative epoch on Stellar Soroban.
          </p>
          <div className="flex flex-col sm:flex-row gap-10 justify-center items-center">
            <Button size="lg" className="px-16" onClick={() => setActiveTab('models')}>Explore Models <ArrowRight className="w-6 h-6" /></Button>
            <Button variant="secondary" size="lg" className="px-16">Provenance SDK</Button>
          </div>
        </motion.div>
      </section>

      <section className="relative py-48 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-8 mb-32">
            {[
              { label: "Verified Models", value: "142", icon: <Binary className="text-lime-500" /> },
              { label: "Audit Nodes", value: "11", icon: <Network className="text-emerald-500" /> },
              { label: "Trace Depth", value: "Infinite", icon: <Fingerprint className="text-blue-500" /> },
              { label: "Integrity", value: "99.9%", icon: <ShieldCheck className="text-indigo-500" /> }
            ].map(s => (
              <Card key={s.label} className="bg-accent/20 border-none shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-background border border-border">{s.icon}</div>
                  <div className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                </div>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.4em] mb-2">{s.label}</div>
                <div className="text-4xl font-black italic tracking-tighter">{s.value}</div>
              </Card>
            ))}
          </div>

          <div className="bg-card border border-border rounded-[5rem] overflow-hidden shadow-4xl min-h-[600px] flex flex-col">
            <div className="flex border-b border-border bg-muted/20 p-8">
              {['models', 'lineage', 'audit'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={cn("flex-1 py-4 text-[10px] font-black uppercase tracking-[0.5em] transition-all relative", activeTab === tab ? "text-lime-600" : "text-muted-foreground/40")}>
                  {tab}
                  {activeTab === tab && <motion.div layoutId="t-underline" className="absolute bottom-0 left-0 w-full h-1 bg-lime-600" />}
                </button>
              ))}
            </div>
            <div className="flex-1 p-8 md:p-20">
              <AnimatePresence mode="wait">
                {activeTab === 'models' && (
                  <motion.div key="models" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-8">
                    {[
                      { name: "LLM-70B Base Model", version: "v2.1", provider: "OpenCompute", status: "Verified" },
                      { name: "Diffusion-XL Fine-tune", version: "v1.4", provider: "CreativeAI", status: "Auditing" },
                      { name: "Medical Diagnosis Vision", version: "v3.0", provider: "BioTech-AI", status: "Verified" }
                    ].map(m => (
                      <div key={m.name} className="p-10 rounded-[3rem] bg-accent/20 border border-border hover:border-lime-600/40 transition-all flex items-center justify-between gap-8 group">
                        <div className="flex items-center gap-8">
                          <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform"><Cpu className="w-8 h-8 text-lime-600" /></div>
                          <div>
                            <div className="text-3xl font-black italic uppercase tracking-tighter">{m.name}</div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">Provider: {m.provider}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-16">
                          <div className="text-right">
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">Metadata</div>
                            <div className="text-2xl font-black text-lime-600 tracking-tighter italic">{m.version} | {m.status}</div>
                          </div>
                          <Button>Trace</Button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative py-40 px-6 z-10 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="relative w-10 h-10 rounded-xl bg-lime-600 flex items-center justify-center overflow-hidden"><Image src="/logo.png" alt="ModelTrace" fill className="object-cover" /></div>
            <span className="font-black text-3xl tracking-tighter italic uppercase">ModelTrace</span>
          </div>
          <div className="text-muted-foreground/20 text-[9px] font-black tracking-[0.8em] uppercase italic">© 2026 ModelTrace Labs · Engineering Transparent AI Infrastructure</div>
        </div>
      </footer>
    </div>
  );
}
