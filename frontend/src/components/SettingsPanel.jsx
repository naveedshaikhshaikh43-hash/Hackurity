'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Sun,
  Moon,
  Clock,
  Globe,
  Key,
  Shield,
  User,
  Mail,
  LogOut,
  Users,
  Cpu,
  CheckCircle2,
  Lock,
  Terminal,
} from 'lucide-react';

export default function SettingsPanel() {
  const { user, theme, toggleTheme, logout, switchAccount } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-lg font-black font-mono tracking-wider text-slate-900 dark:text-slate-100 uppercase">
          Sentinel System Settings & Session Governance
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
          Manage local SOC preferences, inspect cryptographic session context, and manage account credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 1: Day/Night Theme Switcher */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
                Feature 1: Day / Night Display Mode
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Current mode: <span className="font-bold uppercase text-cyan-500">{theme} SOC Mode</span>
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
            Toggle between the high-contrast Cybersecurity Dark SOC palette (`bg-slate-950` with vibrant neon accents) 
            and the clean Daylight Audit mode for bright office environments.
          </p>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>SWITCH TO DAYLIGHT AUDIT MODE (LIGHT)</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-cyan-400" />
                <span>SWITCH TO CYBER DEFENSE SOC (DARK)</span>
              </>
            )}
          </button>
        </div>

        {/* Feature 2: Current Login Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
                Feature 2: Current Session Telemetry
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Real-time active login context & terminal origin
              </p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Session Start:
              </span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">
                {new Date(user.sessionStart).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Active IP Origin:
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-semibold">
                {user.loginIp}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Auth Method:
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {user.loginMethod}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Token ID:</span>
              <span className="text-slate-600 dark:text-slate-400 text-[10px] truncate max-w-[150px]">
                {user.sessionToken}
              </span>
            </div>
          </div>
        </div>

        {/* Feature 3: Account Details */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
                Feature 3: Officer Credentials & RBAC
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Personnel identity & security clearance tier
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">Official Name:</span>
              <div className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {user.fullName}
              </div>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">Agency Email:</span>
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">Access Role:</span>
                <div className="mt-1">
                  {user.role === 'admin' ? (
                    <span className="px-2.5 py-1 rounded bg-purple-500/10 dark:bg-purple-950/60 border border-purple-500/40 text-purple-600 dark:text-purple-300 font-bold text-xs inline-flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> ADMIN (SYSTEM CONTROLLER)
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 font-bold text-xs inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> NORMAL USER (AUDITOR)
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase">Clearance:</span>
                <div className="text-xs font-bold text-cyan-600 dark:text-cyan-400 mt-1">
                  {user.role === 'admin' ? 'LEVEL 5 // ROOT SEC' : 'LEVEL 3 // AUDITOR'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 4: Session Management */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500">
                <LogOut className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase">
                  Feature 4: Session Termination & Controls
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Secure cryptographic session clearance
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Terminating your session immediately invalidates your temporary SOC token, clears client-side 
              privileges, and safely routes back to the authentication portal.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={switchAccount}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors"
            >
              <Users className="w-3.5 h-3.5" />
              <span>SWITCH ACCOUNT</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-mono font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/40 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>LOGOUT SESSION</span>
            </button>
          </div>
        </div>
      </div>

      {/* EVM Blockchain Hardware Link info */}
      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold mb-1">
          <Terminal className="w-4 h-4" />
          <span>CONNECTED NODE ARCHITECTURE</span>
        </div>
        <div className="text-slate-600 dark:text-slate-400 text-[11px] space-y-1">
          <div>• EVM Localhost Node: <span className="text-slate-800 dark:text-slate-200">http://127.0.0.1:8545 (Hardhat ChainID 31337)</span></div>
          <div>• Contract Address: <span className="text-slate-800 dark:text-slate-200">0x5FbDB2315678afecb367f032d93F642f64180aa3</span></div>
          <div>• Ingestion Engine: <span className="text-slate-800 dark:text-slate-200">Python FastAPI Cryptographic Pipeline (Port 8000)</span></div>
        </div>
      </div>
    </div>
  );
}
