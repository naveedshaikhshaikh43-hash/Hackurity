'use client';

import React, { useState } from 'react';
import { Layers, GitCommit, ShieldCheck, Cpu, ArrowUp, Hash } from 'lucide-react';

export default function MerkleExplorer({ batches, logs, onSelectLog }) {
  const [selectedBatchId, setSelectedBatchId] = useState(batches?.[0]?.batch_id || 1);
  const [selectedLeafIdx, setSelectedLeafIdx] = useState(0);

  if (!batches || batches.length === 0) {
    return (
      <div className="bg-cyber-900 border border-slate-800 rounded-xl p-6 text-center font-mono text-slate-400 text-xs">
        No batches anchored on blockchain yet. Ingest logs and click &quot;FORCE ANCHOR BATCH&quot;.
      </div>
    );
  }

  const currentBatch = batches.find((b) => b.batch_id === selectedBatchId) || batches[0];
  const batchLogs = (logs || []).filter((l) => l.batch_id === currentBatch.batch_id);

  return (
    <div className="bg-cyber-900 border border-slate-800 rounded-xl shadow-xl p-5 mb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-400" />
            <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase">
              Interactive Merkle Tree & On-Chain Root Explorer
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Balanced SHA-256 Merkle tree rooted directly into GovLogAnchor.sol
          </p>
        </div>

        {/* Batch Selector Tabs */}
        <div className="flex items-center gap-2">
          {batches.map((b) => (
            <button
              key={b.batch_id}
              onClick={() => {
                setSelectedBatchId(b.batch_id);
                setSelectedLeafIdx(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                selectedBatchId === b.batch_id
                  ? 'bg-purple-900/60 border-purple-500 text-purple-200 glow-cyan'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              BATCH #{b.batch_id} ({b.log_count} LOGS)
            </button>
          ))}
        </div>
      </div>

      {/* On-Chain Batch Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-xs">
          <div className="text-slate-400 text-[10px]">EVM ANCHORED ROOT</div>
          <div className="text-purple-300 font-bold truncate mt-0.5" title={currentBatch.merkle_root}>
            {currentBatch.merkle_root}
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-xs">
          <div className="text-slate-400 text-[10px]">TRANSACTION HASH</div>
          <div className="text-cyan-300 font-bold truncate mt-0.5" title={currentBatch.tx_hash}>
            {currentBatch.tx_hash}
          </div>
        </div>

        <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-xs flex items-center justify-between">
          <div>
            <div className="text-slate-400 text-[10px]">BLOCK HEIGHT</div>
            <div className="text-emerald-300 font-bold mt-0.5">#{currentBatch.block_number}</div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
            CONFIRMED
          </span>
        </div>
      </div>

      {/* Visual Merkle Architecture */}
      <div className="bg-slate-950/90 rounded-xl p-6 border border-slate-800/80">
        <div className="text-center font-mono text-xs text-slate-400 mb-4 flex items-center justify-center gap-2">
          <span>ROOT LEVEL: IMMUTABLE ANCHOR</span>
          <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
        </div>

        {/* Merkle Root Node */}
        <div className="flex justify-center mb-6">
          <div className="bg-purple-950/80 border-2 border-purple-500 rounded-xl p-3 max-w-lg w-full text-center shadow-[0_0_20px_rgba(168,85,247,0.3)]">
            <div className="text-[10px] font-mono font-bold text-purple-300 tracking-wider">
              MERKLE ROOT (STORED IN EVM STORAGE)
            </div>
            <div className="font-mono text-xs font-black text-slate-100 break-all mt-1">
              {currentBatch.merkle_root}
            </div>
          </div>
        </div>

        {/* Tree Connectors */}
        <div className="w-px h-6 bg-purple-500/50 mx-auto mb-6"></div>

        {/* Leaves Grid */}
        <div className="font-mono text-[11px] text-slate-400 text-center mb-2">
          LEAVES (SHA-256 LOG HASHES) - CLICK TO INSPECT AUDIT PROOF PATH
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {batchLogs.map((log, idx) => {
            const isSelected = selectedLeafIdx === idx;
            const isTampered = log.is_tampered;

            return (
              <div
                key={log.id}
                onClick={() => setSelectedLeafIdx(idx)}
                className={`p-3 rounded-lg border cursor-pointer font-mono text-xs transition-all ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : isTampered
                    ? 'bg-rose-950/40 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-400 text-[10px]">LEAF #{idx}</span>
                  <span className="text-[10px] text-cyan-400 font-bold">{log.id.slice(0, 8)}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mb-1">
                  {log.action}
                </div>
                <div className="text-[10px] font-mono break-all text-slate-400 bg-slate-950 p-1 rounded border border-slate-800">
                  {log.current_hash.slice(0, 16)}...
                </div>
                <div className="mt-2 flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                  <span className="text-slate-400">Proof Elements:</span>
                  <span className="text-purple-300 font-bold">
                    {log.merkle_proof ? log.merkle_proof.length : 0} hashes
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sibling Proof Path Display for Selected Leaf */}
        {batchLogs[selectedLeafIdx] && (
          <div className="mt-6 pt-4 border-t border-slate-800 bg-slate-900/60 p-4 rounded-lg">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-2 font-mono text-xs">
              <span className="text-cyan-300 font-bold">
                AUDIT PATH FOR LEAF #{selectedLeafIdx} ({batchLogs[selectedLeafIdx].id}):
              </span>
              <button
                onClick={() => onSelectLog(batchLogs[selectedLeafIdx])}
                className="px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-[10px] transition-colors"
              >
                TEST ON EVM CONTRACT
              </button>
            </div>
            <div className="space-y-1.5 font-mono text-[11px]">
              {(batchLogs[selectedLeafIdx].merkle_proof || []).map((proofHash, pIdx) => (
                <div
                  key={pIdx}
                  className="bg-slate-950 p-2 rounded border border-slate-800 flex items-center justify-between gap-2"
                >
                  <span className="text-purple-400 text-[10px] font-bold">
                    SIBLING LEVEL #{pIdx + 1}:
                  </span>
                  <span className="text-slate-300 break-all text-[10px]">{proofHash}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
