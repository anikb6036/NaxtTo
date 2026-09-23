import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RefreshCw, 
  ExternalLink, 
  Key, 
  ShieldCheck, 
  FileText, 
  Eye, 
  X,
  Package,
  Sparkles,
  Check
} from 'lucide-react';
import { Order } from '../../types';
import { apiClient } from '../../services/api';
import { EmailTemplate, EmailTemplateType } from '../EmailTemplate';

interface ResendMailServiceViewProps {
  orders: Order[];
  adminEmail?: string;
}

interface ResendStatusData {
  success: boolean;
  service: string;
  configured: boolean;
  provider: 'resend' | 'resend-simulated';
  fromEmail: string;
  documentation: string;
  message: string;
}

interface EmailLogItem {
  notificationId: string;
  orderId?: string;
  orderNumber?: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  carrier?: string;
  trackingNumber?: string;
  sentAt: string;
  messageId: string;
  status: 'delivered' | 'sent' | 'failed';
  provider: 'resend' | 'resend-simulated';
  error?: string;
}

export const ResendMailServiceView: React.FC<ResendMailServiceViewProps> = ({
  orders,
  adminEmail = 'baidyaanik18@gmail.com'
}) => {
  const [statusData, setStatusData] = useState<ResendStatusData | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [logs, setLogs] = useState<EmailLogItem[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState<boolean>(false);

  // Test email state
  const [testRecipient, setTestRecipient] = useState<string>(adminEmail);
  const [testCustomMessage, setTestCustomMessage] = useState<string>('Testing Resend mail delivery integration for NaxtTo Atelier.');
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  // Quick order action state
  const [selectedOrderForDispatch, setSelectedOrderForDispatch] = useState<string>(orders[0]?.id || '');
  const [isDispatchingOrderMail, setIsDispatchingOrderMail] = useState<boolean>(false);
  const [orderMailSuccessNotice, setOrderMailSuccessNotice] = useState<string | null>(null);

  // Email template preview state
  const [previewTemplateType, setPreviewTemplateType] = useState<EmailTemplateType>('order_shipped');

  // Email preview modal state
  const [previewHtml, setPreviewHtml] = useState<{ subject: string; recipient: string; id: string } | null>(null);

  const fetchStatus = async () => {
    setIsLoadingStatus(true);
    try {
      const data = await apiClient.getResendStatus();
      if (data) {
        setStatusData(data);
      }
    } catch (err) {
      console.error('Failed to fetch Resend status:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  const fetchLogs = async () => {
    setIsLoadingLogs(true);
    try {
      const data = await apiClient.getEmailLogs();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error('Failed to fetch email logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchLogs();
  }, []);

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testRecipient || !testRecipient.includes('@')) {
      alert('Please provide a valid recipient email address');
      return;
    }
    setIsSendingTest(true);
    setTestResult(null);

    try {
      const res = await apiClient.sendTestEmail(testRecipient, testCustomMessage);
      setTestResult(res);
      fetchLogs();
      fetchStatus();
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Error executing test email'
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleQuickDispatchShipped = async () => {
    const target = orders.find(o => o.id === selectedOrderForDispatch || o.orderNumber === selectedOrderForDispatch);
    if (!target) return;

    setIsDispatchingOrderMail(true);
    setOrderMailSuccessNotice(null);

    try {
      const recipient = target.customerEmail || (target.shippingAddress as any)?.email || adminEmail;
      const res = await apiClient.sendOrderShippedNotification({
        orderId: target.id,
        orderNumber: target.orderNumber || target.id,
        recipientEmail: recipient,
        recipientName: target.shippingAddress?.fullName || 'Valued Patron',
        carrier: 'Blue Dart Apex Secure Armored Transit',
        trackingNumber: target.trackingNumber || `TRACK-NXT-${target.id}`,
        items: (target.items || []).map(i => ({
          name: i.product?.name || 'Artisanal Piece',
          quantity: i.quantity || 1,
          price: i.product?.price,
          size: i.selectedSize
        })),
        total: target.total,
        currencySymbol: '₹',
        shippingAddress: target.shippingAddress
      });

      if (res.success) {
        setOrderMailSuccessNotice(`Dispatched Consignment Shipped notification for Order #${target.orderNumber} to ${recipient}`);
        fetchLogs();
      } else {
        alert(`Failed to send order email: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error sending email: ${err.message}`);
    } finally {
      setIsDispatchingOrderMail(false);
    }
  };

  const handleQuickDispatchConfirmation = async () => {
    const target = orders.find(o => o.id === selectedOrderForDispatch || o.orderNumber === selectedOrderForDispatch);
    if (!target) return;

    setIsDispatchingOrderMail(true);
    setOrderMailSuccessNotice(null);

    try {
      const recipient = target.customerEmail || (target.shippingAddress as any)?.email || adminEmail;
      const res = await apiClient.sendOrderConfirmedNotification({
        orderId: target.id,
        orderNumber: target.orderNumber || target.id,
        recipientEmail: recipient,
        recipientName: target.shippingAddress?.fullName || 'Valued Patron',
        items: (target.items || []).map(i => ({
          name: i.product?.name || 'Artisanal Piece',
          quantity: i.quantity || 1,
          price: i.product?.price,
          size: i.selectedSize
        })),
        total: target.total,
        currencySymbol: '₹',
        paymentMethod: target.paymentMethod || 'Razorpay Online',
        estimatedDelivery: target.estimatedDelivery || '3–5 Business Days',
        shippingAddress: target.shippingAddress
      });

      if (res.success) {
        setOrderMailSuccessNotice(`Dispatched Order Confirmation receipt for Order #${target.orderNumber} to ${recipient}`);
        fetchLogs();
      } else {
        alert(`Failed to send order confirmation: ${res.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      alert(`Error sending confirmation: ${err.message}`);
    } finally {
      setIsDispatchingOrderMail(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center text-white shadow-xs">
              <Mail className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">Resend.com Mail Service</h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Transactional Engine
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                High-deliverability email dispatch for order confirmations, armored consignment tracking, and newsletter salon digests.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              fetchStatus();
              fetchLogs();
            }}
            disabled={isLoadingStatus || isLoadingLogs}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-300"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus || isLoadingLogs ? 'animate-spin' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>
          <a
            href="https://resend.com/overview"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <span>Resend Dashboard</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Grid: Status Cards & Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: API Configuration Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Service Status</span>
              {statusData?.configured ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3" /> Live Resend API
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  <AlertTriangle className="w-3 h-3" /> Simulation Mode
                </span>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                {statusData?.configured ? 'Active Resend API Connection' : 'Operating in Safe Simulated Mode'}
              </p>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                {statusData?.message || 'Connecting to backend mail dispatcher...'}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Key className="w-3 h-3 text-slate-400" />
              <span>ENV: RESEND_API_KEY</span>
            </span>
            <span className="font-mono font-semibold">
              {statusData?.configured ? 'Configured' : 'Missing (Simulated)'}
            </span>
          </div>
        </div>

        {/* Card 2: Dispatcher Identity */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Sender Identity</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                From Header
              </span>
            </div>

            <div>
              <p className="text-xs text-slate-500">Configured Sender Address:</p>
              <p className="text-xs font-mono font-bold text-slate-900 mt-1 p-2 bg-slate-50 rounded border border-slate-200 break-all">
                {statusData?.fromEmail || 'NaxtTo Atelier <onboarding@resend.dev>'}
              </p>
              <p className="text-[11px] text-slate-500 mt-2">
                Free tier accounts can dispatch via <code className="bg-slate-100 px-1 py-0.5 rounded font-mono">onboarding@resend.dev</code> to verified emails. Custom domains can be verified on Resend.
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>DKIM & SPF Authentication Ready</span>
          </div>
        </div>

        {/* Card 3: Metrics & Delivered Total */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Dispatch Metrics</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                In-Memory + Cloud
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">{logs.length}</span>
                <span className="text-xs text-slate-500 font-medium">Logged Dispatches</span>
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs">
                <span className="text-emerald-700 font-medium">
                  {logs.filter(l => l.status === 'delivered').length} Delivered
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600">
                  {logs.filter(l => l.provider === 'resend').length} via Resend Live
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Audit retention: 100 entries</span>
            <span className="font-semibold text-slate-700">100% Delivery SLA</span>
          </div>
        </div>
      </div>

      {/* Middle Row: Live Test Sender & Quick Order Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Test Email Dispatcher (5 cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Send className="w-4 h-4 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900">Send Diagnostic Test Email</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Trigger a live Resend email to verify mailbox receipt, spam scoring, and layout formatting.
            </p>

            <form onSubmit={handleSendTestEmail} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Recipient Address *</label>
                <input
                  type="email"
                  required
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  placeholder="e.g. patron@domain.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Custom Diagnostic Note (Optional)</label>
                <textarea
                  rows={2}
                  value={testCustomMessage}
                  onChange={(e) => setTestCustomMessage(e.target.value)}
                  placeholder="Note attached to test email..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={isSendingTest}
                className="w-full py-2.5 bg-slate-900 hover:bg-black text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs disabled:opacity-60"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Dispatching via Resend...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Test Email via Resend</span>
                  </>
                )}
              </button>
            </form>

            {testResult && (
              <div className={`mt-4 p-3 rounded-lg text-xs border ${testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'} animate-fadeIn`}>
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  {testResult.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                  <span>{testResult.success ? 'Email Dispatched Successfully' : 'Dispatch Failed'}</span>
                </div>
                <p className="text-[11px] leading-relaxed">{testResult.message}</p>
                {testResult.details?.messageId && (
                  <p className="text-[10px] font-mono mt-1 text-slate-600">ID: {testResult.details.messageId}</p>
                )}
                {testResult.details?.warning && (
                  <p className="text-[10px] text-amber-700 mt-1 italic">{testResult.details.warning}</p>
                )}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            Note: On free Resend test accounts, emails can only be sent to your account email (<span className="font-mono text-slate-800">{adminEmail}</span>) until your custom domain is verified.
          </div>
        </div>

        {/* Quick Order Dispatcher (7 cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Package className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">One-Click Order Email Dispatcher</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Manually trigger luxury order notifications with full items table, pricing, and courier tracking details via Resend.
            </p>

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-xs">Select Target Order *</label>
                <select
                  value={selectedOrderForDispatch}
                  onChange={(e) => setSelectedOrderForDispatch(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white"
                >
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      #{o.orderNumber} – {o.shippingAddress?.fullName} (₹{o.total?.toLocaleString('en-IN')}) – Status: {o.status}
                    </option>
                  ))}
                </select>
              </div>

              {selectedOrderForDispatch && (
                (() => {
                  const currentOrd = orders.find(o => o.id === selectedOrderForDispatch || o.orderNumber === selectedOrderForDispatch);
                  if (!currentOrd) return null;
                  const emailTo = currentOrd.customerEmail || (currentOrd.shippingAddress as any)?.email || adminEmail;
                  return (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Recipient:</span>
                        <span className="font-mono font-semibold text-slate-800">{emailTo}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Courier Tracking:</span>
                        <span className="font-mono text-slate-800">{currentOrd.trackingNumber || 'Pending AWB'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ordered Pieces:</span>
                        <span className="font-semibold text-slate-800">{currentOrd.items.length} items</span>
                      </div>
                    </div>
                  );
                })()
              )}

              <div className="flex flex-col sm:flex-row gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleQuickDispatchShipped}
                  disabled={isDispatchingOrderMail || !selectedOrderForDispatch}
                  className="flex-1 py-2.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Consignment Dispatched Email</span>
                </button>
                <button
                  type="button"
                  onClick={handleQuickDispatchConfirmation}
                  disabled={isDispatchingOrderMail || !selectedOrderForDispatch}
                  className="flex-1 py-2.5 px-3 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Send Order Confirmation Receipt</span>
                </button>
              </div>

              {orderMailSuccessNotice && (
                <div className="p-2.5 rounded-lg text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{orderMailSuccessNotice}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Automated Triggers: Processing &rarr; Shipped state changes</span>
            <span className="text-emerald-700 font-semibold">Active & Armed</span>
          </div>
        </div>
      </div>

      {/* Interactive Responsive Email Template Showcase */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Responsive NaxtTo Email Template Component</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Clean, responsive HTML structure tailored for NaxtTo fine jewellery branding, with live Desktop/Mobile viewports and HTML exporter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={previewTemplateType}
              onChange={(e) => setPreviewTemplateType(e.target.value as EmailTemplateType)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 shadow-2xs focus:outline-none"
            >
              <option value="order_shipped">Template: Consignment Shipped (AWB Tracking)</option>
              <option value="order_confirmation">Template: Order Confirmation (Invoice)</option>
              <option value="newsletter_welcome">Template: Atelier Privé Welcome</option>
            </select>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-slate-100/70">
          <EmailTemplate
            templateType={previewTemplateType}
            recipientName={orders[0]?.shippingAddress?.fullName || 'Anik Baidya'}
            orderNumber={orders[0]?.orderNumber || 'NXT-908234'}
            trackingNumber={orders[0]?.trackingNumber || 'TRACK-NXT-771122'}
            carrier="Blue Dart Apex Secure Armored Transit"
            items={(orders[0]?.items || []).length > 0 ? (orders[0]?.items || []).map(i => ({
              name: i.product?.name || '22K Gold Badhano Shankha-Pola',
              quantity: i.quantity || 1,
              price: i.product?.price || 48500,
              size: i.selectedSize || '2.4'
            })) : [
              { name: '22K Gold Badhano Shankha-Pola (Pair)', quantity: 1, price: 48500, size: '2.4' },
              { name: 'Royal Peacock Mukhi Pola Bangle', quantity: 1, price: 34200, size: '2.4' }
            ]}
            total={orders[0]?.total || 82700}
            shippingAddress={orders[0]?.shippingAddress || {
              fullName: 'Anik Baidya',
              addressLine1: 'Park Street, Haute Joaillerie Row',
              city: 'Kolkata',
              state: 'West Bengal',
              postalCode: '700016',
              country: 'India',
              phone: '+91 98765 43210'
            }}
            showControls={true}
          />
        </div>
      </div>

      {/* Dispatched Email Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Dispatched Email Audit Ledger</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                {logs.length} Logged
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of all Resend transactional emails dispatched by the atelier platform.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchLogs}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs self-start sm:self-auto"
          >
            <RefreshCw className={`w-3 h-3 ${isLoadingLogs ? 'animate-spin' : ''}`} />
            <span>Refresh Ledger</span>
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            <Mail className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No emails dispatched in current session</p>
            <p className="text-slate-400 mt-1">Send a diagnostic test email or update an order to Shipped to populate this ledger.</p>
          </div>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold">Timestamp</th>
                  <th className="py-3 px-4 font-semibold">Recipient</th>
                  <th className="py-3 px-4 font-semibold">Subject / Consignment</th>
                  <th className="py-3 px-4 font-semibold">Provider</th>
                  <th className="py-3 px-4 font-semibold">Message ID</th>
                  <th className="py-3 px-4 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{new Date(item.sentAt).toLocaleDateString()}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      <div>{item.recipientEmail}</div>
                      {item.recipientName && (
                        <div className="text-[10px] font-sans text-slate-500">{item.recipientName}</div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-800 max-w-xs truncate">
                      <div className="font-medium text-slate-900 truncate">{item.subject}</div>
                      {item.trackingNumber && (
                        <div className="text-[10px] text-slate-500 font-mono">
                          AWB: {item.trackingNumber} ({item.carrier || 'Blue Dart'})
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {item.provider === 'resend' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Resend Live
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                          <Clock className="w-2.5 h-2.5" /> Simulated
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={item.messageId}>
                      {item.messageId}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.status === 'delivered' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Delivered
                        </span>
                      ) : item.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800" title={item.error}>
                          Failed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-100 text-sky-800">
                          Sent
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Setup Guide Card */}
      <div className="p-5 bg-gradient-to-r from-slate-900 to-[#1e1b4b] rounded-xl text-white shadow-xs text-xs space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-sm text-white">How to connect your Production Resend API Key</h3>
        </div>
        <p className="text-slate-300 leading-relaxed max-w-3xl">
          NaxtTo Atelier has natively integrated the official <strong>Resend SDK</strong>. To send emails through your real custom domain or verified sender:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-[11px]">
          <div className="p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-xs">
            <strong className="text-amber-300 block mb-1">1. Get API Key</strong>
            <span>Create a free account at <a href="https://resend.com" target="_blank" rel="noreferrer" className="underline text-white font-semibold">resend.com</a> and generate an API key with sending permissions.</span>
          </div>
          <div className="p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-xs">
            <strong className="text-amber-300 block mb-1">2. Add to Secrets</strong>
            <span>Set <code className="bg-black/40 px-1 py-0.5 rounded font-mono text-amber-200">RESEND_API_KEY</code> in your environment or Settings Secrets panel.</span>
          </div>
          <div className="p-3 bg-white/10 rounded-lg border border-white/10 backdrop-blur-xs">
            <strong className="text-amber-300 block mb-1">3. Custom Domain (Optional)</strong>
            <span>Add <code className="bg-black/40 px-1 py-0.5 rounded font-mono text-amber-200">RESEND_FROM_EMAIL</code> to send from your domain (e.g. <span className="font-mono">concierge@naxtto.shop</span>).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
