import React, { useState } from 'react';
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
  MapPin
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
}

export const SellerHomeDashboard: React.FC<SellerHomeDashboardProps> = ({
  products,
  orders,
  onNavigateTab,
  onAddNewListing,
  currencySymbol,
  sellerName = 'NaxtTo'
}) => {
  // Active timeframe tab for insights (Daily / Weekly / Monthly)
  const [insightTimeframe, setInsightTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [activeDataPoint, setActiveDataPoint] = useState<number | null>(6); // Default highlight latest (14th Sep)

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

  // Chart data matching the screenshot (8th - 14th Sep '26)
  const chartData = [
    { day: '8th', date: '8 Sep', sales: 1200, views: 5400, orders: 1 },
    { day: '9th', date: '9 Sep', sales: 1900, views: 6100, orders: 2 },
    { day: '10th', date: '10 Sep', sales: 2200, views: 6800, orders: 3 },
    { day: '11th', date: '11 Sep', sales: 3600, views: 8900, orders: 5 },
    { day: '12th', date: '12 Sep', sales: 650, views: 4200, orders: 1 },
    { day: '13th', date: '13 Sep', sales: 2900, views: 7650, orders: 4 },
    { day: '14th', date: '14 Sep', sales: 680, views: 7812, orders: orders.length > 0 ? orders.length : 4 },
  ];

  // SVG Chart Geometry Constants
  const chartWidth = 560;
  const chartHeight = 220;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const maxVal = 4000;
  const minVal = 0;

  const getX = (index: number) => {
    const usableWidth = chartWidth - paddingLeft - paddingRight;
    return paddingLeft + (index / (chartData.length - 1)) * usableWidth;
  };

  const getY = (value: number) => {
    const usableHeight = chartHeight - paddingTop - paddingBottom;
    return chartHeight - paddingBottom - ((value - minVal) / (maxVal - minVal)) * usableHeight;
  };

  const polylinePoints = chartData.map((d, i) => `${getX(i)},${getY(d.sales)}`).join(' ');

  const activePointData = activeDataPoint !== null ? chartData[activeDataPoint] : chartData[chartData.length - 1];

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
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#f3f4f6]">
              <div className="w-7 h-7 rounded-lg bg-[#f0f3f8] flex items-center justify-center text-[#556075]">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-[#1f242e]">To do list</h2>
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
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#f59e0b] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      !
                    </span>
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
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#3b82f6] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      ↓
                    </span>
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
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ef4444] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      ×
                    </span>
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
                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#f59e0b] text-white rounded-full flex items-center justify-center text-[8px] font-bold">
                      ↓
                    </span>
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
                        ? 'bg-white text-[#4f46e5] shadow-xs'
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
                    {[0, 1000, 2000, 3000, 4000].map((val) => {
                      const y = getY(val);
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
                            {val === 0 ? '0' : `${val / 1000}k`}
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
                      Sales
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

                    {/* Interactive Data Dots & Hover Hitbox */}
                    {chartData.map((d, i) => {
                      const cx = getX(i);
                      const cy = getY(d.sales);
                      const isHovered = activeDataPoint === i;

                      return (
                        <g 
                          key={d.day} 
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
                            fill="#2563eb"
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
                                x="-32"
                                y="-14"
                                width="64"
                                height="18"
                                rx="4"
                                fill="#1e293b"
                              />
                              <text
                                x="0"
                                y="-2"
                                textAnchor="middle"
                                fontSize="9.5"
                                fill="#ffffff"
                                fontWeight="bold"
                              >
                                {currencySymbol}{d.sales.toLocaleString()}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}

                    {/* Bottom Month Marker */}
                    <text
                      x={chartWidth / 2}
                      y={chartHeight - 6}
                      textAnchor="middle"
                      fontSize="10.5"
                      fill="#6b7280"
                      fontWeight="500"
                    >
                      Sep '26
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
                    <span className="inline-flex items-center text-xs font-semibold text-[#dc2626] bg-[#fef2f2] px-2 py-0.5 rounded-md">
                      ▼ 5.35%
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
                    <span className="inline-flex items-center text-xs font-semibold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-md">
                      ▲ 33.33%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-4 border-t border-[#f3f4f6] mt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onNavigateTab('reports')}
                className="px-4 py-2 border border-[#4f46e5] text-[#4f46e5] hover:bg-[#4f46e5]/5 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                View More Details
              </button>

              <span className="text-[11px] text-[#9ca3af]">
                Updated live based on customer catalogue visits
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
                Reach high-intent Bengali brides and fine jewellery buyers across NaxtTo &amp; partner marketplaces. Get up to 4.2x ROI on your product listings.
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

            {/* Cartoon Box Presentation Illustration */}
            <div className="relative shrink-0 flex items-center justify-center">
              {/* Illustrated presentation easel board */}
              <div className="w-28 h-24 bg-white rounded-lg border-2 border-[#86efac] shadow-md p-2 flex flex-col justify-between transform -rotate-3">
                <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-1">
                  <div className="w-2 h-2 rounded-full bg-[#22c55e]" />
                  <span className="text-[7px] font-bold text-[#6b7280]">ROI +340%</span>
                </div>
                {/* Mini bar chart */}
                <div className="flex items-end justify-between h-10 px-1">
                  <div className="w-2 h-4 bg-[#bbf7d0] rounded-t-xs" />
                  <div className="w-2 h-6 bg-[#86efac] rounded-t-xs" />
                  <div className="w-2 h-8 bg-[#4ade80] rounded-t-xs" />
                  <div className="w-2 h-10 bg-[#22c55e] rounded-t-xs animate-pulse" />
                </div>
                {/* Upward trend line */}
                <div className="flex items-center text-[7px] text-[#16a34a] font-bold">
                  <span>▲ 4.2x Sales</span>
                </div>
              </div>

              {/* Cute smiling delivery box mascot */}
              <div className="w-20 h-20 bg-[#f59e0b] rounded-xl border-2 border-[#b45309] shadow-lg p-1.5 flex flex-col items-center justify-between -ml-4 z-10 transform rotate-6">
                <div className="w-full flex justify-between px-1">
                  <div className="w-1.5 h-1.5 bg-[#78350f] rounded-full" />
                  <div className="w-1.5 h-1.5 bg-[#78350f] rounded-full" />
                </div>
                {/* Eyes and big happy smile */}
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 mb-0.5">
                    <div className="w-1.5 h-2 bg-[#1f2937] rounded-full" />
                    <div className="w-1.5 h-2 bg-[#1f2937] rounded-full" />
                  </div>
                  <div className="w-4 h-2 border-b-2 border-[#1f2937] rounded-full" />
                </div>
                {/* Shipping Tape */}
                <div className="w-full h-2 bg-[#d97706]/70 rounded-xs flex items-center justify-center">
                  <span className="text-[6px] text-white font-bold tracking-widest uppercase">ADS</span>
                </div>
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
