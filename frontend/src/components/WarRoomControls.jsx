'use client';

import React, { useState } from 'react';
import { Skull, ShieldCheck, PlusCircle, Anchor, AlertOctagon, Terminal } from 'lucide-react';

export default function WarRoomControls({
  onTamper,
  onRestore,
  onSimulateFeed,
  onForceAnchor,
  isTampered,
  loadingAction,
}) {
  return (
    <div className="bg-cyber-900 border border-slate-800 rounded-xl p-5 mb-8 shadow-xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase">
              Security Operations // War-Room Action Console
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Interactive control panel for Hackathon Judges & Security Auditors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
            MODE: <span className="text-cyan-400 font-bold">LIVE EVM AUDITOR</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        {/* Tamper Button */}
        <button
          onClick={onTamper}
          disabled={loadingAction !== null || isTampered}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-xs font-bold transition-all border ${
            isTampered
              ? 'bg-rose-950/40 border-rose-800/60 text-rose-400 cursor-not-allowed opacity-60'
              : 'bg-rose-600/20 hover:bg-rose-600/30 border-rose-500/50 hover:border-rose-400 text-rose-300 glow-crimson active:scale-95'
          }`}
        >
          <Skull className="w-4 h-4 text-rose-400" />
          <span>
            {loadingAction === 'tamper' ? 'CORRUPTING LEDGER...' : 'SIMULATE TAMPER EVENT'}
          </span>
        </button>

        {/* Restore Button */}
        <button
          onClick={onRestore}
          disabled={loadingAction !== null || !isTampered}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-xs font-bold transition-all border ${
            !isTampered
              ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-500/50 cursor-not-allowed'
              : 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/60 hover:border-emerald-400 text-emerald-300 glow-emerald active:scale-95'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            {loadingAction === 'restore' ? 'RESTORING LEDGER...' : 'RESTORE AUTHENTIC TRUTH'}
          </span>
        </button>

        {/* Ingest Live Feed */}
        <button
          onClick={onSimulateFeed}
          disabled={loadingAction !== null}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-xs font-bold bg-cyan-950/40 hover:bg-cyan-950/70 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 transition-all glow-cyan active:scale-95"
        >
          <PlusCircle className="w-4 h-4 text-cyan-400" />
          <span>
            {loadingAction === 'feed' ? 'INGESTING LOG...' : 'INGEST LIVE GOV EVENT'}
          </span>
        </button>

        {/* Force Anchor */}
        <button
          onClick={onForceAnchor}
          disabled={loadingAction !== null}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-mono text-xs font-bold bg-purple-950/40 hover:bg-purple-950/70 border border-purple-500/40 hover:border-purple-400 text-purple-300 transition-all active:scale-95"
        >
          <Anchor className="w-4 h-4 text-purple-400" />
          <span>
            {loadingAction === 'anchor' ? 'ANCHORING EVM...' : 'FORCE ANCHOR BATCH'}
          </span>
        </button>
      </div>

      {/* Explanatory subtitle */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
          <span>
            {isTampered
              ? 'ALERT: Database records have been modified without blockchain consensus.'
              : 'Continuous Cryptographic Hash-Chain & Merkle Root verification running.'}
          </span>
        </div>
        <span className="text-slate-400 hidden sm:inline">
          Solidity Precompile: SHA-256 Engine
        </span>
      </div>
    </div>
  );
}
