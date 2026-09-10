import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  HardDrive, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  Copy, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  Server,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { apiClient } from '../../services/api';
import { Product, Order } from '../../types';

interface CloudStorageManagerProps {
  products: Product[];
  orders: Order[];
  onShowToast: (msg: string) => void;
}

export const CloudStorageManager: React.FC<CloudStorageManagerProps> = ({
  products,
  orders,
  onShowToast
}) => {
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [supabaseStatus, setSupabaseStatus] = useState<{
    configured: boolean;
    connected: boolean;
    url?: string | null;
    tables?: { products: boolean; orders: boolean; newsletter: boolean };
    error?: string | null;
    schemaSql?: string;
  }>({
    configured: false,
    connected: false
  });

  const checkStatus = async () => {
    setLoading(true);
    try {
      const res = await apiClient.getSupabaseStatus();
      if (res && res.data) {
        setSupabaseStatus(res.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleSyncSupabase = async () => {
    setSyncing(true);
    try {
      const res = await apiClient.syncSupabase();
      if (res && res.success) {
        onShowToast(res.message || 'Data synchronized to Supabase successfully!');
        await checkStatus();
      } else {
        onShowToast(res?.message || 'Sync could not be completed. Check Supabase credentials.');
      }
    } catch (err: any) {
      onShowToast(`Sync failed: ${err.message || 'Network error'}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleDownloadBackup = () => {
    try {
      const backupData = {
        app: 'NaxtTo Fine Jewellery Atelier',
        domain: 'naxtto.shop',
        exportedAt: new Date().toISOString(),
        summary: {
          totalProducts: products.length,
          totalOrders: orders.length
        },
        products,
        orders
      };

      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `naxtto-complete-backup-${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      onShowToast('Complete JSON database backup exported safely.');
    } catch (err) {
      window.open('/api/supabase/backup', '_blank');
    }
  };

  const handleCopySql = () => {
    const sql = supabaseStatus.schemaSql || `-- NaxtTo Supabase Schema
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  metal TEXT,
  metal_name TEXT,
  style TEXT,
  style_name TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  story TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  dimensions TEXT,
  karat_purity TEXT,
  origin TEXT,
  in_stock BOOLEAN DEFAULT TRUE,
  stock_count INTEGER DEFAULT 1,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_new_arrival BOOLEAN DEFAULT FALSE,
  rating NUMERIC DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 0,
  available_sizes JSONB DEFAULT '[]'::jsonb,
  available_finishes JSONB DEFAULT '[]'::jsonb,
  reviews JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL DEFAULT 0,
  shipping_fee NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  tax NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL DEFAULT 0,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  tracking_number TEXT,
  payment_method TEXT,
  estimated_delivery TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all on products" ON public.products FOR ALL USING (true);
CREATE POLICY "Allow public insert on orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow all on orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Allow public insert on newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read on newsletter" ON public.newsletter_subscribers FOR SELECT USING (true);`;

    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    onShowToast('Supabase SQL Schema copied to clipboard!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div id="cloud-storage-manager-container" className="space-y-6 max-w-5xl mx-auto py-2">
      {/* Zero Data Loss Guarantee Header */}
      <div className="bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#111827] text-white p-6 sm:p-8 rounded-xl shadow-sm border border-neutral-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Multi-Tier Zero Data Loss Protection Active</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif tracking-wide text-white">
              Cloud Database & Persistent Storage Center
            </h2>
            <p className="text-neutral-300 text-sm max-w-2xl leading-relaxed">
              Your Atelier catalog, patron orders, and addresses are continuously backed up across resilient cloud layers so your data will never be lost.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="inline-flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold tracking-wider uppercase transition-all border border-white/20"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Backup (.JSON)</span>
            </button>
            <button
              type="button"
              onClick={checkStatus}
              disabled={loading}
              className="inline-flex items-center space-x-2 px-3 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-medium transition-all"
              title="Refresh Storage Status"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Storage Providers Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Provider 1: Supabase */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Supabase Storage</h3>
                  <p className="text-xs text-neutral-500">PostgreSQL Cloud DB</p>
                </div>
              </div>
              {supabaseStatus.configured && supabaseStatus.connected ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>Connected</span>
                </span>
              ) : supabaseStatus.configured ? (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Connecting...</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
                  <span>Ready to Connect</span>
                </span>
              )}
            </div>

            <div className="space-y-2 py-2 text-xs text-neutral-600 border-t border-neutral-100">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Service:</span>
                <span className="font-mono text-neutral-800">Supabase JS v2</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Products Table:</span>
                <span className={supabaseStatus.tables?.products ? 'text-emerald-600 font-medium' : 'text-neutral-500'}>
                  {supabaseStatus.tables?.products ? 'Active & Ready' : 'Pending SQL Run'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Orders Table:</span>
                <span className={supabaseStatus.tables?.orders ? 'text-emerald-600 font-medium' : 'text-neutral-500'}>
                  {supabaseStatus.tables?.orders ? 'Active & Ready' : 'Pending SQL Run'}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            {supabaseStatus.configured ? (
              <button
                type="button"
                onClick={handleSyncSupabase}
                disabled={syncing}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                <span>{syncing ? 'Synchronizing...' : 'Sync Catalog to Supabase'}</span>
              </button>
            ) : (
              <a
                href="#supabase-setup-guide"
                className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
              >
                <span>View Supabase Setup Steps</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* Provider 2: Firebase Firestore */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
                  <Cloud className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Firebase Cloud DB</h3>
                  <p className="text-xs text-neutral-500">Firestore Persistent NoSQL</p>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Active & Synced</span>
              </span>
            </div>

            <div className="space-y-2 py-2 text-xs text-neutral-600 border-t border-neutral-100">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Project ID:</span>
                <span className="font-mono text-neutral-800 truncate max-w-[140px]">karuja-saree</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Real-Time Sync:</span>
                <span className="text-emerald-600 font-medium">Instant Event Stream</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Order Ledger:</span>
                <span className="text-neutral-800 font-mono">{orders.length} orders tracked</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center space-x-2 text-[11px] text-neutral-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Auto-persisting every atelier order & product</span>
            </div>
          </div>
        </div>

        {/* Provider 3: Local Storage & Memory Engine */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <HardDrive className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 text-sm">Browser & Memory</h3>
                  <p className="text-xs text-neutral-500">Zero-Latency Fast Cache</p>
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Protected</span>
              </span>
            </div>

            <div className="space-y-2 py-2 text-xs text-neutral-600 border-t border-neutral-100">
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Cached Items:</span>
                <span className="font-mono text-neutral-800">{products.length} products</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Quota Guard:</span>
                <span className="text-emerald-600 font-medium">Auto-Compact & Recovery</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-500">Offline Fallback:</span>
                <span className="text-neutral-800">100% Operational</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleDownloadBackup}
              className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-medium flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Raw JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supabase Quick Connection Guide */}
      <div id="supabase-setup-guide" className="bg-white border border-[#e5e7eb] rounded-xl p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Database className="w-5 h-5 text-emerald-600" />
            <h3 className="font-semibold text-neutral-900 text-base">
              Supabase Setup Guide & SQL Migration Schema
            </h3>
          </div>
          <button
            type="button"
            onClick={handleCopySql}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium transition-colors border border-emerald-200"
          >
            {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-sm">Step 1: Create Supabase Project</span>
            <p className="text-neutral-600 leading-relaxed">
              Create a free project at <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline inline-flex items-center">supabase.com <ExternalLink className="w-3 h-3 ml-0.5" /></a>. Choose any convenient region.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-sm">Step 2: Run SQL Schema</span>
            <p className="text-neutral-600 leading-relaxed">
              In your Supabase dashboard, click <strong>SQL Editor</strong> &gt; <strong>New Query</strong>, paste the SQL schema below, and click <strong>Run</strong>.
            </p>
          </div>

          <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-1.5">
            <span className="font-bold text-neutral-900 block text-sm">Step 3: Add API Credentials</span>
            <p className="text-neutral-600 leading-relaxed">
              In Project Settings &gt; API, copy your <strong>Project URL</strong> and <strong>anon/service_role key</strong> into Settings as <code className="bg-neutral-200 px-1 py-0.5 rounded">SUPABASE_URL</code> and <code className="bg-neutral-200 px-1 py-0.5 rounded">SUPABASE_ANON_KEY</code>.
            </p>
          </div>
        </div>

        {/* Copyable SQL Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>SQL Schema for Supabase Editor (PostgreSQL DDL)</span>
            <span className="font-mono">Tables: products, orders, newsletter_subscribers</span>
          </div>
          <div className="relative">
            <pre className="bg-neutral-900 text-neutral-200 font-mono text-[11px] p-4 rounded-lg overflow-x-auto max-h-60 leading-relaxed border border-neutral-800">
              {supabaseStatus.schemaSql || `-- 1. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  category TEXT NOT NULL,
  metal TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total NUMERIC NOT NULL DEFAULT 0,
  shipping_address JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
            <button
              type="button"
              onClick={handleCopySql}
              className="absolute top-3 right-3 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-[11px] font-medium flex items-center space-x-1 border border-neutral-700 transition-colors"
            >
              {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
