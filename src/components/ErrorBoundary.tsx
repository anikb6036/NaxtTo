import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Atelier Error Boundary caught an unhandled exception:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('naxtto_completed_order');
      localStorage.removeItem('naxtto_last_order');
      localStorage.removeItem('naxtto_address_draft_guest');
    } catch {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  private handleReload = () => {
    try {
      localStorage.removeItem('naxtto_completed_order');
      localStorage.removeItem('naxtto_last_order');
      localStorage.removeItem('naxtto_address_draft_guest');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#FAF9F5] text-[#1A1816] flex flex-col items-center justify-center p-6 text-center select-none font-sans">
          <div className="max-w-md w-full bg-white/90 backdrop-blur-md border border-[#E8DFD1] p-8 rounded-3xl shadow-lg space-y-6">
            <div className="w-16 h-16 rounded-full bg-[#E56A85]/10 text-[#E56A85] flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8C827A]">
                Atelier Interface Protection
              </span>
              <h1 className="text-xl sm:text-2xl font-serif font-semibold text-[#1A1816]">
                Notice from our Concierge
              </h1>
              <p className="text-xs sm:text-sm text-[#716A62] leading-relaxed">
                A temporary interface interruption was prevented. Your precious acquisitions and personal details remain securely preserved.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-[#FAF9F5] rounded-xl border border-[#E8DFD1] text-[11px] font-mono text-[#8C827A] text-left break-words overflow-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 px-5 py-3 bg-[#E56A85] hover:bg-[#D45974] text-white text-xs font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Home className="w-3.5 h-3.5" />
                Return to Boutique
              </button>
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 px-5 py-3 bg-white border border-[#E8DFD1] hover:bg-black/[0.02] text-[#1A1816] text-xs font-semibold rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
