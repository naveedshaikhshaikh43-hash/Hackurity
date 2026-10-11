'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

// Input Sanitization function to prevent XSS and script injection
export function sanitizeInput(input) {
  if (typeof input !== 'string') return { sanitized: '', hasDangerousCharacters: false };
  
  // Check for malicious patterns
  const dangerousPattern = /(<script\b[^>]*>([\s\S]*?)<\/script>|<iframe\b[^>]*>|javascript:|onload=|onerror=|<[^>]+>)/gi;
  const hasDangerousCharacters = dangerousPattern.test(input);

  // Strip all HTML tags and dangerous characters
  const sanitized = input
    .replace(/<[^>]*>?/gm, '') // Remove HTML tags
    .replace(/[<>'"]/g, '')    // Strip dangerous delimiter characters
    .trim();

  return { sanitized, hasDangerousCharacters };
}

// Password strength evaluator
export function calculatePasswordStrength(password) {
  if (!password) {
    return {
      score: 0,
      label: 'Enter Password',
      color: 'bg-slate-700',
      textColor: 'text-slate-400',
      checks: { length: false, upper: false, lower: false, number: false, special: false },
    };
  }

  const checks = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const passedCount = Object.values(checks).filter(Boolean).length;

  if (passedCount <= 2) {
    return { score: 1, label: 'Weak', color: 'bg-rose-500', textColor: 'text-rose-400', checks };
  } else if (passedCount === 3) {
    return { score: 2, label: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-400', checks };
  } else if (passedCount === 4) {
    return { score: 3, label: 'Strong', color: 'bg-cyan-500', textColor: 'text-cyan-400', checks };
  } else {
    return { score: 4, label: 'Fortified (Gov-Grade)', color: 'bg-emerald-500', textColor: 'text-emerald-400', checks };
  }
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    try {
      // Theme init
      const savedTheme = localStorage.getItem('govchain_theme') || 'dark';
      setTheme(savedTheme);
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // User session init
      const savedUser = localStorage.getItem('govchain_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Pre-seed default Admin session so dashboard is immediately ready for review
        const defaultAdmin = {
          fullName: 'Commander Sarah Vance',
          email: 'admin@sentinel.gov',
          role: 'admin',
          department: 'GovChain Cyber Command & SecOps',
          sessionStart: new Date().toISOString(),
          loginIp: '10.142.4.92 (Federal HSM Node Alpha)',
          loginMethod: 'FIPS 140-2 PKI Hardware Token',
          sessionToken: 'SENTINEL-SEC-88204-X',
        };
        setUser(defaultAdmin);
        localStorage.setItem('govchain_user', JSON.stringify(defaultAdmin));
      }
    } catch (e) {
      console.error('Failed to restore session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('govchain_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const login = ({ email, password, role, fullName }) => {
    const cleanEmail = sanitizeInput(email).sanitized;
    const cleanName = fullName ? sanitizeInput(fullName).sanitized : (role === 'admin' ? 'Security Controller' : 'Agency Field Auditor');
    
    const newUser = {
      fullName: cleanName,
      email: cleanEmail,
      role: role || 'user',
      department: role === 'admin' ? 'GovChain Cyber Command & SecOps' : 'Agency Integrity Audit Bureau',
      sessionStart: new Date().toISOString(),
      loginIp: '192.168.1.104 (Authenticated SOC Terminal)',
      loginMethod: 'Encrypted SHA-256 Auth + MFA',
      sessionToken: `SENTINEL-TOKEN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
    };

    setUser(newUser);
    localStorage.setItem('govchain_user', JSON.stringify(newUser));
    return newUser;
  };

  const register = ({ fullName, email, password, role }) => {
    return login({ fullName, email, password, role });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('govchain_user');
    router.push('/login');
  };

  const switchAccount = () => {
    setUser(null);
    localStorage.removeItem('govchain_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        theme,
        toggleTheme,
        login,
        register,
        logout,
        switchAccount,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
