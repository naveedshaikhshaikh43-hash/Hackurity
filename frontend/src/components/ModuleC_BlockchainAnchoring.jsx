'use client';

import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  ArrowUp,
  Anchor,
  Clock,
  Hash,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export default function ModuleC_BlockchainAnchoring({
  batches,
  logs,
  onSelectLog,
  onForceAnchor,
  isLoadingAnchor,
  userRole,
}) {
  const [selectedBatchId, setSelectedBatchId] = useState(batches?.[0]?.batch_id || 1);
  const [selectedLeafIdx, setSelectedLeafIdx] = useState(0);

  const currentBatch = batches?.find((b) => b.batch_id === selectedBatchId) || batches?.[0];
  const batchLogs = (logs || []).filter((l) => l.batch_id === currentBatch?.batch_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-mono text-[10px] font-bold">
              MODULE C
            </span>
            <h2 className="text-base font-black font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Blockchain Anchoring & EVM Merkle Roots
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Immutable smart contract consensus on Hardhat local node (ChainID: 31337).
          </p>
        </div>

        {/* Force Anchor Button */}
        <div>
          {userRole === 'admin' ? (
            <button
              onClick={onForceAnchor}
              disabled={isLoadingAnchor}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold bg-purple-500 hover:bg-purple-400 text-white shadow-sm transition-all active:scale-95"
            >
              <Anchor className={`w-3.5 h-3.5 ${isLoadingAnchor ? 'animate-spin' : ''}`} />
              <span>{isLoadingAnchor ? 'ANCHORING EVM...' : 'FORCE ANCHOR PENDING BATCH'}</span>
            </button>
          ) : (
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-mono bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
              <Lock className="w-3 h-3 text-slate-400" />
              <span>Anchor Transactions: Restricted to Admin</span>
            </div>
          )}
        </div>
      </div>

      {/* Contract Specification Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-500" />
            <span className="font-bold text-slate-900 dark:text-slate-100">
              GovLogAnchor.sol (Solidity 0.8.24)
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px]">
              DEPLOYED
            </span>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            Address: <span className="text-purple-600 dark:text-purple-400 font-bold select-all">0x5FbDB2315678afecb367f032d93F642f64180aa3</span>
          </div>
        </div>
      </div>

      {/* Batches Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(batches || []).map((b) => (
          <button
            key={b.batch_id}
            onClick={() => {
              setSelectedBatchId(b.batch_id);
              setSelectedLeafIdx(0);
            }}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-bold whitespace-nowrap transition-all border ${
              selectedBatchId === b.batch_id
                ? 'bg-purple-500/10 dark:bg-purple-950/60 border-purple-500 text-purple-600 dark:text-purple-300 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            BATCH #{b.batch_id} ({b.log_count} LOGS)
          </button>
        ))}
      </div>

      {/* Batch Metadata Cards */}
      {currentBatch && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs shadow-sm">
            <div className="text-slate-400 text-[10px] uppercase">Merkle Root</div>
            <div className="text-purple-600 dark:text-purple-400 font-bold truncate mt-0.5" title={currentBatch.merkle_root}>
              {currentBatch.merkle_root}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs shadow-sm">
            <div className="text-slate-400 text-[10px] uppercase">Transaction Hash</div>
            <div className="text-cyan-600 dark:text-cyan-400 font-bold truncate mt-0.5" title={currentBatch.tx_hash}>
              {currentBatch.tx_hash}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs shadow-sm">
            <div className="text-slate-400 text-[10px] uppercase">Block Height</div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
              BLK #{currentBatch.block_number}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 font-mono text-xs shadow-sm">
            <div className="text-slate-400 text-[10px] uppercase">Timestamp UTC</div>
            <div className="text-slate-700 dark:text-slate-300 font-bold truncate mt-0.5">
              {new Date(currentBatch.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}

      {/* Merkle Tree Architecture Viewer */}
      {currentBatch && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="text-center font-mono text-xs text-slate-400 mb-4 flex items-center justify-center gap-1.5">
            <span>ROOT CONSENSUS: STORED IN SMART CONTRACT STORAGE</span>
            <ArrowUp className="w-3.5 h-3.5 text-purple-500" />
          </div>

          {/* Root Node */}
          <div className="flex justify-center mb-6">
            <div className="bg-purple-500/10 dark:bg-purple-950/60 border-2 border-purple-500 rounded-xl p-4 max-w-lg w-full text-center shadow-md">
              <div className="text-[10px] font-mono font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                BATCH #{currentBatch.batch_id} ON-CHAIN MERKLE ROOT
              </div>
              <div className="font-mono text-xs font-black text-slate-900 dark:text-slate-100 break-all mt-1">
                {currentBatch.merkle_root}
              </div>
            </div>
          </div>

          {/* Connector Line */}
          <div className="w-px h-6 bg-purple-500/40 mx-auto mb-6"></div>

          {/* Leaves */}
          <div className="text-center font-mono text-[11px] text-slate-400 mb-3">
            LEAF NODES (SHA-256 LOG HASHES) - CLICK TO INSPECT AUDIT PROOF PATH
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
                      ? 'bg-cyan-500/10 dark:bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                      : isTampered
                      ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-400 text-[10px]">LEAF #{idx + 1}</span>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">{log.id}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-1">
                    {log.action}
                  </div>
                  <div className="text-[9px] font-mono break-all text-slate-400 bg-white/60 dark:bg-slate-900/60 p-1 rounded border border-slate-200 dark:border-slate-800">
                    {log.current_hash.slice(0, 16)}...
                  </div>
                  <div className="mt-2 pt-1 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="text-slate-400">Proof:</span>
                    <span className="text-purple-600 dark:text-purple-400 font-bold">
                      {log.merkle_proof?.length || 0} sibling(s)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sibling Proof Path */}
          {batchLogs[selectedLeafIdx] && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl">
              <div className="flex items-center justify-between flex-wrap gap-2 mb-2 font-mono text-xs">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold">
                  CRYPTOGRAPHIC AUDIT PATH FOR {batchLogs[selectedLeafIdx].id}:
                </span>
                <button
                  onClick={() => onSelectLog(batchLogs[selectedLeafIdx])}
                  className="px-2.5 py-1 rounded bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-[10px]"
                >
                  TEST PROOF ON EVM
                </button>
              </div>

              <div className="space-y-1.5 font-mono text-[11px]">
                {(batchLogs[selectedLeafIdx].merkle_proof || []).map((proofHash, pIdx) => (
                  <div
                    key={pIdx}
                    className="bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2"
                  >
                    <span className="text-purple-600 dark:text-purple-400 text-[10px] font-bold">
                      SIBLING #{pIdx + 1}:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 break-all text-[10px]">{proofHash}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
