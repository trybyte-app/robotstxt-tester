import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	state: State = { hasError: false, error: null };

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("ErrorBoundary caught:", error, info.componentStack);
	}

	handleReset = () => {
		this.setState({ hasError: false, error: null });
	};

	render() {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-zinc-950 p-4 text-white">
					<div className="flex flex-col items-center gap-2">
						<svg
							className="h-12 w-12 text-red-500"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
						<h1 className="text-xl font-semibold">Something went wrong</h1>
					</div>
					<p className="max-w-md text-center text-zinc-400">
						{this.state.error?.message || "An unexpected error occurred"}
					</p>
					<button
						onClick={this.handleReset}
						className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/20"
					>
						Try Again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}
