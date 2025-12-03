import { BotIcon, ShieldCheckIcon } from "lucide-react";

import { useRobotsTester } from "@/hooks/use-robots-tester";

import { InputSection } from "./InputSection";
import { ResultsSection } from "./ResultsSection";

export function RobotsTester() {
	const state = useRobotsTester();

	return (
		<div className="dark noise-bg relative min-h-screen">
			<div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-8 p-4 md:p-8 lg:p-12 xl:px-16">
				{/* Header */}
				<header className="animate-fade-in-up relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 p-8 md:p-10">
					{/* Decorative elements */}
					<div className="absolute -top-20 -right-20 size-64 rounded-full bg-emerald-500/10 blur-3xl" />
					<div className="absolute -bottom-20 -left-20 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

					<div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex size-14 items-center justify-center rounded-xl border border-white/10 bg-white/5 shadow-lg backdrop-blur-sm">
								<BotIcon className="size-7 text-emerald-400" />
							</div>
							<div className="flex flex-col gap-1">
								<h1 className="text-2xl font-extrabold tracking-tight text-white md:text-3xl lg:text-4xl">
									robots.txt Tester
								</h1>
								<p className="text-sm text-zinc-400 md:text-base">
									Validate URLs against robots.txt rules for any user-agent
								</p>
							</div>
						</div>

						<div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
							<ShieldCheckIcon className="size-4" />
							<span className="font-medium">RFC 9309 Compliant</span>
						</div>
					</div>

					{/* Terminal-style prompt indicator */}
					<div className="mt-6 flex items-center gap-2 font-mono text-xs text-zinc-500">
						<span className="text-emerald-400">$</span>
						<span>robots-tester</span>
						<span className="animate-pulse text-emerald-400">_</span>
					</div>
				</header>

				{/* Input Section */}
				<div className="animate-fade-in-up animation-delay-100">
					<InputSection
						robotsTxt={state.robotsTxt}
						urlList={state.urlList}
						selectedUserAgent={state.selectedUserAgent}
						customUserAgent={state.customUserAgent}
						isLoading={state.isLoading}
						onRobotsTxtChange={state.setRobotsTxt}
						onUrlListChange={state.setUrlList}
						onUserAgentChange={state.setSelectedUserAgent}
						onCustomUserAgentChange={state.setCustomUserAgent}
						onTest={state.testUrls}
						onClear={state.clearData}
					/>
				</div>

				{/* Results Section */}
				{state.results.length > 0 && (
					<div>
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

				{/* Footer */}
				<footer className="mt-auto border-t border-white/5 pt-8 pb-4">
					<div className="flex flex-col items-center gap-3">
						<div className="flex items-center gap-2">
							<span className="text-sm font-semibold text-zinc-400">
								Brought to you by
							</span>
							<img src="byte-light.png" alt="Byte" className="h-6" />
						</div>
						<div className="mt-2 flex items-center gap-4 text-xs text-zinc-400">
							<span>Powered by <a href="https://github.com/trybyte-app/robotstxt-ts-port" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-zinc-300 transition-colors underline">robotstxt-parser</a></span>
							<span className="size-1 rounded-full bg-zinc-700" />
							<span>RFC 9309 Compliant</span>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
