import React, { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends (React.Component as any) {
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = 'Something went wrong. Please try again later.';
      let errorDetail = '';

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error) {
            errorMessage = 'Database Permission Error';
            errorDetail = `Operation: ${parsed.operationType} on ${parsed.path}. ${parsed.error}`;
          }
        }
      } catch (e) {
        // Not a JSON error message, use default
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-6">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Oops!</h1>
            <p className="text-slate-600 mb-6">{errorMessage}</p>
            {errorDetail && (
              <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
                <p className="text-xs font-mono text-slate-500 break-all">{errorDetail}</p>
              </div>
            )}
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-200"
            >
              <RefreshCw size={18} />
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
