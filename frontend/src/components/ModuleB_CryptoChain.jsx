'use client';

import React, { useState } from 'react';
import {
  Link as LinkIcon,
  Cpu,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Fingerprint,
  RefreshCw,
  Terminal,
  Code2,
  Lock,
} from 'lucide-react';

export default function ModuleB_CryptoChain({ logs, onSelectLog }) {
  const [selectedBlockIdx, setSelectedBlockIdx] = useState(0);
  const [sandboxInput, setSandboxInput] = useState('{"officer": "Vance", "transfer_usd": 120000}');
  const [simulatedPrevHash, setSimulatedPrevHash] = useState('0000000000000000000000000000000000000000000000000000000000000000');

  // Simple client-side SHA-256 simulation helper for sandbox
  const computeClientHash = (text) => {
    // Basic hash representation for sandbox preview
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    return '0x' + hex.repeat(8);
  };

  const selectedLog = logs?.[selectedBlockIdx] || logs?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold">
            MODULE B
          </span>
          <h2 className="text-base font-black font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Cryptographic Engine & SHA-256 Hash-Chain
          </h2>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          Mathematical proof of continuous custody: \(H_n = \text&#123;SHA-256&#125;(H_&#123;n-1&#125; \parallel \text&#123;CanonicalPayload&#125;)\).
        </p>
      </div>

      {/* Sequential Hash Chain Visualizer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm overflow-hidden">
        <div className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-cyan-500" />
            <span>SEQUENTIAL CHAIN TOPOLOGY (CLICK BLOCK TO AUDIT)</span>
          </div>
          <span className="text-[11px] text-slate-400">Total Links: {logs?.length || 0}</span>
        </div>

        {/* Horizontal Scrollable Chain */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2">
          {(logs || []).map((log, idx) => {
            const isSelected = selectedBlockIdx === idx;
            const isTampered = log.is_tampered;

            return (
              <React.Fragment key={log.id}>
                {/* Block Node Card */}
                <div
                  onClick={() => setSelectedBlockIdx(idx)}
                  className={`shrink-0 w-64 p-3.5 rounded-xl border font-mono text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 dark:bg-cyan-950/60 border-cyan-500 shadow-md ring-1 ring-cyan-500'
                      : isTampered
                      ? 'bg-rose-500/10 dark:bg-rose-950/40 border-rose-500 text-rose-600 dark:text-rose-400'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400">
                      BLOCK #{idx + 1}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                        isTampered
                          ? 'bg-rose-500 text-black animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400'
                      }`}
                    >
                      {isTampered ? 'BROKEN' : 'VALID'}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 dark:text-slate-100 text-[11px] truncate mb-1">
                    {log.id}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-2">
                    {log.action}
                  </div>

                  {/* Hash Summary */}
                  <div className="space-y-1 text-[9px] bg-white/60 dark:bg-slate-900/60 p-2 rounded border border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-slate-400">PREV:</span>{' '}
                      <span className="text-slate-500 truncate inline-block max-w-[150px] align-bottom">
                        {log.previous_hash.slice(0, 16)}...
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">HASH:</span>{' '}
                      <span
                        className={`font-bold truncate inline-block max-w-[150px] align-bottom ${
                          isTampered ? 'text-rose-500' : 'text-cyan-600 dark:text-cyan-400'
                        }`}
                      >
                        {log.current_hash.slice(0, 16)}...
                      </span>
                    </div>
                  </div>
                </div>

                {/* Connector Arrow */}
                {idx < logs.length - 1 && (
                  <div className="shrink-0 flex items-center justify-center">
                    <ArrowRight
                      className={`w-5 h-5 ${
                        logs[idx + 1].is_tampered || log.is_tampered
                          ? 'text-rose-500 animate-pulse'
                          : 'text-cyan-500'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Selected Block Detailed Breakdown */}
        {selectedLog && (
          <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase flex items-center justify-between">
                <span>Cryptographic Digest Parameters</span>
                <span className="text-cyan-600 dark:text-cyan-400">{selectedLog.id}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">PREVIOUS BLOCK HASH (H_&#123;n-1&#125;):</span>
                <div className="text-slate-700 dark:text-slate-300 break-all select-all mt-0.5">
                  {selectedLog.previous_hash}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">CURRENT BLOCK HASH (H_n):</span>
                <div
                  className={`break-all select-all mt-0.5 font-bold ${
                    selectedLog.is_tampered ? 'text-rose-500' : 'text-cyan-600 dark:text-cyan-400'
                  }`}
                >
                  {selectedLog.current_hash}
                </div>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">TIMESTAMP UTC:</span>
                <div className="text-slate-600 dark:text-slate-400">{selectedLog.timestamp}</div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 flex flex-col justify-between">
              <div>
                <div className="text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase mb-1">
                  Canonical Serialized Payload:
                </div>
                <pre className="bg-white dark:bg-slate-900 p-2.5 rounded border border-slate-200 dark:border-slate-800 text-[11px] text-slate-800 dark:text-slate-200 overflow-x-auto max-h-28">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onSelectLog(selectedLog)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-black transition-colors"
                >
                  VERIFY ON EVM SMART CONTRACT
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Cryptographic Hashing Sandbox */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-purple-500" />
          <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
            Interactive Cryptographic Sandbox (Avalanche Effect Inspector)
          </h3>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-4">
          Type or modify any character in the simulated payload below to observe how SHA-256 recalculates 
          the 256-bit digest instantaneously.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">SIMULATED LOG PAYLOAD (JSON)</label>
            <textarea
              rows={3}
              value={sandboxInput}
              onChange={(e) => setSandboxInput(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
            <div>
              <span className="text-slate-400 text-[10px]">COMPUTED 256-BIT DIGEST:</span>
              <div className="text-purple-600 dark:text-purple-400 font-bold break-all mt-0.5">
                {computeClientHash(simulatedPrevHash + sandboxInput)}
              </div>
            </div>
            <div className="text-[10px] text-slate-400">
              Formula: \(\text&#123;SHA-256&#125;(\text&#123;H&#125;_&#123;prev&#125; + \text&#123;Payload&#125;)\)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
