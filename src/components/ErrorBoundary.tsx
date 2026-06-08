import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (this as any).props.fallback || (
        <div className="p-4 border border-red-500/30 text-red-500 bg-red-500/10 text-xs font-mono rounded flex flex-col gap-2">
          <span>[SYS_ERR] COMPONENT_FAILED_TO_RENDER</span>
          <span className="opacity-70 whitespace-pre-wrap">{this.state.error?.message}</span>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
