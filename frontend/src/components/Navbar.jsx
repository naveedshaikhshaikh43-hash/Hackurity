'use client';

import React from 'react';
import { ShieldCheck, ShieldAlert, Cpu, RefreshCw, Link as LinkIcon, Database } from 'lucide-react';

export default function Navbar({ stats, onRefresh, isRefreshing }) {
  const isHealthy = stats?.is_valid ?? true;
  const evmOnline = stats?.evm_network?.connected ?? false;
  const blockNum = stats?.evm_network?.block_number ?? 0;

  return (
    <header className="border-b border-slate-800 bg-cyber-900/90 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <span className="text-xl">⚡</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-slate-100 font-mono">BYTE FORGE</span>
              <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-800 text-cyan-400 border border-slate-700">
                GOV-LOG-ANCHOR v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Cryptographic Hash-Chain & EVM Merkle Root Immutable Ledger
            </p>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Integrity Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
              isHealthy
                ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-400 glow-emerald'
                : 'bg-rose-950/80 border-rose-500 text-rose-300 glow-crimson animate-pulse'
            }`}
          >
            {isHealthy ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-semibold">CHAIN INTEGRITY: SECURE (100%)</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="font-bold">CRITICAL BREACH: TAMPER DETECTED</span>
              </>
            )}
          </div>

          {/* EVM Node Pill */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono bg-slate-900 border border-slate-700 text-slate-300">
            <Cpu className={`w-3.5 h-3.5 ${evmOnline ? 'text-cyan-400' : 'text-amber-400'}`} />
            <span>EVM LOCALHOST</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="text-cyan-400">BLK #{blockNum}</span>
          </div>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-colors"
            title="Refresh Ledger"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>SYNC</span>
          </button>
        </div>
      </div>
    </header>
  );
}
