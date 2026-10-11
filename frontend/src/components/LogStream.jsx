'use client';

import React, { useState } from 'react';
import {
  Link as LinkIcon,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Search,
  Filter,
  ExternalLink,
  ChevronRight,
  Fingerprint,
} from 'lucide-react';

const DEPARTMENT_BADGES = {
  LAND_REGISTRY: {
    label: 'Land Registry',
    color: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40',
  },
  MINISTRY_OF_FINANCE: {
    label: 'Ministry of Finance',
    color: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40',
  },
  NATIONAL_SECURITY: {
    label: 'National Security',
    color: 'bg-purple-950/80 text-purple-400 border-purple-500/40',
  },
  JUDICIARY_RECORDS: {
    label: 'Judiciary Records',
    color: 'bg-amber-950/80 text-amber-400 border-amber-500/40',
  },
  HEALTH_REGISTRY: {
    label: 'Health & Biometrics',
    color: 'bg-rose-950/80 text-rose-400 border-rose-500/40',
  },
};

export default function LogStream({ logs, onSelectLog, onTamperSingleLog }) {
  const [filterDept, setFilterDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const departments = [
    'ALL',
    'LAND_REGISTRY',
    'MINISTRY_OF_FINANCE',
    'NATIONAL_SECURITY',
    'JUDICIARY_RECORDS',
    'HEALTH_REGISTRY',
  ];

  const filteredLogs = (logs || []).filter((log) => {
    const matchesDept = filterDept === 'ALL' || log.department === filterDept;
    const matchesSearch =
      searchQuery === '' ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      JSON.stringify(log.payload).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="bg-cyber-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden mb-8">
      {/* Header and Filter Controls */}
      <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold font-mono tracking-wider text-slate-200 uppercase">
              Live Ingestion & SHA-256 Hash-Chain Stream
            </h2>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Cryptographically linked ledger. Any alteration cascades through subsequent hashes.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs, actions, IDs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 w-52"
            />
          </div>

          {/* Department dropdown */}
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept === 'ALL' ? 'ALL DEPARTMENTS' : dept.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Feed */}
      <div className="divide-y divide-slate-800/80 max-h-[600px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 font-mono text-xs">
            No audit logs found matching criteria.
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const deptInfo = DEPARTMENT_BADGES[log.department] || {
              label: log.department,
              color: 'bg-slate-800 text-slate-300 border-slate-700',
            };

            const isTampered = log.is_tampered;
            const isAnchored = log.batch_id !== null;

            return (
              <div
                key={log.id}
                className={`p-4 transition-all relative ${
                  isTampered
                    ? 'bg-rose-950/30 hover:bg-rose-950/40 border-l-4 border-l-rose-500'
                    : 'hover:bg-slate-800/30 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Left Column: Department, ID, Sequence, Action */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-mono text-xs font-bold text-slate-400">
                        #{String(log.sequence_num).padStart(3, '0')}
                      </span>

                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${deptInfo.color}`}
                      >
                        {deptInfo.label}
                      </span>

                      <span className="font-mono text-xs font-bold text-slate-200">{log.id}</span>

                      {isAnchored ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300">
                          ANCHORED // BATCH #{log.batch_id}
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300">
                          PENDING BATCH
                        </span>
                      )}

                      {isTampered && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-600 text-black font-black animate-pulse">
                          TAMPER DETECTED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-300">
                        {log.action}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        by <span className="text-slate-300 font-semibold">{log.actor}</span> ({log.ip_address})
                      </span>
                    </div>

                    {/* Structured Payload summary */}
                    <div className="bg-slate-950/70 border border-slate-800/80 rounded-lg p-2.5 font-mono text-[11px] text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                      {Object.entries(log.payload).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-1">
                          <span className="text-slate-400">{k}:</span>
                          <span
                            className={
                              isTampered && typeof v === 'string' && v.includes('UNAUTHORIZED')
                                ? 'text-rose-400 font-bold bg-rose-950/80 px-1 rounded'
                                : 'text-slate-200 font-medium'
                            }
                          >
                            {String(v)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* SHA-256 Hash Chain Visualizer */}
                    <div className="font-mono text-[10px] text-slate-400 flex flex-wrap items-center gap-2 pt-1">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">PREV HASH:</span>
                        <span className="text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {log.previous_hash.slice(0, 16)}...
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">CURRENT HASH:</span>
                        <span
                          className={`px-1.5 py-0.5 rounded border ${
                            isTampered
                              ? 'text-rose-400 bg-rose-950/60 border-rose-700 font-bold'
                              : 'text-cyan-400 bg-cyan-950/40 border-cyan-800'
                          }`}
                        >
                          {log.current_hash.slice(0, 20)}...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-2 shrink-0 pt-2 lg:pt-0">
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectLog(log)}
                        className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 hover:border-cyan-500/50 flex items-center gap-1.5 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <span>VERIFY PROOF</span>
                      </button>

                      {!isTampered && (
                        <button
                          onClick={() => onTamperSingleLog(log.id)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-mono bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 border border-rose-800/50 transition-colors"
                          title="Simulate Tamper on this specific log"
                        >
                          TAMPER
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
