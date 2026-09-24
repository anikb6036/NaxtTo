import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, 
  PlusCircle, 
  TrendingUp, 
  Package, 
  Download, 
  XCircle, 
  Clock, 
  ArrowDown, 
  ChevronRight, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  ExternalLink,
  Megaphone,
  X,
  Lock,
  Building,
  CreditCard,
  MapPin,
  Trash2
} from 'lucide-react';
import { Product, Order } from '../../types';
import { SellerNavTab } from './SellerSidebar';

interface SellerHomeDashboardProps {
  products: Product[];
  orders: Order[];
  onNavigateTab: (tab: SellerNavTab) => void;
  onAddNewListing: () => void;
  currencySymbol: string;
  sellerName?: string;
  onClearAllOrders?: () => void;
}

export const SellerHomeDashboard: React.FC<SellerHomeDashboardProps> = ({
  products,
  orders,
  onNavigateTab,
  onAddNewListing,
  currencySymbol,
  sellerName = 'NaxtTo',
  onClearAllOrders
}) => {
  // Active timeframe tab for insights (Daily / Weekly / Monthly)
  const [insightTimeframe, setInsightTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [activeDataPoint, setActiveDataPoint] = useState<number | null>(null);

  // Account setup state for interactive modals
  const [setupModal, setSetupModal] = useState<'password' | 'business' | 'bank' | 'warehouse' | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({
    bank: true,
    warehouse: true,
  });

  // Metric computations from real application state
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Accepted'
  ).length;

  const downloadLabelsCount = orders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Accepted' || o.status === 'Crafting'
  ).length;

  const outOfStockCount = products.filter(
    (p) => (p.stockCount ?? 0) === 0
  ).length;

  const lowStockCount = products.filter(
    (p) => (p.stockCount ?? 0) > 0 && (p.stockCount ?? 0) <= 3
  ).length;

  // Real-time Dynamic Chart Data based exclusively on actual orders and dates
  const chartData = useMemo(() => {
    const today = new Date();
    const data: {
      day: string;
      date: string;
      fullDate: string;
      sales: number;
      views: number;
      orders: number;
    }[] = [];

    const getDaySuffix = (d: number) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:  return 'st';
        case 2:  return 'nd';
        case 3:  return 'rd';
        default: return 'th';
      }
    };

    if (insightTimeframe === 'Daily') {
      // Last 7 days ending today
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dayNum = d.getDate();
        const monthShort = d.toLocaleString('en-US', { month: 'short' });
        const dateIso = d.toISOString().split('T')[0];

        // Find actual orders placed on this calendar day
        const dayOrders = orders.filter((o) => {
          const ordDate = (o.date || o.createdAt || '').slice(0, 10);
          return ordDate === dateIso;
        });

        const daySales = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        data.push({
          day: `${dayNum}${getDaySuffix(dayNum)}`,
          date: `${dayNum} ${monthShort}`,
          fullDate: dateIso,
          sales: daySales,
          views: 0, // Real traffic visits (0 when clean)
          orders: dayOrders.length
        });
      }
    } else if (insightTimeframe === 'Weekly') {
      // Last 4 weeks
      for (let i = 3; i >= 0; i--) {
        const endD = new Date(today);
        endD.setDate(today.getDate() - (i * 7));
        const startD = new Date(endD);
        startD.setDate(endD.getDate() - 6);
        const startIso = startD.toISOString().split('T')[0];
        const endIso = endD.toISOString().split('T')[0];

        const weekOrders = orders.filter((o) => {
          const ordDate = (o.date || o.createdAt || '').slice(0, 10);
          return ordDate >= startIso && ordDate <= endIso;
        });

        const weekSales = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        data.push({
          day: `Wk ${4 - i}`,
          date: `${startD.getDate()} ${startD.toLocaleString('en-US', { month: 'short' })} - ${endD.getDate()} ${endD.toLocaleString('en-US', { month: 'short' })}`,
          fullDate: `${startIso} to ${endIso}`,
          sales: weekSales,
          views: 0,
          orders: weekOrders.length
        });
      }
    } else {
      // Last 6 months
      for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthShort = d.toLocaleString('en-US', { month: 'short' });
        const year = d.getFullYear();
        const yearMonth = `${year}-${String(d.getMonth() + 1).padStart(2, '0')}`;

        const monthOrders = orders.filter((o) => {
          const ordDate = (o.date || o.createdAt || '').slice(0, 7);
          return ordDate === yearMonth;
        });

        const monthSales = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        data.push({
          day: monthShort,
          date: `${monthShort} ${year}`,
          fullDate: yearMonth,
          sales: monthSales,
          views: 0,
          orders: monthOrders.length
        });
      }
    }

    return data;
  }, [orders, insightTimeframe]);

  // Keep active point in sync with timeframe updates
  useEffect(() => {
    setActiveDataPoint(chartData.length - 1);
  }, [insightTimeframe, chartData.length]);

  // Active highlighted point
  const selectedIndex = activeDataPoint !== null && activeDataPoint < chartData.length 
    ? activeDataPoint 
    : chartData.length - 1;
  const activePointData = chartData[selectedIndex] || {
    day: 'Today',
    date: 'Today',
    fullDate: '',
    sales: 0,
    views: 0,
    orders: 0
  };

  // SVG Chart Geometry Constants
  const chartWidth = 560;
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const maxSales = Math.max(...chartData.map((d) => d.sales), 0);
  const maxVal = maxSales > 0 ? Math.ceil((maxSales * 1.25) / 1000) * 1000 : 1000;
  const minVal = 0;

  const getX = (index: number) => {
    const usableWidth = chartWidth - paddingLeft - paddingRight;
    if (chartData.length <= 1) return paddingLeft + usableWidth / 2;
    return paddingLeft + (index / (chartData.length - 1)) * usableWidth;
  };

  const getY = (value: number) => {
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    return chartHeight - paddingBottom - ((value - minVal) / (maxVal - minVal)) * usableHeight;
  };

  const polylinePoints = chartData.map((d, i) => `${getX(i)},${getY(d.sales)}`).join(' ');

  // Grid steps (0, 25%, 50%, 75%, 100%)
  const gridSteps = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

  const currentMonthYear = new Date().toLocaleString('en-US', { month: 'short', year: 'numeric' });

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Welcome Greeting Banner */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#1f242e] tracking-tight">
          Welcome back, {sellerName}
        </h1>
        <p className="text-sm text-[#595f6e] mt-0.5">
          Manage and grow your business with NaxtTo Supplier Hub
        </p>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 of 12 columns on large screens) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card A: To do list */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-xs transition-shadow hover:shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f0f3f8] flex items-center justify-center text-[#556075]">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#1f242e]">To do list</h2>
              </div>
              {orders.length > 0 && onClearAllOrders && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Remove all ${orders.length} dummy/test orders from the seller panel? This will reset pending orders to 0.`)) {
                      onClearAllOrders();
                    }
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#dc2626] bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] rounded-lg transition-colors cursor-pointer"
                  title="Purge all test/dummy orders"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Test Orders ({orders.length})</span>
                </button>
              )}
            </div>

            {/* 4 Action Sub-Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {/* 1. Pending Orders */}
              <button
                type="button"
                onClick={() => onNavigateTab('orders')}
                className="group p-3.5 bg-white hover:bg-[#fafbfc] rounded-xl border border-[#e5e7eb] hover:border-[#3b82f6] text-left transition-all flex items-start justify-between cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="relative w-8 h-8 rounded-lg bg-[#fcf2e8] border border-[#fae2cb] flex items-center justify-center text-[#b45309]">
                    <Package className="w-4 h-4" />
                    {pendingOrdersCount > 0 && (
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#f59e0b] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                        !
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#595f6e] pt-1">Pending Orders</p>
                  <div className="flex items-center gap-1 text-[#4f46e5] font-bold text-base group-hover:translate-x-0.5 transition-transform">
                    <span>{pendingOrdersCount}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* 2. Download Labels */}
              <button
                type="button"
                onClick={() => onNavigateTab('orders')}
                className="group p-3.5 bg-white hover:bg-[#fafbfc] rounded-xl border border-[#e5e7eb] hover:border-[#3b82f6] text-left transition-all flex items-start justify-between cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="relative w-8 h-8 rounded-lg bg-[#f0f5ff] border border-[#dbe6fe] flex items-center justify-center text-[#2563eb]">
                    <Download className="w-4 h-4" />
                    {downloadLabelsCount > 0 && (
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                        ↓
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#595f6e] pt-1">Download Labels</p>
                  <div className="flex items-center gap-1 text-[#4f46e5] font-bold text-base group-hover:translate-x-0.5 transition-transform">
                    <span>{downloadLabelsCount}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* 3. Out of Stock */}
              <button
                type="button"
                onClick={() => onNavigateTab('inventory')}
                className="group p-3.5 bg-white hover:bg-[#fafbfc] rounded-xl border border-[#e5e7eb] hover:border-[#ef4444] text-left transition-all flex items-start justify-between cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="relative w-8 h-8 rounded-lg bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-[#dc2626]">
                    <FileText className="w-4 h-4" />
                    {outOfStockCount > 0 && (
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ef4444] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                        ×
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#595f6e] pt-1">Out of Stock</p>
                  <div className="flex items-center gap-1 text-[#4f46e5] font-bold text-base group-hover:translate-x-0.5 transition-transform">
                    <span>{outOfStockCount}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>

              {/* 4. Low Stock */}
              <button
                type="button"
                onClick={() => onNavigateTab('inventory')}
                className="group p-3.5 bg-white hover:bg-[#fafbfc] rounded-xl border border-[#e5e7eb] hover:border-[#f59e0b] text-left transition-all flex items-start justify-between cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="relative w-8 h-8 rounded-lg bg-[#fffbeb] border border-[#fde68a] flex items-center justify-center text-[#d97706]">
                    <FileText className="w-4 h-4" />
                    {lowStockCount > 0 && (
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#f59e0b] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                        !
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-medium text-[#595f6e] pt-1">Low Stock</p>
                  <div className="flex items-center gap-1 text-[#4f46e5] font-bold text-base group-hover:translate-x-0.5 transition-transform">
                    <span>{lowStockCount}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Card B: Business Insights */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-xs">
            {/* Top row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2 pb-3 border-b border-[#f3f4f6]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#f0f3f8] flex items-center justify-center text-[#556075]">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-[#1f242e]">Business Insights</h2>
              </div>

              {/* Center Tab Switcher */}
              <div className="flex items-center bg-[#f3f4f6] p-0.5 rounded-lg text-xs font-semibold">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setInsightTimeframe(tab)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      insightTimeframe === tab
                        ? 'bg-white text-[#4f46e5] shadow-xs font-bold'
                        : 'text-[#6b7280] hover:text-[#111827]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart + Side Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pt-2">
              {/* Left SVG Line Chart (8 cols) */}
              <div className="md:col-span-8 overflow-x-auto">
                <div className="min-w-[480px]">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible select-none">
                    {/* Background horizontal grid lines */}
                    {gridSteps.map((val) => {
                      const y = getY(val);
                      const label = val === 0 ? '0' : val >= 1000 ? `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k` : `${Math.round(val)}`;
                      return (
                        <g key={val}>
                          <line
                            x1={paddingLeft}
                            y1={y}
                            x2={chartWidth - paddingRight}
                            y2={y}
                            stroke="#e5e7eb"
                            strokeWidth="1"
                            strokeDasharray={val === 0 ? 'none' : '3 3'}
                          />
                          <text
                            x={paddingLeft - 8}
                            y={y + 3.5}
                            textAnchor="end"
                            fontSize="10"
                            fill="#9ca3af"
                            fontFamily="sans-serif"
                          >
                            {label}
                          </text>
                        </g>
                      );
                    })}

                    {/* Left Axis Label */}
                    <text
                      x={-chartHeight / 2 + 10}
                      y="14"
                      transform="rotate(-90)"
                      textAnchor="middle"
                      fontSize="10"
                      fill="#6b7280"
                      fontWeight="500"
                    >
                      Sales ({currencySymbol})
                    </text>

                    {/* Gradient Fill under the line */}
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Area Polygon */}
                    <polygon
                      points={`${getX(0)},${getY(0)} ${polylinePoints} ${getX(chartData.length - 1)},${getY(0)}`}
                      fill="url(#salesGradient)"
                    />

                    {/* The Blue Line */}
                    <polyline
                      fill="none"
                      stroke="#60a5fa"
                      strokeWidth="2.5"
                      points={polylinePoints}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    {/* Empty state hint when sales are 0 */}
                    {maxSales === 0 && (
                      <g transform={`translate(${chartWidth / 2}, ${chartHeight / 2 - 12})`}>
                        <rect
                          x="-140"
                          y="-16"
                          width="280"
                          height="34"
                          rx="6"
                          fill="#f9fafb"
                          stroke="#e5e7eb"
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="-1"
                          textAnchor="middle"
                          fontSize="10"
                          fill="#4b5563"
                          fontWeight="600"
                        >
                          No order sales recorded for this period
                        </text>
                        <text
                          x="0"
                          y="11"
                          textAnchor="middle"
                          fontSize="8.5"
                          fill="#9ca3af"
                        >
                          Live revenue trends plot automatically as orders arrive
                        </text>
                      </g>
                    )}

                    {/* Interactive Data Dots & Hover Hitbox */}
                    {chartData.map((d, i) => {
                      const cx = getX(i);
                      const cy = getY(d.sales);
                      const isHovered = selectedIndex === i;

                      return (
                        <g 
                          key={d.day + i} 
                          className="cursor-pointer"
                          onMouseEnter={() => setActiveDataPoint(i)}
                          onClick={() => setActiveDataPoint(i)}
                        >
                          {/* Vertical guide line on active point */}
                          {isHovered && (
                            <line
                              x1={cx}
                              y1={paddingTop}
                              x2={cx}
                              y2={chartHeight - paddingBottom}
                              stroke="#93c5fd"
                              strokeWidth="1"
                              strokeDasharray="2 2"
                            />
                          )}

                          {/* Outer pulse circle */}
                          <circle
                            cx={cx}
                            cy={cy}
                            r={isHovered ? 6 : 4}
                            fill={isHovered ? '#2563eb' : '#60a5fa'}
                            stroke="#ffffff"
                            strokeWidth="2"
                            className="transition-all"
                          />

                          {/* X Axis Day Label */}
                          <text
                            x={cx}
                            y={chartHeight - paddingBottom + 16}
                            textAnchor="middle"
                            fontSize="10.5"
                            fill={isHovered ? '#1d4ed8' : '#6b7280'}
                            fontWeight={isHovered ? '700' : '500'}
                          >
                            {d.day}
                          </text>

                          {/* Tooltip on active hover */}
                          {isHovered && (
                            <g transform={`translate(${cx}, ${cy - 28})`}>
                              <rect
                                x="-48"
                                y="-14"
                                width="96"
                                height="20"
                                rx="4"
                                fill="#1e293b"
                              />
                              <text
                                x="0"
                                y="0"
                                textAnchor="middle"
                                fontSize="9"
                                fill="#ffffff"
                                fontWeight="bold"
                              >
                                {currencySymbol}{d.sales.toLocaleString()} ({d.orders} {d.orders === 1 ? 'ord' : 'ords'})
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* Bottom Period Marker */}
                    <text
                      x={chartWidth / 2}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#9ca3af"
                      fontWeight="500"
                    >
                      {insightTimeframe === 'Monthly' ? 'Last 6 Months' : currentMonthYear}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Right Stats Cards (4 cols) */}
              <div className="md:col-span-4 space-y-3">
                {/* Views Card */}
                <div className="p-3.5 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#6b7280]">
                    <span>Views ({activePointData.date})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-[#111827]">
                      {activePointData.views.toLocaleString()}
                    </span>
                    <span className="inline-flex items-center text-[10px] font-semibold text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded-md">
                      Live Traffic
                    </span>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="p-3.5 bg-white rounded-xl border border-[#e5e7eb] shadow-2xs space-y-1">
                  <div className="flex items-center justify-between text-xs text-[#6b7280]">
                    <span>Orders ({activePointData.date})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-extrabold text-[#111827]">
                      {activePointData.orders}
                    </span>
                    {activePointData.orders > 0 ? (
                      <span className="inline-flex items-center text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-md">
                        {activePointData.orders} {activePointData.orders === 1 ? 'order' : 'orders'}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-[10px] font-semibold text-[#6b7280] bg-[#f3f4f6] px-2 py-0.5 rounded-md">
                        0 orders
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-[#f3f4f6] mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigateTab('orders')}
                className="px-4 py-2 border border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5]/5 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                View Orders Ledger
              </button>

              <span className="text-[11px] text-[#9ca3af]">
                Updated live based on customer catalogue purchases
              </span>
            </div>
          </div>

          {/* Card C: Grow your business with ads Banner */}
          <div className="bg-gradient-to-r from-[#eef9f2] via-[#f2faf4] to-[#e6f7ec] rounded-xl border border-[#bbf7d0] p-6 relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-2 max-w-md z-10">
              <span className="inline-block px-2.5 py-0.5 bg-[#dcfce7] border border-[#86efac] text-[#15803d] text-[10px] font-bold uppercase tracking-wider rounded-md">
                Sponsored Discovery
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#15803d] leading-tight">
                Grow your business with ads
              </h3>
              <p className="text-xs text-[#166534] leading-relaxed">
                Reach high-intent Bengali brides and fine jewellery buyers across NaxtTo &amp; partner marketplaces. Boost listing visibility and patron conversions.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigateTab('ads')}
                  className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold rounded-lg shadow-sm transition-all hover:scale-105 cursor-pointer"
                >
                  Create Ad Campaign
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateTab('listings')}
                  className="px-3 py-2 bg-white/80 hover:bg-white text-[#166534] border border-[#bbf7d0] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Manage Listings
                </button>
              </div>
            </div>

            {/* Elegant Marketing Spotlight Iconography */}
            <div className="relative shrink-0 flex items-center justify-center p-3">
              <div className="w-24 h-24 rounded-2xl bg-white/90 border border-[#86efac] shadow-sm flex flex-col items-center justify-center gap-2 text-center p-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                  <Megaphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[#15803d]">Promoted Reach</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (4 of 12 columns on large screens) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Complete your account setup */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#1f242e]">
                Complete your account setup
              </h2>
              <p className="text-xs text-[#595f6e] mt-1 leading-relaxed">
                Add the below information to improve your selling journey
              </p>
            </div>

            {/* Checklist Items with Blue Circle Plus (+) icons */}
            <div className="space-y-2.5 pt-1">
              {/* Item 1: Set Password */}
              <button
                type="button"
                onClick={() => setSetupModal('password')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#e5e7eb] hover:border-[#4f46e5] hover:bg-[#f9fafb] text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {completedSteps.password ? (
                    <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <PlusCircle className="w-5 h-5 text-[#4f46e5] group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-xs font-semibold text-[#1f242e] group-hover:text-[#4f46e5]">
                    {completedSteps.password ? 'Password Configured' : 'Set Password'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#4f46e5] transition-colors" />
              </button>

              {/* Item 2: Add Business Type */}
              <button
                type="button"
                onClick={() => setSetupModal('business')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#e5e7eb] hover:border-[#4f46e5] hover:bg-[#f9fafb] text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  {completedSteps.business ? (
                    <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  ) : (
                    <PlusCircle className="w-5 h-5 text-[#4f46e5] group-hover:scale-110 transition-transform" />
                  )}
                  <span className="text-xs font-semibold text-[#1f242e] group-hover:text-[#4f46e5]">
                    {completedSteps.business ? 'Business Type Verified' : 'Add Business Type'}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#4f46e5] transition-colors" />
              </button>

              {/* Item 3: Bank & GSTIN Details */}
              <button
                type="button"
                onClick={() => setSetupModal('bank')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#e5e7eb] hover:border-[#4f46e5] hover:bg-[#f9fafb] text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#1f242e] group-hover:text-[#4f46e5]">
                    Bank Account &amp; GSTIN
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                  Verified
                </span>
              </button>

              {/* Item 4: Pickup Warehouse Address */}
              <button
                type="button"
                onClick={() => setSetupModal('warehouse')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#e5e7eb] hover:border-[#4f46e5] hover:bg-[#f9fafb] text-left transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#dcfce7] text-[#16a34a] flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-[#1f242e] group-hover:text-[#4f46e5]">
                    Pickup Hub Address
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#16a34a] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                  Active
                </span>
              </button>
            </div>

            {/* Completion Progress Bar */}
            <div className="pt-2 border-t border-[#f3f4f6]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-[#6b7280]">Account Readiness</span>
                <span className="font-bold text-[#4f46e5]">75% Ready</span>
              </div>
              <div className="w-full h-2 bg-[#f3f4f6] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#4f46e5] to-[#22c55e] w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl border border-[#e5e7eb] p-5 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
              Quick Atelier Actions
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={onAddNewListing}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                <span>+ Upload New Sakha Pola Listing</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('storage')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#1f242e] text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <span>Sync Cloud Database (Firestore)</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6b7280]" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Interactive Modal for Account Setup Items */}
      {setupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-6 max-w-md w-full shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3f4f6]">
              <h3 className="text-base font-bold text-[#1f242e] flex items-center gap-2">
                {setupModal === 'password' && <Lock className="w-4 h-4 text-[#4f46e5]" />}
                {setupModal === 'business' && <Building className="w-4 h-4 text-[#4f46e5]" />}
                {setupModal === 'bank' && <CreditCard className="w-4 h-4 text-[#16a34a]" />}
                {setupModal === 'warehouse' && <MapPin className="w-4 h-4 text-[#16a34a]" />}
                <span>
                  {setupModal === 'password' && 'Set Administrator Password'}
                  {setupModal === 'business' && 'Specify Business Type'}
                  {setupModal === 'bank' && 'Bank & GSTIN Verification'}
                  {setupModal === 'warehouse' && 'Registered Pickup Hub'}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setSetupModal(null)}
                className="p-1 rounded-lg text-[#9ca3af] hover:text-[#111827] hover:bg-[#f3f4f6]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {setupModal === 'password' && (
              <div className="space-y-4">
                <p className="text-xs text-[#595f6e]">
                  Secure your NaxtTo seller portal credentials to prevent unauthorized listing modifications.
                </p>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-[#1f242e]">New Master Password</label>
                  <input
                    type="password"
                    placeholder="Enter at least 8 characters..."
                    className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-[#4f46e5]"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCompletedSteps(prev => ({ ...prev, password: true }));
                    setSetupModal(null);
                  }}
                  className="w-full py-2.5 bg-[#4f46e5] text-white text-xs font-bold rounded-lg hover:bg-[#4338ca]"
                >
                  Save Password
                </button>
              </div>
            )}

            {setupModal === 'business' && (
              <div className="space-y-4">
                <p className="text-xs text-[#595f6e]">
                  Select the legal constitution of your fine jewellery establishment.
                </p>
                <select className="w-full px-3 py-2 border border-[#e5e7eb] rounded-lg text-xs outline-none focus:border-[#4f46e5]">
                  <option value="sole">Sole Proprietorship (Kolkata Artisan Goldsmith)</option>
                  <option value="pvt">Private Limited Company</option>
                  <option value="llp">Limited Liability Partnership (LLP)</option>
                  <option value="partnership">Registered Partnership</option>
                </select>
                <button
                  type="button"
                  onClick={() => {
                    setCompletedSteps(prev => ({ ...prev, business: true }));
                    setSetupModal(null);
                  }}
                  className="w-full py-2.5 bg-[#4f46e5] text-white text-xs font-bold rounded-lg hover:bg-[#4338ca]"
                >
                  Confirm Business Type
                </button>
              </div>
            )}

            {setupModal === 'bank' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
                    <span>State Bank of India (IFSC: SBIN0000001)</span>
                  </p>
                  <p>Account ending in: **** 8492 (Current A/C)</p>
                  <p>GSTIN: 19AAACN8492J1Z8 (Verified Active)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSetupModal(null)}
                  className="w-full py-2 bg-[#f3f4f6] text-[#1f242e] text-xs font-semibold rounded-lg hover:bg-[#e5e7eb]"
                >
                  Close
                </button>
              </div>
            )}

            {setupModal === 'warehouse' && (
              <div className="space-y-4">
                <div className="p-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-lg text-xs text-[#166534] space-y-1">
                  <p className="font-bold">Bowbazar Gold Atelier Hub</p>
                  <p>12/1A Bepin Behari Ganguly Street, Bowbazar, Kolkata, West Bengal - 700012</p>
                  <p>Daily Courier Pickup: Delhivery Express &amp; BlueDart Air (4:00 PM)</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSetupModal(null)}
                  className="w-full py-2 bg-[#f3f4f6] text-[#1f242e] text-xs font-semibold rounded-lg hover:bg-[#e5e7eb]"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
