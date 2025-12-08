import { useRobotsTester } from "@/hooks/use-robots-tester";
import { LightningIcon, RobotIcon, ShieldCheckIcon, TerminalWindowIcon } from "@phosphor-icons/react";
import { InputSection } from "./InputSection";
import { ResultsSection } from "./ResultsSection";

export function RobotsTester() {
	const state = useRobotsTester();

	return (
		<div className="selection-acid min-h-screen bg-[var(--background)] p-4 md:p-8 lg:p-12 overflow-x-hidden">
			<div className="mx-auto max-w-7xl relative">

				{/* Ambient Background Elements */}
				<div className="absolute -top-20 -right-20 w-96 h-96 bg-[var(--color-navy)] rounded-full mix-blend-screen filter blur-[128px] opacity-20 pointer-events-none animate-[pulse_8s_ease-in-out_infinite]" />
				<div className="absolute top-40 -left-20 w-64 h-64 bg-[var(--color-acid)] rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none" />

				{/* Header Section */}
				<header className="relative mb-10 md:mb-16 animate-slide-up">
					<div className="flex items-center gap-4 mb-6">
						<div className="h-px bg-white/20 flex-1 origin-left animate-reveal-line" />
						<div className="flex items-center gap-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
							<span className="w-2 h-2 rounded-full bg-[var(--color-acid)] animate-pulse" />
							VALIDATION ENGINE READY
						</div>
					</div>

					<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
						<div>
							<h1 className="text-4xl sm:text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter mb-4">
								ROBOTS<span className="text-[var(--color-acid)]">.</span>TXT
								<br />
								<span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-800">
									TESTER
								</span>
							</h1>
							<p className="font-mono text-zinc-400 max-w-lg text-sm sm:text-base md:text-lg border-l-2 border-[var(--color-acid)] pl-4 mt-6 md:mt-8">
								RFC 9309 compliant validation engine. Optimize your crawl budget.
							</p>
						</div>

						<div className="flex flex-col gap-3 md:gap-4 items-start md:items-end">
							<div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
								<ShieldCheckIcon className="size-5 text-[var(--color-acid)]" />
								<span className="font-mono text-sm text-zinc-300">Standard Compliant</span>
							</div>
							<div className="flex items-center gap-3 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
								<LightningIcon className="size-5 text-[var(--color-purple)]" />
								<span className="font-mono text-sm text-zinc-300">Real-time Analysis</span>
							</div>
						</div>
					</div>
				</header>

				{/* Main Interface */}
				<main className="grid gap-12 relative z-10">
					{/* Input Console */}
					<div className="animate-slide-up delay-100">
						<div className="mb-4 flex items-center gap-2 font-mono text-sm text-zinc-500">
							<TerminalWindowIcon className="size-4" />
							<span>INPUT_CONSOLE</span>
						</div>

						<InputSection
							robotsTxt={state.robotsTxt}
							urlList={state.urlList}
							selectedUserAgent={state.selectedUserAgent}
							customUserAgent={state.customUserAgent}
							isLoading={state.isLoading}
							inputError={state.inputError}
							onRobotsTxtChange={state.setRobotsTxt}
							onUrlListChange={state.setUrlList}
							onUserAgentChange={state.setSelectedUserAgent}
							onCustomUserAgentChange={state.setCustomUserAgent}
							onTest={state.testUrls}
							onClear={state.clearData}
						/>
					</div>

					{/* Results Terminal */}
					{state.results.length > 0 && (
						<div className="animate-slide-up delay-200">
							<div className="mb-4 flex items-center gap-2 font-mono text-sm text-zinc-500">
								<RobotIcon className="size-4" />
								<span>ANALYSIS_RESULTS</span>
							</div>
							<ResultsSection
								results={state.results}
								paginatedResults={state.paginatedResults}
								summary={state.summary}
								urlTree={state.urlTree}
								currentPage={state.currentPage}
								totalPages={state.totalPages}
								activeView={state.activeView}
								onPageChange={state.setCurrentPage}
								onViewChange={state.setActiveView}
							/>
						</div>
					)}
				</main>

				{/* Footer */}
				<footer className="mt-24 border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 animate-slide-up delay-300">
					<div className="flex items-center gap-4">
						<img src="/byte-light.png" alt="Byte" className="h-8 opacity-80 hover:opacity-100 transition-opacity" />
						<span className="text-zinc-600 font-mono text-sm">/</span>
						<span className="text-zinc-500 font-mono text-sm">ENGINEERED BY BYTE</span>
					</div>

					<div className="flex gap-8 font-mono text-xs text-zinc-600">
						<a
							href="https://www.npmjs.com/package/@trybyte/robotstxt-parser"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-[var(--color-acid)] transition-colors"
						>
							@trybyte/robotstxt-parser
						</a>
					</div>
				</footer>
			</div>
		</div>
	);
}
