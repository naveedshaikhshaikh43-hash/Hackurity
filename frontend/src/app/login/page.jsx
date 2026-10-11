'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useAuth,
  sanitizeInput,
  calculatePasswordStrength,
} from '../../context/AuthContext';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Mail,
  User,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Cpu,
  Fingerprint,
  Zap,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, register, theme, toggleTheme } = useAuth();

  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('admin'); // 'admin' or 'user'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Security & Sanitization states
  const [xssAlert, setXssAlert] = useState(null);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const strength = calculatePasswordStrength(password);
  const passwordsMatch = mode === 'register' ? password && password === confirmPassword : true;

  // Handle Input Changes with strict sanitization checks
  const handleNameChange = (e) => {
    const val = e.target.value;
    const { sanitized, hasDangerousCharacters } = sanitizeInput(val);
    if (hasDangerousCharacters) {
      setXssAlert('Security Warning: HTML/Script injection characters were detected and blocked!');
    } else {
      setXssAlert(null);
    }
    setFullName(sanitized);
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    const { sanitized, hasDangerousCharacters } = sanitizeInput(val);
    if (hasDangerousCharacters) {
      setXssAlert('Security Warning: Malicious input characters detected in email field!');
    } else {
      setXssAlert(null);
    }
    setEmail(sanitized);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    // Don't strip password symbols, but check for raw script tags
    if (/<script|javascript:|onload=/i.test(val)) {
      setXssAlert('Security Warning: Script injection pattern rejected in password!');
      return;
    }
    setXssAlert(null);
    setPassword(val);
  };

  const handleConfirmPasswordChange = (e) => {
    const val = e.target.value;
    if (/<script|javascript:|onload=/i.test(val)) {
      setXssAlert('Security Warning: Script injection pattern rejected in confirm password!');
      return;
    }
    setXssAlert(null);
    setConfirmPassword(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    // Strict validation
    if (!email) {
      setError('Please provide a valid agency email address.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format. Must follow standard RFC email specifications.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (mode === 'register') {
      if (!fullName) {
        setError('Full Name is required for agency personnel registration.');
        return;
      }

      if (strength.score < 2) {
        setError('Password strength is insufficient. Minimum 8 characters with numbers or symbols required.');
        return;
      }

      if (password !== confirmPassword) {
        setError('Password and Re-enter Password fields do not match.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      if (mode === 'register') {
        register({ fullName, email, password, role });
        setSuccessMsg(`Account created successfully as ${role === 'admin' ? 'Admin' : 'Normal User'}! Redirecting to dashboard...`);
      } else {
        login({ email, password, role, fullName: fullName || (role === 'admin' ? 'System Security Controller' : 'Agency Field Auditor') });
        setSuccessMsg(`Authenticated successfully as ${role === 'admin' ? 'Admin' : 'Normal User'}! Redirecting to dashboard...`);
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 700);
    } catch (err) {
      setError('Authentication failed. Check your security credentials.');
      setIsSubmitting(false);
    }
  };

  // Quick 1-Click Demo Login for Hackathon Judges
  const handleQuickDemo = (demoRole) => {
    if (demoRole === 'admin') {
      login({
        fullName: 'Commander Sarah Vance',
        email: 'admin@sentinel.gov',
        password: 'Admin@2026!SecOps',
        role: 'admin',
      });
    } else {
      login({
        fullName: 'Inspector Marcus Reed',
        email: 'auditor@sentinel.gov',
        password: 'Auditor@2026!Inspect',
        role: 'user',
      });
    }
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-cyber-grid flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-200">
      {/* Top Banner with back link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-xs font-mono text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 flex items-center gap-1.5 transition-colors"
        >
          <span>&larr; BACK TO PUBLIC LANDING</span>
        </Link>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          TLS 1.3 // AES-256
        </span>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg px-4">
        {/* Card Header */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-t-2xl p-6 sm:p-8 pb-4 text-center shadow-xl">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 dark:bg-cyan-950 border border-cyan-500/40 text-cyan-500 mx-auto flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            GovChain Sentinel // Access Portal
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">
            Role-Based Access Control & Input-Sanitized Authentication
          </p>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 mt-6 p-1 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
                setXssAlert(null);
              }}
              className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              SECURE SIGN IN
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
                setXssAlert(null);
              }}
              className={`py-2 text-xs font-mono font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              REGISTER PERSONNEL
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="bg-white dark:bg-slate-900 border-x border-b border-slate-200 dark:border-slate-800 rounded-b-2xl p-6 sm:p-8 pt-4 shadow-xl">
          {/* XSS / Injection Alert Banner */}
          {xssAlert && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{xssAlert}</span>
            </div>
          )}

          {/* General Error Banner */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/40 text-rose-600 dark:text-rose-400 text-xs font-mono flex items-start gap-2">
              <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-xs font-mono flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (in Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  FULL NAME (OFFICIAL PERSONNEL)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={handleNameChange}
                    placeholder="e.g. Inspector Marcus Reed"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                AGENCY EMAIL ADDRESS
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="e.g. officer@agency.sentinel.gov"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Role Selection Dropdown */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                SECURITY ROLE & PRIVILEGE LEVEL
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 focus:outline-none focus:border-cyan-500"
                >
                  <option value="user">Normal User (Auditor / Agency Officer)</option>
                  <option value="admin">Admin (System Security Controller)</option>
                </select>
              </div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                {role === 'admin'
                  ? '🔒 Admin role grants authorization to simulate tamper events and force on-chain batch anchors.'
                  : '👁️ Normal User role provides read-only audit streams and mathematical verification.'}
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                PASSWORD
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-10 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-500 dark:text-slate-400">STRENGTH:</span>
                    <span className={`font-bold ${strength.textColor}`}>{strength.label}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Re-enter Password (in Register mode) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mb-1">
                  RE-ENTER PASSWORD
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-10 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Match indicator */}
                {confirmPassword && (
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] font-mono">
                    {passwordsMatch ? (
                      <span className="text-emerald-500 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Passwords match
                      </span>
                    ) : (
                      <span className="text-rose-500 flex items-center gap-1 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Passwords do not match
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-mono font-bold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
            >
              <span>{mode === 'login' ? 'AUTHENTICATE & ENTER' : 'CREATE ACCOUNT & ENTER'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Section for Judges */}
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="text-center font-mono text-[11px] text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>HACKATHON JUDGE 1-CLICK DEMO ACCESS:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 transition-colors"
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>SIGN IN AS ADMIN</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-mono font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-emerald-600 dark:text-emerald-400 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>SIGN IN AS AUDITOR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
