import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, errorMessage: '' };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Lodavia Uncaught Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetApp = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    } catch {
      // ignore
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 flex flex-col items-center justify-center gap-5 bg-[#070b19] text-white p-6 text-center z-50">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-cyan-400 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0d1527] rounded-[22px] flex items-center justify-center text-2xl">
              🪐
            </div>
          </div>
          
          <div className="max-w-md space-y-2">
            <h1 className="text-xl font-bold tracking-wide text-white">Lodavia Cosmic Core</h1>
            <p className="text-sm text-slate-300">
              تم رصد عائق أثناء تحميل واجهة المجرة، يمكنك استئناف التشغيل فوراً.
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={this.handleReload}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 hover:opacity-90 active:scale-95 transition-all"
            >
              إعادة فتح التطبيق
            </button>
            <button
              onClick={this.handleResetApp}
              className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm transition-all"
            >
              تصفير الذاكرة المؤقتة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
