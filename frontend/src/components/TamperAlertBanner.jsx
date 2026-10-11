'use client';

import React from 'react';
import { AlertOctagon, ShieldAlert, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';

export default function TamperAlertBanner({ tamperedLogs, onRestore, isRestoring }) {
  if (!tamperedLogs || tamperedLogs.length === 0) return null;

  const sample = tamperedLogs[0];

  return (
    <div className="bg-rose-950/70 border-2 border-rose-500 rounded-xl p-5 mb-8 shadow-2xl glow-crimson relative overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-rose-900/60 rounded-lg border border-rose-500/60 text-rose-300">
            <AlertOctagon className="w-8 h-8 text-rose-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-black font-mono font-black text-xs uppercase tracking-wider">
                TAMPER BREACH DETECTED
              </span>
              <span className="text-xs font-mono text-rose-200">
                AFFECTED RECORD: <span className="font-bold underline">{sample.id}</span>
              </span>
            </div>
            <h3 className="text-lg font-mono font-bold text-slate-100 mt-1">
              Unauthorized Database Mutation Detected via SHA-256 Hash Chain
            </h3>
            <p className="text-xs text-rose-200 font-mono mt-1 max-w-2xl">
              An unauthorized actor altered payload fields directly in the backend storage. The SHA-256
              hash chain broke immediately, and the recomputed Merkle root failed against the immutable EVM anchor.
            </p>
          </div>
        </div>

        <button
          onClick={onRestore}
          disabled={isRestoring}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-mono text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-black border border-emerald-400 transition-all shadow-lg active:scale-95 shrink-0"
        >
          <RotateCcw className={`w-4 h-4 ${isRestoring ? 'animate-spin' : ''}`} />
          <span>RESTORE FROM ON-CHAIN TRUTH</span>
        </button>
      </div>

      {/* Cryptographic Diff Comparison */}
      <div className="mt-4 pt-4 border-t border-rose-800/60 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="bg-slate-950/80 p-3 rounded-lg border border-rose-900">
          <div className="text-rose-400 font-bold mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            COMPROMISED LOCAL STATE:
          </div>
          <div className="text-slate-300 space-y-1">
            <div>
              <span className="text-slate-400">Department:</span> {sample.department}
            </div>
            <div>
              <span className="text-slate-400">Stored Hash:</span>{' '}
              <span className="text-rose-300 break-all">{sample.current_hash.slice(0, 32)}...</span>
            </div>
            <div>
              <span className="text-slate-400">Payload State:</span>{' '}
              <span className="text-rose-300 font-bold">
                {JSON.stringify(sample.payload).slice(0, 100)}...
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950/80 p-3 rounded-lg border border-emerald-900">
          <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            IMMUTABLE SMART CONTRACT STATE:
          </div>
          <div className="text-slate-300 space-y-1">
            <div>
              <span className="text-slate-400">EVM Contract:</span> GovLogAnchor.sol (0x5FbDB...8aa3)
            </div>
            <div>
              <span className="text-slate-400">Anchor Status:</span>{' '}
              <span className="text-emerald-300">Merkle Root Locked on Block Height</span>
            </div>
            <div>
              <span className="text-slate-400">Contract Verification:</span>{' '}
              <span className="text-rose-400 font-bold">REJECTED (Proof Mismatch)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
