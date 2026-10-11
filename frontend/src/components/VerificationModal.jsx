'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Layers,
  FileCode,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react';

export default function VerificationModal({ log, onClose, backendUrl }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!log) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    fetch(`${backendUrl}/api/verify/log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ log_id: log.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Verification request failed');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setResult(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [log, backendUrl]);

  if (!log) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-cyber-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold font-mono text-slate-100">
              Cryptographic Integrity Audit // {log.id}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              3-Tier Validation: Hash-Chain -&gt; Merkle Tree -&gt; EVM Smart Contract
            </p>
          </div>
        </div>

        {/* Loading / Error States */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center font-mono text-xs text-cyan-400 gap-3">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Executing On-Chain EVM Proof Query...</span>
          </div>
        ) : error ? (
          <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-300 font-mono text-xs">
            {error}
          </div>
        ) : result ? (
          <div className="space-y-5 font-mono text-xs">
            {/* Overall Status Banner */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                result.is_valid
                  ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                  : 'bg-rose-950/60 border-rose-500 text-rose-300 glow-crimson'
              }`}
            >
              <div className="flex items-center gap-3">
                {result.is_valid ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 animate-pulse" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {result.is_valid
                      ? 'INTEGRITY VERIFIED: AUTHENTIC RECORD'
                      : 'TAMPER DETECTED: CRYPTOGRAPHIC PROOF REJECTED'}
                  </div>
                  <div className="text-[11px] opacity-80">
                    {result.is_valid
                      ? 'All cryptographic signatures and EVM root hashes match.'
                      : 'Payload was mutated in storage. Contract proof rejected.'}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Tier Step Breakdown */}
            <div className="space-y-2">
              <div className="text-slate-400 font-bold text-[11px] uppercase tracking-wider">
                Audit Verification Pipeline:
              </div>

              {/* Tier 1 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="font-bold text-slate-200">
                      Tier 1: SHA-256 Hash Chain Match
                    </div>
                    <div className="text-[10px] text-slate-400">
                      SHA256(prev_hash + canonical_payload) == stored_hash
                    </div>
                  </div>
                </div>
                {result.leaf_matches_stored ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <XCircle className="w-4 h-4" /> FAIL
                  </span>
                )}
              </div>

              {/* Tier 2 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-bold text-slate-200">
                      Tier 2: Merkle Tree Proof Audit Path
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Recalculated sibling path == Anchored Root
                    </div>
                  </div>
                </div>
                {result.merkle_verification_python ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <XCircle className="w-4 h-4" /> FAIL
                  </span>
                )}
              </div>

              {/* Tier 3 */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="font-bold text-slate-200">
                      Tier 3: EVM Smart Contract Consensus
                    </div>
                    <div className="text-[10px] text-slate-400">
                      GovLogAnchor.verifyLog() static call on Hardhat Node
                    </div>
                  </div>
                </div>
                {result.merkle_verification_evm_contract ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> PASS
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 font-bold">
                    <XCircle className="w-4 h-4" /> FAIL
                  </span>
                )}
              </div>
            </div>

            {/* Cryptographic Technical Details */}
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="text-slate-400 font-bold text-[11px]">CRYPTOGRAPHIC DETAILS:</div>
              <div>
                <span className="text-slate-400">Leaf Hash:</span>
                <div className="text-cyan-300 break-all select-all mt-0.5">{result.stored_hash}</div>
              </div>
              <div>
                <span className="text-slate-400">Recomputed Hash:</span>
                <div
                  className={`break-all select-all mt-0.5 ${
                    result.leaf_matches_stored ? 'text-emerald-300' : 'text-rose-400 font-bold'
                  }`}
                >
                  {result.recomputed_hash}
                </div>
              </div>
              {result.anchored_root && (
                <div>
                  <span className="text-slate-400">On-Chain Batch Root:</span>
                  <div className="text-purple-300 break-all select-all mt-0.5">
                    {result.anchored_root}
                  </div>
                </div>
              )}
            </div>

            {/* Payload JSON */}
            <div>
              <div className="text-slate-400 font-bold text-[11px] mb-1">RECORD PAYLOAD:</div>
              <pre className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
                {JSON.stringify(log.payload, null, 2)}
              </pre>
            </div>
          </div>
        ) : null}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end font-mono">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
