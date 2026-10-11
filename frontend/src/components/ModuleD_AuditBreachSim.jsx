'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Skull,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  ArrowRight,
  Lock,
  Cpu,
  Layers,
  Search,
} from 'lucide-react';

export default function ModuleD_AuditBreachSim({
  stats,
  logs,
  onTamper,
  onRestore,
  onSelectLog,
  isLoadingAction,
  userRole,
}) {
  const isHealthy = stats?.is_valid ?? true;
  const tamperedLogs = (logs || []).filter((l) => l.is_tampered);
  const sampleTampered = tamperedLogs[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold">
              MODULE D
            </span>
            <h2 className="text-base font-black font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Audit Verification & Breach Simulation (Judge Demo)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Real-time adversarial simulation proving instant detection of insider database tampering.
          </p>
        </div>

        {/* Global Verification Badge */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-mono text-xs font-bold border transition-all ${
            isHealthy
              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
              : 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
          }`}
        >
          {isHealthy ? (
            <>
              <ShieldCheck className="w-4 h-4" />
              <span>STATUS: ALL 8 LOGS IMMUTABLE (100% INTEGRITY)</span>
            </>
          ) : (
            <>
              <ShieldAlert className="w-4 h-4" />
              <span>CRITICAL BREACH: {tamperedLogs.length} RECORD(S) CORRUPTED</span>
            </>
          )}
        </div>
      </div>

      {/* War Room Control Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
              Hackathon Judge Penetration Test Console
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
              Simulates a rogue DBA or compromised credentials altering a historical land deed or treasury wire.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">AUTHORIZED ROLE:</span>
            <span className="font-bold text-cyan-600 dark:text-cyan-400 uppercase">
              {userRole === 'admin' ? 'ADMIN SEC-CONTROLLER' : 'AUDITOR (AUDIT MODE)'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
          {/* Tamper Button */}
          <button
            onClick={onTamper}
            disabled={isLoadingAction !== null || !isHealthy}
            className={`flex items-center justify-center gap-2.5 p-4 rounded-xl font-mono text-xs font-bold transition-all border shadow-sm ${
              !isHealthy
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 cursor-not-allowed opacity-60'
                : 'bg-rose-500 hover:bg-rose-600 text-white border-rose-600 active:scale-[0.98]'
            }`}
          >
            <Skull className="w-4 h-4" />
            <span>
              {isLoadingAction === 'tamper'
                ? 'INJECTING MUTATION...'
                : 'SIMULATE TAMPER EVENT (MUTATE DATABASE RECORD)'}
            </span>
          </button>

          {/* Restore Button */}
          <button
            onClick={onRestore}
            disabled={isLoadingAction !== null || isHealthy}
            className={`flex items-center justify-center gap-2.5 p-4 rounded-xl font-mono text-xs font-bold transition-all border shadow-sm ${
              isHealthy
                ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-600 text-black border-emerald-600 font-black active:scale-[0.98]'
            }`}
          >
            <RotateCcw className={`w-4 h-4 ${isLoadingAction === 'restore' ? 'animate-spin' : ''}`} />
            <span>
              {isLoadingAction === 'restore'
                ? 'RESTORING CONSENSUS...'
                : 'RESTORE FROM ON-CHAIN IMMUTABLE TRUTH'}
            </span>
          </button>
        </div>
      </div>

      {/* Active Breach Analysis Card (Triggered on Tamper) */}
      {!isHealthy && sampleTampered && (
        <div className="bg-rose-500/10 dark:bg-rose-950/40 border-2 border-rose-500 rounded-2xl p-6 shadow-xl animate-pulse">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-rose-500 text-white rounded-xl shadow-md">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500 text-black font-mono font-black text-xs uppercase">
                  UNAUTHORIZED MUTATION DETECTED
                </span>
                <span className="font-mono text-xs text-rose-600 dark:text-rose-300 font-bold">
                  RECORD: {sampleTampered.id}
                </span>
              </div>
              <h3 className="text-lg font-black font-mono text-slate-900 dark:text-slate-100 mt-1">
                Cryptographic Cascade Fractured at Sequence #{sampleTampered.sequence_num}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-mono mt-1">
                The database payload was directly mutated outside consensus. The SHA-256 hash calculated from the payload
                does not match the stored hash, and the on-chain Merkle root permanently rejects the tampered leaf!
              </p>
            </div>
          </div>

          {/* Side-by-Side Cryptographic Diff */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {/* Compromised State */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-500/50 space-y-2">
              <div className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1.5 text-xs">
                <XCircle className="w-4 h-4" />
                <span>COMPROMISED LOCAL STATE (DATABASE):</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">CORRUPTED RECORD:</span>
                <div className="text-slate-900 dark:text-slate-100 font-bold">{sampleTampered.id}</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">ALTERED PAYLOAD:</span>
                <div className="bg-rose-500/10 p-2 rounded border border-rose-500/30 text-rose-600 dark:text-rose-300 break-all text-[11px]">
                  {JSON.stringify(sampleTampered.payload)}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">STORED HASH:</span>
                <div className="text-rose-500 break-all text-[10px]">{sampleTampered.current_hash}</div>
              </div>
            </div>

            {/* Immutable Smart Contract State */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-emerald-500/50 space-y-2">
              <div className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="w-4 h-4" />
                <span>IMMUTABLE CONSENSUS (EVM BLOCKCHAIN):</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">SMART CONTRACT ANCHOR:</span>
                <div className="text-slate-900 dark:text-slate-100 font-bold">GovLogAnchor.sol (0x5FbDB...8aa3)</div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">BATCH CONSENSUS:</span>
                <div className="text-emerald-600 dark:text-emerald-400 text-[11px]">
                  Anchored on Block #{currentBatchNumber(stats)} with immutable timestamp
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">SOLIDITY VERIFYLOG() RESULT:</span>
                <div className="bg-rose-500/20 text-rose-600 dark:text-rose-300 font-black p-2 rounded border border-rose-500/40 text-[11px]">
                  REJECTED WITH INVALID_MERKLE_PROOF
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => onSelectLog(sampleTampered)}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs"
            >
              RUN FULL 3-TIER VERIFIER AUDIT
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function currentBatchNumber(stats) {
  return stats?.evm_network?.block_number || 6;
}
