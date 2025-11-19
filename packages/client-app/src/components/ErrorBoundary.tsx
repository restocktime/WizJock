import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public handleRetry = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                            <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
                        <p className="text-gray-600 mb-8">
                            We apologize for the inconvenience. Please try refreshing the page.
                        </p>

                        <button
                            onClick={this.handleRetry}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-light transition-colors w-full"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Refresh Page
                        </button>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mt-8 text-left">
                                <details className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-60">
                                    <summary className="text-sm font-medium text-gray-700 cursor-pointer mb-2">
                                        Error Details
                                    </summary>
                                    <pre className="text-xs text-red-600 whitespace-pre-wrap">
                                        {this.state.error.toString()}
                                    </pre>
                                </details>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
