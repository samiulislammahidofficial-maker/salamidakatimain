import React, { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  // @ts-ignore
  state: State = {
    hasError: false,
    error: null
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    // @ts-ignore
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 max-w-md w-full text-center space-y-4">
            <div className="text-5xl">😭</div>
            <h1 className="text-2xl font-bold text-slate-900">কিছু একটা সমস্যা হইছে!</h1>
            <p className="text-slate-600">
              চিন্তা করো না, আমরা ঠিক করার চেষ্টা করছি। পেজটা একবার রিফ্রেশ দিয়ে দেখতে পারো।
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              রিফ্রেশ দাও 🔄
            </button>
            <pre className="text-left text-xs bg-red-50 p-4 rounded-xl overflow-auto text-red-600 border border-red-100">
              {/* @ts-ignore */}
              {this.state.error?.message}
            </pre>
          </div>
        </div>
      );
    }

    // @ts-ignore
    return this.props.children;
  }
}

export default ErrorBoundary;
