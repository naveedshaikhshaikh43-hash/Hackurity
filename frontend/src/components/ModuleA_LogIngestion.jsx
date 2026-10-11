'use client';

import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  PlusCircle,
  Upload,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Shield,
  Fingerprint,
  Calendar,
  User,
  Activity,
} from 'lucide-react';
import { sanitizeInput } from '../context/AuthContext';

const DEPARTMENT_BADGES = {
  LAND_REGISTRY: {
    label: 'Land Registry',
    badge: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30',
  },
  MINISTRY_OF_FINANCE: {
    label: 'Ministry of Finance',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
  },
  NATIONAL_SECURITY: {
    label: 'National Security',
    badge: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30',
  },
  JUDICIARY_RECORDS: {
    label: 'Judiciary Records',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30',
  },
  HEALTH_REGISTRY: {
    label: 'Health & Biometrics',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30',
  },
};

export default function ModuleA_LogIngestion({
  logs,
  onSelectLog,
  onSimulateFeed,
  onIngestCustom,
  isLoadingFeed,
  userRole,
}) {
  const [filterDept, setFilterDept] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importNotice, setImportNotice] = useState(null);

  // Custom log form state
  const [customDept, setCustomDept] = useState('MINISTRY_OF_FINANCE');
  const [customAction, setCustomAction] = useState('TREASURY_DISBURSEMENT');
  const [customActor, setCustomActor] = useState('Officer_Vance');
  const [customPayloadKey, setCustomPayloadKey] = useState('amount_usd');
  const [customPayloadVal, setCustomPayloadVal] = useState('500000');

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

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    const sanitizedAction = sanitizeInput(customAction).sanitized;
    const sanitizedActor = sanitizeInput(customActor).sanitized;

    const payloadObj = {};
    payloadObj[sanitizeInput(customPayloadKey).sanitized || 'record'] =
      sanitizeInput(customPayloadVal).sanitized || 'verified';

    onIngestCustom({
      department: customDept,
      action: sanitizedAction || 'GOV_ACTION',
      actor: sanitizedActor || 'Field_Officer',
      payload: payloadObj,
      security_level: 'RESTRICTED',
    });

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-mono text-[10px] font-bold">
              MODULE A
            </span>
            <h2 className="text-base font-black font-mono text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Live Government Log Ingestion Engine
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
            Streaming real-time municipal & federal log entries with instant SHA-256 cascade linkage.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Simulate Feed Button */}
          <button
            onClick={onSimulateFeed}
            disabled={isLoadingFeed}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-sm transition-all active:scale-95"
          >
            <Activity className={`w-3.5 h-3.5 ${isLoadingFeed ? 'animate-spin' : ''}`} />
            <span>SIMULATE INCOMING TELEMETRY</span>
          </button>

          {/* Ingest Custom Event (Admin / Authorized) */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-500" />
            <span>INGEST CUSTOM EVENT</span>
          </button>

          {/* Dummy Placeholder: Historical CSV/JSON Import */}
          <button
            onClick={() => {
              setImportNotice('Future Pipeline Hook: CSV/JSON ETL batch importer is ready for agency adapter connection.');
              setTimeout(() => setImportNotice(null), 5000);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            title="Import agency historical data"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>IMPORT BATCH (ETL)</span>
          </button>
        </div>
      </div>

      {/* Import Notice Banner */}
      {importNotice && (
        <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-300 text-xs font-mono flex items-center justify-between animate-fade-in">
          <span>{importNotice}</span>
          <button onClick={() => setImportNotice(null)} className="text-cyan-400 hover:text-cyan-200 text-xs">&times;</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Log ID, Action, Officer, or Payload keys..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Department Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'ALL' ? 'ALL DEPARTMENTS' : d.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Seq / ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Action & Officer</th>
                <th className="py-3 px-4">Payload Summary</th>
                <th className="py-3 px-4">Hash Chain Status</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-mono text-xs">
                    No matching government records found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dept = DEPARTMENT_BADGES[log.department] || {
                    label: log.department,
                    badge: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
                  };
                  const isTampered = log.is_tampered;
                  const isAnchored = log.batch_id !== null;

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-850/50 transition-colors ${
                        isTampered ? 'bg-rose-500/5 dark:bg-rose-950/20' : ''
                      }`}
                    >
                      {/* Seq / ID */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{log.id}</div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${dept.badge}`}>
                          {dept.label}
                        </span>
                      </td>

                      {/* Action & Officer */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-cyan-600 dark:text-cyan-400">{log.action}</div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                          <User className="w-3 h-3" />
                          <span>{log.actor}</span>
                          <span className="text-slate-400">({log.ip_address})</span>
                        </div>
                      </td>

                      {/* Payload Summary */}
                      <td className="py-3.5 px-4 max-w-xs truncate">
                        <div className="bg-slate-100 dark:bg-slate-950 px-2 py-1 rounded text-[11px] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                          {Object.entries(log.payload)
                            .slice(0, 2)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' | ')}
                        </div>
                      </td>

                      {/* Hash Chain Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isTampered ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500 text-black font-black text-[10px] animate-pulse">
                            HASH BROKEN
                          </span>
                        ) : isAnchored ? (
                          <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-[10px]">
                            ANCHORED #B{log.batch_id}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 text-[10px]">
                            CHAIN PENDING
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectLog(log)}
                          className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-cyan-600 dark:text-cyan-400 border border-slate-300 dark:border-slate-700 transition-colors"
                        >
                          VERIFY PROOF
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ingest Custom Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-base font-black font-mono text-slate-900 dark:text-slate-100 uppercase mb-1">
              Ingest Custom Government Event
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-4">
              Simulates real agency ingestion with automatic SHA-256 cascade linkage.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">DEPARTMENT</label>
                <select
                  value={customDept}
                  onChange={(e) => setCustomDept(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                >
                  <option value="MINISTRY_OF_FINANCE">Ministry of Finance</option>
                  <option value="LAND_REGISTRY">Land Registry</option>
                  <option value="NATIONAL_SECURITY">National Security</option>
                  <option value="JUDICIARY_RECORDS">Judiciary Records</option>
                  <option value="HEALTH_REGISTRY">Health Registry</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">ACTION NAME</label>
                <input
                  type="text"
                  required
                  value={customAction}
                  onChange={(e) => setCustomAction(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">OFFICER / AGENT</label>
                <input
                  type="text"
                  required
                  value={customActor}
                  onChange={(e) => setCustomActor(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">PAYLOAD KEY</label>
                  <input
                    type="text"
                    required
                    value={customPayloadKey}
                    onChange={(e) => setCustomPayloadKey(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">PAYLOAD VALUE</label>
                  <input
                    type="text"
                    required
                    value={customPayloadVal}
                    onChange={(e) => setCustomPayloadVal(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
                >
                  INGEST & CHAIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
