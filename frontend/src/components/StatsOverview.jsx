'use client';

import React from 'react';
import { Database, Layers, ShieldCheck, AlertTriangle, Cpu, FileCheck } from 'lucide-react';

export default function StatsOverview({ stats }) {
  const isHealthy = stats?.is_valid ?? true;
  const totalLogs = stats?.total_logs ?? 0;
  const totalBatches = stats?.total_batches ?? 0;
  const tamperedCount = stats?.tampered_logs_count ?? 0;
  const contractAddress = stats?.evm_network?.contract_address ?? '0x5FbDB...8aa3';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Total Logs */}
      <div className="bg-cyber-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Database className="w-16 h-16 text-cyan-400" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>INGESTED GOV LOGS</span>
        </div>
        <div className="text-3xl font-black font-mono text-slate-100 mb-1">{totalLogs}</div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          Linked via SHA-256 Hash Chain
        </div>
      </div>

      {/* Merkle Batches */}
      <div className="bg-cyber-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Layers className="w-16 h-16 text-purple-400" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
          <Layers className="w-4 h-4 text-purple-400" />
          <span>ON-CHAIN BATCHES</span>
        </div>
        <div className="text-3xl font-black font-mono text-purple-300 mb-1">{totalBatches}</div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          Merkle Roots Anchored on EVM
        </div>
      </div>

      {/* Cryptographic Integrity */}
      <div
        className={`border rounded-xl p-4 shadow-lg backdrop-blur relative overflow-hidden transition-all ${
          isHealthy
            ? 'bg-cyber-900/80 border-slate-800'
            : 'bg-rose-950/40 border-rose-600/70 glow-crimson'
        }`}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10">
          {isHealthy ? (
            <ShieldCheck className="w-16 h-16 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-16 h-16 text-rose-400" />
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
          {isHealthy ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>CHAIN INTEGRITY</span>
        </div>
        <div
          className={`text-2xl font-black font-mono mb-1 ${
            isHealthy ? 'text-emerald-400' : 'text-rose-400 animate-pulse'
          }`}
        >
          {isHealthy ? '100% VERIFIED' : 'BREACH DETECTED'}
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isHealthy ? 'bg-emerald-400' : 'bg-rose-500'
            }`}
          ></span>
          {tamperedCount === 0
            ? 'Zero hash anomalies detected'
            : `${tamperedCount} log(s) maliciously altered!`}
        </div>
      </div>

      {/* Smart Contract Anchor */}
      <div className="bg-cyber-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Cpu className="w-16 h-16 text-amber-400" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs font-mono mb-1">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>IMMUTABLE CONTRACT</span>
        </div>
        <div
          className="text-sm font-mono text-amber-300 font-bold mb-1 truncate"
          title={contractAddress}
        >
          {contractAddress.slice(0, 10)}...{contractAddress.slice(-8)}
        </div>
        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
          GovLogAnchor (Solidity 0.8.24)
        </div>
      </div>
    </div>
  );
}
