'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Database,
  Layers,
  Cpu,
  ArrowRight,
  Fingerprint,
  AlertOctagon,
  FileText,
  Activity,
  Sun,
  Moon,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';

export default function LandingPage() {
  const { user, theme, toggleTheme } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-cyber-grid flex flex-col transition-colors duration-200">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 dark:bg-cyan-950 border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <ShieldCheck className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider font-mono text-slate-900 dark:text-slate-100">
                GOVCHAIN <span className="text-cyan-500">SENTINEL</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-mono rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-cyan-400 border border-slate-300 dark:border-slate-700">
                FED-SEC V1.0
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
              title="Toggle Day/Night Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Portal Action */}
            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>ENTER DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 transition-all"
              >
                <span>ACCESS PORTAL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-cyan-500/10 dark:bg-cyan-950/60 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span>ZERO-TRUST IMMUTABLE AUDIT FRAMEWORK // EVM ANCHORED</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            GovChain Sentinel:
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400">
              Immutable Government Audit
            </span>
            <br />
            & Chain of Custody
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-sans leading-relaxed">
            Eliminating insider tampering and retroactive record falsification in municipal and federal agencies.
            Continuous <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">SHA-256 hash chaining</span> coupled with 
            <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono"> Merkle Tree proofs</span> anchored directly into immutable 
            Solidity smart contracts for mathematical non-repudiation.
          </p>

          {/* Primary CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>ACCESS PORTAL (SIGN IN / REGISTER)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-mono font-bold bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-800 transition-all"
            >
              <Activity className="w-4 h-4 text-cyan-500" />
              <span>EXPLORE LIVE DASHBOARD</span>
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-sm text-left">
            <div className="p-3">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Cryptographic Integrity</div>
              <div className="text-xl font-bold font-mono text-emerald-500 flex items-center gap-1.5 mt-1">
                <CheckCircle2 className="w-4 h-4" /> 100% SECURE
              </div>
            </div>
            <div className="p-3">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Hash Chain Protocol</div>
              <div className="text-xl font-bold font-mono text-cyan-500 mt-1">SHA-256 CASCADE</div>
            </div>
            <div className="p-3">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Consensus Layer</div>
              <div className="text-xl font-bold font-mono text-purple-500 mt-1">EVM SMART CONTRACT</div>
            </div>
            <div className="p-3">
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase">Tamper Detection</div>
              <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">&lt; 100ms TELEMETRY</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-20 px-6 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              Why Public Sector Logs Require Blockchain Anchoring
            </h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 font-sans">
              Traditional databases rely on internal database administrators who possess unrestricted write and delete permissions. 
              GovChain Sentinel enforces mathematical finality.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-500 mb-5 group-hover:scale-110 transition-transform">
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mb-2">
                1. Cryptographic Chain of Custody
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Every event links to the cryptographic hash of the preceding entry. 
                Any historical alteration completely fractures the chain, making silent modifications mathematically impossible.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-purple-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 mb-5 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mb-2">
                2. EVM Merkle Root Anchoring
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Aggregates thousands of government events into balanced binary Merkle trees. 
                Roots are permanently minted to Solidity contracts with block height and timestamp seals.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mb-2">
                3. Zero-Trust Public Verifiability
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Enables courts, auditors, journalists, and citizens to independently verify any land title deed, 
                treasury payout, or police chain-of-custody using a lightweight Merkle proof.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm hover:border-rose-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-5 group-hover:scale-110 transition-transform">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold font-mono text-slate-900 dark:text-slate-100 mb-2">
                4. Instant Breach Telemetry
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                If an insider performs an unauthorized SQL query or alters a file on disk, 
                real-time SOC alarms trigger instantly, pinpointing the exact corrupted record and diff.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Layer Architecture Preview */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">ARCHITECTURE // INTEGRITY PIPELINE</span>
            <h2 className="text-2xl sm:text-3xl font-black font-mono mt-1 text-slate-900 dark:text-white">
              The 4 Core Custody Layers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs font-mono text-cyan-500 font-bold mb-1">MODULE A</div>
              <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">Live Ingestion</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Accepts continuous telemetry from Land, Treasury, Judiciary & Defense registers.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs font-mono text-cyan-500 font-bold mb-1">MODULE B</div>
              <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">Crypto Hash Chain</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Computes canonical JSON serialization and sequential SHA-256 cryptographic linkage.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs font-mono text-purple-500 font-bold mb-1">MODULE C</div>
              <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">EVM Anchoring</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Constructs balanced Merkle trees and commits batch roots to GovLogAnchor.sol.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <div className="text-xs font-mono text-emerald-500 font-bold mb-1">MODULE D</div>
              <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">Audit & Tamper Sim</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                Executes 3-tier mathematical verification and breach test simulations for judges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span className="font-mono font-black text-sm text-slate-900 dark:text-slate-100">GOVCHAIN SENTINEL</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md">
              Immutable Cryptographic Audit & Chain-of-Custody for Municipal, State, and Federal Government Infrastructures.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-slate-500 dark:text-slate-400">
            <Link href="/login" className="hover:text-cyan-500 transition-colors">Access Portal</Link>
            <Link href="/dashboard" className="hover:text-cyan-500 transition-colors">Dashboard</Link>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span>Solidity 0.8.24</span>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <span>EVM ChainID: 31337</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-100 dark:border-slate-900 text-center text-[11px] font-mono text-slate-400">
          PROJECT DISCLAIMER: Authorized Federal & Municipal Integrity Monitoring System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
