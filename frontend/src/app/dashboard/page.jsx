'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import ModuleA_LogIngestion from '../../components/ModuleA_LogIngestion';
import ModuleB_CryptoChain from '../../components/ModuleB_CryptoChain';
import ModuleC_BlockchainAnchoring from '../../components/ModuleC_BlockchainAnchoring';
import ModuleD_AuditBreachSim from '../../components/ModuleD_AuditBreachSim';
import SettingsPanel from '../../components/SettingsPanel';
import VerificationModal from '../../components/VerificationModal';

import {
  ShieldCheck,
  ShieldAlert,
  Database,
  Link as LinkIcon,
  Layers,
  Settings,
  Cpu,
  RefreshCw,
  LogOut,
  User,
  Activity,
  Sun,
  Moon,
  ChevronRight,
  Fingerprint,
} from 'lucide-react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';

export default function DashboardPage() {
  const router = useRouter();
  const { user, theme, toggleTheme, logout, isLoading: authLoading } = useAuth();

  const [activeModule, setActiveModule] = useState('MODULE_A'); // 'MODULE_A', 'MODULE_B', 'MODULE_C', 'MODULE_D', 'SETTINGS'
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [batches, setBatches] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [selectedLogForAudit, setSelectedLogForAudit] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch telemetry from backend
  const fetchData = useCallback(async () => {
    try {
      const [statsRes, logsRes, batchesRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/stats`),
        fetch(`${BACKEND_URL}/api/logs`),
        fetch(`${BACKEND_URL}/api/batches`),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (logsRes.ok) {
        const lData = await logsRes.json();
        setLogs(lData.logs || []);
      }
      if (batchesRes.ok) {
        const bData = await batchesRes.json();
        setBatches(bData.batches || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard telemetry:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await fetchData();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleSimulateFeed = async () => {
    setLoadingAction('feed');
    try {
      await fetch(`${BACKEND_URL}/api/logs/simulate_feed`, { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleIngestCustom = async (customLogData) => {
    try {
      await fetch(`${BACKEND_URL}/api/logs/ingest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customLogData),
      });
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleForceAnchor = async () => {
    setLoadingAction('anchor');
    try {
      await fetch(`${BACKEND_URL}/api/batches/anchor`, { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleTamper = async () => {
    setLoadingAction('tamper');
    try {
      await fetch(`${BACKEND_URL}/api/tamper/simulate`, { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRestore = async () => {
    setLoadingAction('restore');
    try {
      await fetch(`${BACKEND_URL}/api/tamper/restore`, { method: 'POST' });
      await fetchData();
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center font-mono text-xs text-cyan-400">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" />
        <span>AUTHENTICATING SECURE TERMINAL...</span>
      </div>
    );
  }

  const isHealthy = stats?.is_valid ?? true;
  const evmOnline = stats?.evm_network?.connected ?? false;
  const blockNum = stats?.evm_network?.block_number ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Persistent Left Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col justify-between shrink-0 sticky top-0 h-screen z-30">
        <div>
          {/* Brand Logo */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/40 text-cyan-500 flex items-center justify-center font-mono font-bold shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black font-mono tracking-wider text-slate-900 dark:text-slate-100">
                GOVCHAIN <span className="text-cyan-500">SENTINEL</span>
              </div>
              <div className="text-[10px] font-mono text-slate-400">SOC AUDIT CONSOLE</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 font-mono text-xs">
            <button
              onClick={() => setActiveModule('MODULE_A')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold transition-all ${
                activeModule === 'MODULE_A'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4" />
                <span>Live Ingestion</span>
              </div>
              <span className="text-[10px] opacity-75">MOD A</span>
            </button>

            <button
              onClick={() => setActiveModule('MODULE_B')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold transition-all ${
                activeModule === 'MODULE_B'
                  ? 'bg-cyan-500 text-black shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LinkIcon className="w-4 h-4" />
                <span>Crypto Hash Chain</span>
              </div>
              <span className="text-[10px] opacity-75">MOD B</span>
            </button>

            <button
              onClick={() => setActiveModule('MODULE_C')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold transition-all ${
                activeModule === 'MODULE_C'
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-4 h-4" />
                <span>EVM Anchoring</span>
              </div>
              <span className="text-[10px] opacity-75">MOD C</span>
            </button>

            <button
              onClick={() => setActiveModule('MODULE_D')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold transition-all ${
                activeModule === 'MODULE_D'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Audit & Breach Sim</span>
              </div>
              <span className="text-[10px] opacity-75">MOD D</span>
            </button>

            <div className="pt-2">
              <button
                onClick={() => setActiveModule('SETTINGS')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-bold transition-all ${
                  activeModule === 'SETTINGS'
                    ? 'bg-slate-800 text-cyan-400 shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4" />
                  <span>Settings & Session</span>
                </div>
                <span className="text-[10px] opacity-75">CONF</span>
              </button>
            </div>
          </nav>
        </div>

        {/* User Card in Sidebar Bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300 font-mono text-xs font-bold">
                {user.fullName.slice(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold font-mono text-slate-900 dark:text-slate-100 truncate">
                  {user.fullName}
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate">{user.email}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
              title="Logout Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono mt-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="text-slate-400">ROLE:</span>
            {user.role === 'admin' ? (
              <span className="text-purple-600 dark:text-purple-400 font-bold">ADMIN (CONTROLLER)</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">AUDITOR (FIELD)</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Status Bar */}
        <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-20 px-6 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">SENTINEL</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-900 dark:text-slate-100 font-bold uppercase">
                {activeModule.replace('_', ' ')}
              </span>
            </div>

            {/* Live Status Indicators */}
            <div className="flex items-center flex-wrap gap-2.5">
              {/* Integrity Pill */}
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition-all ${
                  isHealthy
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 animate-pulse'
                }`}
              >
                {isHealthy ? <ShieldCheck className="w-3.5 h-3.5" /> : <ShieldAlert className="w-3.5 h-3.5" />}
                <span>{isHealthy ? 'INTEGRITY: 100% SECURE' : 'BREACH DETECTED'}</span>
              </div>

              {/* EVM Node Status */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <Cpu className={`w-3.5 h-3.5 ${evmOnline ? 'text-cyan-500' : 'text-amber-500'}`} />
                <span>EVM LOCALHOST</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span className="text-cyan-500">BLK #{blockNum}</span>
              </div>

              {/* Day/Night Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-cyan-500 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
              </button>

              {/* Sync Button */}
              <button
                onClick={handleManualSync}
                disabled={isRefreshing}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
                <span>SYNC</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Dynamic View Body */}
        <main className="p-6 max-w-7xl w-full mx-auto space-y-6">
          {activeModule === 'MODULE_A' && (
            <ModuleA_LogIngestion
              logs={logs}
              onSelectLog={(l) => setSelectedLogForAudit(l)}
              onSimulateFeed={handleSimulateFeed}
              onIngestCustom={handleIngestCustom}
              isLoadingFeed={loadingAction === 'feed'}
              userRole={user.role}
            />
          )}

          {activeModule === 'MODULE_B' && (
            <ModuleB_CryptoChain
              logs={logs}
              onSelectLog={(l) => setSelectedLogForAudit(l)}
            />
          )}

          {activeModule === 'MODULE_C' && (
            <ModuleC_BlockchainAnchoring
              batches={batches}
              logs={logs}
              onSelectLog={(l) => setSelectedLogForAudit(l)}
              onForceAnchor={handleForceAnchor}
              isLoadingAnchor={loadingAction === 'anchor'}
              userRole={user.role}
            />
          )}

          {activeModule === 'MODULE_D' && (
            <ModuleD_AuditBreachSim
              stats={stats}
              logs={logs}
              onTamper={handleTamper}
              onRestore={handleRestore}
              onSelectLog={(l) => setSelectedLogForAudit(l)}
              isLoadingAction={loadingAction}
              userRole={user.role}
            />
          )}

          {activeModule === 'SETTINGS' && <SettingsPanel />}
        </main>
      </div>

      {/* 3-Tier Proof Verification Modal */}
      {selectedLogForAudit && (
        <VerificationModal
          log={selectedLogForAudit}
          onClose={() => setSelectedLogForAudit(null)}
          backendUrl={BACKEND_URL}
        />
      )}
    </div>
  );
}
