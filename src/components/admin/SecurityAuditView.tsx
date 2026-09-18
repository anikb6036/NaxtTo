import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  AlertTriangle, 
  CheckCircle2, 
  Server, 
  Clock, 
  UserCheck,
  RefreshCw
} from 'lucide-react';

export const SecurityAuditView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Security, Access &amp; Compliance Audit</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time monitoring of authentication attempts, rate limiting, and administrative session credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Brute-Force Guard</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              ACTIVE
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900">4 Attempts / 15m Lockout</p>
          <p className="text-xs text-slate-500">
            IP and identifier rate limiting enforces immediate lockout upon repeated invalid passkey submissions.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Positive Verification</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
              ENFORCED
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900">Strict Non-Empty Matching</p>
          <p className="text-xs text-slate-500">
            Rejects whitespace, negative credentials, and malformed strings. Validates strictly against credential vault.
          </p>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Segregation</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
              STRICT RBAC
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900">Admin vs Seller Isolation</p>
          <p className="text-xs text-slate-500">
            Seller accounts are restricted to inventory and fulfillment; patron and platform governance restricted to Admin.
          </p>
        </div>
      </div>

      {/* Authorized Staff Directory */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-amber-600" />
          <span>Authorized Administrative &amp; Guild Passkeys</span>
        </h2>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">Master Atelier Administrator</span>
              <p className="text-slate-500 text-[11px]">Primary Account: <strong className="font-mono text-slate-800">anik</strong> or <strong className="font-mono text-slate-800">baidyaanik18@gmail.com</strong></p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Full Platform Access
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900">Verified Artisan Partner Guilds</span>
              <p className="text-slate-500 text-[11px]">Portal Roles: <strong className="font-mono text-slate-800">seller</strong>, <strong className="font-mono text-slate-800">artisan</strong>, <strong className="font-mono text-slate-800">curator</strong></p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              Seller Hub Scoped
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
